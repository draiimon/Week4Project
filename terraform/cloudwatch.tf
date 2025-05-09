# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "oak_logs" {
  name              = "/ecs/${local.name_prefix}"
  retention_in_days = 30

  tags = local.common_tags
}