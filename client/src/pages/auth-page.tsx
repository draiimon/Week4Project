import React, { useState } from "react";
import { LoginForm, RegisterForm } from "@/components/ui/auth-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";

export default function AuthPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("login");

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-orange-600 p-3 rounded-full shadow-lg">
            <svg
              className="h-14 w-14 text-white"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L3 7L12 12L21 7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 17L12 22L21 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 12L12 17L21 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">AWS DevOps Platform</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          The complete solution for AWS DevOps workflow management
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-5xl">
        <div className="flex flex-col lg:flex-row bg-white py-8 px-4 shadow-lg border border-orange-500/20 sm:rounded-lg sm:px-10">
          {/* Left side - Auth forms */}
          <div className="flex-1 lg:pr-8 lg:border-r border-gray-700">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-gradient-to-r from-gray-700 to-gray-800">
                <TabsTrigger value="login" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-orange-500 data-[state=active]:text-white">Sign In</TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-orange-500 data-[state=active]:text-white">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <Card className="bg-white border border-orange-500/20">
                  <CardHeader className="bg-gradient-to-r from-gray-800 via-gray-700 to-orange-600 rounded-t-lg">
                    <CardTitle className="text-white">Sign in to your account</CardTitle>
                    <CardDescription className="text-gray-200">
                      Enter your credentials to access your dashboard
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-4">
                    <LoginForm />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="register">
                <Card className="bg-white border border-orange-500/20">
                  <CardHeader className="bg-gradient-to-r from-gray-800 via-gray-700 to-orange-600 rounded-t-lg">
                    <CardTitle className="text-white">Create a new account</CardTitle>
                    <CardDescription className="text-gray-200">
                      Register to get started with AWS DevOps Platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-4">
                    <RegisterForm onComplete={() => setActiveTab("login")} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right side - Feature Overview */}
          <div className="flex-1 mt-8 lg:mt-0 lg:pl-8">
            <div className="text-center lg:text-left">
              <h3 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">Your AWS DevOps solution</h3>
              <p className="mt-2 text-sm text-gray-600">
                Manage your complete AWS DevOps workflow from a single platform
              </p>
            </div>

            <div className="mt-8">
              <ul className="space-y-6">
                <li className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-gradient-to-r from-gray-700 to-orange-600 text-white shadow-lg">
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-orange-600">Linux & Container Management</h4>
                    <p className="mt-2 text-base text-gray-600">
                      Manage Linux environments and Docker containers from a unified interface.
                    </p>
                  </div>
                </li>

                <li className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-gradient-to-r from-gray-700 to-orange-600 text-white shadow-lg">
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-orange-600">Automated CI/CD Pipelines</h4>
                    <p className="mt-2 text-base text-gray-600">
                      Build, test, and deploy your applications automatically with our integrated CI/CD tools.
                    </p>
                  </div>
                </li>

                <li className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-gradient-to-r from-gray-700 to-orange-600 text-white shadow-lg">
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-orange-600">AWS Integration & IaC</h4>
                    <p className="mt-2 text-base text-gray-600">
                      Full AWS infrastructure integration with Infrastructure as Code to provision your resources.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
