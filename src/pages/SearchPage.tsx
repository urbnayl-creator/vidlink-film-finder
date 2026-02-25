import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MediaCard from "@/components/MediaCard";
import { searchMulti } from "@/lib/tmdb";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const { data, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: () => searchMulti(query),
    enabled: query.length > 0,
  });

  const results = data?.results?.filter(
    (r) => r.media_type === "movie" || r.media_type === "tv"
  ) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-24 pb-16">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {query ? `Results for "${query}"` : "Search"}
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          {results.length > 0 ? `Found ${results.length} results` : ""}
        </p>
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-6 h-6 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
          </div>
        ) : results.length === 0 && query ? (
          <p className="text-muted-foreground">No results found.</p>
        ) : (
          <div className="media-grid grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
            {results.map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchPage;
