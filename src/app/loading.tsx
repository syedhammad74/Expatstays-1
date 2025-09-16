export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="h-8 w-64 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-72 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
