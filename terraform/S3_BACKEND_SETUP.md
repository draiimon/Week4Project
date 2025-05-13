# Setting Up S3 Backend for Terraform

This guide explains how to set up an S3 backend for Terraform state management properly.

## Overview

The S3 backend setup is now handled through Terraform itself using the following approach:

1. Temporarily use local state to create the S3 bucket and DynamoDB table
2. Create these resources using Terraform
3. Switch to using the S3 backend after the resources exist

## Required IAM Permissions

The IAM user/role used for Terraform operations needs these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::terraform-state-bucket-drei",
        "arn:aws:s3:::terraform-state-bucket-drei/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:DeleteItem",
        "dynamodb:DescribeTable",
        "dynamodb:CreateTable"
      ],
      "Resource": "arn:aws:dynamodb:ap-southeast-1:*:table/terraform-locks-db-drei"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:CreateBucket",
        "s3:ListAllMyBuckets",
        "s3:PutBucketVersioning",
        "s3:PutEncryptionConfiguration"
      ],
      "Resource": "*"
    }
  ]
}
```

## Manual Setup Process

If you're setting up the backend manually, follow these steps:

### Step 1: Create S3 Bucket and DynamoDB Table

First, use Terraform with local state to create the needed resources:

```bash
cd terraform
terraform init
terraform apply -target=aws_s3_bucket.terraform_state -target=aws_dynamodb_table.terraform_locks -auto-approve
```

### Step 2: Enable S3 Backend in Terraform

Uncomment the S3 backend configuration in `providers.tf`:

```hcl
backend "s3" {
  bucket         = "terraform-state-bucket-drei"
  key            = "oaktree/terraform.tfstate"
  region         = "ap-southeast-1"
  dynamodb_table = "terraform-locks-db-drei"
  encrypt        = true
}
```

### Step 3: Reinitialize Terraform with S3 Backend

Initialize Terraform with the S3 backend and migrate the state:

```bash
terraform init -force-copy -backend-config="access_key=YOUR_ACCESS_KEY" -backend-config="secret_key=YOUR_SECRET_KEY"
```

## CI/CD Pipeline Integration

The GitHub Actions workflow in `.github/workflows/ci-cd.yml` handles the complete process automatically:

1. It first uses local state to create the S3 bucket and DynamoDB table
2. It then enables the S3 backend configuration in the Terraform files
3. Finally, it initializes Terraform with the S3 backend using credentials from GitHub Secrets

This approach ensures the infrastructure for remote state is created before attempting to use it, eliminating the chicken-and-egg problem.

## Common Issues

### 403 Forbidden Error

If you receive a 403 Forbidden error when trying to access the S3 bucket:

1. Check that the bucket exists in the correct region
2. Verify the IAM user has all the required permissions
3. Ensure the AWS credentials being used are correct
4. Verify that the bucket name matches exactly in all configurations