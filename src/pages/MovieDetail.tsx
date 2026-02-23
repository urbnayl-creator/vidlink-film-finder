import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Header from "@/components/Header";
import { getMovieDetail, getCredits, getRecommendations, backdrop, img } from "@/lib/tmdb";
import { Play, Plus, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useToast } from "@/hooks/use-toast";

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = Number(id);
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();
  const { isInWatchlist, toggle, isToggling } = useWatchlist();
  const { toast } = useToast();

  const { data: movie } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: !!movieId,
  });

  const { data: credits } = useQuery({
    queryKey: ["credits", "movie", movieId],
    queryFn: () => getCredits("movie", movieId),
    enabled: !!movieId,
  });

  const { data: recs } = useQuery({
    queryKey: ["recs", "movie", movieId],
    queryFn: () => getRecommendations("movie", movieId),
    enabled: !!movieId,
  });

  const handleWatchlist = () => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to add to your watchlist." });
      return;
    }
    if (movie) toggle({ mediaId: movie.id, mediaType: "movie", title: movie.title, posterPath: movie.poster_path });
  };

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-14 flex items-center justify-center h-[60vh]">
          <div className="w-6 h-6 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const inList = isInWatchlist(movie.id, "movie");
  const tabs = ["Overview", "Credits", "Recommendations"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="relative h-[40vh] sm:h-[50vh] min-h-[280px] sm:min-h-[350px]">
        <img src={backdrop(movie.backdrop_path)} alt={movie.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 -mt-32 sm:-mt-52 relative z-10 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="shrink-0 hidden md:block">
            <img src={img(movie.poster_path, "w500")} alt={movie.title} className="w-48 rounded-lg shadow-2xl border border-border" />
          </div>
          <div className="flex-1 pt-8 sm:pt-16 md:pt-20">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-1 text-xs font-medium border border-border rounded-md text-foreground">{movie.vote_average?.toFixed(1)}</span>
              {movie.genres?.map((g) => (
                <span key={g.id} className="px-2.5 py-1 text-xs border border-border rounded-md text-muted-foreground">{g.name}</span>
              ))}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">{movie.title}</h1>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-2xl">{movie.overview}</p>

            <div className="flex flex-wrap items-center gap-3 mb-8">
              <Link to={`/watch/movie/${movie.id}`} className="btn-glow">
                <Play className="w-4 h-4" /> Play Now
              </Link>
              <button onClick={handleWatchlist} disabled={isToggling} className="btn-glow">
                {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {inList ? "In Watchlist" : "Watchlist"}
              </button>
            </div>

            <div className="border-b border-border mb-6">
              <div className="flex gap-0">
                {tabs.map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${activeTab === tab.toLowerCase() ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                    {tab}
                    {activeTab === tab.toLowerCase() && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === "overview" && (
              <div className="grid grid-cols-2 gap-4 max-w-lg">
                <div><p className="text-xs text-muted-foreground">Release Date</p><p className="text-sm text-foreground">{movie.release_date}</p></div>
                <div><p className="text-xs text-muted-foreground">Status</p><p className="text-sm text-foreground">{movie.status}</p></div>
                {movie.runtime && <div><p className="text-xs text-muted-foreground">Runtime</p><p className="text-sm text-foreground">{movie.runtime} min</p></div>}
                <div><p className="text-xs text-muted-foreground">Rating</p><p className="text-sm text-foreground">{movie.vote_average?.toFixed(1)} / 10</p></div>
              </div>
            )}

            {activeTab === "credits" && credits?.cast && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {credits.cast.slice(0, 12).map((person) => (
                  <div key={person.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary shrink-0">
                      {person.profile_path ? <img src={img(person.profile_path, "w185")} alt={person.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">?</div>}
                    </div>
                    <div className="min-w-0"><p className="text-sm text-foreground truncate">{person.name}</p><p className="text-xs text-muted-foreground truncate">{person.character}</p></div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "recommendations" && recs?.results && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {recs.results.slice(0, 12).map((item) => (
                  <Link key={item.id} to={`/movie/${item.id}`} className="group">
                    <div className="aspect-[2/3] rounded-lg overflow-hidden bg-secondary">
                      <img src={img(item.poster_path)} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
