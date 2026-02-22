import { Link, useNavigate } from "react-router-dom";
import { Search, Film, Tv, TrendingUp } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Film className="w-6 h-6 text-primary" />
          <span className="font-display text-xl font-bold text-gradient">CineVault</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" /> Trending
          </Link>
          <Link to="/movies" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
            <Film className="w-4 h-4" /> Movies
          </Link>
          <Link to="/tv" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
            <Tv className="w-4 h-4" /> TV Shows
          </Link>
        </nav>

        <form onSubmit={handleSearch} className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search movies & shows..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-secondary/50 border border-border rounded-full pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </form>
      </div>
    </header>
  );
};

export default Header;
