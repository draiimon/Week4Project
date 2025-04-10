import React, { useEffect, useState } from "react";
import Sidebar from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface DynamoDBUserData {
  username: string;
  email: string;
  createdAt: string;
}

interface DynamoDBTableData {
  tableName: string;
  name?: string; // For backward compatibility
  status: string;
  itemCount: number;
  items: DynamoDBUserData[];
  sizeBytes: number;
  region: string;
  lastUpdated?: string;
}

export default function DynamoDBPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tableData, setTableData] = useState<DynamoDBTableData>({
    tableName: "",
    status: "",
    itemCount: 0,
    items: [],
    sizeBytes: 0,
    region: ""
  });
  const [error, setError] = useState<string | null>(null);

  // Check if user is admin (mason_clx)
  useEffect(() => {
    if (user && user.username === 'msn_clx') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  useEffect(() => {
    // Fetch real AWS status and DynamoDB info
    async function fetchDynamoDBData() {
      try {
        // First get AWS connection status
        const statusResponse = await fetch('/api/aws/status');
        const statusData = await statusResponse.json();
        
        if (statusData.status !== 'connected') {
          setError("AWS DynamoDB is not connected. Please check your AWS credentials.");
          setIsLoading(false);
          return;
        }
        
        // If the user is admin, fetch actual user data from DynamoDB
        if (isAdmin) {
          try {
            const userDataResponse = await fetch('/api/dynamodb/users', {
              credentials: 'include', // Include cookies for session authentication
              headers: {
                'Content-Type': 'application/json'
              }
            });
            
            if (!userDataResponse.ok) {
              if (userDataResponse.status === 403) {
                toast({
                  title: "Admin access required",
                  description: "You need to be logged in as admin to view all users.",
                  variant: "destructive"
                });
              } else {
                const errorData = await userDataResponse.json();
                setError(errorData.error || "Error fetching user data");
              }
              
              // Still show basic table info even if user fetch fails
              setTableData({
                tableName: statusData.services.dynamodb.tableName || "OakTreeUsers",
                status: "Active",
                itemCount: 1, // Assume at least one user
                items: [],
                sizeBytes: 1024,
                region: statusData.region || "ap-southeast-1"
              });
            } else {
              // Successfully retrieved user data
              const userData = await userDataResponse.json();
              
              setTableData({
                tableName: userData.tableName,
                status: "Active",
                itemCount: userData.itemCount,
                items: userData.items || [],
                sizeBytes: userData.sizeBytes,
                region: userData.region || statusData.region,
                lastUpdated: userData.lastUpdated
              });
              
              toast({
                title: "Admin access granted",
                description: `Showing ${userData.itemCount} users from DynamoDB`,
                variant: "default"
              });
            }
          } catch (err) {
            console.error("Error fetching user data:", err);
            // Show error toast for better debugging
            toast({
              title: "Error fetching DynamoDB data",
              description: err instanceof Error ? err.message : "Unknown error occurred",
              variant: "destructive"
            });
            
            // Show basic table info on error
            setTableData({
              tableName: statusData.services.dynamodb.tableName || "OakTreeUsers",
              status: "Active",
              itemCount: 1,
              items: [],
              sizeBytes: 1024,
              region: statusData.region || "ap-southeast-1"
            });
          }
        } else {
          // Non-admin users just see table info without actual user data
          setTableData({
            tableName: statusData.services.dynamodb.tableName || "OakTreeUsers",
            status: "Active",
            itemCount: user ? 1 : 0, // At least 1 item if user is logged in
            items: [],
            sizeBytes: 1024, // 1KB baseline size
            region: statusData.region || "ap-southeast-1"
          });
        }
      } catch (err) {
        console.error("Error in DynamoDB page:", err);
        setError("Error fetching DynamoDB data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDynamoDBData();
  }, [user, isAdmin, toast]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top Navigation Bar with Orange-Gray Gradient */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-gradient-to-r from-gray-800 via-gray-700 to-orange-600 shadow-lg">
          <button
            type="button"
            className="md:hidden px-4 text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
          >
            <span className="sr-only">Open sidebar</span>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <p className="text-white self-center font-bold text-lg">AWS DynamoDB Manager</p>
            </div>
            {/* Display AWS Region instead of sign-in button */}
            <div className="ml-4 flex items-center md:ml-6">
              <div className="text-sm text-white bg-gray-800 bg-opacity-50 px-3 py-1 rounded-full">
                Connected to AWS Region: {tableData.region}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-100">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-orange-600 rounded-lg shadow-lg px-6 py-4">
                <h1 className="text-2xl font-bold text-white">
                  DynamoDB Tables
                </h1>
                <p className="mt-1 text-sm text-gray-200">
                  View and manage your DynamoDB tables in {tableData.region || "ap-southeast-1"} region
                </p>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
              {isLoading ? (
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg rounded-lg p-8 text-center">
                  <p className="text-gray-300">Loading DynamoDB tables...</p>
                </div>
              ) : error ? (
                <div className="bg-red-900 border border-red-700 text-white rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-200">Error</h3>
                      <div className="mt-2 text-sm text-red-100">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 shadow-lg rounded-lg overflow-hidden border border-orange-500/20">
                  <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-gray-800 via-gray-700 to-orange-600 border-b border-gray-700">
                    <h3 className="text-lg leading-6 font-bold text-white">
                      DynamoDB Tables in {tableData.region || "ap-southeast-1"}
                    </h3>
                  </div>
                  <div className="bg-gray-900 bg-opacity-90 p-6 text-white">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-gradient-to-r from-gray-800 to-gray-900">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-orange-400 uppercase tracking-wider">
                            Table Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-orange-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-orange-400 uppercase tracking-wider">
                            Items
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-orange-400 uppercase tracking-wider">
                            Size
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-orange-400 uppercase tracking-wider">
                            Region
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-gray-800 divide-y divide-gray-700">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <svg className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3zm0 5h16" />
                                </svg>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-white">
                                  {tableData.tableName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-600 text-white">
                              {tableData.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {tableData.itemCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {(tableData.sizeBytes / 1024).toFixed(2)} KB
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {tableData.region}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    
                    <div className="mt-6 border-t border-gray-700 pt-4">
                      <h4 className="text-base font-medium text-orange-400 mb-2">Table Schema</h4>
                      <div className="bg-gray-800 bg-opacity-50 p-4 rounded-md border border-gray-700">
                        <pre className="text-xs text-gray-300 whitespace-pre-wrap">
{`Table: UsersTable
Primary Key: username (String)
Attributes:
- username (String) - Partition Key
- password (String)
- email (String)
- createdAt (Number) - Unix timestamp

Provisioned Throughput:
- Read Capacity Units: 5
- Write Capacity Units: 5

Table Status: ${tableData.status}
Created: ${new Date().toLocaleDateString()}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 shadow-lg rounded-lg overflow-hidden border border-orange-500/20">
                <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-gray-800 via-gray-700 to-orange-600 border-b border-gray-700">
                  <h3 className="text-lg leading-6 font-bold text-white">
                    DynamoDB Performance Metrics
                  </h3>
                </div>
                <div className="bg-gray-900 bg-opacity-90 p-6 text-white">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                      <h4 className="text-sm font-medium text-orange-400 mb-2">Read Capacity</h4>
                      <div className="flex items-center">
                        <div className="h-2 w-full bg-gray-700 rounded-full">
                          <div className="h-2 bg-orange-600 rounded-full" style={{ width: "20%" }}></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-300">20%</span>
                      </div>
                      <p className="mt-1 text-xs text-gray-400">5 RCU provisioned, 1 RCU consumed</p>
                    </div>
                    
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                      <h4 className="text-sm font-medium text-orange-400 mb-2">Write Capacity</h4>
                      <div className="flex items-center">
                        <div className="h-2 w-full bg-gray-700 rounded-full">
                          <div className="h-2 bg-orange-600 rounded-full" style={{ width: "10%" }}></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-300">10%</span>
                      </div>
                      <p className="mt-1 text-xs text-gray-400">5 WCU provisioned, 0.5 WCU consumed</p>
                    </div>
                    
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                      <h4 className="text-sm font-medium text-orange-400 mb-2">Latency</h4>
                      <div className="flex items-center">
                        <div className="h-2 w-full bg-gray-700 rounded-full">
                          <div className="h-2 bg-orange-600 rounded-full" style={{ width: "5%" }}></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-300">5%</span>
                      </div>
                      <p className="mt-1 text-xs text-gray-400">2.5ms average response time</p>
                    </div>
                  </div>
                  
                  {/* User Data Display for Admin */}
                  {isAdmin && tableData.items && tableData.items.length > 0 && (
                    <div className="mt-6 border-t border-gray-700 pt-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-base font-medium text-orange-400">
                          User Data (Admin View)
                        </h4>
                        <span className="bg-orange-600 px-2 py-0.5 rounded-full text-xs text-white">
                          {tableData.items.length} Users
                        </span>
                      </div>
                      
                      <div className="bg-gray-800 rounded-md overflow-hidden border border-gray-700">
                        <table className="min-w-full divide-y divide-gray-700">
                          <thead className="bg-gradient-to-r from-gray-800 to-gray-900">
                            <tr>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-orange-400 uppercase tracking-wider">
                                Username
                              </th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-orange-400 uppercase tracking-wider">
                                Email
                              </th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-orange-400 uppercase tracking-wider">
                                Created At
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-700">
                            {tableData.items.map((user, index) => (
                              <tr key={index} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-850'}>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">
                                  {user.username}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                                  {user.email}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                                  {new Date(user.createdAt).toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="mt-2 text-xs text-orange-300">
                        <span className="inline-flex items-center">
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Real user data from DynamoDB table. Last updated: {tableData.lastUpdated ? new Date(tableData.lastUpdated).toLocaleTimeString() : 'Unknown'}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-gray-800 to-gray-900 border border-orange-500/20 rounded-md">
                    <h4 className="text-sm font-medium text-orange-400 mb-2">
                      DynamoDB Connection Details
                    </h4>
                    <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1">
                      <li>AWS Region: {tableData.region || "ap-southeast-1"}</li>
                      <li>Endpoint: dynamodb.{tableData.region || "ap-southeast-1"}.amazonaws.com</li>
                      <li>Authentication: IAM Role/User with DynamoDB permissions</li>
                      <li>Connection Status: Active</li>
                      <li>Last Refreshed: {new Date().toLocaleTimeString()}</li>
                    </ul>
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