"use client";

import Image from "next/image";
import React, { useState, useCallback, useMemo, memo } from "react";
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
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([initialImageIndex]));

  // Ensure currentIndex is within bounds
  const safeCurrentIndex = useMemo(() => 
    Math.max(0, Math.min(currentIndex, images.length - 1)),
    [currentIndex, images.length]
  );
  
  const currentImage = useMemo(() => images[safeCurrentIndex], [images, safeCurrentIndex]);

  // Preload adjacent images for smoother navigation
  const preloadAdjacentImages = useCallback((index: number) => {
    const indicesToPreload = [
      index - 1 >= 0 ? index - 1 : images.length - 1,
      index + 1 < images.length ? index + 1 : 0,
    ];
    
    indicesToPreload.forEach((idx) => {
      if (!loadedImages.has(idx)) {
        const img = new window.Image();
        img.src = images[idx].src;
        setLoadedImages((prev) => new Set([...prev, idx]));
      }
    });
  }, [images, loadedImages]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => {
      const newIndex = prev === 0 ? images.length - 1 : prev - 1;
      preloadAdjacentImages(newIndex);
      return newIndex;
    });
  }, [images.length, preloadAdjacentImages]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const newIndex = prev === images.length - 1 ? 0 : prev + 1;
      preloadAdjacentImages(newIndex);
      return newIndex;
    });
  }, [images.length, preloadAdjacentImages]);

  const goToSlide = useCallback((slideIndex: number) => {
    setCurrentIndex(slideIndex);
    preloadAdjacentImages(slideIndex);
  }, [preloadAdjacentImages]);

  // Close fullscreen on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape" && isFullscreen) {
      setIsFullscreen(false);
    }
  }, [isFullscreen]);

  React.useEffect(() => {
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
      <div className="relative aspect-[4/3] w-full overflow-hidden group">
        <Image
          src={currentImage.src}
          alt={currentImage.alt}
          fill
          className="object-cover transition-opacity duration-300"
          priority={safeCurrentIndex === 0}
          quality={75}
          sizes="(max-width: 1024px) 100vw, 66vw"
          loading={safeCurrentIndex === 0 ? "eager" : "lazy"}
        />

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevious}
              aria-label="Previous image"
              className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 rounded-full h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              aria-label="Next image"
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 rounded-full h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        {/* Fullscreen button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsFullscreen(true)}
          aria-label="View image in fullscreen"
          className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute top-4 left-4 bg-black/50 text-white text-sm px-2 py-1 rounded">
            {safeCurrentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation - Optimized */}
      {images.length > 1 && (
        <div className="mt-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {images.map((image, index) => (
              <button
                key={`${image.src}-${index}`}
                onClick={() => goToSlide(index)}
                aria-label={`View image ${index + 1} of ${images.length}`}
                aria-current={index === safeCurrentIndex ? "true" : "false"}
                className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  index === safeCurrentIndex
                    ? "border-[#8EB69B] ring-2 ring-[#8EB69B]/20"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Image
                  src={image.src}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  quality={60}
                  loading="lazy"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Modal - Lazy loaded */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
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
            className="absolute top-4 right-4 z-10 text-white bg-black/30 hover:bg-black/50 rounded-full h-12 w-12"
          >
            <X className="h-6 w-6" />
          </Button>

          <div 
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              className="object-contain"
              quality={85}
              sizes="100vw"
            />
          </div>

          {/* Fullscreen Navigation */}
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
                className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 rounded-full h-12 w-12"
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
                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 rounded-full h-12 w-12"
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
