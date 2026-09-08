export default function Loading() {
  return (
    <main className="min-h-screen py-10 px-4 flex items-center justify-center bg-background">
      <div className="w-full max-w-[560px] rounded-2xl bg-surface shadow-macos border border-black/[0.08] overflow-hidden animate-pulse">
        <div className="flex items-center justify-between px-4 py-3 border-b border-black/[0.05] bg-surface/80">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-black/10 inline-block" />
            <span className="w-3 h-3 rounded-full bg-black/10 inline-block" />
            <span className="w-3 h-3 rounded-full bg-black/10 inline-block" />
          </div>
          <div className="h-3 w-32 bg-black/10 rounded" />
          <div className="w-10" />
        </div>
        <div className="h-36 w-full bg-neutral-200" />
        <div className="px-6 sm:px-8 -mt-12 relative z-10 flex items-end justify-between">
          <div className="w-24 h-24 rounded-full border-4 border-surface bg-neutral-300" />
          <div className="h-8 w-24 bg-neutral-200 rounded-xl mb-1" />
        </div>
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <div className="h-6 w-32 bg-neutral-200 rounded" />
            <div className="h-3 w-48 bg-neutral-200 rounded" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 w-full bg-neutral-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
