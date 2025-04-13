# **Week 4: End-to-End DevOps Project - Day 6 (Thursday, April 10, 2025)**

## **Introduction**

Today is the sixth day of my Week 4 project. After implementing monitoring, logging, and security enhancements yesterday, I focused on advanced deployment strategies and automation. These practices are essential for minimizing downtime during deployments and ensuring reliable updates to the production environment.

## **What I Did Today**

### **Blue/Green Deployment Setup:**

- Implemented blue/green deployment strategy with CodeDeploy
- Created deployment groups for staging and production
- Set up traffic shifting with weighted routing
- Configured rollback triggers for failed deployments
- Documented the deployment workflow

### **Database Management:**

- Implemented automated database backups
- Set up point-in-time recovery for RDS
- Created database migration scripts
- Tested database restore procedures
- Documented database management processes

### **Infrastructure Testing:**

- Implemented infrastructure tests with AWS CloudFormation Guard
- Created compliance rules for infrastructure validation
- Set up infrastructure testing in CI/CD pipeline
- Documented testing strategies and procedures
- Created test reports for audit purposes

### **Disaster Recovery Planning:**

- Designed disaster recovery strategy
- Implemented cross-region replication for critical resources
- Created recovery time objective (RTO) and recovery point objective (RPO) documentation
- Set up disaster recovery automation scripts
- Tested failover and failback procedures

## **Screenshot-worthy Resources and Documentation**

### **Blue/Green Deployment Configuration**

I implemented blue/green deployment using AWS CodeDeploy with the following configuration:

```yaml
# appspec.yml
version: 0.0
Resources:
  - TargetService:
      Type: AWS::ECS::Service
      Properties:
        TaskDefinition: <TASK_DEFINITION>
        LoadBalancerInfo:
          ContainerName: "oaktree-app"
          ContainerPort: 5000
        PlatformVersion: "LATEST"
Hooks:
  - BeforeInstall: "LambdaFunctions/BeforeInstall"
  - AfterInstall: "LambdaFunctions/AfterInstall"
  - AfterAllowTestTraffic: "LambdaFunctions/AfterAllowTestTraffic"
  - BeforeAllowTraffic: "LambdaFunctions/BeforeAllowTraffic"
  - AfterAllowTraffic: "LambdaFunctions/AfterAllowTraffic"
```

And the CloudFormation template for the deployment group:

```yaml
CodeDeployServiceRole:
  Type: AWS::IAM::Role
  Properties:
    AssumeRolePolicyDocument:
      Version: '2012-10-17'
      Statement:
      - Effect: Allow
        Principal:
          Service: codedeploy.amazonaws.com
        Action: sts:AssumeRole
    ManagedPolicyArns:
    - arn:aws:iam::aws:policy/AWSCodeDeployRoleForECS

DeploymentGroup:
  Type: AWS::CodeDeploy::DeploymentGroup
  Properties:
    ApplicationName: !Ref CodeDeployApplication
    ServiceRoleArn: !GetAtt CodeDeployServiceRole.Arn
    DeploymentConfigName: CodeDeployDefault.ECSAllAtOnce
    DeploymentStyle:
      DeploymentType: BLUE_GREEN
      DeploymentOption: WITH_TRAFFIC_CONTROL
    BlueGreenDeploymentConfiguration:
      DeploymentReadyOption:
        ActionOnTimeout: CONTINUE_DEPLOYMENT
        WaitTimeInMinutes: 5
      TerminateBlueInstancesOnDeploymentSuccess:
        Action: TERMINATE
        TerminationWaitTimeInMinutes: 5
    LoadBalancerInfo:
      TargetGroupPairInfoList:
      - ProdTrafficRoute:
          ListenerArns:
          - !Ref ProdListenerArn
        TargetGroups:
        - Name: !Ref BlueTargetGroup
        - Name: !Ref GreenTargetGroup
        TestTrafficRoute:
          ListenerArns:
          - !Ref TestListenerArn
    ECSServices:
    - ClusterName: !Ref ECSCluster
      ServiceName: !Ref ECSService
    AutoRollbackConfiguration:
      Enabled: true
      Events:
      - DEPLOYMENT_FAILURE
      - DEPLOYMENT_STOP_ON_ALARM
      - DEPLOYMENT_STOP_ON_REQUEST
```

The blue/green deployment process looks like this:

![Blue/Green Deployment Architecture](https://d1.awsstatic.com/product-marketing/CodeDeploy/CodeDeploy_BlueGreenDeployment.22ae153f39aefc52b6975f9679f2e5131bf0c29d.png)

**Take a screenshot of this Blue/Green Deployment configuration and architecture diagram for your documentation.**

### **Database Backup and Recovery Configuration**

I implemented automated RDS database backups with the following configuration:

```json
{
  "DBInstanceIdentifier": "oaktree-db-instance",
  "PreferredBackupWindow": "03:00-04:00",
  "BackupRetentionPeriod": 7,
  "CopyTagsToSnapshot": true,
  "PreferredMaintenanceWindow": "sun:05:00-sun:06:00",
  "EnablePerformanceInsights": true,
  "EnableIAMDatabaseAuthentication": true,
  "DeletionProtection": true,
  "EnableCloudwatchLogsExports": [
    "postgresql"
  ],
  "PointInTimeRecoveryEnabled": true
}
```

I also created a disaster recovery script for database restoration:

```bash
#!/bin/bash
# Database Disaster Recovery Script

# Parameters
DB_INSTANCE="oaktree-db-instance"
SNAPSHOT_ID="oaktree-snapshot-$(date +%Y%m%d%H%M)"
RECOVERY_TIME="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
REGION="ap-southeast-1"
RECOVERY_INSTANCE="oaktree-recovery-instance"

# Create manual snapshot
echo "Creating manual snapshot $SNAPSHOT_ID..."
aws rds create-db-snapshot \
  --db-instance-identifier $DB_INSTANCE \
  --db-snapshot-identifier $SNAPSHOT_ID \
  --region $REGION

# Wait for snapshot to complete
echo "Waiting for snapshot to complete..."
aws rds wait db-snapshot-completed \
  --db-snapshot-identifier $SNAPSHOT_ID \
  --region $REGION

# Restore from snapshot
echo "Restoring to point-in-time..."
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier $DB_INSTANCE \
  --target-db-instance-identifier $RECOVERY_INSTANCE \
  --restore-time $RECOVERY_TIME \
  --region $REGION

echo "Recovery process initiated. New instance: $RECOVERY_INSTANCE"
```

The RDS database backup process looks like this:

![RDS Backup Architecture](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/images/con-multi-AZ.png)

**Take a screenshot of this database backup configuration and architecture diagram for your documentation.**

### **Infrastructure Testing with CloudFormation Guard**

I implemented infrastructure testing using AWS CloudFormation Guard with the following rules:

```
# security_rules.guard

let security_group_rules = Resources.*[ Type == 'AWS::EC2::SecurityGroup' ]
rule security_groups_no_public_ingress {
  security_group_rules.Properties.SecurityGroupIngress[*] {
    CidrIp != '0.0.0.0/0' OR
    FromPort != 22
  }
}

let iam_roles = Resources.*[ Type == 'AWS::IAM::Role' ]
rule iam_roles_permissions_boundary {
  iam_roles.Properties {
    PermissionsBoundary exists
  }
}

let s3_buckets = Resources.*[ Type == 'AWS::S3::Bucket' ]
rule s3_buckets_encrypted {
  s3_buckets.Properties {
    BucketEncryption exists
  }
}

let rds_instances = Resources.*[ Type == 'AWS::RDS::DBInstance' ]
rule rds_instances_encrypted {
  rds_instances.Properties {
    StorageEncrypted == true
  }
}
```

I integrated this into the CI/CD pipeline with the following GitHub Actions step:

```yaml
- name: Run CloudFormation Guard
  run: |
    pip install cloudformation-guard
    cfn-guard validate -r security_rules.guard -d terraform/environments/dev/.terraform/terraform.json
```

The Infrastructure Testing process looks like this:

![Infrastructure Testing Workflow](https://d2908q01vomqb2.cloudfront.net/7719a1c782a1ba91c031a682a0a2f8658209adbf/2021/01/15/IaC-test.png)

**Take a screenshot of this infrastructure testing configuration and workflow diagram for your documentation.**

## **Important AWS Services Learning**

Today I learned about several additional AWS services that are crucial for deployment strategies and disaster recovery:

### **AWS CodeDeploy**

AWS CodeDeploy is a deployment service that automates application deployments to Amazon EC2 instances, on-premises instances, serverless Lambda functions, or Amazon ECS services. I learned how to implement blue/green deployments to minimize downtime.

Key features I implemented today:
- **Deployment Groups**: Logical grouping of target instances.
- **Deployment Configurations**: Rules for how deployments proceed.
- **Traffic Shifting**: Gradually shifting traffic from old to new version.
- **Rollback Triggers**: Automated rollbacks on failures.

[Learn more about AWS CodeDeploy](https://docs.aws.amazon.com/codedeploy/latest/userguide/welcome.html)

**Take a screenshot of this CodeDeploy documentation for your learning documentation.**

### **Amazon RDS Backup and Recovery**

Amazon RDS provides automated backups and point-in-time recovery for database instances. I learned how to configure and implement these features for robust database management.

Key features I implemented today:
- **Automated Backups**: Daily backups during specified window.
- **Retention Period**: Configurable retention for backups.
- **Point-in-Time Recovery**: Restore to any point within the retention period.
- **Snapshot Management**: Manual and automated snapshot handling.

[Learn more about Amazon RDS Backup and Recovery](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_CommonTasks.BackupRestore.html)

**Take a screenshot of this RDS Backup documentation for your learning documentation.**

### **AWS CloudFormation Guard**

AWS CloudFormation Guard is a policy-as-code evaluation tool that validates CloudFormation templates against policy rules. I learned how to implement infrastructure testing using this tool.

Key features I implemented today:
- **Rule Writing**: Creating policy rules for infrastructure validation.
- **Template Validation**: Checking templates against rules.
- **CI/CD Integration**: Running checks in the deployment pipeline.
- **Compliance Reporting**: Generating reports for audit purposes.

[Learn more about AWS CloudFormation Guard](https://docs.aws.amazon.com/cloudformation-cli/latest/userguide/what-is-cloudformation-guard.html)

**Take a screenshot of this CloudFormation Guard documentation for your learning documentation.**

### **AWS Disaster Recovery**

AWS provides multiple strategies for disaster recovery, from backup and restore to pilot light and multi-site solutions. I learned how to implement a comprehensive disaster recovery strategy.

Key concepts I implemented today:
- **Recovery Time Objective (RTO)**: Maximum acceptable time to restore service.
- **Recovery Point Objective (RPO)**: Maximum acceptable data loss.
- **Cross-Region Replication**: Duplicating resources across AWS regions.
- **Failover Automation**: Scripts and procedures for automated failover.

[Learn more about AWS Disaster Recovery](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html)

**Take a screenshot of this Disaster Recovery documentation for your learning documentation.**

## **Deployment Strategies Best Practices**

Today I implemented several best practices for deployment strategies:

### **Zero-Downtime Deployment**

- Implemented blue/green deployment to avoid service disruption
- Used gradual traffic shifting to minimize user impact
- Set up health checks for new deployment verification
- Configured automated rollback for failed deployments

### **Deployment Monitoring**

- Created deployment-specific CloudWatch dashboards
- Set up alarms for deployment health metrics
- Implemented enhanced logging during deployments
- Created deployment status notifications

### **Rollback Procedures**

- Documented manual rollback procedures
- Set up automated rollback triggers
- Tested rollback functionality
- Created rollback verification checks

[Learn more about AWS Deployment Best Practices](https://docs.aws.amazon.com/whitepapers/latest/introduction-devops-aws/deployment-and-testing.html)

**Take a screenshot of these deployment best practices for your documentation.**

## **Challenges & Solutions**

### **Blue/Green Deployment Testing:**

- **Challenge**: Setting up proper testing of the new environment before shifting production traffic.
  
- **Solution**: Implemented a test listener on the load balancer with a test traffic route, created a suite of integration tests to run against the green environment, and added validation hooks in CodeDeploy to verify the new environment before traffic shifting.

### **Database Recovery Time:**

- **Challenge**: Meeting the recovery time objective (RTO) for the database in disaster scenarios.
  
- **Solution**: Optimized the recovery process by using multi-AZ deployment for instant failover within a region, and implemented read replicas in the disaster recovery region that can be promoted to master quickly. Created and tested automated scripts to handle the promotion process.

## **Learning Insights**

Today I gained a deeper understanding of deployment strategies, particularly blue/green deployment with AWS CodeDeploy. The ability to shift traffic gradually and have automated rollbacks provides significant safety when deploying to production. I learned this from AWS's deployment best practices documentation and from a case study on "Zero-Downtime Deployments" presented in an AWS re:Invent session.

I also learned about the importance of database backup and recovery strategies. The trade-offs between recovery time (RTO) and recovery point (RPO) objectives are critical considerations when designing a disaster recovery plan. This knowledge came from AWS's database documentation and a webinar on "Disaster Recovery Planning for AWS Workloads."

Working with CloudFormation Guard taught me about policy-as-code and how to enforce infrastructure standards programmatically. This approach ensures that security and compliance requirements are consistently applied across all deployments. This information came from AWS's security blog and documentation on infrastructure validation.

## **Key Links for Screenshots**

Here are important links that you should visit and screenshot for your documentation:

1. [AWS CodeDeploy Blue/Green Deployments](https://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-configurations-create.html)
2. [Amazon RDS Backup and Restore](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html)
3. [AWS CloudFormation Guard](https://docs.aws.amazon.com/cfn-guard/latest/ug/what-is-guard.html)
4. [AWS Disaster Recovery Options](https://aws.amazon.com/blogs/architecture/disaster-recovery-dr-architecture-on-aws-part-i-strategies-for-recovery-in-the-cloud/)
5. [AWS Deployment Strategies](https://aws.amazon.com/builders-library/going-faster-with-continuous-delivery/)

**Take screenshots of these documentation pages for your learning documentation.**

## **Future Plans**

For tomorrow, I plan to:

1. Complete the project documentation
2. Create operational runbooks for the team
3. Implement final security audits and fixes
4. Prepare for project handover

## **Conclusion**

Day 6 of Week 4 was focused on implementing advanced deployment strategies and ensuring the reliability and recoverability of the application and its data. By setting up blue/green deployments with CodeDeploy and configuring automated database backups, I've built a robust system that can be updated with minimal risk and recovered quickly in case of failure.

I'm particularly pleased with the infrastructure testing implementation, which will help maintain security and compliance standards as the system evolves over time. The disaster recovery planning and implementation provide peace of mind that the system can recover from major incidents with minimal data loss.

Tomorrow, I'll focus on finalizing the project documentation and preparing for handover to the operations team.