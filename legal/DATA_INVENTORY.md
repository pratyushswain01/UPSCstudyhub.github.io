# DATA_INVENTORY.md
# UPSC गुरुकुल — personal data & third parties
# Last updated: 2026-10-19
# Status: DRAFT

## Collection points
| Point | Data | Purpose | Storage |
|-------|------|---------|---------|
| Firebase Auth | email, password (hashed by Firebase), name, Google ID | Account / SSO | Firebase Auth |
| localStorage | theme, font, reading progress, flags | UX / progress | Browser |
| Gurukul Mitra AI | chat messages, short history | AI replies | Cloudflare Worker |
| FCM / push | device token | Notifications | Firebase FCM |
| Forms (contact / data-rights) | name, email, message | Support / rights | Email or Firestore |
| AdSense (if enabled) | cookies / ad IDs | Ads | Google |

## Third parties
- Google Firebase (Auth, FCM, optional Firestore)
- Cloudflare Workers (AI)
- Google Fonts
- Google AdSense (non-essential — consent required)

## Rules
- One Firebase project = one account everywhere (web + app)
- Never store raw passwords yourself
- Do not commit service-account JSON or secrets
