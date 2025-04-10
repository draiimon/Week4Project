# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies using the npm version that comes with Node.js 18
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application (if needed)
RUN npm run build

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000
ENV AWS_REGION=ap-southeast-1
# The following environment variables will be provided at runtime:
# AWS_ACCESS_KEY_ID
# AWS_SECRET_ACCESS_KEY
# AWS_COGNITO_USER_POOL_ID
# AWS_COGNITO_CLIENT_ID

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"]