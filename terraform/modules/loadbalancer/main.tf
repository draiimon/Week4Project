# ALB - Using existing load balancer
resource "aws_lb" "oak_alb" {
  name               = "${var.name_prefix}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.security_group_id]
  subnets            = var.subnet_ids

  tags = var.common_tags
  
  # Ignore changes since we're importing an existing ALB
  lifecycle {
    ignore_changes = all
  }
}

# ALB Target Group - Using existing target group
resource "aws_lb_target_group" "oak_tg" {
  name        = "${var.name_prefix}-tg"
  port        = var.target_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    path                = var.health_check_path
    port                = "traffic-port"
    healthy_threshold   = 3
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    matcher             = "200-299"
  }

  tags = var.common_tags
  
  # Ignore changes since we're importing an existing target group
  lifecycle {
    ignore_changes = all
  }
}

# ALB Listener - Using existing listener
resource "aws_lb_listener" "oak_listener" {
  load_balancer_arn = aws_lb.oak_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.oak_tg.arn
  }

  tags = var.common_tags
  
  # Ignore changes since we're importing an existing listener
  lifecycle {
    ignore_changes = all
  }
}