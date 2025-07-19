'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PropertyImageGalleryProps {
  images: { src: string; alt: string, hint?: string }[];
}

const PropertyImageGallery: React.FC<PropertyImageGalleryProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

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
    <Card className="overflow-hidden shadow-xl bg-card">
      <CardContent className="p-2 md:p-4">
        <div className="relative aspect-[16/9] w-full rounded-components overflow-hidden group">
          <Image
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            fill
            className="transition-all duration-500 ease-in-out transform group-hover:scale-105"
            data-ai-hint={images[currentIndex].hint || "luxury property interior"}
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            className="absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 rounded-full h-10 w-10 md:h-12 md:w-12"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6 md:h-7 md:w-7" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 rounded-full h-10 w-10 md:h-12 md:w-12"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6 md:h-7 md:w-7" />
          </Button>
        </div>
        
        <div className="mt-2 md:mt-4 flex justify-center space-x-1 md:space-x-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
                              className={`h-12 w-12 md:h-16 md:w-16 lg:h-20 lg:w-20 rounded-components overflow-hidden transition-all duration-200 border-2
                ${currentIndex === index ? 'border-primary scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image.src}
                alt={`Thumbnail ${image.alt}`}
                width={80}
                height={80}
                className="h-full w-full"
                data-ai-hint={image.hint || "property detail thumbnail"}
              />
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyImageGallery;
