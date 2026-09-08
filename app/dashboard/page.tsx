'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import DashboardClient from './DashboardClient';
import SkeletonDashboard from './SkeletonDashboard';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

export default async function DashboardPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [links, setLinks] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();

        if (!currentUser) {
          router.push('/login');
          return;
        }

        setUser(currentUser);

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();

        setProfile(profileData);

        const { data: linksData } = await supabase
          .from('links')
          .select('*')
          .eq('profile_id', currentUser.id)
          .order('position', { ascending: true });

        setLinks(linksData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [supabase, router]);

  if (loading || !user) {
    return (
      <main className="min-h-screen py-10 px-4 flex items-center justify-center bg-background">
        <SkeletonDashboard />
      </main>
    );
  }

  return (
    <main className="min-h-screen py-10 px-4 flex items-center justify-center bg-background">
      <DashboardClient
        initialProfile={profile}
        initialLinks={links}
        user={user}
      />
    </main>
  );
}