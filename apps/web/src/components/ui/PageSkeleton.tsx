export function PageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-48 animate-pulse rounded-xl bg-white/5" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="h-40 animate-pulse rounded-2xl bg-white/5" />
        <div className="h-40 animate-pulse rounded-2xl bg-white/5" />
        <div className="h-40 animate-pulse rounded-2xl bg-white/5" />
      </div>
    </div>
  );
}
