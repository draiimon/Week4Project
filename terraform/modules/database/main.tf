# DynamoDB Table for Users - Using existing table
resource "aws_dynamodb_table" "oak_users_table" {
  name         = var.table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "username"

  attribute {
    name = "username"
    type = "S"
  }

  tags = merge(var.common_tags, {
    Name = "${var.name_prefix}-users-table"
  })
  
  # Ignore changes since we're importing an existing table
  lifecycle {
    ignore_changes = all
  }
}