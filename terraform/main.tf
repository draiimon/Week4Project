provider "aws" {
  region = "ap-southeast-1"
}

# VPC Resource
resource "aws_vpc" "oaktree_vpc" {
  cidr_block       = "172.31.0.0/16"
  instance_tenancy = "default"
  
  enable_dns_support = true
  enable_dns_hostnames = true
  
  tags = {
    Name = "oaktree-vpc"
  }
}

# Public Subnets
resource "aws_subnet" "oaktree_public_a" {
  vpc_id            = aws_vpc.oaktree_vpc.id
  cidr_block        = "172.31.0.0/20"
  availability_zone = "ap-southeast-1a"
  map_public_ip_on_launch = true
  
  tags = {
    Name = "oaktree-public-subnet-a"
  }
}

resource "aws_subnet" "oaktree_public_b" {
  vpc_id            = aws_vpc.oaktree_vpc.id
  cidr_block        = "172.31.16.0/20"
  availability_zone = "ap-southeast-1b"
  map_public_ip_on_launch = true
  
  tags = {
    Name = "oaktree-public-subnet-b"
  }
}

resource "aws_subnet" "oaktree_public_c" {
  vpc_id            = aws_vpc.oaktree_vpc.id
  cidr_block        = "172.31.32.0/20"
  availability_zone = "ap-southeast-1c"
  map_public_ip_on_launch = true
  
  tags = {
    Name = "oaktree-public-subnet-c"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "oaktree_igw" {
  vpc_id = aws_vpc.oaktree_vpc.id
  
  tags = {
    Name = "oaktree-igw"
  }
}

# Route Table
resource "aws_route_table" "oaktree_public_rt" {
  vpc_id = aws_vpc.oaktree_vpc.id
  
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.oaktree_igw.id
  }
  
  tags = {
    Name = "oaktree-public-route-table"
  }
}

# Route Table Association
resource "aws_route_table_association" "oaktree_rta_a" {
  subnet_id      = aws_subnet.oaktree_public_a.id
  route_table_id = aws_route_table.oaktree_public_rt.id
}

resource "aws_route_table_association" "oaktree_rta_b" {
  subnet_id      = aws_subnet.oaktree_public_b.id
  route_table_id = aws_route_table.oaktree_public_rt.id
}

resource "aws_route_table_association" "oaktree_rta_c" {
  subnet_id      = aws_subnet.oaktree_public_c.id
  route_table_id = aws_route_table.oaktree_public_rt.id
}

# Security Group
resource "aws_security_group" "oaktree_sg" {
  name        = "oaktree-sg"
  description = "Allow inbound traffic for ECS and Load Balancer"
  vpc_id      = aws_vpc.oaktree_vpc.id
  
  # Allow HTTP traffic
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  # Allow HTTPS traffic
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  # Allow traffic on port 5000 (Express.js default)
  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name = "oaktree-security-group"
  }
}

# Application Load Balancer (ALB)
resource "aws_lb" "oaktree_alb" {
  name               = "oaktree-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.oaktree_sg.id]
  subnets            = [
    aws_subnet.oaktree_public_a.id,
    aws_subnet.oaktree_public_b.id,
    aws_subnet.oaktree_public_c.id
  ]
  enable_deletion_protection = false

  tags = {
    Name = "oaktree-alb"
  }
}

# DynamoDB Table
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

# ECR Repository
resource "aws_ecr_repository" "oaktree_repo" {
  name                 = "oaktree-cloud-app"
  image_tag_mutability = "MUTABLE"
  force_delete         = true
  
  image_scanning_configuration {
    scan_on_push = false
  }
}

# ECS Cluster - Using existing name but ensuring parameters match
resource "aws_ecs_cluster" "oaktree_cluster" {
  name = "oak-cluster"  # Changed to match what's expected
}

# IAM Role for ECS Task Execution
resource "aws_iam_role" "ecs_task_exec" {
  name = "ecsTaskExecutionRole"
  
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
}

# Attach ECS Task Execution Policy
resource "aws_iam_role_policy_attachment" "ecs_task_exec_attach" {
  role       = aws_iam_role.ecs_task_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# ECS Task Definition
resource "aws_ecs_task_definition" "oaktree_task" {
  family                   = "oaktree-task"
  execution_role_arn       = aws_iam_role.ecs_task_exec.arn
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  
  container_definitions = jsonencode([
    {
      name      = "oaktree"
      image     = "${aws_ecr_repository.oaktree_repo.repository_url}:latest"
      essential = true
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
          protocol      = "tcp"
        },
        {
          containerPort = 5000
          hostPort      = 5000
          protocol      = "tcp"
        }
      ],
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          "awslogs-group"         = "/ecs/oaktree-task",
          "awslogs-region"        = "ap-southeast-1",
          "awslogs-stream-prefix" = "ecs"
        }
      },
      environment = [
        {
          name  = "PORT",
          value = "80"
        },
        {
          name  = "NODE_ENV",
          value = "production"
        }
      ]
    }
  ])
}

# Target Group for ALB
resource "aws_lb_target_group" "oaktree_tg" {
  name     = "oaktree-target-group"
  port     = 5000         # Changed to 5000 to match Express.js port
  protocol = "HTTP"
  vpc_id   = aws_vpc.oaktree_vpc.id
  target_type = "ip"
  
  health_check {
    path                = "/"            # Using simple root path
    interval            = 20             # Reduced interval for faster health checks
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200-499"
  }
}

# ALB Listener
resource "aws_lb_listener" "oaktree_listener" {
  load_balancer_arn = aws_lb.oaktree_alb.arn
  port              = 80
  protocol          = "HTTP"
  
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.oaktree_tg.arn
  }
}

# ECS Service
resource "aws_ecs_service" "oaktree_service" {
  name            = "oaktree-service"
  cluster         = aws_ecs_cluster.oaktree_cluster.id
  task_definition = aws_ecs_task_definition.oaktree_task.arn
  desired_count   = 2
  launch_type     = "FARGATE"
  
  network_configuration {
    subnets          = [
      aws_subnet.oaktree_public_a.id,
      aws_subnet.oaktree_public_b.id,
      aws_subnet.oaktree_public_c.id
    ]
    security_groups  = [aws_security_group.oaktree_sg.id]
    assign_public_ip = true
  }
  
  load_balancer {
    target_group_arn = aws_lb_target_group.oaktree_tg.arn
    container_name   = "oaktree"
    container_port   = 5000
  }
  
  depends_on = [aws_lb_listener.oaktree_listener]
}

# Output Values
output "dynamodb_table_name" {
  value = aws_dynamodb_table.oaktree_users.name
}

output "vpc_id" {
  value = aws_vpc.oaktree_vpc.id
}

output "subnet_ids" {
  value = [
    aws_subnet.oaktree_public_a.id,
    aws_subnet.oaktree_public_b.id,
    aws_subnet.oaktree_public_c.id
  ]
}

output "internet_gateway_id" {
  value = aws_internet_gateway.oaktree_igw.id
}

output "alb_dns_name" {
  value = aws_lb.oaktree_alb.dns_name
}

output "ecr_repository_url" {
  value = aws_ecr_repository.oaktree_repo.repository_url
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.oaktree_cluster.name
}

output "ecs_service_name" {
  value = aws_ecs_service.oaktree_service.name
}

output "task_execution_role_arn" {
  value = aws_iam_role.ecs_task_exec.arn
}