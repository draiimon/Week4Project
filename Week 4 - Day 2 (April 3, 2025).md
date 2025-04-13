# **Week 4: End-to-End DevOps Project - Day 2 (Thursday, April 3, 2025)**

## **Introduction**

Today is the second day of Week 4, building on yesterday's foundation for the OakTree DevOps project. Today I focused on implementing the Terraform infrastructure configuration and setting up the CI/CD pipeline using GitHub Actions. This represents a crucial step in automating the deployment process and ensuring infrastructure reproducibility.

## **What I Did Today**

### **Terraform Infrastructure:**

- Created base Terraform configuration files (main.tf, variables.tf, outputs.tf)
- Implemented AWS provider configuration with proper version constraints
- Set up VPC module with public and private subnets across availability zones
- Configured security groups with appropriate ingress/egress rules
- Added internet gateway and route table configurations
- Set up NAT gateway for resources in private subnets

### **CI/CD Setup:**

- Created initial GitHub Actions workflow file
- Set up workflow triggers for main branch pushes
- Added Docker build and test steps to workflow
- Researched AWS credential management in GitHub Actions
- Configured AWS authentication for GitHub Actions
- Documented CI/CD pipeline design decisions

### **AWS Service Configuration:**

- Implemented IAM roles for ECS task execution
- Set up IAM policies with least privilege principle
- Created ECR repository Terraform configuration
- Added permissions boundary for enhanced security
- Configured task definitions for ECS deployment

### **Frontend Development:**

- Enhanced React components with AWS status indicators
- Added deployment status visualization
- Implemented infrastructure diagram component
- Created service health dashboard components
- Set up API integration for AWS service status

## **Resources**

### **AWS Documentation:**

- VPC Configuration and CIDR Block Planning
- Security Group Best Practices
- IAM Role Management
- ECR Authentication Workflow

### **Terraform:**

- AWS Provider Configuration Options
- Variable Types and Validation
- State Management Approaches
- Module Structure Best Practices

### **Docker:**

- Build Cache Optimization Techniques
- Multi-stage Build Best Practices
- Container Healthcheck Configuration
- Environment Variable Management

### **CI/CD:**

- GitHub Actions Workflow Syntax
- Secrets Management in GitHub
- AWS Authentication in CI/CD
- Docker Layer Caching in CI

## **Challenges & Solutions**

### **Terraform State Management:**

- **Challenge**: Deciding the best approach for managing Terraform state files, considering team collaboration.
- **Solution**: For initial development, started with local state while documenting future migration to S3-backed remote state with DynamoDB locking.

### **Security Group Configuration:**

- **Challenge**: Setting up proper security group rules with appropriate ingress/egress patterns.
- **Solution**: Created separate security groups for load balancer and application tier with least-privilege access rules, allowing only necessary traffic flow.

### **CI/CD AWS Authentication:**

- **Challenge**: Securely providing AWS credentials to GitHub Actions workflow.
- **Solution**: Used GitHub Secrets to store AWS credentials and configured the AWS credentials action to assume role for deployments.

## **Learning Insights**

Today I gained a deeper understanding of how to structure Terraform code effectively. I learned this by studying AWS reference architectures and recommended patterns from Terraform's documentation. The modular approach to infrastructure definitions makes the codebase more maintainable and reusable.

I also learned about the intricacies of AWS network configuration, particularly the interaction between public and private subnets, NAT gateways, and internet gateways. This knowledge came from AWS networking documentation and several blog posts from AWS developers. The concept of designing network isolation while maintaining internet connectivity for private resources was particularly valuable.

Setting up the CI/CD pipeline taught me about the security considerations for automated deployments. I learned about the principle of least privilege in action by configuring specific IAM roles for the deployment process. This knowledge came from security best practices courses on A Cloud Guru and from AWS security documentation.

## **Future Plans**

For tomorrow, I plan to:

1. Implement the ECS cluster and service configurations in Terraform
2. Set up Application Load Balancer for the containerized application
3. Complete the GitHub Actions workflow for automated deployments
4. Enhance the application with more AWS service integrations

## **Conclusion**

Day 2 of Week 4 was focused on implementing the infrastructure as code using Terraform and setting up the CI/CD pipeline. The combination of these two technologies creates a powerful automation framework for deploying applications consistently. Despite some challenges with configuration details, I've made significant progress in establishing a reliable deployment pipeline. The project is taking shape nicely, and I'm looking forward to completing the infrastructure setup tomorrow.