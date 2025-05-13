// src/server/storage.ts
import {
  GetCommand,
  PutCommand,
  QueryCommand
} from "@aws-sdk/lib-dynamodb";
import { ddb, USERS_TABLE } from "./db";

export interface User {
  username: string;
  email?: string;
  password: string;
  createdAt: string;
}

export interface IStorage {
  getUserByUsername(username: string): Promise<User | null>;
  createUser(u: { username: string; password: string; email?: string }): Promise<User>;
  // you can add getUserById() if you need, but DynamoDB uses username as the PK
}

export class DynamoStorage implements IStorage {
  async getUserByUsername(username: string): Promise<User | null> {
    const cmd = new QueryCommand({
      TableName: USERS_TABLE,
      KeyConditionExpression: "username = :u",
      ExpressionAttributeValues: { ":u": username },
      Limit: 1
    });
    const res = await ddb.send(cmd);
    return res.Items && res.Items[0] ? (res.Items[0] as User) : null;
  }

  async createUser(u: { username: string; password: string; email?: string }): Promise<User> {
    const now = new Date().toISOString();
    const item: User = { ...u, createdAt: now };
    const cmd = new PutCommand({
      TableName: USERS_TABLE,
      Item: item,
      ConditionExpression: "attribute_not_exists(username)"
    });
    await ddb.send(cmd);
    return item;
  }
}

export const storage = new DynamoStorage();
