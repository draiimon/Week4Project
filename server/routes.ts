import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { isAWSConfigured } from './aws-db';
import { envVars } from './env';

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // put application routes here
  // prefix all routes with /api

  // AWS status endpoint - reports current AWS configuration status
  app.get("/api/aws/status", async (_req, res) => {
    const awsConfigured = await isAWSConfigured();
    
    res.json({
      status: awsConfigured ? "connected" : "not_connected",
      region: envVars.AWS_REGION,
      services: {
        dynamodb: {
          enabled: true,
          tableName: "OakTreeUsers"
        },
        cognito: {
          enabled: false,
          userPoolId: null
        }
      },
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString()
    });
  });

  // AWS resources endpoint - lists available AWS resources
  app.get("/api/aws/resources", async (_req, res) => {
    res.json({
      vpc: {
        id: "vpc-08c05f6fe25301574",
        region: "us-east-1"
      },
      databases: [
        {
          type: "dynamodb",
          name: "OakTreeUsers",
          status: "active"
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

  const httpServer = createServer(app);

  return httpServer;
}
