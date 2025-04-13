#!/bin/bash
# Script to safely "start" previously stopped AWS resources
# Brings the application back online

# Load environment variables if needed
if [ -f .env ]; then
  source .env
fi

echo "==== Safely starting AWS resources ===="

# Step 1: Update ECS service to desired count of 1 task
echo "Scaling up ECS service to 1 task..."
aws ecs update-service --cluster oaktree-dev-cluster --service oaktree-dev-service --desired-count 1 --region ap-southeast-1

# Step 2: Wait for tasks to start
echo "Waiting for tasks to start (this may take a minute)..."
sleep 60

# Step 3: Check if the task is running
RUNNING_TASKS=$(aws ecs list-tasks --cluster oaktree-dev-cluster --region ap-southeast-1 --desired-status RUNNING --query 'taskArns' --output text)
if [ -z "$RUNNING_TASKS" ]; then
  echo "Warning: No running tasks found. Please check ECS service status manually."
else
  echo "ECS tasks are now running!"
  echo "Running tasks: $RUNNING_TASKS"
fi

# Step 4: Get the ALB DNS name
ALB_DNS=$(aws elbv2 describe-load-balancers --names oaktree-dev-alb --region ap-southeast-1 --query 'LoadBalancers[0].DNSName' --output text)

echo "==== Resources successfully started! ===="
echo "Your application should be accessible in a few minutes at:"
echo "http://$ALB_DNS"