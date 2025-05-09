output "cluster_id" {
  description = "ID of the ECS cluster"
  value       = aws_ecs_cluster.oak_cluster.id
}

output "cluster_name" {
  description = "Name of the ECS cluster"
  value       = aws_ecs_cluster.oak_cluster.name
}

output "task_definition_arn" {
  description = "ARN of the ECS task definition"
  value       = aws_ecs_task_definition.oak_task.arn
}

output "service_name" {
  description = "Name of the ECS service"
  value       = aws_ecs_service.oak_service.name
}