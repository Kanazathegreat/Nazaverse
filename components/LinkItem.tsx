import React from 'react';
import { LucideIcon, ArrowUpRight, Globe, Github, Twitter, Instagram, Youtube, Linkedin, Mail, Heart, FileText, Code, Music, Video } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Globe,
  Github,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Mail,
  Heart,
  FileText,
  Code,
  Music,
  Video,
};

export interface LinkItemProps {
  title: string;
  url: string;
  icon?: LucideIcon | string; 
  description?: string;
}

export default function LinkItem({ title, url, icon, description }: LinkItemProps) {
  let IconComponent: LucideIcon | null = null;
  if (typeof icon === 'string') {
    IconComponent = ICON_MAP[icon] || Globe;
  } else if (icon) {
    IconComponent = icon;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between p-3 rounded-xl border border-black/[0.06] bg-surface hover:border-black/10 hover:shadow-soft hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 ease-out cursor-pointer"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {IconComponent && (
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-black/[0.03] border border-black/[0.04] flex items-center justify-center text-primary group-hover:bg-black/[0.06] group-hover:text-accent transition-colors duration-200">
            <IconComponent className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" />
          </div>
        )}
        <div className="flex flex-col min-w-0 text-left">
          <span className="text-sm font-medium text-primary truncate leading-snug">
            {title}
          </span>
          {description && (
            <span className="text-xs text-secondary truncate mt-0.5 leading-normal">
              {description}
            </span>
          )}
        </div>
      </div>

      <div className="flex-shrink-0 ml-3 text-secondary/60 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200">
        <ArrowUpRight className="w-4 h-4" />
      </div>
    </a>
  );
}
