import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Header from "@/components/Header";
import MediaCarousel from "@/components/MediaCarousel";
import { getTvDetail, getCredits, getRecommendations, getTvSeasonEpisodes, backdrop, img } from "@/lib/tmdb";
import { Play, Star, Calendar, Tv } from "lucide-react";

const TvDetail = () => {
  const { id } = useParams<{ id: string }>();
  const tvId = Number(id);
  const [selectedSeason, setSelectedSeason] = useState(1);

  const { data: show } = useQuery({
    queryKey: ["tv", tvId],
    queryFn: () => getTvDetail(tvId),
    enabled: !!tvId,
  });

  const { data: credits } = useQuery({
    queryKey: ["credits", "tv", tvId],
    queryFn: () => getCredits("tv", tvId),
    enabled: !!tvId,
  });

  const { data: episodes } = useQuery({
    queryKey: ["episodes", tvId, selectedSeason],
    queryFn: () => getTvSeasonEpisodes(tvId, selectedSeason),
    enabled: !!tvId,
  });

  const { data: recs } = useQuery({
    queryKey: ["recs", "tv", tvId],
    queryFn: () => getRecommendations("tv", tvId),
    enabled: !!tvId,
  });

  if (!show) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex items-center justify-center h-[60vh]">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="relative h-[60vh] min-h-[400px]">
        <img src={backdrop(show.backdrop_path)} alt={show.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-40 relative z-10 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          <img
            src={img(show.poster_path, "w500")}
            alt={show.name}
            className="w-56 rounded-xl shadow-2xl shrink-0 self-start hidden md:block"
          />
          <div className="flex-1 animate-fade-in">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              {show.name}
            </h1>
            {show.tagline && (
              <p className="text-muted-foreground italic mb-4">"{show.tagline}"</p>
            )}
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
              <span className="flex items-center gap-1 text-primary">
                <Star className="w-4 h-4 fill-primary" /> {show.vote_average?.toFixed(1)}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Tv className="w-4 h-4" /> {show.number_of_seasons} Seasons
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="w-4 h-4" /> {show.first_air_date?.slice(0, 4)}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {show.genres?.map((g) => (
                <span key={g.id} className="px-3 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">
                  {g.name}
                </span>
              ))}
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl">
              {show.overview}
            </p>
            <Link
              to={`/watch/tv/${show.id}?s=1&e=1`}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-full transition-colors"
            >
              <Play className="w-5 h-5 fill-current" /> Watch S1 E1
            </Link>

            {/* Season selector + episodes */}
            {show.seasons && show.seasons.length > 0 && (
              <div className="mt-10">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">Episodes</h3>
                <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-2">
                  {show.seasons
                    .filter((s) => s.season_number > 0)
                    .map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSeason(s.season_number)}
                        className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          selectedSeason === s.season_number
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-accent"
                        }`}
                      >
                        Season {s.season_number}
                      </button>
                    ))}
                </div>
                <div className="grid gap-3">
                  {episodes?.episodes?.map((ep) => (
                    <Link
                      key={ep.id}
                      to={`/watch/tv/${tvId}?s=${ep.season_number}&e=${ep.episode_number}`}
                      className="flex gap-4 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
                    >
                      <div className="w-36 h-20 rounded-md overflow-hidden bg-muted shrink-0">
                        {ep.still_path ? (
                          <img src={img(ep.still_path, "w300")} alt={ep.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No Image</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          E{ep.episode_number}. {ep.name}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{ep.overview}</p>
                      </div>
                      <Play className="w-5 h-5 text-muted-foreground group-hover:text-primary shrink-0 self-center transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {credits?.cast && credits.cast.length > 0 && (
              <div className="mt-10">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">Cast</h3>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                  {credits.cast.slice(0, 10).map((person) => (
                    <div key={person.id} className="shrink-0 text-center w-20">
                      <div className="w-16 h-16 rounded-full overflow-hidden mx-auto bg-secondary">
                        {person.profile_path ? (
                          <img src={img(person.profile_path, "w185")} alt={person.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">N/A</div>
                        )}
                      </div>
                      <p className="text-xs text-foreground mt-1 truncate">{person.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{person.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {recs?.results && recs.results.length > 0 && (
          <div className="mt-16">
            <MediaCarousel title="More Like This" items={recs.results} type="tv" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TvDetail;
