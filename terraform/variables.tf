variable "app_name" {
  description = "Name of the application"
  type        = string
  default     = "oaktree"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "ap-southeast-1"
}

variable "aws_profile" {
  description = "AWS CLI profile to use"
  type        = string
  default     = "default"
}

variable "dynamodb_table_name" {
  description = "Name of the DynamoDB table for user data"
  type        = string
  default     = "OakTreeUsers"
}