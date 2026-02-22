import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import MediaCarousel from "@/components/MediaCarousel";
import { getTrending, getPopular, getTopRated } from "@/lib/tmdb";

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

  const heroMovie = trending?.results?.[0] || null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroBanner movie={heroMovie} />
        <div className="container mx-auto space-y-10 py-10">
          <MediaCarousel
            title="🔥 Trending Now"
            items={trending?.results?.slice(1) || []}
          />
          <MediaCarousel
            title="🎬 Popular Movies"
            items={popularMovies?.results || []}
            type="movie"
          />
          <MediaCarousel
            title="📺 Popular TV Shows"
            items={popularTv?.results || []}
            type="tv"
          />
          <MediaCarousel
            title="⭐ Top Rated Movies"
            items={topMovies?.results || []}
            type="movie"
          />
          <MediaCarousel
            title="🏆 Top Rated TV Shows"
            items={topTv?.results || []}
            type="tv"
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
