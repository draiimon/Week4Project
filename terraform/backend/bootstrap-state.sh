#!/bin/bash

# Bootstrap Terraform State Resources
# This script sets up the S3 bucket and DynamoDB table for Terraform state management

echo "Bootstrapping Terraform state resources..."

# Create a backup of backend.tf
cp backend.tf backend.tf.bak

# Temporarily comment out backend configuration
sed -i 's/terraform {/# terraform {/' backend.tf
sed -i 's/  backend "s3" {/# backend "s3" {/' backend.tf
sed -i 's/    bucket/# bucket/' backend.tf
sed -i 's/    key/# key/' backend.tf
sed -i 's/    region/# region/' backend.tf
sed -i 's/    encrypt/# encrypt/' backend.tf
sed -i 's/    dynamodb_table/# dynamodb_table/' backend.tf
sed -i 's/  }/# }/' backend.tf
sed -i 's/}/# }/' backend.tf

# Initialize Terraform
echo "Initializing Terraform..."
terraform init

# Apply only the state resources
echo "Creating S3 bucket and DynamoDB table for state management..."
terraform apply -target=aws_s3_bucket.terraform_state -target=aws_dynamodb_table.terraform_locks

# Restore original backend configuration
echo "Restoring backend configuration..."
mv backend.tf.bak backend.tf

# Reconfigure Terraform to use the backend
echo "Reconfiguring Terraform to use S3/DynamoDB backend..."
terraform init -reconfigure

echo "Bootstrap complete! You can now use Terraform with remote state."