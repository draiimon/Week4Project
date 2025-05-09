# ALB
resource "aws_lb" "oak_alb" {
  name               = "${local.name_prefix}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.oak_sg.id]
  subnets            = [aws_subnet.public_subnet_1.id, aws_subnet.public_subnet_2.id]

  tags = local.common_tags
}

# ALB Target Group
resource "aws_lb_target_group" "oak_tg" {
  name        = "${local.name_prefix}-tg"
  port        = 5000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.oak_vpc.id
  target_type = "ip"

  health_check {
    path                = "/"
    port                = "traffic-port"
    healthy_threshold   = 3
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    matcher             = "200-299"
  }

  tags = local.common_tags
}

# ALB Listener
resource "aws_lb_listener" "oak_listener" {
  load_balancer_arn = aws_lb.oak_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.oak_tg.arn
  }

  tags = local.common_tags
}