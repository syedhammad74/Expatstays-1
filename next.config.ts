// next.config.ts
import type { NextConfig } from "next";
const path = require("path");

const nextConfig: NextConfig = {
  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      "framer-motion",
      "@radix-ui/react-*",
      "lucide-react",
      "firebase",
      "@firebase/*",
    ],
    scrollRestoration: true,
  },

  // Image optimization
  images: {
    domains: [
      "localhost",
      "firebasestorage.googleapis.com",
      "storage.googleapis.com",
    ],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: process.env.NODE_ENV === "development", // Only for dev mode
    // Enable responsive images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  // Compression and caching
  compress: true,

  // Headers for better caching
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/media/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400", // 1 day for media files
          },
        ],
      },
    ];
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // any import of 'next/document' now resolves to our shim
      "next/document": path.resolve(
        __dirname,
        "src/mocks/next-document-shim.tsx"
      ),
    };
    // Optimize for production
    if (!dev && !isServer) {
      // Enhanced code splitting with size limits
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          maxInitialRequests: 30,
          maxAsyncRequests: 30,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              chunks: "all",
              priority: 10,
              maxSize: 250000, // 250KB max chunk size
            },
            firebase: {
              test: /[\\/]node_modules[\\/](@firebase|firebase)[\\/]/,
              name: "firebase",
              chunks: "all",
              priority: 25,
              maxSize: 300000, // 300KB max chunk size
            },
            framerMotion: {
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              name: "framer-motion",
              chunks: "all",
              priority: 20,
              maxSize: 150000, // 150KB max chunk size
            },
            radixUI: {
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
              name: "radix-ui",
              chunks: "all",
              priority: 20,
              maxSize: 200000, // 200KB max chunk size
            },
            stripe: {
              test: /[\\/]node_modules[\\/](@stripe|stripe)[\\/]/,
              name: "stripe",
              chunks: "all",
              priority: 20,
              maxSize: 100000, // 100KB max chunk size
            },
            commons: {
              name: "commons",
              minChunks: 2,
              chunks: "all",
              priority: 5,
              reuseExistingChunk: true,
              maxSize: 200000, // 200KB max chunk size
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
        runtimeChunk: {
          name: "runtime",
        },
        concatenateModules: true,
        usedExports: true,
        sideEffects: false,
      };
    }

    // Bundle analyzer for debugging (optional)
    if (process.env.ANALYZE === "true") {
      const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
          openAnalyzer: false,
        })
      );
    }

    return config;
  },

  // Output file tracing for smaller deployments
  output: "standalone",

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true,
  },

  // PWA-like features
  async rewrites() {
    return [
      {
        source: "/sw.js",
        destination: "/_next/static/sw.js",
      },
    ];
  },
};

export default nextConfig;
