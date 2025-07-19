import React from "react";
import { cn } from "@/lib/utils";

interface CardSpotlightProps {
  className?: string;
  children: React.ReactNode;
}

export function CardSpotlight({ className, children }: CardSpotlightProps) {
  return (
    <div
      className={cn(
        "relative rounded-3xl bg-[#0B2B26] shadow-2xl overflow-hidden p-8 flex flex-col justify-center items-start",
        className
      )}
    >
      {/* Spotlight/gradient effect */}
      <div className="absolute -top-1/3 left-1/2 -translate-x-1/2 w-2/3 h-2/3 bg-gradient-to-br from-[#8EB69B]/40 to-transparent rounded-full blur-2xl opacity-70 z-0" />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
