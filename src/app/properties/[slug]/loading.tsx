export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-80 lg:h-[28rem] bg-muted rounded-xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 bg-muted rounded animate-pulse" />
            <div className="h-5 w-1/3 bg-muted rounded animate-pulse" />
            <div className="h-40 bg-muted rounded animate-pulse" />
            <div className="h-10 w-40 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
