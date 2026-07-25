# KSP-Chanakya: Law Enforcement Intelligence System

> AI-powered intelligence platform for Karnataka State Police — advanced criminal investigation, relationship mapping, and multi-language query processing.

![Status](https://img.shields.io/badge/Status-Hackathon%20Project-blue)
![Node](https://img.shields.io/badge/Node.js-24-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![React](https://img.shields.io/badge/React-19-cyan)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black)

---

## Live Demo

**Production:** https://frontend-indol-ten-48.vercel.app

All backend API endpoints run as Vercel serverless functions — zero database setup required.

---

## Quick Start

### Prerequisites

- **Node.js 24+**
- **pnpm** (package manager)

### Local Development

```bash
# Install frontend dependencies
cd frontend
pnpm install

# Start frontend (port 3000)
pnpm dev

# In a separate terminal, start backend (port 5000)
cd Backend/artifacts/api-server
pnpm dev
```

### Vercel Deployment

```bash
cd frontend
vercel --yes --prod
```

---

## Project Structure

```
Datathon/
├── Backend/
│   └── artifacts/
│       └── api-server/           # Express API (port 5000, local dev)
│           └── src/
│               ├── routes/       # API endpoints (query, search, graph, auth, audit, dossier)
│               ├── lib/          # PII redaction, audit logging, JWT auth, ABAC
│               └── app.ts
│
├── frontend/
│   ├── api/
│   │   └── index.ts             # Vercel serverless function (all API routes)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx           # Nav bar with keyboard shortcuts
│   │   │   ├── GraphAnalyst.tsx     # Interactive graph (drag, zoom, pan, tooltips)
│   │   │   ├── FieldView.tsx        # Mobile-first chat interface
│   │   │   ├── SemanticSearch.tsx   # MO vector similarity search
│   │   │   ├── LeadershipOverview.tsx  # Executive KPI dashboard
│   │   │   ├── TimelineView.tsx     # Chronological case events
│   │   │   ├── AuditLogViewer.tsx   # Hash-chained audit trail
│   │   │   ├── ExportDossierModal.tsx  # PDF dossier export
│   │   │   └── Skeleton.tsx         # Reusable loading components
│   │   ├── lib/api.ts           # Typed API client
│   │   ├── types.ts             # TypeScript interfaces
│   │   ├── data/mockData.ts     # Mock suspects, graph nodes, cases
│   │   ├── index.css            # Custom animations (spring, fade, pulse)
│   │   └── App.tsx              # View router + keyboard shortcuts
│   ├── vercel.json              # Vercel config (rewrites, build)
│   └── package.json
│
└── README.md
```

---

## Features

### Interactive Graph Analyst
- **Drag-and-drop** nodes to rearrange the investigation graph
- **Mouse wheel zoom** (0.3x–3x) with percentage indicator
- **Pan** with Alt+drag or middle-click
- **Hover tooltips** showing node details (type, risk score, description)
- **Edge labels** on hover showing relationship type
- **Node selection** highlights connected edges, dims unrelated nodes
- **Connected node sidebar** — click neighbors to navigate the graph
- **Link filters** — toggle suspect, vehicle, financial, FIR links
- **Fit to screen** button + keyboard shortcut

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| `1`–`6` | Switch views (Field, Graph, Search, Leadership, Timeline, Audit) |
| `F` | Fit graph to screen |
| `+` / `-` | Zoom graph in/out |
| `0` | Reset zoom & pan |
| `Esc` | Deselect node |
| `?` | Toggle help overlay |
| `⌘K` | Toggle command palette |

### 6 Views
1. **Field View** — Mobile-first chat with voice query support, suspect cards, TTS player
2. **Graph Analyst** — Interactive link analysis with XAI reasoning drawer
3. **Semantic Search** — MO narrative search with cosine similarity ranking
4. **Leadership** — Executive KPI dashboard with animated counters & district heatmap
5. **Timeline** — Chronological case events grouped by month, filterable by type
6. **Audit Trail** — Hash-chained compliance log with Merkle root integrity verification

### Anti-AI UI Design
- Reduced excessive shadows, glassmorphism, and animate-pulse spam
- Apple-like spring animations (`cubic-bezier(0.34, 1.56, 0.64, 1)`)
- Staggered entrance animations for lists
- Subtle hover states and micro-interactions
- Custom scrollbars and transition effects

---

## API Endpoints

All endpoints are served as a Vercel serverless function from `frontend/api/index.ts`.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/healthz` | GET | Health check with service info |
| `/api/v1/query/natural-languageInputs` | POST | NL query with PII redaction, keyword-driven responses |
| `/api/v1/query/graphInputs` | POST | Graph query returning 6-node mock network |
| `/api/v1/search/moInputs` | POST | MO similarity search with district filtering |
| `/api/v1/dossier/exportInputs` | POST | PDF dossier generation with watermark |
| `/api/v1/auth/token` | POST | JWT access + refresh token issuance |
| `/api/v1/auth/refresh` | POST | Refresh token rotation |
| `/api/v1/audit/logs` | GET | Audit logs with Merkle chain integrity check |

### Example: Natural Language Query

```bash
curl -X POST https://frontend-indol-ten-48.vercel.app/api/v1/query/natural-languageInputs \
  -H "Content-Type: application/json" \
  -d '{"query_text": "vehicle near malleshwaram", "language_code": "en"}'
```

---

## Security

- **PII Redaction** — Aadhaar, PAN, phone, email automatically redacted
- **Hash-Chained Audit Log** — SHA-256 chained entries with integrity verification
- **JWT Authentication** — Access + refresh token pattern
- **ABAC Middleware** — District-level data isolation by role
- **CORS** — Configurable cross-origin policies

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite + Tailwind CSS 4 |
| Backend (local) | Node.js 24 + Express 5 |
| Serverless API | Vercel Functions (Node.js) |
| Language | TypeScript 5.8 |
| Animation | CSS keyframes + custom spring utilities |
| Icons | Lucide React |
| Deployment | Vercel (frontend + API) |
| Repository | GitHub |

---

## Development Commands

```bash
# Frontend
cd frontend
pnpm dev              # Start dev server (port 3000)
pnpm build            # Production build
npx tsc --noEmit      # Type check
pnpm lint             # Lint

# Backend (local development only)
cd Backend/artifacts/api-server
pnpm dev              # Build + start (port 5000)

# Deploy to Vercel
cd frontend
vercel --yes --prod
```

---

## Environment

The frontend API client automatically detects the environment:
- **localhost** → calls `http://localhost:5000/api` (local backend)
- **production** → calls `/api` (Vercel serverless function)

No environment variables needed for Vercel deployment.

---

**Built for Karnataka State Police — Datathon 2025**
