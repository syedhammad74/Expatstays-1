"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Clock,
  Database,
  Image,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  totalBlockingTime: number;
  memoryUsage: number;
  bundleSize: number;
  imageCount: number;
  apiCalls: number;
}

interface PerformanceDashboardProps {
  showInProduction?: boolean;
}

export default function PerformanceDashboard({
  showInProduction = false,
}: PerformanceDashboardProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // Only show in development or if explicitly enabled
    if (process.env.NODE_ENV === "production" && !showInProduction) {
      return;
    }

    const collectMetrics = () => {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      const paintEntries = performance.getEntriesByType("paint");
      const lcpEntries = performance.getEntriesByType(
        "largest-contentful-paint"
      );

      const pageLoadTime = navigation
        ? navigation.loadEventEnd - navigation.fetchStart
        : 0;
      const firstContentfulPaint =
        paintEntries.find((entry) => entry.name === "first-contentful-paint")
          ?.startTime || 0;
      const largestContentfulPaint =
        lcpEntries[lcpEntries.length - 1]?.startTime || 0;

      // Memory usage (if available)
      const memoryUsage =
        (performance as Performance & { memory?: { usedJSHeapSize?: number } })
          .memory?.usedJSHeapSize || 0;

      // Count images and API calls
      const imageCount = document.querySelectorAll("img").length;
      const apiCalls = performance
        .getEntriesByType("resource")
        .filter((entry) => entry.name.includes("/api/")).length;

      setMetrics({
        pageLoadTime,
        firstContentfulPaint,
        largestContentfulPaint,
        firstInputDelay: 0, // Would need to be measured separately
        cumulativeLayoutShift: 0, // Would need to be measured separately
        totalBlockingTime: 0, // Would need to be measured separately
        memoryUsage,
        bundleSize: 0, // Would need to be calculated
        imageCount,
        apiCalls,
      });
    };

    // Collect metrics after page load
    if (document.readyState === "complete") {
      collectMetrics();
    } else {
      window.addEventListener("load", collectMetrics);
    }

    // Show dashboard after 2 seconds
    const timer = setTimeout(() => setIsVisible(true), 2000);

    return () => {
      window.removeEventListener("load", collectMetrics);
      clearTimeout(timer);
    };
  }, [showInProduction]);

  const getPerformanceColor = (
    value: number,
    thresholds: { good: number; warning: number }
  ) => {
    if (value <= thresholds.good) return "text-green-600";
    if (value <= thresholds.warning) return "text-yellow-600";
    return "text-red-600";
  };

  const getPerformanceBadge = (
    value: number,
    thresholds: { good: number; warning: number }
  ) => {
    if (value <= thresholds.good)
      return <Badge className="bg-green-100 text-green-800">Good</Badge>;
    if (value <= thresholds.warning)
      return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
    return <Badge className="bg-red-100 text-red-800">Poor</Badge>;
  };

  if (!isVisible || !metrics) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card
        className={`w-80 shadow-2xl border-0 bg-white/95 backdrop-blur-sm transition-all duration-300 ${
          isMinimized ? "h-12" : "h-auto"
        }`}
      >
        <CardHeader
          className="pb-2 cursor-pointer"
          onClick={() => setIsMinimized(!isMinimized)}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-[#051F20] flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#8EB69B]" />
              Performance
            </CardTitle>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              {isMinimized ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <XCircle className="h-3 w-3" />
              )}
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="space-y-4">
            {/* Core Web Vitals */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-[#051F20] uppercase tracking-wide">
                Core Web Vitals
              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#4A4A4A]">LCP</span>
                  <div className="flex items-center gap-1">
                    <span
                      className={getPerformanceColor(
                        metrics.largestContentfulPaint,
                        { good: 2500, warning: 4000 }
                      )}
                    >
                      {metrics.largestContentfulPaint.toFixed(0)}ms
                    </span>
                    {getPerformanceBadge(metrics.largestContentfulPaint, {
                      good: 2500,
                      warning: 4000,
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#4A4A4A]">FCP</span>
                  <div className="flex items-center gap-1">
                    <span
                      className={getPerformanceColor(
                        metrics.firstContentfulPaint,
                        { good: 1800, warning: 3000 }
                      )}
                    >
                      {metrics.firstContentfulPaint.toFixed(0)}ms
                    </span>
                    {getPerformanceBadge(metrics.firstContentfulPaint, {
                      good: 1800,
                      warning: 3000,
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-[#051F20] uppercase tracking-wide">
                Performance
              </h4>

              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-[#8EB69B]" />
                    <span className="text-[#4A4A4A]">Page Load</span>
                  </div>
                  <span
                    className={getPerformanceColor(metrics.pageLoadTime, {
                      good: 2000,
                      warning: 4000,
                    })}
                  >
                    {metrics.pageLoadTime.toFixed(0)}ms
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Database className="h-3 w-3 text-[#8EB69B]" />
                    <span className="text-[#4A4A4A]">Memory</span>
                  </div>
                  <span className="text-[#4A4A4A]">
                    {(metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Image
                      className="h-3 w-3 text-[#8EB69B]"
                      alt="Images icon"
                    />
                    <span className="text-[#4A4A4A]">Images</span>
                  </div>
                  <span className="text-[#4A4A4A]">{metrics.imageCount}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-[#8EB69B]" />
                    <span className="text-[#4A4A4A]">API Calls</span>
                  </div>
                  <span className="text-[#4A4A4A]">{metrics.apiCalls}</span>
                </div>
              </div>
            </div>

            {/* Performance Score */}
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#051F20]">
                  Overall Score
                </span>
                <div className="flex items-center gap-1">
                  {metrics.pageLoadTime < 2000 &&
                  metrics.largestContentfulPaint < 2500 ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : metrics.pageLoadTime < 4000 &&
                    metrics.largestContentfulPaint < 4000 ? (
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-xs font-semibold">
                    {metrics.pageLoadTime < 2000 &&
                    metrics.largestContentfulPaint < 2500
                      ? "Excellent"
                      : metrics.pageLoadTime < 4000 &&
                        metrics.largestContentfulPaint < 4000
                      ? "Good"
                      : "Needs Improvement"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
