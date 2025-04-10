import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  AlertTriangle, 
  Check, 
  XCircle, 
  Shield, 
  Database, 
  RefreshCw,
  Info
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [awsCallsDisabled, setAwsCallsDisabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [serviceLoading, setServiceLoading] = useState<string | null>(null);
  
  // Only show for the admin user
  const isAdmin = user?.username === 'msn_clx';
  
  // Refresh AWS status
  const fetchAWSStatus = () => {
    setIsRefreshing(true);
    fetch('/api/aws/status')
      .then(res => res.json())
      .then(data => {
        setAwsCallsDisabled(data.awsCallsDisabled || false);
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
    </div>
  );
};