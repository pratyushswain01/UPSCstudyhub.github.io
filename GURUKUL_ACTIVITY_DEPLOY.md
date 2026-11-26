# UPSC Gurukul Activity Bar

The authenticated activity bar is included on the student-facing pages updated in this feature branch.

## What it does

- Shows a compact activity strip above the page content.
- Opens a private glass-style activity panel with today's active time, the previous seven days, and recent sessions.
- Uses the Firebase Authentication UID for all activity records. A student can only request their own summary.
- Records activity through the `gurukulActivity` callable Cloud Function in `asia-south1`.
- Sends a heartbeat every 30 seconds. The server credits only heartbeat gaps from 20 through 60 seconds, capped at 45 seconds. Long gaps, idle time, and hidden tabs are not credited.
- Does not read or expose another student's activity.

## Firestore collections

The callable function uses the Admin SDK and writes:
- `gurukulActivitySessions` — session lifecycle and credited seconds.
- `gurukulActivityDaily` — per-user, per-India-date totals.
- `gurukulActivityProfiles` — the user's recent-session list.

These are server-side records. The browser does not directly read or write these collections.

## Deploy (PowerShell)

Run from the repository root after checking out this branch:

```powershell
firebase login
firebase use upscstudyhub-github
npm --prefix functions install
firebase deploy --only functions:gurukulActivity
```

The Firebase project must have Cloud Functions enabled and be on the Blaze billing plan. Review the billing and quotas in Firebase before deployment. The root `firebase.json` in this branch configures the existing `functions` directory for Node.js 24.

## Verify

1. Open a student page while signed in.
2. Confirm the slim activity strip appears above the page banner.
3. Keep the tab visible and interact with it for at least 30–60 seconds.
4. Open **View activity** and confirm today's time and a recent session appear.
5. Open a second signed-in account and confirm its activity panel shows only that account's records.

## Notes

- The feature branch is not live until it is merged/deployed to the hosting branch.
- Deploy the callable function before testing activity persistence. Until then, the bar can load but server summaries and recording will report unavailable.
- Anonymous visitors and signed-out users do not get an activity bar.
- The timer is an activity estimate, not proof of focused study or exam preparation.
