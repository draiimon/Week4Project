# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "oak_logs" {
  name              = "/ecs/${var.name_prefix}"
  retention_in_days = var.log_retention_days

  tags = var.common_tags
}