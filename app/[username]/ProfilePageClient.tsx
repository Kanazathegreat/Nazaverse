'use client';

import { useEffect, useState } from 'react';
import ProfileCard from '@/components/ProfileCard';

interface Props {
  profile: any;
  initialLinks: any[];
}

export default function ProfilePageClient({ profile, initialLinks }: Props) {
  // Drives the card+banner entrance fade
  const [cardVisible, setCardVisible] = useState(false);

  useEffect(() => {
    // One rAF so the browser paints opacity:0 before the class flips in
    const id = requestAnimationFrame(() => setCardVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const cardData = {
    name: profile.display_name || profile.username,
    username: profile.username,
    bio: profile.bio,
    bannerUrl: profile.banner_url,
    avatarUrl: profile.avatar_url,
    // Attach a per-link animation delay for the staggered entrance.
    links: initialLinks.map((l, i) => ({
      title: l.title,
      url: l.url,
      icon: l.icon || undefined,
      // 50ms per item, starting after the card itself has entered (~200ms)
      entranceDelay: 200 + i * 60,
    })),
  };

  return (
    <main className="min-h-screen py-10 px-4 flex items-center justify-center bg-background">
      {/* Card fades in as a whole once data is ready */}
      <div
        className="w-full flex justify-center"
        style={{
          opacity: cardVisible ? 1 : 0,
          transform: cardVisible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 400ms ease, transform 400ms ease',
        }}
      >
        <ProfileCard data={cardData} />
      </div>
    </main>
  );
}