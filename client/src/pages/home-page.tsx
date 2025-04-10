import React, { useState, useEffect } from "react";
import Sidebar from "@/components/ui/sidebar";
import { ProjectStatusOverview } from "@/components/ui/dashboard-cards";
import { PipelineDisplay } from "@/components/ui/pipeline-display";
import { AWSInfrastructure, ContainerizedApp, ProjectDocumentation } from "@/components/ui/project-details";
import { ContainerMetrics } from "@/components/ui/dashboard-cards";
import { DeploymentStatus } from "@/components/ui/deployment-status";
import { SystemStatus } from "@/components/ui/system-status";

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
        {/* Top Navigation Bar with Orange-Gray Gradient */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-gradient-to-r from-gray-800 via-gray-700 to-orange-600 shadow-lg">
          <button
            type="button"
            className="md:hidden px-4 text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
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
              <p className="text-white self-center font-bold text-lg">AWS DevOps Platform</p>
            </div>
            {/* Sign-in button removed - handled by sidebar user panel */}
            <div className="ml-4 flex items-center space-x-3 md:ml-6">
              {/* Admin indicator - uses localStorage to check login state */}
              {localStorage.getItem('currentUser') === 'msn_clx' && (
                <div className="text-sm text-white bg-orange-700 px-3 py-1 rounded-full">
                  Admin Access
                </div>
              )}
              <div className="text-sm text-white bg-gray-800 bg-opacity-50 px-3 py-1 rounded-full">
                Connected to AWS Region: {awsRegion}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-100">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-orange-600 rounded-lg shadow-lg px-6 py-4">
                <h1 className="text-2xl font-bold text-white">
                  AWS DevOps Dashboard
                </h1>
                <p className="mt-1 text-sm text-gray-200">
                  Cloud Infrastructure Management & Deployment Platform
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-800 text-white">
                    AWS DynamoDB
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-800 text-white">
                    Docker Container
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-800 text-white">
                    Terraform IaC
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-800 text-white">
                    CI/CD Pipeline
                  </span>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-4">
              {/* Deployment Status - Environment Info */}
              <div className="mb-6">
                <DeploymentStatus />
              </div>
              
              {/* System Status with Real-time Metrics */}
              <div className="mb-6">
                <SystemStatus />
              </div>

              {/* Project Status Overview */}
              <ProjectStatusOverview />

              {/* Full DevOps Pipeline Display */}
              <PipelineDisplay />

              {/* Project Components and Infrastructure */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* AWS Infrastructure */}
                <AWSInfrastructure />
                
                {/* AWS DynamoDB Data Storage */}
                <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 shadow-lg rounded-lg overflow-hidden border border-orange-500/20">
                  <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-gray-800 via-gray-700 to-orange-600 border-b border-gray-700">
                    <h3 className="text-lg leading-6 font-bold text-white">
                      AWS DynamoDB Integration
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-200">
                      Cloud Database Storage
                    </p>
                  </div>
                  <div className="p-6 text-white">
                    <div className="bg-gray-800 bg-opacity-50 p-4 rounded-md border border-gray-700">
                      <h4 className="text-sm font-medium text-orange-400 mb-2">
                        AWS Status Overview:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center p-3 bg-gray-800 rounded border border-gray-700">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-sm text-gray-300">Region: <span className="font-medium">{awsRegion}</span></span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-800 rounded border border-gray-700">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-sm text-gray-300">DynamoDB: <span className="font-medium">Active</span></span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-800 rounded border border-gray-700">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-sm text-gray-300">Data Storage: <span className="font-medium">Available</span></span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-800 rounded border border-gray-700">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-sm text-gray-300">SDK: <span className="font-medium">Connected</span></span>
                        </div>
                      </div>
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
