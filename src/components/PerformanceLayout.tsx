"use client";

import React, { ReactNode, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";

interface PerformanceLayoutProps {
  children: ReactNode;
  preloadRoutes?: string[];
  criticalCSS?: string;
}

// Performance constants for optimization
const PERFORMANCE_CONFIG = {
  CRITICAL_IMAGES: [
    "/logo.png",
    "/media/famhouse/DSC02226.jpg",
    "/media/blogs-appartments/EX-1.JPG",
  ],
  DNS_PREFETCH_DOMAINS: [
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com",
    "https://firebasestorage.googleapis.com",
  ],
  FONT_URL:
    "https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap",
} as const;

export default function PerformanceLayout({
  children,
  preloadRoutes = [],
  criticalCSS,
}: PerformanceLayoutProps) {
  const router = useRouter();

  // Memoize preload operations to prevent re-execution
  const preloadOperations = useMemo(
    () => ({
      fontPreload: () => {
        if (document.getElementById("critical-font-preload")) return;

        const link = document.createElement("link");
        link.id = "critical-font-preload";
        link.rel = "preload";
        link.href = PERFORMANCE_CONFIG.FONT_URL;
        link.as = "style";
        link.setAttribute("media", "all");
        link.setAttribute("data-critical", "true");
        document.head.appendChild(link);
      },

      imagePreload: () => {
        PERFORMANCE_CONFIG.CRITICAL_IMAGES.forEach((src, index) => {
          if (document.getElementById(`preload-img-${index}`)) return;

          const link = document.createElement("link");
          link.id = `preload-img-${index}`;
          link.rel = "preload";
          link.href = src;
          link.as = "image";
          link.setAttribute("data-critical", "true");
          document.head.appendChild(link);
        });
      },

      dnsPrefetch: () => {
        PERFORMANCE_CONFIG.DNS_PREFETCH_DOMAINS.forEach((domain, index) => {
          if (document.getElementById(`dns-prefetch-${index}`)) return;

          const link = document.createElement("link");
          link.id = `dns-prefetch-${index}`;
          link.rel = "dns-prefetch";
          link.href = domain;
          document.head.appendChild(link);
        });
      },
    }),
    []
  );

  // Optimized route prefetching with error handling
  const prefetchRoutes = useCallback(async () => {
    await Promise.allSettled(
      preloadRoutes.map(async (route) => {
        try {
          await router.prefetch(route);
        } catch (error) {
          console.warn(`Failed to prefetch route: ${route}`, error);
        }
      })
    );
  }, [preloadRoutes, router]);

  // Enhanced performance monitoring
  const setupPerformanceMonitoring = useCallback(() => {
    if (process.env.NODE_ENV !== "development") return;

    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === "navigation") {
            const navEntry = entry as PerformanceNavigationTiming;

            // More comprehensive performance metrics
            const metrics = {
              domContentLoaded:
                navEntry.domContentLoadedEventEnd - navEntry.fetchStart,
              loadComplete: navEntry.loadEventEnd - navEntry.fetchStart,
              firstByte: navEntry.responseStart - navEntry.fetchStart,
              domInteractive: navEntry.domInteractive - navEntry.fetchStart,
              firstPaint: navEntry.responseStart - navEntry.fetchStart,
              totalSize: navEntry.transferSize,
            };

            console.log("🚀 Enhanced Performance Metrics:", metrics);

            // Store metrics for analysis
            if (typeof window !== "undefined") {
              const perfData =
                localStorage.getItem("performanceMetrics") || "[]";
              const metricsArray = JSON.parse(perfData);
              metricsArray.push({ ...metrics, timestamp: Date.now() });

              // Keep only last 10 entries
              if (metricsArray.length > 10) {
                metricsArray.splice(0, metricsArray.length - 10);
              }

              localStorage.setItem(
                "performanceMetrics",
                JSON.stringify(metricsArray)
              );
            }
          }
        });
      });

      observer.observe({
        entryTypes: [
          "navigation",
          "paint",
          "largest-contentful-paint",
          "first-contentful-paint",
          "resource",
        ],
      });

      return () => observer.disconnect();
    } catch (error) {
      console.warn("Performance monitoring setup failed:", error);
    }
  }, []);

  // Single effect for all performance optimizations
  useEffect(() => {
    // Execute preloading operations
    preloadOperations.fontPreload();
    preloadOperations.imagePreload();
    preloadOperations.dnsPrefetch();

    // Prefetch routes
    prefetchRoutes();

    // Setup performance monitoring
    const cleanup = setupPerformanceMonitoring();

    // Connection optimization
    if ("connection" in navigator) {
      const connection = (
        navigator as { connection?: { effectiveType?: string } }
      ).connection;
      if (connection && connection.effectiveType === "4g") {
        // Fast connection - enable all optimizations
        preloadOperations.imagePreload();
      }
    }

    return cleanup;
  }, [preloadOperations, prefetchRoutes, setupPerformanceMonitoring]);

  // Memory-efficient CSS injection
  useEffect(() => {
    if (!criticalCSS || typeof document === "undefined") return;

    const existingStyle = document.getElementById("critical-css-inline");
    if (existingStyle) return;

    const style = document.createElement("style");
    style.id = "critical-css-inline";
    style.textContent = criticalCSS;
    style.setAttribute("data-critical", "true");
    document.head.appendChild(style);
  }, [criticalCSS]);

  return (
    <>
      {/* Critical CSS - Optimized */}
      {criticalCSS && (
        <style
          dangerouslySetInnerHTML={{ __html: criticalCSS }}
          data-critical="true"
        />
      )}

      {/* Children with performance optimization */}
      <div className="performance-layout-container">{children}</div>
    </>
  );
}
