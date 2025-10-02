"use client";

/**
 * UILoadingGuard - Production-ready component
 * No loading screens or debug messages for production
 */
export default function UILoadingGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  // In production, immediately render children without any loading state
  return <>{children}</>;
}
