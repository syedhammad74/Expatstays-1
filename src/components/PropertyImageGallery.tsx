"use client";

import Image from "next/image";
import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { ChevronLeft, ChevronRight, Maximize2, X, Share2 } from "lucide-react";
import { useSwipe } from "@/hooks/use-swipe";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState<Set<number>>(
    new Set([initialImageIndex])
  );
  const galleryRef = useRef<HTMLDivElement>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout>();

  // Preload adjacent images for smoother transitions
  useEffect(() => {
    const preloadImage = (index: number) => {
      if (index >= 0 && index < images.length && !preloadedImages.has(index)) {
        const img = new Image();
        img.src = images[index].src;
        setPreloadedImages((prev) => new Set([...prev, index]));
      }
    };

    // Preload previous and next images
    preloadImage(currentIndex - 1);
    preloadImage(currentIndex + 1);
  }, [currentIndex, images, preloadedImages]);

  // Memoize navigation functions to prevent unnecessary re-renders
  const goToPrevious = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

    // Clear existing timeout
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    // Reset transition state after animation
    transitionTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  }, [images.length, isTransitioning]);

  const goToNext = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

    // Clear existing timeout
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    // Reset transition state after animation
    transitionTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  }, [images.length, isTransitioning]);

  const goToSlide = useCallback(
    (slideIndex: number) => {
      if (isTransitioning || slideIndex === currentIndex) return;

      setIsTransitioning(true);
      setCurrentIndex(slideIndex);

      // Clear existing timeout
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }

      // Reset transition state after animation
      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    },
    [currentIndex, isTransitioning]
  );

  // Memoize current image to prevent unnecessary recalculations
  const currentImage = useMemo(
    () => images[currentIndex],
    [images, currentIndex]
  );

  // Add swipe support for mobile
  const swipeHandlers = useSwipe({
    onSwipeLeft: () => {
      if (!isTransitioning) {
        goToNext();
      }
    },
    onSwipeRight: () => {
      if (!isTransitioning) {
        goToPrevious();
      }
    },
    threshold: 50,
  });

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-video w-full bg-muted rounded-components flex items-center justify-center text-muted-foreground">
        No images available.
      </div>
    );
  }

  return (
    <>
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-[#EBEBEB]/70 overflow-hidden relative">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F8FBF9]/20 to-[#E6F2EC]/10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#8EB69B]/5 to-[#DAF1DE]/3 rounded-full blur-2xl"></div>

        <div className="relative z-10">
          {/* Main Image Container - Optimized for performance */}
          <div
            ref={galleryRef}
            className="relative aspect-[4/3] w-full overflow-hidden group"
            onTouchStart={swipeHandlers.onTouchStart}
            onTouchMove={swipeHandlers.onTouchMove}
            onTouchEnd={swipeHandlers.onTouchEnd}
          >
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              className={`transition-all duration-300 ease-out transform group-hover:scale-105 object-cover ${
                isTransitioning ? "opacity-90" : "opacity-100"
              }`}
              data-ai-hint={currentImage.hint || "luxury property interior"}
              loading={preloadedImages.has(currentIndex) ? "eager" : "lazy"}
              priority={currentIndex === 0}
              quality={90}
            />

            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Image counter */}
            <div className="absolute top-4 left-4">
              <Badge className="bg-white/95 backdrop-blur-sm text-[#051F20] border-0 shadow-lg text-sm font-semibold px-3 py-1 rounded-full">
                {currentIndex + 1} / {images.length}
              </Badge>
            </div>

            {/* Action buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 rounded-full bg-white/95 backdrop-blur-sm hover:bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setIsFullscreen(true)}
              >
                <Maximize2 className="h-4 w-4 text-[#051F20]" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 rounded-full bg-white/95 backdrop-blur-sm hover:bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Share2 className="h-4 w-4 text-[#051F20]" />
              </Button>
            </div>

            {/* Navigation buttons - Optimized */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToPrevious}
                  disabled={isTransitioning}
                  className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 rounded-full h-10 w-10 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg disabled:opacity-50"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToNext}
                  disabled={isTransitioning}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 rounded-full h-10 w-10 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg disabled:opacity-50"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>

          {/* Enhanced Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="p-6 bg-gradient-to-r from-[#F8FBF9]/50 to-[#E6F2EC]/30">
              <div className="flex justify-center space-x-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    disabled={isTransitioning}
                    className={`h-14 w-14 lg:h-16 lg:w-16 rounded-2xl overflow-hidden transition-all duration-300 border-2 flex-shrink-0 group/thumb
                      ${
                        currentIndex === index
                          ? "border-[#8EB69B] scale-110 shadow-lg shadow-[#8EB69B]/20"
                          : "border-[#DAF1DE]/50 opacity-80 hover:opacity-100 hover:border-[#8EB69B]/70 hover:scale-105"
                      } ${isTransitioning ? "opacity-70" : "opacity-100"}`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <Image
                      src={image.src}
                      alt={`Thumbnail ${image.alt}`}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                      data-ai-hint={image.hint || "property detail thumbnail"}
                      loading="lazy"
                      quality={75}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-7xl max-h-full">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreen(false)}
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
                data-ai-hint={
                  currentImage.hint || "luxury property interior fullscreen"
                }
                priority
              />
            </div>

            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToPrevious}
                  className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 rounded-full h-16 w-16"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToNext}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 rounded-full h-16 w-16"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-white/90 backdrop-blur-sm text-[#051F20] border-0 shadow-md text-lg font-semibold px-4 py-2">
                {currentIndex + 1} / {images.length}
              </Badge>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyImageGallery;
