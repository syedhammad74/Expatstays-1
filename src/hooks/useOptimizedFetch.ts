import { useState, useEffect, useCallback, useRef } from 'react';

interface UseOptimizedFetchOptions {
  cacheTime?: number;
  staleTime?: number;
  retryCount?: number;
  retryDelay?: number;
  enabled?: boolean;
}

interface UseOptimizedFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  isStale: boolean;
}

// Simple in-memory cache
const cache = new Map<string, { data: unknown; timestamp: number; staleTime: number }>();

export function useOptimizedFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: UseOptimizedFetchOptions = {}
): UseOptimizedFetchResult<T> {
  const {
    cacheTime = 5 * 60 * 1000, // 5 minutes
    staleTime = 1 * 60 * 1000, // 1 minute
    retryCount = 3,
    retryDelay = 1000,
    enabled = true,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isStale, setIsStale] = useState(false);
  
  const retryCountRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!enabled) return;

    // Check cache first
    const cached = cache.get(key);
    const now = Date.now();

    if (cached && !forceRefresh) {
      const isExpired = now - cached.timestamp > cacheTime;
      const isStaleData = now - cached.timestamp > cached.staleTime;

      if (!isExpired) {
        setData(cached.data);
        setIsStale(isStaleData);
        setLoading(false);
        setError(null);

        // If data is stale, fetch in background
        if (isStaleData) {
          fetchData(true);
        }
        return;
      }
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn();
      
      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      setData(result);
      setIsStale(false);
      retryCountRef.current = 0;

      // Cache the result
      cache.set(key, {
        data: result,
        timestamp: now,
        staleTime,
      });

    } catch (err) {
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      const error = err as Error;
      setError(error);

      // Retry logic
      if (retryCountRef.current < retryCount) {
        retryCountRef.current++;
        setTimeout(() => {
          fetchData(true);
        }, retryDelay * retryCountRef.current);
      }
    } finally {
      setLoading(false);
    }
  }, [key, fetchFn, cacheTime, staleTime, retryCount, retryDelay, enabled]);

  const refetch = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  useEffect(() => {
    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  // Cleanup cache periodically
  useEffect(() => {
    const cleanup = () => {
      const now = Date.now();
      for (const [cacheKey, cached] of cache.entries()) {
        if (now - cached.timestamp > cacheTime) {
          cache.delete(cacheKey);
        }
      }
    };

    const interval = setInterval(cleanup, cacheTime);
    return () => clearInterval(interval);
  }, [cacheTime]);

  return {
    data,
    loading,
    error,
    refetch,
    isStale,
  };
}

// Utility function to clear cache
export function clearCache(key?: string) {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

// Utility function to preload data
export function preloadData<T>(key: string, fetchFn: () => Promise<T>) {
  if (!cache.has(key)) {
    fetchFn().then((data) => {
      cache.set(key, {
        data,
        timestamp: Date.now(),
        staleTime: 1 * 60 * 1000, // 1 minute
      });
    }).catch(() => {
      // Silently fail for preloading
    });
  }
}
