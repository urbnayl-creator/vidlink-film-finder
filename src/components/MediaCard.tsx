import { Link } from "react-router-dom";
import { img, type Movie } from "@/lib/tmdb";
import { Star } from "lucide-react";

interface MediaCardProps {
  item: Movie;
  type?: "movie" | "tv";
}

const MediaCard = ({ item, type }: MediaCardProps) => {
  const mediaType = type || item.media_type || "movie";
  const title = item.title || item.name || "Untitled";
  const link = `/${mediaType}/${item.id}`;

  return (
    <Link
      to={link}
      className="group shrink-0 w-[160px] sm:w-[180px] block"
    >
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden card-shine bg-secondary">
        <img
          src={img(item.poster_path)}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center gap-1 text-xs text-primary">
            <Star className="w-3 h-3 fill-primary" />
            <span>{item.vote_average?.toFixed(1)}</span>
          </div>
        </div>
      </div>
      <h3 className="mt-2 text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-xs text-muted-foreground">
        {(item.release_date || item.first_air_date || "").slice(0, 4)}
      </p>
    </Link>
  );
};

export default MediaCard;
