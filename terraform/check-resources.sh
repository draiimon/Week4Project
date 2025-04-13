#!/bin/bash
# Script to check the status of AWS resources and how much they might be costing

# Load environment variables if needed
if [ -f .env ]; then
  source .env
fi

echo "==== Checking AWS Resources Status ===="

# Check ECS Service and Tasks
echo "--- ECS Status ---"
echo "Cluster: oaktree-dev-cluster"
aws ecs describe-services --cluster oaktree-dev-cluster --services oaktree-dev-service --region ap-southeast-1 --query 'services[0].{Name:serviceName,Status:status,DesiredCount:desiredCount,RunningCount:runningCount}' --output table

echo "Running Tasks:"
RUNNING_TASKS=$(aws ecs list-tasks --cluster oaktree-dev-cluster --region ap-southeast-1 --desired-status RUNNING --query 'taskArns' --output text)
if [ -z "$RUNNING_TASKS" ]; then
  echo "No running tasks found (Good for cost saving)."
else
  echo "$RUNNING_TASKS"
  echo "Warning: Running tasks will incur Fargate costs!"
fi

# Check ALB Status
echo -e "\n--- Load Balancer Status ---"
aws elbv2 describe-load-balancers --names oaktree-dev-alb --region ap-southeast-1 --query 'LoadBalancers[0].{Name:LoadBalancerName,State:State.Code,DNSName:DNSName}' --output table

# Check DynamoDB Table
echo -e "\n--- DynamoDB Status ---"
aws dynamodb describe-table --table-name oaktree-dev-users --region ap-southeast-1 --query 'Table.{Name:TableName,Status:TableStatus,BillingMode:BillingModeSummary.BillingMode,Size:TableSizeBytes}' --output table

# Check ECR Repository
echo -e "\n--- ECR Repository ---"
aws ecr describe-repositories --repository-names oaktree-dev --region ap-southeast-1 --query 'repositories[0].{Name:repositoryName,URI:repositoryUri}' --output table

echo -e "\n==== Cost Saving Status ===="
echo "Resources that cost money when not in use:"
echo "1. Load Balancer: Always incurs cost (approximately 16-25 USD/month) when provisioned"
echo "2. ECS Fargate: Only costs money when tasks are running (scale to 0 to save)"
echo "3. DynamoDB: Minimal costs in on-demand/pay-per-request mode when not used"
echo "4. ECR: Minimal costs for stored images"

if [ -z "$RUNNING_TASKS" ]; then
  echo -e "\nCurrent status: 👍 GOOD - No ECS tasks are running, minimizing costs."
else 
  echo -e "\nCurrent status: ⚠️ WARNING - ECS tasks are running, which will incur costs."
fi