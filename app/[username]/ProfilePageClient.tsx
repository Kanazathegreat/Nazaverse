'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import ProfileCard from '@/components/ProfileCard';
import SkeletonProfileCard from '@/components/SkeletonProfileCard';

interface Props {
  username: string;
}

export default function ProfilePageClient({ username }: Props) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [links, setLinks] = useState<any[]>([]);
  // Drives the card+banner entrance fade (separate from the link stagger below)
  const [cardVisible, setCardVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single();

        if (!profileData) {
          setLoading(false);
          return;
        }

        setProfile(profileData);

        const { data: linksData } = await supabase
          .from('links')
          .select('*')
          .eq('profile_id', profileData.id)
          .order('position', { ascending: true });

        setLinks(linksData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        // One rAF so the browser paints opacity:0 before the class flips in
        requestAnimationFrame(() => setCardVisible(true));
      }
    })();
  }, [username, supabase]);

  if (loading) {
    return (
      <main className="min-h-screen py-10 px-4 flex items-center justify-center bg-background">
        <SkeletonProfileCard />
      </main>
    );
  }

  const cardData = {
    name: profile.display_name || profile.username,
    username: profile.username,
    bio: profile.bio,
    bannerUrl: profile.banner_url,
    avatarUrl: profile.avatar_url,
    // Attach a per-link animation delay for the staggered entrance.
    // ProfileCard maps links → LinkItem; we pass the delay as a custom prop
    // that ProfileCard forwards via inline style on each wrapper div.
    // The animate-fade-slide-up class + animation-delay drives the stagger.
    links: links.map((l, i) => ({
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