"use client";
import { ArrowRight } from "lucide-react";
import { useState, useRef, useId, useEffect } from "react";
import Image from "next/image";

interface SlideData {
  title: string;
  button: string;
  src: string;
}

interface SlideProps {
  slide: SlideData;
  index: number;
  current: number;
  handleSlideClick: (index: number) => void;
}

const Slide = ({ slide, index, current, handleSlideClick }: SlideProps) => {
  const slideRef = useRef<HTMLLIElement>(null);

  const xRef = useRef(0);
  const yRef = useRef(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return;

      const x = xRef.current;
      const y = yRef.current;

      slideRef.current.style.setProperty("--x", `${x}px`);
      slideRef.current.style.setProperty("--y", `${y}px`);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent) => {
    const el = slideRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    xRef.current = event.clientX - (r.left + Math.floor(r.width / 2));
    yRef.current = event.clientY - (r.top + Math.floor(r.height / 2));
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
  };

  const imageLoaded = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.opacity = "1";
  };

  const { src, button, title } = slide;

  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d]">
      <li
        ref={slideRef}
        className="flex flex-1 flex-col items-center justify-center relative text-center text-white opacity-100 transition-all duration-500 ease-out w-[70vmin] h-[70vmin] mx-[4vmin] z-10 cursor-pointer"
        onClick={() => handleSlideClick(index)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform:
            current !== index
              ? "scale(0.95) rotateX(10deg) rotateY(5deg)"
              : "scale(1) rotateX(0deg) rotateY(0deg)",
          transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
          transformOrigin: "center",
          filter:
            current !== index
              ? "brightness(0.6) contrast(0.8)"
              : "brightness(1) contrast(1)",
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0B1426] via-[#1a1a2e] to-[#16213e] rounded-[2%] overflow-hidden transition-all duration-300 ease-out shadow-2xl"
          style={{
            transform:
              current === index
                ? "translate3d(calc(var(--x) / 25), calc(var(--y) / 25), 0)"
                : "none",
          }}
        >
          <Image
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out"
            style={{
              opacity: current === index ? 1 : 0.7,
              transform: current === index ? "scale(1.05)" : "scale(1)",
            }}
            alt={title}
            src={src}
            onLoad={imageLoaded}
            loading="eager"
            decoding="sync"
            fill
          />

          {/* Dark atmospheric overlay */}
          <div
            className={`absolute inset-0 transition-all duration-1000 ${
              current === index
                ? "bg-gradient-to-t from-black/80 via-black/40 to-transparent"
                : "bg-gradient-to-t from-black/90 via-black/60 to-black/20"
            }`}
          />

          {/* Subtle noise texture overlay */}
          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgICAgPGZlVHVyYnVsZW5jZSB0eXBlPSJ0dXJidWxlbmNlIiBiYXNlRnJlcXVlbmN5PSIwLjkiIG51bU9jdGF2ZXM9IjQiIHNlZWQ9IjEiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz4KICA8L2ZpbHRlcj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4xIi8+Cjwvc3ZnPgo=')] mix-blend-overlay" />
        </div>

        <article
          className={`relative p-[4vmin] transition-all duration-1000 ease-in-out z-10 ${
            current === index
              ? "opacity-100 visible transform-none"
              : "opacity-0 invisible translate-y-8"
          }`}
        >
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold relative mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent drop-shadow-2xl">
              {title}
            </span>
          </h2>

          <div className="flex justify-center">
            <button className="group mt-8 px-8 py-4 w-fit mx-auto text-sm font-semibold text-black bg-white/95 backdrop-blur-sm border border-white/20 flex justify-center items-center rounded-full hover:bg-white hover:scale-105 hover:shadow-2xl hover:shadow-white/25 transition-all duration-300 ease-out relative overflow-hidden">
              <span className="relative z-10">{button}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>
        </article>
      </li>
    </div>
  );
};

interface CarouselControlProps {
  type: string;
  title: string;
  handleClick: () => void;
}

const CarouselControl = ({
  type,
  title,
  handleClick,
}: CarouselControlProps) => {
  return (
    <button
      className={`group w-12 h-12 flex items-center mx-3 justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full focus:border-white/40 focus:outline-none hover:bg-white/20 hover:scale-110 hover:shadow-lg hover:shadow-white/25 active:scale-95 transition-all duration-300 ease-out ${
        type === "previous" ? "rotate-180" : ""
      }`}
      title={title}
      onClick={handleClick}
    >
      <ArrowRight className="text-white/90 group-hover:text-white transition-colors duration-300" />
    </button>
  );
};

interface CarouselProps {
  slides: SlideData[];
}

export function Carousel({ slides }: CarouselProps) {
  const [current, setCurrent] = useState(0);

  const handlePreviousClick = () => {
    const previous = current - 1;
    setCurrent(previous < 0 ? slides.length - 1 : previous);
  };

  const handleNextClick = () => {
    const next = current + 1;
    setCurrent(next === slides.length ? 0 : next);
  };

  const handleSlideClick = (index: number) => {
    if (current !== index) {
      setCurrent(index);
    }
  };

  const id = useId();

  return (
    <div
      className="relative w-[70vmin] h-[70vmin] mx-auto"
      aria-labelledby={`carousel-heading-${id}`}
    >
      <ul
        className="absolute flex mx-[-4vmin] transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(-${current * (100 / slides.length)}%)`,
        }}
      >
        {slides.map((slide, index) => (
          <Slide
            key={index}
            slide={slide}
            index={index}
            current={current}
            handleSlideClick={handleSlideClick}
          />
        ))}
      </ul>

      <div className="absolute flex justify-center w-full top-[calc(100%+2rem)]">
        <CarouselControl
          type="previous"
          title="Go to previous slide"
          handleClick={handlePreviousClick}
        />

        <CarouselControl
          type="next"
          title="Go to next slide"
          handleClick={handleNextClick}
        />
      </div>

      {/* Slide indicators */}
      <div className="absolute flex justify-center w-full top-[calc(100%+4.5rem)] space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              current === index
                ? "bg-white/90 scale-110 shadow-lg shadow-white/25"
                : "bg-white/30 hover:bg-white/50"
            }`}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Carousel;
