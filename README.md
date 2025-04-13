# OakTree DevOps Platform

![OakTree DevOps Platform](https://github.com/draiimon/Oaktree/raw/Week-4/attached_assets/banner.png)

A complete DevOps platform for managing AWS cloud infrastructure, monitoring real-time metrics, and streamlining deployment processes.

## 🚀 Getting Started

### Running Locally with Docker

#### What You Need:
- [Docker](https://www.docker.com/get-started/) installed on your computer
- AWS account with credentials (optional)

#### Step 1: Get the Code
```bash
git clone https://github.com/draiimon/Oaktree.git -b Week-4
cd Oaktree
```

#### Step 2: Set Up Your Environment File
Create a new file called `.env` in the main project folder. You can use nano (a simple text editor) to create and edit the file:

```bash
# Create and open .env file with nano
nano .env
```

Then copy and paste this template:

```
# REQUIRED CONFIGURATION
# Set this to 'true' to use AWS features, 'false' for local-only mode
USE_AWS_DB=true

# AWS Settings (Replace with your own credentials)
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key

# App Settings
PORT=5000
```

**Basic nano commands:**
- Type or paste your content
- Save: Press `Ctrl + O`, then `Enter`
- Exit: Press `Ctrl + X`

> ⚠️ **Important Note:** You must manually create this file. Your AWS credentials are sensitive - never commit them to Git!

#### Step 3: Build and Run with Docker

**Option A: With AWS Integration**
```bash
# Build the Docker image
docker build -t oaktree:latest .

# Run with your AWS credentials
docker run -p 5000:5000 --env-file .env oaktree:latest
```

**Option B: Without AWS** (Local Mode)
```bash
# Create .env file with AWS disabled
echo "USE_AWS_DB=false" > .env
echo "PORT=5000" >> .env

# Run in local-only mode
docker run -p 5000:5000 --env-file .env oaktree:latest
```

#### Step 4: Open the App
Go to [http://localhost:5000](http://localhost:5000) in your browser

#### Step 5: Log In
- **Username:** `msn_clx`
- **Password:** `Mason@0905`

## 📊 Core Features

- **AWS Infrastructure Management:** Visualize and control your cloud resources
- **Real-Time Metrics Dashboard:** Monitor system performance
- **Admin Control Panel:** Manage users and permissions
- **DynamoDB Integration:** Cloud database functionality
- **Infrastructure as Code:** Terraform configuration included

## 💻 Technical Stack

- **Frontend:** React with TypeScript, Tailwind CSS
- **Backend:** Express.js, Node.js
- **Cloud:** AWS (DynamoDB, IAM, Cognito)
- **DevOps:** Docker, GitHub Actions
- **IaC:** Terraform

## 🏗️ AWS Infrastructure Deployment

### Setting Up AWS ECS Fargate with Terraform

To deploy the infrastructure to AWS using Terraform:

1. **Install Terraform**
   - Download from [terraform.io/downloads](https://www.terraform.io/downloads)
   - Or install via package manager: `brew install terraform` (macOS) or `choco install terraform` (Windows)

2. **Configure AWS Credentials for Terraform**
   Make sure AWS credentials are available to Terraform either by:
   - Using the same `.env` file credentials
   - Or configuring the AWS CLI: `aws configure`

3. **Initialize Terraform**
   ```bash
   cd terraform
   terraform init
   ```

4. **Update Variables**
   Edit the `terraform.tfvars` file with your preferred settings:
   ```bash
   nano terraform.tfvars
   ```
   Example content:
   ```
   aws_region = "ap-southeast-1"
   app_name   = "oaktree"
   environment = "dev"
   ```

5. **Plan Deployment**
   ```bash
   terraform plan
   ```

6. **Apply Infrastructure**
   ```bash
   terraform apply -auto-approve
   ```

7. **Deploy Docker Image to ECR**
   After Terraform completes successfully, it will output commands for deploying your Docker image. They will look something like:
   ```bash
   # Login to ECR
   aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.ap-southeast-1.amazonaws.com/oaktree-dev

   # Build and push the Docker image
   docker build -t 123456789012.dkr.ecr.ap-southeast-1.amazonaws.com/oaktree-dev:latest .
   docker push 123456789012.dkr.ecr.ap-southeast-1.amazonaws.com/oaktree-dev:latest

   # Force new deployment
   aws ecs update-service --cluster oaktree-dev-cluster --service oaktree-dev-service --force-new-deployment --region ap-southeast-1
   ```

8. **Access Your Application**
   After deployment completes (which may take 5-10 minutes), access your application at the URL provided in the Terraform output:
   ```
   http://oaktree-dev-alb-XXXXXXXXXXXX.ap-southeast-1.elb.amazonaws.com
   ```

9. **Clean Up When Done**
   When you're finished with the infrastructure, tear it down to avoid ongoing AWS charges:
   ```bash
   terraform destroy -auto-approve
   ```

## 📝 Notes

- The application will work in local-only mode without AWS credentials
- Admin user credentials are pre-configured for testing
- For production use, change default passwords and secure your environment variables
- Terraform creates actual AWS resources which may incur costs in your AWS account

## 💰 AWS Cost Management

To help manage AWS costs while maintaining your infrastructure:

### Stopping Resources When Not in Use
Run the provided scripts in the terraform folder:

```bash
# To check current resource status and costs
cd terraform
./check-resources.sh

# To safely stop resources (scale down to 0 to save costs)
./stop-resources.sh

# To restart resources when you need them
./start-resources.sh
```

These scripts safely scale your ECS service to 0 tasks and optimize DynamoDB settings to minimize costs without destroying your infrastructure. This approach is much safer than using `terraform destroy` as it preserves all your configurations and data.

## ❓ Troubleshooting

### Can't connect to AWS services?
1. Double-check your AWS credentials in the `.env` file
2. Make sure your AWS account has the proper permissions
3. Try running in local mode first to verify the application works

### Terraform deployment issues?
1. Verify you have sufficient IAM permissions in your AWS account
2. If seeing duplicate resource errors, make sure to remove any previous Terraform state:
   ```bash
   rm -rf .terraform/
   rm terraform.tfstate*
   ```
3. For security group errors with protocol "-1", ensure both from_port and to_port are set to 0

### ECS container deployment failures?
1. Check the ECS service events for error messages:
   ```bash
   aws ecs describe-services --cluster oaktree-dev-cluster --services oaktree-dev-service --region ap-southeast-1
   ```
2. Verify your Docker image pushed successfully to ECR:
   ```bash
   aws ecr describe-images --repository-name oaktree-dev --region ap-southeast-1
   ```
3. Check CloudWatch logs for container errors:
   ```bash
   aws logs get-log-events --log-group-name /ecs/oaktree-dev --log-stream-name ecs/oaktree-dev/latest --region ap-southeast-1
   ```

### Docker issues?
1. Make sure Docker is running on your system
2. Try rebuilding the image: `docker build --no-cache -t oaktree:latest .`
3. Check Docker logs: `docker logs [container-id]`

### Environment file problems?
If you're using Windows and having trouble creating the `.env` file:
1. Use Notepad: `notepad .env`
2. Make sure to save as "All Files" not ".txt"
3. Or create via command prompt: `echo USE_AWS_DB=true > .env`

## 👨‍💻 Command Cheat Sheet

### Docker Commands
```bash
# Build image
docker build -t oaktree:latest .

# Run container
docker run -p 5000:5000 --env-file .env oaktree:latest

# List running containers
docker ps

# Stop container
docker stop [container-id]

# View logs
docker logs [container-id]
```

### AWS CLI Commands
```bash
# Login to ECR
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin [ecr-repo-url]

# List ECS clusters
aws ecs list-clusters --region ap-southeast-1

# Describe ECS service
aws ecs describe-services --cluster oaktree-dev-cluster --services oaktree-dev-service --region ap-southeast-1

# Force a new deployment
aws ecs update-service --cluster oaktree-dev-cluster --service oaktree-dev-service --force-new-deployment --region ap-southeast-1

# View container logs
aws logs get-log-events --log-group-name /ecs/oaktree-dev --log-stream-name ecs/oaktree-dev/[task-id] --region ap-southeast-1
```

### Terraform Commands
```bash
# Initialize Terraform
terraform init

# Plan changes
terraform plan

# Apply changes
terraform apply -auto-approve

# Destroy infrastructure
terraform destroy -auto-approve

# Validate configuration
terraform validate

# Show current state
terraform show
```

### Nano Editor Basics
```bash
# Open/create file
nano [filename]

# Save file
Ctrl + O, then Enter

# Exit nano
Ctrl + X

# Cut text
Ctrl + K

# Paste text
Ctrl + U

# Find text
Ctrl + W
```

