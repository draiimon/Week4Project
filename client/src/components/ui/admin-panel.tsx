import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [awsCallsDisabled, setAwsCallsDisabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Only show for the admin user
  const isAdmin = user?.username === 'msn_clx';
  
  useEffect(() => {
    // Get current AWS status
    fetch('/api/aws/status')
      .then(res => res.json())
      .then(data => {
        setAwsCallsDisabled(data.awsCallsDisabled || false);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);
  
  const toggleAwsCalls = async () => {
    try {
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
      } else {
        toast({
          title: "Error",
          description: "Failed to update AWS calls setting",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    }
  };
  
  if (!isAdmin) return null;
  
  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold mb-2">Admin Controls</h3>
      <p className="text-sm text-gray-500 mb-4">
        Control AWS resource usage to save credits
      </p>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">AWS DynamoDB Calls:</p>
          <p className="text-sm text-gray-500">
            {awsCallsDisabled 
              ? "Disabled (saving AWS credits)" 
              : "Enabled (using AWS credits)"}
          </p>
        </div>
        
        <Button
          onClick={toggleAwsCalls}
          disabled={isLoading}
          variant={awsCallsDisabled ? "outline" : "destructive"}
          size="sm"
        >
          {isLoading ? "Loading..." : (awsCallsDisabled ? "Enable AWS Calls" : "Disable AWS Calls")}
        </Button>
      </div>
    </div>
  );
};