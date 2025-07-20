"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useIntersectionObserver, performanceMonitor } from "@/lib/performance";

interface VirtualGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight?: number;
  itemsPerRow?: number;
  overscan?: number;
  className?: string;
  gap?: number;
  loading?: boolean;
  onLoadMore?: () => void;
  hasNextPage?: boolean;
  containerHeight?: number;
}

export function VirtualGrid<T>({
  items,
  renderItem,
  itemHeight = 400,
  itemsPerRow = 3,
  overscan = 5,
  className = "",
  gap = 24,
  loading = false,
  onLoadMore,
  hasNextPage = false,
  containerHeight = 800,
}: VirtualGridProps<T>) {
  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Performance monitoring
  useEffect(() => {
    performanceMonitor.markStart("virtual-grid-render");
    return () => {
      performanceMonitor.markEnd("virtual-grid-render");
    };
  }, [visibleItems]);

  // Calculate virtual scrolling dimensions
  const { rowCount, totalHeight, rowHeight } = useMemo(() => {
    const rows = Math.ceil(items.length / itemsPerRow);
    const rowH = itemHeight + gap;
    const totalH = rows * rowH;
    return {
      rowCount: rows,
      totalHeight: totalH,
      rowHeight: rowH,
    };
  }, [items.length, itemsPerRow, itemHeight, gap]);

  // Intersection observer for load more
  useIntersectionObserver(
    loadMoreRef,
    useCallback(() => {
      if (hasNextPage && !loading && onLoadMore) {
        onLoadMore();
      }
    }, [hasNextPage, loading, onLoadMore]),
    { threshold: 0.1, rootMargin: "200px" }
  );

  // Update visible items based on scroll position
  const updateVisibleItems = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const startRow = Math.floor(scrollTop / rowHeight);
    const endRow = Math.min(
      startRow + Math.ceil(containerHeight / rowHeight) + overscan * 2,
      rowCount
    );

    const start = Math.max(0, (startRow - overscan) * itemsPerRow);
    const end = Math.min(items.length, endRow * itemsPerRow);

    setVisibleRange({ start, end });
    setVisibleItems(items.slice(start, end));
    setScrollTop(scrollTop);
  }, [
    items,
    itemHeight,
    itemsPerRow,
    overscan,
    gap,
    rowCount,
    containerHeight,
    rowHeight,
  ]);

  // Handle scroll events with throttling
  const handleScroll = useCallback(() => {
    requestAnimationFrame(updateVisibleItems);
  }, [updateVisibleItems]);

  useEffect(() => {
    updateVisibleItems();
  }, [updateVisibleItems]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  // Calculate offset for virtual positioning
  const offsetY = Math.floor(visibleRange.start / itemsPerRow) * rowHeight;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-auto ${className}`}
      style={{ height: containerHeight }}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            display: "grid",
            gridTemplateColumns: `repeat(${itemsPerRow}, 1fr)`,
            gap: `${gap}px`,
            padding: `${gap}px`,
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={`virtual-item-${visibleRange.start + index}`}
              style={{ minHeight: itemHeight }}
              className="virtual-grid-item"
            >
              <LazyPropertyCard threshold={0.1}>
                {renderItem(item, visibleRange.start + index)}
              </LazyPropertyCard>
            </div>
          ))}
        </div>

        {/* Load more trigger */}
        {hasNextPage && (
          <div
            ref={loadMoreRef}
            className="flex justify-center items-center py-8"
            style={{
              transform: `translateY(${Math.max(totalHeight - 200, 0)}px)`,
            }}
          >
            {loading ? (
              <div className="flex items-center space-x-2 text-secondary">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-secondary"></div>
                <span className="font-medium">Loading more properties...</span>
              </div>
            ) : (
              <div className="text-card-foreground/60 font-medium">
                Scroll to load more
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Lazy loading property card wrapper with intersection observer
interface LazyPropertyCardProps {
  children: React.ReactNode;
  threshold?: number;
}

export function LazyPropertyCard({
  children,
  threshold = 0.1,
}: LazyPropertyCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useIntersectionObserver(
    cardRef,
    useCallback(() => {
      setIsVisible(true);
    }, []),
    { threshold, rootMargin: "100px" }
  );

  return (
    <div ref={cardRef} className="lazy-property-card h-full">
      {isVisible ? children : <PropertyCardSkeleton />}
    </div>
  );
}

// Optimized skeleton loader
function PropertyCardSkeleton() {
  return (
    <div className="h-full bg-card border border-border rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-gradient-to-br from-muted/50 to-muted/80 rounded-t-xl relative">
        <div className="absolute top-4 right-4 w-16 h-6 bg-muted rounded-full"></div>
        <div className="absolute top-4 left-4 w-8 h-8 bg-muted rounded-full"></div>
        <div className="absolute bottom-4 left-4 w-20 h-8 bg-muted rounded-lg"></div>
      </div>
      <div className="p-6 space-y-4">
        <div className="h-6 bg-muted rounded w-3/4"></div>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-muted rounded-xl"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-muted rounded-xl"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-muted rounded-xl"></div>
            <div className="h-4 bg-muted rounded w-1/3"></div>
          </div>
        </div>
        <div className="w-16 h-6 bg-muted rounded"></div>
        <div className="h-12 bg-muted rounded-buttons mt-4"></div>
      </div>
    </div>
  );
}

// Performance-optimized grid for mobile
export function MobileOptimizedGrid<T>({
  items,
  renderItem,
  ...props
}: VirtualGridProps<T>) {
  return (
    <VirtualGrid
      {...props}
      items={items}
      renderItem={renderItem}
      itemsPerRow={1}
      itemHeight={350}
      gap={16}
      containerHeight={600}
    />
  );
}

export default VirtualGrid;
