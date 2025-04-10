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
   git clone https://github.com/your-username/oaktree-cloud-platform.git
   cd oaktree-cloud-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   Create a `.env` file with:
   ```
   # AWS Configuration
   AWS_REGION=ap-southeast-1
   AWS_ACCESS_KEY_ID=your_access_key_here
   AWS_SECRET_ACCESS_KEY=your_secret_key_here
   USE_AWS_DB=true
   
   # Note: No database URL needed - uses DynamoDB exclusively!
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

5. **Access the dashboard**
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

#### Local Development
```bash
# Just run the standard development server
npm run dev
```

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

## 🌟 Deployment Options

### Docker Deployment
Build and deploy as a container for maximum portability.

### AWS Cloud Deployment
1. Configure your AWS credentials
2. Use the platform's Terraform integration for Infrastructure as Code

## 🤝 Contributing

We welcome contributions! Please feel free to submit pull requests.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Developed by Mark Andrei Castillo**