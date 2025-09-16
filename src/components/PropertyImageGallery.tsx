"use client";

import Image from "next/image";
import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Download,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PropertyImageGalleryProps {
  images: { src: string; alt: string; hint?: string }[];
}

const PropertyImageGallery: React.FC<PropertyImageGalleryProps> = ({
  images,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-video w-full bg-muted rounded-components flex items-center justify-center text-muted-foreground">
        No images available.
      </div>
    );
  }

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <>
      <Card className="overflow-hidden shadow-xl bg-white border border-[#EBEBEB]/70 rounded-2xl">
        <CardContent className="p-0">
          <div className="relative aspect-[16/9] w-full overflow-hidden group">
            <Image
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              fill
              className="transition-all duration-500 ease-in-out transform group-hover:scale-105 object-cover"
              data-ai-hint={
                images[currentIndex].hint || "luxury property interior"
              }
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Image counter */}
            <div className="absolute top-4 left-4">
              <Badge className="bg-white/90 backdrop-blur-sm text-[#051F20] border-0 shadow-md text-sm font-semibold px-3 py-1">
                {currentIndex + 1} / {images.length}
              </Badge>
            </div>

            {/* Action buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white border-0 shadow-md"
                onClick={() => setIsFullscreen(true)}
              >
                <Maximize2 className="h-4 w-4 text-[#051F20]" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white border-0 shadow-md"
              >
                <Share2 className="h-4 w-4 text-[#051F20]" />
              </Button>
            </div>

            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToPrevious}
                  className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 rounded-full h-12 w-12 opacity-0 group-hover:opacity-100 transition-all duration-300"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToNext}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 rounded-full h-12 w-12 opacity-0 group-hover:opacity-100 transition-all duration-300"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="p-4 bg-gradient-to-r from-[#F8FBF9] to-[#E6F2EC]">
              <div className="flex justify-center space-x-2 overflow-x-auto pb-1">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-16 w-16 lg:h-20 lg:w-20 rounded-xl overflow-hidden transition-all duration-200 border-2 flex-shrink-0
                      ${
                        currentIndex === index
                          ? "border-[#8EB69B] scale-105 shadow-lg"
                          : "border-transparent opacity-70 hover:opacity-100 hover:border-[#8EB69B]/50"
                      }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <Image
                      src={image.src}
                      alt={`Thumbnail ${image.alt}`}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                      data-ai-hint={image.hint || "property detail thumbnail"}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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
                src={images[currentIndex].src}
                alt={images[currentIndex].alt}
                fill
                className="object-contain"
                data-ai-hint={
                  images[currentIndex].hint ||
                  "luxury property interior fullscreen"
                }
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
