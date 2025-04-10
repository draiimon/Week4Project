// Local development starter script for CommonJS
// Run with: node local-dev.cjs

// Import required packages
const express = require('express');
const http = require('http');
const path = require('path');
const dotenv = require('dotenv');
const { createServer } = require('vite');

// Load environment variables
dotenv.config();

async function startServer() {
  // Create Express app and HTTP server
  const app = express();
  const server = http.createServer(app);

  // JSON middleware
  app.use(express.json());

  try {
    // Create Vite server for frontend
    const vite = await createServer({
      configFile: path.resolve(__dirname, 'vite.config.local.ts'),
      server: {
        middlewareMode: true,
      },
      appType: 'spa',
      root: path.resolve(__dirname, 'client')
    });

    // Use Vite's middleware
    app.use(vite.middlewares);

    // Try to load the routes
    const routes = require('./server/routes');
    
    // Register API routes
    routes.registerRoutes(app, server)
      .then(() => {
        const PORT = process.env.PORT || 5000;
        server.listen(PORT, '0.0.0.0', () => {
          console.log(`✅ Server is running successfully on http://localhost:${PORT}`);
          console.log(`Access the application at: http://localhost:${PORT}`);
        });
      })
      .catch(err => {
        console.error('Failed to register routes:', err);
        startBasicServer(app, server);
      });
  } catch (error) {
    console.error("Failed to initialize server:", error);
    startBasicServer(app, server);
  }
}

// Fallback server if routes fail to load
function startBasicServer(app, server) {
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

// Start the server
startServer();