'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { Github, Twitter, Instagram, Mail, Globe, Loader2 } from 'lucide-react';

// ─── Design Read ───────────────────────────────────────────────────────────────
// Consumer personal-profile product for creators & social users.
// Scene: macOS desktop metaphor — airy, spread composition on desktop.
// ENERGY 2 / RHYTHM 1 (one cohesive scene, intentional) / MOTION 2 (entrance + float).
// Palette: system tokens only — background, surface, accent, traffic, neutrals (R-29).
//
// Ambient blobs (new): two very-low-opacity (12%), heavily-blurred (100px) color clouds
//   behind the window cards. Purpose: fill the horizontal whitespace on wider screens
//   without adding a real design element; they dissolve into the background at any
//   zoom level. Colors borrowed from the window banner gradients to feel cohesive (R-01).
//
// Float animation: continuous gentle vertical bob on the two window cards after they
//   enter (6s and 7.3s loops, different phase). Purpose: sells the "desktop scene"
//   feeling that the windows are living objects, not screenshots (R-19).
//
// Gradients on window banners: soft blue-to-peach and soft purple-to-yellow.
//   Purpose: visually distinguish the two windows, suggest profile variety (R-01).
// Glassmorphism: dock only — dose cap 1 element (R-10).
// Blue glow on CTA: single focal-point accent on the primary action (R-13: 1 element).
// Lucide icons in dock: platform-recognition — relevance is literal (R-04).
// ──────────────────────────────────────────────────────────────────────────────

export default function Home() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // entered: drives the staggered entrance sequence via inline opacity/transform
  // floating: switched on after entrance is done, hands control of the window
  //           card transforms to the CSS float-a / float-b keyframe animations
  const [entered, setEntered] = useState(false);
  const [floating, setFloating] = useState(false);

  useEffect(() => {
    const enterId = requestAnimationFrame(() => setEntered(true));
    // Start floating after the last window card has fully entered (~560ms delay + 400ms anim)
    const floatId = setTimeout(() => setFloating(true), 1000);
    return () => {
      cancelAnimationFrame(enterId);
      clearTimeout(floatId);
    };
  }, []);

  // Fade + subtle lift, optional slight scale for window cards during entrance
  const fadeIn = (delayMs: number, withScale = false) => ({
    opacity: entered ? 1 : 0,
    transform: entered
      ? 'translateY(0) scale(1)'
      : `translateY(${withScale ? 8 : 14}px) scale(${withScale ? 0.96 : 1})`,
    transition: `opacity 400ms ease ${delayMs}ms, transform 400ms ease ${delayMs}ms`,
  });

  if (loading || user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-7 h-7 animate-spin text-accent/40" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center overflow-x-hidden">

      {/* ── Single-viewport hero scene ── */}
      <section className="flex-1 w-full max-w-5xl mx-auto flex flex-col items-center justify-center px-6 pt-16 pb-10 gap-10 relative">

        {/* Ambient blobs — very-low-opacity, heavily-blurred color clouds that fill
            the horizontal space on wider screens without becoming actual shapes.
            They use the same hues as the window banner gradients for cohesion (R-01). */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Warm blob — right side, echoes the peach/orange gradient end */}
          <div
            className="absolute -right-24 top-1/3 w-[500px] h-[500px] rounded-full"
            style={{
              background: 'radial-gradient(circle, #FFBFA0 0%, transparent 70%)',
              opacity: 0.12,
              filter: 'blur(90px)',
              transform: 'translateY(-20%)',
            }}
          />
          {/* Cool blob — left side, echoes the blue/lavender gradient start */}
          <div
            className="absolute -left-24 top-1/3 w-[500px] h-[500px] rounded-full"
            style={{
              background: 'radial-gradient(circle, #A8C8FF 0%, transparent 70%)',
              opacity: 0.12,
              filter: 'blur(90px)',
              transform: 'translateY(-10%)',
            }}
          />
        </div>

        {/* 1. Traffic-light dots — small, centered, decorative top-of-scene marker */}
        <div className="flex items-center gap-[6px]" style={fadeIn(0)} aria-hidden="true">
          <span className="w-[10px] h-[10px] rounded-full bg-traffic-red" />
          <span className="w-[10px] h-[10px] rounded-full bg-traffic-yellow" />
          <span className="w-[10px] h-[10px] rounded-full bg-traffic-green" />
        </div>

        {/* 2. Headline + subhead + CTA */}
        <div className="relative z-10 text-center flex flex-col items-center gap-4 max-w-sm">
          <h1
            className="text-4xl sm:text-5xl font-bold tracking-tighter text-primary leading-[1.05]"
            style={fadeIn(80)}
          >
            Your whole world,<br className="hidden sm:block" /> one window.
          </h1>
          <p className="text-base sm:text-lg text-secondary leading-relaxed" style={fadeIn(200)}>
            Nazaverse is the link-in-bio that feels like home.
          </p>

          {/* CTA: blue-tinted glow (R-13: 1 element) + hover scale + shadow intensification */}
          <Link
            href="/login"
            className="group mt-1 inline-flex items-center px-7 py-3 rounded-xl bg-accent text-white text-sm font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            style={{
              ...fadeIn(320),
              // Transition covers the entered-state glow, hover shadow, scale, and bg-color
              transition: entered
                ? 'background-color 200ms ease, box-shadow 200ms ease, transform 200ms ease, opacity 400ms ease 320ms'
                : 'opacity 400ms ease 320ms, transform 400ms ease 320ms',
              boxShadow: entered ? '0 4px 22px rgba(10, 132, 255, 0.38)' : '0 4px 22px rgba(10, 132, 255, 0)',
            }}
            // Hover handled via CSS group class — scale-105 on hover via inline onMouse
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 28px rgba(10, 132, 255, 0.52)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 22px rgba(10, 132, 255, 0.38)';
            }}
          >
            Create your Nazaverse
          </Link>
        </div>

        {/* 3. Two window cards — spread apart on desktop, overlapping center
            Layout: on desktop (sm+) each card is positioned absolutely within a
            wide container and offset left/right so they spread. On mobile they
            sit in a narrower relative container with both centered (overlap reads fine).

            Shadow: front card heavier to sell depth (R-12: elevation hierarchy).
            Float: once `floating` is true the inline transform is removed and the CSS
            keyframe animation takes over — avoids a JS-driven rAF loop (R-19).       */}
        <div
          className="relative z-10 w-full"
          aria-hidden="true"
          // Fixed height so the absolute children have room to breathe
          style={{ height: '280px' }}
        >
          {/* Back window — left-center on desktop, slightly behind */}
          <div
            className={`absolute bg-surface rounded-xl overflow-hidden ${floating ? 'animate-float-a' : ''}`}
            style={{
              // Sizes: mobile 240px wide / desktop 280px wide
              width: 'clamp(220px, 42vw, 300px)',
              height: 'clamp(210px, 38vw, 270px)',
              // Desktop: left-center. Mobile: centered with a small left offset.
              left: 'clamp(0px, 8%, 14%)',
              top: '8px',
              // Entrance: only apply the fadeIn transform while not yet floating
              ...(floating ? {} : {
                ...fadeIn(420, true),
                transform: entered
                  ? 'rotate(-4deg) translateY(0) scale(1)'
                  : 'rotate(-4deg) translateY(8px) scale(0.96)',
              }),
              boxShadow: '0 10px 36px -8px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.05)',
            }}
          >
            <WindowCard gradientFrom="#A8C8FF" gradientTo="#FFBFA0" />
          </div>

          {/* Front window — right-center on desktop, in front */}
          <div
            className={`absolute bg-surface rounded-xl overflow-hidden ${floating ? 'animate-float-b' : ''}`}
            style={{
              width: 'clamp(220px, 42vw, 300px)',
              height: 'clamp(210px, 38vw, 270px)',
              right: 'clamp(0px, 8%, 14%)',
              top: '20px',
              ...(floating ? {} : {
                ...fadeIn(540, true),
                transform: entered
                  ? 'rotate(3deg) translateY(0) scale(1)'
                  : 'rotate(3deg) translateY(8px) scale(0.96)',
              }),
              boxShadow: '0 20px 50px -10px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.07)',
            }}
          >
            <WindowCard gradientFrom="#C4A8FF" gradientTo="#FFE89A" />
          </div>
        </div>

        {/* 4. Dock — frosted glass pill, single glassmorphism element (R-10) */}
        <div
          className="relative z-10 flex items-center gap-4 sm:gap-5 px-5 sm:px-6 py-2 rounded-full border border-white/60"
          style={{
            ...fadeIn(700),
            background: 'rgba(255,255,255,0.55)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
          }}
          role="list"
          aria-label="Social platform icons"
        >
          {/* Platform icons — literal relevance, 44px tap target (R-04, R-03, R-32) */}
          {([
            [Github, 'GitHub'],
            [Twitter, 'Twitter / X'],
            [Instagram, 'Instagram'],
            [Mail, 'Email'],
            [Globe, 'Website'],
          ] as const).map(([Icon, label], i) => (
            <div
              key={i}
              role="listitem"
              className="w-11 h-11 flex items-center justify-center text-secondary rounded-full hover:text-primary hover:bg-black/[0.05] transition-colors"
              aria-label={label}
              /* Dock icons are decorative on the logged-out page.
                 TODO: wire to user social links on /[username] */
            >
              <Icon className="w-5 h-5" />
            </div>
          ))}
        </div>

      </section>

      {/* 5. Footer — two-level hierarchy, proper spacing below the fold */}
      {/*
        Wordmark: text-sm font-semibold — present without competing with the h1.
        Copyright: text-xs text-secondary — secondary (#6E6E73) on background (#F5F5F7)
        passes WCAG AA at ~4.8:1 for all sizes (R-25).
      */}
      <footer className="w-full flex flex-col items-center gap-1 py-8 border-t border-black/[0.04]">
        <span className="text-sm font-semibold text-primary tracking-tight">
          Nazaverse
        </span>
        <p className="text-xs text-secondary">
          &copy; {new Date().getFullYear()} Nazaverse. All rights reserved.
        </p>
      </footer>

    </main>
  );
}

// ─── WindowCard ───────────────────────────────────────────────────────────────
// Pure decorative mockup — no ProfileCard, no real data, no stock photos.
// Structure: macOS titlebar (traffic-light dots) + gradient banner + avatar
// circle placeholder + name/subtitle bars + link-row placeholders.
// ──────────────────────────────────────────────────────────────────────────────
function WindowCard({
  gradientFrom,
  gradientTo,
}: {
  gradientFrom: string;
  gradientTo: string;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* macOS titlebar — 28px tall, authentic traffic-light proportions */}
      <div className="flex items-center gap-[5px] px-3 h-7 bg-[#F6F6F6] border-b border-black/[0.06] flex-shrink-0">
        <span className="w-[9px] h-[9px] rounded-full bg-traffic-red" />
        <span className="w-[9px] h-[9px] rounded-full bg-traffic-yellow" />
        <span className="w-[9px] h-[9px] rounded-full bg-traffic-green" />
      </div>

      {/* Gradient banner — soft, contained, purpose: distinguish windows (R-01) */}
      <div
        className="h-16 flex-shrink-0"
        style={{
          background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
        }}
      />

      {/* Profile content area */}
      <div className="px-4 pt-2 pb-4 flex flex-col gap-3 flex-1">
        {/* Avatar — plain gray circle, no image or picsum (R-23) */}
        <div className="w-11 h-11 rounded-full bg-[#D8D8D8] -mt-6 ring-2 ring-surface flex-shrink-0" />

        {/* Name + subtitle placeholder bars */}
        <div className="flex flex-col gap-1.5">
          <div className="h-2 w-20 bg-[#E5E5E5] rounded-full" />
          <div className="h-1.5 w-14 bg-[#EBEBEB] rounded-full" />
        </div>

        {/* Link-row placeholders — suggests the product's core feature */}
        <div className="flex flex-col gap-2 mt-1">
          <div className="h-6 w-full bg-[#F0F0F0] rounded-lg" />
          <div className="h-6 w-full bg-[#F0F0F0] rounded-lg" />
          <div className="h-6 w-4/5 bg-[#F0F0F0] rounded-lg" />
        </div>
      </div>
    </div>
  );
}

