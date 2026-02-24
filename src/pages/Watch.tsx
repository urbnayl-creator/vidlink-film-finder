import { useParams, useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { getMovieDetail, getTvDetail, getTvSeasonEpisodes, getMoviePlayerUrl, getTvPlayerUrl, img } from "@/lib/tmdb";
import { ArrowLeft, Play } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useWatchHistory } from "@/hooks/useWatchHistory";

const Watch = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [searchParams] = useSearchParams();
  const mediaId = Number(id);
  const isMovie = type === "movie";
  const season = Number(searchParams.get("s") || 1);
  const episode = Number(searchParams.get("e") || 1);
  const { user } = useAuth();
  const { addToHistory } = useWatchHistory();
  const [selectedSeason, setSelectedSeason] = useState(season);

  const { data: detail } = useQuery({
    queryKey: [type, mediaId],
    queryFn: () => (isMovie ? getMovieDetail(mediaId) : getTvDetail(mediaId)),
    enabled: !!mediaId,
  });

  const { data: episodes } = useQuery({
    queryKey: ["episodes", mediaId, selectedSeason],
    queryFn: () => getTvSeasonEpisodes(mediaId, selectedSeason),
    enabled: !isMovie && !!mediaId,
  });

  useEffect(() => {
    if (user && detail) {
      addToHistory({
        mediaId: detail.id,
        mediaType: type || "movie",
        title: detail.title || detail.name || "",
        posterPath: detail.poster_path,
        seasonNumber: isMovie ? undefined : season,
        episodeNumber: isMovie ? undefined : episode,
      });
    }
  }, [user, detail?.id, type, season, episode]);

  const playerUrl = isMovie
    ? getMoviePlayerUrl(mediaId)
    : getTvPlayerUrl(mediaId, season, episode);

  const title = detail?.title || detail?.name || "Loading...";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-14">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3 mb-3">
            <Link to={`/${type}/${mediaId}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to details
            </Link>
          </div>
          <h1 className="text-lg font-semibold text-foreground mb-4">
            {title}
            {!isMovie && <span className="text-muted-foreground font-normal"> — Season {season}, Episode {episode}</span>}
          </h1>
        </div>
        <div className="w-full aspect-video max-h-[80vh] bg-black">
          <iframe
            src={playerUrl}
            className="w-full h-full"
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="origin"
            title={`Watch ${title}`}
          />
        </div>

        {/* Episodes & Seasons for TV */}
        {!isMovie && detail?.seasons && (
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Episodes</h2>
            <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-2">
              {detail.seasons.filter((s) => s.season_number > 0).map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSeason(s.season_number)}
                  className={`shrink-0 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${selectedSeason === s.season_number ? "border-foreground text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
                >
                  Season {s.season_number}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {episodes?.episodes?.map((ep) => {
                const isActive = ep.season_number === season && ep.episode_number === episode;
                return (
                  <Link
                    key={ep.id}
                    to={`/watch/tv/${mediaId}?s=${ep.season_number}&e=${ep.episode_number}`}
                    className={`flex gap-4 p-3 rounded-lg border transition-colors group ${isActive ? "border-foreground/30 bg-secondary/60" : "border-border hover:bg-secondary/50"}`}
                  >
                    <div className="w-32 h-18 rounded-md overflow-hidden bg-secondary shrink-0 relative">
                      {ep.still_path ? (
                        <img src={img(ep.still_path, "w300")} alt={ep.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs aspect-video">No Image</div>
                      )}
                      {isActive && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                          <Play className="w-5 h-5 text-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${isActive ? "text-foreground" : "text-foreground"}`}>
                        E{ep.episode_number}. {ep.name}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{ep.overview}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watch;
