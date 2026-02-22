import { Link } from "react-router-dom";
import { Play, Star, Info } from "lucide-react";
import { backdrop, type Movie } from "@/lib/tmdb";

interface HeroBannerProps {
  movie: Movie | null;
}

const HeroBanner = ({ movie }: HeroBannerProps) => {
  if (!movie) {
    return (
      <div className="relative h-[70vh] bg-secondary animate-pulse" />
    );
  }

  const title = movie.title || movie.name || "";
  const mediaType = movie.media_type || "movie";

  return (
    <div className="relative h-[70vh] min-h-[500px]">
      <div className="absolute inset-0">
        <img
          src={backdrop(movie.backdrop_path)}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
      </div>

      <div className="relative h-full container mx-auto px-4 flex items-end pb-16">
        <div className="max-w-xl animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center gap-1 text-primary text-sm font-semibold">
              <Star className="w-4 h-4 fill-primary" />
              {movie.vote_average?.toFixed(1)}
            </span>
            <span className="text-muted-foreground text-sm">
              {(movie.release_date || movie.first_air_date || "").slice(0, 4)}
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3 leading-tight">
            {title}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base line-clamp-3 mb-6">
            {movie.overview}
          </p>
          <div className="flex gap-3">
            <Link
              to={`/watch/${mediaType}/${movie.id}`}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-full transition-colors"
            >
              <Play className="w-5 h-5 fill-current" /> Watch Now
            </Link>
            <Link
              to={`/${mediaType}/${movie.id}`}
              className="inline-flex items-center gap-2 glass hover:bg-white/10 text-foreground font-semibold px-6 py-3 rounded-full transition-colors"
            >
              <Info className="w-5 h-5" /> Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
