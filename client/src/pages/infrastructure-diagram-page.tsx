import React, { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { 
  LuCloud,
  LuDatabase,
  LuServer,
  LuLayoutGrid,
  LuMonitor,
  LuBox,
  LuShield
} from "react-icons/lu";
import { SiAmazon, SiDocker } from "react-icons/si";

// Resource component
interface ResourceProps {
  icon: React.ReactNode;
  label?: string;
  color?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  bordered?: boolean;
  tooltip?: string;
  status?: 'success' | 'warning' | 'error' | 'info' | null;
}

const Resource: React.FC<ResourceProps> = ({ 
  icon, 
  label, 
  color = "orange",
  size = "md",
  className = "",
  bordered = false,
  tooltip,
  status
}) => {
  const sizeClasses = {
    sm: "w-12 h-12 text-xl",
    md: "w-16 h-16 text-2xl",
    lg: "w-20 h-20 text-3xl"
  };

  const colorClasses = {
    orange: "from-orange-500 to-orange-600 shadow-orange-500/30",
    blue: "from-blue-500 to-blue-600 shadow-blue-500/30",
    purple: "from-purple-500 to-purple-600 shadow-purple-500/30",
    green: "from-green-500 to-green-600 shadow-green-500/30",
    teal: "from-teal-500 to-teal-600 shadow-teal-500/30",
    cyan: "from-cyan-500 to-cyan-600 shadow-cyan-500/30"
  };

  const statusIndicator = status && (
    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
      status === 'success' ? 'bg-green-500' : 
      status === 'warning' ? 'bg-yellow-500' : 
      status === 'error' ? 'bg-red-500' : 
      'bg-blue-500'
    }`}></div>
  );

  return (
    <div className={`flex flex-col items-center ${className}`} title={tooltip}>
      <div className={`flex items-center justify-center ${sizeClasses[size]} 
        bg-gradient-to-br ${colorClasses[color]} rounded-lg shadow-lg relative
        ${bordered ? 'ring-2 ring-white/20' : ''}
        transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-xl`}>
        {icon}
        {statusIndicator}
      </div>
      {label && (
        <div className="mt-2 text-center">
          <span className="text-xs font-medium text-white bg-gray-800/70 rounded-full px-2 py-1">
            {label}
          </span>
        </div>
      )}
    </div>
  );
};

// Group component
interface GroupProps {
  title?: string;
  color?: string;
  children: React.ReactNode;
  className?: string;
}

const Group: React.FC<GroupProps> = ({ title, color = "orange", children, className = "" }) => {
  const borderColors = {
    orange: "border-orange-500/30",
    blue: "border-blue-500/30",
    purple: "border-purple-500/30",
    green: "border-green-500/30",
    teal: "border-teal-500/30"
  };

  const bgColors = {
    orange: "from-orange-950/10 to-orange-900/5",
    blue: "from-blue-950/10 to-blue-900/5",
    purple: "from-purple-950/10 to-purple-900/5",
    green: "from-green-950/10 to-green-900/5",
    teal: "from-teal-950/10 to-teal-900/5"
  };

  return (
    <div className={`p-4 border ${borderColors[color]} rounded-lg bg-gradient-to-br ${bgColors[color]} ${className}`}>
      {title && (
        <div className="mb-3 flex items-center">
          <h3 className="text-sm font-medium text-white">{title}</h3>
          <div className={`ml-2 w-full h-px bg-gradient-to-r ${borderColors[color]}`}></div>
        </div>
      )}
      <div className="relative">
        {children}
      </div>
    </div>
  );
};

export default function InfrastructureDiagramPage() {
  const { data: awsData } = useQuery({
    queryKey: ['/api/aws/status'],
    refetchInterval: 30000
  });

  const { data: terraformStatus } = useQuery({
    queryKey: ['/api/terraform/status'],
    refetchInterval: 30000
  });

  const awsDataObj = awsData as { status: string; region: string } || { status: 'not_connected', region: 'us-east-1' };
  const awsConnected = awsDataObj.status === 'connected';
  const awsRegion = awsDataObj.region || 'us-east-1';

  return (
    <DashboardLayout title="DevOps Infrastructure Diagram">
      <div className="mb-6">
        <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 shadow-lg rounded-lg overflow-hidden border border-orange-500/20">
          <div className="px-6 py-5 sm:px-6 bg-gradient-to-r from-gray-800 via-gray-700 to-orange-600 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-bold text-white flex items-center gap-2">
                  <LuCloud className="h-5 w-5" />
                  AWS Infrastructure Diagram
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-200">
                  Current deployment architecture in {awsRegion}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 text-white">
            {/* Status indicator */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Badge className={awsConnected ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}>
                  {awsConnected ? "Connected to AWS" : "Using Demo Data"}
                </Badge>
                <span className="text-sm text-gray-300">Region: {awsRegion}</span>
              </div>
            </div>

            {/* Infrastructure Diagram */}
            <div className="relative min-h-[500px] bg-gradient-to-br from-gray-900 to-gray-950 rounded-lg p-8 overflow-auto border border-gray-800">
              {/* AWS Cloud Container */}
              <Group title="AWS Cloud Infrastructure" color="orange">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <SiAmazon className="text-orange-500 h-6 w-6 mr-2" />
                    <span className="text-sm font-medium">Region: {awsRegion}</span>
                  </div>
                </div>

                {/* VPC Container */}
                <Group title="Virtual Private Cloud (VPC)" color="blue">
                  <div className="flex justify-center mb-6">
                    <Resource 
                      icon={<LuLayoutGrid className="text-white" />} 
                      label="Load Balancer" 
                      color="orange"
                      size="md"
                      status="success"
                      tooltip="Application Load Balancer"
                    />
                  </div>

                  <div className="flex justify-center mb-6">
                    <div className="h-8 w-0.5 bg-blue-500/70"></div>
                  </div>

                  {/* Container Services */}
                  <Group title="ECS Fargate" color="teal">
                    <div className="p-4 bg-teal-900/10 border border-teal-500/20 rounded-md flex justify-center items-center">
                      <div className="flex flex-col items-center">
                        <Resource 
                          icon={<LuBox className="text-white" />} 
                          label="ECS Cluster" 
                          color="teal"
                          size="md"
                          status="success"
                          tooltip="Fargate Cluster"
                        />

                        <div className="mt-4">
                          <Resource 
                            icon={<LuBox className="text-white" />} 
                            label="Container" 
                            color="cyan"
                            size="sm"
                            status="success"
                            tooltip="Application container"
                          />
                        </div>
                      </div>
                    </div>
                  </Group>

                  {/* Database Layer */}
                  <div className="flex justify-center mt-6">
                    <Group title="Database" color="orange" className="w-2/3">
                      <div className="p-4 bg-orange-900/10 border border-orange-500/20 rounded-md flex justify-center">
                        <Resource 
                          icon={<LuDatabase className="text-white" />} 
                          label="DynamoDB" 
                          color="orange"
                          size="sm"
                          status="success"
                          tooltip="Users Table"
                        />
                      </div>
                    </Group>
                  </div>
                </Group>

                {/* Supporting Services */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <Group title="Container Registry" color="cyan">
                    <div className="flex justify-center">
                      <Resource 
                        icon={<SiDocker className="text-white" />} 
                        label="ECR" 
                        color="cyan"
                        size="sm"
                        status="success"
                        tooltip="Elastic Container Registry"
                      />
                    </div>
                  </Group>

                  <Group title="Monitoring" color="blue">
                    <div className="flex justify-center">
                      <Resource 
                        icon={<LuMonitor className="text-white" />} 
                        label="CloudWatch" 
                        color="blue"
                        size="sm"
                        status="success"
                        tooltip="Logs and Monitoring"
                      />
                    </div>
                  </Group>
                </div>
              </Group>
            </div>
          </div>
        </div>
      </div>
      {/* Steps Filters */}
      <div className="mb-6 flex flex-wrap gap-2 justify-center">
        {/* ...rest of the code from the original file... */}
    </DashboardLayout>
  );
}