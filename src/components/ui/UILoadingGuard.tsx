"use client";

import { useEffect, useState } from "react";

/**
 * UILoadingGuard component ensures UI loads properly
 * Handles font loading and style application gracefully
 */
export default function UILoadingGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if fonts are loaded and styles are applied
    const checkUIReadiness = () => {
      // Check if primary font is loaded
      if (document.fonts) {
        document.fonts.ready.then(() => {
          setTimeout(() => setIsLoaded(true), 100); // Small delay for style application
        });
      } else {
        // Fallback for browsers without font loading API
        setTimeout(() => setIsLoaded(true), 500);
      }
    };

    // Immediate check
    checkUIReadiness();

    // Additional check after stylesheet loading
    const checkStylesheets = () => {
      const stylesheets = document.styleSheets;
      let loadedCount = 0;

      for (let i = 0; i < stylesheets.length; i++) {
        try {
          // Try to access rules - will throw if not loaded
          stylesheets[i].cssRules;
          loadedCount++;
        } catch (e) {
          // Stylesheet not yet loaded
        }
      }

      // If we have loaded stylesheets, proceed
      if (loadedCount > 0) {
        setIsLoaded(true);
      } else {
        // Fallback timeout
        setTimeout(() => setIsLoaded(true), 1000);
      }
    };

    setTimeout(checkStylesheets, 200);
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
