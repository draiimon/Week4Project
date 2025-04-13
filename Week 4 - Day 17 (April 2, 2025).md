# **Week 4: End-to-End DevOps Project - Day 17 (Wednesday, April 2, 2025)**

## **Introduction**

Today marks the beginning of Week 4, where I'll be working on the final project that consolidates all the skills learned in the first three weeks. The objective is to create an end-to-end DevOps deployment for a web application called OakTree, which includes containerization, CI/CD pipeline setup, infrastructure provisioning with Terraform, and deployment to AWS cloud services.

## **What I Did Today**

### **Project Setup:**

- Created a new GitHub repository for the project
- Set up the basic Node.js application structure
- Added React frontend components for the OakTree dashboard
- Established project folder structure (client, server, terraform)
- Created initial README documentation

### **Infrastructure Planning:**

- Researched AWS services needed for deployment
- Selected ap-southeast-1 (Singapore) as deployment region
- Sketched initial architecture design including ECS, ECR, and ALB
- Planned network architecture with VPC, subnets, and security groups
- Researched IAM roles and policies for ECS and ECR

### **Docker Configuration:**

- Created initial Dockerfile for application containerization
- Set up .dockerignore file to optimize build process
- Implemented multi-stage build pattern for smaller image size
- Added environment variable handling for production deployments
- Tested local Docker build process

### **AWS Account Configuration:**

- Set up AWS CLI with proper credentials
- Created dedicated IAM user with programmatic access
- Set up access key and secret key for deployments
- Tested AWS CLI connectivity and permissions

## **Resources**

### **AWS Documentation:**

- ECS Fargate Service Configuration
- ECR Repository Management
- IAM Best Practices for DevOps
- VPC Networking for Containers

### **Docker:**

- Multi-stage Builds for Node.js
- Optimizing Node.js Docker Images
- Best Practices for Node.js in Docker
- Docker Image Tagging Strategies

### **Terraform:**

- AWS Provider Configuration
- Module Organization Patterns
- State Management Options
- Variable and Output Handling

### **DevOps Practices:**

- CI/CD Pipeline Design Patterns
- Infrastructure as Code Principles
- Container Deployment Strategies
- GitHub Actions Workflow Configuration

## **Challenges & Solutions**

### **Project Structure Organization:**

- **Challenge**: Deciding how to organize the monorepo for both frontend and backend while maintaining clean Docker builds.
- **Solution**: Created a structure with client/ and server/ directories with shared configuration at the root level, using Docker multi-stage builds to handle dependencies effectively.

### **AWS Region Selection:**

- **Challenge**: Choosing the most appropriate AWS region for deployment.
- **Solution**: Selected ap-southeast-1 (Singapore) based on proximity, available services, and cost considerations for my target audience.

### **Environment Configuration:**

- **Challenge**: Managing environment variables across local development, CI/CD, and production.
- **Solution**: Created a hierarchical environment variable strategy with .env.example templates and documentation on required variables.

## **Links for Screenshots**

Today was primarily focused on planning and initial setup, so I don't have major visual components to show. I have some whiteboard sketches of the architecture, but they will be digitized later in the project.

## **Plan for Tomorrow**

- Start writing Terraform code for core infrastructure
- Set up GitHub Actions workflow configuration
- Create ECR repository and test Docker push
- Begin implementing core application functionality
- Define IAM roles and permissions structure