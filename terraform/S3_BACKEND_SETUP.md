# Setting Up S3 Backend for Terraform

This guide explains how to set up an S3 backend for Terraform state management properly.

## Step 1: Create IAM Policy

Create an IAM policy with the following permissions:

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

## Step 2: Attach Policy to IAM User

1. Go to AWS IAM Console
2. Find the user whose access keys are being used for Terraform
3. Attach the policy created in Step 1 to this user

## Step 3: Create S3 Bucket and DynamoDB Table

Run the `setup-backend.sh` script to create the required infrastructure:

```bash
cd terraform
chmod +x setup-backend.sh
./setup-backend.sh
```

## Step 4: Enable S3 Backend in Terraform

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

## Step 5: Initialize Terraform with Backend

Run the following command to initialize Terraform with the S3 backend:

```bash
terraform init -backend-config="access_key=YOUR_ACCESS_KEY" -backend-config="secret_key=YOUR_SECRET_KEY"
```

## Common Issues

### 403 Forbidden Error

If you receive a 403 Forbidden error when trying to access the S3 bucket:

1. Verify that the IAM user has the required permissions (Step 1)
2. Check that the bucket exists and is in the correct region
3. Ensure that the AWS credentials being used are correct
4. Verify that the bucket name is globally unique and matches the configuration