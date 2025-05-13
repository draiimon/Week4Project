// src/server/db.ts
import dotenv from "dotenv";
dotenv.config();                             // ← load AWS_*, DYNAMO_TABLE_NAME, SESSION_SECRET

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

if (!process.env.AWS_REGION) {
  throw new Error("AWS_REGION must be set");
}
if (!process.env.DYNAMO_TABLE_NAME) {
  throw new Error("DYNAMO_TABLE_NAME must be set");
}

const rawClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId:     process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

// Document client handles marshalling for you
export const ddb = DynamoDBDocumentClient.from(rawClient);
export const USERS_TABLE = process.env.DYNAMO_TABLE_NAME;
