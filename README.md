# OakTree DevOps Project - Week 4 Final Implementation

This repository contains the Week 4 final implementation of the OakTree DevOps project, featuring AWS integration, containerization, and cross-environment support.

## Features

- **AWS DynamoDB Integration**: User authentication and data storage
- **AWS Cognito Support**: User identity management
- **AWS IAM Security**: Fine-grained access control
- **AWS CodeDeploy Integration**: Automated deployment pipeline
- **Cross-Environment Support**: Runs on Linux, Windows WSL, and Docker
- **Modern UI**: React frontend with orange and gray themed design
- **Secure Authentication**: AWS-managed authentication services
- **Complete CI/CD Pipeline**: GitHub Actions workflow integrated with AWS CodePipeline

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm (v8 or later)
- Docker (optional, for containerized deployment)
- AWS Account (optional, for full functionality)

### Quick Setup (No Database Required)

1. **Clone the repository**
   ```bash
   git clone --branch Week-4 https://github.com/draiimon/Oaktree.git
   cd Oaktree
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory with:
   ```
   # Enable AWS Mode (no PostgreSQL needed)
   USE_AWS_DB=true
   
   # AWS Configuration (for full functionality)
   AWS_REGION=ap-southeast-1
   AWS_ACCESS_KEY_ID=your_access_key_here
   AWS_SECRET_ACCESS_KEY=your_secret_key_here
   
   # If you don't have AWS credentials, the app will run with limited functionality
   ```

4. **Start the development server**
   ```bash
   # Method 1: Standard method (may have compatibility issues in some environments)
   npm run dev
   
   # Method 2: Local compatibility mode (more reliable across environments)
   node run-local.js
   ```

5. **Access the application**
   Open your browser and navigate to http://localhost:5000

### Running in Windows WSL

1. **Clone the repository in WSL**
   ```bash
   git clone --branch Week-4 https://github.com/draiimon/Oaktree.git
   cd Oaktree
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure .env file**
   ```
   # Enable AWS Mode (no PostgreSQL needed)
   USE_AWS_DB=true
   
   # Add AWS credentials if available
   AWS_REGION=ap-southeast-1
   AWS_ACCESS_KEY_ID=your_access_key_here
   AWS_SECRET_ACCESS_KEY=your_secret_key_here
   ```

4. **Run the application**
   ```bash
   # Method 1: Standard method (may have compatibility issues in WSL)
   npm run dev
   
   # Method 2: Local compatibility mode (recommended for WSL)
   node run-local.js
   ```

### Docker Deployment (No Database Required)

1. **Build the Docker image**
   ```bash
   docker build -t oaktree-app:latest .
   ```

2. **Run the container with AWS mode enabled**
   ```bash
   docker run -d -p 5000:5000 \
     -e USE_AWS_DB=true \
     -e AWS_REGION=ap-southeast-1 \
     -e AWS_ACCESS_KEY_ID=your_access_key \
     -e AWS_SECRET_ACCESS_KEY=your_secret_key \
     --name oaktree-container \
     oaktree-app:latest
   ```

   If you don't have AWS credentials, you can still run with limited functionality:
   ```bash
   docker run -d -p 5000:5000 \
     -e USE_AWS_DB=true \
     -e AWS_REGION=ap-southeast-1 \
     --name oaktree-container \
     oaktree-app:latest
   ```

3. **Access the application**
   Open your browser and navigate to http://localhost:5000

## AWS Integration

This application is fully integrated with AWS services for authentication, data storage, deployment, and monitoring. The application is designed to work seamlessly with AWS infrastructure.

### AWS Services Used

1. **AWS DynamoDB**
   - NoSQL database for user data and authentication information
   - Provides high availability and scalability
   - Used table schema:
     ```
     Table Name: OakTreeUsers
     Primary Key: username (String)
     Additional Attributes:
       - password (String, hashed)
       - email (String)
       - createdAt (String)
     ```

2. **AWS Cognito**
   - User authentication and identity management
   - Securely handles user registration and login
   - Integrates with IAM for access control

3. **AWS IAM**
   - Manages secure access to AWS services and resources
   - Provides fine-grained permissions for application components
   - Required policies for DynamoDB and Cognito access

4. **AWS CodePipeline & CodeDeploy**
   - Automates build, test, and deployment processes
   - Integrates with GitHub Actions for continuous deployment
   - Provides logging and rollback capabilities

### Setting Up AWS Resources

1. **Configure IAM Permissions**
   - Create an IAM user with permissions for DynamoDB and Cognito
   - Generate access keys for application use

2. **Set Up DynamoDB**
   - Create a table named `OakTreeUsers` with primary key `username` (String)
   - Configure read/write capacity units as needed

3. **Configure Cognito**
   - Create a User Pool for identity management
   - Set up App Client for application integration
   - Configure user attributes and password policies

4. **Environment Configuration**
   - Set the required environment variables in your deployment environment:
     ```
     AWS_ACCESS_KEY_ID=your_access_key
     AWS_SECRET_ACCESS_KEY=your_secret_key
     AWS_REGION=your_region
     AWS_COGNITO_USER_POOL_ID=your_user_pool_id
     AWS_COGNITO_CLIENT_ID=your_client_id
     ```

## Project Structure

```
.
├── .github/workflows    # CI/CD pipeline configurations
├── client/             # React frontend
│   ├── src/            # Source code
│   ├── public/         # Static assets
│   └── ...
├── server/             # Express backend
│   ├── auth.ts         # Authentication logic
│   ├── aws-db.ts       # AWS DynamoDB integration
│   ├── db.ts           # PostgreSQL database connection
│   ├── routes.ts       # API routes
│   ├── start-local.js  # Local compatibility server script
│   ├── storage.ts      # Data storage interface
│   └── ...
├── shared/             # Shared types and utilities
├── terraform/          # Infrastructure as Code for AWS
├── .dockerignore       # Docker ignore file
├── .env.example        # Example environment variables
├── Dockerfile          # Docker configuration
├── package.json        # Dependencies and scripts
├── run-local.js        # Local environment startup script
└── README.md           # Project documentation
```

## CI/CD Pipeline with AWS Integration

This project includes a comprehensive GitHub Actions workflow that integrates with AWS services for continuous integration and deployment:

1. **Build and Test**: 
   - Runs automatically on every push and pull request
   - Verifies code quality and functionality

2. **AWS Integration**:
   - Configures AWS credentials securely via GitHub Secrets
   - Validates AWS resource access and permissions
   - Prepares deployment artifacts for AWS

3. **Docker Build and AWS ECR**:
   - Creates optimized Docker images for deployment
   - Pushes images to AWS Elastic Container Registry
   - Tags images for version control and rollbacks

4. **AWS CodeDeploy Integration**:
   - Automatically deploys to AWS infrastructure from the main branch
   - Configures AWS resources using Infrastructure as Code
   - Implements proper security protocols for AWS resources

5. **AWS Monitoring Integration**:
   - Sets up CloudWatch for application monitoring
   - Configures alarms and notifications
   - Enables logging and performance tracking

## Deployment Guide (Week 4 Final Implementation)

### Local Deployment

1. **Pre-requisites**:
   - Node.js 18+ installed
   - npm 8+ installed
   - Git client
   - PostgreSQL (optional, for local database usage)

2. **Clone and Setup**:
   ```bash
   git clone https://github.com/draiimon/Oaktree.git
   cd Oaktree
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file with:
   ```
   # Required - Database Connection
   DATABASE_URL=postgresql://username:password@localhost:5432/oaktree
   
   # Optional - AWS Integration
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=ap-southeast-1
   ```

4. **Start Application**:
   ```bash
   # Standard method (may have compatibility issues in some environments)
   npm run dev
   
   # Local compatibility mode (recommended for WSL or when standard method fails)
   node run-local.js
   ```
   Access the application at http://localhost:5000

### Docker Deployment

1. **Build the Docker Image**:
   ```bash
   docker build -t oaktree-devops:latest .
   ```

2. **Run the Container**:
   ```bash
   docker run -p 5000:5000 \
     -e AWS_ACCESS_KEY_ID=your_access_key \
     -e AWS_SECRET_ACCESS_KEY=your_secret_key \
     -e AWS_REGION=ap-southeast-1 \
     oaktree-devops:latest
   ```

3. **Access Application**:
   Open http://localhost:5000 in your browser

### AWS Cloud Deployment with Terraform

1. **Prerequisites**:
   - AWS CLI installed and configured
   - Terraform installed (v1.0.0+)
   - ECR repository created

2. **Configure AWS Credentials**:
   ```bash
   aws configure
   ```

3. **Initialize Terraform**:
   ```bash
   cd terraform
   terraform init
   ```

4. **Review Infrastructure Plan**:
   ```bash
   terraform plan
   ```

5. **Deploy Infrastructure**:
   ```bash
   terraform apply
   ```

6. **Configure GitHub Actions**:
   Add the following secrets to your GitHub repository:
   - `AWS_ACCESS_KEY_ID`: Your AWS access key
   - `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
   - `AWS_REGION`: Your AWS region (e.g., ap-southeast-1)
   - `ECR_REPOSITORY`: ECR repository name

7. **Deploy Application**:
   Push changes to the main branch to trigger automatic deployment.

8. **Monitor Deployment**:
   - Check GitHub Actions for build/deploy status
   - Monitor AWS CloudWatch for application logs

9. **Cleanup Resources**:
   When done testing, destroy resources to avoid charges:
   ```bash
   terraform destroy
   ```

### Cross-Environment Deployment Testing

To validate the application works across different environments as required by Week 4 curriculum:

1. **Test on Local Development**:
   - Run application with the most suitable method for your environment:
     ```bash
     npm run dev        # Standard method
     node run-local.js  # Compatible method for WSL/troubleshooting
     ```
   - Verify AWS connectivity and dashboard functionality

2. **Test on Docker**:
   - Build and run the Docker container
   - Verify all features work the same as in local development

3. **Test on AWS Cloud**:
   - Deploy using Terraform and GitHub Actions
   - Verify production environment metrics and functionality

## License

This project is licensed under the MIT License - see the LICENSE file for details.