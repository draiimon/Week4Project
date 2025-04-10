import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-3 mt-auto bg-gradient-to-r from-orange-100 to-white border-t border-orange-300/30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-800">AWS DevOps Platform</span>
          <span className="text-xs text-gray-500">
            Mark Andrei Castillo - Week 4 Project
          </span>
        </div>
      </div>
    </footer>
  );
};