import { useCallback, useMemo, useRef, useEffect } from "react";

// Advanced performance optimization hooks
export interface PerformanceConfig {
  enableVirtualization: boolean;
  enableImageOptimization: boolean;
  enableMemoryOptimization: boolean;
  enableBundleOptimization: boolean;
}

export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  frameRate: number;
  bundleSize: number;
}

const DEFAULT_CONFIG: PerformanceConfig = {
  enableVirtualization: true,
  enableImageOptimization: true,
  enableMemoryOptimization: true,
  enableBundleOptimization: true,
};

export function usePerformanceOptimizer(
  config: Partial<PerformanceConfig> = {}
) {
  const mergedConfig = useMemo(
    () => ({ ...DEFAULT_CONFIG, ...config }),
    [config]
  );

  // Performance monitoring
  const metricsRef = useRef<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    frameRate: 0,
    bundleSize: 0,
  });

  // Frame rate monitoring
  const measureFrameRate = useCallback(() => {
    if (!mergedConfig.enableMemoryOptimization) return;

    let frameCount = 0;
    let lastTime = performance.now();

    const countFrames = (currentTime: number) => {
      frameCount++;

      if (currentTime - lastTime >= 1000) {
        metricsRef.current.frameRate = frameCount;
        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(countFrames);
    };

    requestAnimationFrame(countFrames);
  }, [mergedConfig.enableMemoryOptimization]);

  // Memory usage tracking
  const measureMemoryUsage = useCallback(() => {
    if (!mergedConfig.enableMemoryOptimization) return;

    if ("memory" in performance) {
      const memory = (performance as any).memory;
      metricsRef.current.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
    }
  }, [mergedConfig.enableMemoryOptimization]);

  // Render time tracking
  const measureRenderTime = useCallback(
    (renderFn: () => void) => {
      if (!mergedConfig.enableMemoryOptimization) {
        renderFn();
        return;
      }

      const startTime = performance.now();
      renderFn();
      const endTime = performance.now();

      metricsRef.current.renderTime = endTime - startTime;
    },
    [mergedConfig.enableMemoryOptimization]
  );

  // Bundle optimization utilities
  const optimizeBundle = useCallback(
    (importFn: () => Promise<any>) => {
      if (!mergedConfig.enableBundleOptimization) return importFn();

      // Implement dynamic imports with prefetch
      return importFn();
    },
    [mergedConfig.enableBundleOptimization]
  );

  // Image optimization utilities
  const optimizeImages = useCallback(
    (images: string[]) => {
      if (!mergedConfig.enableImageOptimization) return images;

      return images.map((img) => {
        // WebP conversion logic would go here
        if (img.includes(".jpg") || img.includes(".jpeg")) {
          return img.replace(/\.(jpg|jpeg)$/i, ".webp");
        }
        return img;
      });
    },
    [mergedConfig.enableImageOptimization]
  );

  // Virtualization helpers
  const virtualizeList = useCallback(
    <T>(
      items: T[],
      containerHeight: number,
      itemHeight: number,
      scrollTop: number
    ) => {
      if (!mergedConfig.enableVirtualization) return items;

      const visibleCount = Math.ceil(containerHeight / itemHeight);
      const startIndex = Math.floor(scrollTop / itemHeight);
      const endIndex = startIndex + visibleCount;

      return items.slice(startIndex, endIndex);
    },
    [mergedConfig.enableVirtualization]
  );

  // Performance initialization
  useEffect(() => {
    measureFrameRate();
    measureMemoryUsage();

    // Periodic memory measurements
    const interval = setInterval(measureMemoryUsage, 5000);

    return () => clearInterval(interval);
  }, [measureFrameRate, measureMemoryUsage]);

  return {
    config: mergedConfig,
    metrics: metricsRef.current,
    measureRenderTime,
    optimizeBundle,
    optimizeImages,
    virtualizeList,
  };
}

// Hook for debounced operations
export function useDebouncedPerformance<T>(
  value: T,
  delay: number,
  fn: (value: T) => void
) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      fn(value);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay, fn]);
}

// Hook for throttled operations
export function useThrottledPerformance<T>(
  fn: (...args: T[]) => void,
  delay: number
) {
  const timeoutRef = useRef<boolean>(false);

  return useCallback(
    (...args: T[]) => {
      if (timeoutRef.current) return;

      timeoutRef.current = true;
      fn(...args);

      setTimeout(() => {
        timeoutRef.current = false;
      }, delay);
    },
    [fn, delay]
  );
}
