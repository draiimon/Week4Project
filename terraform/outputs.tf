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

output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = aws_lb.oak_alb.dns_name
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = aws_ecs_cluster.oak_cluster.name
}

output "ecs_service_name" {
  description = "Name of the ECS service"
  value       = aws_ecs_service.oak_service.name
}

output "task_role_arn" {
  description = "ARN of the ECS task role"
  value       = aws_iam_role.oak_ecs_role.arn
}