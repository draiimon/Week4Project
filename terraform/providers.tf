terraform {
  required_version = "1.11.4"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  # Using local state for now to avoid S3 permission issues
  # This can be enabled when proper S3 bucket permissions are set up
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
}
