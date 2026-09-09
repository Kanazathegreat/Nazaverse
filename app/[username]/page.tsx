import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ProfilePageClient from './ProfilePageClient';
import type { Metadata } from 'next';

interface PageProps {
  params: { username: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, username, bio')
    .eq('username', params.username)
    .maybeSingle();

  if (!profile) {
    return {
      title: 'Profile Not Found - Nazaverse',
    };
  }

  const name = profile.display_name || profile.username;
  return {
    title: `${name} (@${profile.username}) • Nazaverse`,
    description: profile.bio || `Check out ${name}'s links on Nazaverse.`,
  };
}

export default async function PublicProfilePage({ params }: PageProps) {
  const supabase = createClient();

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', params.username)
    .maybeSingle();

  if (!profile) {
    notFound();
  }

  // Fetch links using the fetched profile's ID
  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('profile_id', profile.id)
    .order('position', { ascending: true });

  return <ProfilePageClient profile={profile} initialLinks={links || []} />;
}