# **Week 4: End-to-End DevOps Project - Day 5 (Wednesday, April 9, 2025)**

## **Introduction**

Today is the fifth day of my Week 4 project. After successfully implementing the container orchestration and load balancing yesterday, I focused on monitoring, logging, and security enhancements. These aspects are crucial for maintaining visibility into the application's health and ensuring proper security measures are in place for a production environment.

## **What I Did Today**

### **CloudWatch Monitoring Setup:**

- Created CloudWatch dashboards for application metrics
- Set up alarms for critical performance indicators
- Configured log groups for centralized logging
- Implemented custom metrics for business KPIs
- Set up anomaly detection for proactive alerting

### **Security Enhancements:**

- Implemented AWS WAF for web application firewall protection
- Set up AWS Shield for DDoS protection
- Enhanced IAM policies with least privilege access
- Implemented AWS Secrets Manager for credential management
- Added AWS Config for compliance monitoring

### **Cost Management:**

- Set up AWS Budgets for cost monitoring
- Implemented resource tagging strategy
- Created cost allocation reports
- Configured AWS Cost Explorer dashboards
- Documented cost optimization strategies

### **Application Refinements:**

- Enhanced error handling and logging
- Implemented structured logging format
- Added distributed tracing with AWS X-Ray
- Created operational runbooks for common scenarios
- Documented maintenance procedures

## **Screenshot-worthy Resources and Documentation**

### **CloudWatch Dashboard Configuration**

I created a comprehensive CloudWatch dashboard for monitoring the application:

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
          [ "AWS/ECS", "CPUUtilization", "ServiceName", "oaktree-service-dev", "ClusterName", "oaktree-cluster-dev", { "stat": "Average" } ]
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
          [ "AWS/ECS", "MemoryUtilization", "ServiceName", "oaktree-service-dev", "ClusterName", "oaktree-cluster-dev", { "stat": "Average" } ]
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
          [ "AWS/ApplicationELB", "RequestCount", "LoadBalancer", "oaktree-alb-dev" ]
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
          [ "AWS/ApplicationELB", "TargetResponseTime", "LoadBalancer", "oaktree-alb-dev", { "stat": "Average" } ]
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

The CloudWatch dashboard looks like this in AWS:

![AWS CloudWatch Dashboard](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/images/dashboard_view.png)

**Take a screenshot of this CloudWatch dashboard configuration for your documentation.**

### **AWS WAF Configuration**

I implemented AWS WAF to protect the application from common web exploits:

```json
{
  "Name": "oaktree-waf-web-acl",
  "Scope": "REGIONAL",
  "DefaultAction": {
    "Allow": {}
  },
  "VisibilityConfig": {
    "SampledRequestsEnabled": true,
    "CloudWatchMetricsEnabled": true,
    "MetricName": "oaktree-waf-web-acl-metrics"
  },
  "Rules": [
    {
      "Name": "SQLiRule",
      "Priority": 0,
      "Statement": {
        "ManagedRuleGroupStatement": {
          "VendorName": "AWS",
          "Name": "AWSManagedRulesSQLiRuleSet"
        }
      },
      "OverrideAction": {
        "None": {}
      },
      "VisibilityConfig": {
        "SampledRequestsEnabled": true,
        "CloudWatchMetricsEnabled": true,
        "MetricName": "SQLiRule"
      }
    },
    {
      "Name": "XSSRule",
      "Priority": 1,
      "Statement": {
        "ManagedRuleGroupStatement": {
          "VendorName": "AWS",
          "Name": "AWSManagedRulesCommonRuleSet",
          "ExcludedRules": []
        }
      },
      "OverrideAction": {
        "None": {}
      },
      "VisibilityConfig": {
        "SampledRequestsEnabled": true,
        "CloudWatchMetricsEnabled": true,
        "MetricName": "XSSRule"
      }
    },
    {
      "Name": "RateLimitRule",
      "Priority": 2,
      "Statement": {
        "RateBasedStatement": {
          "Limit": 2000,
          "AggregateKeyType": "IP"
        }
      },
      "Action": {
        "Block": {}
      },
      "VisibilityConfig": {
        "SampledRequestsEnabled": true,
        "CloudWatchMetricsEnabled": true,
        "MetricName": "RateLimitRule"
      }
    }
  ]
}
```

The AWS WAF console looks like this:

![AWS WAF Console](https://docs.aws.amazon.com/waf/latest/developerguide/images/web-acl-01.png)

**Take a screenshot of this AWS WAF configuration for your documentation.**

### **AWS Budgets Setup**

I set up AWS Budgets to monitor and control costs:

```json
{
  "BudgetName": "OakTree-Monthly-Budget",
  "BudgetLimit": {
    "Amount": "100",
    "Unit": "USD"
  },
  "PlannedBudgetLimits": {},
  "CostFilters": {},
  "CostTypes": {
    "IncludeTax": true,
    "IncludeSubscription": true,
    "UseBlended": false,
    "IncludeRefund": false,
    "IncludeCredit": false,
    "IncludeUpfront": true,
    "IncludeRecurring": true,
    "IncludeOtherSubscription": true,
    "IncludeSupport": true,
    "IncludeDiscount": true,
    "UseAmortized": false
  },
  "TimeUnit": "MONTHLY",
  "BudgetType": "COST",
  "NotificationsWithSubscribers": [
    {
      "Notification": {
        "NotificationType": "ACTUAL",
        "ComparisonOperator": "GREATER_THAN",
        "Threshold": 80.0
      },
      "Subscribers": [
        {
          "SubscriptionType": "EMAIL",
          "Address": "devops-team@example.com"
        }
      ]
    }
  ]
}
```

The AWS Budgets console looks like this:

![AWS Budgets Console](https://docs.aws.amazon.com/cost-management/latest/userguide/images/budget-create-name.png)

**Take a screenshot of this AWS Budgets configuration for your documentation.**

## **Important AWS Services Learning**

Today I learned about several additional AWS services that are crucial for monitoring, security, and cost management:

### **Amazon CloudWatch**

CloudWatch is AWS's monitoring and observability service that provides data and actionable insights for AWS resources and applications. I learned how to configure dashboards, alarms, and log groups to gain visibility into application performance.

Key features I implemented today:
- **Dashboards**: Custom visualizations of metrics for different AWS resources.
- **Alarms**: Notifications when metrics cross predefined thresholds.
- **Logs**: Centralized collection and analysis of log data.
- **Anomaly Detection**: Machine learning-based detection of unusual patterns.

[Learn more about Amazon CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html)

**Take a screenshot of this CloudWatch documentation for your learning documentation.**

### **AWS Web Application Firewall (WAF)**

AWS WAF is a web application firewall service that helps protect web applications from common web exploits. I learned how to configure rule sets to filter malicious traffic.

Key features I implemented today:
- **Managed Rules**: Pre-configured rules to protect against common threats.
- **Custom Rules**: Rules tailored to specific application needs.
- **Rate-based Rules**: Protection against DDoS attacks and brute force attempts.
- **IP Blocking**: Ability to block traffic from specific IP addresses or ranges.

[Learn more about AWS WAF](https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html)

**Take a screenshot of this WAF documentation for your learning documentation.**

### **AWS Budgets**

AWS Budgets is a service that helps track and control AWS costs by setting custom budgets and alerts. I learned how to configure budget thresholds and notifications.

Key features I implemented today:
- **Budget Creation**: Setting up monthly cost budgets.
- **Alert Configuration**: Notifications when costs exceed thresholds.
- **Usage Budgets**: Tracking specific service usage.
- **Cost Filters**: Focusing on specific resources or tags.

[Learn more about AWS Budgets](https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html)

**Take a screenshot of this Budgets documentation for your learning documentation.**

### **AWS X-Ray**

AWS X-Ray is a service that helps analyze and debug production applications, particularly distributed applications. I learned how to implement tracing to track requests through the application.

Key features I implemented today:
- **Service Map**: Visual representation of application components.
- **Trace Analysis**: Detailed view of request paths.
- **Performance Insights**: Identification of performance bottlenecks.
- **Error Tracking**: Pinpointing where errors occur in the request flow.

[Learn more about AWS X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html)

**Take a screenshot of this X-Ray documentation for your learning documentation.**

## **Security Best Practices Implemented**

Today I implemented several security best practices for AWS services:

### **Defense in Depth**

- Implemented multiple security controls at different layers
- Used security groups, NACL, and WAF for network security
- Added application-level input validation
- Configured IAM policies for access control

### **Least Privilege Access**

- Created specific IAM roles for each service
- Used IAM policy conditions to restrict access
- Implemented permission boundaries
- Regularly reviewed and updated permissions

### **Secrets Management**

- Used AWS Secrets Manager for sensitive values
- Implemented automatic rotation for credentials
- Encrypted sensitive data at rest and in transit
- Maintained audit logs for access to secrets

[Learn more about AWS Security Best Practices](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html)

**Take a screenshot of these security best practices for your documentation.**

## **Challenges & Solutions**

### **CloudWatch Log Volume Management:**

- **Challenge**: Setting up efficient log management to avoid excessive storage costs.
  
- **Solution**: Implemented log retention policies (30 days for most logs, 90 days for critical logs) and created metric filters to extract important information without storing all raw logs indefinitely.

### **WAF Rule Tuning:**

- **Challenge**: Finding the right balance between security and functionality with WAF rules.
  
- **Solution**: Started with AWS managed rule sets in count mode to assess impact, then gradually enabled blocking after analyzing false positives. Created custom rules for application-specific patterns.

## **Learning Insights**

Today I gained a much deeper understanding of AWS monitoring and security services. The integration between CloudWatch, X-Ray, and other AWS services creates a comprehensive observability solution. I learned this from the AWS Well-Architected Framework's Operational Excellence pillar and from AWS workshops on observability.

I also learned about the importance of structured logging and how it enhances log analysis capabilities. By implementing a consistent JSON logging format with correlation IDs, I can now trace requests across multiple services. This knowledge came from AWS's documentation on CloudWatch Logs Insights and from a webinar on "Effective Logging in Microservices Architectures."

Working with AWS WAF taught me about the OWASP Top 10 web application security risks and how to configure protection against them. I learned about the tradeoffs between different security controls and how to implement a defense-in-depth approach. This information came from AWS's Security Specialist learning path and the AWS WAF documentation.

## **Key Links for Screenshots**

Here are important links that you should visit and screenshot for your documentation:

1. [CloudWatch Dashboard Documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html)
2. [AWS WAF Protection Rules](https://docs.aws.amazon.com/waf/latest/developerguide/waf-rules.html)
3. [AWS Budgets User Guide](https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-create.html)
4. [AWS X-Ray Service Map](https://docs.aws.amazon.com/xray/latest/devguide/xray-console-servicemap.html)
5. [AWS Security Best Practices](https://aws.amazon.com/architecture/security-identity-compliance/)

**Take screenshots of these documentation pages for your learning documentation.**

## **Future Plans**

For tomorrow, I plan to:

1. Implement blue/green deployment strategy for zero-downtime updates
2. Add automated database backups and recovery procedures
3. Set up advanced CloudWatch alarms and notifications
4. Create runbooks for operational procedures

## **Conclusion**

Day 5 of Week 4 was focused on enhancing the monitoring, security, and cost management aspects of the OakTree DevOps project. By implementing CloudWatch dashboards, WAF protection, and cost monitoring, I've created a more robust and secure environment for the application.

I'm particularly pleased with the implementation of structured logging and distributed tracing, which will make troubleshooting and performance optimization much easier in the future. The security enhancements with WAF and IAM policies provide defense-in-depth protection for the application.

Tomorrow I'll focus on implementing more advanced deployment strategies and operational procedures to further enhance the reliability and maintainability of the application.