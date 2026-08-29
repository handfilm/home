# HANDS & HEAD — Master OS & Real-Time Sync Ecosystem

Unified Hands & Head and RAWx Master OS workspace featuring modular brand sections, a 16-slider showcase system, live iframe embed portals, dynamic media manager, and multi-device task synchronization.

---

## 🚀 Direct GitHub Pages Deployment (1 Step)

This project includes pre-configured **GitHub Actions** (`.github/workflows/deploy.yml`) for zero-config, direct deployment to GitHub Pages and custom domains (`handsandhead.com`).

### Enable in 3 Clicks on GitHub:
1. Go to your repository on **GitHub.com**
2. Click **Settings** (top navigation bar) $\rightarrow$ **Pages** (left menu)
3. Under **Build and deployment** $\rightarrow$ **Source**, select **GitHub Actions**

> Every `git push` to `main` or `master` will now automatically build and publish directly to `https://handsandhead.com`.

---

## 🛠️ Alternative: Direct One-Line Deploy from Terminal

You can also deploy directly to the `gh-pages` branch with one command:

```bash
npm run deploy
```

*(This runs `npm run build` and publishes the compiled static assets directly to GitHub Pages.)*

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local server (Port 3000)
npm run dev

# Build production bundle
npm run build
```

---

## 📁 Repository Structure
- `.github/workflows/deploy.yml`: GitHub Actions automated CI/CD pipeline
- `public/CNAME`: Custom domain (`handsandhead.com`)
- `public/.nojekyll`: GitHub Pages static asset bypassing
- `public/404.html`: Single-page application route fallback
- `src/`: Complete React 19 + TypeScript + Tailwind CSS application source
- `server.ts`: Express + Server-Sent Events sync backend for multi-device collaboration
