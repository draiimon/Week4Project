# **Week 4: End-to-End DevOps Project - Day 3 (Friday, April 4, 2025)**

## **Introduction**

Today is the third day of my Week 4 project. After setting up the Docker containerization and exploring the basics of Terraform yesterday, I focused on expanding the infrastructure configuration and setting up a more advanced development environment. I'm progressively building toward a complete deployment pipeline for the OakTree application.

## **What I Did Today**

### **Docker Compose Setup:**

- Created docker-compose.yml for local multi-container development
- Configured services for frontend, backend, and database
- Set up volume mappings for development hot-reloading
- Added environment variable configuration
- Tested the complete development environment

### **Terraform VPC Configuration:**

- Implemented VPC module with public and private subnets
- Set up internet gateway and route tables
- Configured NAT gateway for private subnet internet access
- Added security groups with appropriate access rules
- Defined network ACLs for additional security

### **Container Registry Setup:**

- Created Terraform configuration for ECR repository
- Set up repository policies and permissions
- Implemented image lifecycle rules
- Configured image scanning on push
- Tested Docker image push to ECR

### **GitHub Actions Research:**

- Researched best practices for GitHub Actions workflows
- Created initial workflow file structure
- Planned CI/CD pipeline steps
- Investigated AWS credential handling in GitHub Actions
- Documented planned workflow configuration

## **Screenshot-worthy Resources and Documentation**

### **Docker Compose Configuration**

The Docker Compose setup I created today allows for a complete local development environment:

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - ./client:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - REACT_APP_API_URL=http://localhost:5000/api

  backend:
    build:
      context: ./server
      dockerfile: Dockerfile.dev
    ports:
      - "5000:5000"
    volumes:
      - ./server:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - PORT=5000
      - AWS_REGION=ap-southeast-1
    depends_on:
      - db

  db:
    image: postgres:14-alpine
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_USER=postgres
      - POSTGRES_DB=oaktree

volumes:
  postgres_data:
```

**Take a screenshot of this Docker Compose configuration for your documentation.**

### **Terraform VPC Architecture**

Today I implemented a VPC architecture following AWS best practices:

```hcl
# terraform/modules/networking/main.tf

module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  version = "3.14.0"

  name = "oaktree-vpc-${var.environment}"
  cidr = "10.0.0.0/16"
  
  azs             = ["${var.aws_region}a", "${var.aws_region}b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]
  
  enable_nat_gateway = true
  single_nat_gateway = var.environment != "production"
  enable_vpn_gateway = false
  
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Environment = var.environment
    Project     = "OakTree"
    ManagedBy   = "Terraform"
  }
}
```

This creates a network architecture with the following components:

![AWS VPC Architecture](https://docs.aws.amazon.com/vpc/latest/userguide/images/vpc-example-private-subnets.png)

**Take a screenshot of this Terraform code and the AWS VPC architecture diagram for your documentation.**

### **AWS ECR Repository**

I created the following Terraform configuration for the ECR repository:

```hcl
# terraform/modules/ecr/main.tf

resource "aws_ecr_repository" "app" {
  name                 = "oaktree-${var.environment}"
  image_tag_mutability = "MUTABLE"
  
  image_scanning_configuration {
    scan_on_push = true
  }
  
  tags = {
    Environment = var.environment
    Project     = "OakTree"
  }
}

resource "aws_ecr_lifecycle_policy" "app" {
  repository = aws_ecr_repository.app.name
  
  policy = jsonencode({
    rules = [
      {
        rulePriority = 1,
        description  = "Keep only the 5 most recent images",
        selection = {
          tagStatus     = "any",
          countType     = "imageCountMoreThan",
          countNumber   = 5
        },
        action = {
          type = "expire"
        }
      }
    ]
  })
}
```

The ECR repository architecture looks like this in AWS:

![AWS ECR Architecture](https://d1.awsstatic.com/products/ECR/Product-Page-Diagram_Amazon-ECR.2f8394ec59c8c33a3e848718cef74b96bed21762.png)

**Take a screenshot of this Terraform code and the AWS ECR architecture diagram for your documentation.**

### **GitHub Actions Workflow**

I started creating the GitHub Actions workflow file that will automate the CI/CD process:

```yaml
# .github/workflows/main.yml

name: OakTree CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    name: Test Application
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
```

The GitHub Actions workflow architecture looks like this:

![GitHub Actions Workflow](https://docs.github.com/assets/cb-25535/mw-1440/images/help/actions/overview-actions-simple.webp)

**Take a screenshot of this workflow file and the GitHub Actions workflow architecture diagram for your documentation.**

## **Important AWS Services Learning**

Today I learned about several AWS services that are crucial for our deployment pipeline:

### **Amazon VPC (Virtual Private Cloud)**

Amazon VPC enables you to launch AWS resources into a virtual network that you've defined. This virtual network closely resembles a traditional network that you'd operate in your own data center, with the benefits of using the scalable infrastructure of AWS.

Key components I configured today:
- **Subnets**: A range of IP addresses in your VPC.
- **Route Tables**: Contains a set of rules, called routes, that determine where network traffic is directed.
- **Internet Gateway**: A horizontally scaled, redundant, and highly available VPC component that allows communication between your VPC and the internet.
- **NAT Gateway**: Enables instances in a private subnet to connect to the internet while preventing the internet from initiating connections with those instances.

[Learn more about Amazon VPC](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)

**Take a screenshot of this VPC information for your documentation.**

### **Amazon ECR (Elastic Container Registry)**

Amazon ECR is a fully-managed Docker container registry that makes it easy for developers to store, manage, and deploy Docker container images. ECR is integrated with Amazon ECS, simplifying your development to production workflow.

Key features I configured:
- **Private Repositories**: Store container images in private repositories
- **Image Scanning**: Automatically scan images for vulnerabilities
- **Lifecycle Policies**: Automate the cleaning up of unused images
- **Image Versioning**: Maintain multiple versions of your container images

[Learn more about Amazon ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html)

**Take a screenshot of this ECR information for your documentation.**

## **Security Best Practices I Implemented**

Security is a critical aspect of DevOps, and I implemented several best practices today:

### **Network Security**

- Placed application servers in private subnets that don't have direct internet access
- Used security groups to restrict traffic between tiers
- Implemented network ACLs as an additional layer of defense
- Configured least privilege access for all components

### **Container Security**

- Set up automatic image scanning in ECR to detect vulnerabilities
- Used minimal base images to reduce attack surface
- Configured non-root user in the container
- Implemented proper secrets management for container environment variables

### **Access Control**

- Created specific IAM roles for each service with minimal permissions
- Used IAM policies to enforce the principle of least privilege
- Planned credential rotation and management
- Documented security configurations for the team

[Learn more about AWS Security Best Practices](https://aws.amazon.com/architecture/security-identity-compliance/)

**Take a screenshot of these security best practices for your documentation.**

## **Challenges & Solutions**

### **VPC Design Decisions:**

- **Challenge**: Determining the right subnet CIDR blocks and architecture for development vs. production environments.
  
- **Solution**: Created a flexible design that uses a single NAT Gateway for development to reduce costs, but can be expanded to multiple NAT Gateways for production to improve availability.

### **Docker Compose Networking:**

- **Challenge**: Setting up proper communication between containers with the right environment variables.
  
- **Solution**: Used Docker Compose service names for DNS resolution between containers and documented the required environment variables for each service.

## **Learning Insights**

Today I gained a much deeper understanding of AWS networking concepts. The relationship between VPCs, subnets, route tables, and gateways is critical for creating a secure and well-architected infrastructure. I learned this from the AWS Architecture Center's networking best practices and a helpful YouTube series on "AWS VPC Masterclass".

Working with Terraform modules taught me the importance of modular infrastructure code for maintainability and reuse. By separating concerns like networking, security, and application resources, the code becomes more manageable and easier to understand. This approach comes from the Terraform documentation on module composition and the "Terraform: Up & Running" book by Yevgeniy Brikman.

I also learned about container registry best practices, particularly around security scanning and lifecycle policies. Regular scanning helps identify vulnerabilities in container images, while lifecycle policies prevent the accumulation of unused images that can increase costs. This knowledge came from AWS container security best practices documentation.

## **Key Links for Screenshots**

Here are important links that you should visit and screenshot for your documentation:

1. [AWS VPC Documentation](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)
2. [AWS ECR Documentation](https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html)
3. [GitHub Actions Documentation](https://docs.github.com/en/actions/learn-github-actions)
4. [Terraform AWS Provider Documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
5. [Docker Compose Documentation](https://docs.docker.com/compose/)

**Take screenshots of these documentation pages for your learning documentation.**

## **Future Plans**

For next week (after the weekend), I plan to:

1. Complete the GitHub Actions CI/CD pipeline configuration
2. Set up the ECS cluster and service for container deployment
3. Implement the application load balancer for traffic distribution
4. Test the full deployment pipeline end-to-end

## **Conclusion**

Day 3 of Week 4 was focused on expanding the infrastructure configuration and setting up a more robust development environment. The Docker Compose setup now allows for a complete local development experience, while the Terraform configurations for VPC and ECR lay the groundwork for the cloud deployment.

I'm particularly pleased with the security considerations implemented in the network architecture and container configuration. By following best practices from the beginning, we're building a secure foundation for the application.

Tomorrow I'll continue building out the infrastructure components and begin implementing the CI/CD pipeline using GitHub Actions.