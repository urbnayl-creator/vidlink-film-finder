import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
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
      <div className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="font-display text-2xl font-bold text-foreground mb-6">
          {query ? `Results for "${query}"` : "Search"}
        </h1>
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : results.length === 0 ? (
          <p className="text-muted-foreground">No results found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
