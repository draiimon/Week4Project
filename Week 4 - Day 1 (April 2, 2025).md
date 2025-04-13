# **Week 4: End-to-End DevOps Project - Day 1 (Wednesday, April 2, 2025)**

## **Introduction**

Today marks the beginning of Week 4, where I'll be working on the final project that consolidates all the skills learned in the first three weeks. The objective is to create an end-to-end DevOps deployment for a web application called OakTree, which includes containerization, CI/CD pipeline setup, infrastructure provisioning with Terraform, and deployment to AWS cloud services.

## **What I Did Today**

### **Project Setup:**

- Created a new GitHub repository for the project
- Set up the basic Node.js application structure with React frontend
- Established project folder structure (client, server, terraform)
- Implemented basic UI components using shadcn/ui and Tailwind CSS
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

### **Docker Build Optimization:**

- **Challenge**: Creating an efficient Docker build process that doesn't bloat the image size.
- **Solution**: Implemented multi-stage builds to separate build dependencies from runtime dependencies, reducing the final image size significantly.

## **Learning Insights**

Today I learned the importance of proper project setup and planning before diving into implementation. The decisions made at this stage about architecture, region selection, and deployment patterns will have significant impacts on the project's success.

I also gained a deeper understanding of Docker multi-stage builds by applying the concept to our Node.js application. This allowed me to create a much smaller and more efficient container image by separating the build and runtime environments.

The AWS services selection process taught me to consider factors like cost, latency, and service availability when choosing a deployment region. I gained this knowledge from AWS documentation and from tutorials on YouTube by AWS Solutions Architects.

## **Future Plans**

For tomorrow, I plan to:

1. Complete the Terraform infrastructure configuration for VPC and networking
2. Develop the CI/CD pipeline using GitHub Actions
3. Set up the AWS ECR repository for Docker images
4. Implement more of the application functionality

## **Conclusion**

Day 1 of Week 4 was focused on setting up the foundation for the project. I've made significant progress in establishing the project structure and planning the infrastructure. The challenges encountered were mostly related to architectural decisions, which I was able to resolve through research and best practices. I'm excited to continue building on this foundation and implementing the infrastructure as code in Terraform tomorrow.