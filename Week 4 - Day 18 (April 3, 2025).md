# **Week 4: End-to-End DevOps Project - Day 18 (Thursday, April 3, 2025)**

## **Introduction**

Today is my second day working on the OakTree DevOps project. After setting up the project foundation yesterday, I focused on creating the core Terraform infrastructure code and improving the Docker configuration for the application.

## **What I Did Today**

### **Terraform Infrastructure:**

- Created main.tf with AWS provider configuration
- Defined VPC and networking resources (subnets, route tables)
- Set up security groups for application and load balancer
- Created initial variable structure and output definitions
- Set up backend configuration for state management

### **Docker Implementation:**

- Refined Dockerfile with proper caching strategies
- Added healthcheck configuration for container monitoring
- Implemented build arguments for flexible configuration
- Tested multi-stage build process for optimization
- Reduced final image size by 60% through optimization

### **Application Development:**

- Enhanced backend API structure with Express.js
- Added basic authentication endpoints for user management
- Set up connection handling to AWS services (DynamoDB)
- Created environment variable validation for application startup
- Added basic error handling and logging infrastructure

### **CI/CD Setup:**

- Created initial GitHub Actions workflow file
- Set up workflow triggers for main branch pushes
- Added Docker build and test steps to workflow
- Researched AWS credential management in GitHub Actions
- Documented CI/CD pipeline design decisions

## **Resources**

### **AWS Documentation:**

- VPC Configuration and CIDR Block Planning
- Security Group Best Practices
- IAM Role Management
- ECR Authentication Workflow

### **Terraform:**

- AWS Provider Configuration Options
- Variable Types and Validation
- State Management Approaches
- Module Structure Best Practices

### **Docker:**

- Build Cache Optimization Techniques
- Multi-stage Build Best Practices
- Container Healthcheck Configuration
- Environment Variable Management

### **CI/CD:**

- GitHub Actions Workflow Syntax
- Secrets Management in GitHub
- AWS Authentication in CI/CD
- Docker Layer Caching in CI

## **Challenges & Solutions**

### **Terraform State Management:**

- **Challenge**: Deciding the best approach for managing Terraform state files, considering team collaboration.
- **Solution**: For initial development, started with local state while documenting future migration to S3-backed remote state with DynamoDB locking.

### **Security Group Configuration:**

- **Challenge**: Setting up proper security group rules with appropriate ingress/egress patterns.
- **Solution**: Created separate security groups for load balancer and application tier with least-privilege access rules, allowing only necessary traffic flow.

### **Docker Build Performance:**

- **Challenge**: Initial Docker builds were very slow and resulting images were too large.
- **Solution**: Implemented proper layer ordering, multi-stage builds, and .dockerignore file to dramatically improve build performance and reduce final image size.

## **Links for Screenshots**

Today was focused on coding infrastructure, so I don't have significant visual components to show yet. I created some diagrams of the AWS network architecture that will be referenced in future documentation.

## **Plan for Tomorrow**

- Create ECR repository infrastructure
- Set up ECS cluster, service, and task definitions
- Complete GitHub Actions workflow for automated builds
- Test Docker image push to ECR
- Set up load balancer and target group configuration