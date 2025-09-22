"use client";

import Image from "next/image";
import { useState, useCallback, useRef, useEffect } from "react";

interface AdvancedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  fill?: boolean;
  dataHint?: string;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
}

export const AdvancedImage: React.FC<AdvancedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  quality = 85,
  sizes,
  fill = false,
  dataHint,
  placeholder = "blur",
  blurDataURL,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before image comes into view
        threshold: 0.1,
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
  }, []);

  // Generate optimized image URL with multiple formats
  const getOptimizedSrc = useCallback(() => {
    if (!src || src.startsWith("data:") || src.startsWith("blur:")) {
      return src;
    }

    // Add optimization parameters
    const params = new URLSearchParams();
    if (quality) params.append("q", quality.toString());
    if (width) params.append("w", width.toString());
    if (height) params.append("h", height.toString());
    
    // Add format optimization
    params.append("f", "auto"); // Auto format selection
    
    const hasParams = src.includes("?");
    return `${src}${hasParams ? "&" : "?"}${params.toString()}`;
  }, [src, quality, width, height]);

  // Generate responsive sizes if not provided
  const getResponsiveSizes = useCallback(() => {
    if (sizes) return sizes;
    
    if (fill) {
      return "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";
    }
    
    if (width && height) {
      const aspectRatio = width / height;
      if (aspectRatio > 1.5) {
        // Wide images
        return "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw";
      } else if (aspectRatio < 0.8) {
        // Tall images
        return "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw";
      }
    }
    
    return "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";
  }, [sizes, fill, width, height]);

  // Generate blur placeholder
  const getBlurDataURL = useCallback(() => {
    if (blurDataURL) return blurDataURL;
    
    // Generate a simple gradient blur
    return "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";
  }, [blurDataURL]);

  const fallbackSrc = "/placeholder-property.jpg";
  const shouldLoad = priority || isInView;

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {/* Loading skeleton */}
      {isLoading && shouldLoad && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#F8FBF9] to-[#E6F2EC] animate-pulse rounded-lg" />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-lg">
          <div className="text-gray-400 text-sm">Failed to load image</div>
        </div>
      )}

      {/* Main image */}
      {shouldLoad && (
        <Image
          src={hasError ? fallbackSrc : getOptimizedSrc()}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          className={`transition-opacity duration-500 ${
            isLoading ? "opacity-0" : "opacity-100"
          } ${className}`}
          onLoad={handleLoad}
          onError={handleError}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          quality={quality}
          sizes={getResponsiveSizes()}
          data-ai-hint={dataHint}
          placeholder={placeholder}
          blurDataURL={getBlurDataURL()}
        />
      )}

      {/* Placeholder for non-loaded images */}
      {!shouldLoad && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#F8FBF9] to-[#E6F2EC] rounded-lg" />
      )}
    </div>
  );
};

export default AdvancedImage;
