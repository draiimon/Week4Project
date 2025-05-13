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

## Automated Backend Setup

The S3 backend for Terraform state is automatically configured in the CI/CD pipeline:

1. The GitHub Actions workflow runs `setup-backend.sh` before `terraform init`
2. The script creates the S3 bucket and DynamoDB table if they don't exist
3. Terraform is initialized with credentials from GitHub Secrets

## Manual Setup Instructions

For manual setup, please refer to the detailed instructions in [S3_BACKEND_SETUP.md](S3_BACKEND_SETUP.md).

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