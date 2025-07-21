// Performance optimization utilities
import { useState, useEffect, useCallback, useRef } from "react";

// Image optimization utility
export const optimizeImageUrl = (
  url: string | undefined | null,
  options: { width?: number; height?: number; quality?: number } = {}
): string => {
  const { width, height, quality = 85 } = options;

  // Handle null, undefined, or empty strings
  if (!url || typeof url !== "string") {
    return "/placeholder-property.jpg"; // Return fallback image
  }

  // If it's already a data URL or blob, return as-is
  if (url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }

  // For local images or external URLs, apply optimization parameters
  const params = new URLSearchParams();
  if (width) params.append("w", width.toString());
  if (height) params.append("h", height.toString());
  params.append("q", quality.toString());

  // Check if URL already has parameters
  const hasParams = url.includes("?");
  const optimizedUrl = `${url}${hasParams ? "&" : "?"}${params.toString()}`;

  return optimizedUrl;
};

// Preload image utility
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!src || typeof src !== "string") {
      resolve(); // Don't reject for invalid src, just resolve
      return;
    }

    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // Resolve instead of reject to prevent unhandled rejections
    img.src = src;
  });
};

// Preload multiple images
export const preloadImages = async (
  urls: (string | undefined | null)[]
): Promise<void> => {
  const validUrls = urls.filter((url): url is string =>
    Boolean(url && typeof url === "string")
  );
  await Promise.all(validUrls.map(preloadImage));
};

// Intersection Observer hook
export const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
        callback(entry);
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, callback, hasIntersected, options]);

  return { isVisible, hasIntersected };
};

// Debounce hook for search and form inputs
export const useDebounce = <T>(value: T, delay: number): T => {
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
};

// Local storage cache with TTL
export class CacheManager {
  private static setItem(
    key: string,
    value: unknown,
    ttl: number = 3600000
  ): void {
    if (typeof window === "undefined") return;

    try {
      const item = {
        value,
        timestamp: Date.now(),
        ttl,
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.warn("Failed to save to localStorage:", error);
    }
  }

  private static getItem<T>(key: string): T | null {
    if (typeof window === "undefined") return null;

    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const parsed = JSON.parse(item);
      const now = Date.now();

      if (now - parsed.timestamp > parsed.ttl) {
        localStorage.removeItem(key);
        return null;
      }

      return parsed.value;
    } catch {
      return null;
    }
  }

  static cacheProperties(properties: unknown[], ttl: number = 300000): void {
    // 5 minutes
    this.setItem("cached_properties", properties, ttl);
  }

  static getCachedProperties(): unknown[] | null {
    return this.getItem<unknown[]>("cached_properties");
  }

  static cacheProperty(property: unknown, ttl: number = 600000): void {
    // 10 minutes
    if (property && (property as { id?: string }).id) {
      this.setItem(
        `cached_property_${(property as { id: string }).id}`,
        property,
        ttl
      );
    }
  }

  static getCachedProperty(propertyId: string): unknown | null {
    if (!propertyId) return null;
    return this.getItem(`cached_property_${propertyId}`);
  }

  static clearCache(): void {
    if (typeof window !== "undefined") {
      try {
        const keys = Object.keys(localStorage);
        keys.forEach((key) => {
          if (key.startsWith("cached_")) {
            localStorage.removeItem(key);
          }
        });
      } catch (error) {
        console.warn("Failed to clear cache:", error);
      }
    }
  }
}

// Performance monitoring
export const performanceMonitor = {
  markStart: (name: string) => {
    if (typeof window !== "undefined" && "performance" in window) {
      try {
        performance.mark(`${name}-start`);
      } catch (error) {
        console.warn("Performance mark failed:", error);
      }
    }
  },

  markEnd: (name: string) => {
    if (typeof window !== "undefined" && "performance" in window) {
      try {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
      } catch (error) {
        console.warn("Performance measure failed:", error);
      }
    }
  },

  getMeasure: (name: string) => {
    if (typeof window !== "undefined" && "performance" in window) {
      try {
        const measures = performance.getEntriesByName(name, "measure");
        return measures.length > 0 ? measures[0].duration : null;
      } catch (error) {
        console.warn("Performance getMeasure failed:", error);
        return null;
      }
    }
    return null;
  },
};

// Optimize component re-renders
export const useMemoizedCallback = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  deps: React.DependencyList
): T => {
  return useCallback(callback, deps);
};

// Image loading states
export const useImageLoad = (src: string | undefined | null) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);

    if (!src || typeof src !== "string") {
      setHasError(true);
      return;
    }

    const img = new Image();

    img.onload = () => {
      setIsLoaded(true);
    };

    img.onerror = () => {
      setHasError(true);
    };

    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return { isLoaded, hasError };
};

// Virtualization helper for large lists
export const useVirtualization = (
  itemCount: number,
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    itemCount - 1
  );

  const visibleItems = Array.from(
    { length: endIndex - startIndex + 1 },
    (_, index) => startIndex + index
  );

  return {
    startIndex,
    endIndex,
    visibleItems,
    onScroll: (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    },
  };
};

// Component lazy loading hook (Next.js compatible)
export const useLazyComponent = (importFn: () => Promise<any>) => {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    importFn()
      .then((module) => {
        if (mounted) {
          setComponent(() => module.default || module);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [importFn]);

  return { Component, loading, error };
};

export default {
  optimizeImageUrl,
  preloadImage,
  preloadImages,
  useIntersectionObserver,
  useDebounce,
  CacheManager,
  performanceMonitor,
  useMemoizedCallback,
  useImageLoad,
  useVirtualization,
  useLazyComponent,
};
