'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Loader2, ExternalLink, LogOut, CheckCircle, AlertCircle, Camera, 
  Plus, Trash2, Edit2, GripVertical, X, Check, Copy, Calendar, ShieldAlert,
  Globe, Github, Twitter, Instagram, Youtube, Linkedin, Mail, Heart, FileText, Code, Music, Video,
  ZoomIn
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/lib/cropImage';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Profile {
  id: string;
  username?: string | null;
  display_name?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  banner_url?: string | null;
  created_at?: string | null;
}

interface LinkItem {
  id: string;
  profile_id: string;
  title: string;
  url: string;
  icon?: string | null;
  position: number;
}

interface DashboardClientProps {
  initialProfile: Profile | null;
  initialLinks: LinkItem[];
  user: User;
}

const CURATED_ICONS = [
  { name: 'Globe', label: 'Globe', icon: Globe },
  { name: 'Github', label: 'GitHub', icon: Github },
  { name: 'Twitter', label: 'Twitter', icon: Twitter },
  { name: 'Instagram', label: 'Instagram', icon: Instagram },
  { name: 'Youtube', label: 'YouTube', icon: Youtube },
  { name: 'Linkedin', label: 'LinkedIn', icon: Linkedin },
  { name: 'Mail', label: 'Mail', icon: Mail },
  { name: 'Heart', label: 'Heart', icon: Heart },
  { name: 'FileText', label: 'Docs', icon: FileText },
  { name: 'Code', label: 'Code', icon: Code },
  { name: 'Music', label: 'Music', icon: Music },
  { name: 'Video', label: 'Video', icon: Video },
];

function getIconComponent(iconName?: string | null) {
  const found = CURATED_ICONS.find(i => i.name === iconName);
  return found ? found.icon : Globe;
}

interface SortableLinkRowProps {
  link: LinkItem;
  onEdit: (link: LinkItem) => void;
  onDeleteRequest: (id: string) => void;
  isDeleting: boolean;
  onConfirmDelete: (id: string) => void;
  onCancelDelete: () => void;
}

function SortableLinkRow({
  link,
  onEdit,
  onDeleteRequest,
  isDeleting,
  onConfirmDelete,
  onCancelDelete,
}: SortableLinkRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.6 : 1,
  };

  const IconComp = getIconComponent(link.icon);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center justify-between p-3 rounded-xl border bg-surface transition-all ${
        isDragging ? 'border-accent shadow-lg bg-white' : 'border-black/[0.08] hover:border-black/[0.15]'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-neutral-400 hover:text-primary transition-colors p-1"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <div className="w-9 h-9 rounded-xl bg-black/[0.03] border border-black/[0.04] flex items-center justify-center text-primary shrink-0">
          <IconComp className="w-4 h-4" />
        </div>

        <div className="flex flex-col min-w-0 text-left">
          <span className="text-sm font-medium text-primary truncate">
            {link.title}
          </span>
          <span className="text-xs text-secondary truncate">
            {link.url}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0 ml-2">
        {isDeleting ? (
          <div className="flex items-center gap-1 bg-traffic-red/10 px-2 py-1 rounded-lg border border-traffic-red/20">
            <span className="text-[11px] font-medium text-traffic-red">Sure?</span>
            <button
              onClick={() => onConfirmDelete(link.id)}
              className="p-1 text-traffic-red hover:bg-traffic-red/20 rounded"
              title="Confirm Delete"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onCancelDelete}
              className="p-1 text-secondary hover:bg-black/10 rounded"
              title="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => onEdit(link)}
              className="p-2 text-secondary hover:text-primary hover:bg-black/[0.04] rounded-lg transition-colors"
              title="Edit Link"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDeleteRequest(link.id)}
              className="p-2 text-secondary hover:text-traffic-red hover:bg-traffic-red/10 rounded-lg transition-colors"
              title="Delete Link"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function DashboardClient({ initialProfile, initialLinks, user }: DashboardClientProps) {
  const router = useRouter();
  const supabase = createClient();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState(initialProfile?.username || '');
  const [displayName, setDisplayName] = useState(initialProfile?.display_name || '');
  const [bio, setBio] = useState(initialProfile?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(initialProfile?.avatar_url || '');
  const [bannerUrl, setBannerUrl] = useState(initialProfile?.banner_url || '');

  const [links, setLinks] = useState<LinkItem[]>(initialLinks);
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Cropper States
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropTarget, setCropTarget] = useState<'avatars' | 'banners' | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [processingCrop, setProcessingCrop] = useState(false);

  // Link Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkIcon, setLinkIcon] = useState('Globe');
  const [linkSubmitting, setLinkSubmitting] = useState(false);

  // Delete confirmation state
  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null);

  // Copy link state
  const [copied, setCopied] = useState(false);

  // Settings & Account Deletion state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmUsername, setDeleteConfirmUsername] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Username availability check
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [usernameMessage, setUsernameMessage] = useState<string>('');
  const [usernameCheckTimeout, setUsernameCheckTimeout] = useState<NodeJS.Timeout | null>(null);
  const [debouncedUsername, setDebouncedUsername] = useState(username);
  const originalUsername = initialProfile?.username ?? '';

  // Debounce username input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedUsername(username);
    }, 500);
    return () => clearTimeout(handler);
  }, [username]);

  // Perform availability check when debouncedUsername changes
  useEffect(() => {
    // Skip if same as original (case-insensitive)
    if (debouncedUsername.toLowerCase() === originalUsername.toLowerCase()) {
      setUsernameStatus('idle');
      setUsernameMessage('');
      return;
    }

    // Skip if empty
    if (!debouncedUsername.trim()) {
      setUsernameStatus('idle');
      setUsernameMessage('');
      return;
    }

    setUsernameStatus('checking');
    setUsernameMessage('Checking...');

    const checkAvailability = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', debouncedUsername)
          .neq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
          throw error;
        }

        if (data) {
          // Username taken
          setUsernameStatus('taken');
          setUsernameMessage('Already taken');
        } else {
          // Username available
          setUsernameStatus('available');
          setUsernameMessage('Available');
        }
      } catch (err) {
        console.error('Username check error:', err);
        setUsernameStatus('idle');
        setUsernameMessage('');
      }
    };

    checkAvailability();
  }, [debouncedUsername, user.id, supabase]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/\s+/g, '');
    setUsername(val);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, bucket: 'avatars' | 'banners') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('File too big. Max 5MB.');
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);

    // If GIF, skip crop and upload directly
    const isGif = file.type === 'image/gif' || file.type === 'image/x-gif' || file.name.toLowerCase().endsWith('.gif');
    if (isGif) {
      executeUpload(file, bucket, file);
      return;
    }

    // For static images, open cropper
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setCropTarget(bucket);
      setCropModalOpen(true);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    if (!imageSrc || !cropTarget || !croppedAreaPixels) return;

    setProcessingCrop(true);
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const file = new File([croppedBlob], `${cropTarget === 'avatars' ? 'avatar' : 'banner'}.jpg`, { type: 'image/jpeg' });
      await executeUpload(file, cropTarget, file);
      setCropModalOpen(false);
      setImageSrc(null);
    } catch (error: any) {
      setErrorMsg(error.message || 'Crop failed.');
    } finally {
      setProcessingCrop(false);
    }
  };

  const executeUpload = async (file: Blob, bucket: 'avatars' | 'banners', originalFile: File) => {
    const isAvatar = bucket === 'avatars';
    isAvatar ? setUploadingAvatar(true) : setUploadingBanner(true);

    try {
      const isGif = originalFile.type === 'image/gif' || originalFile.type === 'image/x-gif' || originalFile.name.toLowerCase().endsWith('.gif');
      const fileExt = isGif ? 'gif' : (originalFile.name.split('.').pop() || 'jpg');
      const filePath = `${user.id}/${isAvatar ? 'avatar' : 'banner'}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { 
          upsert: true,
          contentType: isGif ? 'image/gif' : (file.type || 'image/jpeg'),
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      // Append timestamp to bust cache
      const urlWithTimestamp = `${publicUrl}?t=${Date.now()}`;

      const updateKey = isAvatar ? 'avatar_url' : 'banner_url';
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({ id: user.id, [updateKey]: urlWithTimestamp }, { onConflict: 'id' });

      if (updateError) throw updateError;

      isAvatar ? setAvatarUrl(urlWithTimestamp) : setBannerUrl(urlWithTimestamp);
      setSuccessMsg(`${isAvatar ? 'Avatar' : 'Banner'} updated!`);
      router.refresh();
    } catch (error: any) {
      setErrorMsg(error.message || 'Upload failed.');
    } finally {
      isAvatar ? setUploadingAvatar(false) : setUploadingBanner(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    const usernameRegex = /^[a-z0-9_-]+$/;
    if (username && !usernameRegex.test(username)) {
      setErrorMsg('Username can only contain lowercase letters, numbers, underscores, and hyphens.');
      return;
    }

    // Prevent saving if username is taken
    if (usernameStatus === 'taken') {
      setErrorMsg('Username is already taken. Please choose another.');
      return;
    }

    setLoading(true);

    const updates = {
      id: user.id,
      username: username || null,
      display_name: displayName || null,
      bio: bio || null,
      avatar_url: avatarUrl || null,
      banner_url: bannerUrl || null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(updates, { onConflict: 'id' });

    setLoading(false);

    if (error) {
      if (error.code === '23505' || error.message.includes('unique constraint') || error.message.includes('duplicate')) {
        setErrorMsg('Username is already taken. Please choose another.');
      } else {
        setErrorMsg(error.message || 'Failed to update profile.');
      }
    } else {
      setSuccessMsg('Profile saved successfully!');
      router.refresh();
    }
  };

  const handleOpenAddForm = () => {
    setEditingLinkId(null);
    setLinkTitle('');
    setLinkUrl('');
    setLinkIcon('Globe');
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (link: LinkItem) => {
    setEditingLinkId(link.id);
    setLinkTitle(link.title);
    setLinkUrl(link.url);
    setLinkIcon(link.icon || 'Globe');
    setIsFormOpen(true);
  };

  const handleSaveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkTitle || !linkUrl) return;

    let formattedUrl = linkUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    setLinkSubmitting(true);
    setErrorMsg(null);

    if (editingLinkId) {
      const { error } = await supabase
        .from('links')
        .update({
          title: linkTitle,
          url: formattedUrl,
          icon: linkIcon,
        })
.eq('id', editingLinkId)
.eq('profile_id', user.id);

      setLinkSubmitting(false);

      if (error) {
        setErrorMsg(error.message);
      } else {
        setLinks(links.map(l => l.id === editingLinkId ? { ...l, title: linkTitle, url: formattedUrl, icon: linkIcon } : l));
        setIsFormOpen(false);
        setSuccessMsg('Link updated!');
      }
    } else {
      const newPosition = links.length > 0 ? Math.max(...links.map(l => l.position)) + 1 : 0;
      const { data, error } = await supabase
        .from('links')
        .insert({
          profile_id: user.id,
          title: linkTitle,
          url: formattedUrl,
          icon: linkIcon,
          position: newPosition,
        })
        .select()
        .single();

      setLinkSubmitting(false);

      if (error) {
        setErrorMsg(error.message);
      } else if (data) {
        setLinks([...links, data]);
        setIsFormOpen(false);
        setSuccessMsg('Link added!');
      }
    }
  };

  const handleDeleteLink = async (id: string) => {
    const { error } = await supabase
      .from('links')
      .delete()
      .eq('id', id)
      .eq('profile_id', user.id);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setLinks(links.filter(l => l.id !== id));
      setSuccessMsg('Link deleted.');
    }
    setDeletingLinkId(null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = links.findIndex(l => l.id === active.id);
    const newIndex = links.findIndex(l => l.id === over.id);

    const reordered = arrayMove(links, oldIndex, newIndex);
    const updatedWithPositions = reordered.map((l, index) => ({
      ...l,
      position: index,
    }));

    setLinks(updatedWithPositions);

    for (const item of updatedWithPositions) {
      await supabase
        .from('links')
        .update({ position: item.position })
        .eq('id', item.id)
        .eq('profile_id', user.id);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const copyToClipboard = () => {
    const url = `${window.location.origin}/${username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    try {
      // 1. Delete links
      await supabase.from('links').delete().eq('profile_id', user.id);
      
      // 2. Delete storage files
      const { data: avatarFiles } = await supabase.storage.from('avatars').list(`${user.id}`);
      if (avatarFiles?.length) await supabase.storage.from('avatars').remove(avatarFiles.map(f => `${user.id}/${f.name}`));
      
      const { data: bannerFiles } = await supabase.storage.from('banners').list(`${user.id}`);
      if (bannerFiles?.length) await supabase.storage.from('banners').remove(bannerFiles.map(f => `${user.id}/${f.name}`));

      // 3. Delete profile
      await supabase.from('profiles').delete().eq('id', user.id);

      // 4. Sign out
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to delete account completely.');
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-[560px] rounded-2xl bg-surface shadow-macos border border-black/[0.08] overflow-hidden my-6">
        {/* macOS Window Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-black/[0.05] bg-surface/80 backdrop-blur-md">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-traffic-red inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-traffic-yellow inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-traffic-green inline-block shadow-sm" />
          </div>
          <span className="text-xs font-medium text-secondary select-none tracking-tight">
            Dashboard — Nazaverse Studio
          </span>
          <button
            onClick={handleSignOut}
            className="text-xs font-medium text-secondary hover:text-traffic-red transition-colors flex items-center gap-1"
            title="Log out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="pb-8 max-h-[80vh] overflow-y-auto">
          {/* Banner Section */}
          <div 
            className="relative h-36 w-full bg-gradient-to-br from-accent/20 via-accent/10 to-surface border-b border-black/[0.05] group overflow-hidden cursor-pointer"
            onClick={() => bannerInputRef.current?.click()}
          >
            {bannerUrl ? (
              <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-20">
                <Camera className="w-8 h-8 text-accent" />
              </div>
            )}
            
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
              {uploadingBanner ? (
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <Camera className="w-6 h-6 text-white" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">Change Banner</span>
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={bannerInputRef} 
              className="hidden" 
              accept="image/*,image/gif"
              onChange={(e) => handleFileSelect(e, 'banners')}
            />
          </div>

          {/* Avatar Section & View Profile Link */}
          <div className="px-6 sm:px-8 -mt-12 relative z-10 flex items-end justify-between">
            <div 
              className="relative w-24 h-24 rounded-full border-4 border-surface bg-surface shadow-md overflow-hidden group cursor-pointer"
              onClick={() => avatarInputRef.current?.click()}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-accent text-2xl font-bold">
                  {displayName?.[0]?.toUpperCase() || username?.[0]?.toUpperCase() || user.email?.[0].toUpperCase()}
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {uploadingAvatar ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : (
                  <Camera className="w-5 h-5 text-white" />
                )}
              </div>
              <input 
                type="file" 
                ref={avatarInputRef} 
                className="hidden" 
                accept="image/*,image/gif"
                onChange={(e) => handleFileSelect(e, 'avatars')}
              />
            </div>

            <div className="pb-1 flex items-center gap-2">
              {username ? (
                <>
                  <Link
                    href={`/${username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-xs font-medium text-accent bg-accent/10 border border-accent/20 rounded-xl hover:bg-accent/20 transition-all flex items-center gap-1.5"
                  >
                    <span>View profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="px-3 py-1.5 text-xs font-medium text-secondary hover:text-primary bg-neutral-100 hover:bg-neutral-200/80 border border-black/[0.08] rounded-xl transition-all flex items-center gap-1.5"
                    title="Copy public profile link"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-traffic-green" />
                        <span className="text-traffic-green font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy link</span>
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <span
                    className="px-3 py-1.5 text-xs font-medium text-neutral-400 bg-neutral-100 rounded-xl cursor-not-allowed flex items-center gap-1.5"
                    title="Set a username to view your profile"
                  >
                    <span>View profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                  <span
                    className="px-3 py-1.5 text-xs font-medium text-neutral-400 bg-neutral-100 rounded-xl cursor-not-allowed flex items-center gap-1.5"
                    title="Set a username to copy link"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy link</span>
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="px-6 sm:px-8 pt-6 space-y-6">
            {/* Notifications */}
            {successMsg && (
              <div className="p-3 text-xs rounded-xl bg-traffic-green/10 border border-traffic-green/20 text-traffic-green flex items-center gap-2 font-medium">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 text-xs rounded-xl bg-traffic-red/10 border border-traffic-red/20 text-traffic-red flex items-center gap-2 font-medium leading-relaxed">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Links Section */}
            <div className="space-y-4 pt-2 border-t border-black/[0.06]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-primary tracking-tight">
                    Your Links
                  </h2>
                  <p className="text-xs text-secondary mt-0.5">
                    Drag and drop to reorder your links
                  </p>
                </div>

                <button
                  onClick={handleOpenAddForm}
                  className="px-3 py-2 text-xs font-medium text-white bg-accent rounded-xl hover:opacity-95 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Link</span>
                </button>
              </div>

              {/* Add/Edit Link Modal/Inline Card */}
              {isFormOpen && (
                <div className="p-4 rounded-xl border border-accent/30 bg-neutral-50/80 space-y-4 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-accent">
                      {editingLinkId ? 'Edit Link' : 'New Link'}
                    </h3>
                    <button
                      onClick={() => setIsFormOpen(false)}
                      className="text-secondary hover:text-primary p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveLink} className="space-y-3">
                    <div className="space-y-1 text-left">
                      <label className="text-[11px] font-medium text-secondary">Title</label>
                      <input
                        type="text"
                        required
                        value={linkTitle}
                        onChange={(e) => setLinkTitle(e.target.value)}
                        placeholder="My Portfolio"
                        className="w-full px-3 py-2 text-sm bg-white border border-black/[0.08] rounded-xl text-primary placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-[11px] font-medium text-secondary">URL</label>
                      <input
                        type="text"
                        required
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-3 py-2 text-sm bg-white border border-black/[0.08] rounded-xl text-primary placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-[11px] font-medium text-secondary">Icon</label>
                      <div className="grid grid-cols-6 gap-1.5 pt-1">
                        {CURATED_ICONS.map((item) => {
                          const IconComponent = item.icon;
                          const isSelected = linkIcon === item.name;
                          return (
                            <button
                              key={item.name}
                              type="button"
                              onClick={() => setLinkIcon(item.name)}
                              className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'bg-accent/10 border-accent text-accent shadow-sm'
                                  : 'bg-white border-black/[0.06] text-secondary hover:text-primary hover:border-black/20'
                              }`}
                              title={item.label}
                            >
                              <IconComponent className="w-4 h-4" />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="submit"
                        disabled={linkSubmitting}
                        className="flex-1 py-2 px-3 bg-accent text-white font-medium text-xs rounded-xl hover:opacity-95 transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                      >
                        {linkSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        <span>{editingLinkId ? 'Save Link' : 'Add Link'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsFormOpen(false)}
                        className="py-2 px-3 bg-white text-secondary hover:text-primary border border-black/[0.08] font-medium text-xs rounded-xl transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Links List with DnD */}
              {links.length === 0 ? (
                <div className="text-center py-10 px-4 rounded-2xl border border-dashed border-black/[0.1] bg-neutral-50/50 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent mx-auto flex items-center justify-center">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-primary">No links yet</p>
                    <p className="text-xs text-secondary max-w-[240px] mx-auto">
                      Add your social profiles, websites, or content links to display on your public page.
                    </p>
                  </div>
                  <button
                    onClick={handleOpenAddForm}
                    className="px-4 py-2 text-xs font-medium text-accent bg-accent/10 border border-accent/20 rounded-xl hover:bg-accent/20 transition-all inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add your first link</span>
                  </button>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={links.map(l => l.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2.5">
                      {links.map((link) => (
                        <SortableLinkRow
                          key={link.id}
                          link={link}
                          onEdit={handleOpenEditForm}
                          onDeleteRequest={(id) => setDeletingLinkId(id)}
                          isDeleting={deletingLinkId === link.id}
                          onConfirmDelete={handleDeleteLink}
                          onCancelDelete={() => setDeletingLinkId(null)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>

            {/* Profile Details Form */}
            <div className="space-y-4 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-primary tracking-tight">
                    Profile Details
                  </h2>
                  <p className="text-xs text-secondary mt-0.5">
                    Manage your username, display name, and bio
                  </p>
                </div>
                {(initialProfile?.created_at || user.created_at) && (
                  <div className="flex items-center gap-1.5 text-xs text-secondary bg-neutral-100/80 px-2.5 py-1 rounded-lg">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>
                      Member since{' '}
                      {new Date(initialProfile?.created_at || user.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                )}
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                {/* Username */}
                <div className="space-y-1.5 text-left">
                  <label htmlFor="username" className="text-xs font-medium text-secondary">
                    Username
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-sm text-neutral-400 font-mono select-none">
                      /
                    </span>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={handleUsernameChange}
                      placeholder="yourname"
disabled={loading || usernameStatus === 'taken'}
                      className="w-full pl-7 pr-3.5 py-2.5 text-sm bg-neutral-50/50 border border-black/[0.08] rounded-xl text-primary placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all font-mono"
                    />
                    {/* Username availability indicator */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-sm">
                      {usernameStatus === 'checking' && (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span className="ml-1">Checking...</span>
                        </>
                      )}
                      {usernameStatus === 'available' && (
                        <>
                          <CheckCircle className="w-3 h-3 text-traffic-green" />
                          <span className="ml-1">Available</span>
                        </>
                      )}
                      {usernameStatus === 'taken' && (
                        <>
                          <AlertCircle className="w-3 h-3 text-traffic-red" />
                          <span className="ml-1">Already taken</span>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Lowercase letters, numbers, underscores, and hyphens only.
                  </p>
                </div>

                {/* Display Name */}
                <div className="space-y-1.5 text-left">
                  <label htmlFor="displayName" className="text-xs font-medium text-secondary">
                    Display Name
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Alex Smith"
                    disabled={loading}
                    className="w-full px-3.5 py-2.5 text-sm bg-neutral-50/50 border border-black/[0.08] rounded-xl text-primary placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-1.5 text-left">
                  <div className="flex justify-between items-center">
                    <label htmlFor="bio" className="text-xs font-medium text-secondary">
                      Bio
                    </label>
                    <span className={`text-[11px] font-mono ${bio.length > 160 ? 'text-traffic-red font-semibold' : 'text-neutral-400'}`}>
                      {bio.length}/160
                    </span>
                  </div>
                  <textarea
                    id="bio"
                    rows={3}
                    maxLength={160}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell the world a little bit about yourself..."
                    disabled={loading}
                    className="w-full px-3.5 py-2.5 text-sm bg-neutral-50/50 border border-black/[0.08] rounded-xl text-primary placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-accent text-white font-medium text-sm rounded-xl hover:opacity-95 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving Profile...</span>
                      </>
                    ) : (
                      <span>Save Profile Changes</span>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Settings & Danger Zone */}
            <div className="space-y-4 pt-6 border-t border-black/[0.06]">
              <div>
                <h2 className="text-base font-semibold text-primary tracking-tight">
                  Settings
                </h2>
                <p className="text-xs text-secondary mt-0.5">
                  Account management and preferences
                </p>
              </div>

              <div className="p-4 rounded-xl border border-traffic-red/20 bg-traffic-red/[0.02] space-y-3">
                <div className="flex items-center gap-2 text-traffic-red font-medium text-xs">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span className="uppercase tracking-wider font-semibold">Danger Zone</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-primary">Delete Account</p>
                    <p className="text-[11px] text-secondary">
                      Permanently remove your profile, links, and uploaded files.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteConfirmUsername('');
                      setDeleteModalOpen(true);
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-traffic-red bg-traffic-red/10 border border-traffic-red/20 hover:bg-traffic-red/20 rounded-xl transition-all shrink-0"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* macOS Cropper Modal */}
      {cropModalOpen && imageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-[480px] rounded-2xl bg-surface shadow-macos border border-black/[0.08] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* macOS Window Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-black/[0.05] bg-surface/80 backdrop-blur-md">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-traffic-red inline-block shadow-sm" />
                <span className="w-3 h-3 rounded-full bg-traffic-yellow inline-block shadow-sm" />
                <span className="w-3 h-3 rounded-full bg-traffic-green inline-block shadow-sm" />
              </div>
              <span className="text-xs font-medium text-secondary select-none tracking-tight">
                Crop {cropTarget === 'avatars' ? 'Avatar' : 'Banner'}
              </span>
              <button
                onClick={() => setCropModalOpen(false)}
                className="text-secondary hover:text-primary p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cropper Container */}
            <div className="relative w-full h-[300px] bg-neutral-900">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={cropTarget === 'avatars' ? 1 : 16 / 9}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                cropShape={cropTarget === 'avatars' ? 'round' : 'rect'}
              />
            </div>

            {/* Controls */}
            <div className="p-6 space-y-4 bg-surface">
              <div className="flex items-center gap-3">
                <ZoomIn className="w-4 h-4 text-secondary shrink-0" />
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-accent cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  disabled={processingCrop}
                  onClick={handleCropSave}
                  className="flex-1 py-2.5 px-4 bg-accent text-white font-medium text-sm rounded-xl hover:opacity-95 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {processingCrop ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Cropping...</span>
                    </>
                  ) : (
                    <span>Apply & Save</span>
                  )}
                </button>
                <button
                  type="button"
                  disabled={processingCrop}
                  onClick={() => setCropModalOpen(false)}
                  className="py-2.5 px-4 bg-neutral-100 text-secondary hover:text-primary font-medium text-sm rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Delete Account Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-[440px] rounded-2xl bg-surface shadow-macos border border-traffic-red/30 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* macOS Window Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-black/[0.05] bg-surface/80 backdrop-blur-md">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-traffic-red inline-block shadow-sm" />
                <span className="w-3 h-3 rounded-full bg-traffic-yellow inline-block shadow-sm" />
                <span className="w-3 h-3 rounded-full bg-traffic-green inline-block shadow-sm" />
              </div>
              <span className="text-xs font-medium text-traffic-red select-none tracking-tight flex items-center gap-1 font-semibold">
                <ShieldAlert className="w-3.5 h-3.5" />
                Confirm Account Deletion
              </span>
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="text-secondary hover:text-primary p-1"
                disabled={deletingAccount}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-3.5 rounded-xl bg-traffic-red/10 border border-traffic-red/20 text-xs text-traffic-red space-y-1">
                <p className="font-semibold">This action cannot be undone.</p>
                <p className="text-[11px] leading-relaxed text-traffic-red/90">
                  This will permanently delete your profile (@{username || 'yourname'}), all your links, and your uploaded avatar and banner files.
                </p>
              </div>

              <div className="space-y-2 text-left">
                <label className="text-xs font-medium text-secondary">
                  To confirm, type <span className="font-mono font-bold text-primary">{username || 'yourname'}</span> below:
                </label>
                <input
                  type="text"
                  value={deleteConfirmUsername}
                  onChange={(e) => setDeleteConfirmUsername(e.target.value)}
                  placeholder={username || 'yourname'}
                  disabled={deletingAccount}
                  className="w-full px-3.5 py-2.5 text-sm bg-neutral-50/50 border border-black/[0.08] rounded-xl text-primary font-mono focus:outline-none focus:ring-2 focus:ring-traffic-red/40 focus:border-traffic-red"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  disabled={deletingAccount || deleteConfirmUsername.trim() !== (username || 'yourname').trim()}
                  onClick={handleDeleteAccount}
                  className="flex-1 py-2.5 px-4 bg-traffic-red text-white font-medium text-xs rounded-xl hover:bg-traffic-red/90 transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {deletingAccount ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Deleting Account...</span>
                    </>
                  ) : (
                    <span>Confirm Delete Account</span>
                  )}
                </button>
                <button
                  type="button"
                  disabled={deletingAccount}
                  onClick={() => setDeleteModalOpen(false)}
                  className="py-2.5 px-4 bg-neutral-100 text-secondary hover:text-primary font-medium text-xs rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}