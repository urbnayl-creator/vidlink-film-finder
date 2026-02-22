import { Link, useNavigate } from "react-router-dom";
import { Search, Home, Film, Tv, ChevronDown, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const Header = () => {
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [moviesOpen, setMoviesOpen] = useState(false);
  const [tvOpen, setTvOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);
  const moviesRef = useRef<HTMLDivElement>(null);
  const tvRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (moviesRef.current && !moviesRef.current.contains(e.target as Node)) setMoviesOpen(false);
      if (tvRef.current && !tvRef.current.contains(e.target as Node)) setTvOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setSearchOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-[1280px] mx-auto px-6 h-14 flex items-center justify-between">
        {/* Left nav */}
        <div className="flex items-center gap-1">
          {/* Logo */}
          <Link to="/" className="mr-4 text-foreground">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-foreground">
              <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M12 22V12M2 7l10 5 10-5" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </Link>

          <Link to="/" className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary/50">
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>

          {/* Movies dropdown */}
          <div ref={moviesRef} className="relative">
            <button
              onClick={() => { setMoviesOpen(!moviesOpen); setTvOpen(false); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary/50"
            >
              <Film className="w-4 h-4" />
              <span>Movies</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moviesOpen ? 'rotate-180' : ''}`} />
            </button>
            {moviesOpen && (
              <div className="absolute top-full left-0 mt-1 w-44 bg-card border border-border rounded-lg shadow-xl py-1 z-50">
                <Link to="/movies" onClick={() => setMoviesOpen(false)} className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
                  Popular Movies
                </Link>
                <Link to="/movies?tab=top" onClick={() => setMoviesOpen(false)} className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
                  Top Rated
                </Link>
                <Link to="/movies?tab=trending" onClick={() => setMoviesOpen(false)} className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
                  Trending
                </Link>
              </div>
            )}
          </div>

          {/* TV Shows dropdown */}
          <div ref={tvRef} className="relative">
            <button
              onClick={() => { setTvOpen(!tvOpen); setMoviesOpen(false); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary/50"
            >
              <Tv className="w-4 h-4" />
              <span>TV Shows</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${tvOpen ? 'rotate-180' : ''}`} />
            </button>
            {tvOpen && (
              <div className="absolute top-full left-0 mt-1 w-44 bg-card border border-border rounded-lg shadow-xl py-1 z-50">
                <Link to="/tv" onClick={() => setTvOpen(false)} className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
                  Popular Shows
                </Link>
                <Link to="/tv?tab=top" onClick={() => setTvOpen(false)} className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
                  Top Rated
                </Link>
                <Link to="/tv?tab=trending" onClick={() => setTvOpen(false)} className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
                  Trending
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right - Search + User */}
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="relative">
            <div className="flex items-center bg-secondary/50 border border-border rounded-lg overflow-hidden">
              <Search className="w-4 h-4 text-muted-foreground ml-3" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground px-3 py-2 w-48 focus:w-64 transition-all focus:outline-none"
              />
            </div>
          </form>
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50">
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
