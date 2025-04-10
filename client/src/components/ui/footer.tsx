import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-auto w-full">
      <div className="bg-gradient-to-r from-orange-300 to-white px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-orange-800 text-xs font-medium">
            © 2025 DevOps Dashboard
          </div>
          <div className="text-orange-700 text-xs">
            <span>Created by Mark Andrei Castillo</span>
          </div>
        </div>
      </div>
    </footer>
  );
}