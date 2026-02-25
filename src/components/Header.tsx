import { Link, useNavigate } from "react-router-dom";
import { Search, Home, Film, Tv, ChevronDown, User, Menu, LogOut, Heart, Grid3X3 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

const AnimeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);

const Header = () => {
  const [query, setQuery] = useState("");
  const [moviesOpen, setMoviesOpen] = useState(false);
  const [tvOpen, setTvOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);
  const moviesRef = useRef<HTMLDivElement>(null);
  const tvRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (moviesRef.current && !moviesRef.current.contains(e.target as Node)) setMoviesOpen(false);
      if (tvRef.current && !tvRef.current.contains(e.target as Node)) setTvOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (searchExpanded && searchRef.current) searchRef.current.focus();
  }, [searchExpanded]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setMobileMenuOpen(false);
      setSearchExpanded(false);
    }
  };

  const handleSignOut = async () => {
    setMobileMenuOpen(false);
    await signOut();
    navigate("/");
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-fit mx-auto mt-3 glass-nav rounded-2xl">
          <div className="px-5 h-12 flex items-center justify-between">
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
                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${moviesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`absolute top-full left-0 mt-2 w-44 glass-nav rounded-xl shadow-2xl py-1.5 z-50 transition-all duration-200 origin-top ${moviesOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
                    <Link to="/movies" onClick={() => setMoviesOpen(false)} className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors">Popular Movies</Link>
                    <Link to="/movies?tab=top" onClick={() => setMoviesOpen(false)} className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors">Top Rated</Link>
                    <Link to="/movies?tab=trending" onClick={() => setMoviesOpen(false)} className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors">Trending</Link>
                  </div>
                </div>

                <div ref={tvRef} className="relative">
                  <button
                    onClick={() => { setTvOpen(!tvOpen); setMoviesOpen(false); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/40"
                  >
                    <Tv className="w-3.5 h-3.5" />
                    <span>TV Shows</span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${tvOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`absolute top-full left-0 mt-2 w-44 glass-nav rounded-xl shadow-2xl py-1.5 z-50 transition-all duration-200 origin-top ${tvOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
                    <Link to="/tv" onClick={() => setTvOpen(false)} className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors">Popular Shows</Link>
                    <Link to="/tv?tab=top" onClick={() => setTvOpen(false)} className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors">Top Rated</Link>
                    <Link to="/tv?tab=trending" onClick={() => setTvOpen(false)} className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors">Trending</Link>
                  </div>
                </div>

                <Link to="/anime" className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/40">
                  <AnimeIcon />
                  <span>Anime</span>
                </Link>

                <Link to="/genre/movie" className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/40">
                  <Grid3X3 className="w-3.5 h-3.5" />
                  <span>Genres</span>
                </Link>
              </nav>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
              {/* Desktop search */}
              <div className="relative hidden sm:flex items-center">
                <form onSubmit={handleSearch} className={`flex items-center transition-all duration-300 ease-out overflow-hidden ${searchExpanded ? 'w-52 lg:w-64' : 'w-0'}`}>
                  <div className="flex items-center bg-secondary/30 border border-border/50 rounded-full overflow-hidden w-full">
                    <input ref={searchRef} type="text" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)}
                      onBlur={() => { if (!query) setSearchExpanded(false); }}
                      className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground px-3 py-1.5 w-full focus:outline-none" />
                  </div>
                </form>
                <button onClick={() => setSearchExpanded(!searchExpanded)} className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/40">
                  <Search className="w-4 h-4" />
                </button>
              </div>

              {/* Desktop user */}
              {user ? (
                <div className="hidden sm:flex items-center gap-1">
                  <Link to="/watchlist" className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/40">
                    <Heart className="w-4 h-4" />
                  </Link>
                  <button onClick={handleSignOut} className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/40">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link to="/auth" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/40">
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              )}

              {/* Mobile hamburger */}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className="md:hidden overflow-hidden w-[calc(100%-2rem)] max-w-sm mx-auto"
          style={{
            maxHeight: mobileMenuOpen ? '500px' : '0',
            opacity: mobileMenuOpen ? 1 : 0,
            transition: 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease',
          }}
        >
          <div className="glass-nav rounded-b-2xl border-t-0 rounded-t-none px-4 pb-4 pt-3 space-y-3">
            <form onSubmit={handleSearch}>
              <div className="flex items-center bg-secondary/30 border border-border/50 rounded-full overflow-hidden">
                <Search className="w-3.5 h-3.5 text-muted-foreground ml-3" />
                <input ref={mobileSearchRef} type="text" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)}
                  className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground px-2.5 py-2 w-full focus:outline-none" />
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
              <Link to="/anime" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/40 transition-colors">
                <AnimeIcon /> Anime
              </Link>
              <Link to="/genre/movie" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/40 transition-colors">
                <Grid3X3 className="w-4 h-4" /> Genres
              </Link>

              {user ? (
                <>
                  <Link to="/watchlist" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/40 transition-colors">
                    <Heart className="w-4 h-4" /> Watchlist
                  </Link>
                  <button onClick={handleSignOut} className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/40 transition-colors w-full text-left">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/40 transition-colors">
                  <User className="w-4 h-4" /> Login / Sign Up
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
