import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { img } from "@/lib/tmdb";
import { useAuth } from "@/hooks/useAuth";
import { useWatchHistory } from "@/hooks/useWatchHistory";

const ContinueWatching = () => {
  const { user } = useAuth();
  const { history } = useWatchHistory();

  if (!user || !history.length) return null;

  // Deduplicate by media_id, keep most recent only
  const seen = new Set<string>();
  const unique = history.filter((h) => {
    const key = `${h.media_type}-${h.media_id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 20);

  if (!unique.length) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Continue Watching</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Pick up where you left off.</p>
        </div>
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {unique.map((item) => {
          const watchLink =
            item.media_type === "movie"
              ? `/watch/movie/${item.media_id}`
              : `/watch/tv/${item.media_id}?s=${item.season_number || 1}&e=${item.episode_number || 1}`;
          return (
            <Link
              key={item.id}
              to={watchLink}
              className="group shrink-0 w-[120px] sm:w-[150px] md:w-[170px] block"
            >
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-secondary">
                <img
                  src={img(item.poster_path)}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/40 transition-colors duration-300 flex items-center justify-center">
                  <Play className="w-8 h-8 text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 truncate">{item.title}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ContinueWatching;
