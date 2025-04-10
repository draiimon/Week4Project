import { users, type User, type InsertUser } from "@shared/schema";
import * as expressSession from "express-session";
import memorystore from "memorystore";
import { 
  getUserByUsername as awsGetUserByUsername, 
  createUser as awsCreateUser 
} from "./aws-db";

const MemoryStore = memorystore(expressSession.default);

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  sessionStore: expressSession.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: expressSession.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    // In AWS DynamoDB, we don't use numeric IDs
    console.log("AWS DynamoDB: getUser by ID not implemented");
    return undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    console.log(`Looking up user '${username}' in AWS DynamoDB`);
    const awsUser = await awsGetUserByUsername(username);
    
    if (awsUser) {
      // Convert AWS user to our app's User type
      return {
        id: 0, // AWS doesn't use numeric IDs
        username: awsUser.username,
        password: awsUser.password,
        email: awsUser.email || ''
      };
    }
    
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    console.log(`Creating user '${insertUser.username}' in AWS DynamoDB`);
    const awsUser = await awsCreateUser({
      username: insertUser.username,
      password: insertUser.password,
      email: insertUser.email || ''
    });
    
    if (!awsUser) {
      throw new Error('Failed to create user in AWS DynamoDB');
    }
    
    // Return a user object that matches our User type
    return {
      id: 0, // AWS doesn't use numeric IDs
      username: awsUser.username,
      password: '', // Password is already hashed in AWS
      email: awsUser.email || ''
    };
  }
}

export const storage = new DatabaseStorage();
