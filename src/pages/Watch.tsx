import { useParams, useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Header from "@/components/Header";
import { getMovieDetail, getTvDetail, getMoviePlayerUrl, getTvPlayerUrl } from "@/lib/tmdb";
import { ArrowLeft } from "lucide-react";
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

  const { data: detail } = useQuery({
    queryKey: [type, mediaId],
    queryFn: () => (isMovie ? getMovieDetail(mediaId) : getTvDetail(mediaId)),
    enabled: !!mediaId,
  });

  // Track watch history when user is logged in
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
      </div>
    </div>
  );
};

export default Watch;
