export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-10 w-2/3 bg-muted rounded animate-pulse mb-6" />
        <div className="h-5 w-1/3 bg-muted rounded animate-pulse mb-8" />
        <div className="h-80 bg-muted rounded-xl animate-pulse mb-8" />
        <div className="space-y-4">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="h-4 w-full bg-muted rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
