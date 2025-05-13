output "alb_dns_name" {
  description = "DNS name of the load balancer"
  value       = module.loadbalancer.alb_dns_name
}

output "dynamodb_table_name" {
  description = "Name of the DynamoDB table"
  value       = module.database.table_name
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = module.compute.cluster_name
}

output "ecs_service_name" {
  description = "Name of the ECS service"
  value       = module.compute.service_name
}

output "dockerhub_image" {
  description = "DockerHub image used for the application"
  value       = module.compute.dockerhub_image
}