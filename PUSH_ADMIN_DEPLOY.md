# UPSC Gurukul Push Admin Worker

## Free-tier architecture
- Firebase Cloud Messaging HTTP v1 sends web push messages without a per-message fee.
- Cloudflare Worker runs the admin API. Free-plan quotas and Firebase/Google project quotas apply.
- Only the two existing admin Firebase UIDs are authorised.

## Deploy
From repository root:
```powershell
wrangler secret put FIREBASE_SERVICE_ACCOUNT_JSON --config cloudflare/push-admin/wrangler.toml
wrangler deploy --config cloudflare/push-admin/wrangler.toml
```
When prompted, paste the complete JSON contents of a Firebase service-account private key JSON for project `upscstudyhub-github`. Keep it private; never commit it.

Enable the Firebase Cloud Messaging API and Cloud Firestore API in the Google Cloud project. The service account needs permission to create FCM messages and read the Firestore `notificationDevices` collection.

Dashboard: `https://upscgurukul.online/admin/index.html`
Health: `https://upscgurukul-push-admin.<your-workers-subdomain>.workers.dev/health`

## Registration
The current site registration writes FCM tokens to Firestore `notificationDevices` and marks opted-in fields. The Worker broadcasts only to documents with `notificationsEnabled=true`, `optedIn=true`, and `enabled=true`.

## Important
FCM API success means accepted by FCM, not guaranteed displayed/read. Browser notification permission, supported browser/device, service worker registration and valid FCM token are required. iOS web push requires an installed Home Screen web app on supported iOS versions. Invalid tokens are counted but this first version does not delete them automatically.
