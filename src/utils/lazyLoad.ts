import dynamic from "next/dynamic";
import React from "react";

export const lazyLoadComponent = (
  importFunc: () => Promise<any>,
  options = {}
) => {
  return dynamic(importFunc, {
    loading: () =>
      React.createElement("div", {
        className: "animate-pulse h-full w-full bg-muted/20 rounded",
      }),
    ssr: true,
    ...options,
  });
};
