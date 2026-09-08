export default function Loading() {
  return (
    <main className="min-h-screen py-10 px-4 flex items-center justify-center bg-background">
      <div className="w-full max-w-[420px] bg-surface rounded-3xl border border-black/[0.08] shadow-macos overflow-hidden animate-pulse">
        <div className="h-9 px-4 flex items-center bg-black/[0.02] border-b border-black/[0.03]">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-black/10" />
            <div className="w-3 h-3 rounded-full bg-black/10" />
            <div className="w-3 h-3 rounded-full bg-black/10" />
          </div>
        </div>
        <div className="h-36 w-full bg-neutral-200" />
        <div className="px-5 pb-8 relative">
          <div className="relative -mt-12 mb-4 w-24 h-24 rounded-full bg-neutral-200 ring-4 ring-surface" />
          <div className="mb-6 space-y-3">
            <div className="h-6 w-32 bg-neutral-200 rounded-lg" />
            <div className="h-4 w-20 bg-neutral-200 rounded-lg" />
            <div className="h-16 w-full bg-neutral-200 rounded-lg" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 w-full bg-neutral-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
