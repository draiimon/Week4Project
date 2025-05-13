import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import expressSession from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import * as awsDb from "./aws-db";
import { envVars } from "./env";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

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

export function setupAuth(app: Express) {
  const sessionSettings: expressSession.SessionOptions = {
    secret: process.env.SESSION_SECRET || "oaktree-dev-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
  };

  app.set("trust proxy", 1);
  app.use(expressSession(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Check if AWS is configured and set up table
  awsDb.createUsersTable().then(tableAvailable => {
    if (tableAvailable) {
      console.log("AWS DynamoDB integration is ready for use");
    } else {
      console.log("AWS DynamoDB table is not available, using local authentication only");
    }
  }).catch(err => {
    console.log("Error checking DynamoDB table, using local authentication only:", err.message || err);
  });

  // Using local auth strategy with AWS DynamoDB integration
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Define admin username for special handling
        const ADMIN_USERNAME = 'msn_clx';
        
        // Special handling for admin user - always allowed to login locally
        if (username === ADMIN_USERNAME) {
          console.log(`Admin user '${username}' attempting login (bypassing AWS check)`);
          const adminUser = await storage.getUserByUsername(username);
          if (adminUser && await comparePasswords(password, adminUser.password)) {
            console.log(`Admin user '${username}' authenticated successfully via local database`);
            return done(null, adminUser);
          }
        }
        
        // Check if AWS calls are disabled
        if (envVars.DISABLE_AWS_CALLS) {
          console.log("AWS calls are disabled. Skipping AWS authentication and registration.");
          
          // For non-admin users, we might want to reject when AWS is disabled
          if (username !== ADMIN_USERNAME) {
            console.log(`User '${username}' login rejected - AWS is disabled`);
            return done(null, false, { message: 'Authentication is currently disabled by admin.' });
          }
        }
        
        const isAWSConfigured = await awsDb.isAWSConfigured();
        
        // First try to authenticate with AWS DynamoDB if configured and enabled
        if (isAWSConfigured && !envVars.DISABLE_AWS_CALLS) {
          try {
            console.log(`Looking up user '${username}' in AWS DynamoDB`);
            const awsUser = await awsDb.authenticateUser(username, password);
            
            if (awsUser) {
              // Check if user exists in local DB
              let user = await storage.getUserByUsername(username);
              
              // If not, create the user in our database to maintain session
              if (!user) {
                user = await storage.createUser({
                  username: username,
                  password: await hashPassword(password), // Store hashed password locally
                  email: awsUser.email || `${username}@example.com`,
                });
              }
              
              console.log("AWS DynamoDB authentication successful");
              return done(null, user);
            } else {
              console.log(`User '${username}' not found in DynamoDB or password incorrect`);
            }
          } catch (awsError) {
            console.log("AWS DynamoDB auth failed, falling back to local:", awsError);
          }
        }
        
        // Local authentication fallback
        console.log(`Trying local authentication for user '${username}'`);
        const user = await storage.getUserByUsername(username);
        if (!user) {
          console.log(`User '${username}' not found in local database`);
          return done(null, false);
        }
        
        if (!(await comparePasswords(password, user.password))) {
          console.log(`Password incorrect for user '${username}' in local database`);
          return done(null, false);
        } else {
          console.log(`Local authentication successful for user '${username}'`);
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    // For DynamoDB users, we'll store username instead of ID
    done(null, { id: user.id, username: user.username });
  });
  
  passport.deserializeUser(async (serialized: { id: number, username: string }, done) => {
    try {
      // Handle both string and object formats for backward compatibility
      const id = typeof serialized === 'object' ? serialized.id : serialized;
      const username = typeof serialized === 'object' ? serialized.username : null;
      
      let user = null;
      
      // First try to get by username if available (for DynamoDB users)
      if (username) {
        user = await storage.getUserByUsername(username);
        if (user) {
          return done(null, user);
        }
      }
      
      // Fallback to ID lookup (for local DB users)
      if (id) {
        user = await storage.getUser(id);
        if (user) {
          return done(null, user);
        }
      }
      
      // If we reach here, we couldn't find the user
      console.log(`User not found during deserialization. ID: ${id}, Username: ${username}`);
      return done(null, false);
    } catch (error) {
      console.error('Error deserializing user:', error);
      return done(null, false);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const { username, password, email } = req.body;
      const ADMIN_USERNAME = 'msn_clx';
      
      // Prevent registration when AWS is disabled (except for the admin)
      if (envVars.DISABLE_AWS_CALLS && username !== ADMIN_USERNAME) {
        console.log(`Registration rejected for '${username}' - AWS calls are disabled by admin`);
        return res.status(403).json({
          error: "Registration is currently disabled by admin. Please try again later when AWS features are enabled."
        });
      }
      
      // Check if user already exists in local DB
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).send("Username already exists");
      }

      let awsUserCreated = false;
      
      // Try to register with AWS DynamoDB if configured and not disabled
      if (await awsDb.isAWSConfigured() && !envVars.DISABLE_AWS_CALLS) {
        try {
          const awsUser = await awsDb.createUser({
            username,
            password,
            email: email || ""
          });
          
          if (awsUser) {
            console.log(`User '${username}' registered in AWS DynamoDB successfully`);
            awsUserCreated = true;
          } else {
            console.log(`AWS registration skipped for '${username}' - table may not exist`);
          }
        } catch (awsError: any) {
          if (awsError.name === "ConditionalCheckFailedException" || 
              (awsError.__type && awsError.__type.includes("ConditionalCheckFailedException"))) {
            console.log(`AWS registration failed - username '${username}' already exists in DynamoDB`);
          } else {
            console.log(`Error registering '${username}' with AWS DynamoDB:`, awsError?.message || awsError);
          }
          // Continue with local registration if AWS fails
        }
      } else if (envVars.DISABLE_AWS_CALLS) {
        console.log(`AWS registration skipped for '${username}' - AWS calls are disabled`);
      }

      // For local session user - first try to get the user
      let user;
      try {
        // First check if the user exists locally
        user = await storage.getUserByUsername(req.body.username);
        
        // If not found, create a local entry for session management
        if (!user) {
          user = await storage.createUser({
            ...req.body,
            password: await hashPassword(req.body.password),
          });
        }
      } catch (localError) {
        console.error("Error with local user registration:", localError);
        return res.status(500).send("Error creating user in local database");
      }

      // Add a message noting where the user was registered
      const registrationMessage = awsUserCreated
        ? "User registered successfully in both AWS DynamoDB and local database"
        : "User registered in local database";
      
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json({
          ...user,
          message: registrationMessage
        });
      });
    } catch (error: any) {
      console.error("Registration error:", error?.message || error);
      res.status(500).send("Error creating user: " + (error?.message || "Unknown error"));
    }
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });

  app.get("/api/aws-status", async (req, res) => {
    const isAWSConfigured = await awsDb.isAWSConfigured();
    
    res.json({
      isConfigured: isAWSConfigured,
      region: process.env.AWS_REGION,
      integration: "DynamoDB",
      features: ["User Authentication", "Data Storage"]
    });
  });
}
