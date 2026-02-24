import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import MovieDetail from "./pages/MovieDetail";
import TvDetail from "./pages/TvDetail";
import Watch from "./pages/Watch";
import SearchPage from "./pages/SearchPage";
import MoviesPage from "./pages/MoviesPage";
import TvPage from "./pages/TvPage";
import AnimePage from "./pages/AnimePage";
import GenrePage from "./pages/GenrePage";
import AuthPage from "./pages/AuthPage";
import WatchlistPage from "./pages/WatchlistPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/tv" element={<TvPage />} />
            <Route path="/anime" element={<AnimePage />} />
            <Route path="/genre/:type" element={<GenrePage />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/tv/:id" element={<TvDetail />} />
            <Route path="/watch/:type/:id" element={<Watch />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
