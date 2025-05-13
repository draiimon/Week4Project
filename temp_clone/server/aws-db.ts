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

// Table name for users
const USER_TABLE = "OakTreeUsers";
const scryptAsync = promisify(scrypt);

// Check if AWS is properly configured
export function isAWSConfigured(): boolean {
  return !!(
    process.env.AWS_ACCESS_KEY_ID && 
    process.env.AWS_SECRET_ACCESS_KEY && 
    process.env.AWS_REGION
  );
}

// Initialize DynamoDB client with error handling
let dynamoClient: DynamoDBDocumentClient | null = null;

function getDynamoClient(): DynamoDBDocumentClient | null {
  if (dynamoClient) return dynamoClient;
  
  if (!isAWSConfigured()) {
    console.log("AWS credentials not found. DynamoDB integration will be unavailable.");
    return null;
  }
  
  try {
    const client = new DynamoDBClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
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
    // This would typically use the DynamoDB client directly with CreateTableCommand
    // This is a simplified version for demo purposes
    
    // For now, we'll just check if we can query the table and silently handle the error
    try {
      const command = new ScanCommand({
        TableName: USER_TABLE,
        Limit: 1
      });
      
      await client.send(command);
      console.log(`DynamoDB table '${USER_TABLE}' is ready for use.`);
      return true;
    } catch (error: any) {
      if (error.name === "ResourceNotFoundException" || 
          (error.__type && error.__type.includes("ResourceNotFoundException"))) {
        console.log(`DynamoDB table '${USER_TABLE}' does not exist. Using local authentication only.`);
        // In a production environment, we would create the table here 
        // but for this demo we'll just use local authentication
        return false;
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
    
    return {
      username: user.username,
      email: user.email
    };
  } catch (error) {
    console.error("Error authenticating user with DynamoDB:", error);
    return null;
  }
}