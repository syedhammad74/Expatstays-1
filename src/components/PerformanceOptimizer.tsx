"use client";

import { useEffect } from "react";

/**
 * Performance Optimizer Component
 * Optimizes LCP and Speed Index metrics
 */
export default function PerformanceOptimizer() {
  useEffect(() => {
    // LCP optimization - mark when LCP is loaded
    const markLCPLoaded = () => {
      if (typeof window !== "undefined") {
        document.documentElement.classList.add("lcp-loaded");

        // Remove loading state
        document.documentElement.classList.remove("lcp-loading");

        // Performance hint for Speed Index
        if ("requestIdleCallback" in window) {
          requestIdleCallback(() => {
            document.documentElement.classList.add("si-optimized");
          });
        }
      }
    };

    // Speed Index optimization - removed duplicate preloading (already in layout.tsx)
    const optimizeSpeedIndex = () => {
      if (typeof window !== "undefined") {
        // Mark above-the-fold content as optimized
        document.documentElement.classList.add("above-fold-optimized");
      }
    };

    // Optimize critical rendering path
    const optimizeCriticalPath = () => {
      if (typeof window !== "undefined") {
        // Add performance hints for critical elements
        const criticalElements = document.querySelectorAll(
          ".hero-carousel, .btn, .badge"
        );
        criticalElements.forEach((el) => {
          el.classList.add("performance-hint");
        });

        // Optimize carousel for LCP
        const carousel = document.querySelector(".hero-carousel");
        if (carousel) {
          carousel.classList.add("lcp-element");
        }
      }
    };

    // Run optimizations
    markLCPLoaded();
    optimizeSpeedIndex();
    optimizeCriticalPath();

    // Performance monitoring
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "largest-contentful-paint") {
            markLCPLoaded();
          }
        }
      });

      observer.observe({
        entryTypes: ["largest-contentful-paint", "first-contentful-paint"],
      });

      return () => observer.disconnect();
    }
  }, []);

  return null; // This component doesn't render anything
}
