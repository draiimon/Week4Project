import React, { useState, useEffect } from "react";
import Sidebar from "@/components/ui/sidebar";
import { PipelineDisplay } from "@/components/ui/pipeline-display";
import { SystemStatus } from "@/components/ui/system-status";
import { AdminPanel } from "@/components/ui/admin-panel";

export default function HomePage() {
  const [awsRegion, setAwsRegion] = useState<string>('ap-southeast-1');
  const [activeTab, setActiveTab] = useState<number>(0);
  
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

  // Track if user is hovering over the tabs content
  const [isHovering, setIsHovering] = useState<boolean>(false);
  
  // Start the automatic tab rotation, but pause it when hovering
  useEffect(() => {
    if (isHovering) {
      return; // Don't set interval if hovering
    }
    
    const interval = setInterval(() => {
      setActiveTab((prevTab) => (prevTab + 1) % 4);
    }, 8000); // Change tab every 8 seconds
    
    return () => clearInterval(interval);
  }, [isHovering]); // Re-run effect when hover state changes

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
              {/* Main Requirements Display - Single Container */}
              <div className="mb-6 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 shadow-lg rounded-lg overflow-hidden border border-orange-500/20">
                <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-gray-800 via-gray-700 to-orange-600 border-b border-gray-700">
                  <h3 className="text-lg leading-6 font-bold text-white">
                    DevOps Project Requirements
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-200">
                    End-to-End Implementation Status
                  </p>
                </div>
                
                {/* Single Improved Container Design */}
                <div className="p-6 text-white"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}>
                  {/* Tab content using useState */}
                  <div className="flex space-x-2 border-b border-gray-700 mb-4 flex-wrap">
                    <button
                      onClick={() => setActiveTab(0)}
                      className={`py-2 px-4 text-sm font-medium rounded-t-lg ${
                        activeTab === 0 
                          ? "bg-gray-800 text-orange-400 border-orange-400 border-b-2" 
                          : "text-gray-300 hover:text-white"
                      }`}
                    >
                      AWS Infrastructure
                    </button>
                    <button
                      onClick={() => setActiveTab(1)}
                      className={`py-2 px-4 text-sm font-medium rounded-t-lg ${
                        activeTab === 1 
                          ? "bg-gray-800 text-orange-400 border-orange-400 border-b-2" 
                          : "text-gray-300 hover:text-white"
                      }`}
                    >
                      Authentication & Data
                    </button>
                    <button
                      onClick={() => setActiveTab(2)}
                      className={`py-2 px-4 text-sm font-medium rounded-t-lg ${
                        activeTab === 2 
                          ? "bg-gray-800 text-orange-400 border-orange-400 border-b-2" 
                          : "text-gray-300 hover:text-white"
                      }`}
                    >
                      Cross-Environment
                    </button>
                    <button
                      onClick={() => setActiveTab(3)}
                      className={`py-2 px-4 text-sm font-medium rounded-t-lg ${
                        activeTab === 3 
                          ? "bg-gray-800 text-orange-400 border-orange-400 border-b-2" 
                          : "text-gray-300 hover:text-white"
                      }`}
                    >
                      Docker & WSL
                    </button>
                  </div>
                  
                  {/* CSS animations sa loob na ng code */}
                  
                  {/* First Tab: AWS Infrastructure */}
                  <div className={`${activeTab === 0 ? "block tab-content tab-content-active" : "hidden"}`}>
                    <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 shadow-lg transform transition-all duration-500">
                      <h4 className="text-orange-400 text-lg font-semibold mb-3 flex items-center">
                        <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        AWS Infrastructure
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-white text-sm font-medium mb-2">Connection</h5>
                          <p className="text-gray-300 text-sm mb-2">Connected to AWS Cloud in the <span className="text-orange-300 font-medium">{awsRegion}</span> region with live monitoring.</p>
                          
                          <h5 className="text-white text-sm font-medium mt-4 mb-2">AWS Resources</h5>
                          <ul className="space-y-1 text-sm text-gray-300">
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>DynamoDB: <span className="text-orange-300">OakTreeUsers</span></span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>IAM: Roles & Permissions</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>CloudWatch: Monitoring</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>VPC: Networking</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="text-white text-sm font-medium mb-2">AWS Architecture</h5>
                          <ul className="space-y-1 text-sm text-gray-300">
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>Database: AWS DynamoDB</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>Identity: AWS IAM Roles</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>Monitoring: AWS CloudWatch</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>Storage: AWS S3</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>Networking: AWS VPC</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Second Tab: Authentication and Data Management */}
                  <div className={`${activeTab === 1 ? "block tab-content tab-content-active" : "hidden"}`}>
                    <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 shadow-lg transform transition-all duration-500">
                      <h4 className="text-orange-400 text-lg font-semibold mb-3 flex items-center">
                        <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Authentication & Data Management
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-white text-sm font-medium mb-2">Authentication</h5>
                          <ul className="space-y-1 text-sm text-gray-300">
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>IAM Role-based Authentication</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>Secure Access Keys</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>SDK Integration</span>
                            </li>
                          </ul>
                          
                          <h5 className="text-white text-sm font-medium mt-4 mb-2">Security</h5>
                          <ul className="space-y-1 text-sm text-gray-300">
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>Encrypted Connections</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>Access Policies Defined</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>Secure Environment Variables</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="text-white text-sm font-medium mb-2">Data Management</h5>
                          <ul className="space-y-1 text-sm text-gray-300">
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>DynamoDB Table: <span className="text-orange-300">OakTreeUsers</span></span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>User Data Schema Implemented</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>CRUD Operations Available</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>API Endpoints Created</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>Data Validation Rules</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Third Tab: Cross-Environment Deployment */}
                  <div className={`${activeTab === 2 ? "block tab-content tab-content-active" : "hidden"}`}>
                    <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 shadow-lg transform transition-all duration-500">
                      <h4 className="text-orange-400 text-lg font-semibold mb-3 flex items-center">
                        <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Cross-Environment Deployment
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-white text-sm font-medium mb-2">CI/CD Pipeline</h5>
                          <ul className="space-y-1 text-sm text-gray-300">
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>GitHub Actions Workflow</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>Automated Testing</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>Docker Image Build & Push</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>Continuous Deployment</span>
                            </li>
                          </ul>
                          
                          <h5 className="text-white text-sm font-medium mt-4 mb-2">Environmental Variables</h5>
                          <ul className="space-y-1 text-sm text-gray-300">
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>AWS Credentials</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>Database Connection</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>Region Configuration</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="text-white text-sm font-medium mb-2">Deployment Environments</h5>
                          <ul className="space-y-1 text-sm text-gray-300">
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>Local Development</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>WSL (Windows Subsystem for Linux)</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>Docker Container</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>AWS Cloud Production</span>
                            </li>
                          </ul>
                          
                          <h5 className="text-white text-sm font-medium mt-4 mb-2">Docker Configuration</h5>
                          <ul className="space-y-1 text-sm text-gray-300">
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>Dockerfile Created</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>Container Registry Push</span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>Multi-Environment Support</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Fourth Tab: Docker & WSL Configuration */}
                  <div className={`${activeTab === 3 ? "block tab-content tab-content-active" : "hidden"}`}>
                    <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 shadow-lg transform transition-all duration-500">
                      <h4 className="text-orange-400 text-lg font-semibold mb-3 flex items-center">
                        <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Local, WSL & Docker Configurations
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-white text-sm font-medium mb-2">Local Development</h5>
                          <div className="bg-gray-900 bg-opacity-50 p-3 rounded text-xs font-mono text-gray-300 mb-3">
                            <div># Clone repository</div>
                            <div>git clone https://github.com/draiimon/Oaktree.git</div>
                            <div>cd Oaktree</div>
                            <div className="mt-2"># Install dependencies</div>
                            <div>npm install</div>
                            <div className="mt-2"># Run the application</div>
                            <div>npm run dev</div>
                          </div>
                          
                          <h5 className="text-white text-sm font-medium mb-2">Environment Variables</h5>
                          <div className="bg-gray-900 bg-opacity-50 p-3 rounded text-xs font-mono text-gray-300">
                            <div>DATABASE_URL=postgresql://...</div>
                            <div>AWS_ACCESS_KEY_ID=*******</div>
                            <div>AWS_SECRET_ACCESS_KEY=******</div>
                            <div>AWS_REGION={awsRegion}</div>
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="text-white text-sm font-medium mb-2">Docker Deployment</h5>
                          <div className="bg-gray-900 bg-opacity-50 p-3 rounded text-xs font-mono text-gray-300 mb-3">
                            <div># Build Docker image</div>
                            <div>docker build -t oaktree-app:latest .</div>
                            <div className="mt-2"># Run with AWS integration</div>
                            <div>docker run -d \</div>
                            <div>  -p 5000:5000 \</div>
                            <div>  -e AWS_ACCESS_KEY_ID=*** \</div>
                            <div>  -e AWS_SECRET_ACCESS_KEY=*** \</div>
                            <div>  -e AWS_REGION={awsRegion} \</div>
                            <div>  oaktree-app:latest</div>
                          </div>
                          
                          <h5 className="text-white text-sm font-medium mb-2">Integration Status</h5>
                          <ul className="space-y-1 text-sm text-gray-300">
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>Docker Container: <span className="text-green-300">Ready</span></span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>AWS Integration: <span className="text-green-300">Complete</span></span>
                            </li>
                            <li className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span>CI/CD Pipeline: <span className="text-green-300">Active</span></span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* System Metrics and Status */}
              <div className="mb-6">
                <SystemStatus />
              </div>
              
              {/* No footer needed here anymore as we have global footer */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}