# UPSC Gurukul Discipline Admin Monitor

This adds a separate admin-only Worker and a dashboard page. It reuses the existing D1 database and independently verifies Firebase ID tokens. The endpoint only accepts the two administrator UIDs configured in the Worker.

## Deploy from repository root (PowerShell)

```powershell
wrangler deploy --config cloudflare/discipline-admin/wrangler.toml
```

Expected health response:
```json
{"ok":true,"service":"gurukul-discipline-admin"}
```

Dashboard:
https://upscgurukul.online/admin/discipline.html

## Important
- The dashboard lists users who have activity or discipline rows in D1. It is not a complete Firebase Auth user directory because this D1 database does not contain all registered Firebase accounts.
- The Worker uses the existing D1 binding name DB and database ID.
- Admin access is checked server-side against the two approved Firebase UIDs. Hiding the page link is not the security control.
- Deploy the Worker before opening the dashboard. GitHub Pages publishes the HTML page after the commit is merged/published.
- The dashboard is read-only: it does not change restrictions or recovery balances.
