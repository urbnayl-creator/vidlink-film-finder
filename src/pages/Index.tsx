import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import MediaCarousel from "@/components/MediaCarousel";
import AdBlockPopup from "@/components/AdBlockPopup";
import ContinueWatching from "@/components/ContinueWatching";
import Footer from "@/components/Footer";
import SkeletonHero from "@/components/SkeletonHero";
import SkeletonCarousel from "@/components/SkeletonCarousel";
import { getTrending, getPopular, getTopRated, getAnime, getPopularTvNoAnime, getTopRatedTvNoAnime } from "@/lib/tmdb";

const Index = () => {
  const { data: trending, isLoading: loadingTrending } = useQuery({ queryKey: ["trending"], queryFn: () => getTrending("all") });
  const { data: popularMovies, isLoading: loadingPopMovies } = useQuery({ queryKey: ["popular", "movie"], queryFn: () => getPopular("movie") });
  const { data: popularTv, isLoading: loadingPopTv } = useQuery({ queryKey: ["popular", "tv", "no-anime"], queryFn: getPopularTvNoAnime });
  const { data: topMovies, isLoading: loadingTopMovies } = useQuery({ queryKey: ["topRated", "movie"], queryFn: () => getTopRated("movie") });
  const { data: topTv, isLoading: loadingTopTv } = useQuery({ queryKey: ["topRated", "tv", "no-anime"], queryFn: getTopRatedTvNoAnime });
  const { data: anime, isLoading: loadingAnime } = useQuery({ queryKey: ["anime"], queryFn: () => getAnime() });

  const heroMovies = trending?.results?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AdBlockPopup />
      <main>
        {loadingTrending ? <SkeletonHero /> : <HeroBanner movies={heroMovies} />}
        <div className="max-w-[1280px] mx-auto space-y-10 py-10 stagger-children">
          <ContinueWatching />
          {loadingTrending ? <SkeletonCarousel /> : <MediaCarousel title="Trending Movies" subtitle="Stay on the pulse of what's hot in the movie scene." items={trending?.results?.filter(m => m.media_type === 'movie' || !m.media_type).slice(0, 20) || []} type="movie" />}
          {loadingPopMovies ? <SkeletonCarousel /> : <MediaCarousel title="Popular Movies" subtitle="The most popular movies right now." items={popularMovies?.results || []} type="movie" />}
          {loadingPopTv ? <SkeletonCarousel /> : <MediaCarousel title="Popular TV Shows" subtitle="Top picks from the TV world." items={popularTv?.results || []} type="tv" />}
          {loadingAnime ? <SkeletonCarousel /> : <MediaCarousel title="Anime" subtitle="Top anime series from Japan." items={anime?.results || []} type="tv" />}
          {loadingTopMovies ? <SkeletonCarousel /> : <MediaCarousel title="Top Rated Movies" subtitle="Critically acclaimed masterpieces." items={topMovies?.results || []} type="movie" />}
          {loadingTopTv ? <SkeletonCarousel /> : <MediaCarousel title="Top Rated TV Shows" subtitle="The best shows ever made." items={topTv?.results || []} type="tv" />}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
