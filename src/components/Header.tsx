import { Link, useNavigate } from "react-router-dom";
import { Search, Home, Film, Tv, ChevronDown, User, Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const Header = () => {
  const [query, setQuery] = useState("");
  const [moviesOpen, setMoviesOpen] = useState(false);
  const [tvOpen, setTvOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);
  const moviesRef = useRef<HTMLDivElement>(null);
  const tvRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (moviesRef.current && !moviesRef.current.contains(e.target as Node)) setMoviesOpen(false);
      if (tvRef.current && !tvRef.current.contains(e.target as Node)) setTvOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-4 mt-3 glass-nav rounded-2xl">
          <div className="max-w-[1280px] mx-auto px-5 h-12 flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-1">
              <Link to="/" className="mr-3 text-foreground">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-foreground">
                  <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <path d="M12 22V12M2 7l10 5 10-5" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </Link>

              {/* Desktop nav */}
              <nav className="hidden md:flex items-center gap-0.5">
                <Link to="/" className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/40">
                  <Home className="w-3.5 h-3.5" />
                  <span>Home</span>
                </Link>

                <div ref={moviesRef} className="relative">
                  <button
                    onClick={() => { setMoviesOpen(!moviesOpen); setTvOpen(false); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/40"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Movies</span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${moviesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {moviesOpen && (
                    <div className="absolute top-full left-0 mt-2 w-44 glass-nav rounded-xl shadow-2xl py-1.5 z-50">
                      <Link to="/movies" onClick={() => setMoviesOpen(false)} className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors">Popular Movies</Link>
                      <Link to="/movies?tab=top" onClick={() => setMoviesOpen(false)} className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors">Top Rated</Link>
                      <Link to="/movies?tab=trending" onClick={() => setMoviesOpen(false)} className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors">Trending</Link>
                    </div>
                  )}
                </div>

                <div ref={tvRef} className="relative">
                  <button
                    onClick={() => { setTvOpen(!tvOpen); setMoviesOpen(false); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/40"
                  >
                    <Tv className="w-3.5 h-3.5" />
                    <span>TV Shows</span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${tvOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {tvOpen && (
                    <div className="absolute top-full left-0 mt-2 w-44 glass-nav rounded-xl shadow-2xl py-1.5 z-50">
                      <Link to="/tv" onClick={() => setTvOpen(false)} className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors">Popular Shows</Link>
                      <Link to="/tv?tab=top" onClick={() => setTvOpen(false)} className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors">Top Rated</Link>
                      <Link to="/tv?tab=trending" onClick={() => setTvOpen(false)} className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors">Trending</Link>
                    </div>
                  )}
                </div>
              </nav>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
              {/* Desktop search */}
              <form onSubmit={handleSearch} className="relative hidden sm:block">
                <div className="flex items-center bg-secondary/30 border border-border/50 rounded-full overflow-hidden">
                  <Search className="w-3.5 h-3.5 text-muted-foreground ml-3" />
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground px-2.5 py-1.5 w-36 lg:w-48 focus:w-52 lg:focus:w-64 transition-all focus:outline-none"
                  />
                </div>
              </form>

              {/* Mobile search icon */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="sm:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>

              <button className="hidden sm:flex p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/40">
                <User className="w-4 h-4" />
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-0 right-0 w-72 h-full glass-nav border-l border-border/30 p-6 flex flex-col gap-6 animate-slide-in-right">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile search */}
            <form onSubmit={handleSearch}>
              <div className="flex items-center bg-secondary/30 border border-border/50 rounded-full overflow-hidden">
                <Search className="w-3.5 h-3.5 text-muted-foreground ml-3" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground px-2.5 py-2 w-full focus:outline-none"
                />
              </div>
            </form>

            <nav className="flex flex-col gap-1">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/40 transition-colors">
                <Home className="w-4 h-4" /> Home
              </Link>
              <Link to="/movies" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/40 transition-colors">
                <Film className="w-4 h-4" /> Movies
              </Link>
              <Link to="/tv" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/40 transition-colors">
                <Tv className="w-4 h-4" /> TV Shows
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
