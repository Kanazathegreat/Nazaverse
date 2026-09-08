# Nazaverse

> Premium link-in-bio & personal profile hub web app inspired by macOS/iOS design language.

---

##  About

**Nazaverse** reimagines link-in-bio profiles as native macOS application windows rather than standard web pages. Built with clean lines, authentic window chrome (traffic light controls), soft layered shadows, and tactile micro-interactions.

---

## 🎨 Design System

| Token | Value / Specification | Description |
| :--- | :--- | :--- |
| **Background** | `#F5F5F7` | Apple neutral canvas |
| **Surface** | `#FFFFFF` | Window / card background |
| **Text Primary** | `#1D1D1F` | High-contrast body & heading text |
| **Text Secondary** | `#6E6E73` | Subtitles, metadata & secondary labels |
| **Accent** | `#0A84FF` | macOS System Blue for interactive elements |
| **Traffic Lights** | `#FF5F57` / `#FEBC2E` / `#28C840` | Close / Minimize / Expand window dots |
| **Typography** | Inter (`next/font/google`) | `-0.04em` to `-0.02em` tight tracking on titles |
| **Border Radius** | `16px` (xl), `24px` (2xl), `32px` (3xl) | Large squircle-inspired curves |
| **Shadows** | `soft` / `macos` | Diffuse ambient drop shadows |

---

## 🛠 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + custom tokens
- **Icons**: Lucide React
- **Backend / Auth / Storage**: Supabase (`@supabase/ssr`, PostgreSQL, Storage buckets)
- **Deployment**: Vercel

---

## 📁 Project Structure

```text
Nazaverse/
├── app/
│   ├── layout.tsx         # Root layout with Inter font & global styles
│   └── page.tsx           # Public profile view
├── components/
│   ├── ProfileCard.tsx    # macOS window profile container
│   ├── LinkItem.tsx       # Interactive link button with hover lift
│   └── Wordmark.tsx       # Logo wordmark component
├── lib/
│   ├── supabase/
│   │   ├── client.ts      # Client-side Supabase helper
│   │   └── server.ts      # Server-side Supabase SSR helper
│   └── utils.ts           # Class merging helper (cn)
├── styles/
│   └── globals.css        # Tailwind layers & CSS variables
├── .env.example           # Supabase environment variables template
├── tailwind.config.ts     # macOS theme configuration
└── next.config.mjs        # Next.js config + remote image patterns
```

---

## 🗺 Roadmap & Execution Plan

- [x] **Phase 1: Project Scaffolding & Design Foundation**
  - Next.js 14 App Router, TypeScript, Tailwind config with design tokens.
  - Supabase client architecture configured for SSR.
- [x] **Phase 2: macOS Window Component & UI Prototype**
  - `<ProfileCard />` with traffic light header, overlapping avatar/banner, and link stack.
  - Interactive `<LinkItem />` with spring hover-lift transitions.
  - Responsive mobile-first adaptation.
- [ ] **Phase 3: Supabase Data Integration**
  - Dynamic routing (`/[username]`).
  - Read from `profiles` and `links` database tables.
  - Avatar & banner assets served from Supabase storage buckets (`avatars`, `banners`).
- [ ] **Phase 4: Authentication & Profile Editor**
  - Supabase Auth (magic link / OAuth).
  - Drag-and-drop link reordering, avatar/banner upload modal.
  - Live preview editor pane.
- [ ] **Phase 5: Analytics & Polish**
  - Click tracking per link.
  - OG image generation for profile cards.
  - Production deployment to Vercel.

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local` and add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view profile hub.
