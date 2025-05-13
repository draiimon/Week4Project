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

variable "project_name" {
  description = "Project name for tagging"
  type        = string
  default     = "oaktree"
}

variable "aws_access_key_id" {
  description = "AWS Access Key ID"
  type        = string  
}

variable "aws_secret_access_key" {
  description = "AWS Secret Access Key"
  type        = string  
}