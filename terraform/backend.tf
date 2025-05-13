# S3 bucket for storing Terraform state
# This S3 bucket is expected to exist and will be imported
resource "aws_s3_bucket" "terraform_state" {
  bucket = "terraform-state-bucket-drei"

  # Prevent accidental deletion of this S3 bucket
  lifecycle {
    prevent_destroy = true
    # Ignore changes to the bucket since we're importing an existing one
    ignore_changes = all
  }
}

# Enable versioning for the S3 bucket
resource "aws_s3_bucket_versioning" "terraform_state_versioning" {
  bucket = aws_s3_bucket.terraform_state.id
  versioning_configuration {
    status = "Enabled"
  }
}

# Enable server-side encryption for the S3 bucket
resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state_encryption" {
  bucket = aws_s3_bucket.terraform_state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Block all public access to the S3 bucket
resource "aws_s3_bucket_public_access_block" "terraform_state_public_access" {
  bucket = aws_s3_bucket.terraform_state.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# DynamoDB table for Terraform state locking
# This DynamoDB table is expected to exist and will be imported
resource "aws_dynamodb_table" "terraform_locks" {
  name         = "terraform-locks-db-drei"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
  
  # Ignore changes since we're importing an existing table
  lifecycle {
    ignore_changes = all
  }
}