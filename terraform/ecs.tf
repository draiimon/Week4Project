# ECS Cluster
resource "aws_ecs_cluster" "oak_cluster" {
  name = "${local.name_prefix}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = local.common_tags
}

# ECS Task Definition
resource "aws_ecs_task_definition" "oak_task" {
  family                   = "${local.name_prefix}-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = "arn:aws:iam::321225686735:role/ecsTaskExecutionRole"
  task_role_arn            = "arn:aws:iam::321225686735:role/ecsTaskExecutionRole"

  container_definitions = jsonencode([{
    name      = "${local.name_prefix}-container"
    image     = "draiimon/oaktree:latest" # Using DockerHub image instead of ECR
    essential = true
    
    portMappings = [{
      containerPort = 5000
      hostPort      = 5000
      protocol      = "tcp"
    }]

    environment = [
      {
        name  = "NODE_ENV"
        value = var.environment
      },
      {
        name  = "AWS_REGION"
        value = var.aws_region
      },
      {
        name  = "USE_AWS_DB" 
        value = "true"
      }
    ]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = "/ecs/${local.name_prefix}"
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "ecs"
      }
    }
  }])

  tags = local.common_tags
}

# ECS Service
resource "aws_ecs_service" "oak_service" {
  name            = "${local.name_prefix}-service"
  cluster         = aws_ecs_cluster.oak_cluster.id
  task_definition = aws_ecs_task_definition.oak_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.public_subnet_1.id, aws_subnet.public_subnet_2.id]
    security_groups  = [aws_security_group.oak_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.oak_tg.arn
    container_name   = "${local.name_prefix}-container"
    container_port   = 5000
  }

  depends_on = [aws_lb_listener.oak_listener]

  tags = local.common_tags
}