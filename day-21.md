Week 4: End-to-End DevOps Project - Day 21 (Tuesday, April 9, 2025)
Introduction
Today marks my fifth day working on the OakTree DevOps project. After successfully setting up the deployment pipeline yesterday, I focused on enhancing the monitoring and cost management aspects of the infrastructure.

What I Did Today
CloudWatch Monitoring:
Created CloudWatch dashboards for application monitoring
Set up alarms for critical metrics (CPU, memory, errors)
Added custom metrics for application health
Configured log insights queries for troubleshooting

Cost Management:
Implemented resource tagging strategy
Set up AWS Budget alerts
Created cost allocation tags
Added cost estimation documentation

DynamoDB Configuration:
Created DynamoDB table for application data
Set up appropriate capacity mode (on-demand)
Configured IAM permissions for access
Added application code for DynamoDB integration

Environment Variable Management:
Refined environment variable configuration in ECS
Added parameter store integration for sensitive values
Updated CI/CD pipeline to handle secrets
Documented environment variable requirements

Resources
AWS Documentation:
CloudWatch Dashboards and Alarms
AWS Budgets and Cost Management
DynamoDB On-demand Capacity
Parameter Store Secret Management

Cost Optimization:
ECS Fargate Pricing Optimization
Spot vs. On-demand Instances
Right-sizing Container Resources
Cost Allocation Tag Strategy

Database:
DynamoDB Best Practices
Single-table Design Patterns
NoSQL Data Modeling
Read/Write Capacity Planning

Challenges & Solutions
DynamoDB Integration:
Challenge: Deciding between provisioned and on-demand capacity for DynamoDB.
Solution: Chose on-demand for development to avoid over-provisioning, will evaluate based on usage patterns.

Secret Management:
Challenge: Securely managing environment variables and secrets in the deployment pipeline.
Solution: Implemented AWS Parameter Store to keep sensitive values out of code and Terraform state.

Cost Allocation:
Challenge: Setting up proper resource tagging for cost tracking.
Solution: Created a standardized tagging strategy with environment, project, and owner tags for all resources.

Links for Screenshots
CloudWatch dashboard for application monitoring
DynamoDB table configuration
Cost allocation tags in AWS console
Budget alert configuration

Plan for Tomorrow
Refine CI/CD pipeline with additional testing stages
Add error handling and resilience features
Create disaster recovery documentation
Implement infrastructure diagram for documentation