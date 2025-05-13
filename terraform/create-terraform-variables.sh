#!/bin/bash

# Create terraform.tfvars file for local development

echo "=== Creating terraform.tfvars file ==="

# Check if AWS credentials are set
if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
  echo "AWS credentials not found in environment variables."
  echo "Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY before running this script."
  echo "Example:"
  echo "  export AWS_ACCESS_KEY_ID=your_access_key"
  echo "  export AWS_SECRET_ACCESS_KEY=your_secret_key"
  exit 1
fi

# Create terraform.tfvars file
cat > terraform.tfvars <<EOF
aws_access_key_id = "${AWS_ACCESS_KEY_ID}"
aws_secret_access_key = "${AWS_SECRET_ACCESS_KEY}"
EOF

echo "terraform.tfvars file created successfully!"
echo "You can now run Terraform commands with these credentials."