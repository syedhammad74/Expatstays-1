import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  reactStrictMode: true,
  poweredByHeader: false,

  // Experimental features for performance
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
      "react-hook-form",
      "@hookform/resolvers",
      "zod",
    ],
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
    serverComponentsExternalPackages: ["sharp"],
    esmExternals: true,
    serverMinification: true,
  },

  // Optimized image settings for performance
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "myexpatstays.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
    ],
    formats: ["image/webp", "image/avif"], // Re-enabled AVIF for better compression
    deviceSizes: [640, 750, 828, 1080, 1200], // Optimized sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Added 384 for better mobile
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: false,
    loader: "default",
  },

  // Compression and optimization
  compress: true,

  // Advanced compression settings
  swcMinify: true,

  // Advanced headers for maximum performance
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
      {
        source: "/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
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
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=300, s-maxage=300",
          },
        ],
      },
      {
        source:
          "/(.*\\.(js|css|png|jpg|jpeg|gif|svg|webp|avif|ico|woff|woff2|ttf|otf))",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*\\.(html|json))",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=86400",
          },
        ],
      },
      {
        source: "/(.*\\.(css|js))",
        headers: [
          {
            key: "Content-Encoding",
            value: "gzip",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Advanced webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          minSize: 20000,
          maxSize: 200000,
          cacheGroups: {
            firebase: {
              test: /[\\/]node_modules[\\/](firebase|@firebase)[\\/]/,
              name: "firebase",
              chunks: "async",
              priority: 30,
              maxSize: 150000,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              chunks: "async",
              priority: 20,
              maxSize: 200000,
            },
            radix: {
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
              name: "radix-ui",
              chunks: "async",
              priority: 25,
              maxSize: 100000,
            },
            lucide: {
              test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
              name: "lucide",
              chunks: "async",
              priority: 15,
              maxSize: 50000,
            },
            commons: {
              name: "commons",
              minChunks: 2,
              chunks: "async",
              priority: 10,
              reuseExistingChunk: true,
              maxSize: 100000,
            },
          },
        },
        runtimeChunk: {
          name: "runtime",
        },
        usedExports: true,
        sideEffects: false,
        moduleIds: "deterministic",
      };

      // Tree shaking optimization
      config.optimization.providedExports = true;
      config.optimization.usedExports = true;

      // Remove console logs and optimize for modern browsers
      config.optimization.minimizer = config.optimization.minimizer || [];
      config.optimization.minimizer.push(
        new (require("terser-webpack-plugin"))({
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true,
              // Remove legacy JavaScript features
              ecma: 2020,
              passes: 2,
            },
            mangle: {
              safari10: false,
            },
            format: {
              ecma: 2020,
            },
          },
        })
      );
    }

    // Bundle analyzer in development
    if (dev && process.env.ANALYZE === "true") {
      const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "server",
          openAnalyzer: true,
        })
      );
    }

    // Remove legacy JavaScript polyfills for modern browsers
    if (!dev && !isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // Remove Node.js polyfills
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }

    return config;
  },

  // Output configuration
  output: "standalone",

  // Build optimizations
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Performance monitoring
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;
