# **Week 4: End-to-End DevOps Project - Day 19 (Friday, April 4, 2025)**

## **Introduction**

Today marks my third day working on the OakTree DevOps project. After establishing the foundation with basic infrastructure code and Docker configuration, I dedicated today to expanding the AWS service configuration and implementing the container registry and orchestration components. This day was particularly focused on ECS, ECR, and the networking infrastructure required to support a containerized application in a production environment.

## **What I Did Today**

### **ECR Repository Configuration:**

- Created Terraform resource for Amazon Elastic Container Registry (ECR)
- Set up repository lifecycle policies for image management
- Configured image scanning for security vulnerability detection
- Implemented repository permissions with IAM policies
- Added image tag immutability for deployment reliability

### **ECS Cluster Setup:**

- Created ECS cluster definition with Fargate launch type
- Defined task definitions with proper CPU and memory allocation
- Configured ECS service with desired task count and deployment parameters
- Set up service auto-scaling configuration with scaling policies
- Added CloudWatch logging for container output and monitoring

### **Network Infrastructure Enhancement:**

- Configured public and private subnets across multiple availability zones
- Set up NAT gateway for outbound connectivity from private subnets
- Implemented proper route tables for subnet traffic management
- Added VPC endpoints for AWS service access (ECR, S3, DynamoDB)
- Configured network ACLs for additional security layering

### **Load Balancer Configuration:**

- Created Application Load Balancer (ALB) resources
- Set up target groups with health check configuration
- Added listener rules for HTTP traffic routing
- Configured security groups for load balancer access
- Implemented stickiness policies and request routing

## **Resources**

### **ECS and Container Orchestration:**

- **ECS Task Definition Structure**: I learned that the task definition is the core component that defines how containers should run. It specifies the Docker image, CPU and memory requirements, port mappings, environment variables, and networking mode. Understanding the relationship between tasks, services, and clusters was critical for proper orchestration.

- **Fargate vs. EC2 Launch Types**: After researching both options, I chose Fargate for this project as it eliminates the need to manage EC2 instances and simplifies the deployment architecture. Fargate handles the underlying infrastructure while still allowing fine-grained control over task resource allocation.

- **Task Placement Strategies**: I discovered that ECS provides several strategies for task placement, including binpack, random, and spread. For our production environment, I selected the spread strategy to distribute tasks across availability zones for improved fault tolerance.

- **Service Auto-scaling**: I implemented both target tracking and step scaling policies for the ECS service. Target tracking maintains a target value for a specific CloudWatch metric (like CPU utilization), while step scaling allows for more granular scaling actions based on metric thresholds.

### **Networking and Security:**

- **VPC Design Patterns**: I studied AWS networking best practices and implemented a design with both public and private subnets. Public subnets contain only the load balancer, while private subnets host the application tasks, providing an additional security layer.

- **NAT Gateway Configuration**: I learned that NAT gateways enable outbound internet connectivity for resources in private subnets while maintaining security by blocking inbound connections. I placed a NAT gateway in each public subnet for high availability.

- **VPC Endpoints**: To optimize traffic and improve security, I configured interface and gateway endpoints for AWS services. This allows resources in private subnets to communicate with AWS services without traversing the public internet, reducing data transfer costs and potential attack vectors.

- **Security Group Chaining**: I implemented a pattern where the load balancer security group allows inbound traffic on port 80/443, and the ECS task security group only allows inbound traffic from the load balancer security group, creating a secure traffic flow.

### **Container Registry Management:**

- **ECR Image Lifecycle Policies**: I configured policies to automatically clean up unused container images after 30 days, preventing unnecessary storage costs while maintaining a history of recent deployments.

- **Vulnerability Scanning**: I enabled automatic scanning for container vulnerabilities, which examines container images for common vulnerabilities and exposures (CVEs) using the Common Vulnerability Scoring System (CVSS).

- **Image Tag Immutability**: By enabling tag immutability, I ensured that once a specific tag is pushed (like "latest"), it cannot be overwritten. This prevents deployment inconsistencies and improves auditability.

### **DevOps Practices:**

- **Immutable Infrastructure**: I designed the ECS deployment to follow immutable infrastructure principles, where new task definitions are created for changes rather than modifying existing ones. This provides a clean rollback mechanism and improves reliability.

- **Infrastructure as Code Organization**: I structured the Terraform configuration using a modular approach, separating network, compute, and storage resources into distinct files while maintaining a clear dependency hierarchy.

- **Resource Tagging Strategy**: I implemented a comprehensive tagging strategy for all AWS resources, including tags for environment, project, cost center, and owner, enabling better resource management and cost allocation.

## **Challenges & Solutions**

### **ECS Task Networking Configuration:**

- **Challenge**: Understanding the networking mode options for ECS tasks (bridge, host, awsvpc) and selecting the appropriate one for our application running on Fargate.
  
- **Solution**: After researching the options, I selected the awsvpc network mode, which gives each task its own elastic network interface and IP address. This provides the best security isolation and simplifies security group configuration, though it comes with some IP address management considerations that I documented for future scaling.

### **VPC Endpoint Configuration:**

- **Challenge**: Determining which VPC endpoints were necessary for our architecture and configuring them correctly to maintain connectivity while minimizing public internet traffic.
  
- **Solution**: I analyzed the AWS services our application interacts with and implemented gateway endpoints for S3 and DynamoDB, and interface endpoints for ECR API, ECR Docker, and CloudWatch Logs. This required careful configuration of security groups and route tables, but resulted in improved security and reduced NAT gateway data transfer costs.

### **IAM Permission Boundaries:**

- **Challenge**: Creating IAM roles with appropriate permissions for the ECS task execution while adhering to the principle of least privilege.
  
- **Solution**: I started with the AWS managed AmazonECSTaskExecutionRolePolicy and then created a custom policy for application-specific permissions like DynamoDB access. I also implemented a permission boundary for the role to ensure it couldn't be escalated to have more permissions than necessary.

### **Cross-Account ECR Access:**

- **Challenge**: Setting up the architecture to potentially support multiple AWS accounts for different environments (dev, staging, production) while allowing ECR image sharing.
  
- **Solution**: I researched and implemented cross-account ECR repository policies that would allow specific roles in other accounts to pull images. This lays the groundwork for a more sophisticated multi-account strategy as the project grows.

## **Links for Screenshots**

Today's work was primarily infrastructure development through code, but I did capture some screenshots of the initial test deployments:

- Initial ECR repository configuration in AWS console
- Task definition parameters for the container service
- VPC networking diagram showing subnet layout
- Security group configuration showing traffic flow

## **Code Snippet: Terraform ECS Task Definition**

```hcl
resource "aws_ecs_task_definition" "oaktree_app" {
  family                   = "oaktree-dev-task"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 1024
  memory                   = 2048
  
  container_definitions = jsonencode([
    {
      name      = "oaktree-app-container"
      image     = "${aws_ecr_repository.oaktree_app.repository_url}:latest"
      essential = true
      
      portMappings = [
        {
          containerPort = 5000
          hostPort      = 5000
          protocol      = "tcp"
        }
      ]
      
      environment = [
        {
          name  = "NODE_ENV"
          value = "production"
        },
        {
          name  = "PORT"
          value = "5000"
        },
        {
          name  = "AWS_REGION"
          value = "ap-southeast-1"
        },
        {
          name  = "USE_AWS_DB"
          value = "true"
        }
      ]
      
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/oaktree-dev"
          "awslogs-region"        = "ap-southeast-1"
          "awslogs-stream-prefix" = "ecs"
        }
      }
      
      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http://localhost:5000/health || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 60
      }
    }
  ])
  
  tags = {
    Name        = "oaktree-dev-task"
    Environment = "development"
    Project     = "OakTree"
    ManagedBy   = "terraform"
  }
}
```

## **Code Snippet: ECR Repository with Lifecycle Policy**

```hcl
resource "aws_ecr_repository" "oaktree_app" {
  name                 = "oaktree-dev"
  image_tag_mutability = "IMMUTABLE"
  
  image_scanning_configuration {
    scan_on_push = true
  }
  
  tags = {
    Name        = "oaktree-dev"
    Environment = "development"
    Project     = "OakTree"
    ManagedBy   = "terraform"
  }
}

resource "aws_ecr_lifecycle_policy" "oaktree_app_policy" {
  repository = aws_ecr_repository.oaktree_app.name
  
  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep last 30 images"
        selection = {
          tagStatus     = "any"
          countType     = "imageCountMoreThan"
          countNumber   = 30
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}
```

## **Plan for Tomorrow**

- Implement DynamoDB table for application data storage
- Create automated deployment pipeline with GitHub Actions
- Test complete CI/CD workflow with actual application deployment
- Add CloudWatch dashboards and alarms for monitoring
- Implement parameter store for sensitive configuration values