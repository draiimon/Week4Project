# OakTree Infrastructure as Code (Terraform)

This directory contains Terraform configurations to provision the AWS infrastructure required for the OakTree DevOps project.

## Infrastructure Components

The Terraform configuration provisions the following AWS resources:

1. **DynamoDB Table**: For user data storage
2. **Cognito User Pool**: For user authentication and management
3. **ECS Cluster and Service**: For container deployment
4. **ECR Repository**: For storing Docker images
5. **IAM Roles and Policies**: For proper access control
6. **CloudWatch Log Group**: For application logging
7. **Security Group**: For network access control

## Prerequisites

- [Terraform](https://www.terraform.io/downloads.html) (v1.0.0 or newer)
- AWS CLI configured with appropriate credentials
- AWS account with required permissions

## Configuration

The `terraform.tfvars` file is already configured with your specific AWS account details:

```hcl
aws_region = "us-east-1"  # North Virginia region
environment = "dev"       # Development environment

# Using real VPC and subnet IDs from your AWS account
vpc_id     = "vpc-08c05f6fe25301574"  # dev-vpc
subnet_ids = [
  "subnet-0e73b48f3a4fdf622",  # dev-public-subnet-1
  "subnet-0b61cb00a422a00c0"   # dev-public-subnet-2
]

allowed_cidr_blocks = ["0.0.0.0/0"]  # Note: Restrict this in production
```

## Usage

Follow these steps to deploy the infrastructure:

1. **Initialize Terraform**:
   ```bash
   terraform init
   ```

2. **Plan the deployment**:
   ```bash
   terraform plan
   ```

3. **Apply the configuration**:
   ```bash
   terraform apply
   ```

4. **To destroy the infrastructure**:
   ```bash
   terraform destroy
   ```

## Outputs

After successful deployment, Terraform will output important resource identifiers that you'll need to configure the application:

- `dynamodb_table_name`: Name of the DynamoDB table
- `cognito_user_pool_id`: ID of the Cognito User Pool
- `cognito_client_id`: ID of the Cognito User Pool Client
- `ecr_repository_url`: URL of the ECR repository
- `ecs_cluster_name`: Name of the ECS cluster
- `ecs_service_name`: Name of the ECS service

These values should be used to set the appropriate environment variables in your CI/CD pipeline and application configuration.

## Security Notes

- The default configuration is suitable for development but should be hardened for production use
- Review and restrict the IAM permissions to follow the principle of least privilege
- Consider using AWS KMS for encrypting sensitive data in DynamoDB
- Update the security group rules to restrict access as needed