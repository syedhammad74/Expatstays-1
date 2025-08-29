"use client";

import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

type InViewVideoProps = {
  src: string;
  poster?: string;
  className?: string;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  onClick?: () => void;
  enableMuteToggle?: boolean;
};

export default function InViewVideo({
  src,
  poster,
  className,
  muted = true,
  loop = true,
  playsInline = true,
  onClick,
  enableMuteToggle,
}: InViewVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(muted);

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

  useEffect(() => {
    setIsMuted(muted);
  }, [muted]);

  const handleToggleMute = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const videoEl = videoRef.current;
    if (!videoEl) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoEl.muted = nextMuted;
    if (!nextMuted) {
      const playPromise = videoEl.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.catch(() => {});
      }
    }
  };

  return (
    <div className="relative">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted={isMuted}
        loop={loop}
        playsInline={playsInline}
        className={className}
        controls={false}
        preload="metadata"
        onClick={onClick}
      />
      {enableMuteToggle && (
        <button
          type="button"
          onClick={handleToggleMute}
          className="absolute bottom-3 right-3 bg-black/50 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </button>
      )}
    </div>
  );
}
