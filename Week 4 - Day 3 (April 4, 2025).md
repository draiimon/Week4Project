# **Week 4: End-to-End DevOps Project - Day 3 (Friday, April 4, 2025)**

## **Introduction**

Today is the third day of working on the OakTree DevOps project. After setting up the basic infrastructure and Docker configuration over the past two days, I focused on expanding the Terraform configuration to include container services and implementing the ECR repository for Docker image storage. This brings us closer to a complete deployment pipeline for the application.

## **What I Did Today**

### **AWS Infrastructure:**

- Created ECR repository for Docker images
- Set up ECS cluster configuration
- Defined task definition and ECS service
- Added IAM roles for ECS task execution
- Configured CloudWatch log groups for container logs
- Implemented proper resource tagging strategy

### **Network Configuration:**

- Finalized public and private subnets across availability zones
- Configured security groups with proper access rules
- Added internet gateway and route tables
- Set up NAT gateway for private subnet access
- Implemented network ACLs for additional security
- Created subnet groups for database services

### **CI Pipeline:**

- Completed GitHub Actions workflow configuration
- Added Docker image build and push steps
- Set up test stages in the pipeline
- Configured AWS credentials in GitHub secrets
- Added workflow status badges to README
- Implemented cache actions for faster builds

### **Application Enhancement:**

- Added AWS SDK integration to the server
- Implemented DynamoDB service connection
- Created API endpoints for AWS service status
- Added environment variable configuration
- Enhanced error handling for AWS services
- Improved documentation with setup instructions

## **Resources**

### **AWS Documentation:**

- ECR Repository Management
- ECS Cluster and Service Setup
- IAM Role Policies for ECS
- CloudWatch Logs Configuration
- Security Best Practices for Containers

### **CI/CD:**

- GitHub Actions Workflow Optimization
- Docker Build Pipeline Setup
- Secrets Management in GitHub
- AWS Authentication in CI/CD
- Caching Strategies in Pipelines

### **Terraform:**

- Resource Dependencies and Ordering
- Count and For_each Usage
- Dynamic Block Configuration
- Output Variable Usage
- Local Value Management

### **Container Management:**

- Docker Image Tagging Strategies
- ECS Task Definition Best Practices
- Container Healthcheck Implementation
- Log Routing Configuration
- Environment Variable Security

## **Challenges & Solutions**

### **ECR Authentication:**

- **Challenge**: Setting up secure authentication between GitHub Actions and ECR.
- **Solution**: Configured proper IAM roles with ECR push permissions and implemented AWS credential action in GitHub workflow.

### **ECS Service Configuration:**

- **Challenge**: Determining the right deployment configuration and resource allocation for ECS tasks.
- **Solution**: Researched ECS patterns and chose Fargate launch type with appropriate CPU and memory allocations based on application requirements.

### **Network Security:**

- **Challenge**: Creating a network architecture that balances security and accessibility.
- **Solution**: Implemented defense-in-depth with security groups, network ACLs, and proper subnet isolation while ensuring services can communicate as needed.

## **Learning Insights**

Today I gained a deeper understanding of container orchestration using ECS. I learned about the different launch types (EC2 vs Fargate) and when to use each based on requirements like control, cost, and management overhead. This knowledge came from the AWS ECS documentation and several AWS re:Invent sessions available on YouTube.

The process of setting up ECR and the image push workflow taught me about the security considerations in container registries. I learned about image scanning, immutable tags, and the authorization token process. This was from both AWS documentation and a Udemy course on container security.

Working with Terraform to define all these resources helped me understand the power of infrastructure as code. I could see how changes could be tracked, how dependencies were managed, and how the entire infrastructure could be versioned. This understanding came from the Terraform documentation and tutorials, as well as several blog posts from HashiCorp.

## **Future Plans**

For next week (after the weekend), I plan to:

1. Set up the Application Load Balancer and target groups
2. Implement auto-scaling policies for the ECS service
3. Complete the deployment pipeline with production release stages
4. Add monitoring and alerting configuration

## **Conclusion**

Day 3 of Week 4 was productive, with significant progress on the container infrastructure and deployment pipeline. The project is coming together nicely, with most of the infrastructure defined as code and the deployment automation taking shape. The challenges faced were mostly related to configuration details and security, which I was able to resolve through research and documentation. I'm looking forward to completing the deployment infrastructure after the weekend and testing the full deployment pipeline.