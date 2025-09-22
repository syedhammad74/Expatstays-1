// Performance monitoring utilities for production optimization

interface PerformanceMetrics {
  pageLoadTime: number;
  componentRenderTime: number;
  imageLoadTime: number;
  apiResponseTime: number;
  memoryUsage?: number;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, PerformanceMetrics> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Mark start of a performance measurement
  markStart(name: string): void {
    if (typeof window !== "undefined" && "performance" in window) {
      try {
        performance.mark(`${name}-start`);
      } catch (error) {
        // Silently fail in production
      }
    }
  }

  // Mark end of a performance measurement
  markEnd(name: string): number | null {
    if (typeof window !== "undefined" && "performance" in window) {
      try {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);

        const measures = performance.getEntriesByName(name, "measure");
        const duration = measures.length > 0 ? measures[0].duration : null;

        // Store metric
        this.metrics.set(name, {
          ...this.metrics.get(name),
          componentRenderTime: duration || 0,
        } as PerformanceMetrics);

        return duration;
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  // Measure image load performance
  measureImageLoad(imageSrc: string): Promise<number> {
    return new Promise((resolve) => {
      const startTime = performance.now();
      const img = new Image();

      img.onload = () => {
        const loadTime = performance.now() - startTime;
        this.metrics.set(`image-${imageSrc}`, {
          imageLoadTime: loadTime,
        } as PerformanceMetrics);
        resolve(loadTime);
      };

      img.onerror = () => {
        resolve(0);
      };

      img.src = imageSrc;
    });
  }

  // Measure API response time
  async measureApiCall<T>(apiCall: () => Promise<T>, name: string): Promise<T> {
    const startTime = performance.now();

    try {
      const result = await apiCall();
      const responseTime = performance.now() - startTime;

      this.metrics.set(name, {
        apiResponseTime: responseTime,
      } as PerformanceMetrics);

      return result;
    } catch (error) {
      const responseTime = performance.now() - startTime;
      this.metrics.set(name, {
        apiResponseTime: responseTime,
      } as PerformanceMetrics);
      throw error;
    }
  }

  // Get performance report
  getReport(): Record<string, PerformanceMetrics> {
    return Object.fromEntries(this.metrics);
  }

  // Clear metrics
  clearMetrics(): void {
    this.metrics.clear();
  }

  // Get memory usage if available
  getMemoryUsage(): number | null {
    if (typeof window !== "undefined" && "memory" in performance) {
      const memInfo = (performance as any).memory;
      return memInfo?.usedJSHeapSize || null;
    }
    return null;
  }

  // Log performance warnings
  checkPerformanceThresholds(): void {
    if (process.env.NODE_ENV === "production") return;

    this.metrics.forEach((metric, name) => {
      if (metric.componentRenderTime > 100) {
        console.warn(
          `⚠️ Slow component render: ${name} took ${metric.componentRenderTime.toFixed(
            2
          )}ms`
        );
      }

      if (metric.imageLoadTime > 2000) {
        console.warn(
          `⚠️ Slow image load: ${name} took ${metric.imageLoadTime.toFixed(
            2
          )}ms`
        );
      }

      if (metric.apiResponseTime > 1000) {
        console.warn(
          `⚠️ Slow API call: ${name} took ${metric.apiResponseTime.toFixed(
            2
          )}ms`
        );
      }
    });
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();

// Hook for measuring component performance
export const usePerformanceMeasure = (componentName: string) => {
  const startTime = performance.now();

  return {
    endMeasure: () => {
      const renderTime = performance.now() - startTime;
      performanceMonitor.markEnd(`${componentName}-render`);

      if (process.env.NODE_ENV !== "production" && renderTime > 50) {
        console.warn(
          `⚠️ ${componentName} render took ${renderTime.toFixed(2)}ms`
        );
      }
    },
  };
};

// Utility for measuring async operations
export const measureAsync = async <T>(
  operation: () => Promise<T>,
  name: string
): Promise<T> => {
  return performanceMonitor.measureApiCall(operation, name);
};

export default performanceMonitor;
