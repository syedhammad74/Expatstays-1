"use client";

import { useEffect, useState } from "react";

/**
 * UILoadingGuard - Simplified version to troubleshoot loading issues
 */
export default function UILoadingGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log("🔄 UILoadingGuard starting...");

    // Simplified loading check - just wait a short time
    const timer = setTimeout(() => {
      console.log("✅ UILoadingGuard ready");
      setIsLoaded(true);
    }, 100); // Very short delay

    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading UI...</p>
          <p className="text-gray-500 text-sm mt-2">Checking components...</p>
        </div>
      </div>
    );
  }

  console.log("🎯 UILoadingGuard rendering children");
  return <>{children}</>;
}
