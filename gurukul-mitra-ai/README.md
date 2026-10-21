# Gurukul Mitra AI — UPSC Gurukul

A separate, responsive assistant for the UPSC Gurukul website and Android TWA/PWA.
It keeps the existing homepage copy and styles intact; the installer adds only one
script include immediately before `</body>` and creates separate assistant assets.

## Files
- `worker/worker.js` — Cloudflare Worker AI endpoint
- `worker/wrangler.toml` — Workers AI binding and deployment config
- `public/gurukul-mitra.js` — floating chat widget
- `public/gurukul-mitra.css` — desktop/mobile styles
- `install-gurukul-mitra.ps1` — backup-first local install and validation

## Before installation
1. Finish any Git rebase and ensure `git status` does not show unresolved paths.
2. Keep `firebase-key.json` out of Git. If it contains a real service-account key and was exposed, rotate it.
3. Copy this folder's contents into your repo root, or run the installer from this folder and pass `-ProjectRoot`.
4. Deploy the Worker from `worker/`:
   ```powershell
   npx wrangler login
   npx wrangler deploy
   ```
5. Copy the deployed Worker URL (e.g. `https://gurukul-mitra-ai.<your-subdomain>.workers.dev`) and set it in `public/gurukul-mitra.js` as `API_BASE` before installing/pushing.

## Free-plan notes
Workers AI availability and quotas depend on Cloudflare account/model eligibility and can change.
This project does not configure paid fallback or billing. When AI is unavailable or over quota,
the widget shows local fallback responses for supported FAQs.
