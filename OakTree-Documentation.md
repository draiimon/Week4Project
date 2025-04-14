# **OakTree DevOps Project Documentation**

**Author:** CASTILLO  
**Date:** April 13, 2025  
**Course:** Week 4 Final Project

## **Table of Contents**
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Infrastructure Architecture](#infrastructure-architecture)
4. [Authentication System](#authentication-system)
5. [Deployment Process](#deployment-process)

## **1. Project Overview**

OakTree is a web application for monitoring AWS infrastructure resources. It was built as my Week 4 final project to demonstrate end-to-end DevOps skills including containerization, CI/CD pipeline setup, and infrastructure as code.

**Key Features:**
- Simple dashboard showing AWS resource status
- User authentication system
- API endpoints for AWS service status
- Containerized deployment to AWS ECS
- Automated CI/CD pipeline using GitHub Actions

## **2. Technology Stack**

### **Frontend**
- React.js with TypeScript
- Tailwind CSS
- Orange-gray gradient theme

### **Backend**
- Node.js v18
- Express.js
- JWT authentication

### **Infrastructure**
- Docker for containerization
- AWS ECS (Elastic Container Service) with Fargate
- AWS ECR (Elastic Container Registry)
- Application Load Balancer
- DynamoDB for data storage
- Terraform for infrastructure as code

### **DevOps Tools**
- GitHub for version control
- GitHub Actions for CI/CD
- AWS CloudWatch for monitoring

## **3. Infrastructure Architecture**

The application is deployed on AWS with this architecture:

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

### **VPC Configuration**
- VPC CIDR Block: 10.0.0.0/16
- Public Subnets: 10.0.1.0/24, 10.0.2.0/24
- Security Groups for ALB and ECS

### **ECS Configuration**
- Cluster: oaktree-cluster
- Task Definition: 
  - 256 CPU units, 512MB memory
  - Port 5000 exposed
- Service with 2 tasks running (high availability)

## **4. Authentication System**

The application uses JWT tokens for authentication:

### **Login Process**
1. User enters username/password
2. Server validates credentials
3. If valid, JWT token is generated
4. Token is sent back to client
5. Client stores token in localStorage
6. Token is included in subsequent API requests

### **Login Screen**
The login page features the orange-gray gradient theme with the OakTree logo.

### **Registration Screen**
New users can create an account with username, email, and password.

## **5. Deployment Process**

### **Docker Image**
The application is containerized with Docker:

```dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["npm", "start"]
```

### **CI/CD Pipeline**
GitHub Actions automatically deploys new code:

1. Code is pushed to GitHub
2. GitHub Actions runs tests
3. Docker image is built
4. Image is pushed to ECR
5. ECS service is updated

### **Terraform Infrastructure**
Infrastructure is managed as code with Terraform:

```hcl
provider "aws" {
  region = "ap-southeast-1"
}

resource "aws_ecs_cluster" "app_cluster" {
  name = "oaktree-cluster"
}

resource "aws_ecs_task_definition" "app_task" {
  family                   = "oaktree-task"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
  
  container_definitions = jsonencode([
    {
      name      = "oaktree-container"
      image     = "${aws_ecr_repository.app_repo.repository_url}:latest"
      essential = true
      portMappings = [
        {
          containerPort = 5000
          hostPort      = 5000
        }
      ]
    }
  ])
}
```

---

*This documentation was prepared for Week 4 Final Project submission.*