import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import MediaCarousel from "@/components/MediaCarousel";
import { getPopular, getTopRated } from "@/lib/tmdb";

const TvPage = () => {
  const { data: popular } = useQuery({
    queryKey: ["popular", "tv"],
    queryFn: () => getPopular("tv"),
  });

  const { data: topRated } = useQuery({
    queryKey: ["topRated", "tv"],
    queryFn: () => getTopRated("tv"),
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto pt-24 pb-16 space-y-10">
        <h1 className="font-display text-3xl font-bold text-foreground px-4 md:px-0">TV Shows</h1>
        <MediaCarousel title="Popular" items={popular?.results || []} type="tv" />
        <MediaCarousel title="Top Rated" items={topRated?.results || []} type="tv" />
      </div>
    </div>
  );
};

export default TvPage;
