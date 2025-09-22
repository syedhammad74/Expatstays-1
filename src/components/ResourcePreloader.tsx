"use client";

import { useEffect } from 'react';

interface ResourcePreloaderProps {
  resources: {
    href: string;
    as?: 'script' | 'style' | 'image' | 'font' | 'fetch';
    type?: string;
    crossorigin?: 'anonymous' | 'use-credentials';
  }[];
}

export const ResourcePreloader: React.FC<ResourcePreloaderProps> = ({ resources }) => {
  useEffect(() => {
    // Preload critical resources
    resources.forEach((resource) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      
      if (resource.as) {
        link.as = resource.as;
      }
      
      if (resource.type) {
        link.type = resource.type;
      }
      
      if (resource.crossorigin) {
        link.crossOrigin = resource.crossorigin;
      }
      
      // Add to document head
      document.head.appendChild(link);
    });

    // Cleanup function
    return () => {
      resources.forEach((resource) => {
        const existingLink = document.querySelector(`link[href="${resource.href}"]`);
        if (existingLink && existingLink.getAttribute('rel') === 'preload') {
          document.head.removeChild(existingLink);
        }
      });
    };
  }, [resources]);

  return null; // This component doesn't render anything
};

// Preload critical fonts
export const FontPreloader: React.FC = () => {
  useEffect(() => {
    // Preload critical fonts
    const fonts = [
      {
        href: '/fonts/inter-var.woff2',
        as: 'font' as const,
        type: 'font/woff2',
        crossorigin: 'anonymous' as const,
      },
    ];

    fonts.forEach((font) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = font.href;
      link.as = font.as;
      link.type = font.type;
      link.crossOrigin = font.crossorigin;
      document.head.appendChild(link);
    });
  }, []);

  return null;
};

// Preload critical images
export const ImagePreloader: React.FC<{ images: string[] }> = ({ images }) => {
  useEffect(() => {
    images.forEach((imageSrc) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = imageSrc;
      link.as = 'image';
      document.head.appendChild(link);
    });
  }, [images]);

  return null;
};

// DNS prefetch for external domains
export const DNSPrefetcher: React.FC<{ domains: string[] }> = ({ domains }) => {
  useEffect(() => {
    domains.forEach((domain) => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = `//${domain}`;
      document.head.appendChild(link);
    });
  }, [domains]);

  return null;
};

export default ResourcePreloader;
