import React, { useState, useEffect } from 'react';

export const Footer: React.FC = () => {
  const [showFooter, setShowFooter] = useState(false);
  
  // Track scroll position to show footer only when at bottom
  useEffect(() => {
    const handleScroll = () => {
      // Calculate if we're at the bottom of the page (with a small margin of error)
      const isAtBottom = 
        window.innerHeight + window.scrollY >= 
        document.documentElement.scrollHeight - 100;
      
      setShowFooter(isAtBottom);
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();
    
    // Clean up
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Render the footer only if we should show it
  if (!showFooter) return null;
  
  return (
    <footer className="w-full py-2 bg-gradient-to-r from-orange-100 to-white border-t border-orange-300/30 sticky bottom-0 transition-opacity duration-300">
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