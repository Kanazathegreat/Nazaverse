import React from 'react';
import LinkItem, { LinkItemProps } from './LinkItem';

interface ProfileData {
  name: string;
  username: string;
  bio?: string | null;
  bannerUrl?: string | null;
  avatarUrl?: string | null;
  links: (LinkItemProps & { entranceDelay?: number })[];
}

interface ProfileCardProps {
  data: ProfileData;
}

export default function ProfileCard({ data }: ProfileCardProps) {
  return (
    <div className="w-full max-w-[420px] bg-surface rounded-3xl border border-black/[0.08] shadow-macos overflow-hidden">
      {/* macOS Titlebar */}
      <div className="h-9 px-4 flex items-center bg-black/[0.02] border-b border-black/[0.03]">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-traffic-red" />
          <div className="w-3 h-3 rounded-full bg-traffic-yellow" />
          <div className="w-3 h-3 rounded-full bg-traffic-green" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="w-16 h-1.5 rounded-full bg-black/[0.06]" />
        </div>
        <div className="w-14" />
      </div>

      {/* Banner */}
      <div className="relative h-36 w-full bg-neutral-100">
        {data.bannerUrl && (
          <img
            src={data.bannerUrl}
            alt="Profile Banner"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative px-5 pb-8">
        {/* Avatar */}
        <div className="relative -mt-12 mb-4 w-24 h-24 rounded-full ring-4 ring-surface bg-surface shadow-md overflow-hidden flex items-center justify-center text-accent text-2xl font-bold uppercase">
          {data.avatarUrl ? (
            <img src={data.avatarUrl} alt={data.name} className="w-full h-full object-cover" />
          ) : (
            data.name[0]
          )}
        </div>

        {/* Info */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-primary tracking-tightest">
            {data.name}
          </h1>
          <p className="text-sm text-secondary font-normal mt-0.5">
            @{data.username}
          </p>
          {data.bio && (
            <p className="mt-3 text-sm text-secondary leading-relaxed max-w-[340px]">
              {data.bio}
            </p>
          )}
        </div>

        {/* Links Stack — each item wrapped for staggered entrance if delay provided */}
        <div className="flex flex-col gap-2.5">
          {data.links.length > 0 ? (
            data.links.map((link, idx) => (
              <div
                key={idx}
                // animate-fade-slide-up uses the keyframe from globals.css.
                // When entranceDelay is provided the item starts hidden (opacity:0
                // via animation fill-mode 'both') and slides in after the delay.
                className={link.entranceDelay !== undefined ? 'animate-fade-slide-up' : ''}
                style={
                  link.entranceDelay !== undefined
                    ? { animationDelay: `${link.entranceDelay}ms` }
                    : undefined
                }
              >
                <LinkItem title={link.title} url={link.url} icon={link.icon} />
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-sm text-secondary border-2 border-dashed border-black/[0.05] rounded-2xl">
              No links available yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
