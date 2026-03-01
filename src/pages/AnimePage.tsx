import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MediaCarousel from "@/components/MediaCarousel";
import SkeletonCarousel from "@/components/SkeletonCarousel";
import { getAnime, getTopRatedAnime, getTrendingAnime, getNewAnime } from "@/lib/tmdb";

const AnimePage = () => {
  const { data: popular, isLoading: l1 } = useQuery({ queryKey: ["anime-popular"], queryFn: getAnime });
  const { data: topRated, isLoading: l2 } = useQuery({ queryKey: ["anime-top"], queryFn: getTopRatedAnime });
  const { data: trending, isLoading: l3 } = useQuery({ queryKey: ["anime-trending"], queryFn: getTrendingAnime });
  const { data: newest, isLoading: l4 } = useQuery({ queryKey: ["anime-new"], queryFn: getNewAnime });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-[1280px] mx-auto pt-24 pb-16 space-y-10">
        <h1 className="text-2xl font-bold text-foreground px-6 md:px-0 animate-fade-up">Anime</h1>
        <div className="space-y-10 stagger-children">
          {l3 ? <SkeletonCarousel /> : <MediaCarousel title="Trending Anime" subtitle="What's hot in the anime world right now." items={trending?.results || []} type="tv" />}
          {l1 ? <SkeletonCarousel /> : <MediaCarousel title="Popular Anime" subtitle="Most watched anime series." items={popular?.results || []} type="tv" />}
          {l2 ? <SkeletonCarousel /> : <MediaCarousel title="Top Rated Anime" subtitle="Highest rated anime of all time." items={topRated?.results || []} type="tv" />}
          {l4 ? <SkeletonCarousel /> : <MediaCarousel title="New Releases" subtitle="Recently aired anime series." items={newest?.results || []} type="tv" />}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AnimePage;
