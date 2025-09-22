"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import PropertyCard, { PropertyCardProps } from "./PropertyCard";

interface VirtualizedPropertyGridProps {
  properties: PropertyCardProps[];
  containerHeight?: number;
  itemsPerPage?: number;
}

const VirtualizedPropertyGrid: React.FC<VirtualizedPropertyGridProps> = ({
  properties,
  containerHeight = 600,
  itemsPerPage = 12,
}) => {
  const [visibleRange, setVisibleRange] = useState({
    start: 0,
    end: itemsPerPage,
  });
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Calculate visible properties
  const visibleProperties = useMemo(() => {
    return properties.slice(visibleRange.start, visibleRange.end);
  }, [properties, visibleRange]);

  // Load more properties when reaching the end
  const loadMore = useCallback(() => {
    if (isLoading || visibleRange.end >= properties.length) return;

    setIsLoading(true);

    // Simulate loading delay for better UX
    setTimeout(() => {
      setVisibleRange((prev) => ({
        start: prev.start,
        end: Math.min(prev.end + itemsPerPage, properties.length),
      }));
      setIsLoading(false);
    }, 300);
  }, [isLoading, visibleRange.end, properties.length, itemsPerPage]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    const lastElement = containerRef.current?.querySelector(
      ".property-card:last-child"
    );

    if (lastElement) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadMore();
          }
        },
        { threshold: 0.1 }
      );

      observerRef.current.observe(lastElement);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [visibleProperties, loadMore]);

  if (properties.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No properties found
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto"
      >
        {visibleProperties.map((property, index) => (
          <div key={property.slug} className="property-card">
            <PropertyCard {...property} />
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8EB69B]"></div>
        </div>
      )}

      {/* Load more button (fallback) */}
      {!isLoading && visibleRange.end < properties.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            className="px-6 py-3 bg-[#8EB69B] text-white rounded-lg hover:bg-[#235347] transition-colors"
          >
            Load More Properties ({properties.length - visibleRange.end}{" "}
            remaining)
          </button>
        </div>
      )}
    </div>
  );
};

export default VirtualizedPropertyGrid;
