#!/bin/bash

# This script imports existing S3 bucket and DynamoDB table for Terraform backend
# Instead of creating resources, it adds the existing ones to Terraform state

echo "=== Importing existing Terraform backend resources ==="

# Check if AWS credentials are set
if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
  echo "AWS credentials not found in environment variables."
  echo "Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY before running this script."
  echo "Example:"
  echo "  export AWS_ACCESS_KEY_ID=your_access_key"
  echo "  export AWS_SECRET_ACCESS_KEY=your_secret_key"
  exit 1
fi

# Create terraform.tfvars file with AWS credentials
echo "Creating terraform.tfvars file..."
cat > terraform.tfvars <<EOF
aws_access_key_id = "${AWS_ACCESS_KEY_ID}"
aws_secret_access_key = "${AWS_SECRET_ACCESS_KEY}"
EOF

# Temporarily comment out the backend configuration
echo "Temporarily disabling S3 backend configuration..."
sed -i 's/backend "s3" {/# backend "s3" {/' providers.tf
sed -i 's/  bucket/  # bucket/' providers.tf
sed -i 's/  key/  # key/' providers.tf
sed -i 's/  region/  # region/' providers.tf
sed -i 's/  dynamodb_table/  # dynamodb_table/' providers.tf
sed -i 's/  encrypt/  # encrypt/' providers.tf

# Initialize Terraform with local state
echo "Initializing Terraform with local state..."
terraform init

# Import existing resources
echo "Importing existing S3 bucket and DynamoDB table..."
terraform import aws_s3_bucket.terraform_state terraform-state-bucket-drei || echo "Failed to import S3 bucket, but continuing..."
terraform import aws_dynamodb_table.terraform_locks terraform-locks-db-drei || echo "Failed to import DynamoDB table, but continuing..."

# Re-enable the backend configuration
echo "Re-enabling S3 backend configuration..."
sed -i 's/# backend "s3" {/backend "s3" {/' providers.tf
sed -i 's/  # bucket/  bucket/' providers.tf
sed -i 's/  # key/  key/' providers.tf
sed -i 's/  # region/  region/' providers.tf
sed -i 's/  # dynamodb_table/  dynamodb_table/' providers.tf
sed -i 's/  # encrypt/  encrypt/' providers.tf

# Initialize Terraform with the S3 backend
echo "Initializing Terraform with S3 backend..."
terraform init -force-copy \
  -backend-config="access_key=${AWS_ACCESS_KEY_ID}" \
  -backend-config="secret_key=${AWS_SECRET_ACCESS_KEY}"

echo "=== Backend resources import complete! ==="
echo "You can now use Terraform with existing S3 bucket: terraform-state-bucket-drei"
echo "And DynamoDB table: terraform-locks-db-drei"