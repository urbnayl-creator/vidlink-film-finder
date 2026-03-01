import { Link } from "react-router-dom";
import { img, type Movie } from "@/lib/tmdb";
import { Play, Star } from "lucide-react";

interface MediaCardProps {
  item: Movie;
  type?: "movie" | "tv";
}

const MediaCard = ({ item, type }: MediaCardProps) => {
  const mediaType = type || item.media_type || "movie";
  const title = item.title || item.name || "Untitled";
  const link = `/${mediaType}/${item.id}`;
  const rating = item.vote_average?.toFixed(1);

  return (
    <Link
      to={link}
      className="group shrink-0 w-[120px] sm:w-[150px] md:w-[170px] block [.media-grid_&]:w-full"
    >
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-secondary">
        <img
          src={img(item.poster_path)}
          alt={title}
          className="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-110"
          loading="lazy"
        />
        {/* Hover overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
        
        {/* Play icon on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <div className="w-10 h-10 rounded-full bg-foreground/20 backdrop-blur-sm flex items-center justify-center border border-foreground/20">
            <Play className="w-4 h-4 text-foreground fill-foreground" />
          </div>
        </div>

        {/* Rating badge */}
        {rating && Number(rating) > 0 && (
          <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-background/70 backdrop-blur-sm text-[10px] font-medium text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Star className="w-2.5 h-2.5 fill-foreground" />
            {rating}
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-1.5 truncate group-hover:text-foreground transition-colors duration-300">{title}</p>
    </Link>
  );
};

export default MediaCard;
