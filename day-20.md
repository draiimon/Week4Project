# **Week 4: End-to-End DevOps Project - Day 20 (Monday, April 8, 2025)**

![OakTree CI/CD Pipeline Banner](https://example.com/placeholder-image) 
_**[Screenshot Opportunity: Create a custom banner showing GitHub Actions and AWS deployment with the OakTree orange-gray theme]**_

## **Introduction**

After a weekend break, I'm back to work on the OakTree DevOps project. Having completed the infrastructure setup last week, today I focused on implementing the CI/CD pipeline with GitHub Actions, testing our deployment, and setting up monitoring for our application. This is an exciting phase as we'll finally see our application running in the cloud!

## **What I Did Today**

### **Completing the CI/CD Pipeline**

I finalized our GitHub Actions workflow by adding more detailed steps and error handling:

```yaml
# .github/workflows/main.yml
name: Build, Test, and Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    name: Test
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Lint code
      run: npm run lint
      
    - name: Run tests
      run: npm test
  
  build-and-push:
    name: Build and Push Docker Image
    needs: test
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
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
        docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
        docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
        docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest
        echo "::set-output name=image::$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG"
  
  deploy:
    name: Deploy to ECS
    needs: build-and-push
    runs-on: ubuntu-latest
    
    steps:
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v1
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ap-southeast-1
        
    - name: Force ECS Deployment
      run: |
        aws ecs update-service --cluster oaktree-dev-cluster --service oaktree-dev-service --force-new-deployment
        
    - name: Wait for service stability
      run: |
        aws ecs wait services-stable --cluster oaktree-dev-cluster --services oaktree-dev-service
        
    - name: Deployment Results
      run: |
        echo "Deployment completed successfully!"
        echo "Application URL: http://$(aws elbv2 describe-load-balancers --names oaktree-dev-alb --query 'LoadBalancers[0].DNSName' --output text)"
```

_**[Screenshot Opportunity: VS Code with the GitHub Actions workflow file open]**_

I also added GitHub repository secrets for AWS credentials to enable secure deployment:

_**[Screenshot Opportunity: GitHub repository settings showing secrets management (with actual values hidden)]**_

### **Testing the Deployment**

After implementing the CI/CD pipeline, I made a small change to our application, pushed it to GitHub, and watched the automated deployment process:

1. GitHub Actions automatically detected the push to the main branch
2. It ran our tests to ensure code quality
3. The workflow built and pushed a new Docker image to ECR
4. Finally, it updated our ECS service with the new image

_**[Screenshot Opportunity: GitHub Actions workflow run showing a successful deployment]**_

I verified the deployment by accessing the application through the Load Balancer URL:

```bash
$ curl http://oaktree-dev-alb-1234567890.ap-southeast-1.elb.amazonaws.com
OakTree DevOps Project API - Version 1.0.1
```

_**[Screenshot Opportunity: Browser showing the deployed application]**_

### **Setting Up CloudWatch Monitoring**

I added CloudWatch monitoring to our infrastructure by creating alarms for key metrics:

```hcl
# CloudWatch CPU Alarm
resource "aws_cloudwatch_metric_alarm" "cpu_high" {
  alarm_name          = "${local.name_prefix}-cpu-utilization-high"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors ecs cpu utilization"
  
  dimensions = {
    ClusterName = aws_ecs_cluster.app_cluster.name
    ServiceName = aws_ecs_service.app_service.name
  }
  
  alarm_actions = [aws_sns_topic.alerts.arn]
  ok_actions    = [aws_sns_topic.alerts.arn]
  
  tags = local.common_tags
}

# CloudWatch Memory Alarm
resource "aws_cloudwatch_metric_alarm" "memory_high" {
  alarm_name          = "${local.name_prefix}-memory-utilization-high"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "2"
  metric_name         = "MemoryUtilization"
  namespace           = "AWS/ECS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors ecs memory utilization"
  
  dimensions = {
    ClusterName = aws_ecs_cluster.app_cluster.name
    ServiceName = aws_ecs_service.app_service.name
  }
  
  alarm_actions = [aws_sns_topic.alerts.arn]
  ok_actions    = [aws_sns_topic.alerts.arn]
  
  tags = local.common_tags
}

# SNS Topic for alerts
resource "aws_sns_topic" "alerts" {
  name = "${local.name_prefix}-alerts"
  
  tags = local.common_tags
}
```

_**[Screenshot Opportunity: AWS CloudWatch console showing the configured alarms]**_

I also created a CloudWatch dashboard to visualize our application's performance metrics:

```hcl
# CloudWatch Dashboard
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = local.name_prefix
  
  dashboard_body = jsonencode({
    widgets = [
      {
        type = "metric"
        x    = 0
        y    = 0
        width = 12
        height = 6
        properties = {
          metrics = [
            [ "AWS/ECS", "CPUUtilization", "ServiceName", aws_ecs_service.app_service.name, "ClusterName", aws_ecs_cluster.app_cluster.name, { "stat": "Average" } ]
          ],
          view = "timeSeries",
          stacked = false,
          region = "ap-southeast-1",
          title = "ECS CPU Utilization",
          period = 300
        }
      },
      {
        type = "metric"
        x    = 12
        y    = 0
        width = 12
        height = 6
        properties = {
          metrics = [
            [ "AWS/ECS", "MemoryUtilization", "ServiceName", aws_ecs_service.app_service.name, "ClusterName", aws_ecs_cluster.app_cluster.name, { "stat": "Average" } ]
          ],
          view = "timeSeries",
          stacked = false,
          region = "ap-southeast-1",
          title = "ECS Memory Utilization",
          period = 300
        }
      },
      {
        type = "metric"
        x    = 0
        y    = 6
        width = 12
        height = 6
        properties = {
          metrics = [
            [ "AWS/ApplicationELB", "RequestCount", "LoadBalancer", aws_lb.app_alb.arn_suffix ]
          ],
          view = "timeSeries",
          stacked = false,
          region = "ap-southeast-1",
          title = "ALB Request Count",
          period = 300
        }
      },
      {
        type = "metric"
        x    = 12
        y    = 6
        width = 12
        height = 6
        properties = {
          metrics = [
            [ "AWS/ApplicationELB", "TargetResponseTime", "LoadBalancer", aws_lb.app_alb.arn_suffix, { "stat": "Average" } ]
          ],
          view = "timeSeries",
          stacked = false,
          region = "ap-southeast-1",
          title = "ALB Response Time",
          period = 300
        }
      }
    ]
  })
}
```

_**[Screenshot Opportunity: AWS CloudWatch dashboard showing application metrics]**_

### **Error Handling Improvements**

I enhanced our application's error handling and added logging to make troubleshooting easier:

```javascript
// server/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  // Log error details
  console.error(`[ERROR] ${new Date().toISOString()}: ${err.message}`);
  console.error(err.stack);
  
  // Determine response based on error type
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: err.message,
      details: err.details || 'Invalid request data'
    });
  }
  
  if (err.name === 'AuthenticationError') {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication failed'
    });
  }
  
  if (err.name === 'NotFoundError') {
    return res.status(404).json({
      status: 'error',
      message: err.message || 'Resource not found'
    });
  }
  
  // Default to 500 internal server error
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    requestId: req.id // For tracking in logs
  });
};

module.exports = errorHandler;
```

_**[Screenshot Opportunity: VS Code with the error handler code open]**_

And I implemented it in our main Express app:

```javascript
// server/index.js
const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const requestIdMiddleware = require('./middleware/requestId');
const authRoutes = require('./routes/auth');
const awsRoutes = require('./routes/aws');

const app = express();
const PORT = process.env.PORT || 5000;

// Add request ID to each request for tracking
app.use(requestIdMiddleware);

// Parse JSON bodies
app.use(express.json());

// Add routes
app.use('/api/auth', authRoutes);
app.use('/api/aws', awsRoutes);

// Health check endpoint for the load balancer
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.send(`OakTree DevOps Project API - Version ${process.env.APP_VERSION || '1.0.0'}`);
});

// Error handling middleware - must be after all routes
app.use(errorHandler);

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
```

_**[Screenshot Opportunity: VS Code with the main server file open]**_

## **Learning Resources I Used Today**

### **GitHub Actions Documentation:**
- [GitHub Actions for AWS](https://github.com/marketplace/actions/aws-actions)
- [Using Secret Variables in GitHub Actions](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Workflow Syntax for GitHub Actions](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)

_**[Screenshot Opportunity: Browser showing the GitHub Actions documentation]**_

### **AWS Documentation:**
- [CloudWatch Dashboards](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html)
- [CloudWatch Alarms](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html)
- [ECS Service Events](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-event-messages.html)

_**[Screenshot Opportunity: Browser showing the AWS CloudWatch documentation]**_

### **Node.js Documentation:**
- [Error Handling in Express](https://expressjs.com/en/guide/error-handling.html)
- [Node.js Logging Best Practices](https://blog.expressjs.com/2022/03/25/logging-in-node.js-applications-best-practices/)

_**[Screenshot Opportunity: Browser showing the Express.js error handling documentation]**_

## **Challenges & Solutions**

### **GitHub Actions Deployment Timing:**

**Challenge:** Our GitHub Actions workflow was completing before the ECS deployment was actually finished, making it hard to know if the deployment was successful.

**Solution:** I added the `aws ecs wait services-stable` command to make the workflow wait until the ECS service reached a stable state before completing. This ensures we know if the deployment was successful or not.

_**[Screenshot Opportunity: GitHub Actions workflow run showing the waiting period]**_

### **CloudWatch Dashboard JSON Syntax:**

**Challenge:** Creating the CloudWatch dashboard was challenging because of the complex JSON structure required. Small syntax errors would cause the entire dashboard to fail.

**Solution:** I used the CloudWatch console to create a test dashboard first, then exported the JSON and adapted it for our Terraform code. This was much easier than trying to write the JSON from scratch.

_**[Screenshot Opportunity: AWS CloudWatch console showing the JSON export]**_

### **Load Balancer Health Checks:**

**Challenge:** Initially, our application wasn't passing the ALB health checks because our health endpoint wasn't properly implemented.

**Solution:** I created a dedicated `/health` endpoint that returns a 200 status code and configured the ALB to use this for health checks. I also increased the grace period to give the container more time to start up properly.

_**[Screenshot Opportunity: AWS Console showing healthy targets in the target group]**_

## **What I Learned Today**

Today I gained deeper insights into:

1. The importance of robust CI/CD pipelines that include proper waiting and verification steps
2. How to implement comprehensive monitoring for production applications
3. The value of structured error handling and logging for easier troubleshooting
4. How to integrate GitHub Actions with AWS services securely

I'm particularly proud of creating the CloudWatch dashboard that gives us a clear view of our application's performance. This will be invaluable for monitoring and troubleshooting in the future.

## **Plans for Tomorrow**

Tomorrow, I plan to:

1. Implement auto-scaling for our ECS service based on CPU and memory metrics
2. Add HTTPS support with AWS Certificate Manager
3. Create a proper logging strategy with central log aggregation
4. Improve our application's documentation for operations teams

_**[Screenshot Opportunity: Task list or project board showing tomorrow's plan]**_

## **Conclusion**

Day 4 was a significant milestone as we now have a fully automated CI/CD pipeline and our application is running in the cloud! The monitoring and alerting setup gives us confidence that we'll know if anything goes wrong, and the improved error handling will make troubleshooting easier. I'm excited to see how the application performs with real traffic and to continue improving our DevOps processes.

---

**References:**
1. GitHub Actions Documentation: [https://docs.github.com/en/actions](https://docs.github.com/en/actions)
2. AWS CloudWatch Documentation: [https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html)
3. Express.js Error Handling: [https://expressjs.com/en/guide/error-handling.html](https://expressjs.com/en/guide/error-handling.html)
4. AWS ECS Documentation: [https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html)