terraform {
  required_version = "1.11.4"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket         = "terraform-state-bucket-8"
    key            = "terraform.tfstate"
    region         = "ap-southeast-1"
    dynamodb_table = "oaktree-terraform-locks-8"
    encrypt        = true

  }
}

provider "aws" {
  region = var.aws_region
}
