import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import MediaCarousel from "@/components/MediaCarousel";
import { getPopular, getTopRated, getTrending } from "@/lib/tmdb";

const MoviesPage = () => {
  const { data: popular } = useQuery({
    queryKey: ["popular", "movie"],
    queryFn: () => getPopular("movie"),
  });

  const { data: topRated } = useQuery({
    queryKey: ["topRated", "movie"],
    queryFn: () => getTopRated("movie"),
  });

  const { data: trending } = useQuery({
    queryKey: ["trending", "movie"],
    queryFn: () => getTrending("movie"),
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-[1280px] mx-auto pt-24 pb-16 space-y-10">
        <h1 className="text-2xl font-bold text-foreground px-6 md:px-0">Movies</h1>
        <MediaCarousel title="Trending" subtitle="What's trending this week." items={trending?.results || []} type="movie" />
        <MediaCarousel title="Popular" subtitle="The most popular movies right now." items={popular?.results || []} type="movie" />
        <MediaCarousel title="Top Rated" subtitle="Highest rated of all time." items={topRated?.results || []} type="movie" />
      </div>
    </div>
  );
};

export default MoviesPage;
