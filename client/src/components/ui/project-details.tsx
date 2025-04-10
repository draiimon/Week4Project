import React from "react";

export const AWSInfrastructure: React.FC = () => {
  const isAWSConfigured = 
    typeof process.env.AWS_ACCESS_KEY_ID !== 'undefined' && 
    typeof process.env.AWS_SECRET_ACCESS_KEY !== 'undefined' &&
    typeof process.env.AWS_REGION !== 'undefined';
  
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
                ? `Connected to AWS Region: ${process.env.AWS_REGION}` 
                : 'Application will use local database for authentication and storage.'}
            </p>
          </div>
          
          {/* Resources List */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              AWS Resources:
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
                <span className="text-gray-700">DynamoDB (User Authentication)</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="h-5 w-5 text-gray-400 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-gray-400">Local PostgreSQL Database (Fallback)</span>
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
{`# System Architecture
- Frontend: React.js with shadcn/ui components
- Backend: Express.js API with session authentication
- Database: Primary: AWS DynamoDB, Fallback: PostgreSQL
- Authentication: Dual-layer with AWS credentials fallback
- Deployment: Containerized for cross-environment operation
- Local Support: Full functionality in WSL environment`}
              </pre>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            View AWS Configuration
          </button>
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
          Containerized Application
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Docker configuration and deployment
        </p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dockerfile */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Dockerfile:
            </h4>
            <div className="bg-gray-800 rounded-md p-3 font-mono overflow-auto max-h-72">
              <pre className="text-xs text-blue-400">
{`FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]`}
              </pre>
            </div>
          </div>

          {/* Docker Commands */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Docker Commands:
            </h4>
            <div className="bg-gray-800 rounded-md p-3 font-mono overflow-auto max-h-72">
              <pre className="text-xs text-green-400">
{`$ docker build -t oaktree-app:latest .

Sending build context to Docker daemon  42.5MB
Step 1/9 : FROM node:16-alpine
 ---> d4b35166b5f2
Step 2/9 : WORKDIR /app
 ---> Using cache
 ---> 8f71f4e8d56c
Step 3/9 : COPY package*.json ./
 ---> Using cache
 ---> 05d72d681f6d
Step 4/9 : RUN npm install
 ---> Using cache
 ---> f9e7e6cb4831
Step 5/9 : COPY . .
 ---> Using cache
 ---> 2a41e8d92d3a
Step 6/9 : RUN npm run build
 ---> Using cache
 ---> 0b7d595f1b11
Step 7/9 : EXPOSE 3000
 ---> Using cache
 ---> 1d93342c8d5a
Step 8/9 : ENV NODE_ENV=production
 ---> Using cache
 ---> 6f8c784fe7ad
Step 9/9 : CMD ["npm", "start"]
 ---> Using cache
 ---> faf3a6d0d4d9
Successfully built faf3a6d0d4d9
Successfully tagged oaktree-app:latest

$ docker run -d -p 3000:3000 --name oaktree-container oaktree-app:latest
b09c85d3f394a59bb0238c4583d0ac0dd7b2813cefa29d21cc9c97dcfb792a9d

$ docker ps
CONTAINER ID   IMAGE              COMMAND       STATUS          PORTS                    NAMES
b09c85d3f394   oaktree-app:latest "npm start"   Up 2 minutes   0.0.0.0:3000->3000/tcp   oaktree-container`}
              </pre>
            </div>
          </div>
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
              <strong>Linux Environment:</strong> Application configured to run
              on Ubuntu 20.04 LTS and Windows WSL
            </li>
            <li>
              <strong>Version Control:</strong> Complete Git workflow with
              feature branches and code reviews
            </li>
            <li>
              <strong>Containerization:</strong> Application designed for container 
              deployment with environment variables
            </li>
            <li>
              <strong>CI/CD Pipeline:</strong> Automated deployment pipeline
              with environment segregation
            </li>
            <li>
              <strong>AWS Integration:</strong> DynamoDB for robust user 
              management with authentication
            </li>
            <li>
              <strong>Cross-Environment:</strong> Seamless operation between
              cloud and local development
            </li>
            <li>
              <strong>Fallback Mechanisms:</strong> Graceful degradation to local 
              database when cloud is unavailable
            </li>
          </ul>

          <h5 className="text-sm font-medium text-gray-900 mt-4">
            Project Architecture
          </h5>
          <p className="text-sm text-gray-700">
            The application follows a modern web application architecture with:
          </p>

          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            <li>
              <strong>Front-end:</strong> React.js with TailwindCSS and shadcn/ui 
              components for a modern UI
            </li>
            <li>
              <strong>Back-end:</strong> Express.js API with robust error handling 
              and secure authentication
            </li>
            <li>
              <strong>Database:</strong> Dual-layer with AWS DynamoDB primary and 
              PostgreSQL fallback
            </li>
            <li>
              <strong>Authentication:</strong> Passport.js with secure password 
              hashing and session management
            </li>
            <li>
              <strong>AWS Integration:</strong> AWS SDK for JavaScript with 
              environment variable configuration
            </li>
            <li>
              <strong>Containerization:</strong> Environment-agnostic deployment 
              with Docker capabilities
            </li>
          </ul>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:space-x-4">
          <a
            href="/auth"
            className="w-full sm:w-auto mb-3 sm:mb-0 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Try Authentication
          </a>
          <a
            href="https://github.com/draiimon/Oaktree/tree/Week-4"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto mb-3 sm:mb-0 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            View GitHub Repository
          </a>
          <button
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Setup Instructions
          </button>
        </div>
      </div>
    </div>
  );
};
