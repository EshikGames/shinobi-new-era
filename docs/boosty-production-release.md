# Boosty email-only Production release

Release base: `19954bfb46cb1ab17fdcbb3ae71545f41c7072f1`.
Rollback deployment: `Y2ZR9uzBXYkp2byjyWtPrDJH2EAw` (Ready / Current before release),
https://shinobi-new-hcbbkqru0-eshik-games.vercel.app.
The base includes the fixed Patreon callback commit 301810e.

## Scope

Boosty owner-maintained email list, four `/api/early-access/list/*` routes,
supporter UI, optional release metadata and tests. No OTP or administrative routes.
SubscribeStar is rejected by the server allowlist and remains disabled in the database.
Patreon OAuth, its existing download endpoint and release authorization are byte-for-byte
unchanged from origin/main. Game files and the game Supabase are outside this release.
Earlier OTP/admin prototypes remain only in the working branch.

Production requires `EARLY_ACCESS_LIST_ENABLED=true`, existing server-only Supabase
variables and encryption key, `SITE_URL=https://shinobinewera.com`, and the enabled
Boosty policy with an owner attestation of platform permission. Test flags remain off;
Patreon flag remains on. The application rejects any target other than
`avdkvtmugeizoqqvayek`. No secrets belong in source or client bundles.

Eligibility: owner-entered email, boosty, active, one of the three existing allowed tiers,
and unexpired access (NULL expires_at retains the existing manually revoked access rule).
Test records remain excluded from ordinary access; their flag never bypasses entitlement
checks. A person knowing an eligible email can sign in; the owner explicitly accepts this.
Sessions are separate from Patreon, HttpOnly/Secure/Strict in production, with encrypted
email and hashed random token in the database. Downloads require fresh entitlement,
published/unlocked release, companion 14-day rules and private Storage; URL TTL is 60 seconds.
Rate limiting, final RPC reservation and audit remain mandatory. No files or releases seeded.

## Pre-release verification

- Origin/main fetched again and matches release base.
- 53/53 release tests PASS (includes existing Patreon tests; excludes unrelated OTP prototype tests).
- npm run build PASS; lint changed/new JS files PASS.
- Secret-pattern scan of release files: no findings. Server secret markers absent from 17 client JS/map files.
- Live read-only postcheck: six tables, RLS, deny policies, expected service permissions,
  three INVOKER functions, 28 constraints and three enabled audit triggers.
- Live function bodies match checked-in SQL. Bucket early-access-builds is private;
  the restrictive client-blocking policy is present.
- SQL proposal is a record of the already applied schema, not a deploy script.
  SHA-256 b142b6c8c60d5738b7d0513995caf36638fb26626f7233e6c20bd795f43276ad.
  Do not reapply it; no migration repair/db push.
- Production Patreon status before release: HTTP 401, loginEnabled=true, unauthorized (anonymous request).

The owner declines Preview/additional local LIVE tests. No non-test active subscriber
is available, so successful subscriber login, persistent browser session and authenticated
logout cannot be claimed LIVE PASS at release. New subscribers/test records are not created.
Post-deploy smoke checks must distinguish expected denials from infrastructure errors.

## Rollout / emergency disable

1. Keep Patreon flag/settings unchanged. Set only Production EARLY_ACCESS_LIST_ENABLED=true.
2. Enable only the existing Boosty policy and record the owner's permission attestation;
   do not alter subscriber rows or SubscribeStar policy. This is a configuration update,
   not a schema migration. Both browser changes require the applicable action-time confirmation.
3. Commit only the reviewed manifest, ordinary fast-forward push to main, no force push.
4. Wait for Vercel Ready, verify deployed commit and all main routes, Patreon start/status,
   list status, unknown email denial, SubscribeStar denial, unauthenticated download denial,
   logout without a session and admin/OTP route absence. Do not print OAuth URLs/tokens/cookies.
5. If Boosty runtime fails, set EARLY_ACCESS_LIST_ENABLED=false and redeploy the corrected
   release commit. Verify list status disabled and start/download closed, Patreon still on.
   Disable the Boosty database policy as an immediate server-side stop if necessary.
6. If the whole site is broken, restore the saved Y2ZR9uzBXYkp2byjyWtPrDJH2EAw deployment.
   Never restore the historical broken-callback deployment. Do not change Supabase schema.
7. Positive subscriber LIVE QA remains required when an eligible owner-entered record exists.

No successful file delivery is claimed without an approved real published release.
