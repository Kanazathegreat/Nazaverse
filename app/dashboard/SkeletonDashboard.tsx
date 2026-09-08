import React from 'react';

export default function SkeletonDashboard() {
  return (
    <div className="w-full max-w-[560px] rounded-2xl rounded-2xl bg-surface shadow-macos border border-black/[0.08] overflow-hidden">
      {/* macOS Window Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-black/[0.05] bg-surface/80 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-black/[0.1]" />
          <div className="w-3 h-3 rounded-full bg-black/[0.1]" />
          <div className="w-3 h-3 rounded-full bg-black/[0.1]" />
        </div>
        <span className="text-xs font-medium text-secondary select-none tracking-tight">
          Dashboard — Nazaverse Studio
        </span>
        <button className="text-xs font-medium text-secondary hover:text-traffic-red transition-colors flex items-center gap-1">
          <svg className="w-3.5 h-3.5" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>

      {/* Content Body */}
      <div className="pb-8 max-h-[80vh] overflow-y-auto">
        {/* Banner Section */}
        <div className="relative h-36 w-full bg-black/[0.04] animate-pulse group overflow-hidden cursor-pointer" />

        {/* Avatar Section & View Profile Link */}
        <div className="px-6 sm:px-8 -mt-12 relative z-10 flex items-end justify-between">
          <div className="relative w-24 h-24 rounded-full border-4 border-surface bg-surface shadow-md overflow-hidden group cursor-pointer">
            <div className="w-24 h-24 rounded-full bg-black/[0.04] animate-pulse" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <svg className="w-5 h-5 text-white" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m2 0a2 2 0 100-4 2 2 0 000 4z"/></svg>
            </div>
          </div>
          <div className="pb-1">
            <span className="px-3 py-1.5 text-xs font-medium text-accent bg-accent/10 border border-accent/20 rounded-xl hover:bg-accent/20 transition-all flex items-center gap-1.5">
              <span>View profile</span>
              <svg className="w-3 h-3" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            </span>
          </div>
        </div>

        <div className="px-6 sm:px-8 pt-6 space-y-6">
          {/* Notifications Area (skeleton not needed) */}
          {/* Links Section Placeholder */}
          <div className="space-y-4 pt-2 border-t border-black/[0.06]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-primary tracking-tight">
                  Your Links
                </h2>
                <p className="text-xs text-secondary mt-0.5">
                  Drag and drop to reorder your links
                </p>
              </div>
              <button className="px-3 py-2 text-xs font-medium text-white bg-accent rounded-xl hover:opacity-95 transition-all flex items-center gap-1.5 shadow-sm">
                <svg className="w-3.5 h-3.5" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
                <span>Add Link</span>
              </button>
            </div>

            {/* Links List with DnD - skeleton rows */}
            <div className="space-y-2.5">
              <div className="h-10 w-56 bg-black/[0.04] rounded-xl animate-pulse" />
              <div className="h-10 w-48 bg-black/[0.04] rounded-xl animate-pulse" />
              <div className="h-10 w-40 bg-black/[0.04] rounded-xl animate-pulse" />
              <div className="h-10 w-32 bg-black/[0.04] rounded-xl animate-pulse" />
            </div>
          </div>

          {/* Profile Details Form - skeleton */}
          <div className="space-y-4 pt-6 border-t border-black/[0.06]">
            <div>
              <h2 className="text-base font-semibold text-primary tracking-tight">
                Profile Details
              </h2>
              <p className="text-xs text-secondary mt-0.5">
                Manage your username, display name, and bio
              </p>
            </div>
            <form className="space-y-4">
              {/* Username */}
              <div className="space-y-1.5 text-left">
                <input className="w-full pl-7 pr-3.5 py-2.5 text-sm bg-neutral-50/50 border border-black/[0.08] rounded-xl text-primary placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all font-mono animate-pulse" />
              </div>
              {/* Display Name */}
              <div className="space-y-1.5 text-left">
                <input className="w-full px-3.5 py-2.5 text-sm bg-neutral-50/50 border border-black/[0.08] rounded-xl text-primary placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all animate-pulse" />
              </div>
              {/* Bio */}
              <div className="space-y-1.5 text-left">
                <textarea className="w-full px-3.5 py-2.5 text-sm bg-neutral-50/50 border border-black/[0.08] rounded-xl text-primary placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all resize-none animate-pulse" rows={3} />
              </div>
              {/* Submit Button */}
              <div className="pt-2">
                <button className="w-full py-2.5 px-4 bg-accent text-white font-medium text-sm rounded-xl hover:opacity-95 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse">
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}