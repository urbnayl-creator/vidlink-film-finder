import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Header from "@/components/Header";
import { getTvDetail, getCredits, getRecommendations, getTvSeasonEpisodes, backdrop, img } from "@/lib/tmdb";
import { Play, Plus } from "lucide-react";

const TvDetail = () => {
  const { id } = useParams<{ id: string }>();
  const tvId = Number(id);
  const [activeTab, setActiveTab] = useState("overview");
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
    enabled: !!tvId && activeTab === "episodes",
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
        <div className="pt-14 flex items-center justify-center h-[60vh]">
          <div className="w-6 h-6 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const tabs = ["Overview", "Episodes", "Credits", "Recommendations"];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="relative h-[40vh] sm:h-[50vh] min-h-[280px] sm:min-h-[350px]">
        <img src={backdrop(show.backdrop_path)} alt={show.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 -mt-32 sm:-mt-52 relative z-10 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="shrink-0 hidden md:block">
            <img src={img(show.poster_path, "w500")} alt={show.name} className="w-48 rounded-lg shadow-2xl border border-border" />
          </div>

          <div className="flex-1 pt-8 sm:pt-16 md:pt-20">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-1 text-xs font-medium border border-border rounded-md text-foreground">
                {show.vote_average?.toFixed(1)}
              </span>
              {show.genres?.map((g) => (
                <span key={g.id} className="px-2.5 py-1 text-xs border border-border rounded-md text-muted-foreground">
                  {g.name}
                </span>
              ))}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">{show.name}</h1>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-2xl">{show.overview}</p>

            <div className="flex flex-wrap items-center gap-3 mb-8">
              <Link
                to={`/watch/tv/${show.id}?s=1&e=1`}
                className="btn-glow"
              >
                <Play className="w-4 h-4" /> Play Now
              </Link>
              <button className="btn-glow">
                <Plus className="w-4 h-4" /> Watchlist
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-border mb-6">
              <div className="flex gap-0">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
                      activeTab === tab.toLowerCase() ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                    {activeTab === tab.toLowerCase() && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === "overview" && (
              <div className="grid grid-cols-2 gap-4 max-w-lg">
                <div>
                  <p className="text-xs text-muted-foreground">First Air Date</p>
                  <p className="text-sm text-foreground">{show.first_air_date}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="text-sm text-foreground">{show.status}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Seasons</p>
                  <p className="text-sm text-foreground">{show.number_of_seasons}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Episodes</p>
                  <p className="text-sm text-foreground">{show.number_of_episodes}</p>
                </div>
              </div>
            )}

            {activeTab === "episodes" && (
              <div>
                <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-2">
                  {show.seasons?.filter((s) => s.season_number > 0).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSeason(s.season_number)}
                      className={`shrink-0 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                        selectedSeason === s.season_number
                          ? "border-foreground text-foreground"
                          : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Season {s.season_number}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  {episodes?.episodes?.map((ep) => (
                    <Link
                      key={ep.id}
                      to={`/watch/tv/${tvId}?s=${ep.season_number}&e=${ep.episode_number}`}
                      className="flex gap-4 p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors group"
                    >
                      <div className="w-32 h-18 rounded-md overflow-hidden bg-secondary shrink-0">
                        {ep.still_path ? (
                          <img src={img(ep.still_path, "w300")} alt={ep.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs aspect-video">No Image</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground group-hover:text-foreground">
                          E{ep.episode_number}. {ep.name}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{ep.overview}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "credits" && credits?.cast && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {credits.cast.slice(0, 12).map((person) => (
                  <div key={person.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary shrink-0">
                      {person.profile_path ? (
                        <img src={img(person.profile_path, "w185")} alt={person.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">?</div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-foreground truncate">{person.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{person.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "recommendations" && recs?.results && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {recs.results.slice(0, 12).map((item) => (
                  <Link key={item.id} to={`/tv/${item.id}`} className="group">
                    <div className="aspect-[2/3] rounded-lg overflow-hidden bg-secondary">
                      <img src={img(item.poster_path)} alt={item.name || item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
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

export default TvDetail;
