import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getQueryFn } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

// Type definitions for AWS status response
interface DynamoDBService {
  enabled: boolean;
  tableName: string;
}

interface CognitoService {
  enabled: boolean;
  userPoolId: string | null;
}

interface AWSServices {
  dynamodb: DynamoDBService;
  cognito: CognitoService;
}

interface AWSStatusResponse {
  status: 'connected' | 'not_connected';
  region: string;
  services: AWSServices;
  environment: string;
  timestamp: string;
}

// Type definitions for AWS resources response
interface VPCInfo {
  id: string;
  region: string;
}

interface DatabaseInfo {
  type: string;
  name: string;
  status: string;
}

interface AWSResourcesResponse {
  vpc: VPCInfo;
  databases: DatabaseInfo[];
  lastUpdated: string;
}

export const AWSStatusPanel: React.FC = () => {
  const { toast } = useToast();
  
  // Fetch AWS status
  const { 
    data: awsStatus,
    isLoading: statusLoading,
    error: statusError,
    refetch: refetchStatus
  } = useQuery<AWSStatusResponse>({
    queryKey: ['/api/aws/status'],
    queryFn: getQueryFn({ on401: 'throw' })
  });
  
  // Fetch AWS resources
  const { 
    data: awsResources,
    isLoading: resourcesLoading,
    error: resourcesError,
    refetch: refetchResources
  } = useQuery<AWSResourcesResponse>({
    queryKey: ['/api/aws/resources'],
    queryFn: getQueryFn({ on401: 'throw' })
  });
  
  const isLoading = statusLoading || resourcesLoading;
  const hasError = statusError || resourcesError;
  
  const handleRefresh = () => {
    refetchStatus();
    refetchResources();
    toast({
      title: "Refreshing AWS Status",
      description: "Fetching the latest AWS connection information"
    });
  };
  
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>AWS Infrastructure Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Loading AWS status...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (hasError) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>AWS Infrastructure Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-40 space-y-4">
            <p className="text-destructive">Error loading AWS status information</p>
            <Button onClick={handleRefresh} variant="outline">Retry</Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>AWS Infrastructure Status</CardTitle>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          size="sm"
        >
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Connection Status Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Connection Status</h3>
              <Badge 
                variant={awsStatus?.status === 'connected' ? 'default' : 'destructive'}
              >
                {awsStatus?.status === 'connected' ? 'Connected' : 'Disconnected'}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Region</div>
              <div>{awsStatus?.region || 'Unknown'}</div>
              <div className="text-muted-foreground">Environment</div>
              <div className="capitalize">{awsStatus?.environment || 'development'}</div>
            </div>
          </div>
          
          <Separator />
          
          {/* Services Section */}
          <div>
            <h3 className="font-medium mb-3">AWS Services</h3>
            <div className="space-y-3">
              {/* DynamoDB */}
              <div className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                <div>
                  <p className="font-medium">DynamoDB</p>
                  <p className="text-xs text-muted-foreground">
                    Table: {awsStatus?.services.dynamodb.tableName}
                  </p>
                </div>
                <Badge variant={awsStatus?.services.dynamodb.enabled ? 'default' : 'outline'}>
                  {awsStatus?.services.dynamodb.enabled ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              
              {/* Cognito */}
              <div className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                <div>
                  <p className="font-medium">Cognito</p>
                  <p className="text-xs text-muted-foreground">
                    {awsStatus?.services.cognito.userPoolId || 'Not configured'}
                  </p>
                </div>
                <Badge variant={awsStatus?.services.cognito.enabled ? 'default' : 'outline'}>
                  {awsStatus?.services.cognito.enabled ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Infrastructure Section */}
          <div>
            <h3 className="font-medium mb-3">Infrastructure</h3>
            <div className="space-y-3">
              {/* VPC */}
              <div className="bg-muted/50 p-2 rounded-md">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Virtual Private Cloud (VPC)</p>
                  <Badge variant="outline">Active</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  ID: {awsResources?.vpc.id || 'Unknown'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Region: {awsResources?.vpc.region || 'Unknown'}
                </p>
              </div>
              
              {/* Databases */}
              {awsResources?.databases.map((db, idx) => (
                <div key={idx} className="bg-muted/50 p-2 rounded-md">
                  <div className="flex items-center justify-between">
                    <p className="font-medium capitalize">{db.type}</p>
                    <Badge variant="outline" className="capitalize">{db.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Name: {db.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground text-right">
            Last updated: {new Date(awsStatus?.timestamp || '').toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};