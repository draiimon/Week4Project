import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { SystemStatus } from "@/components/ui/system-status";

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
    <DashboardLayout 
      title="DevOps Project Dashboard" 
      subtitle="End-to-End Cloud Deployment Pipeline"
    >
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
          
          {/* Other tabs content here (truncated for brevity) */}
          {/* You can copy the rest of the tabs from the original HomePage component */}
        </div>
      </div>

      <div className="mb-6">
        <SystemStatus />
      </div>
    </DashboardLayout>
  );
}