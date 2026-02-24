import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MediaCard from "@/components/MediaCard";
import { discoverByGenre, getMovieGenres, getTvGenres } from "@/lib/tmdb";
import { ChevronLeft, ChevronRight } from "lucide-react";

const GenrePage = () => {
  const { type } = useParams<{ type: "movie" | "tv" }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const genreId = Number(searchParams.get("genre") || "0");
  const page = Number(searchParams.get("page") || "1");
  const mediaType = type === "tv" ? "tv" : "movie";

  const { data: movieGenres } = useQuery({
    queryKey: ["genres", "movie"],
    queryFn: getMovieGenres,
  });

  const { data: tvGenres } = useQuery({
    queryKey: ["genres", "tv"],
    queryFn: getTvGenres,
  });

  const genres = mediaType === "movie" ? movieGenres?.genres : tvGenres?.genres;

  const { data, isLoading } = useQuery({
    queryKey: ["discover", mediaType, genreId, page],
    queryFn: () => discoverByGenre(mediaType, genreId, page),
    enabled: genreId > 0,
  });

  const activeGenre = genres?.find((g) => g.id === genreId);

  const setGenre = (id: number) => {
    setSearchParams({ genre: id.toString(), page: "1" });
  };

  const setPage = (p: number) => {
    setSearchParams({ genre: genreId.toString(), page: p.toString() });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-[1280px] mx-auto pt-24 pb-16 px-4 sm:px-6 md:px-0">
        <div className="flex items-center gap-4 mb-6">
          <Link
            to={`/genre/${mediaType === "movie" ? "movie" : "tv"}`}
            className="text-2xl font-bold text-foreground"
          >
            {mediaType === "movie" ? "Movie" : "TV"} Genres
          </Link>
          <div className="flex gap-2">
            <Link
              to="/genre/movie"
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${mediaType === "movie" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
            >
              Movies
            </Link>
            <Link
              to="/genre/tv"
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${mediaType === "tv" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
            >
              TV Shows
            </Link>
          </div>
        </div>

        {/* Genre chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {genres?.map((genre) => (
            <button
              key={genre.id}
              onClick={() => setGenre(genre.id)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                genreId === genre.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>

        {/* Results */}
        {genreId === 0 && (
          <p className="text-muted-foreground text-center py-20">Select a genre to browse</p>
        )}

        {isLoading && genreId > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] rounded-lg bg-secondary animate-pulse" />
            ))}
          </div>
        )}

        {data && (
          <>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {activeGenre?.name} — Page {page}
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
              {data.results.map((item) => (
                <MediaCard key={item.id} item={item} type={mediaType} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="flex items-center gap-1 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <span className="text-sm text-muted-foreground">
                {page} / {Math.min(data.total_pages, 500)}
              </span>
              <button
                disabled={page >= Math.min(data.total_pages, 500)}
                onClick={() => setPage(page + 1)}
                className="flex items-center gap-1 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default GenrePage;
