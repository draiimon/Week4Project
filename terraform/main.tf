
locals {
  name_prefix = "${var.app_name}-${var.environment}"
  common_tags = {
    Project     = var.app_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

# Network Module
module "network" {
  source = "./modules/network"

  region      = var.aws_region
  name_prefix = local.name_prefix
  common_tags = local.common_tags
  vpc_cidr    = "10.0.0.0/16"
  subnet_cidrs = ["10.0.1.0/24", "10.0.2.0/24"]
}

# Database Module
module "database" {
  source = "./modules/database"

  name_prefix = local.name_prefix
  common_tags = local.common_tags
  table_name  = var.dynamodb_table_name
}

# Monitoring Module
module "monitoring" {
  source = "./modules/monitoring"

  name_prefix       = local.name_prefix
  common_tags       = local.common_tags
  log_retention_days = 30
}

# Load Balancer Module
module "loadbalancer" {
  source = "./modules/loadbalancer"

  name_prefix        = local.name_prefix
  common_tags        = local.common_tags
  security_group_id  = module.network.security_group_id
  subnet_ids         = module.network.subnet_ids
  vpc_id             = module.network.vpc_id
  target_port        = 5000
  health_check_path  = "/"
}

# Compute Module
module "compute" {
  source = "./modules/compute"

  name_prefix        = local.name_prefix
  project_name       = var.project_name
  common_tags        = local.common_tags
  region             = var.aws_region
  environment        = var.environment
  execution_role_arn = "arn:aws:iam::321225686735:role/ecsTaskExecutionRole"
  task_role_arn      = "arn:aws:iam::321225686735:role/ecsTaskExecutionRole"
  container_image    = "draiimon/oaktree:latest"
  container_port     = 5000
  desired_count      = 1
  subnet_ids         = module.network.subnet_ids
  security_group_id  = module.network.security_group_id
  target_group_arn   = module.loadbalancer.target_group_arn
  lb_listener_arn    = module.loadbalancer.listener_arn
  log_group_name     = module.monitoring.log_group_name
}