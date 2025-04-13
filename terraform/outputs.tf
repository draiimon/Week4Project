output "dynamodb_table_name" {
  description = "Name of the DynamoDB table"
  value       = aws_dynamodb_table.oaktree_users.name
}

output "vpc_id" {
  description = "ID of the VPC"
  value       = data.aws_vpc.oak_vpc.id
}

output "subnet_ids" {
  description = "IDs of the subnets"
  value       = [
    data.aws_subnet.oak_subnet_a.id,
    data.aws_subnet.oak_subnet_b.id,
    data.aws_subnet.oak_subnet_c.id
  ]
}

output "internet_gateway_id" {
  description = "ID of the Internet Gateway"
  value       = data.aws_internet_gateway.oak_igw.id
}

output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = aws_lb.oak_alb.dns_name
}

output "ecs_cluster_arn" {
  description = "ARN of the ECS cluster"
  value       = aws_ecs_cluster.oak_cluster.arn
}

output "ecs_task_definition_arn" {
  description = "ARN of the ECS task definition"
  value       = aws_ecs_task_definition.oak_task.arn
}

output "ecs_service_id" {
  description = "ID of the ECS service"
  value       = aws_ecs_service.oak_service.id
}

output "security_group_id" {
  description = "ID of the security group"
  value       = data.aws_security_group.default.id
}