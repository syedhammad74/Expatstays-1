"use client";

import React, { useEffect, useRef } from "react";

type InViewVideoProps = {
  src: string;
  poster?: string;
  className?: string;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  onClick?: () => void;
};

export default function InViewVideo({
  src,
  poster,
  className,
  muted = true,
  loop = true,
  playsInline = true,
  onClick,
}: InViewVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      const entry = entries[0];
      if (!entry || !videoEl) return;
      if (entry.isIntersecting) {
        const playPromise = videoEl.play();
        if (playPromise && typeof playPromise.then === "function") {
          playPromise.catch(() => {});
        }
      } else {
        videoEl.pause();
      }
    };

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.35,
    });
    observer.observe(videoEl);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      className={className}
      controls={false}
      preload="metadata"
      onClick={onClick}
    />
  );
}
