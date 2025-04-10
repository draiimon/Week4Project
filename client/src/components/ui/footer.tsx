import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-4 mt-auto bg-gradient-to-r from-orange-100 to-white border-t border-orange-300/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-2 md:mb-0">
            <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-orange-600 p-1 rounded-md shadow-sm">
              <svg
                className="h-5 w-5 text-white"
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
            <span className="font-medium text-gray-800">AWS DevOps Platform</span>
          </div>
          
          <div className="flex items-center justify-center">
            <span className="text-xs text-gray-500">
              Mark Andrei Castillo - Week 4 Project
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};