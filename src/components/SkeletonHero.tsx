import { Skeleton } from "@/components/ui/skeleton";

const SkeletonHero = () => (
  <div className="relative h-[60vh] sm:h-[65vh] min-h-[420px] bg-secondary flex flex-col items-center justify-end pb-12 sm:pb-16">
    <div className="text-center max-w-2xl px-4">
      <Skeleton className="h-10 w-64 mx-auto mb-4 rounded" />
      <Skeleton className="h-4 w-80 mx-auto mb-2 rounded" />
      <Skeleton className="h-4 w-60 mx-auto mb-8 rounded" />
      <div className="flex items-center justify-center gap-3">
        <Skeleton className="h-11 w-32 rounded-full" />
        <Skeleton className="h-11 w-28 rounded-full" />
      </div>
    </div>
  </div>
);

export default SkeletonHero;
