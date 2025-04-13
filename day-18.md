Week 4: End-to-End DevOps Project - Day 18 (Thursday, April 3, 2025)
Introduction
Today I continued working on the OakTree DevOps project. After yesterday's initial setup, I focused on creating the foundational infrastructure code with Terraform and advancing my Docker configuration for the application.

What I Did Today
Terraform Configuration:
Created main.tf file with AWS provider configuration
Set up backend for state management
Defined VPC and networking resources
Added security group definitions
Configured initial variable structure

Docker Implementation:
Refined Dockerfile for production use
Added environment variable handling
Tested multi-stage build optimization
Verified application runs correctly in container

Application Development:
Enhanced backend API structure
Added basic authentication endpoints
Set up connection handling to AWS services
Created simple frontend for testing deployment

Documentation:
Updated README with project progress
Documented Terraform structure
Added Docker usage instructions
Created troubleshooting section for common issues

Resources
AWS Documentation:
VPC Configuration Guide
Security Group Best Practices
Subnet Configuration
IAM Policy Management

Terraform:
AWS Provider Configuration
State Management Approaches
Variable and Output Declaration
Module Organization Patterns

Docker:
Environment Variable Handling
Build Optimization Techniques
Container Networking
Tagging and Versioning

Challenges & Solutions
Terraform State Management:
Challenge: Deciding on the best approach for managing Terraform state files.
Solution: For now, using local state but planning to migrate to S3 state storage once infrastructure stabilizes.

Security Group Configuration:
Challenge: Getting security group ingress/egress rules correct with proper CIDR blocks.
Solution: Started with more permissive rules for development but documented the need to restrict in production.

Docker Image Size:
Challenge: Initial Docker image was too large (over 1GB).
Solution: Implemented multi-stage build to separate build and runtime environments, reducing size by approximately 60%.

Links for Screenshots
Basic infrastructure diagram sketch (hand-drawn planning for now, will digitize later)
Initial Docker build terminal output (successful build with size optimization)

Plan for Tomorrow
Add ECS cluster configuration to Terraform
Create ECR repository for Docker images
Add load balancer and target group configuration
Start implementing CI pipeline with GitHub Actions