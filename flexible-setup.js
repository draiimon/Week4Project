/**
 * Flexible Setup for OakTree Project
 * Works in both Replit and local environments
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { exit } = require('process');

// Detect environment
const isReplit = process.env.REPL_ID || process.env.REPL_SLUG;
console.log(`Running in ${isReplit ? 'Replit' : 'local'} environment`);

// Make vite.config.ts compatible with both environments
function fixViteConfig() {
  const viteConfigPath = path.join(__dirname, 'vite.config.ts');
  
  if (!fs.existsSync(viteConfigPath)) {
    console.log('vite.config.ts not found. Skipping fix.');
    return;
  }
  
  let content = fs.readFileSync(viteConfigPath, 'utf8');
  
  // Check if already fixed
  if (content.includes('import.meta.dirname')) {
    // Make it compatible with Node.js
    content = content.replace(
      /path\.resolve\(import\.meta\.dirname, (.*)\)/g, 
      `path.resolve(__dirname, $1)`
    );
    
    // Save the fixed file
    fs.writeFileSync(viteConfigPath, content);
    console.log('✅ Fixed vite.config.ts for compatibility');
  } else {
    console.log('vite.config.ts is already compatible');
  }
}

// Set up environment
function setupEnvironment() {
  // Create .env file if it doesn't exist
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, 
`AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=placeholder
AWS_SECRET_ACCESS_KEY=placeholder
USE_AWS_DB=false`);
    console.log('✅ Created default .env file');
  } else {
    console.log('✅ .env file already exists');
  }
}

// Start the application
function startApp() {
  try {
    if (isReplit) {
      console.log('🚀 Starting app in Replit environment...');
      execSync('npm run dev', { stdio: 'inherit' });
    } else {
      console.log('🚀 Starting app in local environment...');
      fixViteConfig();
      execSync('npm run dev', { stdio: 'inherit' });
    }
  } catch (error) {
    console.error('❌ Failed to start the application:', error.message);
    exit(1);
  }
}

// Main function
function main() {
  console.log('🛠️ Setting up OakTree project...');
  setupEnvironment();
  startApp();
}

// Run the script
main();