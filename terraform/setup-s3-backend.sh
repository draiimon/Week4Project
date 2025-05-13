#!/bin/bash

# This script sets up the S3 backend for Terraform
# It creates the S3 bucket and DynamoDB table, then configures Terraform to use them

echo "=== Setting up S3 backend for Terraform ==="

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

# Create S3 bucket and DynamoDB table
echo "Creating S3 bucket and DynamoDB table for Terraform state..."
terraform apply -target=aws_s3_bucket.terraform_state -target=aws_dynamodb_table.terraform_locks -auto-approve

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

echo "=== S3 backend setup complete! ==="
echo "Your Terraform state is now stored in the S3 bucket: terraform-state-bucket-drei"
echo "State locking is provided by DynamoDB table: terraform-locks-db-drei"