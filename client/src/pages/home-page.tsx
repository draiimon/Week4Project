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
              <p className="text-white self-center font-bold text-lg">DevOps Project Dashboard</p>
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
                  DevOps Final Project Dashboard
                </h1>
                <p className="mt-1 text-sm text-gray-200">
                  End-to-End Cloud Deployment Pipeline
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-800 text-white">
                    Code Repository
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
              {/* Main Week 4 Requirements Display */}
              <div className="mb-6 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 shadow-lg rounded-lg overflow-hidden border border-orange-500/20">
                <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-gray-800 via-gray-700 to-orange-600 border-b border-gray-700">
                  <h3 className="text-lg leading-6 font-bold text-white">
                    DevOps Project Requirements
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-200">
                    End-to-End Implementation Status
                  </p>
                </div>
                <div className="p-6 text-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 1. Code & Container */}
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                      <h4 className="text-orange-400 text-md font-semibold mb-2 flex items-center">
                        <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Code & Container
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span>Git Repository Setup</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span>Dockerfile Created</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span>Node.js Application Containerized</span>
                        </li>
                      </ul>
                    </div>
                    
                    {/* 2. CI Pipeline */}
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                      <h4 className="text-orange-400 text-md font-semibold mb-2 flex items-center">
                        <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        CI Pipeline
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span>GitHub Actions Workflow</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span>Automated Testing</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span>Docker Image Build & Push</span>
                        </li>
                      </ul>
                    </div>
                    
                    {/* 3. Infrastructure as Code */}
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                      <h4 className="text-orange-400 text-md font-semibold mb-2 flex items-center">
                        <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Infrastructure as Code
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span>Terraform Configuration</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span>AWS Resources Provisioned</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span>Networking & Security Setup</span>
                        </li>
                      </ul>
                    </div>
                    
                    {/* 4. Deployment */}
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                      <h4 className="text-orange-400 text-md font-semibold mb-2 flex items-center">
                        <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Deployment
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span>Container Deployed to AWS</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span>Service Accessible via Endpoint</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span>Deployment Documentation</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pipeline Display */}
              <PipelineDisplay />

              {/* Project Components - Simplified */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
                {/* AWS Infrastructure */}
                <AWSInfrastructure />
                
                {/* Containerized App */}
                <ContainerizedApp />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
