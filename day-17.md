Week 4: End-to-End DevOps Project - Day 17 (Wednesday, April 2, 2025)
Introduction
Today is the beginning of Week 4, where I'll be working on the final project that consolidates all the skills we've learned in the first three weeks. My task is to create a complete DevOps pipeline for a web application, containerize it, deploy it to AWS using Infrastructure as Code, and set up proper CI/CD.

What I Did Today
Project Setup:
Set up project repository and initial structure
Created basic Node.js application with React frontend
Initialized Git repository for version control
Added initial .gitignore and README.md files

Infrastructure Planning:
Researched AWS services needed for the project requirements
Drafted basic architecture diagram for infrastructure
Selected ap-southeast-1 (Singapore) as the deployment region
Created initial AWS IAM user with required permissions

Docker Configuration:
Created initial Dockerfile for application containerization
Set up .dockerignore file to exclude unnecessary files
Researched multi-stage build optimization
Tested local Docker build process

Documentation:
Started project documentation with requirements
Created initial README with project structure
Documented AWS service selection reasoning
Started tracking project progress

Resources
AWS Documentation:
IAM User and Role Management
AWS CLI Configuration
Region Selection Best Practices
Service Limits Overview

Docker:
Dockerfile Best Practices
Node.js Containerization Guide
Multi-stage Builds for Node.js
Image Optimization Techniques

Node.js:
Express Application Structure
React Integration with Express
Environment Configuration
TypeScript Setup

Challenges & Solutions
AWS Authentication Setup:
Challenge: Had issues configuring AWS CLI with correct credentials.
Solution: Created dedicated IAM user with specific permissions and used aws configure to properly set up access.

Project Structure Planning:
Challenge: Wasn't sure how to organize the codebase for both frontend and backend.
Solution: Settled on a monorepo approach with client/ and server/ directories to simplify container builds.

Docker Build Context:
Challenge: Initial Docker build was including node_modules, making it slow.
Solution: Created proper .dockerignore file and learned about multi-stage builds.

Links for Screenshots
Today I focused mostly on setup and research, so I don't have significant visual progress to show yet. Tomorrow I'll begin implementing the actual infrastructure code and application functionality.

Plan for Tomorrow
Start writing Terraform code for basic infrastructure
Create initial application functionality
Set up GitHub repository with proper branches
Begin work on CI pipeline configuration