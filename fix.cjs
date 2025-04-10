/**
 * SIMPLE FIX SCRIPT FOR LOCAL ENVIRONMENTS
 * Run this once with: node fix.cjs
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Running OakTree Local Fix Tool...');

// Fix vite.config.ts
try {
  const viteConfigPath = path.join(__dirname, 'vite.config.ts');
  console.log(`Checking ${viteConfigPath}...`);
  
  if (fs.existsSync(viteConfigPath)) {
    console.log('Found vite.config.ts, fixing it...');
    
    // Read the file
    let content = fs.readFileSync(viteConfigPath, 'utf8');
    
    // Replace import.meta.dirname with __dirname alternative
    let fixedContent = content.replace(
      `import path from "path";`,
      `import path from "path";
import { fileURLToPath } from 'url';

// ESM equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);`
    );
    
    // Replace all instances of import.meta.dirname with __dirname
    fixedContent = fixedContent.replace(/import\.meta\.dirname/g, '__dirname');
    
    // Write back the fixed file
    fs.writeFileSync(viteConfigPath, fixedContent);
    console.log('✅ Fixed vite.config.ts successfully!');
  } else {
    console.log('❌ vite.config.ts not found!');
  }
} catch (error) {
  console.error('❌ Error fixing vite.config.ts:', error.message);
}

// Create a .env file if it doesn't exist
try {
  const envPath = path.join(__dirname, '.env');
  console.log(`Checking for .env file at ${envPath}...`);
  
  if (!fs.existsSync(envPath)) {
    console.log('Creating .env file with default values...');
    fs.writeFileSync(envPath, 
`AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=placeholder
AWS_SECRET_ACCESS_KEY=placeholder
USE_AWS_DB=false`);
    console.log('✅ Created .env file');
  } else {
    console.log('✅ .env file already exists');
  }
} catch (error) {
  console.error('❌ Error with .env file:', error.message);
}

// ALL DONE!
console.log('\n✨ FIX COMPLETE! ✨');
console.log('\nYou can now run the application with:');
console.log('npm run dev');
console.log('\nIf that fails, try installing tsx first:');
console.log('npm install -g tsx');
console.log('tsx server/index.ts');