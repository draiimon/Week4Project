#!/bin/bash
# Script to safely "stop" resources in AWS without destroying them
# This reduces costs while keeping the infrastructure intact

# Load environment variables if needed
if [ -f .env ]; then
  source .env
fi

echo "==== Safely stopping AWS resources to save costs ===="

# Step 1: Scale down ECS service to 0 tasks
echo "Scaling down ECS service to 0 tasks..."
aws ecs update-service --cluster oaktree-dev-cluster --service oaktree-dev-service --desired-count 0 --region ap-southeast-1

# Step 2: Wait for tasks to stop
echo "Waiting for tasks to stop..."
sleep 30

# Step 3: Verify tasks are stopped
RUNNING_TASKS=$(aws ecs list-tasks --cluster oaktree-dev-cluster --region ap-southeast-1 --desired-status RUNNING --query 'taskArns' --output text)
if [ -z "$RUNNING_TASKS" ]; then
  echo "All tasks successfully stopped!"
else
  echo "Warning: There are still running tasks. Please check manually."
  echo "Running tasks: $RUNNING_TASKS"
fi

# Step 4: Update DynamoDB table to on-demand capacity units (which costs less when not used)
echo "Setting DynamoDB to pay-per-request billing..."
aws dynamodb update-table --table-name oaktree-dev-users --billing-mode PAY_PER_REQUEST --region ap-southeast-1

echo "==== Resources safely stopped! ===="
echo "Your infrastructure is still intact, but running with minimal costs."
echo "To restart, run the start-resources.sh script."