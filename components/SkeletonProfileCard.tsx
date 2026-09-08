import React from 'react';

export default function SkeletonProfileCard() {
  return (
    <div className="w-full max-w-[420px] bg-surface rounded-3xl border border-black/[0.08] shadow-macos overflow-hidden">
      {/* macOS Titlebar */}
      <div className="h-9 px-4 flex items-center bg-black/[0.02] border-b border-black/[0.03]">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-black/[0.1]" />
          <div className="w-3 h-3 rounded-full bg-black/[0.1]" />
          <div className="w-3 h-3 rounded-full bg-black/[0.1]" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="w-16 h-1.5 rounded-full bg-black/[0.06]" />
        </div>
        <div className="w-14" />
      </div>

      {/* Banner */}
      <div className="relative h-36 w-full bg-black/[0.04] animate-pulse" />

      {/* Content Container */}
      <div className="relative px-5 pb-8">
        {/* Avatar */}
        <div className="relative -mt-12 mb-4 w-24 h-24 rounded-full ring-4 ring-surface bg-surface shadow-md flex items-center justify-center bg-black/[0.04] animate-pulse" />

        {/* Info */}
        <div className="mb-6 space-y-2">
          <div className="h-4 w-36 bg-black/[0.04] animate-pulse rounded" />
          <div className="h-3 w-24 bg-black/[0.04] animate-pulse rounded" />
          <div className="h-3 w-[200px] bg-black/[0.04] animate-pulse rounded" />
        </div>

        {/* Links Stack */}
        <div className="flex flex-col gap-2.5">
          <div className="h-10 w-56 bg-black/[0.04] rounded-xl animate-pulse" />
          <div className="h-10 w-48 bg-black/[0.04] rounded-xl animate-pulse" />
          <div className="h-10 w-40 bg-black/[0.04] rounded-xl animate-pulse" />
          <div className="h-10 w-32 bg-black/[0.04] rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}