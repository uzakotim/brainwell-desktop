<p align="center">
  <img src="public/image.png" alt="Brainwell Logo" width="140" />
</p>

<h1 align="center">Brainwell</h1>

<p align="center">
  <strong>A private, offline-first desktop app for tracking your brain health over time.</strong><br/>
  Educational &amp; exploratory — not diagnostic.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.1.0-6abf69?style=flat-square" alt="version" />
  <img src="https://img.shields.io/badge/platform-macOS-lightgrey?style=flat-square&logo=apple" alt="platform" />
  <img src="https://img.shields.io/badge/built_with-Tauri_2-24C8DB?style=flat-square&logo=tauri" alt="tauri" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="react" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript" alt="typescript" />
  <img src="https://img.shields.io/badge/Rust-Powered-CE422B?style=flat-square&logo=rust" alt="rust" />
</p>

---

## ✨ What is Brainwell?

**Brainwell** is a cross-platform desktop application that turns neuroscience into a self-reflection tool. Through short, clinically-inspired questionnaires, you evaluate five key brain systems — and then track how they evolve over time through rich, interactive charts.

> ⚠️ **Disclaimer:** This application is educational and exploratory in nature. It is **not** a medical or diagnostic tool. Always consult a qualified healthcare professional for medical advice.

---

## 🧠 Brain Regions Assessed

Brainwell covers five core neurological and neuroendocrine systems, each with its own dedicated question bank of 30–50 items (5 randomly selected per session):

| Region | What It Measures |
|---|---|
| **PFC** — Prefrontal Cortex | Planning, decision-making, working memory, impulse control |
| **Hippocampus** | Memory formation, learning, spatial reasoning |
| **Amygdala** | Emotional processing, fear response, threat detection |
| **ACC** — Anterior Cingulate Cortex | Attention regulation, conflict monitoring, emotional control |
| **Cortisol** | Chronic stress load, HPA-axis activation, physiological stress signs |

---

## 🖥️ App Screens

### 🏠 Home Screen
A clean welcome screen with the Brainwell logo and a single **Get Started** button. Simple, focused, and distraction-free.

### 🗺️ Brain Map
An interactive layout displaying all five brain regions arranged around a central brain icon. Click any region to begin its questionnaire, or hit **Randomize Questions** to get a fresh set of prompts across all regions at once.

### 📝 Brain Region — Questionnaire
Each region's page presents 5 randomly selected questions from its curated bank. Answer each with:
- **No** — Not a concern
- **Sometimes** — Occasionally present
- **Yes** — Frequently experienced

Answers are stored in global state (via Jotai) and persist across the session.

### 📊 Statistics
After completing all regions, view your **scores as colored progress bars**:
- 🟢 **Green** → Low concern (0–32%)
- 🟡 **Amber** → Moderate concern (33–65%)
- 🔴 **Red** → High concern (66–100%)

Save a dated record to disk (or iCloud) with a single button click.

### 📈 Charts
Visualize your historical records with interactive bar charts via **Recharts**. Switch between:
- **Days** — Current week view
- **Weeks** — Select a specific month
- **Months** — Select a specific year

Filter by brain region using a dropdown to compare trends over time.

---

## 🏗️ Architecture

```
brainwell-desktop/
├── public/
│   └── image.png              # App logo (green brain)
├── src/
│   ├── pages/
│   │   ├── Home.tsx           # Welcome / entry screen
│   │   ├── BrainMap.tsx       # Region selector with brain icon
│   │   ├── BrainRegion.tsx    # Per-region questionnaire
│   │   ├── Stats.tsx          # Score summary with progress bars
│   │   └── Charts.tsx         # Historical analytics dashboard
│   ├── components/
│   │   ├── Layout.tsx         # Shared nav header with back/brain/chart buttons
│   │   └── RegionBarChart.tsx # Recharts wrapper component
│   ├── store/
│   │   └── brainCheckupStore.ts  # Jotai atoms for questions & answers
│   ├── data/
│   │   └── Questions.ts       # 200+ curated questions across 5 regions
│   └── lib/
│       ├── timeAggregations.ts   # Daily / weekly / monthly data helpers
│       └── utils.ts
└── src-tauri/
    ├── src/
    │   └── lib.rs             # Rust backend: iCloud/local persistence
    └── tauri.conf.json        # App window config (800×600)
```

---

## 💾 Data Persistence

Brainwell uses a **Rust-powered backend** (via Tauri commands) to persist your records to JSON:

1. **Primary:** `~/Library/Mobile Documents/com~apple~CloudDocs/Brainwell/store.json` — automatically synced via **iCloud Drive**.
2. **Fallback:** `~/.brainwell/store.json` — used when iCloud is unavailable.

Each saved record contains:
```json
{
  "date": "26-08-2026",
  "dayTime": "14:30",
  "regionSums": {
    "PFC": 4,
    "Amygdala": 7,
    "ACC": 3,
    "Hippocampus": 5,
    "Cortisol": 6
  }
}
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Tauri 2](https://tauri.app) — native desktop shell |
| **Frontend** | [React 19](https://react.dev) + [TypeScript 5.8](https://www.typescriptlang.org) |
| **Build Tool** | [Vite 7](https://vitejs.dev) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com) |
| **UI Components** | [Radix UI](https://www.radix-ui.com) (Tabs, Select, Progress) + [shadcn/ui](https://ui.shadcn.com) |
| **Icons** | [Lucide React](https://lucide.dev) + [React Icons](https://react-icons.github.io/react-icons/) |
| **State Management** | [Jotai](https://jotai.org) |
| **Charts** | [Recharts 2](https://recharts.org) |
| **Routing** | [React Router 7](https://reactrouter.com) |
| **Backend** | Rust with `serde_json`, `dotenv`, `fix-path-env` |
| **Testing** | [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) ≥ 18
- [Yarn](https://yarnpkg.com)
- [Rust](https://rustup.rs) (stable toolchain)
- Xcode Command Line Tools (macOS)

### Install dependencies

```bash
yarn install
```

### Run in development

```bash
yarn tauri dev
```

This starts both the Vite dev server and the Tauri native window simultaneously.

### Build for production

```bash
yarn tauri build
```

The compiled `.app` bundle will be placed in `src-tauri/target/release/bundle/`.

### Run frontend only (browser)

```bash
yarn dev
```

> Note: Tauri-specific features (file persistence) won't be available in browser mode.

---

## 🧪 Running Tests

```bash
yarn test
```

Uses [Vitest](https://vitest.dev) with [jsdom](https://github.com/jsdom/jsdom) and [Testing Library](https://testing-library.com).

---

## 📁 Project Config

| File | Purpose |
|---|---|
| `tauri.conf.json` | App name, window size, bundle targets, icon paths |
| `vite.config.ts` | Vite + React plugin + path aliases |
| `tsconfig.json` | TypeScript compiler options |
| `components.json` | shadcn/ui component registry config |

---

## 🗺️ Roadmap

- [ ] Dark / light theme toggle
- [ ] Guided session mode (step-by-step wizard)
- [ ] Export data as CSV / PDF report
- [ ] Trend insights & AI-powered summaries
- [ ] Windows & Linux support

---

## 📄 License

This project is private and not yet licensed for redistribution.

---

<p align="center">
  Built with ❤️ using
  <img src="public/tauri.svg" alt="Tauri" height="16" style="vertical-align:middle; margin: 0 4px;" />
  Tauri &amp;
  <img src="public/vite.svg" alt="Vite" height="16" style="vertical-align:middle; margin: 0 4px;" />
  Vite
</p>
