import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // put application routes here
  // prefix all routes with /api

  // Any additional API endpoints would go here

  const httpServer = createServer(app);

  return httpServer;
}
