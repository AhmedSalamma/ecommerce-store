export function ProductCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white p-3 shadow-sm">
      <div className="aspect-square w-full rounded-xl bg-neutral-200" />
      <div className="mt-3 space-y-2">
        <div className="h-3 w-1/3 rounded bg-neutral-200" />
        <div className="h-4 w-3/4 rounded bg-neutral-200" />
        <div className="h-3 w-1/2 rounded bg-neutral-200" />
        <div className="h-4 w-1/3 rounded bg-neutral-200" />
      </div>
    </div>
  );
}
