variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "ap-southeast-1"
}

variable "environment" {
  description = "Environment name (e.g. dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "vpc_id" {
  description = "VPC ID where resources will be deployed"
  type        = string
  default     = "vpc-06845c6fc8ee58831"
}

variable "subnet_ids" {
  description = "Subnet IDs where ECS tasks will run"
  type        = list(string)
  default     = [
    "subnet-0f3ba0093dfbed64a",
    "subnet-0b547561bac6c234c",
    "subnet-0a05d6a1b3630dca1"
  ]
}

variable "security_group_id" {
  description = "Security Group ID for the resources"
  type        = string
  default     = "sg-07eefbba6c112565c"
}

variable "internet_gateway_id" {
  description = "Internet Gateway ID"
  type        = string
  default     = "igw-009b817b22bbfe6c7"
}

variable "allowed_cidr_blocks" {
  description = "CIDR blocks allowed to access resources"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}