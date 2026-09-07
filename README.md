# 🏎️ GRAND PRIX LIVE TIMING & RACE CONTROL

A high-performance, real-time motorsport leaderboard and race-control console inspired by Formula 1 broadcast telemetry. Built for college racing competitions, track days, and competitive time-trials.

---

## ⚡ Features

### 🏁 Real-Time Broadcast Leaderboard (`/leaderboard`)
- **F1 Timing Tower Telemetry**: Dynamic timing tower tracking rank positions, driver names, car tags, sector delta intervals, gap to P1 benchmark, and status (`FINISHED`, `DNF`, `DQ`).
- **Smooth Reorder Animations**: Position switches animated with sub-millisecond precision via Framer Motion layout animations.
- **Top 3 Hero Podium**:
  - **Prominent Hero Visuals**: Full-bleed portrait cards with dark ambient vignettes.
  - **Elevated P1 Champion**: Enlarged center card with dual crimson & sapphire neon aura, high-contrast typography, and giant lap time numerals.
  - **P2 & P3 Runner-Up Cards**: Clean, high-contrast ranking layout.
- **Fastest Lap Alert Toast**: Broadcast-style HUD notification triggered in real-time whenever a new track benchmark lap is recorded.
- **TV & Kiosk Mode**: One-click fullscreen display mode tailored for trackside monitors, LED walls, and projectors.

### 🛠️ Race Control Console (`/admin`)
- **Fast Lap Entry**: Rapid telemetry input with automatic time parsing (`m:ss.fff` or raw milliseconds).
- **Direct Device Image Uploads**: Upload driver portraits and car photos directly from any mobile phone or laptop with automatic image preview and direct-to-cloud Convex storage.
- **Live Grid Management**:
  - Edit driver details, times, and car specs on the fly.
  - Quick-toggle driver status: `FINISHED`, `DNF` (Did Not Finish), `DQ` (Disqualified).
  - Seed competitive demo grid with 1 click.
  - Reset / clear grid for fresh sessions.

---

## 🚀 Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **[Next.js 15 (App Router)](https://nextjs.org/)** | React application framework with Turbopack |
| **[Convex](https://www.convex.dev/)** | Reactive real-time backend database & built-in file storage |
| **[Tailwind CSS](https://tailwindcss.com/)** | Dark paddock design system, custom glows & racing gradients |
| **[Framer Motion](https://www.framer.com/motion/)** | Real-time layout animations for rank changes and podium pop-ins |
| **[Lucide Icons](https://lucide.dev/)** | Broadcast telemetry iconography |
| **[Chakra Petch & Geist](https://fonts.google.com/)** | Angular digital racing fonts & monospace typography |
| **[Bun](https://bun.sh/)** | Ultra-fast package manager and runtime |

---

## 🏁 Getting Started

### 1. Clone the Repository
```bash
git clone git@github.com:Imad-81/ideate_leaderboard.git
cd ideate_leaderboard
```

### 2. Install Dependencies
```bash
bun install
# or
npm install
```

### 3. Configure Convex Backend
Sign in to Convex and create or link your project:
```bash
bunx convex dev
```
This generates your local environment credentials in `.env.local`:
```env
NEXT_PUBLIC_CONVEX_URL="https://<your-deployment-name>.convex.cloud"
```

### 4. Run the Development Server
```bash
bun run dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser:
- **Leaderboard View**: `http://localhost:3000/` or `http://localhost:3000/leaderboard`
- **Race Control Console**: `http://localhost:3000/admin`

---

## 📂 Project Architecture

```
ideate_leaderboard/
├── app/
│   ├── layout.tsx              # Root layout with fonts, metadata, Convex provider
│   ├── page.tsx                # Home entry point (renders live leaderboard)
│   ├── leaderboard/page.tsx    # Full broadcast live timing board
│   └── admin/page.tsx          # Race Control management deck
├── components/
│   ├── admin/
│   │   ├── ImageUploader.tsx   # Direct browser-to-Convex device image uploader
│   │   ├── ResultForm.tsx      # Fast lap entry form with timing validation
│   │   └── ResultsManagementTable.tsx # Live grid operations table & edit modal
│   ├── common/
│   │   └── CarImageFallback.tsx # Dynamic driver silhouette and vehicle fallback
│   └── leaderboard/
│       ├── Podium.tsx          # Prominent top-3 hero podium cards
│       ├── TimingTower.tsx     # Animated live timing tower with rank telemetry
│       ├── NewFastestLapAlert.tsx # Broadcast alert toast for new P1 record
│       └── EmptyState.tsx      # Waiting for grid sessions screen
├── convex/
│   ├── schema.ts               # Database schema with indexes on timeMs & status
│   └── results.ts              # Realtime queries, mutations & storage upload URLs
└── lib/
    ├── time.ts                 # Millisecond precision formatting (m:ss.fff, deltas)
    └── types.ts                # TypeScript data interfaces
```

---

## ⏱️ Lap Time Format Reference

Times can be entered in flexible human-readable formats:
- `1:04.250` → 1 minute, 4 seconds, 250 milliseconds
- `58.420` → 58 seconds, 420 milliseconds
- `64250` → 64,250 raw milliseconds

---

## 🚢 Deploying to Vercel

1. Push your code to GitHub.
2. Import your repository into [Vercel](https://vercel.com).
3. In your Vercel Project Settings, add the Environment Variable:
   - `NEXT_PUBLIC_CONVEX_URL`: Your Convex production deployment URL.
4. Deploy! All real-time telemetry and file storage run on the distributed Convex cloud.
