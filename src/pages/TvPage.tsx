import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import MediaCarousel from "@/components/MediaCarousel";
import Footer from "@/components/Footer";
import { getPopularTvNoAnime, getTopRatedTvNoAnime, getTrendingTvNoAnime } from "@/lib/tmdb";

const TvPage = () => {
  const { data: popular } = useQuery({
    queryKey: ["popular", "tv", "no-anime"],
    queryFn: getPopularTvNoAnime,
  });

  const { data: topRated } = useQuery({
    queryKey: ["topRated", "tv", "no-anime"],
    queryFn: getTopRatedTvNoAnime,
  });

  const { data: trending } = useQuery({
    queryKey: ["trending", "tv", "no-anime"],
    queryFn: getTrendingTvNoAnime,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-[1280px] mx-auto pt-24 pb-16 space-y-10">
        <h1 className="text-2xl font-bold text-foreground px-6 md:px-0">TV Shows</h1>
        <MediaCarousel title="Trending" subtitle="What's trending this week." items={trending?.results || []} type="tv" />
        <MediaCarousel title="Popular" subtitle="Top picks from the TV world." items={popular?.results || []} type="tv" />
        <MediaCarousel title="Top Rated" subtitle="The best shows ever made." items={topRated?.results || []} type="tv" />
      </div>
      <Footer />
    </div>
  );
};

export default TvPage;
