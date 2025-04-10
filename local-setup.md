# Running OakTree DevOps Platform Locally

This guide will help you run the OakTree DevOps Platform on your local machine, outside of Replit.

## Prerequisites

- Node.js v18+ installed
- npm installed

## Setup Instructions

1. **First, set up your environment**

   Make sure your `.env` file has the required AWS configuration:

   ```
   AWS_REGION=your-region  # e.g. us-east-1
   AWS_ACCESS_KEY_ID=your-key
   AWS_SECRET_ACCESS_KEY=your-secret
   USE_AWS_DB=true
   ```

   If you don't want to use actual AWS services while testing, you can set `USE_AWS_DB=false`.

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the application using the local-compatible scripts**

   Copy our local package.json scripts:
   ```bash
   npm pkg set scripts.local:dev="node local-dev.js"
   npm pkg set scripts.local:build="vite --config vite.config.local.ts build"
   npm pkg set scripts.local:start="NODE_ENV=production node local-dev.js"
   ```

   Then run:
   ```bash
   npm run local:dev
   ```

   This will start the application in development mode on http://localhost:5000

## Troubleshooting

If you encounter issues:

1. **Check Node.js version**
   ```
   node --version
   ```
   Make sure it's v18 or later.

2. **Verify environment variables**
   Check that your `.env` file has all required variables.

3. **Clear npm cache**
   ```
   npm cache clean --force
   rm -rf node_modules
   npm install
   ```

4. **Build issues**
   If you encounter build errors, try:
   ```
   npm run local:build
   npm run local:start
   ```

## Notes

- The local setup uses a modified vite configuration file (`vite.config.local.ts`) that is compatible with regular Node.js environments.
- You may need real AWS credentials if using AWS features.