import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MediaCard from "./MediaCard";
import type { Movie } from "@/lib/tmdb";

interface MediaCarouselProps {
  title: string;
  subtitle?: string;
  items: Movie[];
  type?: "movie" | "tv";
}

const ITEMS_PER_PAGE = 7;

const MediaCarousel = ({ title, subtitle, items, type }: MediaCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const newPage = dir === "left" ? Math.max(0, page - 1) : Math.min(totalPages - 1, page + 1);
    setPage(newPage);
    const itemWidth = scrollRef.current.scrollWidth / items.length;
    scrollRef.current.scrollTo({ left: newPage * ITEMS_PER_PAGE * itemWidth, behavior: "smooth" });
  };

  if (!items.length) return null;

  return (
    <section className="relative">
      <div className="flex items-end justify-between mb-4 px-6 md:px-0">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground mr-2">{page + 1} / {totalPages}</span>
          <button
            onClick={() => scroll("left")}
            disabled={page === 0}
            className="p-1.5 border border-border rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={page >= totalPages - 1}
            className="p-1.5 border border-border rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide px-6 md:px-0 pb-2"
      >
        {items.map((item) => (
          <MediaCard key={item.id} item={item} type={type} />
        ))}
      </div>
    </section>
  );
};

export default MediaCarousel;
