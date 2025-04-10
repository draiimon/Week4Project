import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Check, XCircle, ToggleLeft, ToggleRight, Shield } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [awsCallsDisabled, setAwsCallsDisabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Only show for the admin user
  const isAdmin = user?.username === 'msn_clx';
  
  const fetchAWSStatus = () => {
    setIsLoading(true);
    fetch('/api/aws/status')
      .then(res => res.json())
      .then(data => {
        setAwsCallsDisabled(data.awsCallsDisabled || false);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching AWS status:", err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    // Get current AWS status on component mount
    fetchAWSStatus();
  }, []);
  
  const toggleAwsCalls = async () => {
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
          title: "AWS Calls Setting Updated",
          description: awsCallsDisabled ? "AWS calls are now enabled" : "AWS calls are now disabled to save credits",
          variant: "default",
        });
        
        // Update status after toggle
        setTimeout(fetchAWSStatus, 500);
      } else {
        toast({
          title: "Error",
          description: "Failed to update AWS calls setting",
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
      </div>
      
      <div className="bg-gray-700 p-3 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {awsCallsDisabled ? (
              <AlertTriangle className="h-5 w-5 text-orange-400" />
            ) : (
              <Check className="h-5 w-5 text-green-400" />
            )}
            <Label htmlFor="aws-toggle" className="text-white font-medium cursor-pointer">
              AWS DynamoDB Calls
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${awsCallsDisabled ? 'text-orange-400 font-medium' : 'text-green-400 font-medium'}`}>
              {awsCallsDisabled ? "Disabled" : "Enabled"}
            </span>
            
            <Switch
              id="aws-toggle"
              checked={!awsCallsDisabled}
              onCheckedChange={toggleAwsCalls}
              disabled={isLoading}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
        </div>
        
        <div className="p-3 rounded-md bg-gray-800 border border-gray-600">
          <p className="text-sm font-medium">
            {awsCallsDisabled ? (
              <span className="text-orange-400 flex items-center">
                <XCircle className="inline-block w-4 h-4 mr-1" />
                AWS calls are currently disabled (saving credits)
              </span>
            ) : (
              <span className="text-green-400 flex items-center">
                <Check className="inline-block w-4 h-4 mr-1" />
                AWS calls are currently enabled (using credits)
              </span>
            )}
          </p>
          
          {/* Button removed to avoid redundancy with the toggle switch */}
        </div>
      </div>
    </div>
  );
};