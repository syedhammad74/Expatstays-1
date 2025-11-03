"use client";

import Image from "next/image";
import React, { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyImageGalleryProps {
  images: { src: string; alt: string; hint?: string }[];
  initialImageIndex?: number;
}

const PropertyImageGallery: React.FC<PropertyImageGalleryProps> = ({
  images,
  initialImageIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialImageIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Ensure currentIndex is within bounds
  const safeCurrentIndex = Math.max(
    0,
    Math.min(currentIndex, images.length - 1)
  );
  const currentImage = images[safeCurrentIndex];

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const goToSlide = useCallback((slideIndex: number) => {
    setCurrentIndex(slideIndex);
  }, []);

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
          className="object-cover transition-all duration-300 ease-out transform group-hover:scale-105"
          priority={safeCurrentIndex === 0}
          quality={90}
          unoptimized={currentImage.src.includes('.JPG') || currentImage.src.includes('.jpg')}
        />

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevious}
              aria-label="Previous image"
              className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 rounded-full h-10 w-10 opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              aria-label="Next image"
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 rounded-full h-10 w-10 opacity-0 group-hover:opacity-100 transition-all duration-300"
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
          className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full h-10 w-10 opacity-0 group-hover:opacity-100 transition-all duration-300"
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

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="mt-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
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
                  quality={75}
                  unoptimized={image.src.includes('.JPG') || image.src.includes('.jpg')}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreen(false)}
            aria-label="Close fullscreen image view"
            className="absolute top-4 right-4 z-10 text-white bg-black/30 hover:bg-black/50 rounded-full h-12 w-12"
          >
            <X className="h-6 w-6" />
          </Button>

          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              className="object-contain"
              priority
              unoptimized={currentImage.src.includes('.JPG') || currentImage.src.includes('.jpg')}
            />
          </div>

          {/* Fullscreen Navigation */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPrevious}
                aria-label="Previous image"
                className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 rounded-full h-12 w-12"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToNext}
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
};

export default PropertyImageGallery;
