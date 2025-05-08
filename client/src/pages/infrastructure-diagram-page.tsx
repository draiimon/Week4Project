import React, { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { 
  LuCloud, 
  LuDatabase, 
  LuServer, 
  LuUsers, 
  LuGlobe, 
  LuShield, 
  LuLock, 
  LuArrowRight, 
  LuArrowDown, 
  LuBox, 
  LuLayoutGrid, 
  LuNetwork, 
  LuHardDrive,
  LuCpu,
  LuInfo,
  LuSettings,
  LuMonitor,
  LuCode,
  LuGitBranch,
  LuCheck
} from "react-icons/lu";

import { 
  SiDocker, 
  SiAmazon, 
  SiTerraform, 
  SiGithubactions, 
  SiGit, 
  SiNodedotjs, 
  SiAwslambda,
  SiAmazons3
} from "react-icons/si";

// Resource component for the diagram
interface ResourceProps {
  icon: React.ReactNode;
  label?: string; 
  color?: string;
  size?: "sm" | "md" | "lg"; 
  className?: string;
  bordered?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
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
  onClick,
  tooltip,
  status
}) => {
  const sizeClasses: Record<string, string> = {
    sm: "w-12 h-12 text-xl",
    md: "w-16 h-16 text-2xl",
    lg: "w-20 h-20 text-3xl",
  };

  const colorClasses: Record<string, string> = {
    orange: "from-orange-500 to-orange-600 shadow-orange-500/30",
    blue: "from-blue-500 to-blue-600 shadow-blue-500/30",
    purple: "from-purple-500 to-purple-600 shadow-purple-500/30",
    green: "from-green-500 to-green-600 shadow-green-500/30",
    teal: "from-teal-500 to-teal-600 shadow-teal-500/30",
    cyan: "from-cyan-500 to-cyan-600 shadow-cyan-500/30",
    red: "from-red-500 to-red-600 shadow-red-500/30",
    gray: "from-gray-600 to-gray-700 shadow-gray-500/30",
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
    <div 
      className={`flex flex-col items-center ${className} relative`} 
      onClick={onClick}
      title={tooltip}
    >
      <div 
        className={`flex items-center justify-center ${sizeClasses[size]} 
          bg-gradient-to-br ${colorClasses[color]} rounded-lg shadow-lg relative
          ${bordered ? 'ring-2 ring-white/20' : ''}
          transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-xl z-10`}
      >
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

// Group component for the diagram
interface GroupProps {
  title?: string;
  color?: string;
  children: React.ReactNode;
  className?: string;
}

const Group: React.FC<GroupProps> = ({ title, color = "orange", children, className = "" }) => {
  const borderColors: Record<string, string> = {
    orange: "border-orange-500/30",
    blue: "border-blue-500/30",
    purple: "border-purple-500/30",
    green: "border-green-500/30",
    teal: "border-teal-500/30",
    cyan: "border-cyan-500/30",
    red: "border-red-500/30",
    gray: "border-gray-500/30"
  };

  const bgColors: Record<string, string> = {
    orange: "from-orange-950/10 to-orange-900/5",
    blue: "from-blue-950/10 to-blue-900/5",
    purple: "from-purple-950/10 to-purple-900/5",
    green: "from-green-950/10 to-green-900/5",
    teal: "from-teal-950/10 to-teal-900/5",
    cyan: "from-cyan-950/10 to-cyan-900/5",
    red: "from-red-950/10 to-red-900/5",
    gray: "from-gray-950/10 to-gray-900/5"
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

  const [activeStep, setActiveStep] = useState<number | null>(null);
  
  // Provide default values and type safety
  const awsDataObj = awsData as { status: string; region: string } || { status: 'not_connected', region: 'ap-southeast-1' };
  const awsConnected = awsDataObj.status === 'connected';
  const awsRegion = awsDataObj.region || 'ap-southeast-1';
  
  const terraformStatusObj = terraformStatus as { status: string; provider: string; region: string } || 
    { status: 'not_applied', provider: 'AWS', region: awsRegion };
  const terraformApplied = terraformStatusObj.status === 'applied';

  const highlightStep = (step: number) => {
    return activeStep === step || activeStep === null;
  };

  const steps = [
    { 
      id: 1, 
      title: "Code & Container",
      description: "Store the application code in Git. Write a Dockerfile for containerization."
    },
    { 
      id: 2, 
      title: "CI Pipeline", 
      description: "Upon code pushes, automatically run tests. If tests pass, build a Docker image and push it to a registry."
    },
    { 
      id: 3, 
      title: "Infrastructure as Code", 
      description: "Provision your environment using Terraform. Create compute instances and networking resources."
    },
    { 
      id: 4, 
      title: "Deployment", 
      description: "Deploy the container to the cloud environment. Confirm the service is accessible."
    }
  ];

  return (
    <DashboardLayout title="DevOps Infrastructure Diagram">
      <div className="mb-6">
        <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 shadow-lg rounded-lg overflow-hidden border border-orange-500/20">
          <div className="px-6 py-5 sm:px-6 bg-gradient-to-r from-gray-800 via-gray-700 to-orange-600 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-bold text-white flex items-center gap-2">
                  <LuNetwork className="h-5 w-5" />
                  Week 4: End-to-End DevOps Infrastructure
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-200">
                  Visual representation of your DevOps pipeline and cloud deployment
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6 text-white relative">
            {/* Steps Filters */}
            <div className="mb-6 flex flex-wrap gap-2 justify-center">
              <button 
                className={`px-3 py-1.5 text-xs rounded-md font-medium transition-all
                  ${activeStep === null ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-200 hover:bg-gray-700'}`}
                onClick={() => setActiveStep(null)}
              >
                Show All Steps
              </button>
              
              {steps.map(step => (
                <button 
                  key={step.id}
                  className={`px-3 py-1.5 text-xs rounded-md font-medium transition-all flex items-center gap-1.5
                    ${activeStep === step.id ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-200 hover:bg-gray-700'}`}
                  onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
                >
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-700/50">
                    {step.id}
                  </span>
                  {step.title}
                </button>
              ))}
            </div>
            
            {/* Status indicator */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Badge className={awsConnected ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}>
                  {awsConnected ? "Connected to AWS" : "Using Demo Data"}
                </Badge>
                <span className="text-sm text-gray-300">Region: {awsRegion}</span>
                
                <Badge className={terraformApplied ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}>
                  {terraformApplied ? "Terraform Applied" : "Terraform Not Applied"}
                </Badge>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <LuInfo className="h-3.5 w-3.5" />
                <span>Click on a step to focus</span>
              </div>
            </div>
            
            {/* Infrastructure Diagram */}
            <div className="relative min-h-[700px] bg-gradient-to-br from-gray-900 to-gray-950 rounded-lg p-8 overflow-auto border border-gray-800">
              {/* DevOps Lifecycle Visualization */}
              
              {(highlightStep(1) || highlightStep(2)) && (
                <div className="flex justify-between items-center mb-8">
                  {/* Developer and Code Repository */}
                  <div className="flex flex-col items-center space-y-5">
                    <Resource 
                      icon={<LuUsers className="text-white" />} 
                      label="Developers" 
                      color="blue"
                      size="md"
                      status="success"
                      tooltip="Development Team"
                      className={`transition-opacity duration-300 ${highlightStep(1) ? 'opacity-100' : 'opacity-30'}`}
                    />
                    
                    <div className="h-8 w-0.5 bg-blue-500/70"></div>
                    
                    <div className="flex space-x-4 items-center">
                      <Resource 
                        icon={<LuCode className="text-white" />} 
                        label="Source Code" 
                        color="purple"
                        size="sm"
                        tooltip="Application source code"
                        className={`transition-opacity duration-300 ${highlightStep(1) ? 'opacity-100' : 'opacity-30'}`}
                      />
                      
                      <Resource 
                        icon={<SiDocker className="text-white" />} 
                        label="Dockerfile" 
                        color="cyan"
                        size="sm"
                        tooltip="Container definition"
                        className={`transition-opacity duration-300 ${highlightStep(1) ? 'opacity-100' : 'opacity-30'}`}
                      />
                    </div>
                    
                    <div className="h-8 w-0.5 bg-blue-500/70"></div>
                    
                    <Resource 
                      icon={<SiGit className="text-white" />} 
                      label="Git Repository" 
                      color="red"
                      size="md"
                      status="success"
                      tooltip="Code version control"
                      className={`transition-opacity duration-300 ${highlightStep(1) ? 'opacity-100' : 'opacity-30'}`}
                    />
                  </div>
                  
                  {/* CI Pipeline */}
                  <div className="flex flex-col items-center mx-8 max-w-xs">
                    <Resource 
                      icon={<SiGithubactions className="text-white" />} 
                      label="CI/CD Pipeline" 
                      color="purple"
                      size="lg"
                      status="success"
                      tooltip="Continuous Integration & Deployment"
                      className={`transition-opacity duration-300 ${highlightStep(2) ? 'opacity-100' : 'opacity-30'}`}
                    />
                    
                    <div className="mt-4 space-y-3 bg-gray-800/30 p-3 rounded-md border border-purple-500/20 w-full">
                      <div className={`flex items-center space-x-2 transition-opacity duration-300 ${highlightStep(2) ? 'opacity-100' : 'opacity-30'}`}>
                        <div className="w-6 h-6 rounded-full bg-blue-500/30 flex items-center justify-center text-xs">1</div>
                        <div className="text-xs">Run Tests</div>
                        <LuCheck className="ml-auto text-green-500" />
                      </div>
                      
                      <div className={`flex items-center space-x-2 transition-opacity duration-300 ${highlightStep(2) ? 'opacity-100' : 'opacity-30'}`}>
                        <div className="w-6 h-6 rounded-full bg-blue-500/30 flex items-center justify-center text-xs">2</div>
                        <div className="text-xs">Build Docker Image</div>
                        <LuCheck className="ml-auto text-green-500" />
                      </div>
                      
                      <div className={`flex items-center space-x-2 transition-opacity duration-300 ${highlightStep(2) ? 'opacity-100' : 'opacity-30'}`}>
                        <div className="w-6 h-6 rounded-full bg-blue-500/30 flex items-center justify-center text-xs">3</div>
                        <div className="text-xs">Push to Registry</div>
                        <LuCheck className="ml-auto text-green-500" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Docker Registry */}
                  <div className="flex flex-col items-center">
                    <Resource 
                      icon={<SiDocker className="text-white" />} 
                      label="Docker Registry" 
                      color="cyan"
                      status="success"
                      tooltip="Container image storage"
                      className={`transition-opacity duration-300 ${highlightStep(2) ? 'opacity-100' : 'opacity-30'}`}
                    />
                    
                    <div className="mt-4 w-40 bg-cyan-900/30 border border-cyan-500/20 rounded-md p-2">
                      <div className={`text-center text-xs font-medium mb-2 transition-opacity duration-300 ${highlightStep(2) ? 'opacity-100' : 'opacity-30'}`}>
                        Container Images
                      </div>
                      <div className={`flex flex-col space-y-1 transition-opacity duration-300 ${highlightStep(2) ? 'opacity-100' : 'opacity-30'}`}>
                        <div className="flex items-center justify-between text-xs">
                          <span>web-app:latest</span>
                          <Badge className="bg-green-900/80 text-green-400 text-[10px]">Ready</Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>web-app:v1.2</span>
                          <Badge className="bg-green-900/80 text-green-400 text-[10px]">Ready</Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>web-app:v1.1</span>
                          <Badge className="bg-blue-900/80 text-blue-400 text-[10px]">Archived</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
                            
              {/* Terraform and AWS Infrastructure */}
              {(highlightStep(3) || highlightStep(4)) && (
                <div className="relative mt-3">
                  {/* Terraform */}
                  <div className="flex justify-center mb-6">
                    <Resource 
                      icon={<SiTerraform className="text-white" />} 
                      label="Terraform IaC" 
                      color="purple"
                      status={terraformApplied ? "success" : "warning"}
                      tooltip="Infrastructure as Code"
                      className={`transition-opacity duration-300 ${highlightStep(3) ? 'opacity-100' : 'opacity-30'}`}
                    />
                  </div>
                  
                  <div className={`flex justify-center my-5 transition-opacity duration-300 ${highlightStep(3) ? 'opacity-100' : 'opacity-30'}`}>
                    <div className="h-8 w-0.5 bg-purple-500/70"></div>
                  </div>
              
                  {/* AWS Cloud Container */}
                  <Group 
                    title="AWS Cloud Infrastructure" 
                    color="orange"
                    className={`transition-opacity duration-300 ${highlightStep(3) || highlightStep(4) ? 'opacity-100' : 'opacity-30'}`}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <SiAmazon className="text-orange-500 h-6 w-6 mr-2" />
                        <span className="text-sm font-medium">Region: {awsRegion}</span>
                      </div>
                      <div className="flex items-center">
                        <Badge className={awsConnected ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}>
                          {awsConnected ? "Connected" : "Demo Mode"}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* VPC Container */}
                    <Group title="Virtual Private Cloud (VPC) - CIDR: 10.0.0.0/16" color="blue">
                      
                      {/* Internet Gateway */}
                      <div className="flex justify-center mb-6">
                        <Resource 
                          icon={<LuGlobe className="text-white" />} 
                          label="Internet Gateway" 
                          color="green"
                          size="md"
                          status="success"
                          tooltip="Internet Gateway for public access"
                          className={`transition-opacity duration-300 ${highlightStep(3) ? 'opacity-100' : 'opacity-30'}`}
                        />
                      </div>
                      
                      <div className={`flex justify-center mb-6 transition-opacity duration-300 ${highlightStep(3) ? 'opacity-100' : 'opacity-30'}`}>
                        <div className="h-8 w-0.5 bg-green-500/70"></div>
                      </div>
                      
                      {/* Load Balancer in Public Subnets */}
                      <div className="flex justify-center mb-6">
                        <Resource 
                          icon={<LuLayoutGrid className="text-white" />} 
                          label="Load Balancer (ALB)" 
                          color="green"
                          size="md"
                          status="success"
                          tooltip="Application Load Balancer on port 80"
                          className={`transition-opacity duration-300 ${highlightStep(4) ? 'opacity-100' : 'opacity-30'}`}
                        />
                      </div>
                      
                      <div className={`flex justify-center mb-6 transition-opacity duration-300 ${highlightStep(4) ? 'opacity-100' : 'opacity-30'}`}>
                        <div className="h-8 w-0.5 bg-green-500/70"></div>
                      </div>
                      
                      {/* Security Groups */}
                      <div className="flex flex-wrap gap-4 justify-center mb-6">
                        <div className="px-3 py-2 bg-red-800/30 border border-red-600/30 rounded-md">
                          <div className="flex items-center mb-1">
                            <LuShield className="text-red-400 h-4 w-4 mr-2" />
                            <span className="text-xs font-medium text-white">ALB Security Group</span>
                          </div>
                          <div className="text-[10px] text-gray-300">
                            <div>Ingress: Port 80 from 0.0.0.0/0</div>
                            <div>Egress: All traffic</div>
                          </div>
                        </div>
                        
                        <div className="px-3 py-2 bg-red-800/30 border border-red-600/30 rounded-md">
                          <div className="flex items-center mb-1">
                            <LuShield className="text-red-400 h-4 w-4 mr-2" />
                            <span className="text-xs font-medium text-white">App Security Group</span>
                          </div>
                          <div className="text-[10px] text-gray-300">
                            <div>Ingress: Port 5000 from ALB SG</div>
                            <div>Egress: All traffic</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Public Subnets */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <Group title="Public Subnet A (10.0.1.0/24)" color="green" className="relative">
                          <div className="absolute -top-3 -right-3 text-xs bg-blue-900/80 px-2 py-0.5 rounded-full border border-blue-500/30">
                            us-east-1a
                          </div>
                          <div className="p-4 bg-green-900/10 border border-green-500/20 rounded-md">
                            <div className="text-xs text-center text-gray-400 mb-2">Public Route Table (0.0.0.0/0 → IGW)</div>
                            
                            {/* Fargate in this subnet */}
                            <Resource 
                              icon={<LuCpu className="text-white" />} 
                              label="Fargate Task" 
                              color="blue"
                              size="sm"
                              status="success"
                              tooltip="ECS on Fargate (running in this subnet)"
                              className={`transition-opacity duration-300 ${highlightStep(3) ? 'opacity-100' : 'opacity-30'} mx-auto mb-2`}
                            />
                            
                            <div className="mt-2 px-2 py-1 bg-blue-800/30 border border-blue-600/30 rounded-md text-xs">
                              <div className="text-center mb-1 font-medium">ECS Service</div>
                              <div className="flex justify-between items-center text-[10px]">
                                <span>CPU:</span>
                                <span>256 units</span>
                              </div>
                              <div className="flex justify-between items-center text-[10px]">
                                <span>Memory:</span>
                                <span>512 MB</span>
                              </div>
                            </div>
                          </div>
                        </Group>
                        
                        <Group title="Public Subnet B (10.0.2.0/24)" color="green" className="relative">
                          <div className="absolute -top-3 -right-3 text-xs bg-blue-900/80 px-2 py-0.5 rounded-full border border-blue-500/30">
                            us-east-1b
                          </div>
                          <div className="p-4 bg-green-900/10 border border-green-500/20 rounded-md">
                            <div className="text-xs text-center text-gray-400 mb-2">Public Route Table (0.0.0.0/0 → IGW)</div>
                            
                            {/* Fargate in this subnet */}
                            <Resource 
                              icon={<LuCpu className="text-white" />} 
                              label="Fargate Task" 
                              color="blue"
                              size="sm"
                              status="success"
                              tooltip="ECS on Fargate (running in this subnet)"
                              className={`transition-opacity duration-300 ${highlightStep(3) ? 'opacity-100' : 'opacity-30'} mx-auto mb-2`}
                            />
                            
                            <div className="mt-2 px-2 py-1 bg-teal-800/30 border border-teal-600/30 rounded-md text-xs">
                              <div className="text-center mb-1 font-medium">Container Details</div>
                              <div className="flex justify-between items-center text-[10px]">
                                <span>Image:</span>
                                <span>draiimon/oaktree:latest</span>
                              </div>
                              <div className="flex justify-between items-center text-[10px]">
                                <span>Port:</span>
                                <span>5000</span>
                              </div>
                            </div>
                          </div>
                        </Group>
                      </div>
                      
                      {/* Database Layer */}
                      <div className="flex justify-center mb-6">
                        <Group title="Database Layer" color="orange" className="w-2/3">
                          <div className="p-4 bg-orange-900/10 border border-orange-500/20 rounded-md flex justify-center">
                            <Resource 
                              icon={<LuDatabase className="text-white" />} 
                              label="DynamoDB" 
                              color="orange"
                              size="sm"
                              status="success"
                              tooltip="NoSQL Database"
                              className={`transition-opacity duration-300 ${highlightStep(3) ? 'opacity-100' : 'opacity-30'}`}
                            />
                          </div>
                        </Group>
                      </div>
                      
                      {/* Monitoring Services */}
                      <div className="grid grid-cols-2 gap-4">
                        <Group title="Monitoring & Registry" color="gray">
                          <div className="grid grid-cols-2 gap-3">
                            <Resource 
                              icon={<LuMonitor className="text-white" />} 
                              label="CloudWatch" 
                              color="blue"
                              size="sm"
                              status="success"
                              tooltip="Monitoring & logs"
                              className={`transition-opacity duration-300 ${highlightStep(3) ? 'opacity-100' : 'opacity-30'}`}
                            />
                            <Resource 
                              icon={<SiDocker className="text-white" />} 
                              label="Docker Hub" 
                              color="cyan"
                              size="sm"
                              status="success"
                              tooltip="Docker container registry"
                              className={`transition-opacity duration-300 ${highlightStep(3) ? 'opacity-100' : 'opacity-30'}`}
                            />
                          </div>
                        </Group>
                        
                        <Group title="External Access" color="green">
                          <div className="flex items-center justify-center">
                            <Resource 
                              icon={<LuUsers className="text-white" />} 
                              label="End Users" 
                              color="green"
                              size="sm"
                              tooltip="Application users"
                              className={`transition-opacity duration-300 ${highlightStep(4) ? 'opacity-100' : 'opacity-30'}`}
                            />
                            
                            <div className="w-8 h-0.5 bg-green-500/70 mx-2"></div>
                            
                            <Resource 
                              icon={<LuGlobe className="text-white" />} 
                              label="Public URL" 
                              color="teal"
                              size="sm"
                              status="success"
                              tooltip="Public endpoint"
                              className={`transition-opacity duration-300 ${highlightStep(4) ? 'opacity-100' : 'opacity-30'}`}
                            />
                          </div>
                        </Group>
                      </div>
                    </Group>
                  </Group>
                </div>
              )}
            </div>
            
            {/* Project Requirements and Completion Status */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              {steps.map(step => (
                <div 
                  key={step.id}
                  className={`bg-gray-800/50 rounded-md p-4 border ${
                    step.id === 1 ? 'border-purple-500/30' : 
                    step.id === 2 ? 'border-cyan-500/30' : 
                    step.id === 3 ? 'border-orange-500/30' : 
                    'border-green-500/30'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2 ${
                      step.id === 1 ? 'bg-purple-500/50' : 
                      step.id === 2 ? 'bg-cyan-500/50' : 
                      step.id === 3 ? 'bg-orange-500/50' : 
                      'bg-green-500/50'
                    }`}>
                      {step.id}
                    </div>
                    <h4 className="text-sm font-medium text-white">{step.title}</h4>
                    <LuCheck className="ml-auto text-green-500" />
                  </div>
                  <p className="text-xs text-gray-300">{step.description}</p>
                </div>
              ))}
            </div>
            
            {/* Diagram Legend */}
            <div className="mt-6 bg-gray-800/50 rounded-md p-4 border border-gray-700/50">
              <h4 className="text-sm font-medium text-white mb-3">Legend</h4>
              <div className="grid grid-cols-4 gap-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded mr-2"></div>
                  <span className="text-xs text-gray-300">CI/CD Pipeline</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded mr-2"></div>
                  <span className="text-xs text-gray-300">Docker Container</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded mr-2"></div>
                  <span className="text-xs text-gray-300">AWS Services</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-green-600 rounded mr-2"></div>
                  <span className="text-xs text-gray-300">Public Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom CSS for dashed and animated lines */}
      <style>
        {`
        .dashed-line {
          background-image: linear-gradient(to right, currentColor 50%, transparent 50%);
          background-size: 8px 1px;
          background-repeat: repeat-x;
        }
        
        @keyframes flow {
          0% {
            background-position: 0px 0;
          }
          100% {
            background-position: 16px 0;
          }
        }
        
        .animated-line {
          animation: flow 1s linear infinite;
          background-image: linear-gradient(to right, currentColor 50%, transparent 50%);
          background-size: 8px 1px;
          background-repeat: repeat-x;
        }
        `}
      </style>
    </DashboardLayout>
  );
}