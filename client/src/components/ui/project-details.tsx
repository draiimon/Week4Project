import React from "react";

export const AWSInfrastructure: React.FC = () => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Cloud Infrastructure (AWS)
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Provisioned with Terraform
        </p>
      </div>
      <div className="p-6">
        <div className="flex flex-col space-y-4">
          {/* Resources List */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Provisioned Resources:
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
                <span className="text-gray-700">EC2 Instance (t2.micro)</span>
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
                <span className="text-gray-700">RDS Database (PostgreSQL)</span>
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
                <span className="text-gray-700">S3 Bucket (Static Assets)</span>
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
                <span className="text-gray-700">VPC & Security Groups</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="h-5 w-5 text-orange-500 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-gray-700">IAM Roles & Permissions</span>
              </li>
            </ul>
          </div>

          {/* Terraform Output */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Terraform Output:
            </h4>
            <div className="bg-gray-800 rounded-md p-3 font-mono overflow-auto max-h-40">
              <pre className="text-xs text-green-400">
{`$ terraform apply -auto-approve

Terraform will perform the following actions:
  + aws_instance.app_server
  + aws_db_instance.default
  + aws_s3_bucket.static_assets
  + aws_vpc.main
  + aws_security_group.allow_web

Apply complete! Resources: 5 added, 0 changed, 0 destroyed.

Outputs:
  ec2_public_ip = "54.203.xx.xx"
  rds_endpoint = "mydb.xxx.us-west-2.rds.amazonaws.com:3306"
  s3_bucket_name = "oaktree-static-assets-12345"`}
              </pre>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            View Infrastructure Map
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
              on Ubuntu 20.04 LTS
            </li>
            <li>
              <strong>Version Control:</strong> Complete Git workflow with
              feature branches, PRs, and code reviews
            </li>
            <li>
              <strong>Containerization:</strong> Application packaged using
              Docker with optimized multi-stage builds
            </li>
            <li>
              <strong>CI/CD Pipeline:</strong> Automated testing and deployment
              using GitHub Actions
            </li>
            <li>
              <strong>Infrastructure as Code:</strong> All AWS resources defined
              and provisioned with Terraform
            </li>
            <li>
              <strong>Cloud Deployment:</strong> Containerized application
              deployed to AWS with proper security
            </li>
            <li>
              <strong>User Management:</strong> Authentication system integrated
              with AWS RDS database
            </li>
          </ul>

          <h5 className="text-sm font-medium text-gray-900 mt-4">
            Project Architecture
          </h5>
          <p className="text-sm text-gray-700">
            The application follows a modern microservices architecture with:
          </p>

          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            <li>
              Front-end: React.js application served from S3 via CloudFront
            </li>
            <li>
              Back-end: Node.js API containerized and deployed on EC2
            </li>
            <li>
              Database: User data stored in AWS RDS PostgreSQL instance
            </li>
            <li>
              Authentication: JWT-based auth system with secure password storage
            </li>
            <li>
              Monitoring: CloudWatch integrated for application and
              infrastructure metrics
            </li>
          </ul>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:space-x-4">
          <button
            type="button"
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
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            View Full Documentation
          </button>
          <button
            type="button"
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
          </button>
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
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
              />
            </svg>
            Open Application
          </button>
        </div>
      </div>
    </div>
  );
};
