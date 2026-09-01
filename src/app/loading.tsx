export default function Loading() {
  return (
    <div className="min-h-screen bg-ink">
      {/* Navbar skeleton */}
      <div className="sticky top-0 z-40 border-b border-border/60 bg-ink/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="size-9 animate-pulse rounded-full bg-border/50" />
            <div className="h-5 w-24 animate-pulse rounded bg-border/50" />
          </div>
          <div className="hidden items-center gap-6 md:flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 w-16 animate-pulse rounded bg-border/50" />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 animate-pulse rounded-full bg-border/50" />
            <div className="h-9 w-24 animate-pulse rounded bg-border/50" />
          </div>
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 h-6 w-48 animate-pulse rounded-full bg-border/50" />
          <div className="space-y-3">
            <div className="mx-auto h-10 w-full max-w-lg animate-pulse rounded bg-border/50" />
            <div className="mx-auto h-10 w-full max-w-md animate-pulse rounded bg-border/50" />
          </div>
          <div className="mx-auto mt-6 h-5 w-full max-w-xl animate-pulse rounded bg-border/50" />
          <div className="mx-auto mt-2 h-5 w-full max-w-lg animate-pulse rounded bg-border/50" />
          <div className="mt-8 flex justify-center gap-4">
            <div className="h-12 w-40 animate-pulse rounded bg-border/50" />
            <div className="h-12 w-40 animate-pulse rounded bg-border/50" />
          </div>
        </div>
      </div>

      {/* Content blocks skeleton */}
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card-luxury rounded-2xl p-6">
              <div className="mb-4 size-12 animate-pulse rounded-full bg-border/50" />
              <div className="mb-2 h-5 w-32 animate-pulse rounded bg-border/50" />
              <div className="space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-border/50" />
                <div className="h-3 w-3/4 animate-pulse rounded bg-border/50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
