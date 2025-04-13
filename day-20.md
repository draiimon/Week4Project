Week 4: End-to-End DevOps Project - Day 20 (Monday, April 8, 2025)
Introduction
After a weekend break, I returned to the OakTree DevOps project today. I focused on implementing the complete deployment pipeline and testing the infrastructure I've set up so far.

What I Did Today
Application Load Balancer:
Finalized ALB configuration in Terraform
Set up target groups with proper health checks
Configured listener rules for HTTP traffic
Added security groups specific to ALB

Container Service Configuration:
Refined ECS task definition with proper resource allocations
Set up service auto-scaling policies
Added CloudWatch log configuration
Configured environment variables for container

CI/CD Pipeline:
Completed GitHub Actions workflow
Added automated testing steps
Implemented ECS service update after image push
Configured workflow triggers for main branch commits

Testing:
Tested full deployment pipeline end-to-end
Verified application accessibility through ALB
Checked CloudWatch logs for container output
Tested auto-scaling configuration behavior

Resources
AWS Documentation:
Application Load Balancer Configuration
Target Group Health Checks
ECS Service Auto-scaling
CloudWatch Logs for Containers

CI/CD:
GitHub Actions Matrix Strategy
Workflow Triggers and Conditions
Docker Multi-platform Builds
Automated Testing in CI

Terraform:
Load Balancer and Target Group Configuration
Dynamic Security Group Rules
Output Management
AWS Provider Version Constraints

Challenges & Solutions
Health Check Configuration:
Challenge: Container health checks were failing initially, preventing successful deployment.
Solution: Adjusted health check path and timing parameters to accommodate application startup time.

Auto-scaling Policy:
Challenge: Determining the right metrics and thresholds for auto-scaling.
Solution: Started with CPU-based scaling as a baseline, with plans to refine based on actual usage patterns.

CI/CD Pipeline Timing:
Challenge: The GitHub Actions workflow was timing out during the first deployment.
Solution: Added conditional logic to handle longer initial deployments versus faster updates.

Links for Screenshots
Load balancer configuration in AWS console
CloudWatch logs showing container startup
GitHub Actions workflow run success
Application accessible through ALB URL

Plan for Tomorrow
Enhance application monitoring with CloudWatch alarms
Implement blue/green deployment strategy
Add resource tagging for better cost tracking
Create cost estimation documentation