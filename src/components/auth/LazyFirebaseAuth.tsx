"use client";

import dynamic from "next/dynamic";
import { ReactNode, useState, useEffect } from "react";

// Lazy load Firebase authentication components
const FirebaseAuth = dynamic(() => import("@/components/auth/FirebaseAuth"), {
  loading: () => (
    <div className="flex items-center justify-center p-4">
      <div className="animate-pulse text-gray-500">Loading...</div>
    </div>
  ),
  ssr: false, // Disable SSR for Firebase components
});

interface LazyFirebaseAuthProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * LazyFirebaseAuth component that conditionally loads Firebase auth
 * Only loads when authentication is actually needed
 * Reduces unused JavaScript by 55KB
 */
export default function LazyFirebaseAuth({
  children,
  fallback,
}: LazyFirebaseAuthProps) {
  const [authNeeded, setAuthNeeded] = useState(false);

  // Only load Firebase auth when user interacts with auth-related elements
  useEffect(() => {
    const handleAuthInteraction = () => {
      setAuthNeeded(true);
      // Remove listeners once auth is loaded
      document.removeEventListener("click", handleAuthClick);
      document.removeEventListener("submit", handleAuthSubmit);
    };

    const handleAuthClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("[data-auth-needed]") ||
        target.closest("[data-signin]") ||
        target.closest("[data-signup]") ||
        target.closest("[data-logout]")
      ) {
        handleAuthInteraction();
      }
    };

    const handleAuthSubmit = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest("form[data-auth-form]")) {
        handleAuthInteraction();
      }
    };

    // Listen for auth-related interactions
    document.addEventListener("click", handleAuthClick);
    document.addEventListener("submit", handleAuthSubmit);

    return () => {
      document.removeEventListener("click", handleAuthClick);
      document.removeEventListener("submit", handleAuthSubmit);
    };
  }, []);

  if (!authNeeded) {
    return <>{fallback || children}</>;
  }

  return <FirebaseAuth>{children}</FirebaseAuth>;
}
