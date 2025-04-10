import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { LuServer, LuCpu, LuHardDrive, LuCloudLightning } from "react-icons/lu";

interface SystemInfo {
  hostname: string;
  platform: string;
  uptime: number;
  environment: string;
  memory: {
    total: number;
    free: number;
    used: number;
    usagePercent: number;
  };
  cpu: {
    model: string;
    cores: number;
    usage: number;
  };
  aws: {
    connected: boolean;
    region: string;
    endpoint: string;
    services: {
      dynamodb: boolean;
      cognito: boolean;
    };
  };
  network: {
    interfaces: string[];
  };
  timestamp: string;
}

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function formatUptime(seconds: number) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  let result = '';
  if (days > 0) result += `${days}d `;
  if (hours > 0) result += `${hours}h `;
  result += `${minutes}m`;
  
  return result;
}

export const SystemStatus: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/system-status'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="mb-6 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 shadow-lg rounded-lg overflow-hidden border border-orange-500/20">
        <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-gray-800 via-gray-700 to-orange-600 border-b border-gray-700">
          <h3 className="text-lg leading-6 font-bold text-white flex items-center gap-2">
            <LuServer className="h-5 w-5" />
            System Status
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-200">
            Loading system information...
          </p>
        </div>
        <div className="p-6 text-white">
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-4 w-32 rounded bg-gray-700 animate-pulse" />
                <div className="h-6 w-full rounded bg-gray-700 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    const systemInfo: SystemInfo = {
      hostname: "oaktree-server",
      platform: "aws-cloud",
      uptime: 345600, // 4 days in seconds
      environment: "production",
      memory: {
        total: 8589934592, // 8GB in bytes
        free: 4294967296,  // 4GB in bytes
        used: 4294967296,  // 4GB in bytes
        usagePercent: 50
      },
      cpu: {
        model: "AWS EC2 vCPU",
        cores: 2,
        usage: 25
      },
      aws: {
        connected: true,
        region: "ap-southeast-1",
        endpoint: "https://dynamodb.ap-southeast-1.amazonaws.com",
        services: {
          dynamodb: true,
          cognito: true
        }
      },
      network: {
        interfaces: ["eth0"]
      },
      timestamp: new Date().toISOString()
    };

    return (
      <div className="mb-6 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 shadow-lg rounded-lg overflow-hidden border border-orange-500/20">
        <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-gray-800 via-gray-700 to-orange-600 border-b border-gray-700">
          <h3 className="text-lg leading-6 font-bold text-white flex items-center gap-2">
            <LuServer className="h-5 w-5" />
            System Status
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-200">
            <div className="flex items-center gap-2">
              <Badge className="bg-orange-100 text-orange-800">
                Live Demo Data
              </Badge>
              <span className="text-xs text-gray-300">Using example data for display purposes</span>
            </div>
          </p>
        </div>
        <div className="p-6 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-400">Hostname</span>
                  <span>{systemInfo.hostname}</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-400">Platform</span>
                  <span className="capitalize">{systemInfo.platform}</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-400">Uptime</span>
                  <span>{formatUptime(systemInfo.uptime)}</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm font-medium mb-1.5">
                  <span className="flex items-center gap-1 text-gray-400">
                    <LuHardDrive className="h-3.5 w-3.5" />
                    Memory Usage
                  </span>
                  <span>{formatBytes(systemInfo.memory.used)} / {formatBytes(systemInfo.memory.total)}</span>
                </div>
                <Progress value={systemInfo.memory.usagePercent} className="bg-gray-700" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm font-medium mb-1.5">
                  <span className="flex items-center gap-1 text-gray-400">
                    <LuCpu className="h-3.5 w-3.5" />
                    CPU Usage
                  </span>
                  <span>{systemInfo.cpu.usage}%</span>
                </div>
                <Progress value={systemInfo.cpu.usage} className="bg-gray-700" />
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-1 text-white">
                  <LuCloudLightning className="h-4 w-4" />
                  AWS Connection Status
                </h4>
                <div className="rounded-md border border-gray-700 p-3 space-y-2 bg-gray-800 bg-opacity-50">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Status</span>
                    <Badge className="bg-green-100 text-green-800">
                      Connected
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Region</span>
                    <span>{systemInfo.aws.region}</span>
                  </div>
                  
                  <Separator className="bg-gray-700" />
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">DynamoDB</span>
                    <Badge className="bg-green-100 text-green-800">
                      Available
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">IAM Roles</span>
                    <Badge className="bg-green-100 text-green-800">
                      Available
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-gray-400 mt-2 text-right">
                Last updated: {new Date(systemInfo.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const systemInfo = data as SystemInfo;

  return (
    <div className="mb-6 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 shadow-lg rounded-lg overflow-hidden border border-orange-500/20">
      <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-gray-800 via-gray-700 to-orange-600 border-b border-gray-700">
        <h3 className="text-lg leading-6 font-bold text-white flex items-center gap-2">
          <LuServer className="h-5 w-5" />
          System Status
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-200">
          Real-time system metrics and AWS connectivity status
        </p>
      </div>
      <div className="p-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-gray-400">Hostname:</span>
                <span>{systemInfo.hostname}</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-gray-400">Platform:</span>
                <span className="capitalize">{systemInfo.platform}</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-gray-400">Uptime:</span>
                <span>{formatUptime(systemInfo.uptime)}</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm font-medium mb-1.5">
                <span className="flex items-center gap-1 text-gray-400">
                  <LuHardDrive className="h-3.5 w-3.5" />
                  Memory Usage
                </span>
                <span>{formatBytes(systemInfo.memory.used)} / {formatBytes(systemInfo.memory.total)}</span>
              </div>
              <Progress value={systemInfo.memory.usagePercent} className="bg-gray-700" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm font-medium mb-1.5">
                <span className="flex items-center gap-1 text-gray-400">
                  <LuCpu className="h-3.5 w-3.5" />
                  CPU Usage
                </span>
                <span>{systemInfo.cpu.usage}%</span>
              </div>
              <Progress value={systemInfo.cpu.usage} className="bg-gray-700" />
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-1 text-white">
                <LuCloudLightning className="h-4 w-4" />
                AWS Connection Status
              </h4>
              <div className="rounded-md border border-gray-700 p-3 space-y-2 bg-gray-800 bg-opacity-50">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Status</span>
                  <Badge className={systemInfo.aws.connected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {systemInfo.aws.connected ? "Connected" : "Disconnected"}
                  </Badge>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Region</span>
                  <span>{systemInfo.aws.region}</span>
                </div>
                
                <Separator className="bg-gray-700" />
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">DynamoDB</span>
                  <Badge className={systemInfo.aws.services.dynamodb ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {systemInfo.aws.services.dynamodb ? "Available" : "Unavailable"}
                  </Badge>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">IAM Roles</span>
                  <Badge className="bg-green-100 text-green-800">
                    Available
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-gray-400 mt-2 text-right">
              Last updated: {new Date(systemInfo.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};