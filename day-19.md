Week 4: End-to-End DevOps Project - Day 19 (Friday, April 4, 2025)
Introduction
Today is the third day of working on the OakTree DevOps project. After setting up the basic infrastructure and Docker configuration over the past two days, I focused on expanding the Terraform configuration and setting up the container registry for deployment.

What I Did Today
AWS Infrastructure:
Created ECR repository for Docker images
Set up ECS cluster configuration
Defined task definition and ECS service
Added IAM roles for ECS task execution

Network Configuration:
Set up public and private subnets across availability zones
Configured security groups with proper access rules
Added internet gateway and route tables
Set up NAT gateway for private subnet access

CI Pipeline:
Started GitHub Actions workflow configuration
Created initial .github/workflows/main.yml
Set up AWS credentials in GitHub secrets
Configured Docker build and push steps

Documentation:
Added infrastructure diagram
Documented AWS resource organization
Updated deployment instructions
Created troubleshooting guide for common issues

Resources
AWS Documentation:
ECR Repository Management
ECS Cluster and Service Setup
IAM Role Policies for ECS
Security Best Practices

CI/CD:
GitHub Actions Workflow Syntax
Docker Build Pipeline Setup
Secrets Management in GitHub
AWS Authentication in CI/CD

Terraform:
Resource Dependencies and Ordering
Count and For_each Usage
Dynamic Block Configuration
Output Variable Usage

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