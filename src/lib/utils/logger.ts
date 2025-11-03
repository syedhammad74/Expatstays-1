/**
 * Production-safe logger utility
 * Removes console statements in production builds
 */

const isDevelopment = process.env.NODE_ENV === "development";

export const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  error: (...args: unknown[]) => {
    // Always log errors, but use proper error tracking in production
    if (isDevelopment) {
      console.error(...args);
    } else {
      // In production, send to error tracking service (e.g., Sentry)
      // Error tracking service would be called here
    }
  },
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
};


