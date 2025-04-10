# OakTree DevOps Project - AWS Cloud Management Platform

A comprehensive AWS cloud infrastructure management and deployment platform with real-time monitoring and admin controls.

**By Mark Andrei Castillo**

## 🚀 Key Features

- **AWS DynamoDB Integration**: Secure user authentication and data storage
- **Interactive Admin Panel**: Toggle AWS services to save credits
- **Real-time AWS Metrics**: Monitor your cloud resources with live data
- **Multi-Environment Support**: Runs seamlessly on any platform (Linux, Windows, Docker)
- **Modern React UI**: Sleek interface with responsive design
- **Infrastructure Management**: Complete AWS resource visualization
- **Secure Authentication**: Local admin user plus AWS-powered user management
- **Terraform Integration**: Ready for Infrastructure as Code deployments

## 📋 Quick Start Guide

### Prerequisites

- Node.js (v18+)
- npm (v8+)
- Docker (optional, for containerized deployment)
- AWS Account (optional, for full cloud functionality)

### Basic Setup

1. **Clone the repository**
   ```bash
   git clone -b Week-4 https://github.com/draiimon/Oaktree.git
   cd Oaktree
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the Fix Script (for local environments)**
   ```bash
   # Fix any compatibility issues automatically
   node fix.cjs
   ```

4. **Configure environment**
   Create a `.env` file with:
   ```
   # Without AWS Account:
   AWS_REGION=ap-southeast-1
   AWS_ACCESS_KEY_ID=placeholder
   AWS_SECRET_ACCESS_KEY=placeholder
   USE_AWS_DB=false
   
   # With AWS Account (for real DynamoDB):
   # AWS_REGION=ap-southeast-1
   # AWS_ACCESS_KEY_ID=your_access_key_here
   # AWS_SECRET_ACCESS_KEY=your_secret_key_here
   # USE_AWS_DB=true
   ```

5. **Start the application**
   ```bash
   npm run dev
   ```

6. **Access the dashboard**
   - Open http://localhost:5000
   - Login with admin credentials:
     - Username: `msn_clx`
     - Password: `Mason@0905`


## 🛠️ Architecture Overview

### AWS Services Integration

#### DynamoDB Integration
- **Primary Function**: User account storage and authentication
- **Table Structure**: OakTreeUsers with username as primary key
- **Admin Control**: Can be disabled to save AWS credits

#### Admin Features
- **Resource Toggle**: Enable/disable DynamoDB to save credits
- **Real-time Status**: Monitor AWS connection status
- **AWS Cloud Metrics**: View usage statistics and performance data

### Multi-Environment Support

#### Local Development (Simple Setup)

For running on local machines (Windows, Linux, WSL):
```bash
# Fix the local environment issues with one command
node fix.cjs

# Then run the app normally
npm run dev
```

> **Note for WSL/Linux users**: If you still encounter issues, try installing tsx globally with `npm install -g tsx` and run `tsx server/index.ts` directly.

#### Docker Container
```bash
# Build container
docker build -t oaktree-platform:latest .

# Run container
docker run -d -p 5000:5000 \
  -e AWS_REGION=ap-southeast-1 \
  -e AWS_ACCESS_KEY_ID=your_key \
  -e AWS_SECRET_ACCESS_KEY=your_secret \
  -e USE_AWS_DB=true \
  --name oaktree-container \
  oaktree-platform:latest
```

## 📊 Dashboard & Monitoring

The platform provides comprehensive real-time monitoring:

- **AWS Connection Status**: View and verify your AWS connection
- **DynamoDB Table Status**: Monitor your database health
- **System Performance**: Real-time metrics for CPU, memory, and network
- **User Activity**: Track user registrations and authentications

## 🔐 Security Features

- **Admin Authentication**: Secure admin user with local fallback
- **AWS IAM Integration**: Proper permissions management
- **Environment Variable Protection**: Secure handling of AWS credentials
- **Credit-Saving Features**: Disable AWS calls when not needed

## 🔧 Development Guide

### Project Structure
```
.
├── client/               # React frontend
│   └── src/              # Frontend source code
│       ├── components/   # UI components
│       └── pages/        # Application pages
├── server/               # Express backend
│   ├── aws-db.ts         # AWS DynamoDB integration
│   ├── routes.ts         # API endpoints
│   └── storage.ts        # Data storage interface
└── shared/               # Shared code and types
```

### Key Components

- **Admin Panel**: Located at `client/src/components/ui/admin-panel.tsx`
- **AWS Status**: Located at `client/src/components/ui/aws-status.tsx`
- **DynamoDB Integration**: Located at `server/aws-db.ts`

### Local Compatibility Files

These files make the project compatible with local development environments:

- **local-dev.js**: Modified server startup script for local environments
- **vite.config.local.ts**: Compatible Vite configuration for local development
- **local-setup.md**: Comprehensive guide for local setup

## 🌟 Deployment Options

### Docker Deployment
Build and deploy as a container for maximum portability:

```bash
# Build the Docker image
docker build -t oaktree-platform:latest .

# Run with AWS cloud integration
docker run -d -p 5000:5000 \
  -e USE_AWS_DB=true \
  -e AWS_ACCESS_KEY_ID=your_access_key \
  -e AWS_SECRET_ACCESS_KEY=your_secret_key \
  -e AWS_REGION=your_region \
  --name oaktree-container \
  oaktree-platform:latest
```

### AWS Cloud Deployment with Terraform

The platform includes complete Terraform configuration for deploying to AWS:

```bash
# Navigate to the terraform directory
cd terraform

# Initialize Terraform to download providers
terraform init

# Plan your deployment to see what resources will be created
terraform plan

# Apply the configuration to create the AWS resources
terraform apply -auto-approve
```

The Terraform configuration will create:
1. **DynamoDB Table**: For user storage and authentication
2. **IAM Roles**: With proper permissions for your application
3. **EC2 Instance**: For hosting the application
4. **CloudWatch Alarms**: For monitoring

#### How to customize AWS deployment:

Edit the `terraform/variables.tf` file to customize:
- AWS Region
- Instance type
- Storage capacity
- Resource naming

## 🤝 Contributing

We welcome contributions! Please feel free to submit pull requests.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Developed by Mark Andrei Castillo**
