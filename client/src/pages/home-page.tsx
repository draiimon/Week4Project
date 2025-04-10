import React, { useState, useEffect } from "react";
import Sidebar from "@/components/ui/sidebar";
import { ProjectStatusOverview } from "@/components/ui/dashboard-cards";
import { PipelineDisplay } from "@/components/ui/pipeline-display";
import { AWSInfrastructure, ContainerizedApp, ProjectDocumentation } from "@/components/ui/project-details";
import { ContainerMetrics } from "@/components/ui/dashboard-cards";

export default function HomePage() {
  const [awsRegion, setAwsRegion] = useState<string>('ap-southeast-1');
  
  // Load real region data on page load
  useEffect(() => {
    fetch('/api/aws/status')
      .then(res => res.json())
      .then(data => {
        if (data.region) {
          setAwsRegion(data.region);
        }
      })
      .catch(err => {
        console.error("Error fetching AWS status:", err);
      });
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top Navigation Bar */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="md:hidden px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
          >
            <span className="sr-only">Open sidebar</span>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <p className="text-orange-600 self-center font-semibold">OakTree DevOps Platform</p>
            </div>
            {/* Sign-in button removed - handled by sidebar user panel */}
            <div className="ml-4 flex items-center md:ml-6">
              <div className="text-sm text-gray-600">
                Connected to AWS Region: {awsRegion}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">
                Week 4: AWS Integration Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                End-to-End AWS DevOps Pipeline Implementation
              </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-4">
              {/* Project Status Overview */}
              <ProjectStatusOverview />

              {/* Full DevOps Pipeline Display */}
              <PipelineDisplay />

              {/* Project Components and Infrastructure */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* AWS Infrastructure */}
                <AWSInfrastructure />

                {/* AWS DynamoDB Authentication Integration */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      AWS Authentication Integration
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      AWS DynamoDB User Management
                    </p>
                  </div>
                  <div className="p-6">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        AWS Configuration:
                      </h4>
                      <div className="bg-gray-50 p-3 rounded-md font-mono text-xs">
                        <pre className="whitespace-pre-wrap text-gray-700">
{`# AWS DynamoDB Configuration
REGION: ${awsRegion}
TABLE: OakTreeUsers
FEATURES: User Authentication, Data Storage
AWS_ACCESS_KEY_ID: [CREDENTIAL HIDDEN]
AWS_SECRET_ACCESS_KEY: [CREDENTIAL HIDDEN]`}
                        </pre>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="p-4 bg-green-50 text-green-800 rounded-md border border-green-200">
                        <div className="flex">
                          <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <p>User authentication system successfully integrated with AWS DynamoDB</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">
                        This integration provides:
                      </p>
                      <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                        <li>Secure user registration with AWS DynamoDB storage</li>
                        <li>Password encryption with crypto library</li>
                        <li>Real-time AWS authentication in ap-southeast-1 region</li>
                        <li>Actual metrics from your AWS account resources</li>
                      </ul>
                    </div>
                    

                  </div>
                </div>
              </div>

              {/* Application Details */}
              <ContainerizedApp />
              
              {/* Container Metrics */}
              <div className="mt-4">
                <ContainerMetrics />
              </div>

              {/* Final Project Documentation */}
              <ProjectDocumentation />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
