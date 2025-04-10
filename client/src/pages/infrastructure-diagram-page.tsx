import React, { useEffect, useState, useRef } from "react";
import Sidebar from "@/components/ui/sidebar";
import { getQueryFn } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { 
  Cloud, 
  Database, 
  Server, 
  ShieldCheck, 
  Network, 
  HardDrive, 
  Users, 
  Gauge,
  Globe,
  Lock,
  ArrowRight,
  Layers
} from "lucide-react";

// Icons for different AWS services
const AwsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z"></path>
  </svg>
);

const DockerIcon = () => (
  <svg viewBox="0 0 640 512" fill="currentColor" className="w-5 h-5">
    <path d="M349.9 236.3h-66.1v-59.4h66.1v59.4zm0-204.3h-66.1v60.7h66.1V32zm78.2 144.8H362v59.4h66.1v-59.4zm-156.3-72.1h-66.1v60.1h66.1v-60.1zm78.1 0h-66.1v60.1h66.1v-60.1zm276.8 100c-14.4-9.7-47.6-13.2-73.1-8.4-3.3-24-16.7-44.9-41.1-63.7l-14-9.3-9.3 14c-18.4 27.8-23.4 73.6-3.7 103.8-8.7 4.7-25.8 11.1-48.4 10.7H2.4c-8.7 50.8 5.8 116.8 44 162.1 37.1 43.9 92.7 66.2 165.4 66.2 157.4 0 273.9-72.5 328.4-204.2 21.4.4 67.6.1 91.3-45.2 1.5-2.5 6.6-13.2 8.5-17.1l-13.3-8.9zm-511.1-27.9h-66v59.4h66.1v-59.4zm78.1 0h-66.1v59.4h66.1v-59.4zm78.1 0h-66.1v59.4h66.1v-59.4zm-78.1-72.1h-66.1v60.1h66.1v-60.1z"/>
  </svg>
);

const LoadBalancerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
  </svg>
);

const VpcIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2z"></path>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20v-1.5c0-.8.7-1.5 1.5-1.5h7c.8 0 1.5.7 1.5 1.5V20"></path>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 8h4m-2-3v3"></path>
  </svg>
);

const SubnetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2"></rect>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9h18M3 15h18M9 3v18M15 3v18"></path>
  </svg>
);

const EC2Icon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8">
    <rect x="2" y="2" width="20" height="20" rx="2" ry="2" strokeWidth="2" fill="#f97316"></rect>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12M6 12h12" stroke="white"></path>
  </svg>
);

const NetworkAclIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
    <circle cx="12" cy="12" r="10" strokeWidth="2" fill="#a78bfa"></circle>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v8M8 12h8" stroke="white"></path>
  </svg>
);

// Interfaces for infrastructure components
interface AvailabilityZone {
  id: string;
  name: string;
  publicSubnets: Subnet[];
  privateSubnets: Subnet[];
}

interface Subnet {
  id: string;
  cidr: string;
  instances: Instance[];
}

interface Instance {
  id: string;
  type: string;
  name: string;
  icon: React.ReactNode;
}

interface InfrastructureData {
  vpc: {
    id: string;
    cidr: string;
    region: string;
  };
  availabilityZones: AvailabilityZone[];
  loadBalancer: {
    id: string;
    name: string;
  };
  securityGroups: string[];
  users: number;
  externalServices: {
    name: string;
    icon: React.ReactNode;
  }[];
}

export default function InfrastructureDiagramPage() {
  const diagramRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // API query would go here in a real app
  const { data: infrastructureData, isLoading } = useQuery({
    queryKey: ['/api/infrastructure'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  
  // Default data structure based on the image
  const defaultInfrastructureData: InfrastructureData = {
    vpc: {
      id: 'vpc-0123456789',
      cidr: '10.0.0.0/16',
      region: 'ap-southeast-1'
    },
    availabilityZones: [
      {
        id: 'az-1',
        name: 'Availability Zone 1',
        publicSubnets: [
          {
            id: 'subnet-pub-1',
            cidr: '10.0.1.0/24',
            instances: [
              {
                id: 'ec2-web-1',
                type: 'EC2',
                name: 'Web Server 1',
                icon: <EC2Icon />
              },
              {
                id: 'nacl-1',
                type: 'NACL',
                name: 'Network ACL',
                icon: <NetworkAclIcon />
              }
            ]
          }
        ],
        privateSubnets: [
          {
            id: 'subnet-priv-1',
            cidr: '10.0.3.0/24',
            instances: [
              {
                id: 'ec2-db-1',
                type: 'EC2',
                name: 'Database Server 1',
                icon: <EC2Icon />
              }
            ]
          }
        ]
      },
      {
        id: 'az-2',
        name: 'Availability Zone 2',
        publicSubnets: [
          {
            id: 'subnet-pub-2',
            cidr: '10.0.2.0/24',
            instances: [
              {
                id: 'ec2-web-2',
                type: 'EC2',
                name: 'Web Server 2',
                icon: <EC2Icon />
              },
              {
                id: 'nacl-2',
                type: 'NACL',
                name: 'Network ACL',
                icon: <NetworkAclIcon />
              }
            ]
          }
        ],
        privateSubnets: [
          {
            id: 'subnet-priv-2',
            cidr: '10.0.4.0/24',
            instances: [
              {
                id: 'ec2-db-2',
                type: 'EC2',
                name: 'Database Server 2',
                icon: <EC2Icon />
              }
            ]
          }
        ]
      }
    ],
    loadBalancer: {
      id: 'alb-1',
      name: 'Application Load Balancer'
    },
    securityGroups: ['sg-web', 'sg-db'],
    users: 120,
    externalServices: [
      {
        name: 'Docker',
        icon: <DockerIcon />
      }
    ]
  };
  
  const data = infrastructureData || defaultInfrastructureData;
  
  // Zoom in/out functions
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 1.5));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };
  
  const handleZoomReset = () => {
    setZoomLevel(1);
  };
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top Navigation Bar */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-gradient-to-r from-gray-800 via-gray-700 to-orange-600 shadow-lg">
          <div className="flex-1 px-4 flex justify-between items-center">
            <div className="flex-1 flex items-center">
              <Globe className="h-6 w-6 text-white mr-2" />
              <p className="text-white font-bold text-lg">AWS Infrastructure Diagram</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleZoomOut}
                  className="bg-gray-800 text-white p-1 rounded-md hover:bg-gray-700"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                  </svg>
                </button>
                
                <span className="text-white text-sm">{Math.round(zoomLevel * 100)}%</span>
                
                <button 
                  onClick={handleZoomIn}
                  className="bg-gray-800 text-white p-1 rounded-md hover:bg-gray-700"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16M4 12h16" />
                  </svg>
                </button>
                
                <button 
                  onClick={handleZoomReset}
                  className="bg-gray-800 text-white p-1 rounded-md hover:bg-gray-700 text-xs px-2"
                >
                  Reset
                </button>
              </div>
              
              <div className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm">
                Region: {data.vpc.region}
              </div>
            </div>
          </div>
        </div>
        
        <main className="flex-1 relative overflow-auto focus:outline-none bg-gray-900">
          <div className="py-6 px-4">
            {/* Infrastructure Diagram */}
            <div 
              ref={diagramRef}
              className="bg-gray-800 rounded-lg p-4 relative overflow-auto"
              style={{ 
                minHeight: "75vh",
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top left',
                transition: 'transform 0.2s ease'
              }}
            >
              {/* AWS Cloud Border */}
              <div className="border-2 border-gray-500 border-dashed rounded-lg p-4 relative">
                <div className="absolute top-2 left-4 flex items-center bg-gray-800 px-2 z-10">
                  <AwsIcon />
                  <span className="ml-2 text-white font-medium">AWS Cloud</span>
                </div>
                
                <div className="mt-4">
                  {/* Region Container */}
                  <div className="border-2 border-teal-600 border-dashed rounded-lg p-4 mt-4 relative">
                    <div className="absolute top-0 left-4 transform -translate-y-1/2 bg-gray-800 px-2 flex items-center text-teal-500">
                      <Globe className="w-4 h-4 mr-1" />
                      <span>Region</span>
                    </div>
                    
                    {/* VPC Container */}
                    <div className="border-2 border-purple-600 rounded-lg p-4 mt-8 relative">
                      <div className="absolute top-0 left-4 transform -translate-y-1/2 bg-gray-800 px-2 flex items-center text-purple-500">
                        <VpcIcon />
                        <span className="ml-1">VPC</span>
                      </div>
                      
                      {/* Users icon outside the VPC boundary but inside AWS */}
                      <div className="absolute top-4 right-8 flex flex-col items-center">
                        <Users className="h-12 w-12 text-gray-300" />
                        <div className="mt-1 text-gray-300 text-xs">Users</div>
                      </div>
                      
                      {/* Load Balancer in the middle */}
                      <div className="flex justify-center mb-8 relative">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 rounded-md flex items-center justify-center bg-blue-500">
                            <LoadBalancerIcon />
                          </div>
                          <div className="mt-1 text-gray-300 text-xs text-center">Application Load Balancer</div>
                          
                          {/* Security group label */}
                          <div className="mt-2 px-3 py-1 border border-gray-600 rounded-md text-xs text-gray-300">
                            Security group
                          </div>
                        </div>
                        
                        {/* Connection lines to/from Load Balancer */}
                        <div className="absolute h-16 w-0.5 bg-gray-600 left-1/2 transform -translate-x-1/2 top-16"></div>
                      </div>
                      
                      {/* Grid for Availability Zones */}
                      <div className="grid grid-cols-2 gap-4">
                        {data.availabilityZones.map((az, index) => (
                          <div key={az.id} className="border-2 border-gray-600 border-dashed rounded-lg p-4 relative">
                            <div className="absolute top-0 left-4 transform -translate-y-1/2 bg-gray-800 px-2 text-gray-300 text-sm">
                              Availability Zone {index + 1}
                            </div>
                            
                            {/* Public Subnet */}
                            <div className="mb-4">
                              {az.publicSubnets.map(subnet => (
                                <div key={subnet.id} className="bg-green-900 bg-opacity-20 p-4 rounded-lg relative">
                                  <div className="absolute top-0 left-4 transform -translate-y-1/2 bg-gray-800 px-2 flex items-center">
                                    <SubnetIcon />
                                    <span className="ml-1 text-green-500 text-xs">Public subnet</span>
                                  </div>
                                  
                                  <div className="flex justify-around items-center mt-4">
                                    {subnet.instances.map(instance => (
                                      <div key={instance.id} className="flex flex-col items-center">
                                        {instance.icon}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            {/* Private Subnet */}
                            <div>
                              {az.privateSubnets.map(subnet => (
                                <div key={subnet.id} className="bg-teal-900 bg-opacity-20 p-4 rounded-lg relative">
                                  <div className="absolute top-0 left-4 transform -translate-y-1/2 bg-gray-800 px-2 flex items-center">
                                    <Lock />
                                    <span className="ml-1 text-teal-500 text-xs">Private subnet</span>
                                  </div>
                                  
                                  <div className="flex justify-around items-center mt-4">
                                    {subnet.instances.map(instance => (
                                      <div key={instance.id} className="flex flex-col items-center">
                                        {instance.icon}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* External Service (Docker) */}
                <div className="absolute left-16 top-16">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-md flex items-center justify-center bg-blue-600">
                      <DockerIcon />
                    </div>
                    <div className="mt-1 text-gray-300 text-xs">docker</div>
                  </div>
                  
                  {/* Arrow from Docker to AWS */}
                  <div className="absolute w-16 h-0.5 bg-gray-600 top-6 left-12">
                    <div className="absolute right-0 top-0 transform translate-x-1 -translate-y-1">
                      <ArrowRight className="h-3 w-3 text-gray-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Legend and Info Panel */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Legend */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3 flex items-center">
                  <Layers className="mr-2 h-5 w-5 text-orange-500" />
                  Infrastructure Legend
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center bg-purple-600 mr-2">
                      <VpcIcon />
                    </div>
                    <span className="text-white text-sm">VPC</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center bg-blue-600 mr-2">
                      <LoadBalancerIcon />
                    </div>
                    <span className="text-white text-sm">Load Balancer</span>
                  </div>
                  
                  <div className="flex items-center">
                    <SubnetIcon className="text-green-500 mr-2" />
                    <span className="text-white text-sm">Public Subnet</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Lock className="text-teal-500 mr-2" />
                    <span className="text-white text-sm">Private Subnet</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center bg-orange-500 mr-2">
                      <Server className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white text-sm">EC2 Instance</span>
                  </div>
                  
                  <div className="flex items-center">
                    <ShieldCheck className="text-gray-300 mr-2" />
                    <span className="text-white text-sm">Security Group</span>
                  </div>
                </div>
              </div>
              
              {/* VPC Info */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3 flex items-center">
                  <Network className="mr-2 h-5 w-5 text-orange-500" />
                  VPC Information
                </h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">VPC ID:</span>
                    <span className="text-white text-sm">{data.vpc.id}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">CIDR Block:</span>
                    <span className="text-white text-sm">{data.vpc.cidr}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Region:</span>
                    <span className="text-white text-sm">{data.vpc.region}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Availability Zones:</span>
                    <span className="text-white text-sm">{data.availabilityZones.length}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Subnets:</span>
                    <span className="text-white text-sm">
                      {data.availabilityZones.reduce(
                        (total, az) => total + az.publicSubnets.length + az.privateSubnets.length, 
                        0
                      )}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Status Panel */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3 flex items-center">
                  <Gauge className="mr-2 h-5 w-5 text-orange-500" />
                  System Status
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400 text-sm">EC2 Instances:</span>
                      <span className="text-green-500 text-sm">Running</span>
                    </div>
                    <div className="w-full bg-gray-700 h-1.5 rounded-full">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "100%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400 text-sm">Load Balancer:</span>
                      <span className="text-green-500 text-sm">Active</span>
                    </div>
                    <div className="w-full bg-gray-700 h-1.5 rounded-full">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "100%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400 text-sm">Network Connectivity:</span>
                      <span className="text-green-500 text-sm">Optimal</span>
                    </div>
                    <div className="w-full bg-gray-700 h-1.5 rounded-full">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "95%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400 text-sm">Security Status:</span>
                      <span className="text-green-500 text-sm">Secure</span>
                    </div>
                    <div className="w-full bg-gray-700 h-1.5 rounded-full">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "100%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}