# UPSC Gurukul Activity Bar — Free Plan

Firebase Authentication stays on Spark. Activity storage and API run on Cloudflare Workers + D1; no Firebase Cloud Functions or Blaze upgrade is needed.

## Behaviour and privacy
- Compact bar appears only for signed-in students.
- The panel shows today's active time, the last seven days and ten recent sessions.
- Worker verifies Firebase ID-token signature, issuer, audience and expiry. UID comes only from the verified token.
- A student can only read or write records under their own UID.
- Only heartbeat gaps between 20 and 60 seconds are credited, capped at 45 seconds. Hidden tabs, idle time and long gaps are not credited.
- These totals estimate active site use; they do not prove focused study.

## Free-tier limits
Cloudflare Free has request and D1 row-read/write quotas. Review current limits before increasing traffic:
- https://developers.cloudflare.com/workers/platform/limits/
- https://developers.cloudflare.com/d1/platform/limits/
- https://developers.cloudflare.com/d1/reference/faq/

## Windows PowerShell deployment
Run from the repository root:

1. Install Wrangler and sign in:
   ```powershell
   npm install -g wrangler
   wrangler login
   ```

2. Create the D1 database:
   ```powershell
   wrangler d1 create upscgurukul-activity
   ```
   Copy the returned database_id into cloudflare/gurukul-activity/wrangler.toml, replacing REPLACE_WITH_D1_DATABASE_ID.

3. Apply the schema:
   ```powershell
   wrangler d1 migrations apply upscgurukul-activity --remote --config cloudflare/gurukul-activity/wrangler.toml
   ```

4. Deploy:
   ```powershell
   wrangler deploy --config cloudflare/gurukul-activity/wrangler.toml
   ```

5. Add custom domain activity.upscgurukul.online in Cloudflare Dashboard → Workers & Pages → upscgurukul-activity-api → Settings → Domains & Routes → Add → Custom Domain. Ensure the upscgurukul.online zone is in this Cloudflare account. If using workers.dev instead, update ACTIVITY_API in assets/gurukul-activity/activity-bar.js before publishing.

6. Test:
   ```powershell
   Invoke-RestMethod "https://activity.upscgurukul.online/health"
   ```
   Expected: ok = True.

7. Merge this branch to main so GitHub Pages publishes the updated client.

## Important
The existing Firebase Functions source is intentionally left untouched but this client no longer calls it. Do not deploy Functions. Keep the D1 binding named DB. Never place a service-account private key in the browser or Worker.
