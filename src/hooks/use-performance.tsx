"use client";

import { useEffect, useRef, useCallback, useState } from "react";

interface PerformanceMetrics {
  pageLoadTime: number;
  componentRenderTime: number;
  interactionCount: number;
  errorCount: number;
  memoryUsage?: number;
  coreWebVitals?: {
    lcp?: number; // Largest Contentful Paint
    fid?: number; // First Input Delay
    cls?: number; // Cumulative Layout Shift
  };
}

export function usePerformanceMonitor(componentName: string) {
  const startTimeRef = useRef<number>(Date.now());
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    pageLoadTime: 0,
    componentRenderTime: 0,
    interactionCount: 0,
    errorCount: 0,
  });

  // Track component mount and render time
  useEffect(() => {
    const renderTime = Date.now() - startTimeRef.current;
    setMetrics((prev) => ({
      ...prev,
      componentRenderTime: renderTime,
    }));

    console.log(`⚡ ${componentName} rendered in ${renderTime}ms`);

    // Track memory usage if available
    if ("memory" in performance) {
      const memInfo = (performance as Performance)["memory"];
      setMetrics((prev) => ({
        ...prev,
        memoryUsage: memInfo?.usedJSHeapSize || 0,
      }));
    }
  }, [componentName]);

  // Track page load performance and Core Web Vitals
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Page load time from Navigation Timing API
    const getPageLoadTime = () => {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;
        setMetrics((prev) => ({
          ...prev,
          pageLoadTime: loadTime,
        }));
      }
    };

    // Core Web Vitals tracking
    const trackCoreWebVitals = () => {
      // LCP - Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcp = entries[entries.length - 1];
        setMetrics((prev) => ({
          ...prev,
          coreWebVitals: {
            ...prev.coreWebVitals,
            lcp: lcp.startTime,
          },
        }));
      });

      // FID - First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          setMetrics((prev) => ({
            ...prev,
            coreWebVitals: {
              ...prev.coreWebVitals,
              fid: entry.processingStart - entry.startTime,
            },
          }));
        });
      });

      // CLS - Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: PerformanceEntry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            setMetrics((prev) => ({
              ...prev,
              coreWebVitals: {
                ...prev.coreWebVitals,
                cls: clsValue,
              },
            }));
          }
        });
      });

      try {
        lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
        fidObserver.observe({ entryTypes: ["first-input"] });
        clsObserver.observe({ entryTypes: ["layout-shift"] });
      } catch (e) {
        console.warn("Performance observers not supported:", e);
      }

      return () => {
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
      };
    };

    // Wait for page load
    if (document.readyState === "complete") {
      getPageLoadTime();
    } else {
      window.addEventListener("load", getPageLoadTime);
    }

    const cleanup = trackCoreWebVitals();

    return () => {
      window.removeEventListener("load", getPageLoadTime);
      cleanup?.();
    };
  }, []);

  const trackInteraction = useCallback(
    (action: string, details?: unknown) => {
      setMetrics((prev) => ({
        ...prev,
        interactionCount: prev.interactionCount + 1,
      }));

      console.log(
        `🖱️ User interaction: ${action} in ${componentName}`,
        details
      );

      // Track with Performance API if available
      if ("measure" in performance) {
        performance.mark(`interaction-${action}-${Date.now()}`);
      }
    },
    [componentName]
  );

  const trackError = useCallback(
    (error: Error | string, context?: string) => {
      setMetrics((prev) => ({
        ...prev,
        errorCount: prev.errorCount + 1,
      }));

      const errorMessage = typeof error === "string" ? error : error.message;
      console.error(
        `❌ Error in ${componentName}${context ? ` (${context})` : ""}:`,
        errorMessage
      );

      // Track error timing
      performance.mark(`error-${componentName}-${Date.now()}`);
    },
    [componentName]
  );

  const getPerformanceReport = useCallback(() => {
    return {
      ...metrics,
      timestamp: Date.now(),
      componentName,
      url: typeof window !== "undefined" ? window.location.href : "",
    };
  }, [metrics, componentName]);

  return {
    metrics,
    trackInteraction,
    trackError,
    getPerformanceReport,
  };
}

export function useImageOptimization() {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());

  const handleImageLoad = useCallback((src: string) => {
    setLoadedImages((prev) => new Set(prev).add(src));
    setLoadingImages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(src);
      return newSet;
    });
  }, []);

  const handleImageError = useCallback((src: string) => {
    setFailedImages((prev) => new Set(prev).add(src));
    setLoadingImages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(src);
      return newSet;
    });
  }, []);

  const handleImageStart = useCallback((src: string) => {
    setLoadingImages((prev) => new Set(prev).add(src));
  }, []);

  const isImageLoaded = useCallback(
    (src: string) => {
      return loadedImages.has(src);
    },
    [loadedImages]
  );

  const hasImageFailed = useCallback(
    (src: string) => {
      return failedImages.has(src);
    },
    [failedImages]
  );

  const isImageLoading = useCallback(
    (src: string) => {
      return loadingImages.has(src);
    },
    [loadingImages]
  );

  const getOptimizedSrc = useCallback(
    (
      src: string,
      options?: { width?: number; height?: number; quality?: number }
    ) => {
      if (src.startsWith("data:") || src.startsWith("blob:")) {
        return src;
      }

      const params = new URLSearchParams();
      if (options?.width) params.append("w", options.width.toString());
      if (options?.height) params.append("h", options.height.toString());
      if (options?.quality) params.append("q", options.quality.toString());

      const hasParams = src.includes("?");
      return `${src}${hasParams ? "&" : "?"}${params.toString()}`;
    },
    []
  );

  return {
    handleImageLoad,
    handleImageError,
    handleImageStart,
    isImageLoaded,
    hasImageFailed,
    isImageLoading,
    getOptimizedSrc,
    stats: {
      loaded: loadedImages.size,
      failed: failedImages.size,
      loading: loadingImages.size,
    },
  };
}

// Hook for debouncing search inputs and form fields
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Hook for tracking scroll performance
export function useScrollPerformance() {
  const [scrollMetrics, setScrollMetrics] = useState({
    scrollY: 0,
    scrollDirection: "down" as "up" | "down",
    isScrolling: false,
    scrollSpeed: 0,
  });

  const lastScrollYRef = useRef(0);
  const lastScrollTimeRef = useRef(Date.now());
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const timeDiff = currentTime - lastScrollTimeRef.current;
      const scrollDiff = Math.abs(currentScrollY - lastScrollYRef.current);

      setScrollMetrics({
        scrollY: currentScrollY,
        scrollDirection:
          currentScrollY > lastScrollYRef.current ? "down" : "up",
        isScrolling: true,
        scrollSpeed: timeDiff > 0 ? scrollDiff / timeDiff : 0,
      });

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set new timeout to detect scroll end
      scrollTimeoutRef.current = setTimeout(() => {
        setScrollMetrics((prev) => ({ ...prev, isScrolling: false }));
      }, 150);

      lastScrollYRef.current = currentScrollY;
      lastScrollTimeRef.current = currentTime;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return scrollMetrics;
}

// Hook for intersection observer with performance tracking
export function useIntersectionPerformance(options?: IntersectionObserverInit) {
  const [entries, setEntries] = useState<IntersectionObserverEntry[]>([]);
  const observer = useRef<IntersectionObserver>();

  const observe = useCallback((element: Element) => {
    if (observer.current) {
      observer.current.observe(element);
    }
  }, []);

  const unobserve = useCallback((element: Element) => {
    if (observer.current) {
      observer.current.unobserve(element);
    }
  }, []);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (observerEntries) => {
        setEntries(observerEntries);
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: "50px",
        ...options,
      }
    );

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [options]);

  return { entries, observe, unobserve };
}
