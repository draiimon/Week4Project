// src/server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import expressSession from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { Express } from "express";

import { storage } from "./storage";

declare global {
  namespace Express {
    interface User {
      username: string;
      email?: string;
      password: string;
      createdAt: string;
    }
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hash, salt] = stored.split(".");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(Buffer.from(hash, "hex"), suppliedBuf);
}

export function setupAuth(app: Express) {
  app.use(expressSession({
    secret:   process.env.SESSION_SECRET!,
    resave:   false,
    saveUninitialized: false,
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      // Try local storage only (DynamoDB under the hood)
      const user = await storage.getUserByUsername(username);
      if (!user || !(await comparePasswords(password, user.password))) {
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  passport.serializeUser((user: Express.User, done) => done(null, user.username));
  passport.deserializeUser(async (username: string, done) => {
    const user = await storage.getUserByUsername(username);
    done(null, user);
  });

  // Registration endpoint
  app.post("/api/register", async (req, res, next) => {
    try {
      if (await storage.getUserByUsername(req.body.username)) {
        return res.status(400).send("Username already exists");
      }
      const hashed = await hashPassword(req.body.password);
      const user = await storage.createUser({
        username: req.body.username,
        password: hashed,
        email:    req.body.email
      });
      req.login(user, err => err ? next(err) : res.status(201).json(user));
    } catch (err: any) {
      next(err);
    }
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.json(req.user);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout(err => err ? next(err) : res.sendStatus(200));
  });

  app.get("/api/user", (req, res) =>
    req.isAuthenticated() ? res.json(req.user) : res.sendStatus(401)
  );
}
