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
- S3 bucket for storing Terraform state
- DynamoDB table for state locking

## First-Time Setup

Before you can use this Terraform configuration with remote state, you need to create the S3 bucket and DynamoDB table for state management.

### Step 1: Comment out the backend configuration

First, comment out the backend configuration in `backend.tf`:

```hcl
# terraform {
#   backend "s3" {
#     bucket         = "oaktree-terraform-state"
#     key            = "oaktree/terraform.tfstate"
#     region         = "ap-southeast-1"
#     encrypt        = true
#     dynamodb_table = "oaktree-terraform-locks"
#   }
# }
```

### Step 2: Initialize and apply the state resources

```bash
cd terraform
terraform init
terraform apply -target=aws_s3_bucket.terraform_state -target=aws_dynamodb_table.terraform_locks
```

### Step 3: Uncomment the backend configuration

Now uncomment the backend configuration in `backend.tf` and reinitialize Terraform:

```bash
# Edit backend.tf to uncomment the backend configuration
terraform init -reconfigure
```

## Regular Usage

Once the state management resources are set up, you can use normal Terraform commands:

```bash
# Initialize Terraform
terraform init

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