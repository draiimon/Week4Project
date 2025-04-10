import React from "react";

export const AWSInfrastructure: React.FC = () => {
  // In the frontend we can't access process.env directly, we'll use API status instead
  const [isAWSConfigured, setIsAWSConfigured] = React.useState(true);
  const [awsRegion, setAwsRegion] = React.useState('');
  
  React.useEffect(() => {
    // Fetch AWS connection status from the API
    fetch('/api/aws/status')
      .then(res => res.json())
      .then(data => {
        setIsAWSConfigured(data.status === 'connected');
        setAwsRegion(data.region || '');
      })
      .catch(() => {
        setIsAWSConfigured(false);
      });
  }, []);
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          AWS Infrastructure
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Authentication and Data Management
        </p>
      </div>
      <div className="p-6">
        <div className="flex flex-col space-y-4">
          {/* Connection Status */}
          <div className={`p-3 rounded-md ${isAWSConfigured ? 'bg-green-50' : 'bg-yellow-50'}`}>
            <div className="flex items-center">
              <svg
                className={`h-5 w-5 mr-2 ${isAWSConfigured ? 'text-green-500' : 'text-yellow-500'}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isAWSConfigured ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                )}
              </svg>
              <span className={`font-medium ${isAWSConfigured ? 'text-green-800' : 'text-yellow-800'}`}>
                {isAWSConfigured ? 'AWS Connection Established' : 'AWS Credentials Not Configured'}
              </span>
            </div>
            <p className={`mt-1 text-sm ${isAWSConfigured ? 'text-green-700' : 'text-yellow-700'}`}>
              {isAWSConfigured 
                ? `Connected to AWS Region: ${awsRegion}` 
                : 'Application will use local database for authentication and storage.'}
            </p>
          </div>
          
          {/* Resources List */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              AWS Resources ({awsRegion || 'ap-southeast-1'}):
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <svg
                  className="h-5 w-5 text-green-500 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700">DynamoDB Table: OakTreeUsers</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="h-5 w-5 text-green-500 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700">AWS Cognito (User Authentication)</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="h-5 w-5 text-green-500 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700">IAM Roles & Permissions</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="h-5 w-5 text-green-500 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700">AWS SDK Integration</span>
              </li>
            </ul>
          </div>

          {/* Implementation Details */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Implementation Details:
            </h4>
            <div className="bg-gray-50 p-3 rounded-md text-xs text-gray-700 font-mono">
              <pre className="whitespace-pre-wrap">
{`# AWS Architecture
- Authentication: AWS Cognito User Pools
- Database: AWS DynamoDB for user data storage
- Identity: AWS IAM Roles and Policies
- Deployment: AWS CodeDeploy with CI/CD pipeline
- Monitoring: AWS CloudWatch for metrics and logs
- Storage: AWS S3 for static assets and configuration
- Networking: AWS VPC for secure environment isolation`}
              </pre>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export const ContainerizedApp: React.FC = () => {
  return (
    <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Cross-Environment Deployment
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Local, WSL, and Docker configurations
        </p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Local Development */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Local Development Setup:
            </h4>
            <div className="bg-gray-800 rounded-md p-3 font-mono overflow-auto max-h-72">
              <pre className="text-xs text-blue-400">
{`# Clone repository
git clone https://github.com/draiimon/Oaktree.git
cd Oaktree

# Install dependencies
npm install

# Configure environment variables
# Create .env file with:
DATABASE_URL=postgresql://[user]:[password]@localhost:5432/oaktree
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region

# Run the application
npm run dev

# Application will be available at:
# http://localhost:5000`}
              </pre>
            </div>
            
            <h4 className="text-sm font-medium text-gray-900 mt-4 mb-2">
              AWS Configuration:
            </h4>
            <div className="bg-gray-50 p-3 rounded-md">
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                <li>AWS DynamoDB configured for user authentication</li>
                <li>AWS Region: ap-southeast-1 (Singapore)</li>
                <li>AWS IAM roles properly configured for secure access</li>
                <li>AWS SDK integration for real-time data access</li>
                <li>AWS CloudWatch for application monitoring</li>
              </ul>
            </div>
          </div>

          {/* Docker Configuration */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Dockerfile:
            </h4>
            <div className="bg-gray-800 rounded-md p-3 font-mono overflow-auto max-h-40">
              <pre className="text-xs text-green-400">
{`FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Build the application
RUN npm run build

EXPOSE 5000

# Allow environment variables to be passed
ENV NODE_ENV=production
ENV DATABASE_URL=
ENV AWS_ACCESS_KEY_ID=
ENV AWS_SECRET_ACCESS_KEY=
ENV AWS_REGION=

CMD ["npm", "start"]`}
              </pre>
            </div>
            
            <h4 className="text-sm font-medium text-gray-900 mt-4 mb-2">
              Docker Deployment Commands:
            </h4>
            <div className="bg-gray-800 rounded-md p-3 font-mono overflow-auto max-h-40">
              <pre className="text-xs text-green-400">
{`# Build the Docker image
docker build -t oaktree-app:latest .

# Run with environment variables
docker run -d \\
  -p 5000:5000 \\
  -e DATABASE_URL=postgresql://[user]:[password]@host.docker.internal:5432/oaktree \\
  -e AWS_ACCESS_KEY_ID=your_access_key \\
  -e AWS_SECRET_ACCESS_KEY=your_secret_key \\
  -e AWS_REGION=your_region \\
  --name oaktree-container \\
  oaktree-app:latest

# For local development without AWS, omit AWS variables:
docker run -d \\
  -p 5000:5000 \\
  -e DATABASE_URL=postgresql://[user]:[password]@host.docker.internal:5432/oaktree \\
  --name oaktree-container \\
  oaktree-app:latest`}
              </pre>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            Important Notes for AWS DynamoDB Integration:
          </h4>
          <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
            <li>Application is fully integrated with AWS DynamoDB in ap-southeast-1 region</li>
            <li>DynamoDB table "OakTreeUsers" provides real-time authentication</li>
            <li>AWS IAM roles are properly configured for secure database access</li>
            <li>All data is retrieved in real-time from your AWS account</li>
            <li>Application displays actual AWS metrics including storage and API usage</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export const ProjectDocumentation: React.FC = () => {
  return (
    <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Project Documentation
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Complete DevOps workflow implementation
        </p>
      </div>
      <div className="p-6">
        <div className="prose max-w-none">
          <h4 className="text-base font-medium text-gray-900">
            OakTree DevOps Project - Week 4 Final Submission
          </h4>
          <p className="text-sm text-gray-700">
            This project demonstrates a complete end-to-end DevOps workflow
            incorporating all components from Weeks 1-3:
          </p>

          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            <li>
              <strong>AWS DynamoDB:</strong> NoSQL database for secure user
              authentication and data storage
            </li>
            <li>
              <strong>AWS IAM:</strong> Identity and Access Management for
              secure access control to AWS resources
            </li>
            <li>
              <strong>AWS SDK for JavaScript:</strong> Comprehensive toolkit for
              interacting with AWS services
            </li>
            <li>
              <strong>AWS CodeCommit:</strong> Git repository service with
              fully managed source control
            </li>
            <li>
              <strong>AWS CodeBuild:</strong> Continuous integration service
              for compiling and testing code
            </li>
            <li>
              <strong>AWS CodeDeploy:</strong> Automated deployment service to
              EC2 instances and other compute platforms
            </li>
            <li>
              <strong>AWS CloudWatch:</strong> Monitoring and observability
              service for metrics and logs
            </li>
          </ul>

          <h5 className="text-sm font-medium text-gray-900 mt-4">
            AWS Architecture Integration
          </h5>
          <p className="text-sm text-gray-700">
            The application leverages multiple AWS services:
          </p>

          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            <li>
              <strong>Authentication Flow:</strong> DynamoDB for secure user 
              credential storage and verification
            </li>
            <li>
              <strong>Data Storage:</strong> DynamoDB Tables with appropriate
              access patterns and indexing
            </li>
            <li>
              <strong>Security:</strong> AWS IAM with fine-grained access control
              and least privilege principles
            </li>
            <li>
              <strong>Deployment:</strong> AWS CodePipeline to orchestrate the
              entire CI/CD workflow
            </li>
            <li>
              <strong>Client Integration:</strong> AWS SDK for JavaScript with
              proper credential management
            </li>
            <li>
              <strong>Environment Management:</strong> Cross-region deployment
              with consistent configuration
            </li>
          </ul>
        </div>


      </div>
    </div>
  );
};
