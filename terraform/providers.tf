terraform {
  required_version = "1.11.4"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  # Backend will be enabled after the bucket is created
  # backend "s3" {
  #   bucket         = "terraform-state-bucket-drei"
  #   key            = "oaktree/terraform.tfstate"
  #   region         = "ap-southeast-1"
  #   dynamodb_table = "terraform-locks-db-drei"
  #   encrypt        = true
  # }
}

provider "aws" {
  region = var.aws_region
  
  # Use AWS credentials from variables if provided, otherwise use the default credentials
  access_key = var.aws_access_key_id != "" ? var.aws_access_key_id : null
  secret_key = var.aws_secret_access_key != "" ? var.aws_secret_access_key : null
}
