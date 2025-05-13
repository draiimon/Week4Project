#!/bin/bash

# This script sets up the S3 backend infrastructure for Terraform state management

echo "Setting up Terraform backend infrastructure..."

# Set AWS region
export AWS_DEFAULT_REGION=ap-southeast-1

# Create S3 bucket for Terraform state if it doesn't exist
echo "Creating S3 bucket for Terraform state..."
aws s3api create-bucket \
    --bucket terraform-state-bucket-drei \
    --region ap-southeast-1 \
    --create-bucket-configuration LocationConstraint=ap-southeast-1

# Enable versioning on the S3 bucket
echo "Enabling versioning on S3 bucket..."
aws s3api put-bucket-versioning \
    --bucket terraform-state-bucket-drei \
    --versioning-configuration Status=Enabled

# Enable server-side encryption on the S3 bucket
echo "Enabling encryption on S3 bucket..."
aws s3api put-bucket-encryption \
    --bucket terraform-state-bucket-drei \
    --server-side-encryption-configuration '{
        "Rules": [
            {
                "ApplyServerSideEncryptionByDefault": {
                    "SSEAlgorithm": "AES256"
                }
            }
        ]
    }'

# Create DynamoDB table for state locking if it doesn't exist
echo "Creating DynamoDB table for Terraform state locking..."
aws dynamodb create-table \
    --table-name terraform-locks-db-drei \
    --attribute-definitions AttributeName=LockID,AttributeType=S \
    --key-schema AttributeName=LockID,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region ap-southeast-1

echo "Terraform backend infrastructure setup complete!"