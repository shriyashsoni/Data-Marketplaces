# Data Marketplaces

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/apna-counsellors-projects/v0-data-marketplaces)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/GmO9KwHHcMY)

## 1) Project Title
Data Marketplaces – Datasets, Compute-on-Data, and Research Marketplace (Supabase + Vercel Blob, optional Web3)

## 2) Description
Data Marketplaces is a modern, mobile-first platform for discovering, publishing, and monetizing datasets, and for running compute on data securely. It provides:
- A datasets layer (files stored in Vercel Blob, metadata in Supabase)
- A compute jobs layer (create jobs against datasets, track statuses)
- A research marketplace (publish offers, request access)
- Optional Web3 access controls (wallet connect, NFT-gated access, purchase stubs)

Built with Next.js (App Router), Tailwind (shadcn/ui), Supabase (DB + auth + RLS), and Vercel Blob for storage. The app ships with versioned SQL migrations, REST APIs, and responsive pages.

## 3) Features
- Datasets
  - Upload files to Vercel Blob; store metadata in Supabase
  - Browse datasets (list/detail), associate datasets to DAOs (groups)
- DAOs (Data Cooperatives)
  - Create organizations/groups and attach datasets
- Compute-on-Data Jobs
  - Create jobs referencing a dataset; track status and results (stubbed runner)
- Research Marketplace
  - Publish offers; view offers; stubbed checkout flow
- Authentication & Security
  - Supabase email/password auth, SSR session refresh middleware
  - RLS: public reads; writes require auth (and/or service role in API)
- APIs
  - REST endpoints for datasets, compute jobs, marketplace offers, DAO relations
- Optional Web3
  - Wallet Connect (injected) and minimal contract interfaces
  - Access gating and purchase stubs (Sepolia-ready)
- UI/UX
  - Mobile-first, accessible, shadcn/ui components, Tailwind v4 tokens

## 4) Installation Instructions

### Prerequisites
- Node.js 18+ (or 20+), and one of:
  - bun (recommended): https://bun.sh
  - or pnpm / npm
- Vercel account (recommended for deployment)
- Supabase project (use Vercel Integration or set env vars manually)
- Vercel Blob (enabled via integration or `BLOB_READ_WRITE_TOKEN`)

### 1. Clone
\`\`\`bash
git clone https://github.com/<your-org-or-user>/Data-Marketplaces.git
cd Data-Marketplaces
\`\`\`

### 2. Install dependencies
\`\`\`bash
# using bun
bun install

# or using pnpm
pnpm install

# or npm
npm install
\`\`\`

### 3. Environment variables
Create `.env.local` (for local dev) and set:

Supabase (required):
\`\`\`
# Server-side
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Client-side (NEXT_PUBLIC_*)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
\`\`\`

Vercel Blob (required for upload):
\`\`\`
BLOB_READ_WRITE_TOKEN=
\`\`\`

Optional Web3:
\`\`\`
# Defaults to Sepolia if omitted
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://rpc.sepolia.org
# Set addresses to enable on-chain actions
NEXT_PUBLIC_ACCESS_NFT_ADDRESS=
NEXT_PUBLIC_MARKETPLACE_ADDRESS=
\`\`\`

### 4. Database setup (SQL migrations)
Run these in order (via Supabase SQL editor or your preferred migration runner):
\`\`\`
scripts/001_init_datasets.sql
scripts/002_init_daos.sql
scripts/003_init_compute_jobs.sql
scripts/004_init_marketplace.sql
\`\`\`
These create tables and RLS policies (public reads; writes require auth or service role in server APIs).

### 5. Run the app
\`\`\`bash
# Development
bun dev        # or pnpm dev / npm run dev

# Build + start (production)
bun run build
bun run start  # or pnpm build && pnpm start
\`\`\`

## 5) Usage

### UI Routes
- Home: `/`
- Datasets: `/datasets`
- Dataset Detail: `/datasets/[id]`
- DAOs: `/daos`
- Submit Dataset: `/submit`
- Compute Jobs: `/compute-jobs`
- Marketplace: `/marketplace`
- Auth: `/login`, `/register`
- Redirect: `/compute` → `/compute-jobs` (fallback)

Note: Write actions require you to be signed in.

### API Endpoints (examples)

List datasets:
\`\`\`bash
curl -s https://<your-deployment>/api/datasets
\`\`\`

Create dataset (multipart/form-data):
\`\`\`bash
curl -X POST https://<your-deployment>/api/datasets \
  -H "Authorization: Bearer <your-supabase-jwt>" \
  -F "file=@/path/to/file.csv" \
  -F "name=Human Activity Data" \
  -F "description=Wearables accelerometer dataset"
\`\`\`

Get dataset by id:
\`\`\`bash
curl -s https://<your-deployment>/api/datasets/<id>
\`\`\`

Create compute job:
\`\`\`bash
curl -X POST https://<your-deployment>/api/compute-jobs \
  -H "Authorization: Bearer <your-supabase-jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "dataset_id": "<dataset-id>",
    "parameters": {"task":"summary","model":"stub-gpu"}
  }'
\`\`\`

List marketplace offers:
\`\`\`bash
curl -s https://<your-deployment>/api/marketplace/offers
\`\`\`

Stub checkout:
\`\`\`bash
curl -X POST https://<your-deployment>/api/marketplace/checkout \
  -H "Authorization: Bearer <your-supabase-jwt>" \
  -H "Content-Type: application/json" \
  -d '{"offer_id":"<offer-id>"}'
\`\`\`

### Authentication (Supabase)
- Register: `/register` (email + password)
- Login: `/login`
- SSR session refresh handled by middleware; authenticated requests include the Supabase JWT on the client.
- RLS ensures reads are safe; write endpoints validate auth server-side.

### Optional Web3
- Use the “Connect Wallet” button in the header (injected connector, e.g., MetaMask).
- If `NEXT_PUBLIC_ACCESS_NFT_ADDRESS` is set, AccessCheck will gate dataset content.
- If `NEXT_PUBLIC_MARKETPLACE_ADDRESS` is set, the Purchase button performs client-side on-chain calls (Sepolia by default).

## 6) Contributing
We welcome contributions!

- Discuss: open a GitHub Issue to propose features or report bugs.
- Branching: create feature branches from `main`.
- Commits: use clear, descriptive messages (Conventional Commits appreciated).
- PRs: include a summary, screenshots (if UI), and testing notes.
- Code style: follow existing patterns (Next.js App Router, shadcn/ui, Tailwind). Keep pages mobile-first and accessible.
- Security: never commit secrets; use env vars. Data writes must enforce auth and respect RLS.

## 7) License
MIT License. See `LICENSE` (add if not present).

---
Built with Next.js, Supabase, Vercel Blob, shadcn/ui, and optional wagmi + viem for Web3.
