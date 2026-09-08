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

  // Check if profile exists to enable proper 404
  const { data: profileExists } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', params.username)
    .single();

  if (!profileExists) {
    notFound();
  }

  return <ProfilePageClient username={params.username} />;
}