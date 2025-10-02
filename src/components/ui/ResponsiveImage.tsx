"use client";

import Image from "next/image";
import { useState } from "react";

interface ResponsiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  loading?: "lazy" | "eager";
  draggable?: boolean;
}

/**
 * High-performance responsive image component
 * Automatically serves WebP/AVIF with fallbacks
 * Includes blur placeholder and error handling
 */
export default function ResponsiveImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  quality = 75,
  loading = "lazy",
  draggable = true,
}: ResponsiveImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Generate optimized src set for different formats and sizes
  const getOptimizedSrc = (originalSrc: string) => {
    // If it's already optimized or external, return as-is
    if (originalSrc.includes("optimized") || originalSrc.startsWith("http")) {
      return originalSrc;
    }

    // Convert to optimized path
    const pathParts = originalSrc.split("/");
    const filename = pathParts[pathParts.length - 1];
    const nameWithoutExt = filename.split(".")[0];
    const folder = pathParts.slice(0, -1).join("/");

    // Default to medium size for primary src
    return `${folder.replace(
      "/media",
      "/optimized"
    )}/${nameWithoutExt}-800w.webp`;
  };

  const generateSrcSet = (originalSrc: string) => {
    if (originalSrc.includes("optimized") || originalSrc.startsWith("http")) {
      return undefined;
    }

    const pathParts = originalSrc.split("/");
    const filename = pathParts[pathParts.length - 1];
    const nameWithoutExt = filename.split(".")[0];
    const folder = pathParts.slice(0, -1).join("/");
    const optimizedFolder = folder.replace("/media", "/optimized");

    return [
      `${optimizedFolder}/${nameWithoutExt}-400w.webp 400w`,
      `${optimizedFolder}/${nameWithoutExt}-800w.webp 800w`,
      `${optimizedFolder}/${nameWithoutExt}-1200w.webp 1200w`,
    ].join(", ");
  };

  // Blur placeholder data URL
  const blurDataURL =
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

  if (hasError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
      >
        <span className="text-gray-500 text-sm">Image failed to load</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <Image
        src={getOptimizedSrc(src)}
        srcSet={generateSrcSet(src)}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        className={`transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        } ${className}`}
        priority={priority}
        quality={quality}
        sizes={sizes}
        placeholder="blur"
        blurDataURL={blurDataURL}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => setHasError(true)}
        loading={priority ? "eager" : loading}
        draggable={draggable}
        fetchPriority={priority ? "high" : undefined}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
    </div>
  );
}
