# Axia Kairos Frontend (Cloudflare Pages)

High-performance React 18 + Vite frontend for Axia Kairos, optimized for deployment on **Cloudflare Pages**.

---

## 🚀 Quick Local Development

From this `frontend` directory:

```bash
# Install dependencies
npm install

# Start local dev server (proxies /api to http://localhost:3001)
npm run dev
```

Build production bundle locally:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

---

## ☁️ Deploying to Cloudflare Pages

### Option 1: Git Integration (Recommended)
1. Push your repository to **GitHub** or **GitLab**.
2. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select your repository.
4. Configure the build settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `frontend` (if deploying from a monorepo) or `/` (if the repo root is the frontend).
5. Add Environment Variables:
   - Go to **Settings** > **Environment variables** > **Production**.
   - Add:
     - `VITE_API_URL` = `https://your-backend.up.railway.app` (your Railway backend deployment URL without trailing slash).
6. Click **Save and Deploy**.

### Option 2: Direct Upload (Wrangler CLI)
```bash
# Install Wrangler globally if needed
npm install -g wrangler

# Build the frontend
npm run build

# Deploy dist folder to Cloudflare Pages
wrangler pages deploy dist --project-name=axia-kairos
```

---

## ⚙️ Configuration Files Included
- `public/_redirects`: Contains `/* /index.html 200` to enable React Router SPA client-side routing on any URL (`/services`, `/admin`, `/careers`, etc.) without 404 errors.
- `public/_headers`: Configures immutable long-term caching for hashed JS/CSS assets and webp/fonts, and `no-cache` on `index.html` for instant updates.
- `vite.config.ts`: Configures code-splitting, Gzip & Brotli asset pre-compression, and a local dev proxy to the backend on `http://localhost:3001`.
