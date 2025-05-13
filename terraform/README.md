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

### Using Existing Backend Resources (Recommended)

This approach works when you have an explicit deny for s3:CreateBucket in your IAM policy.

The GitHub Actions workflow automatically:
1. Creates a terraform.tfvars file with AWS credentials from GitHub Secrets
2. Temporarily disables the S3 backend configuration
3. Imports the existing S3 bucket and DynamoDB table into Terraform state
4. Re-enables the S3 backend configuration
5. Initializes Terraform with the S3 backend 

For local development:

```bash
export AWS_ACCESS_KEY_ID=your_aws_access_key
export AWS_SECRET_ACCESS_KEY=your_aws_secret_key
cd terraform
./import-existing-backend.sh
```

### Creating New Backend Resources (If Allowed)

Only use this approach if your IAM policy allows creating S3 buckets and DynamoDB tables.

For local development:

```bash
export AWS_ACCESS_KEY_ID=your_aws_access_key
export AWS_SECRET_ACCESS_KEY=your_aws_secret_key
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