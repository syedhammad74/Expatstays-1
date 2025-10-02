"use client";

import React, { useEffect, useState } from "react";

interface DecorativeElementsProps {
  variant?: "default" | "minimal" | "accent";
  density?: "low" | "medium" | "high";
}

export function DecorativeElements({
  variant = "default",
  density = "medium",
}: DecorativeElementsProps) {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial width
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Don't render on mobile
  if (windowWidth < 768) return null;

  // Render minimal version on tablet
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  // Determine number of elements based on density
  const elementCount = {
    low: 3,
    medium: 5,
    high: 8,
  }[density];

  // Determine colors based on variant
  const colors = {
    default: [
      "bg-forest-light/20",
      "bg-forest-medium/10",
      "bg-forest-primary/15",
    ],
    minimal: ["bg-muted/10", "bg-muted/15", "bg-muted/20"],
    accent: ["bg-accent/10", "bg-accent/15", "bg-primary/10"],
  }[variant];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({
        length: isTablet ? Math.min(3, elementCount) : elementCount,
      }).map((_, i) => {
        // Use deterministic values to prevent hydration mismatch
        const size = ((i * 37 + 13) % 150) + 50; // Deterministic size based on index
        const xPos = ((i * 23 + 7) % 80) + 10; // Deterministic X position
        const yPos = ((i * 41 + 17) % 70) + 15; // Deterministic Y position
        const color = colors[i % colors.length];

        return (
          <div
            key={i}
            className={`absolute rounded-full ${color} blur-xl animate-parallax-slow`}
            style={{
              width: size,
              height: size,
              left: `${xPos}%`,
              top: `${yPos}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        );
      })}
    </div>
  );
}
