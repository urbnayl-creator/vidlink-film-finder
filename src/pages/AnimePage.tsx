import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MediaCarousel from "@/components/MediaCarousel";
import { getAnime } from "@/lib/tmdb";

const AnimePage = () => {
  const { data: anime } = useQuery({
    queryKey: ["anime"],
    queryFn: getAnime,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-[1280px] mx-auto pt-24 pb-16 space-y-10">
        <h1 className="text-2xl font-bold text-foreground px-6 md:px-0">Anime</h1>
        <MediaCarousel title="Popular Anime" subtitle="Top anime series from Japan." items={anime?.results || []} type="tv" />
      </div>
      <Footer />
    </div>
  );
};

export default AnimePage;
