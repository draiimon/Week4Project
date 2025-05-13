// src/server/db.ts
import dotenv from "dotenv";
dotenv.config();                             // ← load AWS_*, DYNAMO_TABLE_NAME, SESSION_SECRET

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Set default values for testing
process.env.AWS_REGION = process.env.AWS_REGION || "ap-southeast-1";
process.env.DYNAMO_TABLE_NAME = process.env.DYNAMO_TABLE_NAME || "OakTreeUsers";

// Initialize DynamoDB client
let rawClient: DynamoDBClient;
try {
  rawClient = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "test",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "test"
    }
  });
  console.log("DynamoDB client initialized");
} catch (error) {
  console.error("Error initializing DynamoDB client:", error);
  // Create a mock client for testing
  rawClient = new DynamoDBClient({
    region: "local",
    endpoint: "http://localhost:8000",
    credentials: {
      accessKeyId: "test",
      secretAccessKey: "test"
    }
  });
}

// Document client handles marshalling for you
export const ddb = DynamoDBDocumentClient.from(rawClient);
export const USERS_TABLE = process.env.DYNAMO_TABLE_NAME;
