variable "table_name" {
  description = "Name of the DynamoDB table"
  type        = string
  default     = "OakTreeUsers"
}

variable "name_prefix" {
  description = "Prefix for resource names"
  type        = string
}

variable "common_tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
}