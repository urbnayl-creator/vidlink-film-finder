import { Link } from "react-router-dom";
import { img, type Movie } from "@/lib/tmdb";

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
      className="group shrink-0 w-[150px] sm:w-[170px] block"
    >
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-secondary">
        <img
          src={img(item.poster_path)}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-300" />
      </div>
    </Link>
  );
};

export default MediaCard;
