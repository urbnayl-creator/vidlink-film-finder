import { useParams, useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import { getMovieDetail, getTvDetail, getMoviePlayerUrl, getTvPlayerUrl } from "@/lib/tmdb";
import { ArrowLeft } from "lucide-react";

const Watch = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [searchParams] = useSearchParams();
  const mediaId = Number(id);
  const isMovie = type === "movie";
  const season = Number(searchParams.get("s") || 1);
  const episode = Number(searchParams.get("e") || 1);

  const { data: detail } = useQuery({
    queryKey: [type, mediaId],
    queryFn: () => (isMovie ? getMovieDetail(mediaId) : getTvDetail(mediaId)),
    enabled: !!mediaId,
  });

  const playerUrl = isMovie
    ? getMoviePlayerUrl(mediaId)
    : getTvPlayerUrl(mediaId, season, episode);

  const title = detail?.title || detail?.name || "Loading...";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Link
              to={`/${type}/${mediaId}`}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
            <h1 className="font-display text-lg font-semibold text-foreground truncate">
              {title}
              {!isMovie && ` — S${season} E${episode}`}
            </h1>
          </div>
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
