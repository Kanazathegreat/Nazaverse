# Nazaverse

A modern, macOS-inspired link-in-bio platform for creators and developers. Nazaverse lets you build a personal profile page with a custom avatar, banner, bio, and an organized list of links — all under your own username.

**Live demo:** https://nazaverse.vercel.app

## Features

- **Magic link authentication** — passwordless sign-in via Supabase Auth
- **Custom profile** — display name, username, bio
- **Avatar & banner upload** — supports static images and animated GIFs, with an in-browser crop tool for static images
- **Link management** — add, edit, delete, and drag-and-drop reorder links, each with a title, URL, and icon
- **Public profile pages** — shareable, SEO-friendly pages at `/{username}`
- **Account settings** — copy public profile link, view membership date, and permanently delete an account
- **Responsive design** — built mobile-first, tested across common breakpoints
- **macOS-inspired visual language** — traffic-light window chrome, soft shadows, frosted-glass accents, and subtle motion throughout

## Tech Stack

- **Framework:** Next.js 14 (App Router), TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Supabase (Auth, Postgres database, Storage)
- **Drag & drop:** dnd-kit
- **Icons:** lucide-react
- **Hosting:** Vercel
- **Transactional email:** Resend (SMTP)

## Getting Started

### Prerequisites

- Node.js 18 or later
- A Supabase project
- A Resend account (for production email delivery)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kanazathegreat/nazaverse.git
   cd nazaverse
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the project root:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-publishable-key
   ```

4. Set up the database schema and storage buckets in your Supabase project (see `Database Schema` below).

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

Nazaverse uses two main tables in Supabase:

- **`profiles`** — id, username, display_name, bio, avatar_url, banner_url, created_at, updated_at
- **`links`** — id, profile_id, title, url, icon, position, created_at

Both tables use Row Level Security: public read access for profile pages, and write access restricted to the authenticated owner (`auth.uid()` matched against `profiles.id`).

Two public Storage buckets are used: `avatars` and `banners`, each scoped so users can only upload to their own folder (`{user_id}/...`).

## Deployment

Nazaverse is deployed on Vercel, connected directly to this repository. Environment variables must be configured in the Vercel project settings, and the Supabase project's Auth redirect URLs must include the production domain.

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
