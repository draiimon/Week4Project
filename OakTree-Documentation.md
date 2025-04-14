# **OakTree Innovations - Week 4 Final Project**
# **End-to-End DevOps Project Documentation**

**Name:** CASTILLO  
**Date:** April 13, 2025  
**Project:** Cloud-deployed Web Service with Complete DevOps Pipeline

![Project Banner: OakTree Infrastructure Monitor]
* INSERT PROJECT BANNER IMAGE HERE *

## **Table of Contents**
1. [Project Overview](#1-project-overview)
2. [Project Components](#2-project-components)
3. [Project Setup & Execution](#3-project-setup--execution)
4. [Architecture](#4-architecture)
5. [CI/CD Pipeline](#5-cicd-pipeline)
6. [Infrastructure as Code](#6-infrastructure-as-code)
7. [Deployment Process](#7-deployment-process)
8. [Demo & Screenshots](#8-demo--screenshots)
9. [Challenges & Solutions](#9-challenges--solutions)
10. [Skills Demonstrated](#10-skills-demonstrated)

## **1. Project Overview**

This project demonstrates a complete end-to-end DevOps lifecycle for a web application called "OakTree Infrastructure Monitor." The application allows users to monitor and manage AWS cloud infrastructure resources through a simple web interface. 

The project integrates all skills learned throughout the course:
- Week 1: Containerization with Docker
- Week 2: CI/CD Pipeline setup
- Week 3: Cloud Infrastructure with Terraform
- Week 4: Integration of all components into a complete DevOps workflow

The final result is a fully functioning web application deployed to AWS using an automated CI/CD pipeline, with infrastructure provisioned through code.

## **2. Project Components**

### **Web Application**
- **Frontend**: React.js with TypeScript and Tailwind CSS
- **Backend**: Node.js and Express.js REST API
- **Authentication**: JWT-based user authentication system

### **DevOps Pipeline**
- **Source Control**: GitHub repository with branch protection
- **CI/CD**: GitHub Actions for automated testing and deployment
- **Containerization**: Docker with multi-stage builds
- **Container Registry**: Amazon ECR
- **Infrastructure as Code**: Terraform for AWS resource provisioning
- **Deployment Target**: Amazon ECS (Elastic Container Service) with Fargate
- **Monitoring**: Amazon CloudWatch for logs and metrics

## **3. Project Setup & Execution**

### **Prerequisites**
- AWS Account with programmatic access
- GitHub account
- Docker installed locally
- Terraform CLI installed
- AWS CLI configured with proper credentials

### **Repository Structure**
```
/
├── client/                  # React frontend code
├── server/                  # Express backend code
├── terraform/               # Terraform infrastructure code
├── .github/workflows/       # GitHub Actions CI/CD pipeline
├── Dockerfile               # Container definition
├── docker-compose.yml       # Local development setup
├── README.md                # Project documentation
└── .gitignore               # Git ignore file
```

### **Local Development**
1. Clone the repository:
   ```bash
   git clone https://github.com/user/oaktree-project.git
   cd oaktree-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run locally using Docker Compose:
   ```bash
   docker-compose up --build
   ```

4. Access the application at `http://localhost:5000`

### **Deployment Process**
1. Push code to GitHub main branch:
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```

2. GitHub Actions will automatically:
   - Run tests
   - Build Docker image
   - Push to ECR
   - Deploy to ECS

3. Alternatively, deploy infrastructure manually:
   ```bash
   cd terraform
   terraform init
   terraform apply
   ```

4. Access the deployed application at the ALB URL output by Terraform.

## **4. Architecture**

The application is deployed on AWS with the following architecture:

```
                    ┌─────────────────────────────────┐
                    │      AWS Cloud (ap-southeast-1) │
                    │                                 │
                    │  ┌─────────────────────────┐    │
                    │  │    Load Balancer        │    │
                    │  └─────────┬───────────────┘    │
                    │            │                    │
                    │            ▼                    │
                    │  ┌─────────────────────────┐    │
┌───────────┐       │  │    ECS Cluster          │    │
│  Browser  │─HTTPS─┼─►│                         │    │
└───────────┘       │  │  ┌────────┐ ┌────────┐  │    │
                    │  │  │Container│ │Container│  │    │
                    │  │  │(Task 1) │ │(Task 2) │  │    │
                    │  │  └────┬────┘ └────┬────┘  │    │
                    │  └───────┼───────────┼───────┘    │
                    │          │           │            │
                    │          ▼           ▼            │
                    │  ┌─────────────┐ ┌─────────────┐  │
                    │  │  DynamoDB   │ │ CloudWatch  │  │
                    │  └─────────────┘ └─────────────┘  │
                    │                                   │
                    └───────────────────────────────────┘
```

* INSERT ACTUAL AWS ARCHITECTURE SCREENSHOT HERE *

### **AWS Resources Used**
- **VPC**: Custom VPC with public and private subnets
- **ECS**: Fargate cluster for containerized application
- **ECR**: Container registry for Docker images
- **ALB**: Application Load Balancer for traffic distribution
- **DynamoDB**: NoSQL database for storing user data
- **CloudWatch**: Monitoring and logging
- **IAM**: Roles and policies for secure access

## **5. CI/CD Pipeline**

The CI/CD pipeline is implemented using GitHub Actions and automates the following steps:

```
┌─────────┐     ┌─────────┐     ┌──────────┐     ┌──────────┐     ┌─────────┐
│   Code   │     │   Run   │     │  Build   │     │   Push   │     │ Deploy  │
│   Push   ├────►│  Tests  ├────►│  Docker  ├────►│ to ECR   ├────►│ to ECS  │
└─────────┘     └─────────┘     └──────────┘     └──────────┘     └─────────┘
```

### **Workflow File**
The GitHub Actions workflow is defined in `.github/workflows/main.yml`:

```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    name: Test
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
  
  build-and-deploy:
    name: Build and Deploy
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v1
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ap-southeast-1

    - name: Login to Amazon ECR
      id: login-ecr
      uses: aws-actions/amazon-ecr-login@v1

    - name: Build, tag, and push image to Amazon ECR
      env:
        ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        ECR_REPOSITORY: oaktree-dev
        IMAGE_TAG: ${{ github.sha }}
      run: |
        docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
        docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
        docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
        docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest
        
    - name: Force ECS Deployment
      run: |
        aws ecs update-service --cluster oaktree-cluster --service oaktree-service --force-new-deployment
```

* INSERT GITHUB ACTIONS WORKFLOW SCREENSHOT HERE *

## **6. Infrastructure as Code**

The infrastructure is defined as code using Terraform. Key components include:

### **Main Terraform File**
```hcl
provider "aws" {
  region = "ap-southeast-1"
}

# Variables
variable "app_name" {
  description = "Name of the application"
  type        = string
  default     = "oaktree"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "dev"
}

locals {
  name_prefix = "${var.app_name}-${var.environment}"
  common_tags = {
    Project     = var.app_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

# VPC Resources
resource "aws_vpc" "app_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-vpc"
  })
}

# Subnets, Security Groups, etc.
# ...

# ECS Cluster
resource "aws_ecs_cluster" "app_cluster" {
  name = "${local.name_prefix}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = local.common_tags
}

# ECS Task Definition
resource "aws_ecs_task_definition" "app_task" {
  family                   = "${local.name_prefix}-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = local.name_prefix
      image     = "${aws_ecr_repository.app_repo.repository_url}:latest"
      essential = true
      
      portMappings = [
        {
          containerPort = 5000
          hostPort      = 5000
          protocol      = "tcp"
        }
      ]

      environment = [
        {
          name  = "NODE_ENV",
          value = "production"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.app_logs.name
          "awslogs-region"        = "ap-southeast-1"
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])

  tags = local.common_tags
}
```

* INSERT TERRAFORM DEPLOYMENT SCREENSHOT HERE *

### **Infrastructure Components**
- VPC with public and private subnets
- Security groups for application and database
- ECS Cluster, Task Definition, and Service
- IAM Roles and Policies
- CloudWatch Logs and Metrics
- DynamoDB Table for data storage

## **7. Deployment Process**

### **Containerization**
The application is containerized using Docker:

```dockerfile
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

* INSERT DOCKER BUILD SCREENSHOT HERE *

### **Deployment Flow**
1. Local development and testing
2. Code committed and pushed to GitHub
3. GitHub Actions workflow triggers:
   - Tests run
   - Docker image built
   - Image pushed to ECR
4. ECS Service updated with new image
5. Application Load Balancer routes traffic to new containers

### **Deployment Validation**
- Health checks confirm containers are running
- Application accessible via ALB DNS name
- CloudWatch logs show successful startup
- DynamoDB connections confirmed

## **8. Demo & Screenshots**

### **Application Screenshots**
* INSERT APPLICATION DASHBOARD SCREENSHOT *
* INSERT LOGIN SCREEN SCREENSHOT *
* INSERT RESOURCE MONITORING SCREEN *

### **AWS Console Screenshots**
* INSERT ECS CLUSTER SCREENSHOT *
* INSERT ECR REPOSITORY SCREENSHOT *
* INSERT CLOUDWATCH LOGS SCREENSHOT *

### **Deployment Pipeline Screenshots**
* INSERT GITHUB ACTIONS WORKFLOW RUN *
* INSERT SUCCESSFUL DEPLOYMENT LOG *

## **9. Challenges & Solutions**

### **Challenge 1: Task Definition Updates**
**Problem**: Each deployment created a new task definition revision, making it difficult to track current version.

**Solution**: Added task definition deregistration cleanup and standardized on using the "latest" image tag for simplicity.

### **Challenge 2: Security Group Configuration**
**Problem**: Initial security group settings were too restrictive, causing connection issues.

**Solution**: Implemented more specific inbound/outbound rules focused on principle of least privilege while ensuring necessary connectivity.

### **Challenge 3: CI/CD Pipeline Secrets**
**Problem**: Needed secure way to provide AWS credentials to GitHub Actions.

**Solution**: Utilized GitHub repository secrets to securely store and inject AWS credentials into the workflow.

## **10. Skills Demonstrated**

This project demonstrates proficiency in the following DevOps skills:

### **Containerization**
- Docker image creation and optimization
- Multi-stage builds
- Container security best practices
- Image versioning and tagging

### **CI/CD**
- Automated testing
- Build automation
- Deployment automation
- Pipeline configuration
- Secrets management

### **Infrastructure as Code**
- AWS resource provisioning with Terraform
- Environment consistency
- Infrastructure versioning
- State management
- Resource organization

### **Cloud Services**
- Container orchestration with ECS
- Load balancing
- Database management
- IAM security configuration
- Logging and monitoring

### **Development Practices**
- Git workflow
- Documentation
- Testing
- Security considerations
- Release management

---

## **Project Access Information**

- **GitHub Repository**: `https://github.com/your-username/oaktree-project`
- **Application URL**: `http://oaktree-dev-alb-xxxxx.ap-southeast-1.elb.amazonaws.com`
- **AWS Region**: `ap-southeast-1`

---

*This documentation was prepared for the Week 4 Final Exam, demonstrating an end-to-end DevOps project.*