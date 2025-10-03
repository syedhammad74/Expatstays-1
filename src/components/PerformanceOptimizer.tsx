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

    // Speed Index optimization - preload critical resources
    const optimizeSpeedIndex = () => {
      if (typeof window !== "undefined") {
        // Preload critical images that might be visible
        const criticalImages = [
          "/media/DSC01806 HDR June 25 2025/DSC01822-HDR.jpg",
          "/media/DSC01806 HDR June 25 2025/DSC01919-HDR.jpg",
          "/media/DSC01806 HDR June 25 2025/DSC01914-HDR.jpg",
        ];

        criticalImages.forEach((src) => {
          const link = document.createElement("link");
          link.rel = "preload";
          link.as = "image";
          link.href = src;
          link.fetchPriority = "high";
          document.head.appendChild(link);
        });

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
            console.log("LCP:", entry.startTime);
            markLCPLoaded();
          }

          if (entry.entryType === "first-contentful-paint") {
            console.log("FCP:", entry.startTime);
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
