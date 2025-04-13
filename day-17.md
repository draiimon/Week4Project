# **Week 4: End-to-End DevOps Project - Day 17 (Wednesday, April 2, 2025)**

![OakTree DevOps Project Banner](https://example.com/placeholder-image) 
_**[Screenshot Opportunity: Create a custom banner with the OakTree logo using the orange-gray gradient theme]**_

## **Introduction**

Today marks the beginning of Week 4 - our final DevOps project that will consolidate everything we've learned so far. After reviewing the requirements, I understand I need to create a complete DevOps pipeline for the OakTree infrastructure monitoring application that includes:

1. Containerizing the application with Docker
2. Setting up CI/CD with GitHub Actions
3. Provisioning AWS infrastructure using Terraform
4. Deploying the containerized application to AWS

I'm both excited and nervous about this project since it's my first time combining all these technologies into one complete solution!

## **What I Did Today**

### **Project Setup & Planning**

I started by creating the basic structure for the OakTree project:

```
/
├── client/            # React frontend
├── server/            # Express backend
├── terraform/         # Infrastructure as Code
├── .github/workflows/ # CI/CD pipeline
└── Dockerfile         # Container definition
```

_**[Screenshot Opportunity: Terminal showing the mkdir commands or VS Code with the folder structure]**_

I also initialized my Git repository and set up the initial `.gitignore` file, making sure to exclude:
- Node modules
- Environment files with secrets
- Build artifacts
- Terraform state files

### **Initial Application Setup**

For the backend, I created a simple Express server that will serve as the foundation for our API:

```javascript
// server/index.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(express.json());

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('OakTree DevOps Project API');
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

_**[Screenshot Opportunity: VS Code with the Express server code open]**_

For the frontend, I set up a basic React application with our orange-gray theme:

```jsx
// client/src/components/Dashboard.jsx
import React from 'react';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard">
      <header className="dashboard-header bg-gradient-to-r from-gray-800 via-gray-700 to-orange-600">
        <h1>OakTree Infrastructure Monitor</h1>
      </header>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Container Status</h2>
          <p className="status">Not Deployed</p>
        </div>
        <div className="dashboard-card">
          <h2>AWS Connection</h2>
          <p className="status">Not Connected</p>
        </div>
        <div className="dashboard-card">
          <h2>Deployment Pipeline</h2>
          <p className="status">Not Configured</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
```

_**[Screenshot Opportunity: Browser showing the basic React dashboard with the orange-gray gradient header]**_

### **Docker Configuration**

Next, I created the initial `Dockerfile` for containerizing our application:

```Dockerfile
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

# Build the application
RUN npm run build

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"]
```

_**[Screenshot Opportunity: VS Code with the Dockerfile open]**_

I also created a `.dockerignore` file to exclude unnecessary files from the build:

```
node_modules
npm-debug.log
.git
.github
.gitignore
README.md
*.env
*.env.*
terraform
```

_**[Screenshot Opportunity: Terminal showing the Docker build command and output]**_

### **AWS Infrastructure Planning**

After researching AWS services, I decided on the following architecture for our application:

- **Compute**: AWS ECS (Elastic Container Service) with Fargate for serverless container execution
- **Storage**: ECR (Elastic Container Registry) for storing Docker images
- **Database**: DynamoDB for a simple NoSQL storage solution
- **Networking**: VPC with public and private subnets, Internet Gateway, Security Groups
- **Load Balancing**: Application Load Balancer for routing traffic to our containers

_**[Screenshot Opportunity: Hand-drawn architecture diagram or digital diagram showing these components]**_

I selected the Asia Pacific (Singapore) `ap-southeast-1` region for deployment because it provides good coverage for our target audience while maintaining reasonable costs.

### **IAM User & Permissions Setup**

For deploying our infrastructure, I created a dedicated IAM user with the following permissions:

- AmazonECR-FullAccess
- AmazonECS-FullAccess
- AmazonDynamoDBFullAccess
- AmazonVPCFullAccess
- IAMFullAccess (for creating service roles)

_**[Screenshot Opportunity: AWS IAM console showing the created user and attached policies]**_

I configured my local AWS CLI with these credentials:

```bash
$ aws configure
AWS Access Key ID [None]: AKIAXXXXXXXXXXXXXXXX
AWS Secret Access Key [None]: ****************************************
Default region name [None]: ap-southeast-1
Default output format [None]: json
```

_**[Screenshot Opportunity: Terminal showing AWS CLI configuration (with access key censored)]**_

## **Learning Resources I Used Today**

### **AWS Documentation:**
- [Getting Started with Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/getting-started-fargate.html)
- [Setting Up with Amazon ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/get-set-up-for-amazon-ecr.html)
- [IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)

_**[Screenshot Opportunity: Browser showing the AWS documentation pages]**_

### **Docker Documentation:**
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Docker for NodeJS](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)

_**[Screenshot Opportunity: Browser showing the Docker documentation pages]**_

### **Terraform Guides:**
- [Getting Started with AWS](https://learn.hashicorp.com/tutorials/terraform/aws-build)
- [Terraform AWS Provider Documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)

_**[Screenshot Opportunity: Browser showing the Terraform documentation pages]**_

## **Challenges & Solutions**

### **AWS CLI Configuration Issues:**

**Challenge:** When trying to configure AWS CLI, I kept getting authentication errors. The credentials seemed correct, but I couldn't authenticate.

**Solution:** After some debugging, I realized I had a typo in my access key. I regenerated a new pair of keys and carefully followed the AWS documentation for configuring the CLI.

_**[Screenshot Opportunity: Terminal showing a successful AWS CLI command like `aws sts get-caller-identity`]**_

### **Project Structure Planning:**

**Challenge:** I wasn't sure how to structure the project to make containerization easiest. Should I separate the frontend and backend completely?

**Solution:** After researching different approaches, I decided on a monorepo structure with separate folders for client and server. This makes Docker builds simpler while still allowing for independent development.

_**[Screenshot Opportunity: VS Code showing the project directory structure]**_

### **Docker Build Optimization:**

**Challenge:** My initial Docker build was very slow and created a large image (over 1GB) because it included all development dependencies.

**Solution:** I learned about multi-stage builds that allow separating the build environment from the runtime environment. I plan to implement this tomorrow to reduce both build time and image size.

_**[Screenshot Opportunity: Terminal showing Docker image sizes before optimization]**_

## **What I Learned Today**

Today I gained a better understanding of:

1. How to plan a complete DevOps pipeline from development to production
2. The importance of proper AWS IAM configuration for security
3. The relationship between different AWS services in a container deployment
4. Docker best practices for Node.js applications

I'm particularly proud of learning how to properly structure a project for containerization. I now understand how the Dockerfile, .dockerignore, and application code work together to create an efficient container image.

## **Plans for Tomorrow**

Tomorrow, I plan to:

1. Create the Terraform code for our basic VPC infrastructure
2. Implement multi-stage Docker builds to optimize our container image
3. Set up the basic application functionality with API endpoints
4. Begin configuring the GitHub Actions workflow for CI/CD

_**[Screenshot Opportunity: Notebook or digital task list with tomorrow's plan]**_

## **Conclusion**

Day 1 of my Week 4 project was productive but challenging. I've laid the groundwork for the OakTree DevOps project by setting up the basic application structure, Docker configuration, and AWS planning. I'm excited to start implementing the actual infrastructure as code tomorrow!

---

**References:**
1. AWS Documentation: [https://docs.aws.amazon.com/](https://docs.aws.amazon.com/)
2. Docker Documentation: [https://docs.docker.com/](https://docs.docker.com/)
3. Terraform Documentation: [https://www.terraform.io/docs](https://www.terraform.io/docs)
4. Express.js Documentation: [https://expressjs.com/](https://expressjs.com/)