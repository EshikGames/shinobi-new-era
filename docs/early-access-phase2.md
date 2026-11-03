# Early Access Phase 2: local implementation and activation guide

This is a reviewable local change only. No SQL was applied, no OAuth credentials were added, and no site was deployed.

## Repository and existing Supabase

- The original folder is an archive without `.git`. The user identified `https://github.com/EshikGames/shinobi-new-era`; read-only Git access confirmed `main` at `96081d70ead6140d0bf2db32d56f2e382b98a92f`. Existing source lines in the archive match the checked GitHub source. A local sparse clone is at `Downloads/shinobi-new-era-main/verified-repo`. There was no push.
- The user identified existing Supabase project ref `aymbbkvxtidyxarcesyo` and confirmed the site has no current sign-in. The implementation requires `SUPABASE_PROJECT_REF` and verifies that `SUPABASE_URL` points to that ref's standard Supabase host. It does not create a project or write to Supabase until someone sets real environment values and enables it.
- Production Vercel → Git connection has not been observed. Confirm it points to this repository and intended branch before any push or deployment.

## Security model

- The official `@supabase/supabase-js` package is used only in server code with the existing project's service-role key. `server-only` guards these imports. `@supabase/ssr` is not needed because there is no Supabase Auth user login to refresh; Patreon is a custom OAuth identity for this isolated supporter area.
- Patreon user ID, never email, is the local supporter principal. An optional `auth_user_id` column exists for a later explicit link to a site account. No automatic match by email. The OAuth callback records the immutable Patreon ID, campaign and tier status from the official v2 identity API.
- Server-generated state is stored as a hash in Supabase, compared with an HttpOnly SameSite cookie, and atomically consumed once. PKCE is omitted because the reviewed Patreon documentation does not confirm it. Tokens are encrypted with AES-256-GCM before DB storage. The browser receives only an opaque 24-hour session cookie, whose hash is stored server-side. Logout revokes it.
- Each status and download request rechecks Patreon live. The download route also checks current session, campaign, `active_patron`, global tier allowlist, release-specific tier allowlist, release unlock timestamp, and a DB-backed rate limit. It signs only an object in the private `early-access-builds` bucket for 60 seconds. Response headers are `no-store` and `noindex`. Any provider/DB error fails closed.
- SubscribeStar remains `pending_approval`; Boosty remains `under_review`. No OAuth endpoint was invented. `webhook_events` is provisioned for future deduplication, but **no webhook endpoint is enabled** in this phase. Live provider checks are used for download revocation.
- The SQL migration enables RLS, removes client grants, adds deny policies to supporter tables, and adds a restrictive `storage.objects` policy so broad existing client policies cannot expose `early-access-builds`. Review the existing Storage policies before applying. The service-role key remains server-only.

## What to click in Supabase (existing project only)

1. In the Supabase dashboard, open project `aymbbkvxtidyxarcesyo`. Under **Project Settings → General**, confirm the project ref; under **Connect** (or **Project Settings → API Keys**) note the Project URL and service-role/secret key privately. Do not paste key values in chat, GitHub or source files.
2. Under **Database → Tables** and **Authentication → Users/Providers**, check for table-name conflicts and existing auth policies. Under **Storage → Buckets/Policies**, inspect any broad `storage.objects` policies.
3. Review [`supabase/migrations/202611030001_early_access.sql`](../supabase/migrations/202611030001_early_access.sql). It creates the five requested tables plus `supporter_oauth_states`, `supporter_sessions`, `early_access_rate_limits`, and `early_access_audit_events`, and a private bucket. **Do not run it in production until separately approved.** Validate it against a disposable/staging database first.
4. After approved migration, verify the bucket's **Public** setting is off and unauthenticated access to an object fails. Upload paid builds only there. Never copy paid artifacts into `public/`, public Mega links, or the web game's cache.
5. Insert a release record only with real `version`, `platform`, `object_path`, `unlock_at`, and confirmed `allowed_tier_ids`; set `is_published` only when appropriate. Then set the confirmed release `id`, `version` and summary in `app/early-access/config.js` so the download button points to that record. There are no invented release rows in this migration.

## What to click in Patreon

1. Sign in as the Eshik Games creator. Open [Patreon Clients & API Keys](https://www.patreon.com/portal/registration/register-clients) and register a **v2** OAuth client. Use the exact callback URL `https://shinobinewera.com/api/auth/patreon/callback` for production (and a separately registered local callback only if needed for testing).
2. Request only `identity` and `identity.memberships`. Keep client ID and client secret in the deployment's encrypted environment settings. Do not use a creator access token as a substitute for a visitor's OAuth login.
3. Determine the Eshik Games campaign ID and the eligible paid tier IDs from the creator account/API. Record IDs, not tier names or email addresses, in `PATREON_CAMPAIGN_ID` and `PATREON_ALLOWED_TIER_IDS`.
4. Test with a real active paid account, inactive/cancelled account, different campaign, wrong tier, denied consent, replayed state, and token refresh in a nonproduction deployment before enabling production sign-in. Patreon API v2 fields/relationships must be verified against the live client response; missing data denies access.

Sources: [Patreon OAuth and API v2](https://docs.patreon.com/), [Supabase server package selection](https://supabase.com/docs/guides/auth/choosing-a-server-package), [Supabase private Storage URLs](https://supabase.com/docs/guides/storage/serving/downloads).

## Vercel and GitHub

1. In Vercel open the project serving `shinobinewera.com` → **Settings → Git**. Confirm `EshikGames/shinobi-new-era` and the production branch. The local branch has not been pushed.
2. After approving the migration and staging checks, open **Settings → Environment Variables** and add the names in `.env.example` with values obtained from the existing project and Patreon. `SUPPORTER_TOKEN_ENCRYPTION_KEY` must be a random 32-byte base64 key generated privately. Keep `EARLY_ACCESS_AUTH_ENABLED=false` until database, bucket, OAuth client, tier IDs and tests are ready.
3. Create a reviewed GitHub PR from the local change only after repository/Vercel ownership is confirmed. Do not publish from this archive. Configure `SITE_URL` per deployment origin so OAuth callback, cookies and origin checks match exactly.

## Environment variable names

`EARLY_ACCESS_AUTH_ENABLED`, `SITE_URL`, `SUPABASE_PROJECT_REF`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPPORTER_TOKEN_ENCRYPTION_KEY`, `PATREON_CLIENT_ID`, `PATREON_CLIENT_SECRET`, `PATREON_CAMPAIGN_ID`, `PATREON_ALLOWED_TIER_IDS`. No `NEXT_PUBLIC_*` secret is used. No SubscribeStar or Boosty key is needed in this phase.

## Limits before activation

- SQL has not run against any Supabase database. The SQL's compatibility with existing production policies is unverified.
- OAuth and download signing cannot be end-to-end tested without real credentials, a nonproduction database, confirmed campaign/tier IDs, and a private test artifact. The local disabled-state endpoints and pure security decisions are tested separately.
- Patreon v2 nested identity include behavior needs a live-client check; if the provider omits campaign/tier relationships, the code denies access.
- A signed URL can be shared during its short lifetime; downloaded files can be redistributed by recipients. This mechanism controls initial issuance, not post-download copying.

## Local checks

With Node.js/npm installed in the project folder: run `npm ci`, then `npm run test`, `npm run build`, and `npx eslint app/api app/early-access lib/early-access tests components/Navbar.jsx app/robots.ts app/sitemap.ts`. The existing full `npm run lint` also scans generated `public/game/renpy.js` and currently reports unrelated errors there.
