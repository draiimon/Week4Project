# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application (if needed)
RUN npm run build

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"]