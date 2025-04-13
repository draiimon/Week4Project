# **Week 4: End-to-End DevOps Project - Day 2 (Thursday, April 3, 2025)**

## **Introduction**

Today is the second day of my Week 4 project. After spending yesterday on planning and setting up the basic application structure, today I focused on Docker containerization and began exploring Terraform for infrastructure as code. I wanted to make sure I had a solid understanding of how to containerize the application before moving on to more complex deployment tasks.

## **What I Did Today**

### **Docker Implementation:**

- Created a Dockerfile for the Node.js application
- Implemented multi-stage build for smaller image size
- Added .dockerignore file to exclude unnecessary files
- Built and tested the Docker image locally
- Learned how to properly tag images for versioning
- Documented the Docker build and run process

### **React Frontend Setup:**

- Initialized a basic React application using create-react-app
- Set up project structure with components and pages directories
- Created initial UI components for the dashboard
- Implemented a simple navigation system
- Added basic styling with CSS

### **AWS Authentication Learning:**

- Installed and configured AWS CLI
- Created IAM user with programmatic access for development
- Set up local credentials using aws configure
- Tested AWS connectivity with simple commands
- Read documentation on IAM roles and policies

### **Terraform Basics:**

- Installed Terraform CLI
- Created initial Terraform configuration files
- Learned about Terraform syntax and structure
- Configured AWS provider with proper authentication
- Experimented with simple resource definitions

## **Code Snippets and Implementation**

### **Dockerfile**

After researching Docker best practices, I implemented the following Dockerfile for our Node.js application:

```Dockerfile
# Build stage
FROM node:16-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:16-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./
USER node
EXPOSE 3000
CMD ["npm", "start"]
```

This multi-stage build approach allows me to:
1. Use a larger image with all development dependencies for building
2. Create a smaller final image with only production dependencies
3. Improve security by running as a non-root user

I also created a .dockerignore file to exclude unnecessary files:

```
node_modules
npm-debug.log
Dockerfile
.dockerignore
.git
.github
.gitignore
README.md
```

To build and run the Docker image locally, I used the following commands:

```bash
# Build the image
docker build -t oaktree:latest .

# Run the container
docker run -p 3000:3000 -d --name oaktree-app oaktree:latest
```

### **React Frontend**

I set up a basic React application and created some initial components. Here's an example of a simple dashboard component I created:

```jsx
// client/src/components/Dashboard.jsx
import React from 'react';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard">
      <h1>OakTree DevOps Dashboard</h1>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Container Status</h2>
          <p>Status: Not Deployed</p>
        </div>
        <div className="dashboard-card">
          <h2>AWS Connection</h2>
          <p>Status: Not Connected</p>
        </div>
        <div className="dashboard-card">
          <h2>Deployment Pipeline</h2>
          <p>Status: Not Configured</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
```

This is just a simple static component for now, but it provides the structure I'll build upon as I add real functionality.

### **Initial Terraform Configuration**

I created a basic Terraform configuration to get familiar with the syntax:

```hcl
# terraform/main.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "ap-southeast-1"
}

# Just a simple resource to test with
resource "aws_s3_bucket" "test_bucket" {
  bucket = "oaktree-test-bucket"
  
  tags = {
    Name        = "Test Bucket"
    Environment = "Dev"
    Project     = "OakTree"
  }
}
```

I initialized this configuration but didn't apply it yet, as I'm just learning the syntax and structure:

```bash
cd terraform
terraform init
terraform plan
```

## **Learning About AWS Services**

Today I spent time diving deeper into AWS authentication and access management:

### **IAM User Setup**

I learned how to properly set up an IAM user for development:

1. Created a user with programmatic access only
2. Attached the "PowerUserAccess" policy for development (will use more restricted policies in production)
3. Generated access key and secret access key
4. Configured AWS CLI locally:

```bash
aws configure
# Added Access Key ID
# Added Secret Access Key
# Set region to ap-southeast-1
# Set output format to json
```

I tested the configuration with some basic AWS commands:

```bash
# Verify identity
aws sts get-caller-identity

# List S3 buckets
aws s3 ls

# List EC2 instances
aws ec2 describe-instances
```

### **IAM Best Practices**

I learned several important IAM best practices:

1. Use IAM roles instead of long-term access keys when possible
2. Implement the principle of least privilege
3. Use IAM groups to manage permissions for multiple users
4. Rotate credentials regularly
5. Use multi-factor authentication for sensitive operations

## **Resources**

### **Docker Resources:**
- [Node.js Docker Official Guide](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/) - Followed this for initial setup
- [Docker Multi-Stage Builds](https://docs.docker.com/develop/develop-images/multistage-build/) - Used for optimization
- [Docker Security Best Practices](https://docs.docker.com/engine/security/security/) - Implemented non-root user

### **AWS Resources:**
- [AWS CLI Configuration](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html) - Used for setup
- [IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html) - Followed security guidelines
- [AWS SDK for JavaScript](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/welcome.html) - Will use for application integration

### **Terraform Resources:**
- [Terraform Getting Started - AWS](https://learn.hashicorp.com/tutorials/terraform/aws-build) - Followed for basic setup
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs) - Referenced for AWS resource configuration
- [Terraform Best Practices](https://www.terraform-best-practices.com/) - Learning proper structure

### **React Resources:**
- [React Documentation](https://reactjs.org/docs/getting-started.html) - Used for component setup
- [Create React App](https://create-react-app.dev/docs/getting-started/) - Used for project initialization

## **Challenges & Solutions**

### **Docker Build Optimization:**

- **Challenge**: My initial Docker image was over 1GB in size, which would slow down deployments and increase costs.
  
- **Solution**: Implemented multi-stage builds and switched to Alpine-based images, which reduced the image size to around 200MB. The key was separating build dependencies from runtime dependencies.

```bash
# Before optimization
$ docker images
REPOSITORY   TAG       SIZE
oaktree      latest    1.2GB

# After optimization
$ docker images
REPOSITORY   TAG       SIZE
oaktree      latest    215MB
```

### **AWS Credentials Management:**

- **Challenge**: Determining the best way to manage AWS credentials securely during development.
  
- **Solution**: Used AWS CLI with configured profiles and added the credentials directory to .gitignore to prevent accidental commit. For future CI/CD, I'll use environment variables or secrets management.

## **Learning Insights**

Today I gained a much better understanding of Docker multi-stage builds and their importance for production applications. The concept of separating the build environment from the runtime environment was particularly valuable. I learned this from Docker's official documentation and a very helpful YouTube tutorial on "Docker for Node.js Applications" by Traversy Media.

I also learned about the importance of proper Docker image tagging for versioning. Using meaningful tags instead of just "latest" helps with rollbacks and tracking changes. This practice came from reading "Docker in Practice" by Ian Miell and Aidan Hobson Sayers, which recommended using Git commit hashes or semantic versions for tags.

Working with AWS IAM, I gained appreciation for the principle of least privilege. By only granting the permissions that are absolutely necessary, I can reduce the security risk if credentials are ever compromised. I learned this from AWS's security white papers and from a course on "AWS Security Best Practices" on A Cloud Guru.

## **Future Plans**

For tomorrow, I plan to:

1. Create a Docker Compose setup for local development
   - Configure multiple services (frontend, backend, database)
   - Set up volume mounts for development
   - Add environment variable configuration

2. Implement more Terraform infrastructure
   - Define VPC and networking components
   - Set up security groups and IAM roles
   - Create ECR repository for Docker images

3. Enhance the React application
   - Add more UI components for AWS service monitoring
   - Implement API client for backend communication
   - Create responsive layout for different devices

4. Start learning about GitHub Actions
   - Research CI/CD pipeline configuration
   - Understand workflow syntax and triggers
   - Plan integration with AWS and Docker

## **Conclusion**

Day 2 of Week 4 was productive, with significant progress on Docker containerization and initial exploration of Terraform and AWS services. I now have a functioning Docker container for the application and a better understanding of how to optimize it for production.

The React frontend is in its early stages but provides a foundation to build upon as I add more functionality. The AWS and Terraform exploration has given me the knowledge I need to start implementing the infrastructure as code in the coming days.

I'm particularly pleased with the Docker optimization work, as it demonstrates a key DevOps principle of creating efficient, production-ready container images. Tomorrow I'll focus on building out the infrastructure components and enhancing the application functionality.