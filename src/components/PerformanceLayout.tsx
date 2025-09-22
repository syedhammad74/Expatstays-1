"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface PerformanceLayoutProps {
  children: ReactNode;
  preloadRoutes?: string[];
  criticalCSS?: string;
}

export default function PerformanceLayout({
  children,
  preloadRoutes = [],
  criticalCSS,
}: PerformanceLayoutProps) {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    
    // Preload critical routes
    preloadRoutes.forEach((route) => {
      router.prefetch(route);
    });

    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload fonts
      const fontLink = document.createElement('link');
      fontLink.rel = 'preload';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap';
      fontLink.as = 'style';
      document.head.appendChild(fontLink);

      // Preload critical images
      const criticalImages = [
        '/logo.png',
        '/media/famhouse/DSC02226.jpg',
        '/media/blogs-appartments/EX-1.JPG',
      ];

      criticalImages.forEach((src) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = src;
        link.as = 'image';
        document.head.appendChild(link);
      });
    };

    // DNS prefetch for external domains
    const dnsPrefetchDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://firebasestorage.googleapis.com',
    ];

    dnsPrefetchDomains.forEach((domain) => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });

    preloadCriticalResources();

    // Performance monitoring
    if (process.env.NODE_ENV === 'development') {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            console.log('🚀 Page Load Performance:', {
              domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.fetchStart,
              loadComplete: navEntry.loadEventEnd - navEntry.fetchStart,
              firstByte: navEntry.responseStart - navEntry.fetchStart,
            });
          }
        });
      });

      observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
    }
  }, [preloadRoutes, router]);

  // Inject critical CSS
  useEffect(() => {
    if (criticalCSS && typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.textContent = criticalCSS;
      document.head.appendChild(style);
    }
  }, [criticalCSS]);

  return (
    <>
      {/* Critical CSS */}
      {criticalCSS && (
        <style
          dangerouslySetInnerHTML={{ __html: criticalCSS }}
        />
      )}
      
      {/* Main content */}
      {isClient ? children : (
        <div className="min-h-screen bg-gradient-to-br from-[#F8FBF9] to-[#E6F2EC]">
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8EB69B]"></div>
          </div>
        </div>
      )}
    </>
  );
}
