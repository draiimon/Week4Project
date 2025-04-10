import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { 
  DynamoDBDocumentClient, 
  GetCommand, 
  PutCommand, 
  QueryCommand,
  ScanCommand,
  DeleteCommand 
} from "@aws-sdk/lib-dynamodb";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { envVars, logAwsConfig } from './env';

// Table name for users
const USER_TABLE = "OakTreeUsers";
const scryptAsync = promisify(scrypt);

// Check if AWS is properly configured
export function isAWSConfigured(): boolean {
  return logAwsConfig();
}

// Initialize DynamoDB client with error handling
let dynamoClient: DynamoDBDocumentClient | null = null;

function getDynamoClient(): DynamoDBDocumentClient | null {
  if (dynamoClient) return dynamoClient;
  
  // Check if AWS calls are disabled to save AWS credits
  if (envVars.DISABLE_AWS_CALLS) {
    console.log("AWS calls are disabled to save AWS credits. DynamoDB integration will be unavailable.");
    return null;
  }
  
  if (!isAWSConfigured()) {
    console.log("AWS credentials not found. DynamoDB integration will be unavailable.");
    return null;
  }
  
  try {
    console.log(`Initializing DynamoDB client with region: ${envVars.AWS_REGION}`);
    const client = new DynamoDBClient({
      region: envVars.AWS_REGION,
      credentials: {
        accessKeyId: envVars.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: envVars.AWS_SECRET_ACCESS_KEY || ""
      }
    });
    
    dynamoClient = DynamoDBDocumentClient.from(client);
    console.log("AWS DynamoDB client initialized successfully");
    return dynamoClient;
  } catch (error) {
    console.error("Failed to initialize AWS DynamoDB client:", error);
    return null;
  }
}

// Password handling functions
async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Create/check table for user management
export async function createUsersTable(): Promise<boolean> {
  console.log("Checking/setting up DynamoDB table for users...");
  
  const client = getDynamoClient();
  if (!client) {
    console.log("Skipping DynamoDB table setup because AWS is not configured.");
    return false;
  }
  
  try {
    // First, let's check if the table exists
    try {
      const command = new ScanCommand({
        TableName: USER_TABLE,
        Limit: 1
      });
      
      await client.send(command);
      console.log(`DynamoDB table '${USER_TABLE}' is ready for use.`);
      return true;
    } catch (error: any) {
      // If table doesn't exist, we'll create it
      if (error.name === "ResourceNotFoundException" || 
          (error.__type && error.__type.includes("ResourceNotFoundException"))) {
        console.log(`DynamoDB table '${USER_TABLE}' does not exist. Creating it now...`);
        
        // We need to import the CreateTableCommand from the DynamoDB client
        const { CreateTableCommand } = await import("@aws-sdk/client-dynamodb");
        
        try {
          // This command will create a new table with username as the primary key
          const createTableCommand = new CreateTableCommand({
            TableName: USER_TABLE,
            AttributeDefinitions: [
              {
                AttributeName: "username",
                AttributeType: "S" // String type
              }
            ],
            KeySchema: [
              {
                AttributeName: "username",
                KeyType: "HASH" // Partition key
              }
            ],
            BillingMode: "PAY_PER_REQUEST" // On-demand capacity mode (no need to specify provisioned capacity)
          });
          
          // Send the command to create the table
          const dbClient = new DynamoDBClient({
            region: envVars.AWS_REGION,
            credentials: {
              accessKeyId: envVars.AWS_ACCESS_KEY_ID || "",
              secretAccessKey: envVars.AWS_SECRET_ACCESS_KEY || ""
            }
          });
          
          try {
            await dbClient.send(createTableCommand);
            console.log(`DynamoDB table '${USER_TABLE}' created successfully.`);
            
            // Wait a few seconds for the table to be active
            console.log("Waiting for table to be active...");
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            return true;
          } catch (tableError: any) {
            // Handle the case where the table is already being created or exists
            if (tableError.name === "ResourceInUseException" || 
                (tableError.message && tableError.message.includes("being created")) ||
                (tableError.message && tableError.message.includes("already exists"))) {
              console.log("Table is already being created or already exists. Waiting for it to be active...");
              await new Promise(resolve => setTimeout(resolve, 5000));
              return true;
            }
            throw tableError;
          }
        } catch (createError: any) {
          console.error("Error creating DynamoDB table:", createError?.message || createError);
          return false;
        }
      }
      
      // For other errors, log but don't crash
      console.log("Error accessing DynamoDB table, using local authentication:", error.message || error);
      return false;
    }
  } catch (error) {
    console.log("Error setting up DynamoDB table, using local authentication only:", error);
    return false;
  }
}

// Get user by username
export async function getUserByUsername(username: string) {
  const client = getDynamoClient();
  if (!client) return null;
  
  try {
    // Query for a user by username
    const command = new QueryCommand({
      TableName: USER_TABLE,
      KeyConditionExpression: "username = :username",
      ExpressionAttributeValues: {
        ":username": username,
      },
    });

    const response = await client.send(command);
    
    if (response.Items && response.Items.length > 0) {
      return response.Items[0];
    }
    
    return null;
  } catch (error) {
    console.error("Error getting user from DynamoDB:", error);
    return null;
  }
}

// Create a new user
export async function createUser(user: { username: string, password: string, email: string }) {
  const client = getDynamoClient();
  if (!client) {
    console.log("AWS DynamoDB is not available. Skipping AWS user creation.");
    return null; // Return null to indicate we couldn't create in AWS
  }
  
  try {
    // Hash the password before storing
    const hashedPassword = await hashPassword(user.password);
    
    try {
      const command = new PutCommand({
        TableName: USER_TABLE,
        Item: {
          username: user.username,
          password: hashedPassword,
          email: user.email,
          createdAt: new Date().toISOString()
        },
        // Only add if username doesn't already exist
        ConditionExpression: "attribute_not_exists(username)"
      });
  
      await client.send(command);
      
      console.log(`User '${user.username}' successfully created in AWS DynamoDB`);
      return {
        username: user.username,
        email: user.email
      };
    } catch (error: any) {
      // Check for ResourceNotFoundException or table doesn't exist
      if (error.name === "ResourceNotFoundException" || 
          (error.__type && error.__type.includes("ResourceNotFoundException"))) {
        console.log(`Cannot create user in DynamoDB - table '${USER_TABLE}' does not exist.`);
        return null;
      }
      
      // For conditional check failure (username exists)
      if (error.name === "ConditionalCheckFailedException" || 
          (error.__type && error.__type.includes("ConditionalCheckFailedException"))) {
        console.log(`User '${user.username}' already exists in DynamoDB.`);
        return null;
      }
      
      // Other errors
      console.log("Error creating user in DynamoDB:", error.message || error);
      return null;
    }
  } catch (error) {
    console.log("Unexpected error creating user in AWS DynamoDB:", error);
    return null;
  }
}

// Get user by ID
export async function getUserById(id: number) {
  const client = getDynamoClient();
  if (!client) return null;
  
  try {
    console.log(`Looking up user with ID ${id} in AWS DynamoDB`);
    
    // DynamoDB doesn't support querying by non-primary key without a GSI (Global Secondary Index)
    // We can scan the table and filter by ID, but this is inefficient for large datasets
    // In a production environment, we would create a GSI for the id field
    
    const command = new ScanCommand({
      TableName: USER_TABLE,
      FilterExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id
      }
    });
    
    const response = await client.send(command);
    
    if (response.Items && response.Items.length > 0) {
      return response.Items[0];
    }
    
    return null;
  } catch (error) {
    console.error("Error getting user by ID from AWS DynamoDB:", error);
    return null;
  }
}

// Authenticate a user
export async function authenticateUser(username: string, password: string) {
  const client = getDynamoClient();
  if (!client) {
    console.log("AWS DynamoDB is not available for authentication.");
    return null;
  }
  
  try {
    const user = await getUserByUsername(username);
    
    if (!user || !(await comparePasswords(password, user.password))) {
      return null;
    }
    
    console.log("AWS DynamoDB authentication successful");
    
    return {
      id: user.id || 0, // Use 0 as default for local DB compatibility
      username: user.username,
      email: user.email
    };
  } catch (error) {
    console.error("Error authenticating user with DynamoDB:", error);
    return null;
  }
}