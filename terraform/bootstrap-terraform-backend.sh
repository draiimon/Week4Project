#!/bin/bash

# Bootstrap Terraform S3 Backend
# This script creates the S3 bucket and DynamoDB table for Terraform state management,
# then configures Terraform to use them as a backend.

echo "=== Bootstrapping Terraform S3 Backend ==="

cd "$(dirname "$0")" || exit 1

# Ensure AWS credentials are available
if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
  echo "AWS credentials not found in environment variables."
  echo "Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY before running this script."
  echo "Example:"
  echo "  export AWS_ACCESS_KEY_ID=your_access_key"
  echo "  export AWS_SECRET_ACCESS_KEY=your_secret_key"
  exit 1
fi

# 1. Temporarily disable S3 backend configuration
echo "Temporarily disabling S3 backend configuration..."
cp providers.tf providers.tf.bak
sed -i 's/^\(\s*\)backend "s3" {/\1# backend "s3" {/' providers.tf
sed -i 's/^\(\s*\)  bucket/\1#  bucket/' providers.tf
sed -i 's/^\(\s*\)  key/\1#  key/' providers.tf
sed -i 's/^\(\s*\)  region/\1#  region/' providers.tf
sed -i 's/^\(\s*\)  dynamodb_table/\1#  dynamodb_table/' providers.tf
sed -i 's/^\(\s*\)  encrypt/\1#  encrypt/' providers.tf
sed -i 's/^\(\s*\)}/\1# }/' providers.tf

# 2. Initialize Terraform with local state
echo "Initializing Terraform with local state..."
terraform init

# 3. Create S3 bucket and DynamoDB table
echo "Creating S3 bucket and DynamoDB table for Terraform state..."
terraform apply -target=aws_s3_bucket.terraform_state -target=aws_dynamodb_table.terraform_locks -auto-approve

if [ $? -ne 0 ]; then
  echo "Failed to create backend infrastructure. Restoring original configuration."
  mv providers.tf.bak providers.tf
  exit 1
fi

# 4. Restore S3 backend configuration
echo "Re-enabling S3 backend configuration..."
mv providers.tf.bak providers.tf

# 5. Reinitialize Terraform with S3 backend
echo "Initializing Terraform with S3 backend..."
terraform init -force-copy

echo "=== Terraform S3 Backend Bootstrap Complete ==="
echo "Your Terraform state is now stored in the S3 bucket: terraform-state-bucket-drei"
echo "with locking provided by DynamoDB table: terraform-locks-db-drei"