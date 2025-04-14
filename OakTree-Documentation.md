# **OakTree Infrastructure Monitoring Platform**
# **Complete Technical Documentation**

_Author: CASTILLO_  
_Date: April 13, 2025_

![OakTree Platform Banner](https://example.com/placeholder-image)
_**[Screenshot Opportunity: Create a custom banner with the OakTree logo using the orange-gray gradient theme]**_

## **Table of Contents**
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Infrastructure Architecture](#infrastructure-architecture)
4. [Database Schema](#database-schema)
5. [Authentication System](#authentication-system)
6. [Deployment Process](#deployment-process)
7. [Monitoring & Alerting](#monitoring--alerting)
8. [Security Considerations](#security-considerations)
9. [Future Enhancements](#future-enhancements)
10. [Troubleshooting Guide](#troubleshooting-guide)

<a id="project-overview"></a>
## **1. Project Overview**

OakTree is a comprehensive infrastructure monitoring platform designed to provide real-time insights into AWS cloud resources. The application enables DevOps teams to monitor, manage, and optimize their cloud infrastructure through an intuitive dashboard interface.

### **Key Features**
- Real-time monitoring of AWS services (EC2, ECS, DynamoDB)
- Interactive infrastructure visualization
- User authentication and role-based access control
- Automated alerting based on customizable thresholds
- Historical performance data tracking and analysis
- Region-specific resource management

_**[Screenshot Opportunity: Home dashboard showing infrastructure overview with the orange-gray theme]**_

<a id="technology-stack"></a>
## **2. Technology Stack**

### **Frontend**
- **Framework**: React.js with TypeScript
- **State Management**: React Query for server state, Context API for UI state
- **Styling**: Tailwind CSS with custom theming
- **UI Components**: Shadcn/UI component library
- **Routing**: Wouter for lightweight page routing
- **Data Visualization**: Recharts for metrics and performance graphs

### **Backend**
- **Runtime**: Node.js v18
- **API Framework**: Express.js
- **Authentication**: Passport.js with JWT strategy
- **Database Access**: Drizzle ORM with PostgreSQL
- **AWS Integration**: AWS SDK for JavaScript v3
- **Error Handling**: Custom middleware with structured response format

### **Infrastructure**
- **Containerization**: Docker with multi-stage builds
- **Container Registry**: Amazon ECR (Elastic Container Registry)
- **Container Orchestration**: Amazon ECS (Elastic Container Service) with Fargate
- **Database**: Amazon DynamoDB for user data, PostgreSQL for application data
- **Load Balancing**: Application Load Balancer (ALB)
- **Networking**: VPC with public and private subnets across multiple AZs
- **DNS Management**: Route 53 for domain routing
- **Infrastructure as Code**: Terraform for AWS resource provisioning

### **DevOps Tools**
- **Version Control**: Git with GitHub
- **CI/CD Pipeline**: GitHub Actions
- **Monitoring**: Amazon CloudWatch
- **Logging**: CloudWatch Logs with structured JSON logging
- **Alerting**: CloudWatch Alarms with SNS notifications

_**[Screenshot Opportunity: Architecture diagram showing how these technologies interact]**_

<a id="infrastructure-architecture"></a>
## **3. Infrastructure Architecture**

The OakTree platform is deployed on AWS using a highly available, scalable, and secure architecture designed to minimize downtime and optimize performance.

```
                                         ┌─────────────────────────────────┐
                                         │         AWS Cloud (ap-southeast-1)       │
                                         │                             │
                                         │  ┌─────────────────────┐    │
                                         │  │   Route 53 (DNS)    │    │
                                         │  └─────────┬───────────┘    │
                                         │            │                │
                                         │            ▼                │
                                         │  ┌─────────────────────┐    │
                                         │  │  Application Load   │    │
                                         │  │     Balancer        │    │
                                         │  └─────────┬───────────┘    │
                                         │            │                │
                                         │            ▼                │
                                         │  ┌─────────────────────┐    │
                                         │  │     Auto Scaling    │    │
                                         │  │        Group        │    │
                                         │  └─────────┬───────────┘    │
                                         │            │                │
                                         │            ▼                │
┌─────────────────┐                      │  ┌─────────────────────┐    │
│    Client       │                      │  │    ECS Cluster      │    │
│   (Browser)     │ ◄────── HTTPS ─────► │  │                     │    │
└─────────────────┘                      │  │ ┌─────────┐ ┌─────┐ │    │
                                         │  │ │Container│ │Task │ │    │
                                         │  │ │  (App)  │ │Def. │ │    │
                                         │  │ └────┬────┘ └─────┘ │    │
                                         │  └──────┼──────────────┘    │
                                         │         │                   │
                                         │         ▼                   │
                                         │  ┌─────────────────────┐    │
                                         │  │    ECR Repository   │    │
                                         │  │   (Docker Images)   │    │
                                         │  └─────────────────────┘    │
                                         │         │                   │
                                         │         ▼                   │
                                         │  ┌─────────────────────┐    │
                                         │  │      Database       │    │
                                         │  │   ┌───────────┐     │    │
                                         │  │   │PostgreSQL │     │    │
                                         │  │   └───────────┘     │    │
                                         │  │   ┌───────────┐     │    │
                                         │  │   │ DynamoDB  │     │    │
                                         │  │   └───────────┘     │    │
                                         │  └─────────────────────┘    │
                                         │                             │
                                         │         MONITORING          │
                                         │  ┌─────────────────────┐    │
                                         │  │    CloudWatch       │    │
                                         │  │ ┌───────┐ ┌───────┐ │    │
                                         │  │ │ Logs  │ │Alarms │ │    │
                                         │  │ └───────┘ └───────┘ │    │
                                         │  │ ┌───────────────┐   │    │
                                         │  │ │   Dashboard   │   │    │
                                         │  │ └───────────────┘   │    │
                                         │  └─────────────────────┘    │
                                         │                             │
                                         │  ┌─────────────────────┐    │
                                         │  │  IAM (Security)     │    │
                                         │  └─────────────────────┘    │
                                         │                             │
                                         └─────────────────────────────┘
```

### **VPC Configuration**
- VPC CIDR Block: 10.0.0.0/16
- Public Subnets: 10.0.1.0/24 (ap-southeast-1a), 10.0.2.0/24 (ap-southeast-1b)
- Private Subnets: 10.0.3.0/24 (ap-southeast-1a), 10.0.4.0/24 (ap-southeast-1b)
- Internet Gateway: Attached to VPC for public subnet internet access
- NAT Gateway: For private subnet outbound connectivity
- Route Tables: Configured for both public and private subnets

### **Security Groups**
- **ALB Security Group**: 
  - Inbound: HTTP (80), HTTPS (443) from 0.0.0.0/0
  - Outbound: All traffic to 0.0.0.0/0
- **ECS Security Group**: 
  - Inbound: Traffic on port 5000 from ALB Security Group only
  - Outbound: All traffic to 0.0.0.0/0
- **Database Security Group**: 
  - Inbound: PostgreSQL (5432) from ECS Security Group only
  - Outbound: All traffic to 0.0.0.0/0

### **Load Balancer Configuration**
- Type: Application Load Balancer
- Listeners: HTTP (80), HTTPS (443)
- Target Groups: 
  - Port: 5000
  - Protocol: HTTP
  - Health Check Path: /health
  - Health Check Interval: 30 seconds
  - Healthy Threshold: 2
  - Unhealthy Threshold: 3

### **ECS Configuration**
- Cluster: oaktree-cluster
- Task Definition:
  - CPU: 256 (.25 vCPU)
  - Memory: 512 MB
  - Container Port: 5000
  - Host Port: 5000
- Service:
  - Launch Type: FARGATE
  - Desired Count: 2
  - Deployment Type: Rolling Update
  - Auto Scaling:
    - Minimum Capacity: 2
    - Maximum Capacity: 10
    - Scaling Metric: CPU Utilization (Target: 70%)

_**[Screenshot Opportunity: AWS Console showing the actual deployed VPC and subnets]**_

_**[Screenshot Opportunity: AWS Console showing the created security groups]**_

_**[Screenshot Opportunity: AWS Console showing the ECS cluster with running tasks]**_

<a id="database-schema"></a>
## **4. Database Schema**

OakTree uses a hybrid database approach:
- **PostgreSQL**: For relational data (users, roles, application settings)
- **DynamoDB**: For time-series metrics and infrastructure monitoring data

### **PostgreSQL Schema**

#### **Users Table**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### **Roles Table**
```sql
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### **User Roles Table**
```sql
CREATE TABLE user_roles (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, role_id)
);
```

#### **Settings Table**
```sql
CREATE TABLE settings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  key VARCHAR(100) NOT NULL,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, key)
);
```

#### **Alerts Table**
```sql
CREATE TABLE alerts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  resource_type VARCHAR(50) NOT NULL,
  resource_id VARCHAR(100) NOT NULL,
  metric_name VARCHAR(100) NOT NULL,
  threshold NUMERIC NOT NULL,
  comparison_operator VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### **DynamoDB Schema**

#### **Metrics Table**
- Partition Key: `resource_id` (String)
- Sort Key: `timestamp` (Number)
- Attributes:
  - `metric_name` (String)
  - `value` (Number)
  - `unit` (String)
  - `dimensions` (Map)
  - `region` (String)

#### **Events Table**
- Partition Key: `resource_id` (String)
- Sort Key: `timestamp` (Number)
- Attributes:
  - `event_type` (String)
  - `message` (String)
  - `severity` (String)
  - `details` (Map)
  - `region` (String)

_**[Screenshot Opportunity: Database schema diagram showing relationships]**_

<a id="authentication-system"></a>
## **5. Authentication System**

OakTree implements a secure authentication system using JWT tokens and role-based access control.

### **Registration Process**
1. User submits registration form with username, email, and password
2. Backend validates the input data
3. Password is hashed using bcrypt with a salt factor of 12
4. User record is created in the database with default role
5. Confirmation email is sent (optional)
6. User is redirected to login page

### **Login Process**
1. User submits login form with username/email and password
2. Backend validates credentials against database
3. On successful authentication, JWT token is generated containing:
   - User ID
   - Username
   - Roles
   - Expiration time (24 hours)
4. Token is returned to client and stored in browser localStorage
5. User is redirected to dashboard

### **Authentication Middleware**
```javascript
// Extract and verify the JWT token from the request header
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          status: 'error',
          message: 'Invalid or expired token'
        });
      }
      
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({
      status: 'error',
      message: 'Authentication required'
    });
  }
};
```

### **Authorization Middleware**
```javascript
// Check if the user has the required role
const checkRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }
    
    if (!req.user.roles.includes(role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Insufficient permissions'
      });
    }
    
    next();
  };
};
```

_**[Screenshot Opportunity: Login screen with OakTree branding]**_

_**[Screenshot Opportunity: Registration form with validation messages]**_

_**[Screenshot Opportunity: Password reset flow]**_

<a id="deployment-process"></a>
## **6. Deployment Process**

OakTree uses a fully automated CI/CD pipeline to deploy changes from code to production.

### **CI/CD Pipeline Steps**

1. **Code Push**: Developer pushes code to GitHub repository
2. **Automated Testing**: GitHub Actions runs unit and integration tests
3. **Build Docker Image**: On successful tests, Docker image is built
4. **Push to ECR**: Image is tagged and pushed to Amazon ECR
5. **Update ECS Service**: ECS service is updated with new image
6. **Health Checks**: ALB performs health checks on new container instances
7. **Rollback Mechanism**: Automatic rollback if health checks fail
8. **Notifications**: Team receives deployment status notifications

### **GitHub Actions Workflow**

```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    name: Test
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
  
  build-and-deploy:
    name: Build and Deploy
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v1
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ap-southeast-1

    - name: Login to Amazon ECR
      id: login-ecr
      uses: aws-actions/amazon-ecr-login@v1

    - name: Build, tag, and push image to Amazon ECR
      env:
        ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        ECR_REPOSITORY: oaktree
        IMAGE_TAG: ${{ github.sha }}
      run: |
        docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
        docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
        docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
        docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest
        
    - name: Update ECS service
      run: |
        aws ecs update-service --cluster oaktree-cluster --service oaktree-service --force-new-deployment
        
    - name: Wait for service stability
      run: |
        aws ecs wait services-stable --cluster oaktree-cluster --services oaktree-service
```

### **Deployment Verification**

- **Automated Checks**: 
  - Container health checks
  - Endpoint availability tests
  - Database connection validation
  
- **Manual Verification**:
  - UI/UX testing
  - Performance assessment
  - Security review

_**[Screenshot Opportunity: GitHub Actions workflow showing successful deployment]**_

_**[Screenshot Opportunity: AWS ECS console showing the deployment in progress]**_

<a id="monitoring--alerting"></a>
## **7. Monitoring & Alerting**

OakTree uses CloudWatch for comprehensive monitoring and alerting of both the application itself and the AWS infrastructure it monitors.

### **CloudWatch Metrics Collected**

- **Application Metrics**:
  - API Response Time
  - Error Rate
  - Request Count
  - Active Users
  
- **Infrastructure Metrics**:
  - CPU Utilization
  - Memory Usage
  - Network Traffic
  - Disk I/O

### **CloudWatch Dashboards**

```json
{
  "widgets": [
    {
      "type": "metric",
      "x": 0,
      "y": 0,
      "width": 12,
      "height": 6,
      "properties": {
        "metrics": [
          [ "AWS/ECS", "CPUUtilization", "ServiceName", "oaktree-service", "ClusterName", "oaktree-cluster", { "stat": "Average" } ]
        ],
        "view": "timeSeries",
        "stacked": false,
        "region": "ap-southeast-1",
        "title": "ECS CPU Utilization",
        "period": 300
      }
    },
    {
      "type": "metric",
      "x": 12,
      "y": 0,
      "width": 12,
      "height": 6,
      "properties": {
        "metrics": [
          [ "AWS/ECS", "MemoryUtilization", "ServiceName", "oaktree-service", "ClusterName", "oaktree-cluster", { "stat": "Average" } ]
        ],
        "view": "timeSeries",
        "stacked": false,
        "region": "ap-southeast-1",
        "title": "ECS Memory Utilization",
        "period": 300
      }
    },
    {
      "type": "metric",
      "x": 0,
      "y": 6,
      "width": 12,
      "height": 6,
      "properties": {
        "metrics": [
          [ "AWS/ApplicationELB", "RequestCount", "LoadBalancer", "oaktree-alb" ]
        ],
        "view": "timeSeries",
        "stacked": false,
        "region": "ap-southeast-1",
        "title": "ALB Request Count",
        "period": 300
      }
    },
    {
      "type": "metric",
      "x": 12,
      "y": 6,
      "width": 12,
      "height": 6,
      "properties": {
        "metrics": [
          [ "AWS/ApplicationELB", "TargetResponseTime", "LoadBalancer", "oaktree-alb", { "stat": "Average" } ]
        ],
        "view": "timeSeries",
        "stacked": false,
        "region": "ap-southeast-1",
        "title": "ALB Response Time",
        "period": 300
      }
    }
  ]
}
```

### **CloudWatch Alarms**

| Alarm Name | Metric | Threshold | Period | Evaluation Periods | Action |
|------------|--------|-----------|--------|-------------------|--------|
| High CPU | CPUUtilization | > 80% | 5 min | 2 | SNS Notification |
| High Memory | MemoryUtilization | > 80% | 5 min | 2 | SNS Notification |
| High Error Rate | 5XXError | > 5 | 5 min | 2 | SNS Notification |
| High Response Time | TargetResponseTime | > 2 sec | 5 min | 2 | SNS Notification |

### **Logging Strategy**

- **Log Format**: JSON structured logs
- **Log Storage**: CloudWatch Logs
- **Log Retention**: 30 days
- **Log Streams**:
  - Application logs
  - Access logs
  - Error logs
  - AWS API call logs

### **Alerting Workflow**
1. CloudWatch Alarm triggered
2. SNS Topic notification sent
3. Multiple subscription endpoints:
   - Email notifications
   - Slack channel alerts
   - PagerDuty integration

_**[Screenshot Opportunity: CloudWatch dashboard showing OakTree metrics]**_

_**[Screenshot Opportunity: CloudWatch alarm configuration for high CPU usage]**_

<a id="security-considerations"></a>
## **8. Security Considerations**

### **Data Protection**
- All data in transit is encrypted using TLS 1.2+
- Database data at rest is encrypted using AWS KMS
- Sensitive environment variables are stored in AWS Secrets Manager
- Personal data is pseudonymized where possible

### **Access Controls**
- Principle of least privilege applied to all IAM roles
- Multi-factor authentication required for AWS console access
- Regular access reviews and permission auditing
- Temporary credentials used for CI/CD pipelines

### **Network Security**
- Public-facing services limited to required ports only
- Private services only accessible within VPC
- Security groups restrict traffic to minimum required
- VPC Flow Logs enabled for network traffic auditing

### **Application Security**
- Input validation on all API endpoints
- Protection against common web vulnerabilities (XSS, CSRF, SQL Injection)
- Rate limiting to prevent abuse
- Regular dependency updates to patch security vulnerabilities

### **Compliance Considerations**
- Logging and monitoring for compliance evidence
- Regular security assessments
- Privacy controls for user data
- Incident response plan documented

_**[Screenshot Opportunity: IAM policy showing least privilege configuration]**_

_**[Screenshot Opportunity: Security group configuration showing restricted access]**_

<a id="future-enhancements"></a>
## **9. Future Enhancements**

### **Short-term Improvements (1-3 months)**
- HTTPS implementation with AWS Certificate Manager
- Enhanced user onboarding experience
- Mobile-responsive design improvements
- Advanced filtering options for resource views
- Performance optimization for large infrastructure environments

### **Medium-term Features (3-6 months)**
- Multi-cloud support (Google Cloud Platform, Microsoft Azure)
- Integration with additional monitoring tools (Prometheus, Grafana)
- Custom dashboard builder for personalized views
- Automated cost optimization recommendations
- Role-based access control improvements

### **Long-term Vision (6+ months)**
- Machine learning for anomaly detection
- Predictive scaling recommendations
- Infrastructure optimization engine
- Advanced visualization with 3D infrastructure mapping
- Comprehensive API for third-party integrations

_**[Screenshot Opportunity: Product roadmap diagram showing planned features]**_

<a id="troubleshooting-guide"></a>
## **10. Troubleshooting Guide**

### **Common Deployment Issues**

| Issue | Possible Causes | Solutions |
|-------|----------------|-----------|
| ECS Tasks failing to start | Incorrect IAM permissions | Check task execution role permissions |
| | Health check failing | Verify health check endpoint is returning 200 |
| | Resource constraints | Check CPU/memory allocation in task definition |
| ALB 5XX errors | Backend service unavailable | Check ECS service status |
| | Timeout issues | Adjust timeout settings in ALB |
| | Application errors | Check CloudWatch logs for application errors |
| Database connection failures | Security group issues | Verify security group rules |
| | Credentials issue | Check environment variables |
| | Database resource limits | Check RDS/DynamoDB capacity |

### **Application Error Troubleshooting**

1. **Check Application Logs**:
   ```bash
   aws logs get-log-events --log-group-name /ecs/oaktree --log-stream-name app/latest
   ```

2. **Check Container Status**:
   ```bash
   aws ecs describe-tasks --cluster oaktree-cluster --tasks <task-id>
   ```

3. **Verify ALB Health**:
   ```bash
   aws elbv2 describe-target-health --target-group-arn <target-group-arn>
   ```

4. **Test API Endpoints**:
   ```bash
   curl -v https://<alb-dns-name>/health
   ```

5. **Restart Service**:
   ```bash
   aws ecs update-service --cluster oaktree-cluster --service oaktree-service --force-new-deployment
   ```

_**[Screenshot Opportunity: CloudWatch Logs showing application error messages]**_

_**[Screenshot Opportunity: AWS ECS task details showing container status]**_

---

*This documentation is maintained by the OakTree Infrastructure Team. Last updated: April 13, 2025.*