import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { isAWSConfigured, createUsersTable } from './aws-db';
import { envVars } from './env';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import * as os from 'os';

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // put application routes here
  // prefix all routes with /api

  // Admin endpoint to toggle AWS calls
  app.post("/api/admin/toggle-aws", async (req, res) => {
    const { disable } = req.body;
    const username = (req.user as any)?.username;
    
    if (username === 'msn_clx') { // Only allow the admin to toggle this
      console.log(`Admin user ${username} setting DISABLE_AWS_CALLS to: ${disable}`);
      
      // Update the environment variable
      process.env.DISABLE_AWS_CALLS = disable ? 'true' : 'false';
      
      // Also update the envVars object to ensure it's reflected immediately
      envVars.DISABLE_AWS_CALLS = disable;
      
      console.log(`AWS calls are now ${disable ? 'disabled' : 'enabled'}`);
      
      res.json({ success: true, awsCallsDisabled: disable });
    } else {
      console.log(`Unauthorized toggle attempt by user: ${username || 'unknown'}`);
      res.status(403).json({ success: false, message: 'Unauthorized' });
    }
  });

  // AWS status endpoint - reports current AWS configuration status with real data
  app.get("/api/aws/status", async (_req, res) => {
    const awsConfigured = await isAWSConfigured();
    
    // Get real timestamp
    const timestamp = new Date().toISOString();
    
    res.json({
      status: envVars.DISABLE_AWS_CALLS ? "disabled_to_save_credits" : (awsConfigured ? "connected" : "not_connected"),
      region: envVars.AWS_REGION,
      services: {
        dynamodb: {
          enabled: !envVars.DISABLE_AWS_CALLS,
          tableName: "OakTreeUsers"
        },
        cognito: {
          enabled: false,
          userPoolId: null
        }
      },
      environment: process.env.NODE_ENV || "development",
      timestamp: timestamp,
      awsCallsDisabled: envVars.DISABLE_AWS_CALLS
    });
  });

  // AWS resources endpoint - simplified to only show DynamoDB
  app.get("/api/aws/resources", async (_req, res) => {
    const awsConfigured = await isAWSConfigured();
    
    // Only show active if really connected to AWS
    const dbStatus = awsConfigured ? "active" : "inactive";
    
    res.json({
      databases: [
        {
          type: "dynamodb",
          name: "OakTreeUsers",
          status: dbStatus
        }
      ],
      lastUpdated: new Date().toISOString()
    });
  });

  // Health check for the API
  app.get("/api/healthcheck", (_req, res) => {
    res.status(200).json({ 
      status: "ok",
      message: "API is running",
      timestamp: new Date().toISOString()
    });
  });

  // Endpoint to fetch all users from DynamoDB - ADMIN ONLY
  app.get("/api/dynamodb/users", async (req, res) => {
    // Debug session information
    console.log("Session user:", req.user ? 
      { username: (req.user as any).username, id: (req.user as any).id } : 
      "No user in session");
      
    // Check if user is logged in and is admin
    if (!req.user) {
      return res.status(403).json({
        error: "Unauthorized. Please log in first."
      });
    }
    
    if ((req.user as any).username !== 'msn_clx') {
      console.log(`User ${(req.user as any).username} attempted to access admin-only endpoint`);
      return res.status(403).json({
        error: "Unauthorized. Admin access required."
      });
    }
    
    // Check if AWS calls are disabled
    if (envVars.DISABLE_AWS_CALLS) {
      return res.status(503).json({
        error: "AWS DynamoDB is currently disabled by admin",
        awsDisabled: true
      });
    }

    const awsConfigured = await isAWSConfigured();
    if (!awsConfigured) {
      return res.status(503).json({
        error: "AWS DynamoDB is not properly configured"
      });
    }

    try {
      // Initialize DynamoDB client
      const client = new DynamoDBClient({
        region: envVars.AWS_REGION,
        credentials: {
          accessKeyId: envVars.AWS_ACCESS_KEY_ID || "",
          secretAccessKey: envVars.AWS_SECRET_ACCESS_KEY || ""
        }
      });
      const docClient = DynamoDBDocumentClient.from(client);

      // Ensure table exists
      await createUsersTable();

      // Scan command to get all users from DynamoDB
      const command = new ScanCommand({
        TableName: "OakTreeUsers",
        // Protect sensitive data
        ProjectionExpression: "username, email, createdAt",
      });

      const response = await docClient.send(command);
      
      // Return items with count and size statistics
      res.json({
        tableName: "OakTreeUsers",
        region: envVars.AWS_REGION,
        itemCount: response.Items?.length || 0,
        items: response.Items || [],
        sizeBytes: JSON.stringify(response.Items || []).length,
        scannedCount: response.ScannedCount || 0,
        lastUpdated: new Date().toISOString()
      });
    } catch (err) {
      const error = err as Error;
      console.error("Error fetching users from DynamoDB:", error);
      res.status(500).json({
        error: "Failed to retrieve users from DynamoDB",
        message: error.message
      });
    }
  });

  // Delete a user from DynamoDB - ADMIN ONLY
  app.delete("/api/dynamodb/users/:username", async (req, res) => {
    // Check if user is logged in and is admin
    if (!req.user) {
      return res.status(403).json({
        error: "Unauthorized. Please log in first."
      });
    }
    
    if ((req.user as any).username !== 'msn_clx') {
      console.log(`User ${(req.user as any).username} attempted to access admin-only endpoint`);
      return res.status(403).json({
        error: "Unauthorized. Admin access required."
      });
    }
    
    // Get username from URL params
    const { username } = req.params;
    
    // Don't allow deleting the admin user
    if (username === 'msn_clx') {
      return res.status(400).json({
        error: "Cannot delete the admin user"
      });
    }
    
    // Check if AWS calls are disabled
    if (envVars.DISABLE_AWS_CALLS) {
      return res.status(503).json({
        error: "AWS DynamoDB is currently disabled by admin. Enable it first to delete users.",
        awsDisabled: true
      });
    }
    
    // Make sure AWS is configured
    const awsConfigured = await isAWSConfigured();
    if (!awsConfigured) {
      return res.status(503).json({
        error: "AWS DynamoDB is not properly configured"
      });
    }
    
    try {
      // Import deleteUser function from aws-db
      const { deleteUser } = await import('./aws-db');
      
      // Attempt to delete the user
      const success = await deleteUser(username);
      
      if (success) {
        console.log(`Admin successfully deleted user '${username}' from DynamoDB`);
        return res.status(200).json({
          message: `User '${username}' successfully deleted from DynamoDB`,
          username
        });
      } else {
        console.log(`Failed to delete user '${username}' from DynamoDB - user may not exist`);
        return res.status(404).json({
          error: `Failed to delete user '${username}'. User may not exist.`
        });
      }
    } catch (err) {
      const error = err as Error;
      console.error(`Error deleting user '${username}' from DynamoDB:`, error);
      res.status(500).json({
        error: `Failed to delete user '${username}'`,
        message: error.message
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}