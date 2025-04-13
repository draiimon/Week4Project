# **Week 4: End-to-End DevOps Project - Day 18 (Thursday, April 3, 2025)**

![OakTree Infrastructure Code Banner](https://example.com/placeholder-image)
_**[Screenshot Opportunity: Create a custom banner showing Terraform and Docker logos with the OakTree infrastructure theme]**_

## **Introduction**

Today is my second day working on the OakTree DevOps project. After yesterday's initial setup and planning, I focused on creating the foundational infrastructure code with Terraform and refining my Docker configuration for better production deployment. I made significant progress in setting up the networking components and implementing a multi-stage Docker build process.

## **What I Did Today**

### **Terraform Infrastructure Code**

I created the `main.tf` file with the AWS provider configuration and basic infrastructure components:

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
```

_**[Screenshot Opportunity: VS Code with the Terraform configuration open]**_

I then added the VPC and networking resources to create the foundation for our application:

```hcl
# VPC Resource
resource "aws_vpc" "app_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-vpc"
  })
}

# Public Subnets
resource "aws_subnet" "public_subnet_a" {
  vpc_id                  = aws_vpc.app_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "ap-southeast-1a"
  map_public_ip_on_launch = true

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-public-subnet-a"
  })
}

resource "aws_subnet" "public_subnet_b" {
  vpc_id                  = aws_vpc.app_vpc.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "ap-southeast-1b"
  map_public_ip_on_launch = true

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-public-subnet-b"
  })
}

# Internet Gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.app_vpc.id

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-igw"
  })
}

# Route Table
resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.app_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-public-rt"
  })
}

# Route Table Association
resource "aws_route_table_association" "public_a" {
  subnet_id      = aws_subnet.public_subnet_a.id
  route_table_id = aws_route_table.public_route_table.id
}

resource "aws_route_table_association" "public_b" {
  subnet_id      = aws_subnet.public_subnet_b.id
  route_table_id = aws_route_table.public_route_table.id
}
```

_**[Screenshot Opportunity: AWS VPC diagram showing the network structure]**_

I also added security groups to control traffic to our application:

```hcl
# ALB Security Group
resource "aws_security_group" "alb_sg" {
  name        = "${local.name_prefix}-alb-sg"
  description = "Security group for ALB"
  vpc_id      = aws_vpc.app_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow HTTP"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-alb-sg"
  })
}

# Container Security Group
resource "aws_security_group" "app_sg" {
  name        = "${local.name_prefix}-app-sg"
  description = "Security group for the application"
  vpc_id      = aws_vpc.app_vpc.id

  ingress {
    from_port       = 5000
    to_port         = 5000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
    description     = "Allow traffic from ALB"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-app-sg"
  })
}
```

_**[Screenshot Opportunity: VS Code showing the security group configuration]**_

### **Docker Optimization**

I improved the Dockerfile with a multi-stage build process to reduce the image size and improve security:

```Dockerfile
# Build stage
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy built assets from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000
ENV AWS_REGION=ap-southeast-1

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"]
```

_**[Screenshot Opportunity: Terminal showing the Docker build process with the multi-stage build]**_

I tested the Docker build process and confirmed a significant reduction in image size:

```bash
$ docker build -t oaktree:latest .
$ docker images
REPOSITORY          TAG       IMAGE ID       CREATED          SIZE
oaktree             latest    f8a3d456789e   30 seconds ago   398MB
```

_**[Screenshot Opportunity: Terminal showing the Docker images command output with the image size]**_

### **Application Development**

For the backend, I enhanced the API structure with additional endpoints:

```javascript
// server/routes/aws.js
const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({ region: process.env.AWS_REGION || 'ap-southeast-1' });

// AWS Status endpoint
router.get('/status', async (req, res) => {
  try {
    // Test AWS connectivity
    const sts = new AWS.STS();
    const data = await sts.getCallerIdentity().promise();
    
    res.json({
      status: 'connected',
      account: data.Account,
      arn: data.Arn,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
```

_**[Screenshot Opportunity: VS Code with the AWS routes file open]**_

I also implemented a simple authentication system:

```javascript
// server/routes/auth.js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Mock user database (in production, use a real database)
const users = {
  'admin': {
    passwordHash: crypto.createHash('sha256').update('admin123').digest('hex'),
    role: 'admin'
  }
};

// Login endpoint
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  
  const user = users[username];
  if (!user) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
  
  const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
  if (passwordHash !== user.passwordHash) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
  
  // In a real app, generate and return a JWT token
  res.json({
    username,
    role: user.role,
    token: 'mock-jwt-token'
  });
});

module.exports = router;
```

_**[Screenshot Opportunity: VS Code with the authentication routes file open]**_

For the frontend, I created a simple login component:

```jsx
// client/src/components/Login.jsx
import React, { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      const userData = await response.json();
      onLogin(userData);
    } catch (err) {
      setError(err.message);
    }
  };
  
  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">OakTree Admin</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">Log In</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
```

_**[Screenshot Opportunity: Browser showing the login form with the orange-gray theme]**_

### **DynamoDB Table Setup**

I added the DynamoDB table definition to the Terraform configuration:

```hcl
# DynamoDB Table
resource "aws_dynamodb_table" "users_table" {
  name         = "${local.name_prefix}-users"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "user_id"

  attribute {
    name = "user_id"
    type = "S"
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-users-table"
  })
}
```

_**[Screenshot Opportunity: AWS Console showing the created DynamoDB table]**_

## **Learning Resources I Used Today**

### **AWS Documentation:**
- [Amazon VPC User Guide](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)
- [Security Groups for Your VPC](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html)
- [Amazon DynamoDB Developer Guide](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html)

_**[Screenshot Opportunity: Browser showing the AWS VPC documentation]**_

### **Terraform Resources:**
- [AWS VPC Terraform Module](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/latest)
- [Terraform Best Practices](https://www.terraform-best-practices.com/)
- [Managing Terraform State](https://www.terraform.io/docs/language/state/index.html)

_**[Screenshot Opportunity: Browser showing the Terraform state management documentation]**_

### **Docker Resources:**
- [Docker Multi-stage Builds](https://docs.docker.com/develop/develop-images/multistage-build/)
- [Optimizing Node.js Docker Images](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [Docker Image Security Best Practices](https://docs.docker.com/engine/security/security/)

_**[Screenshot Opportunity: Browser showing the Docker multi-stage build documentation]**_

## **Challenges & Solutions**

### **Terraform State Management:**

**Challenge:** I wasn't sure about the best approach for managing Terraform state files for this project. Using local state files is simple but not good for team environments, while remote state adds complexity.

**Solution:** For this project, I'm starting with local state for simplicity. I documented the plan to migrate to an S3 backend when the project matures, including instructions for how to migrate existing state.

_**[Screenshot Opportunity: Notes or diagram showing the state management plan]**_

### **AWS Security Group Rules:**

**Challenge:** Determining the right security group rules was tricky. Too restrictive and the application might not work; too permissive and it creates security vulnerabilities.

**Solution:** I started with the principle of least privilege, only opening the specific ports needed:
- Port 80 inbound from anywhere to the ALB
- Port 5000 from the ALB to the application containers
- All outbound traffic allowed for both

_**[Screenshot Opportunity: Diagram showing the security group configuration]**_

### **Docker Image Size Optimization:**

**Challenge:** My initial Docker image was over 1GB, which would slow down deployments and increase costs.

**Solution:** Implementing a multi-stage build process reduced the image size by approximately 60% by:
- Using a slim base image for the production stage
- Only copying built assets and production dependencies
- Removing development tools and build artifacts

_**[Screenshot Opportunity: Terminal showing before/after image sizes]**_

## **What I Learned Today**

Today I gained deeper insights into:

1. How to structure Terraform code for AWS infrastructure, including proper use of variables and local values for consistency
2. The networking requirements for containerized applications in AWS, particularly the importance of security group configurations
3. Docker multi-stage build techniques that significantly reduce image size and improve security
4. How to integrate DynamoDB with a Node.js application for serverless data storage

I'm particularly proud of reducing the Docker image size by implementing multi-stage builds. This will make our deployments faster and more efficient.

## **Plans for Tomorrow**

Tomorrow, I plan to:

1. Add the ECR (Elastic Container Registry) repository to the Terraform configuration
2. Set up the ECS cluster, task definition, and service
3. Configure the Application Load Balancer
4. Start implementing the CI/CD pipeline with GitHub Actions

_**[Screenshot Opportunity: Task list or project board showing tomorrow's plan]**_

## **Conclusion**

Day 2 was highly productive! I made significant progress on both the infrastructure code and Docker configuration. The Terraform code now defines the network foundation for our application, and the Docker build process is optimized for production use. Tomorrow, I'll complete the AWS infrastructure configuration and begin work on the CI/CD pipeline.

---

**References:**
1. AWS VPC Documentation: [https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)
2. Terraform Documentation: [https://www.terraform.io/docs](https://www.terraform.io/docs)
3. Docker Multi-stage Builds: [https://docs.docker.com/develop/develop-images/multistage-build/](https://docs.docker.com/develop/develop-images/multistage-build/)
4. Node.js Security Practices: [https://nodejs.org/en/docs/guides/security/](https://nodejs.org/en/docs/guides/security/)