// Local environment server startup script
// This file provides a compatibility layer for running the application locally
// without relying on Replit-specific features

const express = require('express');
const { createServer } = require('http');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Initialize Express app and HTTP server
const app = express();
const server = createServer(app);

// Handle body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log startup information
console.log("Starting OakTree DevOps Platform in local mode");
console.log("AWS Configuration:");
console.log(`- Region: ${process.env.AWS_REGION || 'Not configured'}`);
console.log(`- AWS Mode: ${process.env.USE_AWS_DB === 'true' ? 'Enabled' : 'Disabled'}`);

// Serve static assets if available
const distPath = path.resolve(__dirname, '../dist/public');
if (fs.existsSync(distPath)) {
  console.log(`Serving static files from: ${distPath}`);
  app.use(express.static(distPath));
}

// Simple route to test AWS connectivity
app.get('/api/aws-status', async (req, res) => {
  try {
    const AWS = require('@aws-sdk/client-dynamodb');
    const { DynamoDBClient, ListTablesCommand } = AWS;
    
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      return res.status(400).json({ 
        status: 'not_connected',
        message: 'AWS credentials not found in environment' 
      });
    }
    
    const client = new DynamoDBClient({ 
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });
    
    const response = await client.send(new ListTablesCommand({}));
    
    return res.json({
      status: 'connected',
      region: process.env.AWS_REGION || 'us-east-1',
      tables: response.TableNames,
      environment: 'local',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AWS connectivity test failed:', error);
    return res.status(500).json({ 
      status: 'error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Setup the auth system
try {
  const { setupAuth } = require('./auth');
  setupAuth(app);
  console.log("Authentication system initialized successfully");
} catch (error) {
  console.error("Failed to initialize authentication system:", error);
}

// Register API routes
try {
  const { registerRoutes } = require('./routes');
  registerRoutes(app, server).then(() => {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server is running successfully on http://localhost:${PORT}`);
      console.log(`Access the application at: http://localhost:${PORT}`);
    });
  }).catch(err => {
    console.error('Failed to register routes:', err);
    process.exit(1);
  });
} catch (error) {
  console.error("Failed to load routes:", error);
  
  // Start server anyway with basic routes
  const PORT = process.env.PORT || 5000;
  app.get('/', (req, res) => {
    res.send(`
      <html>
        <head>
          <title>OakTree DevOps Platform</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            .card { border: 1px solid #eee; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
            pre { background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; }
            .success { color: green; }
            .error { color: red; }
          </style>
        </head>
        <body>
          <h1>OakTree DevOps Platform</h1>
          <div class="card">
            <h2>Local Mode Active</h2>
            <p>The application is running in compatibility mode for local development.</p>
            <p>API is available at: <code>http://localhost:${PORT}/api</code></p>
          </div>
          <div class="card">
            <h2>AWS Configuration</h2>
            <pre>
Region: ${process.env.AWS_REGION || 'Not configured'}
AWS Mode: ${process.env.USE_AWS_DB === 'true' ? 'Enabled' : 'Disabled'}
            </pre>
          </div>
          <div class="card">
            <h2 class="error">Error Loading Routes</h2>
            <p>There was an error loading the application routes.</p>
            <pre>${error.stack}</pre>
          </div>
        </body>
      </html>
    `);
  });
  
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`⚠️ Server is running in limited mode on http://localhost:${PORT}`);
    console.log('Some features may not be available due to initialization errors');
  });
}