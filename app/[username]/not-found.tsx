import Link from 'next/link';
import { Home, User } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen py-10 px-4 flex items-center justify-center bg-background">
      <div className="w-full max-w-[480px] rounded-2xl bg-surface shadow-macos border border-black/[0.08] overflow-hidden">
        {/* macOS Window Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-black/[0.05] bg-surface/80 backdrop-blur-md">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-traffic-red inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-traffic-yellow inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-traffic-green inline-block shadow-sm" />
          </div>
          <span className="text-xs font-medium text-secondary select-none tracking-tight">
            Nazaverse Window
          </span>
          <div className="w-12 flex justify-end">
            <Link
              href="/"
              className="text-xs text-secondary hover:text-primary transition-colors flex items-center gap-1"
            >
              <Home className="w-3 h-3" />
              Home
            </Link>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent mx-auto flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-semibold text-primary tracking-tight">
              Profile not found
            </h1>
            <p className="text-sm text-secondary max-w-[280px] mx-auto">
              This username doesn’t exist. Check the spelling or try another.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}