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
- PostgreSQL (for local development)
- Docker (optional, for containerized deployment)
- AWS Account with DynamoDB access (optional)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/draiimon/Oaktree.git
   cd Oaktree
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory with:
   ```
   DATABASE_URL=postgresql://[username]:[password]@localhost:5432/oaktree
   # Optional AWS configuration
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=your_region
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   Open your browser and navigate to http://localhost:5000

### Running in Windows WSL

1. Follow the same steps as Local Development Setup
2. Ensure PostgreSQL is installed and running in your WSL environment
3. Make sure to update your `.env` file with the correct DATABASE_URL for your WSL PostgreSQL instance
4. Run the application using `npm run dev`

### Docker Deployment

1. **Build the Docker image**
   ```bash
   docker build -t oaktree-app:latest .
   ```

2. **Run the container**
   ```bash
   docker run -d -p 5000:5000 \
     -e DATABASE_URL=postgresql://[username]:[password]@host.docker.internal:5432/oaktree \
     -e AWS_ACCESS_KEY_ID=your_access_key \
     -e AWS_SECRET_ACCESS_KEY=your_secret_key \
     -e AWS_REGION=your_region \
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
│   ├── storage.ts      # Data storage interface
│   └── ...
├── shared/             # Shared types and utilities
├── .dockerignore       # Docker ignore file
├── .env.example        # Example environment variables
├── Dockerfile          # Docker configuration
├── package.json        # Dependencies and scripts
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

## License

This project is licensed under the MIT License - see the LICENSE file for details.