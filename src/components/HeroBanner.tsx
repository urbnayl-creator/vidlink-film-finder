import { Link } from "react-router-dom";
import { Play, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { backdrop, type Movie } from "@/lib/tmdb";
import { useState, useEffect, useCallback } from "react";

interface HeroBannerProps {
  movies: Movie[];
}

const HeroBanner = ({ movies }: HeroBannerProps) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [isAnimating, setIsAnimating] = useState(false);

  const goTo = useCallback((index: number, dir?: "left" | "right") => {
    if (isAnimating) return;
    setDirection(dir || (index > current ? "right" : "left"));
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setTimeout(() => setIsAnimating(false), 50);
    }, 350);
  }, [isAnimating, current]);

  const prev = () => goTo((current - 1 + movies.length) % movies.length, "left");
  const next = () => goTo((current + 1) % movies.length, "right");

  useEffect(() => {
    if (movies.length <= 1) return;
    const interval = setInterval(() => {
      goTo((current + 1) % movies.length, "right");
    }, 6000);
    return () => clearInterval(interval);
  }, [current, movies.length, goTo]);

  if (!movies.length) {
    return <div className="relative h-[60vh] sm:h-[65vh] bg-secondary" />;
  }

  const movie = movies[current];
  const title = movie.title || movie.name || "";
  const mediaType = movie.media_type || "movie";

  return (
    <div className="relative h-[60vh] sm:h-[65vh] min-h-[420px] overflow-hidden group/hero">
      {/* Background image with crossfade */}
      <div
        className="absolute inset-0 transition-all duration-700 ease-out"
        style={{
          opacity: isAnimating ? 0 : 1,
          transform: isAnimating
            ? `scale(1.05) translateX(${direction === "right" ? "-2%" : "2%"})`
            : "scale(1) translateX(0)",
        }}
      >
        <img
          src={backdrop(movie.backdrop_path)}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-background/30" />

      {/* Navigation arrows */}
      {movies.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full glass-nav text-foreground/70 hover:text-foreground transition-all duration-300 opacity-0 group-hover/hero:opacity-100"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full glass-nav text-foreground/70 hover:text-foreground transition-all duration-300 opacity-0 group-hover/hero:opacity-100"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </>
      )}

      {/* Content */}
      <div className="relative h-full max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col items-center justify-end pb-12 sm:pb-16">
        <div
          className="text-center max-w-2xl transition-all duration-600 ease-out"
          style={{
            opacity: isAnimating ? 0 : 1,
            transform: isAnimating ? "translateY(20px)" : "translateY(0)",
          }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4 leading-tight px-2">
            {title}
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base leading-relaxed mb-6 sm:mb-8 line-clamp-2 sm:line-clamp-3 px-4">
            {movie.overview}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to={`/watch/${mediaType}/${movie.id}`} className="btn-glow">
              <Play className="w-4 h-4" />
              Play Now
            </Link>
            <Link to={`/${mediaType}/${movie.id}`} className="btn-glow">
              Details
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Dot indicators */}
        {movies.length > 1 && (
          <div className="flex items-center gap-2 mt-5 sm:mt-6">
            {movies.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === current ? 'bg-foreground w-6' : 'bg-muted-foreground/40 hover:bg-muted-foreground/70 w-1.5'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroBanner;
