// src/mocks/next-document-shim.tsx
import React from "react";

export function Html({ children }: { children: React.ReactNode }) {
  // simply render children as-is
  return <>{children}</>;
}
export function Head({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
export function Main() {
  return null;
}
export function NextScript() {
  return null;
}
