"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends Omit<ImageProps, "onLoad"> {
  lowQualitySrc?: string;
  fadeIn?: boolean;
  loadingClassName?: string;
}

export function OptimizedImage({
  src,
  alt,
  lowQualitySrc,
  fadeIn = true,
  className,
  loadingClassName,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref, isIntersecting } = useIntersectionObserver();
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (isIntersecting) {
      setShouldLoad(true);
    }
  }, [isIntersecting]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      {shouldLoad ? (
        <Image
          src={src}
          alt={alt}
          className={cn(
            fadeIn && "transition-opacity duration-500",
            fadeIn && !isLoaded ? "opacity-0" : "opacity-100",
            className
          )}
          onLoadingComplete={() => setIsLoaded(true)}
          {...props}
        />
      ) : (
        <div
          className={cn(
            "w-full h-full bg-muted/20 animate-pulse rounded-md",
            loadingClassName
          )}
        />
      )}
    </div>
  );
}
