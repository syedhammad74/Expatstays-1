"use client";

import Image from "next/image";
import React, { useState, useCallback, useMemo, memo, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyImageGalleryProps {
  images: { src: string; alt: string; hint?: string }[];
  initialImageIndex?: number;
}

const PropertyImageGallery: React.FC<PropertyImageGalleryProps> = memo(({
  images,
  initialImageIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialImageIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Ensure currentIndex is within bounds
  const safeCurrentIndex = useMemo(() =>
    Math.max(0, Math.min(currentIndex, images.length - 1)),
    [currentIndex, images.length]
  );

  const currentImage = useMemo(() => {
    if (!images || images.length === 0) return null;
    return images[safeCurrentIndex] || images[0];
  }, [images, safeCurrentIndex]);

  // Preload adjacent images aggressively
  useEffect(() => {
    if (typeof window === 'undefined' || !images || images.length === 0) return;

    const preloadImage = (src: string) => {
      try {
        const img = new window.Image();
        img.src = src;
      } catch (error) {
        // Silently fail if image preload fails
      }
    };

    // Preload current, previous, and next images
    const indicesToPreload = [
      safeCurrentIndex,
      safeCurrentIndex - 1 >= 0 ? safeCurrentIndex - 1 : images.length - 1,
      safeCurrentIndex + 1 < images.length ? safeCurrentIndex + 1 : 0,
    ];

    indicesToPreload.forEach((idx) => {
      if (images[idx] && images[idx].src) {
        preloadImage(images[idx].src);
      }
    });
  }, [safeCurrentIndex, images]); // Include images array properly

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const goToSlide = useCallback((slideIndex: number) => {
    setCurrentIndex(slideIndex);
  }, []);

  // Touch swipe handlers for mobile
  const minSwipeDistance = 50;

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    }
    if (isRightSwipe) {
      goToPrevious();
    }
  }, [touchStart, touchEnd, goToNext, goToPrevious]);

  // Close fullscreen on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape" && isFullscreen) {
      setIsFullscreen(false);
    } else if (e.key === "ArrowLeft" && isFullscreen) {
      goToPrevious();
    } else if (e.key === "ArrowRight" && isFullscreen) {
      goToNext();
    }
  }, [isFullscreen, goToPrevious, goToNext]);

  useEffect(() => {
    if (isFullscreen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isFullscreen, handleKeyDown]);

  if (!currentImage) {
    return (
      <div className="aspect-[4/3] bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="relative" role="region" aria-label="Property image gallery">
      {/* Main Image Container */}
      <div
        ref={containerRef}
        className="relative aspect-[4/3] w-full overflow-hidden group touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <Image
          src={currentImage.src}
          alt={currentImage.alt}
          fill
          className="object-cover transition-opacity duration-150"
          priority={safeCurrentIndex === 0}
          quality={70}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 66vw, 66vw"
          loading={safeCurrentIndex === 0 ? "eager" : "lazy"}
        />

        {/* Navigation buttons - Always visible on mobile, hover on desktop */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevious}
              aria-label="Previous image"
              className="absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 text-white bg-black/60 hover:bg-black/80 md:bg-black/50 md:hover:bg-black/70 rounded-full h-10 w-10 md:h-12 md:w-12 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-150 z-10 touch-manipulation"
            >
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              aria-label="Next image"
              className="absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 text-white bg-black/60 hover:bg-black/80 md:bg-black/50 md:hover:bg-black/70 rounded-full h-10 w-10 md:h-12 md:w-12 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-150 z-10 touch-manipulation"
            >
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
            </Button>
          </>
        )}

        {/* Fullscreen button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsFullscreen(true)}
          aria-label="View image in fullscreen"
          className="absolute top-3 right-3 md:top-4 md:right-4 text-white bg-black/60 hover:bg-black/80 md:bg-black/50 md:hover:bg-black/70 rounded-full h-9 w-9 md:h-10 md:w-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-150 z-10 touch-manipulation"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-black/60 md:bg-black/50 text-white text-xs md:text-sm px-2 py-1 rounded z-10">
            {safeCurrentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation - Optimized */}
      {images.length > 1 && (
        <div className="mt-4">
          <div
            className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide touch-pan-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {images.map((image, index) => (
              <button
                key={`${image.src}-${index}`}
                onClick={() => goToSlide(index)}
                aria-label={`View image ${index + 1} of ${images.length}`}
                aria-current={index === safeCurrentIndex ? "true" : "false"}
                className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-150 touch-manipulation ${index === safeCurrentIndex
                    ? "border-[#8EB69B] ring-2 ring-[#8EB69B]/20 scale-105"
                    : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <Image
                  src={image.src}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  quality={50}
                  loading="lazy"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Modal - Optimized */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/98 flex items-center justify-center p-4"
          onClick={() => setIsFullscreen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen image view"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setIsFullscreen(false);
            }}
            aria-label="Close fullscreen image view"
            className="absolute top-4 right-4 z-10 text-white bg-black/40 hover:bg-black/60 rounded-full h-12 w-12 touch-manipulation"
          >
            <X className="h-6 w-6" />
          </Button>

          <div
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              className="object-contain"
              quality={80}
              sizes="100vw"
              priority
            />
          </div>

          {/* Fullscreen Navigation - Always visible */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                aria-label="Previous image"
                className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full h-12 w-12 touch-manipulation"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                aria-label="Next image"
                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full h-12 w-12 touch-manipulation"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
});

PropertyImageGallery.displayName = "PropertyImageGallery";

export default PropertyImageGallery;
