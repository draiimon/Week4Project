provider "aws" {
  region = var.aws_region
}

# Configure DynamoDB table for users
resource "aws_dynamodb_table" "oaktree_users" {
  name           = "OakTreeUsers"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "username"

  attribute {
    name = "username"
    type = "S"
  }

  tags = {
    Name        = "OakTreeUsers"
    Environment = var.environment
    Project     = "OakTree"
  }
}

# AWS Cognito User Pool
resource "aws_cognito_user_pool" "oaktree_users" {
  name = "oaktree-user-pool-${var.environment}"

  username_attributes      = ["email"]
  auto_verify_attributes   = ["email"]
  
  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = false
    require_uppercase = true
  }

  schema {
    attribute_data_type = "String"
    name                = "email"
    required            = true
    mutable             = true
  }

  schema {
    attribute_data_type = "String"
    name                = "name"
    required            = false
    mutable             = true
  }

  tags = {
    Environment = var.environment
    Project     = "OakTree"
  }
}

# Cognito User Pool Client
resource "aws_cognito_user_pool_client" "oaktree_client" {
  name                = "oaktree-app-client"
  user_pool_id        = aws_cognito_user_pool.oaktree_users.id
  explicit_auth_flows = ["ALLOW_USER_PASSWORD_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"]
  
  prevent_user_existence_errors = "ENABLED"
  access_token_validity        = 24
  refresh_token_validity       = 30
}

# ECS Cluster for Docker Deployment
resource "aws_ecs_cluster" "oaktree_cluster" {
  name = "oaktree-cluster-${var.environment}"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Environment = var.environment
    Project     = "OakTree"
  }
}

# ECR Repository for Docker Images
resource "aws_ecr_repository" "oaktree_repository" {
  name                 = "oaktree-app-${var.environment}"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Environment = var.environment
    Project     = "OakTree"
  }
}

# Security Group for ECS Tasks
resource "aws_security_group" "ecs_tasks" {
  name        = "oaktree-ecs-tasks-sg"
  description = "Allow inbound traffic to ECS tasks"
  vpc_id      = var.vpc_id

  ingress {
    protocol    = "tcp"
    from_port   = 5000
    to_port     = 5000
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Environment = var.environment
    Project     = "OakTree"
  }
}

# ECS Task Definition
resource "aws_ecs_task_definition" "oaktree_task" {
  family                   = "oaktree-app"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  container_definitions = jsonencode([
    {
      name      = "oaktree-app"
      image     = "${aws_ecr_repository.oaktree_repository.repository_url}:latest"
      cpu       = 256
      memory    = 512
      essential = true
      portMappings = [
        {
          containerPort = 5000
          hostPort      = 5000
        }
      ]
      environment = [
        {
          name  = "NODE_ENV"
          value = "production"
        },
        {
          name  = "AWS_REGION"
          value = var.aws_region
        },
        {
          name  = "AWS_COGNITO_USER_POOL_ID"
          value = aws_cognito_user_pool.oaktree_users.id
        },
        {
          name  = "AWS_COGNITO_CLIENT_ID"
          value = aws_cognito_user_pool_client.oaktree_client.id
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/oaktree-app"
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])

  tags = {
    Environment = var.environment
    Project     = "OakTree"
  }
}

# IAM Role for ECS Task Execution
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "oaktree-ecs-task-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Environment = var.environment
    Project     = "OakTree"
  }
}

# Attach policy to ECS Task Execution Role
resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# IAM Role for ECS Task
resource "aws_iam_role" "ecs_task_role" {
  name = "oaktree-ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Environment = var.environment
    Project     = "OakTree"
  }
}

# Policy for DynamoDB access
resource "aws_iam_policy" "dynamodb_access" {
  name        = "oaktree-dynamodb-access"
  description = "Allow access to OakTree DynamoDB table"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:BatchGetItem",
          "dynamodb:BatchWriteItem",
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = [
          aws_dynamodb_table.oaktree_users.arn
        ]
      }
    ]
  })
}

# Attach DynamoDB policy to ECS Task Role
resource "aws_iam_role_policy_attachment" "ecs_task_role_dynamodb" {
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = aws_iam_policy.dynamodb_access.arn
}

# CloudWatch Log Group for ECS
resource "aws_cloudwatch_log_group" "oaktree_logs" {
  name              = "/ecs/oaktree-app"
  retention_in_days = 30

  tags = {
    Environment = var.environment
    Project     = "OakTree"
  }
}

# ECS Service
resource "aws_ecs_service" "oaktree_service" {
  name            = "oaktree-service"
  cluster         = aws_ecs_cluster.oaktree_cluster.id
  task_definition = aws_ecs_task_definition.oaktree_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.subnet_ids
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = true
  }

  tags = {
    Environment = var.environment
    Project     = "OakTree"
  }
}