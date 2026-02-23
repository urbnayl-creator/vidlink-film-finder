import Header from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useWatchlist } from "@/hooks/useWatchlist";
import { Link } from "react-router-dom";
import { img } from "@/lib/tmdb";
import { Trash2, Play } from "lucide-react";

const WatchlistPage = () => {
  const { user } = useAuth();
  const { watchlist, toggle } = useWatchlist();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 text-center px-4">
          <h1 className="text-2xl font-bold text-foreground mb-3">Your Watchlist</h1>
          <p className="text-muted-foreground text-sm mb-6">Sign in to save movies & shows to your watchlist.</p>
          <Link to="/auth" className="btn-glow inline-flex">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 max-w-[1280px] mx-auto px-4 sm:px-6 pb-16">
        <h1 className="text-2xl font-bold text-foreground mb-6">Your Watchlist</h1>
        {watchlist.length === 0 ? (
          <p className="text-muted-foreground text-sm">Your watchlist is empty. Browse movies & shows to add some!</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
            {watchlist.map((item) => (
              <div key={item.id} className="group relative">
                <Link to={`/${item.media_type}/${item.media_id}`}>
                  <div className="aspect-[2/3] rounded-lg overflow-hidden bg-secondary">
                    <img src={img(item.poster_path)} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                  </div>
                </Link>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Link to={`/watch/${item.media_type}/${item.media_id}`} className="p-1.5 rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:bg-background transition-colors">
                    <Play className="w-3 h-3" />
                  </Link>
                  <button
                    onClick={() => toggle({ mediaId: item.media_id, mediaType: item.media_type, title: item.title, posterPath: item.poster_path })}
                    className="p-1.5 rounded-full bg-background/80 backdrop-blur-sm text-destructive hover:bg-background transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;
