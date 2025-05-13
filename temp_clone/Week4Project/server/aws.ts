import { 
  CognitoIdentityProviderClient, 
  SignUpCommand, 
  InitiateAuthCommand, 
  AdminConfirmSignUpCommand,
  AdminInitiateAuthCommand,
  AdminRespondToAuthChallengeCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  AuthFlowType 
} from "@aws-sdk/client-cognito-identity-provider";

// AWS SDK Configuration
const region = process.env.AWS_REGION;
const clientId = process.env.AWS_COGNITO_CLIENT_ID || "default-client-id";
const userPoolId = process.env.AWS_COGNITO_USER_POOL_ID || "default-user-pool-id";

// Create Cognito Service Client
const cognitoClient = new CognitoIdentityProviderClient({ 
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
  }
});

/**
 * Registers a new user in Cognito User Pool
 */
export async function registerUser(username: string, password: string, email: string) {
  try {
    const command = new SignUpCommand({
      ClientId: clientId,
      Username: username,
      Password: password,
      UserAttributes: [
        {
          Name: 'email',
          Value: email
        }
      ]
    });

    const response = await cognitoClient.send(command);
    
    // Auto-confirm user for development purposes
    // In production, this would typically require email verification
    try {
      const confirmCommand = new AdminConfirmSignUpCommand({
        UserPoolId: userPoolId,
        Username: username
      });
      await cognitoClient.send(confirmCommand);
    } catch (confirmError) {
      console.error("Error confirming user:", confirmError);
    }
    
    return {
      username,
      email,
      userSub: response.UserSub
    };
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

/**
 * Authenticates a user using Cognito
 */
export async function authenticateUser(username: string, password: string) {
  try {
    const command = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: clientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password
      }
    });

    const response = await cognitoClient.send(command);
    return {
      username,
      accessToken: response.AuthenticationResult?.AccessToken,
      refreshToken: response.AuthenticationResult?.RefreshToken,
      idToken: response.AuthenticationResult?.IdToken,
      expiresIn: response.AuthenticationResult?.ExpiresIn
    };
  } catch (error) {
    console.error("Error authenticating user:", error);
    throw error;
  }
}

/**
 * Get user attributes from Cognito
 */
export async function getUserAttributes(username: string) {
  try {
    // For demonstration - in a real app, you would use the access token 
    // to get user attributes via the GetUserCommand
    
    // Manually authenticate as admin to get user info
    const authCommand = new AdminInitiateAuthCommand({
      UserPoolId: userPoolId,
      ClientId: clientId,
      AuthFlow: AuthFlowType.ADMIN_NO_SRP_AUTH,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: "placeholder" // Not used in this flow
      }
    });
    
    // For now just return basic info
    return {
      username,
      email: `${username}@example.com`, // This would come from actual user attributes
    };
  } catch (error) {
    console.error("Error getting user attributes:", error);
    throw error;
  }
}