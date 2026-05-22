# UDF Manifesto Tracker (2026–2031)

An independent, premium open-source citizen dashboard designed to track, audit, and discuss the progress of the Kerala UDF Government's election manifesto promises under Chief Minister V.D. Satheesan.

Built with **React, Vite, Tailwind CSS, and Supabase (PostgreSQL)**, this platform empowers the public to submit status updates supported by verified media links, deliberate in bilingual discussion forums, and collectively moderate submitted proof via a robust upvote/downvote verification engine.

---

## Key Features

*   **Live Progress Auditing**: Real-time stats calculation including overall completion rate, departmental charts, and active promise count metrics.
*   **100% Bilingual Interface**: Instantly toggles between English and Malayalam across all screens, headers, timelines, and action modals.
*   **Multi-Tier Anti-Spam Control**:
    *   **Rate Limiting**: Users are strictly rate-limited to a maximum of 3 suggested status updates per week to prevent flooding.
    *   **Domain Whitelisting**: Status suggestions require a verification source link matching an explicit whitelist of 31 reputable news portals and government subdomains (e.g., `kerala.gov.in`, `thehindu.com`, `assembly.kerala.gov.in`).
    *   **Banning System**: Integrated moderator controls can instantly restrict users from posting comments or updates by flagging `is_banned` in their profiles.
*   **Democratic Verification Engine**: Users can upvote (+1) or downvote (-1) suggested updates. Double-click acts as a toggle, creating an open community consensus before moderation.
*   **Simple Account Access & Data Autonomy**:
    *   Secure integration using pure Google & Facebook OAuth (no password databases to compromise).
    *   **Cascading Wipe Page (`/data-deletion`)**: Provides users with a single-click mechanism to instantly expunge all their suggested updates, comments, votes, and profile histories from the database to comply with Meta Developer policies.
*   **Installable PWA**: Complete web app manifest, app icons, production-only service worker registration, cached app shell, and a dedicated offline fallback page.
*   **High-Performance Architecture**: Custom routing rewrite rules, instant snap-to-top snaps, fully optimized responsive components, and tight Content Security Policies (CSP).

---

## Tech Stack

*   **Front-end Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/) (lightning-fast HMR)
*   **Router**: [React Router DOM v7](https://reactrouter.com/)
*   **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + Realtime Engine)
*   **Styling & Icons**: [Tailwind CSS](https://tailwindcss.com/) (Curated HSL premium color system) + [React Icons](https://react-icons.github.io/react-icons/)
*   **Hosting**: Optimized for [Vercel](https://vercel.com) deployment

---

## Repository Structure

```bash
├── public/                    # Static assets, PWA manifest, service worker & offline fallback
├── src/
│   ├── components/            # Reusable UI widgets
│   │   ├── AuthModal.jsx      # Social Google/Facebook sign-in modal
│   │   ├── Filters.jsx        # Promise filtering & search matching engine
│   │   ├── Hero.jsx           # Animated title banner & main counters
│   │   ├── Navbar.jsx         # Navigation bar & bilingual switcher
│   │   ├── PromiseCard.jsx    # Metric summaries & status tags for individual cards
│   │   └── UpdateStatusModal.jsx # Proof submission form with URL whitelisting
│   ├── data/
│   │   └── promises.js        # Hardcoded static baseline promise dataset (41 key targets)
│   ├── pages/
│   │   ├── DataDeletionPage.jsx # Cascading account-wipe interface (Compliance)
│   │   ├── PrivacyPolicyPage.jsx # Full legal metadata translated in ML & EN
│   │   ├── PromiseCommentsPage.jsx # Bilingual discussion forum for comments
│   │   └── PromiseHistoryPage.jsx # Audit timeline tracker with community voting
│   ├── App.jsx                # App bootstrap, global state & router routes
│   ├── constants.js           # Shared variables, allowed domains & status translations
│   ├── index.css              # Custom base styles, base layout & transitions
│   ├── main.jsx               # Entrypoint mounting DOM
│   └── supabase.js            # Initialized Supabase DB configuration client
├── index.html                 # HTML viewport, PWA tags, Google Fonts & SEO metadata
├── vercel.json                # Single Page App rewrite patterns & CSP Headers
└── vite.config.js             # Vite compilers configuration
```

---

## Database Schema

The platform relies on a PostgreSQL schema housed on Supabase. Execute the following tables inside your SQL Editor:

```sql
-- 1. Allowed Domains Whitelist
CREATE TABLE public.allowed_domains (
  domain TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 2. Profiles Table (Extensions auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  is_banned BOOLEAN DEFAULT false
);

-- 3. Updates (Suggested Progress Logs)
CREATE TABLE public.updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promise_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT,
  previous_status TEXT,
  new_status TEXT NOT NULL,
  source_link TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 4. Upvotes (Democratic score checking)
CREATE TABLE public.upvotes (
  update_id UUID REFERENCES public.updates(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vote INT CHECK (vote = ANY(ARRAY[-1, 1])),
  PRIMARY KEY (update_id, user_id)
);

-- 5. Comments (Discussion Board)
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promise_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);
```

---

## Local Development Setup

Follow these steps to run the tracker on your machine:

### 1. Clone the Repository
```bash
git clone https://github.com/ridanasif/udf-manifesto-tracker.git
cd udf-manifesto-tracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy `.env.example` to `.env.local` and insert your Supabase API keys:
```env
VITE_SUPABASE_URL=https://your-supabase-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-publishable-anon-key
```

### 4. Seed Whitelisted Domains
Run this query in your Supabase SQL editor to populate allowed news and government verification portals:
```sql
INSERT INTO public.allowed_domains (domain) VALUES
('kerala.gov.in'),
('assembly.kerala.gov.in'),
('thehindu.com'),
('onmanorama.com'),
('mathrubhumi.com'),
('manoramaonline.com'),
('asianetnews.com'),
('reporterlive.com'),
('deshabhimani.com'),
('madhyamam.com'),
('janmabhumi.in'),
('keralakaumudi.com'),
('marunadanmalayali.com'),
('eastcoastdaily.com'),
('doolnews.com'),
('timesofindia.indiatimes.com'),
('indianexpress.com'),
('ndtv.com'),
('indiatoday.in'),
('news18.com'),
('hindustantimes.com'),
('scroll.in'),
('thewire.in'),
('thenewsminute.com'),
('facebook.com'),
('twitter.com'),
('x.com'),
('youtube.com'),
('instagram.com'),
('t.me'),
('telegram.org');
```

### 5. Launch Local Dev Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 6. Production Build & Installability Check
```bash
npm run lint
npm run build
npm run preview
```
Open the preview URL, then use the browser install action to add the tracker as a standalone app. The PWA assets are served from `public/site.webmanifest`, `public/service-worker.js`, and `public/offline.html`.

---

## Security & Privacy Autonomy

*   **Facebook & Google Developer Policies**: This app includes a dedicated `/data-deletion` route that cascade wipes all user-associated rows (comments, upvotes, profile and suggested status logs) and immediately signs the user out.
*   **Security Headers**: Build deployments bundle production-ready headers inside [vercel.json](vercel.json) ensuring rigid Content Security Policies (CSP), Frame Denials (`X-Frame-Options: DENY`), and script execution containment policies.
*   **Installable App Safety**: The service worker caches same-origin app shell/static assets only. Supabase API requests remain network-first and are not stored in the app cache.
*   **Spam Moderation**: Banned users (flagged with `is_banned: true`) are client-side blocked from invoking comment inserts or database updates.

---

## Contribution Guidelines

We welcome community collaborations! If you would like to submit improvements:
1. Fork the repo.
2. Create a clean branch describing your updates: `git checkout -b feature/cool-new-metric`.
3. Keep code accessibility compliant (e.g. skip-to-content anchors, explicit `aria` targets, responsive styling).
4. Propose new Whitelisted Domains inside `src/constants.js` to scale support for verified regional newspapers.
5. Push changes and open a Pull Request.

---

## Support & Contacts

For security vulnerabilities or manual database purging inquiries, contact:
*   **Lead Developer**: Ridan Asif
*   **Email**: [ridhaanasif@gmail.com](mailto:ridhaanasif@gmail.com)
*   **Website**: [ridanasif.com](https://www.ridanasif.com)

---

*Disclaimer: This dashboard is a completely independent community initiative and has no official affiliation with the Government of Kerala or any political party.*
