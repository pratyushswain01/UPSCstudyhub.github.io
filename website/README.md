# UPSC Gurukul homepage (website/)

React + TypeScript + Vite + Lucide React. Static output, safe for GitHub Pages / any static host.

## Run on Windows (PowerShell)
```powershell
cd UPSCstudyhub.github.io\website
npm install
npm run dev          # http://localhost:5173
npm run build        # type-checks, then writes website\dist
npm run preview      # serves the production build
npm run check:links  # confirms every route in src\routes.ts exists in the repo root
```
`npm run dev` / `preview` also serve the repo-root pages read-only (../notes.html, ../games/ ...) so every link can be followed locally. That helper lives in `vite.config.ts` and is not part of the build.

## Where things are
- `src/routes.ts` – every internal link (all verified to exist). Edit here to change a destination.
- `src/content.ts` – all copy, FAQ answers, footer links, app-tour slots.
- `src/components/` – Header, Hero, Sections (homepage sections 1-10 + footer), Logo.
- `src/styles.css` – design tokens (top of file) and all styling.

## Adding real app screenshots
Put images in `public/app-tour/` and list them in `appScreens` in `src/content.ts` (src, alt, caption). The placeholder phones disappear automatically.

## Deploying (not done for you)
Build output is `website/dist`. Nothing here commits, pushes or deploys. The page expects to be served at the site root (upscgurukul.online) next to the existing pages; set `VITE_BASE` if it is ever served from a sub-path.
