export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-10 w-48 bg-muted rounded animate-pulse mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="h-6 w-40 bg-muted rounded animate-pulse" />
            <div className="h-8 w-72 bg-muted rounded animate-pulse" />
            <div className="h-24 w-full bg-muted rounded animate-pulse" />
          </div>
          <div className="h-64 lg:h-96 bg-muted rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
