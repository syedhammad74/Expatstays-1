"use client";

import { useEffect, useState } from "react";

interface PerformanceMetrics {
  pageLoadTime: number;
  imageLoadTime: number;
  componentRenderTime: number;
  memoryUsage: number;
}

const PerformanceSummary: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== "development") return;

    const collectMetrics = () => {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      const pageLoadTime = navigation
        ? navigation.loadEventEnd - navigation.fetchStart
        : 0;

      // Get memory usage if available
      const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;

      setMetrics({
        pageLoadTime,
        imageLoadTime: 0, // Will be updated by image components
        componentRenderTime: 0, // Will be updated by components
        memoryUsage,
      });
    };

    // Collect metrics after page load
    if (document.readyState === "complete") {
      collectMetrics();
    } else {
      window.addEventListener("load", collectMetrics);
    }

    // Show performance summary after 2 seconds
    const timer = setTimeout(() => setIsVisible(true), 2000);

    return () => {
      window.removeEventListener("load", collectMetrics);
      clearTimeout(timer);
    };
  }, []);

  if (!isVisible || !metrics || process.env.NODE_ENV === "production") {
    return null;
  }

  const getPerformanceColor = (
    value: number,
    thresholds: { good: number; warning: number }
  ) => {
    if (value <= thresholds.good) return "text-green-600";
    if (value <= thresholds.warning) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-4 z-50 max-w-xs">
      <h3 className="text-sm font-semibold text-gray-800 mb-2">
        Performance Metrics
      </h3>

      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-600">Page Load:</span>
          <span
            className={getPerformanceColor(metrics.pageLoadTime, {
              good: 2000,
              warning: 4000,
            })}
          >
            {metrics.pageLoadTime.toFixed(0)}ms
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Memory:</span>
          <span
            className={getPerformanceColor(metrics.memoryUsage / 1024 / 1024, {
              good: 50,
              warning: 100,
            })}
          >
            {(metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Images:</span>
          <span
            className={getPerformanceColor(metrics.imageLoadTime, {
              good: 1000,
              warning: 2000,
            })}
          >
            {metrics.imageLoadTime.toFixed(0)}ms
          </span>
        </div>
      </div>

      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-1 right-1 text-gray-400 hover:text-gray-600 text-xs"
      >
        ×
      </button>
    </div>
  );
};

export default PerformanceSummary;
