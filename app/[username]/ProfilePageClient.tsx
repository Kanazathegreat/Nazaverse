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

  useEffect(() => {
    (async () => {
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single();

        if (!profileData) {
          // Should not happen because we checked in server, but just in case
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
    links: links.map((l) => ({
      title: l.title,
      url: l.url,
      icon: l.icon || undefined,
    })),
  };

  return (
    <main className="min-h-screen py-10 px-4 flex items-center justify-center bg-background">
      <ProfileCard data={cardData} />
    </main>
  );
}