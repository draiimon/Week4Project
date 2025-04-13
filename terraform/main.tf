provider "aws" {
  region = "ap-southeast-1"
}

# VPC Configuration (Using existing VPC)
data "aws_vpc" "oak_vpc" {
  id = "vpc-06845c6fc8ee58831"
}

# Subnets (Using existing subnets)
data "aws_subnet" "oak_subnet_a" {
  id = "subnet-0f3ba0093dfbed64a"
}

data "aws_subnet" "oak_subnet_b" {
  id = "subnet-0b547561bac6c234c"
}

data "aws_subnet" "oak_subnet_c" {
  id = "subnet-0a05d6a1b3630dca1"
}

# Internet Gateway (Using existing IGW)
data "aws_internet_gateway" "oak_igw" {
  id = "igw-009b817b22bbfe6c7"
}

# Application Load Balancer (ALB)
resource "aws_lb" "oak_alb" {
  name               = "oaktree-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = ["sg-07eefbba6c112565c"]  # Use your Security Group
  subnets            = [
    data.aws_subnet.oak_subnet_a.id,
    data.aws_subnet.oak_subnet_b.id,
    data.aws_subnet.oak_subnet_c.id
  ]
  enable_deletion_protection = false

  tags = {
    Name = "oak-alb"
  }
}

# DynamoDB Table Configuration (Existing Table)
resource "aws_dynamodb_table" "oaktree_users" {
  name            = "oaktree-users"
  hash_key        = "user_id"
  read_capacity   = 5
  write_capacity  = 5

  attribute {
    name = "user_id"
    type = "S"
  }

  billing_mode = "PROVISIONED"

  tags = {
    Name = "oaktree-users"
  }
}

# ECS Cluster Configuration
resource "aws_ecs_cluster" "oak_cluster" {
  name = "oak-cluster"
}

# ECS Task Definition
resource "aws_ecs_task_definition" "oak_task" {
  family                   = "oak-task"
  execution_role_arn       = aws_iam_role.oak_ecs_role.arn
  task_role_arn            = aws_iam_role.oak_ecs_role.arn
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  
  container_definitions = jsonencode([
    {
      name      = "oak-container"
      image     = "321225686735.dkr.ecr.ap-southeast-1.amazonaws.com/oaktree-cloud-app:latest"
      essential = true
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
        }
      ]
    }
  ])
}

# ECS Service Configuration
resource "aws_ecs_service" "oak_service" {
  name            = "oak-service"
  cluster         = aws_ecs_cluster.oak_cluster.id
  task_definition = aws_ecs_task_definition.oak_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  network_configuration {
    subnets          = [
      data.aws_subnet.oak_subnet_a.id,
      data.aws_subnet.oak_subnet_b.id,
      data.aws_subnet.oak_subnet_c.id
    ]
    assign_public_ip = true
  }
}

# IAM Role for ECS
resource "aws_iam_role" "oak_ecs_role" {
  name = "oak-ecs-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Principal = {
          Service = "ecs.amazonaws.com"
        }
      }
    ]
  })
}

# Security Group (Default Security Group)
data "aws_security_group" "default" {
  id = "sg-07eefbba6c112565c"
}

# IAM Role Policy for ECS Task Execution
resource "aws_iam_role_policy" "oak_ecs_role_policy" {
  name = "oak-ecs-role-policy"
  role = aws_iam_role.oak_ecs_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = "logs:*"
        Effect   = "Allow"
        Resource = "*"
      },
      {
        Action   = "ecs:Describe*"
        Effect   = "Allow"
        Resource = "*"
      },
      {
        Action   = "ecs:List*"
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })
}