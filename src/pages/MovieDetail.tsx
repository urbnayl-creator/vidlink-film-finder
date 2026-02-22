import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import MediaCarousel from "@/components/MediaCarousel";
import { getMovieDetail, getCredits, getRecommendations, backdrop, img } from "@/lib/tmdb";
import { Play, Star, Clock, Calendar } from "lucide-react";

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = Number(id);

  const { data: movie } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: !!movieId,
  });

  const { data: credits } = useQuery({
    queryKey: ["credits", "movie", movieId],
    queryFn: () => getCredits("movie", movieId),
    enabled: !!movieId,
  });

  const { data: recs } = useQuery({
    queryKey: ["recs", "movie", movieId],
    queryFn: () => getRecommendations("movie", movieId),
    enabled: !!movieId,
  });

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex items-center justify-center h-[60vh]">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="relative h-[60vh] min-h-[400px]">
        <img src={backdrop(movie.backdrop_path)} alt={movie.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-40 relative z-10 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          <img
            src={img(movie.poster_path, "w500")}
            alt={movie.title}
            className="w-56 rounded-xl shadow-2xl shrink-0 self-start hidden md:block"
          />
          <div className="flex-1 animate-fade-in">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-muted-foreground italic mb-4">"{movie.tagline}"</p>
            )}
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
              <span className="flex items-center gap-1 text-primary">
                <Star className="w-4 h-4 fill-primary" /> {movie.vote_average?.toFixed(1)}
              </span>
              {movie.runtime && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" /> {movie.runtime} min
                </span>
              )}
              <span className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="w-4 h-4" /> {movie.release_date?.slice(0, 4)}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres?.map((g) => (
                <span key={g.id} className="px-3 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">
                  {g.name}
                </span>
              ))}
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl">
              {movie.overview}
            </p>
            <Link
              to={`/watch/movie/${movie.id}`}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-full transition-colors"
            >
              <Play className="w-5 h-5 fill-current" /> Watch Now
            </Link>

            {credits?.cast && credits.cast.length > 0 && (
              <div className="mt-10">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">Cast</h3>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                  {credits.cast.slice(0, 10).map((person) => (
                    <div key={person.id} className="shrink-0 text-center w-20">
                      <div className="w-16 h-16 rounded-full overflow-hidden mx-auto bg-secondary">
                        {person.profile_path ? (
                          <img src={img(person.profile_path, "w185")} alt={person.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">N/A</div>
                        )}
                      </div>
                      <p className="text-xs text-foreground mt-1 truncate">{person.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{person.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {recs?.results && recs.results.length > 0 && (
          <div className="mt-16">
            <MediaCarousel title="Recommended" items={recs.results} type="movie" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;
