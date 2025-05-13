terraform {
  backend "s3" {
    bucket         = "oaktree-terraform-state"
    key            = "oaktree/terraform.tfstate"
    region         = "ap-southeast-1"
    encrypt        = true
    dynamodb_table = "oaktree-terraform-locks"
  }
}