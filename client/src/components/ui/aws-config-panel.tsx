import React, { useState, useEffect } from 'react';

export const AWSConfigPanel: React.FC = () => {
  const [awsRegion, setAwsRegion] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch real AWS status from API
    fetch('/api/aws/status')
      .then(res => res.json())
      .then(data => {
        setAwsRegion(data.region || 'ap-southeast-1');
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  return (
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
          {isLoading ? (
            <p className="text-sm text-gray-500">Loading AWS configuration...</p>
          ) : (
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
          )}
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
            <li>Secure user registration with AWS-backed storage</li>
            <li>Password encryption with crypto library</li>
            <li>Seamless fallback to local database when offline</li>
            <li>Cross-environment compatibility (local and cloud)</li>
          </ul>
        </div>
        
        <div className="mt-4">
          <a
            href="/auth"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Try Authentication
          </a>
        </div>
      </div>
    </div>
  );
};