import { Link } from "react-router-dom";
import { Play, ArrowRight } from "lucide-react";
import { backdrop, type Movie } from "@/lib/tmdb";
import { useState, useEffect, useCallback } from "react";

interface HeroBannerProps {
  movies: Movie[];
}

const HeroBanner = ({ movies }: HeroBannerProps) => {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setIsTransitioning(false);
    }, 300);
  }, []);

  useEffect(() => {
    if (movies.length <= 1) return;
    const interval = setInterval(() => {
      goTo((current + 1) % movies.length);
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
    <div className="relative h-[60vh] sm:h-[65vh] min-h-[420px] overflow-hidden">
      <div className={`absolute inset-0 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <img
          src={backdrop(movie.backdrop_path)}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/20 to-background/20" />

      <div className="relative h-full max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col items-center justify-end pb-12 sm:pb-16">
        <div className={`text-center max-w-2xl transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4 leading-tight px-2">
            {title}
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base leading-relaxed mb-6 sm:mb-8 line-clamp-2 sm:line-clamp-3 px-4">
            {movie.overview}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              to={`/watch/${mediaType}/${movie.id}`}
              className="btn-glow"
            >
              <Play className="w-4 h-4" />
              Play Now
            </Link>
            <Link
              to={`/${mediaType}/${movie.id}`}
              className="btn-glow"
            >
              Details
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {movies.length > 1 && (
          <div className="flex items-center gap-2 mt-5 sm:mt-6">
            {movies.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === current ? 'bg-foreground w-4' : 'bg-muted-foreground/40 hover:bg-muted-foreground/70'
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
