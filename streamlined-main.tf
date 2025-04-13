provider "aws" {
  region = "ap-southeast-1"
}

# Variables
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

locals {
  name_prefix = "${var.app_name}-${var.environment}"
  common_tags = {
    Project     = var.app_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

# VPC and Networking
resource "aws_vpc" "app_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-vpc"
  })
}

resource "aws_subnet" "public_subnet_a" {
  vpc_id                  = aws_vpc.app_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "ap-southeast-1a"
  map_public_ip_on_launch = true

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-public-subnet-a"
  })
}

resource "aws_subnet" "public_subnet_b" {
  vpc_id                  = aws_vpc.app_vpc.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "ap-southeast-1b"
  map_public_ip_on_launch = true

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-public-subnet-b"
  })
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.app_vpc.id

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-igw"
  })
}

resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.app_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-public-rt"
  })
}

resource "aws_route_table_association" "public_a" {
  subnet_id      = aws_subnet.public_subnet_a.id
  route_table_id = aws_route_table.public_route_table.id
}

resource "aws_route_table_association" "public_b" {
  subnet_id      = aws_subnet.public_subnet_b.id
  route_table_id = aws_route_table.public_route_table.id
}

# Security Groups
resource "aws_security_group" "alb_sg" {
  name        = "${local.name_prefix}-alb-sg"
  description = "Security group for ALB"
  vpc_id      = aws_vpc.app_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow HTTP"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-alb-sg"
  })
}

resource "aws_security_group" "app_sg" {
  name        = "${local.name_prefix}-app-sg"
  description = "Security group for the application"
  vpc_id      = aws_vpc.app_vpc.id

  ingress {
    from_port       = 5000
    to_port         = 5000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
    description     = "Allow traffic from ALB"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-app-sg"
  })
}

# DynamoDB Table
resource "aws_dynamodb_table" "users_table" {
  name         = "${local.name_prefix}-users"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "user_id"

  attribute {
    name = "user_id"
    type = "S"
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-users-table"
  })
}

# ECR Repository
resource "aws_ecr_repository" "app_repo" {
  name                 = local.name_prefix
  image_tag_mutability = "MUTABLE"
  force_delete         = true

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = local.common_tags
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "app_logs" {
  name              = "/ecs/${local.name_prefix}"
  retention_in_days = 30

  tags = local.common_tags
}

# IAM Roles
resource "aws_iam_role" "ecs_execution_role" {
  name = "${local.name_prefix}-execution-role"

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

  tags = local.common_tags
}

resource "aws_iam_role" "ecs_task_role" {
  name = "${local.name_prefix}-task-role"

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

  tags = local.common_tags
}

# IAM Policies
resource "aws_iam_policy" "dynamodb_access" {
  name        = "${local.name_prefix}-dynamodb-access"
  description = "Policy for DynamoDB access"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "dynamodb:BatchGetItem",
          "dynamodb:BatchWriteItem",
          "dynamodb:DeleteItem",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:UpdateItem"
        ]
        Effect   = "Allow"
        Resource = aws_dynamodb_table.users_table.arn
      }
    ]
  })
}

# Attach policies to roles
resource "aws_iam_role_policy_attachment" "task_execution_role_policy" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "dynamodb_policy_attachment" {
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = aws_iam_policy.dynamodb_access.arn
}

# ALB Resources
resource "aws_lb" "app_alb" {
  name               = "${local.name_prefix}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = [aws_subnet.public_subnet_a.id, aws_subnet.public_subnet_b.id]

  enable_deletion_protection = false

  tags = local.common_tags
}

resource "aws_lb_target_group" "app_tg" {
  name        = "${local.name_prefix}-tg"
  port        = 5000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.app_vpc.id
  target_type = "ip"

  health_check {
    path                = "/"
    interval            = 30
    timeout             = 20
    healthy_threshold   = 2
    unhealthy_threshold = 3
    matcher             = "200-499"
  }

  tags = local.common_tags
}

resource "aws_lb_listener" "app_listener" {
  load_balancer_arn = aws_lb.app_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app_tg.arn
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "app_cluster" {
  name = "${local.name_prefix}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = local.common_tags
}

# ECS Task Definition
resource "aws_ecs_task_definition" "app_task" {
  family                   = "${local.name_prefix}-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = local.name_prefix
      image     = "${aws_ecr_repository.app_repo.repository_url}:latest"
      essential = true
      
      portMappings = [
        {
          containerPort = 5000
          hostPort      = 5000
          protocol      = "tcp"
        }
      ]

      environment = [
        {
          name  = "PORT",
          value = "5000"
        },
        {
          name  = "NODE_ENV",
          value = "production"
        },
        {
          name  = "HOST",
          value = "0.0.0.0"
        },
        {
          name  = "AWS_REGION",
          value = "ap-southeast-1"
        },
        {
          name  = "USE_AWS_DB",
          value = "true"
        },
        {
          name  = "DYNAMODB_TABLE",
          value = aws_dynamodb_table.users_table.name
        },
        {
          name  = "AWS_ACCESS_KEY_ID",
          value = "AKIAUVSUK73H3ZAMDCH6"
        },
        {
          name  = "AWS_SECRET_ACCESS_KEY",
          value = "kZtcZuJ6FbQklxLW1RfCkgWHf4JGqVLyMaLXc1FA"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.app_logs.name
          "awslogs-region"        = "ap-southeast-1"
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])

  tags = local.common_tags
}

# ECS Service
resource "aws_ecs_service" "app_service" {
  name            = "${local.name_prefix}-service"
  cluster         = aws_ecs_cluster.app_cluster.id
  task_definition = aws_ecs_task_definition.app_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.public_subnet_a.id, aws_subnet.public_subnet_b.id]
    security_groups  = [aws_security_group.app_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app_tg.arn
    container_name   = local.name_prefix
    container_port   = 5000
  }

  depends_on = [
    aws_lb_listener.app_listener,
    aws_iam_role_policy_attachment.task_execution_role_policy
  ]

  deployment_controller {
    type = "ECS"
  }

  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 50

  lifecycle {
    create_before_destroy = true
  }

  tags = local.common_tags
}

# Outputs
output "ecr_repository_url" {
  description = "ECR Repository URL"
  value       = aws_ecr_repository.app_repo.repository_url
}

output "dynamodb_table_name" {
  description = "DynamoDB Table Name"
  value       = aws_dynamodb_table.users_table.name
}

output "alb_dns_name" {
  description = "Application Load Balancer DNS Name"
  value       = aws_lb.app_alb.dns_name
}

output "docker_push_commands" {
  description = "Commands to build and push Docker image"
  value = <<-EOT
    # Login to ECR
    aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin ${aws_ecr_repository.app_repo.repository_url}

    # Build and push the Docker image
    docker build -t ${aws_ecr_repository.app_repo.repository_url}:latest .
    docker push ${aws_ecr_repository.app_repo.repository_url}:latest

    # Force new deployment
    aws ecs update-service --cluster ${aws_ecs_cluster.app_cluster.name} --service ${aws_ecs_service.app_service.name} --force-new-deployment --region ap-southeast-1
  EOT
}

output "app_url" {
  description = "URL to access the application"
  value       = "http://${aws_lb.app_alb.dns_name}"
}