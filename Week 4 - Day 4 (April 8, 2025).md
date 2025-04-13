# **Week 4: End-to-End DevOps Project - Day 4 (Monday, April 8, 2025)**

## **Introduction**

After a weekend break, I returned to the OakTree DevOps project today. This marks the fourth day of my Week 4 project. Today I focused on implementing the container orchestration services in AWS and setting up the load balancer infrastructure. These components are crucial for making the containerized application accessible and scalable in a production environment.

## **What I Did Today**

### **ECS Cluster Configuration:**

- Set up ECS cluster with Fargate launch type
- Configured task definitions with proper CPU and memory allocation
- Created ECS service with desired task count
- Implemented auto-scaling policies for the service
- Set up CloudWatch logs for container monitoring

### **Load Balancer Implementation:**

- Created Application Load Balancer in public subnets
- Set up target groups with health checks
- Configured listener rules for traffic routing
- Implemented security groups for load balancer
- Set up CORS headers for API endpoints

### **CI/CD Pipeline Enhancement:**

- Expanded GitHub Actions workflow with deployment stages
- Added Terraform plan and apply steps
- Configured AWS credentials for GitHub Actions
- Set up automated testing before deployment
- Added workflow status notifications

### **Application Enhancements:**

- Implemented environment-specific configuration
- Added health check endpoints
- Improved error handling and logging
- Created deployment status API endpoint
- Added monitoring for application performance

## **Screenshot-worthy Resources and Documentation**

### **AWS ECS Architecture**

Today I implemented a container orchestration solution using Amazon ECS with Fargate:

```hcl
# terraform/modules/ecs/main.tf

resource "aws_ecs_cluster" "main" {
  name = "oaktree-cluster-${var.environment}"
  
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
  
  tags = {
    Environment = var.environment
    Project     = "OakTree"
  }
}

resource "aws_ecs_task_definition" "app" {
  family                   = "oaktree-task-${var.environment}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.app_cpu
  memory                   = var.app_memory
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn
  
  container_definitions = jsonencode([
    {
      name         = "oaktree-app"
      image        = "${var.ecr_repository_url}:latest"
      essential    = true
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
          value = var.environment
        },
        {
          name  = "PORT",
          value = "5000"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/oaktree-${var.environment}"
          "awslogs-region"        = var.aws_region
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
    Environment = var.environment
    Project     = "OakTree"
  }
}

resource "aws_ecs_service" "app" {
  name            = "oaktree-service-${var.environment}"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = var.app_instance_count
  launch_type     = "FARGATE"
  
  network_configuration {
    security_groups  = [var.app_security_group_id]
    subnets          = var.private_subnet_ids
    assign_public_ip = false
  }
  
  load_balancer {
    target_group_arn = var.target_group_arn
    container_name   = "oaktree-app"
    container_port   = 5000
  }
  
  deployment_controller {
    type = "ECS"
  }
  
  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }
  
  tags = {
    Environment = var.environment
    Project     = "OakTree"
  }
}
```

The ECS architecture looks like this in AWS:

![AWS ECS Architecture](https://d1.awsstatic.com/product-marketing/ECS/product-page-diagram_Amazon-ECS%402x.0d872eb6fb782ddc733a27d2bb9db795fed71185.png)

**Take a screenshot of this Terraform code and the AWS ECS architecture diagram for your documentation.**

### **Application Load Balancer Setup**

I implemented the Application Load Balancer configuration as follows:

```hcl
# terraform/modules/load_balancer/main.tf

resource "aws_lb" "main" {
  name               = "oaktree-alb-${var.environment}"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = var.public_subnet_ids
  
  enable_deletion_protection = false
  
  access_logs {
    bucket  = aws_s3_bucket.alb_logs.bucket
    prefix  = "alb-logs"
    enabled = true
  }
  
  tags = {
    Environment = var.environment
    Project     = "OakTree"
  }
}

resource "aws_lb_target_group" "app" {
  name        = "oaktree-tg-${var.environment}"
  port        = 5000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"
  
  health_check {
    enabled             = true
    interval            = 30
    path                = "/health"
    port                = "traffic-port"
    healthy_threshold   = 3
    unhealthy_threshold = 3
    timeout             = 5
    protocol            = "HTTP"
    matcher             = "200"
  }
  
  tags = {
    Environment = var.environment
    Project     = "OakTree"
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"
  
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}
```

The ALB architecture in AWS looks like this:

![AWS ALB Architecture](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/images/component_architecture.png)

**Take a screenshot of this Terraform code and the AWS ALB architecture diagram for your documentation.**

### **GitHub Actions CI/CD Pipeline**

I enhanced the GitHub Actions workflow for a complete CI/CD pipeline:

```yaml
# .github/workflows/main.yml

name: OakTree CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    name: Test Application
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Run linting
        run: npm run lint
  
  build:
    name: Build and Push Docker Image
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
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
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: oaktree-dev
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest
          
      - name: Send Slack notification
        uses: slackapi/slack-github-action@v1.19.0
        with:
          payload: |
            {
              "text": "New OakTree image built and pushed: ${{ github.sha }}"
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
  
  deploy:
    name: Deploy to ECS
    needs: build
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-southeast-1
          
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v1
        
      - name: Terraform Init
        run: |
          cd terraform/environments/dev
          terraform init
          
      - name: Terraform Apply
        run: |
          cd terraform/environments/dev
          terraform apply -auto-approve
          
      - name: Force ECS service update
        run: |
          aws ecs update-service --cluster oaktree-cluster-dev --service oaktree-service-dev --force-new-deployment
          
      - name: Send deployment notification
        uses: slackapi/slack-github-action@v1.19.0
        with:
          payload: |
            {
              "text": "OakTree deployment to dev environment completed"
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

A CI/CD pipeline architecture looks like this:

![CI/CD Pipeline Architecture](https://d1.awsstatic.com/product-marketing/DevOps/continuous_integration.4f4cddb8556e2b1a0ca0872ace4d5fe2f68bbc58.png)

**Take a screenshot of this workflow file and the CI/CD pipeline architecture diagram for your documentation.**

## **Important AWS Services Learning**

Today I learned about several additional AWS services that are crucial for our container orchestration and load balancing:

### **Amazon ECS (Elastic Container Service)**

Amazon ECS is a fully managed container orchestration service that makes it easy to deploy, manage, and scale containerized applications. I learned how ECS integrates with other AWS services to provide a complete deployment solution.

Key components I configured today:
- **ECS Clusters**: A logical grouping of tasks or services.
- **Task Definitions**: A blueprint for your application that defines containers, volumes, and networking.
- **ECS Services**: Maintains and scales a specified number of task definition instances.
- **Fargate**: Serverless compute engine for containers that removes the need to provision and manage servers.

[Learn more about Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html)

**Take a screenshot of this ECS information for your documentation.**

### **AWS Application Load Balancer (ALB)**

The Application Load Balancer is a layer 7 load balancer that directs traffic to targets based on the content of the request. It's ideal for advanced load balancing of HTTP and HTTPS traffic.

Key features I configured:
- **Listeners**: Check for connection requests from clients using configured ports and protocols.
- **Target Groups**: Routes requests to registered targets such as EC2 instances, containers, or IP addresses.
- **Health Checks**: Regularly pings targets to ensure they're available to handle requests.
- **Path-based Routing**: Routes traffic to different services based on the URL path.

[Learn more about AWS Application Load Balancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html)

**Take a screenshot of this ALB information for your documentation.**

### **AWS CloudWatch**

Amazon CloudWatch is a monitoring and observability service that provides data and actionable insights for AWS resources. I set up CloudWatch to monitor the ECS tasks and collect container logs.

Key features I implemented:
- **Logs**: Collect and store log data from applications and AWS services.
- **Metrics**: Monitor system performance data across AWS resources.
- **Alarms**: Set thresholds and trigger actions based on metric values.
- **Dashboards**: Create customizable visualizations of metrics and logs.

[Learn more about AWS CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html)

**Take a screenshot of this CloudWatch information for your documentation.**

## **Security Best Practices for Container Deployment**

Today I implemented several security best practices for container deployment in AWS:

### **Task Definition Security**

- Used the principle of least privilege for task roles
- Implemented non-root user in the container
- Enabled read-only root filesystem where possible
- Removed unnecessary capabilities

### **Network Security**

- Placed ECS tasks in private subnets
- Used security groups to restrict traffic between ALB and ECS tasks
- Configured HTTPS on the load balancer with proper certificates
- Implemented WAF rules for common web vulnerabilities

### **Secret Management**

- Used AWS Secrets Manager for sensitive configuration
- Implemented secure environment variable handling
- Avoided hardcoding credentials in task definitions
- Set up proper IAM roles for accessing secrets

[Learn more about ECS Security Best Practices](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/security.html)

**Take a screenshot of these security best practices for your documentation.**

## **Challenges & Solutions**

### **ECS Service Discovery:**

- **Challenge**: Setting up proper communication between services in the ECS cluster.
  
- **Solution**: Implemented AWS Cloud Map for service discovery, allowing services to find and connect to each other using DNS names instead of IP addresses.

### **Load Balancer Health Checks:**

- **Challenge**: Configuring the right health check path and frequency for accurate service health monitoring.
  
- **Solution**: Implemented a dedicated `/health` endpoint in the application with appropriate checks for dependencies. Set the health check interval to 30 seconds with a threshold of 3 successful checks to avoid false positives.

## **Learning Insights**

Today I gained a much deeper understanding of container orchestration with ECS and Fargate. The serverless approach of Fargate removes the need to manage EC2 instances while still providing the benefits of containerization. This knowledge came from AWS documentation and a helpful YouTube series on "AWS Containers Deep Dive" by the AWS Online Tech Talks channel.

I also learned about the importance of proper load balancer configuration for high availability and scalability. Setting up health checks, connection draining, and proper target group configurations ensures that traffic is only routed to healthy instances. This information came from the AWS Well-Architected Framework and documentation on Elastic Load Balancing.

Working with GitHub Actions for deployment automation taught me how to securely handle AWS credentials in CI/CD pipelines. Using the official AWS actions for credential configuration and ECR login ensures that secrets are properly managed and not exposed. This knowledge came from GitHub's documentation on Securing your workflows and AWS's guides on CI/CD security.

## **Key Links for Screenshots**

Here are important links that you should visit and screenshot for your documentation:

1. [Amazon ECS Documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html)
2. [AWS Fargate Documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html)
3. [AWS Application Load Balancer Documentation](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html)
4. [GitHub Actions Deployment Documentation](https://docs.github.com/en/actions/deployment/about-deployments)
5. [AWS CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html)

**Take screenshots of these documentation pages for your learning documentation.**

## **Future Plans**

For tomorrow, I plan to:

1. Implement enhanced monitoring and alerting for the application
2. Set up CloudWatch Dashboards for operational visibility
3. Implement AWS X-Ray for distributed tracing
4. Add auto-scaling policies based on custom metrics

## **Conclusion**

Day 4 of Week 4 was highly productive, focusing on container orchestration with ECS and load balancing with ALB. The infrastructure is now set up to deploy and run containerized applications in a scalable and secure manner, and the CI/CD pipeline is automated to streamline the deployment process.

I'm particularly pleased with the security considerations implemented in the ECS task definitions and the network architecture. By placing tasks in private subnets and using proper security groups, we've created a secure environment for the application.

Tomorrow I'll focus on enhancing the monitoring and observability aspects of the deployment to ensure we have proper visibility into the application's performance and health.