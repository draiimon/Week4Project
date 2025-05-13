import { users, type User, type InsertUser } from "@shared/schema";
import * as expressSession from "express-session";
import memorystore from "memorystore";
import { 
  getUserByUsername as awsGetUserByUsername, 
  getUserById as awsGetUserById,
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
  // In-memory users map to handle local accounts like admin
  private localUsers: Map<string, User>;
  private localUserIdCounter: number;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    this.localUsers = new Map<string, User>();
    this.localUserIdCounter = 1;
    
    // Automatically create admin user
    this.setupAdminUser();
  }
  
  // Create the admin user on startup
  private async setupAdminUser() {
    const adminUsername = 'msn_clx';
    const adminPassword = 'd4e9fe71173f4352b2a051b6cdd910293ef157957f773d056ab953a4f02c21ae1ea308de5c1ebe4202585a0d2606874c15e2cfb1556b9714f7a59198a809732f.3192ebfb2a1152516ce65bb644b0baba'; // Newly generated hash for Mason@0905
    
    if (!this.localUsers.has(adminUsername)) {
      this.localUsers.set(adminUsername, {
        id: this.localUserIdCounter++,
        username: adminUsername,
        password: adminPassword,
        email: 'admin@example.com'
      });
      console.log('Admin user created successfully in local storage');
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    // First check in local users
    const localUsers = Array.from(this.localUsers.values());
    for (const user of localUsers) {
      if (user.id === id) {
        return user;
      }
    }
    
    // If not in local users, try AWS DynamoDB
    try {
      const awsUser = await awsGetUserById(id);
      
      if (awsUser) {
        // Convert AWS user to our app's User type
        return {
          id: id,
          username: awsUser.username,
          password: awsUser.password,
          email: awsUser.email || ''
        };
      }
    } catch (error) {
      console.log(`Error fetching user by ID from AWS: ${error}`);
    }
    
    // If not found anywhere, return undefined
    return undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // First check in local users
    if (this.localUsers.has(username)) {
      return this.localUsers.get(username);
    }
    
    // If not in local users, try AWS DynamoDB
    try {
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
    } catch (error) {
      console.log(`Error fetching user '${username}' from AWS: ${error}`);
    }
    
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // For admin user, store locally
    if (insertUser.username === 'msn_clx') {
      const existingUser = this.localUsers.get(insertUser.username);
      if (existingUser) {
        return existingUser;
      }
      
      const newUser: User = {
        id: this.localUserIdCounter++,
        username: insertUser.username,
        password: insertUser.password, // Should already be hashed
        email: insertUser.email || 'admin@example.com'
      };
      
      this.localUsers.set(insertUser.username, newUser);
      console.log(`Admin user '${insertUser.username}' created in local storage`);
      return newUser;
    }
    
    // For other users, use AWS
    try {
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
    } catch (error) {
      console.log(`Error creating user in AWS: ${error}`);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();
