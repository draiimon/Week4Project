variable "name_prefix" {
  description = "Prefix for resource names"
  type        = string
}

variable "common_tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
}

variable "security_group_id" {
  description = "ID of the security group for the load balancer"
  type        = string
}

variable "subnet_ids" {
  description = "IDs of the subnets for the load balancer"
  type        = list(string)
}

variable "vpc_id" {
  description = "ID of the VPC"
  type        = string
}

variable "target_port" {
  description = "Port to which the load balancer will route traffic"
  type        = number
  default     = 5000
}

variable "health_check_path" {
  description = "Path for health check"
  type        = string
  default     = "/"
}