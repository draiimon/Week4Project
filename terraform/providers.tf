terraform {
  required_version = "1.11.4"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  # Using local state for immediate testing
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
