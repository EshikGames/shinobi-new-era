# Early access: Phase 1 audit snapshot

Phase 2 implementation and current setup steps are in [early-access-phase2.md](early-access-phase2.md). Statements below about files not yet existing describe the Phase 1 snapshot.

Audit date: 2026-11-03. Scope: the supplied local checkout at `Downloads/shinobi-new-era-main/shinobi-new-era-main`. This copy has no `.git` metadata, so its relationship to the deployed GitHub/Vercel project cannot be verified here.

## What exists in this checkout

- Next.js 16.2.10 App Router, React 19, Tailwind 4, `framer-motion`. Routes: `/`, `/about`, `/characters`, `/play`, `/download`, `/faq`; now `/early-access`.
- Shared `Navbar`, `Footer`, `app/seo.js`, `robots.ts`, `sitemap.ts`. No `vercel.json`, `.env*`, Supabase client/package, auth route, middleware, session code, SQL migrations, or project tests in this checkout. No environment variable names were found in application code. **This does not establish what exists in the production Vercel project or Supabase account.**
- `/download` links public Mega files. `/play` and `/game/*` expose a web build, including `public/game/game.zip` and `public/game/renpy.data`. Anything in `public/` can be fetched without login. Never place an early build there or behind a page-only check.
- Existing home, download, and FAQ copy contains version/date statements. Their current accuracy needs editorial review before using them as source data for early access. The new page leaves release versions and dates unset in `app/early-access/config.js`.
- No relationship between the game backend/save identities and a future supporter identity is visible. Keep supporter auth in a separate namespace and Supabase schema until the game backend ownership and session model are known. Do not reuse game cookies or interpret a game account email as supporter proof.

## Platform readiness

| Platform | Official login / identity | Tier or active-status verification | Limits / keys | SNE decision |
| --- | --- | --- | --- | --- |
| Patreon | OAuth2 and API v2 `/identity`, with `identity` and `identity.memberships` scopes. | API v2 member `patron_status` and `currently_entitled_tiers`; compare against the **confirmed creator campaign and tier IDs**, and recheck server-side. Signed membership webhooks exist. | Register v2 client; client ID/secret, redirect URI, creator campaign ID, approved tier IDs, webhook secret. PKCE support was not confirmed in the official docs reviewed; require `state` and confidential-server code exchange, add PKCE only after provider validation. v1 is retiring. | Technically supported; not wired until production Supabase, keys, and tier mapping are confirmed. |
| SubscribeStar.adult | Official OAuth2 and read-only GraphQL API provide subscriber identity and subscription scopes. Signed webhooks are documented. | GraphQL subscription/payment state; webhook `subscription_restored` alone is insufficient: official docs advise checking `paidUntil`. | OAuth client ID/secret, redirect URI and approved scopes; webhook secret if enabled. The official `.adult` API usage terms say it must not provide benefits outside the platform, and Terms say the API must not operate or support external software. Individual approval/review may be required. | **Technically possible, policy blocked for SNE off-platform downloads without written platform authorization.** Another site's implementation does not grant SNE permission. For now link to the platform's own supporter posts. |
| Boosty | A public OAuth login and developer contract for third-party supporter verification were **not confirmed** from official documentation reviewed. | No confirmed official tier/status endpoint or signed webhook contract for this use. | None can be specified responsibly yet. | Do not create a guessed OAuth endpoint or claim automatic access. Use official Boosty posts for delivery until a documented agreement/API is provided. |

Sources: [Patreon API v2 and webhooks](https://docs.patreon.com/), [SubscribeStar.adult OAuth/API](https://subscribestar.adult/api), [SubscribeStar.adult webhooks](https://subscribestar.adult/webhooks), [SubscribeStar.adult terms](https://subscribestar.adult/tos), [House of Shinobi reference page](https://www.houseofshinobi.com/early-access). The reference site's SubscribeStar flow establishes an example, not the terms of its private agreement or the correctness of its implementation.

## Proposed server design (approval required before implementation)

1. Inspect the actual production Supabase project ID, existing schema/RLS, auth providers, storage, and game backend with read-only access. Reuse that project. Map a logged-in Supabase `auth.users.id` to supporter identities; no linking by email alone.
2. Add `supporter_accounts` (provider + immutable provider user ID unique, owner user ID, encrypted refresh-token reference), `supporter_entitlements` (provider account, campaign/tier ID, status, verified timestamp, expiry), `early_access_releases` (version, publish/unlock windows, private object key), `download_grants` (user, release, issued/expiry, audit), and `webhook_events` (provider event ID unique, hash/timestamp/processing state). Adapt names and foreign keys to the real schema. Store tokens in server-only encrypted storage.
3. RLS: user may read only their own account and entitlement summaries; client roles may not insert/update/delete entitlements, releases, grants, or webhook records. Only tightly scoped server routines may mutate them. Keep Supabase service-role credentials server-side and out of client bundles.
4. OAuth start/callback: server-generated single-use `state` tied to HttpOnly, Secure, SameSite cookie; strict redirect URI and code exchange; reject missing, mismatched, replayed or expired state and invalid callbacks. Use PKCE only where the provider documents and accepts it. Bind immutable provider ID after a valid response, with explicit conflict handling.
5. On **every** download request, validate server session, linked provider identity, fresh entitlement, release window, and rate limit. Refresh stale statuses via official provider API; fail closed on unknown status. Handle expiry and revocation; a webhook is a trigger to recheck, never standalone proof of current paid entitlement.
6. Verify signed webhooks over the raw body using constant-time comparison and the provider's documented algorithm. Reject stale timestamps where documented, deduplicate in `webhook_events`, and reconcile out-of-order events by fetching current provider state. Audit callback, link, recheck, grant, deny and webhook outcomes without tokens or personal data in logs.
7. Put paid artifacts in a **private** bucket in the existing Supabase project. A server route issues short-lived signed URLs only after authorization. Keep release object keys private, set no-store on grant responses, and do not expose paid files through `public/`, Mega, or game service-worker caches. Signed URLs limit casual sharing but cannot prevent a legitimate recipient from redistributing a downloaded file.
8. Mark account and grant pages `noindex` and return suitable cache headers. `robots.txt` alone is not access control.

No migration SQL or provider auth route was created: the request explicitly reserves migrations and live authorization for a later approval, and the real schema is unavailable.

## Proposed environment variable names (no values)

For a future approved integration, reconcile names with the actual deployment before adding them: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `PATREON_CLIENT_ID`, `PATREON_CLIENT_SECRET`, `PATREON_CREATOR_CAMPAIGN_ID`, `PATREON_WEBHOOK_SECRET`, `EARLY_ACCESS_STORAGE_BUCKET`. Conditional on written SubscribeStar approval: `SUBSCRIBESTAR_CLIENT_ID`, `SUBSCRIBESTAR_CLIENT_SECRET`, `SUBSCRIBESTAR_WEBHOOK_SECRET`. No Boosty secret is proposed without official documentation. Only public Supabase URL/anon key may be exposed to browser code; secret values belong in Vercel encrypted project settings, never `NEXT_PUBLIC_*`, source files, or reports.

## Next actions for the project owner

1. **Supabase:** Open the existing project in the dashboard → Project Settings → General and record its project ID privately. Open Authentication → Providers, Database → Tables/Policies, and Storage → Buckets to identify existing auth/RLS and whether a private bucket exists. Do not run SQL yet. Share schema names or a redacted schema export, not keys.
2. **GitHub:** Open the repository that deploys `shinobinewera.com` → Code and compare its routes/package.json with this local checkout. If this is only an archive, choose the actual repository before merging these files. Check repository secrets only by name; do not paste values.
3. **Vercel:** Open the project for `shinobinewera.com` → Settings → Git to confirm the connected repo and branch, then Settings → Environment Variables to compare **names only**. Do not add credentials or deploy the unfinished auth flow. A preview deployment can be considered after the local UI changes are placed in the real repo.
4. Confirm release versions, dates, eligible Patreon campaign/tier IDs, and the official private build file location. Request written SubscribeStar clarification for off-platform benefits; request Boosty developer documentation or an approved alternative.
5. After those facts are available and approval is given, prepare schema-specific SQL migrations and server routes in a separate reviewed change; test against a nonproduction database before any production migration.
