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
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    // Log video element properties for debugging (dev only)
    if (process.env.NODE_ENV !== "production") {
      console.log("Video element created:", {
        src: videoEl.src,
        muted: videoEl.muted,
        loop: videoEl.loop,
        playsInline: videoEl.playsInline,
        preload: videoEl.preload,
      });
    }

    // Handle video events
    const handlePlay = () => {
      setIsPlaying(true);
      if (process.env.NODE_ENV !== "production") {
        console.log("Video started playing");
      }
    };

    const handlePause = () => {
      setIsPlaying(false);
      if (process.env.NODE_ENV !== "production") {
        console.log("Video paused");
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (process.env.NODE_ENV !== "production") {
        console.log("Video ended");
      }
    };

    const handleUserInteraction = () => {
      setHasUserInteracted(true);
      if (process.env.NODE_ENV !== "production") {
        console.log("User interacted with video");
      }
    };

    const handleError = (e: Event) => {
      if (process.env.NODE_ENV !== "production") {
        console.error("Video error:", e);
      }
      const target = e.target as HTMLVideoElement;
      if (target.error) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Video error details:", {
            code: target.error.code,
            message: target.error.message,
          });
        }

        // Handle specific error codes
        switch (target.error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            if (process.env.NODE_ENV !== "production") console.log("Video loading was aborted");
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            if (process.env.NODE_ENV !== "production") console.log("Network error occurred while loading video");
            break;
          case MediaError.MEDIA_ERR_DECODE:
            if (process.env.NODE_ENV !== "production") console.log("Video decoding error - format may not be supported");
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            if (process.env.NODE_ENV !== "production") console.log("Video format not supported by browser");
            break;
          default:
            if (process.env.NODE_ENV !== "production") console.log("Unknown video error occurred");
        }
      }
      setHasError(true);
      setIsPlaying(false);
      setIsLoading(false);
    };

    const handleLoadedData = () => {
      if (process.env.NODE_ENV !== "production") {
        console.log("Video data loaded");
      }
      setIsLoading(false);
      setHasError(false);
    };

    const handleCanPlay = () => {
      if (process.env.NODE_ENV !== "production") {
        console.log("Video can play");
      }
      setIsLoading(false);
    };

    const handleLoadStart = () => {
      if (process.env.NODE_ENV !== "production") {
        console.log("Video load started");
      }
    };

    const handleProgress = () => {
      // noisy in prod; keep silent
      if (process.env.NODE_ENV !== "production") {
        console.log("Video loading progress");
      }
    };

    videoEl.addEventListener("play", handlePlay);
    videoEl.addEventListener("pause", handlePause);
    videoEl.addEventListener("ended", handleEnded);
    videoEl.addEventListener("click", handleUserInteraction);
    videoEl.addEventListener("touchstart", handleUserInteraction);
    videoEl.addEventListener("error", handleError);
    videoEl.addEventListener("loadeddata", handleLoadedData);
    videoEl.addEventListener("canplay", handleCanPlay);
    videoEl.addEventListener("loadstart", handleLoadStart);
    videoEl.addEventListener("progress", handleProgress);

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      const entry = entries[0];
      if (!entry || !videoEl) return;

      if (process.env.NODE_ENV !== "production") {
        console.log(
          "Video intersection:",
          entry.isIntersecting,
          "threshold:",
          entry.intersectionRatio
        );
      }

      if (entry.isIntersecting) {
        // Preload aggressively when nearing viewport for faster start
        try {
          videoEl.preload = "auto";
        } catch { }
        // Only attempt to play if user has interacted or if muted
        if (hasUserInteracted || isMuted) {
          if (process.env.NODE_ENV !== "production") {
            console.log("Attempting to play video");
          }
          const playPromise = videoEl.play();
          if (playPromise && typeof playPromise.then === "function") {
            playPromise.catch((error) => {
              if (process.env.NODE_ENV !== "production") {
                console.log("Video play failed:", error);
              }
              // If autoplay fails, set muted and try again
              if (!isMuted) {
                if (process.env.NODE_ENV !== "production") {
                  console.log("Retrying with muted video");
                }
                videoEl.muted = true;
                setIsMuted(true);
                videoEl.play().catch(console.error);
              }
            });
          }
        } else {
          if (process.env.NODE_ENV !== "production") {
            console.log("Video not playing - waiting for user interaction");
          }
        }
      } else {
        if (process.env.NODE_ENV !== "production") {
          console.log("Video out of view, pausing");
        }
        videoEl.pause();
      }
    };

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.15,
      rootMargin: "300px 0px", // start preloading earlier for smoother start
    });
    observer.observe(videoEl);

    return () => {
      observer.disconnect();
      videoEl.removeEventListener("play", handlePlay);
      videoEl.removeEventListener("pause", handlePause);
      videoEl.removeEventListener("ended", handleEnded);
      videoEl.removeEventListener("click", handleUserInteraction);
      videoEl.removeEventListener("touchstart", handleUserInteraction);
      videoEl.removeEventListener("error", handleError);
      videoEl.removeEventListener("loadeddata", handleLoadedData);
      videoEl.removeEventListener("canplay", handleCanPlay);
      videoEl.removeEventListener("loadstart", handleLoadStart);
      videoEl.removeEventListener("progress", handleProgress);
    };
  }, [isMuted, hasUserInteracted]);

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

    // Mark user interaction
    setHasUserInteracted(true);

    // Try to play if unmuting
    if (!nextMuted) {
      const playPromise = videoEl.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.catch((error) => {
          if (process.env.NODE_ENV !== "production") {
            console.log("Video play failed after unmute:", error);
          }
        });
      }
    }
  };

  const handleVideoClick = (e: React.MouseEvent<HTMLVideoElement>) => {
    e.stopPropagation();
    setHasUserInteracted(true);

    if (onClick) {
      onClick();
    } else {
      // Toggle play/pause if no onClick handler
      const videoEl = videoRef.current;
      if (videoEl) {
        if (isPlaying) {
          videoEl.pause();
        } else {
          videoEl.play().catch((err) => {
            if (process.env.NODE_ENV !== "production") {
              console.error("Video play error:", err);
            }
          });
        }
      }
    }
  };

  // Show loading state or error fallback
  if (hasError) {
    return (
      <div
        className={`${className} bg-gray-200 flex items-center justify-center`}
      >
        <div className="text-center text-gray-500">
          <p>Video unavailable</p>
          {poster && (
            <img
              src={poster}
              alt="Video poster"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
        </div>
      )}

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
        onClick={handleVideoClick}
        onLoadedMetadata={() => {
          // Set initial muted state
          if (videoRef.current) {
            videoRef.current.muted = isMuted;
          }
        }}
      />

      {enableMuteToggle && (
        <button
          type="button"
          onClick={handleToggleMute}
          className="absolute bottom-3 right-3 bg-black/50 hover:bg-black/60 text-white rounded-full p-2 transition-colors z-20"
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
