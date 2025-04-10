import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { 
  AlertTriangle, 
  Check, 
  XCircle, 
  Shield, 
  CloudOff, 
  Cloud, 
  Database, 
  Server, 
  LayoutGrid,
  RefreshCw,
  Info
} from 'lucide-react';

// Define AWS service types with safety flags
interface AWSService {
  name: string;
  enabled: boolean;
  icon: React.ReactNode;
  description: string;
  canDisable: boolean; // Flag to indicate if service can be safely disabled
  criticalForFrontend: boolean; // Flag to indicate if service is critical for frontend
}

export const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [awsCallsDisabled, setAwsCallsDisabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [serviceLoading, setServiceLoading] = useState<string | null>(null);
  
  // Track individual AWS service statuses
  const [awsServices, setAwsServices] = useState<AWSService[]>([
    { 
      name: 'dynamodb', 
      enabled: true, 
      icon: <Database className="h-5 w-5" />, 
      description: 'Database for user accounts and application data',
      canDisable: true,
      criticalForFrontend: false
    },
    { 
      name: 'cognito', 
      enabled: true, 
      icon: <Shield className="h-5 w-5" />, 
      description: 'User authentication service',
      canDisable: true,
      criticalForFrontend: false
    },
    { 
      name: 'ec2', 
      enabled: true, 
      icon: <Server className="h-5 w-5" />, 
      description: 'Application server instances',
      canDisable: false,
      criticalForFrontend: true
    },
    { 
      name: 'cloudformation', 
      enabled: true, 
      icon: <LayoutGrid className="h-5 w-5" />, 
      description: 'Infrastructure deployment service',
      canDisable: false,
      criticalForFrontend: true
    }
  ]);
  
  // Only show for the admin user
  const isAdmin = user?.username === 'msn_clx';
  
  // Refresh AWS status
  const fetchAWSStatus = () => {
    setIsRefreshing(true);
    fetch('/api/aws/status')
      .then(res => res.json())
      .then(data => {
        setAwsCallsDisabled(data.awsCallsDisabled || false);
        
        // Update individual service statuses if available in the response
        if (data.services) {
          setAwsServices(prev => prev.map(service => {
            // Check if this service info exists in the response
            if (data.services[service.name] !== undefined) {
              return {
                ...service,
                enabled: data.services[service.name].enabled
              };
            }
            return service;
          }));
        }
      })
      .catch((err) => {
        console.error("Error fetching AWS status:", err);
        toast({
          title: "Error refreshing AWS status",
          description: "Could not fetch latest AWS service status",
          variant: "destructive"
        });
      })
      .finally(() => {
        setIsLoading(false);
        setIsRefreshing(false);
      });
  };

  useEffect(() => {
    // Get current AWS status on component mount
    fetchAWSStatus();
  }, []);
  
  // Toggle DynamoDB service specifically
  const toggleDynamoDBService = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/admin/toggle-aws', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ disable: !awsCallsDisabled }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAwsCallsDisabled(!awsCallsDisabled);
        
        // Update DynamoDB service status
        setAwsServices(prev => prev.map(service => 
          service.name === 'dynamodb' 
            ? { ...service, enabled: !awsCallsDisabled }
            : service
        ));
        
        toast({
          title: !awsCallsDisabled ? "DynamoDB Calls Disabled" : "DynamoDB Calls Enabled",
          description: !awsCallsDisabled 
            ? "DynamoDB calls are now disabled to save credits" 
            : "DynamoDB calls are now enabled",
          variant: "default",
        });
        
        // Update status after toggle
        setTimeout(fetchAWSStatus, 500);
      } else {
        toast({
          title: "Error",
          description: "Failed to update DynamoDB service",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Toggle error:", error);
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  // Toggle a specific service that can be safely disabled
  const toggleSafeService = async (serviceName: string) => {
    // Find service first
    const service = awsServices.find(s => s.name === serviceName);
    
    if (!service) {
      toast({
        title: "Error",
        description: `Service ${serviceName} not found`,
        variant: "destructive"
      });
      return;
    }
    
    // Check if service can be safely disabled
    if (!service.canDisable) {
      toast({
        title: "Cannot Disable Critical Service",
        description: `${serviceName} is critical for application functionality and cannot be disabled`,
        variant: "destructive"
      });
      return;
    }
    
    try {
      setServiceLoading(serviceName);
      
      const response = await fetch('/api/admin/toggle-service', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          service: serviceName,
          disable: service.enabled 
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update only this service's state
        setAwsServices(prev => prev.map(s => 
          s.name === serviceName 
            ? { ...s, enabled: !s.enabled } 
            : s
        ));
        
        toast({
          title: `${serviceName} ${service.enabled ? "Disabled" : "Enabled"}`,
          description: service.enabled 
            ? `${serviceName} is now disabled to save credits` 
            : `${serviceName} is now active and running`,
          variant: "default",
        });
        
        // If toggling DynamoDB, update the main toggle state
        if (serviceName === 'dynamodb') {
          setAwsCallsDisabled(!service.enabled);
        }
      } else {
        toast({
          title: "Error",
          description: `Failed to update ${serviceName} state`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(`Toggle ${serviceName} error:`, error);
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    } finally {
      setServiceLoading(null);
    }
  };
  
  if (!isAdmin) return null;
  
  return (
    <div className="bg-gray-800 shadow-lg rounded-lg p-4 mb-6 border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-orange-500" />
          <div>
            <h3 className="text-lg font-bold text-white flex items-center">
              Admin Controls
              {isLoading && (
                <span className="ml-2 inline-block w-4 h-4 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin"></span>
              )}
            </h3>
            <p className="text-sm text-gray-300">
              Toggle AWS features to save credits
            </p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchAWSStatus}
          disabled={isRefreshing}
          className="text-white border-gray-600 hover:bg-gray-700"
        >
          {isRefreshing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh Status
            </>
          )}
        </Button>
      </div>
      
      {/* Main DynamoDB Toggle - Primary Feature */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-4 rounded-lg mb-4 border border-gray-600">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {awsCallsDisabled ? (
              <AlertTriangle className="h-5 w-5 text-orange-400" />
            ) : (
              <Check className="h-5 w-5 text-green-400" />
            )}
            <Label htmlFor="aws-toggle" className="text-white font-medium cursor-pointer">
              AWS DynamoDB Service
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${awsCallsDisabled ? 'text-orange-400 font-medium' : 'text-green-400 font-medium'}`}>
              {awsCallsDisabled ? "Disabled" : "Enabled"}
            </span>
            
            <Switch
              id="aws-toggle"
              checked={!awsCallsDisabled}
              onCheckedChange={toggleDynamoDBService}
              disabled={isLoading || serviceLoading === 'dynamodb'}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
        </div>
        
        <div className="p-3 rounded-md bg-gray-800 bg-opacity-50 border border-gray-600">
          <p className="text-sm font-medium">
            {awsCallsDisabled ? (
              <span className="text-orange-400 flex items-center">
                <XCircle className="inline-block w-4 h-4 mr-1" />
                DynamoDB service is currently disabled (saving credits)
              </span>
            ) : (
              <span className="text-green-400 flex items-center">
                <Check className="inline-block w-4 h-4 mr-1" />
                DynamoDB service is currently enabled (using AWS credits)
              </span>
            )}
          </p>
          
          <p className="text-xs text-gray-400 mt-1">
            <Info className="inline-block w-3 h-3 mr-1" />
            When disabled, only the admin user (msn_clx) can login locally.
            New registrations and database operations will be disabled.
          </p>
        </div>
      </div>
      
      {/* Individual Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {awsServices.map(service => (
          <Card 
            key={service.name}
            className={`bg-gray-700 border-gray-600 shadow-sm ${
              service.criticalForFrontend 
                ? 'border-l-4 border-l-red-500' 
                : service.enabled 
                  ? 'border-l-4 border-l-green-500'
                  : 'border-l-4 border-l-orange-500'
            }`}
          >
            <div className="p-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <div className={`text-${service.enabled ? 'green' : 'orange'}-400`}>
                    {service.icon}
                  </div>
                  <h4 className="font-medium text-white capitalize">{service.name}</h4>
                </div>
                
                {service.criticalForFrontend ? (
                  <div className="flex items-center">
                    <span className="text-xs bg-red-900/50 text-red-300 px-2 py-0.5 rounded-full">
                      Critical
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs ${service.enabled ? 'text-green-400' : 'text-orange-400'}`}>
                      {service.enabled ? 'Active' : 'Disabled'}
                    </span>
                    <Switch
                      checked={service.enabled}
                      onCheckedChange={() => toggleSafeService(service.name)}
                      disabled={!service.canDisable || isLoading || serviceLoading === service.name}
                      className="data-[state=checked]:bg-green-500 h-4 w-7"
                    />
                  </div>
                )}
              </div>
              
              <p className="text-xs text-gray-300">{service.description}</p>
              
              {service.criticalForFrontend && (
                <p className="text-xs text-red-300 mt-1 flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Cannot be disabled (critical for application)
                </p>
              )}
              
              {serviceLoading === service.name && (
                <div className="mt-1 flex items-center">
                  <RefreshCw className="h-3 w-3 mr-1 text-orange-400 animate-spin" />
                  <span className="text-xs text-orange-400">Updating...</span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
      
      <div className="mt-4 px-3 py-2 bg-gray-700 bg-opacity-50 rounded-md text-xs text-gray-400 border border-gray-600">
        <p className="flex items-center">
          <Info className="h-3 w-3 mr-1 text-orange-400" />
          <span>
            Only non-critical AWS services can be safely disabled. Core infrastructure services
            that are required for the application to function are protected.
          </span>
        </p>
      </div>
    </div>
  );
};