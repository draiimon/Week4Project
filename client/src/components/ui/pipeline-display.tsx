import React, { useEffect, useState } from "react";

interface PipelineStepProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  status: "completed" | "active" | "pending";
}

const PipelineStep: React.FC<PipelineStepProps> = ({ title, subtitle, icon, status }) => {
  const getStatusClasses = () => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "active":
        return "bg-orange-500 animate-pulse";
      case "pending":
        return "bg-gray-300";
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center mb-4 md:mb-0">
      <div
        className={`w-16 h-16 flex items-center justify-center rounded-full ${getStatusClasses()} text-white mb-2`}
      >
        {icon}
      </div>
      <h5 className="text-sm font-medium text-gray-900">{title}</h5>
      <span className="text-xs text-gray-500">{subtitle}</span>
    </div>
  );
};

export const PipelineDisplay: React.FC = () => {
  const [awsStatus, setAwsStatus] = useState<'connected' | 'not_connected' | 'loading'>('loading');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/aws/status')
      .then(res => res.json())
      .then(data => {
        setAwsStatus(data.status);
        setIsLoading(false);
      })
      .catch(() => {
        setAwsStatus('not_connected');
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          AWS DynamoDB Integration
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Status of your Week 4 AWS connection
        </p>
      </div>

      <div className="p-6">
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading AWS connection status...</p>
        ) : (
          <>
            <div className="flex items-center mb-6">
              <div className={`p-2 rounded-full mr-3 ${awsStatus === 'connected' ? 'bg-green-100' : 'bg-orange-100'}`}>
                <svg 
                  className={`h-6 w-6 ${awsStatus === 'connected' ? 'text-green-500' : 'text-orange-500'}`}
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  {awsStatus === 'connected' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900">
                  AWS Connection Status: 
                  <span className={awsStatus === 'connected' ? 'text-green-500 ml-2' : 'text-orange-500 ml-2'}>
                    {awsStatus === 'connected' ? 'Connected' : 'Not Connected'}
                  </span>
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  {awsStatus === 'connected' 
                    ? 'Your application is successfully connected to AWS DynamoDB for user authentication and data storage.' 
                    : 'Your application is having trouble connecting to AWS. Please check your credentials.'}
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <h5 className="text-sm font-medium text-gray-900 mb-2">AWS Services Status:</h5>
              <div className="space-y-2">
                <div className="flex items-center">
                  <svg 
                    className={`h-5 w-5 mr-2 ${awsStatus === 'connected' ? 'text-green-500' : 'text-gray-400'}`}
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-700">DynamoDB Connection: {awsStatus === 'connected' ? 'Active' : 'Inactive'}</span>
                </div>
                <div className="flex items-center">
                  <svg 
                    className={`h-5 w-5 mr-2 ${awsStatus === 'connected' ? 'text-green-500' : 'text-gray-400'}`}
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-700">AWS SDK Integration: {awsStatus === 'connected' ? 'Working' : 'Not Working'}</span>
                </div>
                <div className="flex items-center">
                  <svg 
                    className={`h-5 w-5 mr-2 ${awsStatus === 'connected' ? 'text-green-500' : 'text-gray-400'}`}
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-700">User Authentication System: {awsStatus === 'connected' ? 'Ready' : 'Unavailable'}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
