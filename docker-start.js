// This is a simple startup script for Docker environments
// It handles running the application in production mode without relying on Vite config details

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get the directory name in a way that works in both ESM and CommonJS
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Import the server config - if this fails, fallback to simple Express setup
let serverApp;
try {
  const serverModule = await import('./server/index.js');
  serverApp = serverModule.default || serverModule;
  console.log('Successfully loaded server module');
} catch (error) {
  console.error('Error importing server module:', error);
  
  // Create a basic Express app as fallback
  const app = express();
  
  // Serve static files from the public directory
  const publicPath = path.join(__dirname, 'dist', 'public');
  if (fs.existsSync(publicPath)) {
    app.use(express.static(publicPath));
    
    // For any other request, send the index.html file
    app.get('*', (req, res) => {
      res.sendFile(path.join(publicPath, 'index.html'));
    });
  } else {
    app.get('/', (req, res) => {
      res.send('OakTree DevOps Platform - Static files not found');
    });
  }
  
  // Set up port
  const PORT = process.env.PORT || 5000;
  
  // Start server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Fallback server running on port ${PORT}`);
  });
}