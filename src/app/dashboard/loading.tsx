export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-ink">
      {/* Top nav skeleton */}
      <div className="sticky top-0 z-30 border-b border-border/60 bg-ink/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="size-8 animate-pulse rounded-full bg-border/50" />
            <div className="h-5 w-32 animate-pulse rounded bg-border/50" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 animate-pulse rounded-full bg-border/50" />
            <div className="h-5 w-24 animate-pulse rounded bg-border/50" />
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6">
        {/* Sidebar skeleton */}
        <aside className="hidden w-60 shrink-0 md:block">
          <div className="card-luxury sticky top-20 rounded-2xl p-3">
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2.5">
                  <div className="size-5 animate-pulse rounded bg-border/50" />
                  <div className="h-4 w-24 animate-pulse rounded bg-border/50" />
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content skeleton */}
        <main className="min-w-0 flex-1">
          <div className="mb-6">
            <div className="h-7 w-48 animate-pulse rounded bg-border/50" />
            <div className="mt-2 h-4 w-72 animate-pulse rounded bg-border/50" />
          </div>

          {/* Stats cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card-luxury rounded-2xl p-5">
                <div className="mb-3 h-4 w-20 animate-pulse rounded bg-border/50" />
                <div className="mb-1 h-8 w-16 animate-pulse rounded bg-border/50" />
                <div className="h-3 w-24 animate-pulse rounded bg-border/50" />
              </div>
            ))}
          </div>

          {/* Content area */}
          <div className="card-luxury rounded-2xl p-6">
            <div className="mb-4 h-5 w-32 animate-pulse rounded bg-border/50" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 rounded-lg border border-border/50 p-4">
                  <div className="size-10 animate-pulse rounded-full bg-border/50" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 animate-pulse rounded bg-border/50" />
                    <div className="h-3 w-32 animate-pulse rounded bg-border/50" />
                  </div>
                  <div className="h-8 w-20 animate-pulse rounded bg-border/50" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
