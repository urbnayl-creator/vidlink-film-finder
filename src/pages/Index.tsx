import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import MediaCarousel from "@/components/MediaCarousel";
import AdBlockPopup from "@/components/AdBlockPopup";
import { getTrending, getPopular, getTopRated, getAnime } from "@/lib/tmdb";

const Index = () => {
  const { data: trending } = useQuery({
    queryKey: ["trending"],
    queryFn: () => getTrending("all"),
  });

  const { data: popularMovies } = useQuery({
    queryKey: ["popular", "movie"],
    queryFn: () => getPopular("movie"),
  });

  const { data: popularTv } = useQuery({
    queryKey: ["popular", "tv"],
    queryFn: () => getPopular("tv"),
  });

  const { data: topMovies } = useQuery({
    queryKey: ["topRated", "movie"],
    queryFn: () => getTopRated("movie"),
  });

  const { data: topTv } = useQuery({
    queryKey: ["topRated", "tv"],
    queryFn: () => getTopRated("tv"),
  });

  const { data: anime } = useQuery({
    queryKey: ["anime"],
    queryFn: () => getAnime(),
  });

  const heroMovies = trending?.results?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AdBlockPopup />
      <main>
        <HeroBanner movies={heroMovies} />
        <div className="max-w-[1280px] mx-auto space-y-10 py-10">
          <MediaCarousel
            title="Trending Movies"
            subtitle="Stay on the pulse of what's hot in the movie scene."
            items={trending?.results?.filter(m => m.media_type === 'movie' || !m.media_type).slice(0, 20) || []}
            type="movie"
          />
          <MediaCarousel
            title="Popular Movies"
            subtitle="The most popular movies right now."
            items={popularMovies?.results || []}
            type="movie"
          />
          <MediaCarousel
            title="Popular TV Shows"
            subtitle="Top picks from the TV world."
            items={popularTv?.results || []}
            type="tv"
          />
          <MediaCarousel
            title="Anime"
            subtitle="Top anime series from Japan."
            items={anime?.results || []}
            type="tv"
          />
          <MediaCarousel
            title="Top Rated Movies"
            subtitle="Critically acclaimed masterpieces."
            items={topMovies?.results || []}
            type="movie"
          />
          <MediaCarousel
            title="Top Rated TV Shows"
            subtitle="The best shows ever made."
            items={topTv?.results || []}
            type="tv"
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
