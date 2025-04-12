# OakTree DevOps Platform

A DevOps platform specializing in AWS cloud infrastructure management and deployment automation, with real-time monitoring and administrative controls.

## Local Setup with Docker

### Prerequisites

- [Docker](https://www.docker.com/get-started/) installed on your machine
- AWS account with access credentials (optional, for full functionality)

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/oaktree-platform.git
   cd oaktree-platform
   ```

2. **Set up environment variables**

   **Important**: You need to manually create a `.env` file in the root directory with the required environment variables.
   
   Create a file named `.env` with the following contents, replacing the placeholders with your actual AWS credentials:

   ```
   # Enable AWS features (set to true to use AWS services)
   USE_AWS_DB=true
   
   # AWS Configuration (required for AWS integration)
   AWS_REGION=ap-southeast-1
   AWS_ACCESS_KEY_ID=your_actual_access_key_here
   AWS_SECRET_ACCESS_KEY=your_actual_secret_key_here
   
   # Application port (default: 5000)
   PORT=5000
   ```
   
   **Note**: This `.env` file is required for the application to connect to AWS services. You need to create it manually as it's not included in the repository for security reasons.

3. **Build and run with Docker**

   ```bash
   # Build the Docker image
   docker build -t oaktree-platform:latest .

   # Run the container with AWS integration
   docker run -p 5000:5000 --env-file .env oaktree-platform:latest
   ```

   **Alternative: Run without AWS integration**
   
   If you don't have AWS credentials, you can still run the platform with local storage:
   
   ```bash
   # Update your .env file
   echo "USE_AWS_DB=false" > .env
   
   # Run the container with local storage only
   docker run -p 5000:5000 --env-file .env oaktree-platform:latest
   ```

4. **Access the application**

   Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

5. **Login credentials**

   Default admin user:
   - Username: `msn_clx`
   - Password: `Mason@0905` (change this in production)

## Features

- AWS cloud infrastructure management
- Real-time monitoring
- Administrative controls
- CI/CD pipeline integration
- Infrastructure as Code (IaC) with Terraform

## Technologies

- React frontend with TypeScript
- Express backend
- AWS integration (DynamoDB, IAM)
- Docker containerization
- GitHub Actions