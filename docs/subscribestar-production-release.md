# SubscribeStar email activation — 2026-11-04

Follow-up to the Boosty release. Owner requested SubscribeStar activation and previously
reported permission from both platforms. No platform OAuth/API is introduced.
Each email must be on the owner-maintained list with the selected provider, active status,
allowed tier and unexpired access. is_test=true remains excluded from normal access.
SubscribeStar tiers remain 149740 / 149741 / 149742; names and benefits are unchanged.

Only the provider allowlist, public form/navigation and tests change. Both providers
require their own enabled database policy and recorded permission basis. QA mode remains
Boosty-only and disabled in Production. Patreon OAuth, sessions, download checks and game
backend are unchanged. There are no new secrets, variables, migrations or releases.

Rollback before this update:
- Commit: f5a9a921fad3e4ae606423b8f346c5f220424e1e
- Ready / Current deployment: 7H2aDo6PsxTdqgtgheYQrBQbwU9b
- URL: https://shinobi-new-kqx05rl9x-eshik-games.vercel.app

Enable only the existing subscribestar policy after action-time confirmation, recording
the owner's reported permission. Do not modify Boosty policy or subscriber records.
Emergency stop for SubscribeStar: disable its provider policy; Boosty and Patreon remain on.
If a code rollback is needed, restore the deployment above, which has fixed Patreon OAuth.

Post-release LIVE checks: anonymous status, unknown email denial for both providers,
invalid provider denial, no-session download denial, logout without a session, main pages,
and Patreon start/status. No successful subscribed user session can be claimed until an
eligible non-test owner-entered record is available. Do not create one automatically.
