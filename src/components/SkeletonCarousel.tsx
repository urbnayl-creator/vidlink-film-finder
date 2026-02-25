import { Skeleton } from "@/components/ui/skeleton";

const SkeletonCarousel = () => (
  <section className="relative">
    <div className="flex items-end justify-between mb-3 sm:mb-4 px-4 sm:px-6 md:px-0">
      <div>
        <Skeleton className="h-5 w-36 rounded" />
        <Skeleton className="h-3 w-52 mt-1.5 rounded hidden sm:block" />
      </div>
    </div>
    <div className="flex gap-2.5 sm:gap-3 overflow-hidden px-4 sm:px-6 md:px-0">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="shrink-0 w-[120px] sm:w-[150px] md:w-[170px]">
          <Skeleton className="aspect-[2/3] rounded-lg w-full" />
        </div>
      ))}
    </div>
  </section>
);

export default SkeletonCarousel;
