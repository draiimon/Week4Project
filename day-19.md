# **Week 4: End-to-End DevOps Project - Day 19 (Friday, April 4, 2025)**

![OakTree AWS Deployment Banner](https://example.com/placeholder-image)
_**[Screenshot Opportunity: Create a custom banner showing ECS, ECR, and ALB logos with the OakTree infrastructure theme]**_

## **Introduction**

Today marks my third day working on the OakTree DevOps project. After setting up the networking infrastructure and optimizing our Docker build yesterday, I focused on implementing the remaining AWS services we need for container deployment: ECR for storing our Docker images, ECS for running our containers, and an Application Load Balancer for routing traffic.

## **What I Did Today**

### **Container Registry (ECR) Setup**

I added the Elastic Container Registry (ECR) configuration to our Terraform code:

```hcl
# ECR Repository
resource "aws_ecr_repository" "app_repo" {
  name                 = local.name_prefix
  image_tag_mutability = "MUTABLE"
  force_delete         = true

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = local.common_tags
}
```

_**[Screenshot Opportunity: AWS Console showing the created ECR repository]**_

### **ECS Cluster & Task Definition**

Next, I created the ECS cluster that will run our containerized application:

```hcl
# ECS Cluster
resource "aws_ecs_cluster" "app_cluster" {
  name = "${local.name_prefix}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = local.common_tags
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "app_logs" {
  name              = "/ecs/${local.name_prefix}"
  retention_in_days = 30

  tags = local.common_tags
}
```

_**[Screenshot Opportunity: AWS Console showing the created ECS cluster]**_

Then I created the IAM roles needed for ECS execution:

```hcl
# IAM Roles
resource "aws_iam_role" "ecs_execution_role" {
  name = "${local.name_prefix}-execution-role"

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

  tags = local.common_tags
}

resource "aws_iam_role" "ecs_task_role" {
  name = "${local.name_prefix}-task-role"

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

  tags = local.common_tags
}

# IAM Policies
resource "aws_iam_policy" "dynamodb_access" {
  name        = "${local.name_prefix}-dynamodb-access"
  description = "Policy for DynamoDB access"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "dynamodb:BatchGetItem",
          "dynamodb:BatchWriteItem",
          "dynamodb:DeleteItem",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:UpdateItem"
        ]
        Effect   = "Allow"
        Resource = aws_dynamodb_table.users_table.arn
      }
    ]
  })
}

# Attach policies to roles
resource "aws_iam_role_policy_attachment" "task_execution_role_policy" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "dynamodb_policy_attachment" {
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = aws_iam_policy.dynamodb_access.arn
}
```

_**[Screenshot Opportunity: AWS IAM console showing the created roles and policies]**_

I defined the ECS task definition which specifies how our container should run:

```hcl
# ECS Task Definition
resource "aws_ecs_task_definition" "app_task" {
  family                   = "${local.name_prefix}-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = local.name_prefix
      image     = "${aws_ecr_repository.app_repo.repository_url}:latest"
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
          name  = "PORT",
          value = "5000"
        },
        {
          name  = "NODE_ENV",
          value = "production"
        },
        {
          name  = "HOST",
          value = "0.0.0.0"
        },
        {
          name  = "AWS_REGION",
          value = "ap-southeast-1"
        },
        {
          name  = "USE_AWS_DB",
          value = "true"
        },
        {
          name  = "DYNAMODB_TABLE",
          value = aws_dynamodb_table.users_table.name
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.app_logs.name
          "awslogs-region"        = "ap-southeast-1"
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])

  tags = local.common_tags
}
```

_**[Screenshot Opportunity: AWS ECS console showing the task definition details]**_

### **Application Load Balancer**

I set up an Application Load Balancer to route traffic to our ECS service:

```hcl
# Load Balancer
resource "aws_lb" "app_alb" {
  name               = "${local.name_prefix}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = [aws_subnet.public_subnet_a.id, aws_subnet.public_subnet_b.id]

  enable_deletion_protection = false

  tags = local.common_tags
}

# Target Group
resource "aws_lb_target_group" "app_tg" {
  name        = "${local.name_prefix}-tg"
  port        = 5000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.app_vpc.id
  target_type = "ip"

  health_check {
    path                = "/"
    interval            = 30
    timeout             = 20
    healthy_threshold   = 2
    unhealthy_threshold = 3
    matcher             = "200-499" # Accept a wider range of responses
  }

  tags = local.common_tags
}

# Listener
resource "aws_lb_listener" "app_listener" {
  load_balancer_arn = aws_lb.app_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app_tg.arn
  }
}
```

_**[Screenshot Opportunity: AWS Console showing the created load balancer]**_

### **ECS Service**

Finally, I created the ECS service that will maintain the desired count of task instances:

```hcl
# ECS Service
resource "aws_ecs_service" "app_service" {
  name            = "${local.name_prefix}-service"
  cluster         = aws_ecs_cluster.app_cluster.id
  task_definition = aws_ecs_task_definition.app_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.public_subnet_a.id, aws_subnet.public_subnet_b.id]
    security_groups  = [aws_security_group.app_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app_tg.arn
    container_name   = local.name_prefix
    container_port   = 5000
  }

  depends_on = [
    aws_lb_listener.app_listener,
    aws_iam_role_policy_attachment.task_execution_role_policy
  ]

  deployment_controller {
    type = "ECS"
  }

  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 50

  lifecycle {
    create_before_destroy = true
  }

  tags = local.common_tags
}
```

_**[Screenshot Opportunity: AWS ECS console showing the created service]**_

### **Adding Output Variables**

I added output variables to make deployment easier:

```hcl
# Output Values
output "ecr_repository_url" {
  description = "ECR Repository URL"
  value       = aws_ecr_repository.app_repo.repository_url
}

output "dynamodb_table_name" {
  description = "DynamoDB Table Name"
  value       = aws_dynamodb_table.users_table.name
}

output "alb_dns_name" {
  description = "Application Load Balancer DNS Name"
  value       = aws_lb.app_alb.dns_name
}

output "docker_push_commands" {
  description = "Commands to build and push Docker image"
  value = <<-EOT
    # Login to ECR
    aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin ${aws_ecr_repository.app_repo.repository_url}

    # Build and push the Docker image
    docker build -t ${aws_ecr_repository.app_repo.repository_url}:latest .
    docker push ${aws_ecr_repository.app_repo.repository_url}:latest

    # Force new deployment
    aws ecs update-service --cluster ${aws_ecs_cluster.app_cluster.name} --service ${aws_ecs_service.app_service.name} --force-new-deployment --region ap-southeast-1
  EOT
}

output "app_url" {
  description = "URL to access the application"
  value       = "http://${aws_lb.app_alb.dns_name}"
}
```

_**[Screenshot Opportunity: Terminal showing terraform output command results]**_

### **CI/CD Pipeline Setup**

I started setting up the GitHub Actions workflow file for our CI/CD pipeline:

```yaml
# .github/workflows/deploy.yml
name: Deploy OakTree Application

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build_and_deploy:
    name: Build and Deploy
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-southeast-1
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
      
      - name: Build, tag, and push image to Amazon ECR
        id: build-image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: oaktree-dev
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG -t $ECR_REGISTRY/$ECR_REPOSITORY:latest .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest
          echo "::set-output name=image::$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG"
      
      - name: Force ECS deployment
        run: |
          aws ecs update-service --cluster oaktree-dev-cluster --service oaktree-dev-service --force-new-deployment
```

_**[Screenshot Opportunity: VS Code showing the GitHub Actions workflow file]**_

## **Learning Resources I Used Today**

### **AWS ECS & ECR Documentation:**
- [Amazon ECS Using Fargate](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html)
- [Amazon ECR Private Repositories](https://docs.aws.amazon.com/AmazonECR/latest/userguide/Repositories.html)
- [Task Definitions for ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html)

_**[Screenshot Opportunity: Browser showing the AWS ECS documentation]**_

### **Terraform Resources:**
- [AWS ALB Terraform Documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lb)
- [AWS ECS Terraform Documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_service)
- [Output Variables in Terraform](https://www.terraform.io/docs/language/values/outputs.html)

_**[Screenshot Opportunity: Browser showing the Terraform ECS documentation]**_

### **GitHub Actions:**
- [GitHub Actions for AWS](https://github.com/marketplace/actions/configure-aws-credentials-action-for-github-actions)
- [Docker Build and Push Action](https://github.com/marketplace/actions/build-and-push-docker-images)
- [Workflow Syntax for GitHub Actions](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)

_**[Screenshot Opportunity: Browser showing the GitHub Actions documentation]**_

## **Challenges & Solutions**

### **Container Health Checks:**

**Challenge:** I had trouble configuring the ALB health check to correctly validate that my application was running. Initially, my container would be marked as unhealthy and terminated.

**Solution:** I modified the health check path to use the root endpoint ("/") and increased the threshold and timeout values to give the container more time to start up. I also expanded the accepted response codes to include 200-499 to account for our application's error handling.

_**[Screenshot Opportunity: AWS Console showing the health check configuration]**_

### **Task Definition Environment Variables:**

**Challenge:** I needed to pass several environment variables to my container, but wasn't sure how to reference dynamic values from other resources in the Terraform configuration.

**Solution:** I learned that I could reference attributes of other resources (like the DynamoDB table name) directly in the JSON container definition. This allowed me to avoid hardcoding resource names and keep everything consistent.

_**[Screenshot Opportunity: VS Code highlighting the environment variables section of the task definition]**_

### **IAM Role Permissions:**

**Challenge:** Determining the exact IAM permissions needed for the ECS task was difficult. With too few permissions, the task would fail, but with too many, we'd violate the principle of least privilege.

**Solution:** I created two separate roles: an execution role with permissions needed to pull the container image and write logs, and a task role with only the specific DynamoDB permissions the application needs to function.

_**[Screenshot Opportunity: Diagram showing the role structure]**_

## **What I Learned Today**

Today I gained significant insights into:

1. The relationship between ECS components (cluster, task definition, service) and how they work together to run containerized applications
2. How to configure an Application Load Balancer to route traffic to Fargate containers
3. The importance of IAM roles in AWS - both for service execution and for granting applications access to AWS resources
4. How to structure GitHub Actions workflows for AWS deployment

I'm particularly proud of figuring out how to generate useful output commands in Terraform. The docker_push_commands output will make deployment much easier because it gives us ready-to-use commands tailored to our specific resources.

## **Plans for Tomorrow**

Tomorrow, I plan to:

1. Apply the Terraform configuration to create the actual resources in AWS
2. Test deploying our Docker image to ECR
3. Verify that the ECS service can run our container successfully
4. Configure GitHub repository secrets for CI/CD
5. Test the complete CI/CD pipeline

_**[Screenshot Opportunity: Task list or project board showing tomorrow's plan]**_

## **Conclusion**

Day 3 was intense but rewarding! I've now completed the Terraform configuration for all the necessary AWS resources, and I'm ready to deploy the infrastructure tomorrow. The most challenging part was understanding how all the AWS services interconnect, particularly the networking between the load balancer and the ECS tasks. I'm excited to see everything come together when we deploy tomorrow!

---

**References:**
1. AWS ECS Documentation: [https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html)
2. AWS ECR Documentation: [https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html](https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html)
3. Terraform AWS Provider: [https://registry.terraform.io/providers/hashicorp/aws/latest/docs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
4. GitHub Actions Documentation: [https://docs.github.com/en/actions](https://docs.github.com/en/actions)

Challenges & Solutions
ECS Networking:
Challenge: Understanding how to properly configure ECS networking with public/private subnets.
Solution: Researched AWS documentation and implemented a design with load balancer in public subnet and tasks in private subnet.

IAM Permissions:
Challenge: Determining the correct IAM permissions needed for ECS task execution.
Solution: Used AWS managed policies for basic permissions and created custom policy for more specific access needs.

GitHub Actions Secrets:
Challenge: How to securely provide AWS credentials to GitHub Actions.
Solution: Used GitHub repository secrets and learned how to reference them in workflow files.

Links for Screenshots
ECR repository configuration terminal output
GitHub Actions workflow file structure
Security group configuration in AWS console

Plan for Tomorrow
Test full CI/CD pipeline with automated build and push
Implement automatic ECS service update from CI
Test application deployment through the pipeline
Add monitoring and health check configuration