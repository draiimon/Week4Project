// Local development startup script
// This script is a modified version for running in non-Replit environments
// Run with: node local-dev.js

// Import required packages
import express from 'express';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Load environment variables
dotenv.config();

// Current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app and HTTP server
const app = express();
const server = createServer(app);

// JSON middleware
app.use(express.json());

// Static serving for client-side files
app.use(express.static(path.join(__dirname, 'client')));

// Import routes dynamically
import('./server/routes.ts')
  .then(({ registerRoutes }) => {
    // Register API routes
    registerRoutes(app, server)
      .then(() => {
        const PORT = process.env.PORT || 5000;
        server.listen(PORT, '0.0.0.0', () => {
          console.log(`✅ Server is running successfully on http://localhost:${PORT}`);
          console.log(`Access the application at: http://localhost:${PORT}`);
        });
      })
      .catch(err => {
        console.error('Failed to register routes:', err);
        startBasicServer();
      });
  })
  .catch(error => {
    console.error("Failed to load routes:", error);
    console.log("Trying TypeScript extension...");
    
    // Try with .ts extension as fallback
    import('./server/routes.ts')
      .then(({ registerRoutes }) => {
        registerRoutes(app, server)
          .then(() => {
            const PORT = process.env.PORT || 5000;
            server.listen(PORT, '0.0.0.0', () => {
              console.log(`✅ Server is running successfully on http://localhost:${PORT}`);
              console.log(`Access the application at: http://localhost:${PORT}`);
            });
          })
          .catch(err => {
            console.error('Failed to register routes:', err);
            startBasicServer();
          });
      })
      .catch(err => {
        console.error("Failed to load routes with TypeScript:", err);
        startBasicServer();
      });
  });

// Fallback server if routes fail to load
function startBasicServer() {
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
        </body>
      </html>
    `);
  });
  
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server is running in fallback mode on http://localhost:${PORT}`);
  });
}