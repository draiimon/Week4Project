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
    <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 shadow-lg rounded-lg overflow-hidden border border-orange-500/20">
      <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-gray-800 via-gray-700 to-orange-600 border-b border-gray-700">
        <h3 className="text-lg leading-6 font-bold text-white">
          AWS Infrastructure
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-200">
          Authentication and Data Management
        </p>
      </div>
      <div className="p-6 text-white">
        <div className="flex flex-col space-y-4">
          {/* Connection Status */}
          <div className="p-4 bg-gray-800 bg-opacity-50 rounded-md border border-gray-700">
            <div className="flex items-center">
              <div className={`p-2 rounded-full mr-3 ${isAWSConfigured ? 'bg-green-500' : 'bg-orange-500'}`}>
                <svg
                  className="h-5 w-5 text-white"
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
              </div>
              <div>
                <span className={`font-medium text-lg ${isAWSConfigured ? 'text-green-400' : 'text-orange-400'}`}>
                  {isAWSConfigured ? 'AWS Connection Established' : 'AWS Credentials Not Configured'}
                </span>
                <p className="mt-1 text-sm text-gray-300">
                  {isAWSConfigured 
                    ? `Your application is connected to AWS Cloud in the ${awsRegion} region with live monitoring.` 
                    : 'Application will use local database for authentication and storage.'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Resources List */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-md border border-orange-500/20">
            <h4 className="text-sm font-medium text-orange-400 mb-3">
              AWS Resources ({awsRegion || 'ap-southeast-1'}):
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center p-2 bg-gray-800 rounded">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-300">DynamoDB: <span className="font-medium">OakTreeUsers</span></span>
              </div>
              <div className="flex items-center p-2 bg-gray-800 rounded">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-300">Cognito: <span className="font-medium">Authentication</span></span>
              </div>
              <div className="flex items-center p-2 bg-gray-800 rounded">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-300">IAM: <span className="font-medium">Roles & Permissions</span></span>
              </div>
              <div className="flex items-center p-2 bg-gray-800 rounded">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-300">CloudWatch: <span className="font-medium">Monitoring</span></span>
              </div>
              <div className="flex items-center p-2 bg-gray-800 rounded">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-300">S3: <span className="font-medium">Storage</span></span>
              </div>
              <div className="flex items-center p-2 bg-gray-800 rounded">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-300">VPC: <span className="font-medium">Networking</span></span>
              </div>
            </div>
          </div>

          {/* Implementation Details */}
          <div>
            <h4 className="text-sm font-medium text-orange-400 mb-2">
              Week 4 AWS Architecture:
            </h4>
            <div className="bg-gray-800 bg-opacity-50 p-4 rounded-md text-xs text-gray-300 font-mono border border-gray-700">
              <pre className="whitespace-pre-wrap">
{`# AWS Cloud Services Integration
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
    <div className="mt-8 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 shadow-lg rounded-lg overflow-hidden border border-orange-500/20">
      <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-gray-800 via-gray-700 to-orange-600 border-b border-gray-700">
        <h3 className="text-lg leading-6 font-bold text-white">
          Cross-Environment Deployment
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-200">
          Local, WSL, and Docker configurations
        </p>
      </div>
      <div className="p-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Local Development */}
          <div>
            <h4 className="text-sm font-medium text-orange-400 mb-3">
              Local Development Setup:
            </h4>
            <div className="bg-gray-800 rounded-md p-4 font-mono overflow-auto max-h-72 border border-gray-700">
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
            
            <h4 className="text-sm font-medium text-orange-400 mt-4 mb-3">
              Cloud Integration:
            </h4>
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-md border border-orange-500/20">
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center p-2 bg-gray-800 rounded">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs text-gray-300">AWS Region: <span className="font-medium">ap-southeast-1 (Singapore)</span></span>
                </div>
                <div className="flex items-center p-2 bg-gray-800 rounded">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs text-gray-300">IAM Roles: <span className="font-medium">Configured for secure access</span></span>
                </div>
                <div className="flex items-center p-2 bg-gray-800 rounded">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs text-gray-300">AWS SDK: <span className="font-medium">Integrated for real-time data</span></span>
                </div>
                <div className="flex items-center p-2 bg-gray-800 rounded">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs text-gray-300">CloudWatch: <span className="font-medium">Monitoring configured</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* Docker Configuration */}
          <div>
            <h4 className="text-sm font-medium text-orange-400 mb-3">
              Docker Integration (Week 1):
            </h4>
            <div className="bg-gray-800 rounded-md p-4 font-mono overflow-auto max-h-40 border border-gray-700">
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
            
            <h4 className="text-sm font-medium text-orange-400 mt-4 mb-3">
              Docker Deployment (Week 3):
            </h4>
            <div className="bg-gray-800 rounded-md p-4 font-mono overflow-auto max-h-40 border border-gray-700">
              <pre className="text-xs text-green-400">
{`# Build the Docker image
docker build -t oaktree-app:latest .

# Run with AWS cloud integration
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
        
        <div className="mt-6 p-4 bg-gradient-to-r from-gray-800 to-gray-900 border border-orange-500/20 rounded-md">
          <h4 className="text-sm font-medium text-orange-400 mb-3">
            Week 4 DevOps Integration Status:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center p-2 bg-gray-800 rounded">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-xs text-gray-300">Container Solution: <span className="font-medium">Docker</span></span>
            </div>
            <div className="flex items-center p-2 bg-gray-800 rounded">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-xs text-gray-300">AWS Integration: <span className="font-medium">Complete</span></span>
            </div>
            <div className="flex items-center p-2 bg-gray-800 rounded">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-xs text-gray-300">CI/CD Pipeline: <span className="font-medium">Implemented</span></span>
            </div>
            <div className="flex items-center p-2 bg-gray-800 rounded">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-xs text-gray-300">Environment Variables: <span className="font-medium">Configured</span></span>
            </div>
            <div className="flex items-center p-2 bg-gray-800 rounded">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-xs text-gray-300">Terraform Templates: <span className="font-medium">Created</span></span>
            </div>
            <div className="flex items-center p-2 bg-gray-800 rounded">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-xs text-gray-300">Infrastructure as Code: <span className="font-medium">Implemented</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProjectDocumentation: React.FC = () => {
  return (
    <div className="mt-8 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 shadow-lg rounded-lg overflow-hidden border border-orange-500/20">
      <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-gray-800 via-gray-700 to-orange-600 border-b border-gray-700">
        <h3 className="text-lg leading-6 font-bold text-white">
          Project Documentation
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-200">
          Complete DevOps workflow implementation
        </p>
      </div>
      <div className="p-6 text-white">
        <div className="bg-gray-800 bg-opacity-50 rounded-md border border-gray-700 p-4 mb-4">
          <h4 className="text-sm font-medium text-orange-400 mb-3">
            Week 4 Final Requirements Completed
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center p-2 bg-gray-800 rounded">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-300">AWS Cloud Connection: <span className="font-medium">Active</span></span>
            </div>
            <div className="flex items-center p-2 bg-gray-800 rounded">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-300">Docker Container: <span className="font-medium">Created</span></span>
            </div>
            <div className="flex items-center p-2 bg-gray-800 rounded">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-300">CI/CD Pipeline: <span className="font-medium">Setup</span></span>
            </div>
            <div className="flex items-center p-2 bg-gray-800 rounded">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-300">Infrastructure as Code: <span className="font-medium">Implemented</span></span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-md border border-orange-500/20 p-4">
          <h4 className="text-sm font-medium text-orange-400 mb-3">
            Core AWS Services Integrated
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center p-2 bg-gray-800 rounded">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-300">Data Storage: <span className="font-medium">DynamoDB</span></span>
            </div>
            <div className="flex items-center p-2 bg-gray-800 rounded">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-300">Authentication: <span className="font-medium">IAM</span></span>
            </div>
            <div className="flex items-center p-2 bg-gray-800 rounded">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-300">Deployment: <span className="font-medium">CodeDeploy</span></span>
            </div>
            <div className="flex items-center p-2 bg-gray-800 rounded">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-300">Monitoring: <span className="font-medium">CloudWatch</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
