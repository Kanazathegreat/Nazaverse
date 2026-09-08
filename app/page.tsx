'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { Wordmark } from '@/components/Wordmark';
import { ArrowRight, Loader2 } from 'lucide-react';

export default function Home() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <main className="min-h-screen py-10 px-4 flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-accent/50" />
      </main>
    );
  }

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
          <div className="w-12" />
        </div>

        <div className="p-8 sm:p-10 space-y-10">
          {/* Logo Section */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="scale-125 mb-2">
              <Wordmark />
            </div>
            <p className="text-sm text-secondary max-w-[280px] leading-relaxed">
              The macOS-inspired link-in-bio for creators & developers.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex justify-center">
              <span className="px-3 py-1 text-[10px] font-semibold uppercase tracking-widest bg-accent/10 text-accent rounded-full border border-accent/20">
                Preview Beta
              </span>
            </div>
            
            <div className="pt-2">
              <Link
                href="/login"
                className="w-full py-3.5 px-6 bg-accent text-white font-semibold rounded-xl hover:opacity-95 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2 group"
              >
                <span>Sign in to Start</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
