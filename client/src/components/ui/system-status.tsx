import React from 'react';

interface SystemStatusProps {
  status: 'operational' | 'maintenance' | 'down';
  services?: {
    aws?: boolean;
    dynamodb?: boolean;
    cognito?: boolean;
    terraform?: boolean;
  };
}

export const SystemStatus: React.FC<SystemStatusProps> = ({ 
  status = 'operational',
  services = { aws: true, dynamodb: true, cognito: false, terraform: true }
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'operational':
        return 'bg-green-500';
      case 'maintenance':
        return 'bg-yellow-500';
      case 'down':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'operational':
        return 'All Systems Operational';
      case 'maintenance':
        return 'Scheduled Maintenance';
      case 'down':
        return 'Service Disruption';
      default:
        return 'Status Unknown';
    }
  };

  return (
    <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
      <div className="flex items-center space-x-2 mb-3">
        <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
        <span className="text-white text-sm font-medium">{getStatusText()}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${services?.aws ? 'bg-green-400' : 'bg-gray-400'}`}></div>
          <span className="text-white text-xs">AWS Connection</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${services?.dynamodb ? 'bg-green-400' : 'bg-gray-400'}`}></div>
          <span className="text-white text-xs">DynamoDB</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${services?.cognito ? 'bg-green-400' : 'bg-gray-400'}`}></div>
          <span className="text-white text-xs">Cognito</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${services?.terraform ? 'bg-green-400' : 'bg-gray-400'}`}></div>
          <span className="text-white text-xs">Terraform</span>
        </div>
      </div>
    </div>
  );
};