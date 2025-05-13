variable "name_prefix" {
  description = "Prefix for resource names"
  type        = string
}

variable "common_tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
}

variable "log_retention_days" {
  description = "Number of days to retain logs"
  type        = number
  default     = 30
}