# Devvyy Badge Editor

Live badge customizer site — deploy to GitHub Pages.

## Setup locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to GitHub Pages

1. Push this repo to GitHub
2. Go to **Settings → Pages → Source** → select **GitHub Actions**
3. Every push to `main` triggers an automatic build & deploy

The workflow (`.github/workflows/deploy.yml`) handles everything:
- Installs dependencies
- Runs `next build` (static export to `./out`)
- Deploys the `out/` directory to GitHub Pages

## Rebuild the badge widget

Requires Python 3 with a `FavIcon.png` in the project root or `download/devvyy-badge/`:

```bash
python scripts/build-badge-v2.py
```

This regenerates `public/devvyy-badge.js` with the embedded favicon.