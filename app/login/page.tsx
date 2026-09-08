'use client';

import { useEffect } from 'react';
import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(
    urlError === 'auth_failed' ? 'Authentication failed. Please request a new magic link.' : null
  );

  const supabase = createClient();

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSent(true);
    }
  };

  const handleReset = () => {
    setSent(false);
    setEmail('');
    setErrorMsg(null);
  };

  return (
    <div className="w-full max-w-[400px] rounded-2xl bg-surface shadow-macos border border-black/[0.08] overflow-hidden">
      {/* macOS Window Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-black/[0.05] bg-surface/80 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-traffic-red inline-block shadow-sm" />
          <span className="w-3 h-3 rounded-full bg-traffic-yellow inline-block shadow-sm" />
          <span className="w-3 h-3 rounded-full bg-traffic-green inline-block shadow-sm" />
        </div>
        <span className="text-xs font-medium text-secondary select-none tracking-tight">
          Sign In
        </span>
        <div className="w-12 flex justify-end">
          <Link
            href="/"
            className="text-xs text-secondary hover:text-primary transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            Home
          </Link>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6 sm:p-8">
        {sent ? (
          /* Success State */
          <div className="text-center space-y-5">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shadow-sm">
              <Mail className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-semibold text-primary tracking-tight">
                Check your email
              </h2>
              <p className="text-xs text-secondary leading-relaxed px-2">
                We sent a magic link to <span className="font-semibold text-primary">{email}</span>. Click the link in your email to sign in.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="w-full py-2.5 text-xs font-medium text-secondary hover:text-primary rounded-xl border border-black/[0.08] hover:bg-black/[0.02] transition-colors"
              >
                Use another email
              </button>
            </div>
          </div>
        ) : (
          /* Form State */
          <div className="space-y-6">
            <div className="text-center space-y-1.5">
              <h1 className="text-xl font-semibold text-primary tracking-tight">
                Sign in to Nazaverse
              </h1>
              <p className="text-xs text-secondary">
                Enter email to receive magic link
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 text-xs rounded-xl bg-traffic-red/10 border border-traffic-red/20 text-traffic-red leading-relaxed">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSendMagicLink} className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label htmlFor="email" className="text-xs font-medium text-secondary">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@nazaverse.com"
                  required
                  disabled={loading}
                  className="w-full px-3.5 py-2.5 text-sm bg-neutral-50/50 border border-black/[0.08] rounded-xl text-primary placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-accent text-white font-medium text-sm rounded-xl hover:opacity-95 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Send Magic Link</span>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
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
      <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-accent/50" />}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
