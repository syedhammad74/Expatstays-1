"use client";

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  fmp: number; // First Meaningful Paint
}

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;

    const collectMetrics = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paintEntries = performance.getEntriesByType('paint');
      
      // Calculate Core Web Vitals
      const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
      const fmp = paintEntries.find(entry => entry.name === 'first-meaningful-paint')?.startTime || 0;
      const ttfb = navigation ? navigation.responseStart - navigation.requestStart : 0;

      // Get LCP
      const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
      const lcp = lcpEntries.length > 0 ? lcpEntries[lcpEntries.length - 1].startTime : 0;

      // Get FID (simplified)
      const fid = 0; // Would need to be measured with actual user interactions

      // Get CLS (simplified)
      const cls = 0; // Would need to be measured with layout shift observer

      setMetrics({
        fcp,
        lcp,
        fid,
        cls,
        ttfb,
        fmp,
      });
    };

    // Collect metrics after page load
    if (document.readyState === 'complete') {
      collectMetrics();
    } else {
      window.addEventListener('load', collectMetrics);
    }

    // Show performance monitor after 3 seconds
    const timer = setTimeout(() => setIsVisible(true), 3000);

    return () => {
      window.removeEventListener('load', collectMetrics);
      clearTimeout(timer);
    };
  }, []);

  if (!isVisible || !metrics || process.env.NODE_ENV === 'production') {
    return null;
  }

  const getScoreColor = (value: number, thresholds: { good: number; needsImprovement: number }) => {
    if (value <= thresholds.good) return 'text-green-600';
    if (value <= thresholds.needsImprovement) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreText = (value: number, thresholds: { good: number; needsImprovement: number }) => {
    if (value <= thresholds.good) return 'Good';
    if (value <= thresholds.needsImprovement) return 'Needs Improvement';
    return 'Poor';
  };

  return (
    <div className="fixed bottom-4 left-4 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-4 z-50 max-w-sm">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Performance Metrics</h3>
      
      <div className="space-y-2 text-xs">
        {/* First Contentful Paint */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">FCP:</span>
          <div className="flex items-center gap-2">
            <span className={getScoreColor(metrics.fcp, { good: 1800, needsImprovement: 3000 })}>
              {metrics.fcp.toFixed(0)}ms
            </span>
            <span className={`text-xs px-1 py-0.5 rounded ${
              getScoreColor(metrics.fcp, { good: 1800, needsImprovement: 3000 }) === 'text-green-600' 
                ? 'bg-green-100 text-green-800' 
                : getScoreColor(metrics.fcp, { good: 1800, needsImprovement: 3000 }) === 'text-yellow-600'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {getScoreText(metrics.fcp, { good: 1800, needsImprovement: 3000 })}
            </span>
          </div>
        </div>

        {/* Largest Contentful Paint */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">LCP:</span>
          <div className="flex items-center gap-2">
            <span className={getScoreColor(metrics.lcp, { good: 2500, needsImprovement: 4000 })}>
              {metrics.lcp.toFixed(0)}ms
            </span>
            <span className={`text-xs px-1 py-0.5 rounded ${
              getScoreColor(metrics.lcp, { good: 2500, needsImprovement: 4000 }) === 'text-green-600' 
                ? 'bg-green-100 text-green-800' 
                : getScoreColor(metrics.lcp, { good: 2500, needsImprovement: 4000 }) === 'text-yellow-600'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {getScoreText(metrics.lcp, { good: 2500, needsImprovement: 4000 })}
            </span>
          </div>
        </div>

        {/* Time to First Byte */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">TTFB:</span>
          <div className="flex items-center gap-2">
            <span className={getScoreColor(metrics.ttfb, { good: 800, needsImprovement: 1800 })}>
              {metrics.ttfb.toFixed(0)}ms
            </span>
            <span className={`text-xs px-1 py-0.5 rounded ${
              getScoreColor(metrics.ttfb, { good: 800, needsImprovement: 1800 }) === 'text-green-600' 
                ? 'bg-green-100 text-green-800' 
                : getScoreColor(metrics.ttfb, { good: 800, needsImprovement: 1800 }) === 'text-yellow-600'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {getScoreText(metrics.ttfb, { good: 800, needsImprovement: 1800 })}
            </span>
          </div>
        </div>

        {/* First Meaningful Paint */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">FMP:</span>
          <div className="flex items-center gap-2">
            <span className={getScoreColor(metrics.fmp, { good: 2000, needsImprovement: 3000 })}>
              {metrics.fmp.toFixed(0)}ms
            </span>
            <span className={`text-xs px-1 py-0.5 rounded ${
              getScoreColor(metrics.fmp, { good: 2000, needsImprovement: 3000 }) === 'text-green-600' 
                ? 'bg-green-100 text-green-800' 
                : getScoreColor(metrics.fmp, { good: 2000, needsImprovement: 3000 }) === 'text-yellow-600'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {getScoreText(metrics.fmp, { good: 2000, needsImprovement: 3000 })}
            </span>
          </div>
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

export default PerformanceMonitor;
