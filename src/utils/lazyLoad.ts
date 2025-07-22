import dynamic from "next/dynamic";
import React from "react";

export const lazyLoadComponent = (
  importFunc: () => Promise<any>,
  options = {}
) => {
  return dynamic(importFunc, {
    loading: () => (
      <div className="animate-pulse h-full w-full bg-muted/20 rounded-components"></div>
    ),
    ssr: true,
    ...options,
  });
};
