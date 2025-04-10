import React, { useState, useEffect } from 'react';
import { Separator } from "@/components/ui/separator";
import { getQueryFn } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

// Type definitions
interface AWSStatusResponse {
  status: 'connected' | 'not_connected';
}

interface TerraformStatusResponse {
  status: string;
  provider: string;
  region: string;
}

export const Footer: React.FC = () => {
  // Fetch AWS connection status
  const { data: awsStatus, isLoading: awsLoading } = useQuery({
    queryKey: ['/api/aws/status'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  
  // Fetch Terraform status
  const { data: terraformStatus, isLoading: terraformLoading } = useQuery({
    queryKey: ['/api/terraform/status'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const isAwsConnected = awsStatus?.status === 'connected';
  const isTerraformApplied = terraformStatus?.status === 'applied';

  return (
    <footer className="w-full py-4 mt-auto bg-gradient-to-r from-orange-100 to-white border-t border-orange-300/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-3">
          <div className="flex items-center space-x-2 mb-2 md:mb-0">
            <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-orange-600 p-1 rounded-md shadow-sm">
              <svg
                className="h-5 w-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L3 7L12 12L21 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 17L12 22L21 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 12L12 17L21 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="font-medium text-gray-800">AWS DevOps Platform</span>
          </div>
          
          <div className="flex items-center justify-center mb-2 md:mb-0">
            <span className="text-xs text-gray-500">
              © {new Date().getFullYear()} Oak Tree Solutions. All rights reserved.
            </span>
          </div>
          
          <div className="flex space-x-4">
            <a href="/dynamodb" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">
              DynamoDB
            </a>
            <a href="/regions" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">
              Regions
            </a>
            <a href="/user-services" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">
              Services
            </a>
          </div>
        </div>

        {/* Connection Status Indicators */}
        <div className="flex flex-wrap justify-center gap-4 items-center text-xs">
          <div className="flex items-center">
            <div className={`w-2 h-2 ${isAwsConnected ? 'bg-green-500' : 'bg-gray-400'} rounded-full mr-1.5`}></div>
            <span className={`${isAwsConnected ? 'text-green-700' : 'text-gray-500'}`}>
              AWS Cloud: <span className="font-medium">{isAwsConnected ? 'Connected' : 'Disconnected'}</span>
            </span>
            {isAwsConnected && (
              <span className="ml-1 text-gray-500">
                ({awsStatus?.region || 'unknown region'})
              </span>
            )}
          </div>

          <span className="text-gray-400">|</span>

          <div className="flex items-center">
            <div className={`w-2 h-2 ${isTerraformApplied ? 'bg-green-500' : 'bg-gray-400'} rounded-full mr-1.5`}></div>
            <span className={`${isTerraformApplied ? 'text-green-700' : 'text-gray-500'}`}>
              Terraform: <span className="font-medium">{isTerraformApplied ? 'Applied' : 'Not Applied'}</span>
            </span>
            {isTerraformApplied && terraformStatus?.provider && (
              <span className="ml-1 text-gray-500">
                ({terraformStatus.provider})
              </span>
            )}
          </div>

          <span className="text-gray-400">|</span>

          <a 
            href="https://docs.aws.amazon.com/index.html" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-orange-600 transition-colors"
          >
            AWS Docs
          </a>

          <span className="text-gray-400">|</span>

          <a 
            href="https://developer.hashicorp.com/terraform/docs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-orange-600 transition-colors"
          >
            Terraform Docs
          </a>
        </div>
      </div>
    </footer>
  );
};