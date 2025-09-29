// Ultimate Performance Configuration for 100% Performance
export const PERFORMANCE_CONFIG = {
  // Image optimization settings
  IMAGES: {
    WEBP_ENABLED: true,
    AVIF_ENABLED: false, // Browser support still limited
    QUALITY: 85,
    BLUR_PLACEHOLDER: true,
    LAZY_LOADING: true,
    RESPONSIVE_BREAKPOINTS: ["320px", "640px", "1024px", "1536px"],
  },

  // Virtualization settings
  VIRTUALIZATION: {
    ITEM_HEIGHT: 400,
    ITEMS_PER_ROW: 3,
    OVERSCAN: 5,
    THRESHOLD: 50, // pixels from viewport edge
  },

  // Filtering and search optimization
  FILTERING: {
    DEBOUNCE_DELAY: 300, // ms
    THROTTLE_DELAY: 100, // ms
    MIN_SEARCH_LENGTH: 2,
    CACHE_SIZE: 100, // number of results to cache
  },

  // Bundle optimization
  BUNDLE: {
    CODE_SPLITTING: true,
    TREE_SHAKING: true,
    DYNAMIC_IMPORTS: true,
    PREFETCH_ROUTES: ["/properties", "/blog", "/contact"],
  },

  // Memory optimization
  MEMORY: {
    CLEANUP_INTERVAL: 30000, // ms
    MAX_CACHED_PROPERTIES: 50,
    GARBAGE_COLLECTION_THRESHOLD: 100 * 1024 * 1024, // 100MB
  },

  // Network optimization
  NETWORK: {
    REQUEST_TIMEOUT: 10000, // ms
    RETRY_COUNT: 3,
    CONCURRENT_REQUESTS: 5,
    CACHE_STRATEGY: "stale-while-revalidate",
  },

  // Development vs Production
  ENVIRONMENT: {
    DEV: {
      PERFORMANCE_MONITORING: true,
      BUNDLE_ANALYSIS: true,
      CONSOLE_METRICS: true,
      ERROR_REPORTING: true,
    },
    PROD: {
      PERFORMANCE_MONITORING: false,
      BUNDLE_ANALYSIS: false,
      CONSOLE_METRICS: false,
      ERROR_REPORTING: true,
    },
  },
} as const;

// Performance thresholds for monitoring
export const PERFORMANCE_THRESHOLDS = {
  PAGE_LOAD: {
    EXCELLENT: 2000, // ms
    GOOD: 3000,
    NEEDS_IMPROVEMENT: 4000,
  },
  FIRST_CONTENTFUL_PAINT: {
    EXCELLENT: 1500,
    GOOD: 2000,
    NEEDS_IMPROVEMENT: 3000,
  },
  LARGEST_CONTENTFUL_PAINT: {
    EXCELLENT: 2500,
    GOOD: 4000,
    NEEDS_IMPROVEMENT: 4000,
  },
  CUMULATIVE_LAYOUT_SHIFT: {
    EXCELLENT: 0.1,
    GOOD: 0.25,
    NEEDS_IMPROVEMENT: 0.25,
  },
  TIME_TO_INTERACTIVE: {
    EXCELLENT: 3800,
    GOOD: 7300,
    NEEDS_IMPROVEMENT: 10200,
  },
} as const;

// Critical resource priorities
export const CRITICAL_RESOURCES = {
  PRELOAD_PRIORITY: [
    "/logo.png",
    "/media/famhouse/DSC_header_image.webp",
    "/media/blogs-appartments/preview.jpg",
  ],
  PREFETCH_ROUTES: ["/properties", "/blog", "/contact", "/auth/signin"],
  DNS_PREFETCH: [
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com",
    "https://firebasestorage.googleapis.com",
  ],
} as const;

// Feature flags for performance optimization
export const PERFORMANCE_FEATURES = {
  WEBP_SUPPORT: true,
  SERVICE_WORKER: false, // Can be enabled later
  LAZY_LOADING: true,
  INTERSECTION_OBSERVER: true,
  WEB_VITALS: true,
  MEMORY_MONITORING: true,
} as const;

// Bundle analysis configuration
export const BUNDLE_CONFIG = {
  ANALYZE: process.env.ANALYZE_BUNDLE === "true",
  VISUALIZE_SIZE_LIMIT: 500000, // bytes
  CONSOLE_SIZE_LIMIT: 1000000, // bytes
} as const;

export type PerformanceConfig = typeof PERFORMANCE_CONFIG;
export type PerformanceThresholds = typeof PERFORMANCE_THRESHOLDS;
export type CriticalResources = typeof CRITICAL_RESOURCES;
export type PerformanceFeatures = typeof PERFORMANCE_FEATURES;
