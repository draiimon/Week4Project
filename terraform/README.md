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

## Setting Up S3 Backend - Quick Start

### For GitHub CI/CD

The GitHub Actions workflow automatically:
1. Creates a terraform.tfvars file with AWS credentials from GitHub Secrets
2. Temporarily disables the S3 backend configuration
3. Creates the S3 bucket and DynamoDB table using local state
4. Re-enables the S3 backend configuration
5. Initializes Terraform with the S3 backend 

No manual steps required - just push your code to GitHub!

### For Local Development

1. Set your AWS credentials as environment variables:

```bash
export AWS_ACCESS_KEY_ID=your_aws_access_key
export AWS_SECRET_ACCESS_KEY=your_aws_secret_key
```

2. Run the setup script:

```bash
cd terraform
./setup-s3-backend.sh
```

This script:
- Creates a terraform.tfvars file with your credentials
- Creates the S3 bucket and DynamoDB table if they don't exist
- Configures Terraform to use the S3 backend

## Terraform Variables

AWS credentials are provided to Terraform using a terraform.tfvars file. For local development, you can create this file:

```bash
cd terraform
./create-terraform-variables.sh
```

## Required Permissions

The AWS user needs these permissions:
- S3 bucket creation and management
- DynamoDB table creation and management
- All permissions for resources defined in the Terraform configuration

## Regular Usage

Once the backend is set up, use normal Terraform commands:

```bash
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