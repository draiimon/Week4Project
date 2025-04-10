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
    <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 shadow-lg rounded-lg overflow-hidden mb-8 border border-orange-500/20">
      <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-gray-800 via-gray-700 to-orange-600 border-b border-gray-700">
        <h3 className="text-lg leading-6 font-bold text-white">
          AWS DynamoDB Integration
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-200">
          Status of your Week 4 AWS connection
        </p>
      </div>

      <div className="p-6 text-white">
        {isLoading ? (
          <p className="text-sm text-gray-300">Loading AWS connection status...</p>
        ) : (
          <>
            <div className="flex items-center mb-6 p-4 bg-gray-800 bg-opacity-50 rounded-md border border-gray-700">
              <div className={`p-3 rounded-full mr-3 ${awsStatus === 'connected' ? 'bg-green-500' : 'bg-orange-500'}`}>
                <svg 
                  className="h-6 w-6 text-white"
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
                <h4 className="text-lg font-medium text-white">
                  AWS Connection Status: 
                  <span className={awsStatus === 'connected' ? 'text-green-400 ml-2' : 'text-orange-400 ml-2'}>
                    {awsStatus === 'connected' ? 'Connected' : 'Not Connected'}
                  </span>
                </h4>
                <p className="text-sm text-gray-300 mt-1">
                  {awsStatus === 'connected' 
                    ? 'Your application is successfully connected to AWS DynamoDB for user authentication and data storage.' 
                    : 'Your application is having trouble connecting to AWS. Please check your credentials.'}
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-gray-800 to-gray-900 border border-orange-500/20 rounded-md">
              <h4 className="text-sm font-medium text-orange-400 mb-4">AWS Real-Time Integration Status:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center p-3 bg-gray-800 rounded border border-gray-700">
                  <div className={`w-3 h-3 ${awsStatus === 'connected' ? 'bg-green-500' : 'bg-gray-500'} rounded-full mr-2`}></div>
                  <span className="text-sm text-gray-300">DynamoDB: <span className="font-medium">{awsStatus === 'connected' ? 'Active' : 'Inactive'}</span></span>
                </div>
                <div className="flex items-center p-3 bg-gray-800 rounded border border-gray-700">
                  <div className={`w-3 h-3 ${awsStatus === 'connected' ? 'bg-green-500' : 'bg-gray-500'} rounded-full mr-2`}></div>
                  <span className="text-sm text-gray-300">SDK Integration: <span className="font-medium">{awsStatus === 'connected' ? 'Working' : 'Not Working'}</span></span>
                </div>
                <div className="flex items-center p-3 bg-gray-800 rounded border border-gray-700">
                  <div className={`w-3 h-3 ${awsStatus === 'connected' ? 'bg-green-500' : 'bg-gray-500'} rounded-full mr-2`}></div>
                  <span className="text-sm text-gray-300">Authentication: <span className="font-medium">{awsStatus === 'connected' ? 'Ready' : 'Unavailable'}</span></span>
                </div>
                <div className="flex items-center p-3 bg-gray-800 rounded border border-gray-700">
                  <div className={`w-3 h-3 ${awsStatus === 'connected' ? 'bg-green-500' : 'bg-gray-500'} rounded-full mr-2`}></div>
                  <span className="text-sm text-gray-300">IAM Permissions: <span className="font-medium">{awsStatus === 'connected' ? 'Configured' : 'Missing'}</span></span>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-orange-400">AWS Service Pipeline Status</h4>
                <div className="bg-orange-500 text-xs font-bold text-white px-2 py-1 rounded-full">
                  LIVE
                </div>
              </div>
              <div className="bg-gray-800 h-2 rounded-full overflow-hidden">
                <div className={`h-full ${awsStatus === 'connected' ? 'bg-gradient-to-r from-green-500 to-green-400 w-full' : 'bg-orange-500 w-1/3'}`}></div>
              </div>
              <div className="mt-2 flex justify-between text-xs text-gray-400">
                <span>Connection</span>
                <span>Authentication</span>
                <span>Data Storage</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
