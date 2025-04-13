# **Week 4: End-to-End DevOps Project - Day 4 (Monday, April 8, 2025)**

## **Introduction**

After a weekend break, I returned to the OakTree DevOps project today. This marks the fourth day of the Week 4 project. Today, I focused on implementing the complete deployment pipeline and setting up the Application Load Balancer infrastructure. These components are crucial for making our containerized application accessible and automatically deployable.

## **What I Did Today**

### **Application Load Balancer:**

- Finalized ALB configuration in Terraform
- Set up target groups with proper health checks
- Configured listener rules for HTTP traffic
- Added security groups specific to ALB
- Implemented path-based routing for API and frontend
- Set up proper CORS configuration for API endpoints

### **Container Service Configuration:**

- Refined ECS task definition with proper resource allocations
- Set up service auto-scaling policies based on CPU and memory utilization
- Added CloudWatch log configuration for container logs
- Configured environment variables for container deployment
- Implemented container health checks
- Added service discovery for inter-service communication

### **CI/CD Pipeline:**

- Completed GitHub Actions workflow with deployment stage
- Added automated testing steps before deployment
- Implemented ECS service update after image push
- Configured workflow triggers for main branch commits
- Added deployment approval gates for production
- Set up notification alerts for pipeline failures

### **Testing:**

- Tested full deployment pipeline end-to-end
- Verified application accessibility through ALB
- Checked CloudWatch logs for container output
- Tested auto-scaling configuration behavior
- Verified infrastructure rollback capabilities
- Conducted load testing to validate scaling policies

## **Resources**

### **AWS Documentation:**

- Application Load Balancer Configuration
- Target Group Health Checks
- ECS Service Auto-scaling
- CloudWatch Logs for Containers
- ECS Task Definition Reference

### **CI/CD:**

- GitHub Actions Matrix Strategy
- Workflow Triggers and Conditions
- Docker Multi-platform Builds
- Automated Testing in CI
- Deployment Approval Gates

### **Terraform:**

- Load Balancer and Target Group Configuration
- Dynamic Security Group Rules
- Output Management
- AWS Provider Version Constraints
- Resource Dependencies

### **Monitoring:**

- CloudWatch Metrics and Alarms
- Container Log Analysis
- Health Check Configuration
- Load Testing Methodologies
- Auto-scaling Behavior Analysis

## **Challenges & Solutions**

### **Load Balancer Health Checks:**

- **Challenge**: Configuring the right health check path and thresholds to ensure accurate service health reporting.
- **Solution**: Implemented a dedicated health endpoint in the application and tuned the health check parameters (interval, timeout, threshold) based on application behavior.

### **Auto-scaling Configuration:**

- **Challenge**: Determining the right metrics and thresholds for ECS service auto-scaling.
- **Solution**: Analyzed application performance characteristics and set up scaling policies based on CPU utilization with appropriate cooldown periods to prevent scaling thrashing.

### **CORS Configuration:**

- **Challenge**: Setting up proper CORS headers for API endpoints accessed by the frontend.
- **Solution**: Configured CORS at both the application level and ALB level to ensure proper access across different environments.

## **Learning Insights**

Today I gained a deeper understanding of load balancer configuration and how it interacts with container services. I learned about health check behavior, target group settings, and how to properly route traffic to containers. This knowledge came from AWS documentation and a tutorial on Advanced AWS Networking on Pluralsight.

The process of setting up auto-scaling taught me about the different strategies for scaling container workloads. I learned about step scaling versus target tracking policies and when to use each. This came from the AWS Auto Scaling documentation and a workshop on Container Scaling Patterns.

Working with the CI/CD pipeline helped me understand the importance of deployment automation and testing gates. I learned how to create a workflow that ensures code quality before deployment and provides robust rollback capabilities. This knowledge came from GitHub documentation and a DevOps best practices course on LinkedIn Learning.

## **Future Plans**

For tomorrow, I plan to:

1. Enhance the monitoring and logging infrastructure
2. Implement cost management with tagging and budgets
3. Add DynamoDB integration for application data
4. Improve environment variable management

## **Conclusion**

Day 4 of Week 4 was highly productive, with the completion of the deployment pipeline and the load balancer infrastructure. The application is now automatically deployable through the CI/CD pipeline and accessible via the load balancer. The auto-scaling configuration ensures the application can handle varying loads efficiently. Despite some configuration challenges, the infrastructure is now well set up for reliable and scalable operation. I'm excited to enhance the monitoring and data management aspects tomorrow.