import dotenv from 'dotenv';
import { log } from "./vite";

// Load environment variables
dotenv.config();

// Log AWS configuration status
export function logAwsConfig() {
  const region = process.env.AWS_REGION;
  const accessKey = process.env.AWS_ACCESS_KEY_ID;
  const secretKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (region && accessKey && secretKey) {
    log(`AWS environment configured with region: ${region}`);
    log('AWS access key is set');
    log('AWS secret key is set');
    return true;
  } else {
    log('⚠️ AWS environment not properly configured:');
    if (!region) log('  - Missing AWS_REGION');
    if (!accessKey) log('  - Missing AWS_ACCESS_KEY_ID');
    if (!secretKey) log('  - Missing AWS_SECRET_ACCESS_KEY');
    return false;
  }
}

// Export environment variables
export const envVars = {
  AWS_REGION: process.env.AWS_REGION,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  USE_AWS_DB: process.env.USE_AWS_DB === 'true',
  DATABASE_URL: process.env.DATABASE_URL
};