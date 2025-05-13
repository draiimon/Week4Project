# OakTree Infrastructure

This repository contains Terraform configuration for the OakTree DevOps platform infrastructure on AWS.

## Architecture

The infrastructure consists of the following components:

- VPC with public subnets
- Application Load Balancer
- ECS Fargate for containerized application deployment
- DynamoDB for database storage
- CloudWatch for logging and monitoring

## State Management

This configuration uses:
- S3 bucket (`terraform-state-bucket-drei`) for storing Terraform state
- DynamoDB table (`terraform-locks-db-drei`) for state locking

## Bootstrapping S3 Backend

The S3 backend infrastructure is created using Terraform itself:

1. First, we use local state to create the S3 bucket and DynamoDB table
2. Then we switch to using the S3 backend for all subsequent operations

This solves the chicken-and-egg problem of needing the S3 bucket to exist before using it as a backend.

## CI/CD Automation

The GitHub Actions workflow automates the entire process:

1. It initializes Terraform with local state
2. Creates the S3 bucket and DynamoDB table using Terraform
3. Modifies the Terraform configuration to enable the S3 backend
4. Reinitializes Terraform to use the S3 backend with credentials from GitHub Secrets

## Manual Setup Instructions

For detailed manual setup instructions, please refer to [S3_BACKEND_SETUP.md](S3_BACKEND_SETUP.md).

## Regular Usage

Once the state management resources are set up, you can use normal Terraform commands:

```bash
# Initialize Terraform with S3 backend
terraform init -backend-config="access_key=YOUR_ACCESS_KEY" -backend-config="secret_key=YOUR_SECRET_KEY"

# Plan changes
terraform plan

# Apply changes
terraform apply

# Destroy infrastructure (when no longer needed)
terraform destroy
```

## Modules

This Terraform configuration is organized into modules:

- `network`: VPC, subnets, security groups
- `database`: DynamoDB table
- `compute`: ECS cluster, task definition, service 
- `loadbalancer`: Application Load Balancer
- `monitoring`: CloudWatch logs