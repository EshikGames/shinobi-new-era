'use client';
import { useEffect, useState } from 'react';
import Countdown from './Countdown';
import Icon from '@/components/Icon';
import './manual-access.css';

async function call(action, body) {
  const response = await fetch('/api/early-access/list/' + action, { method: 'POST', cache: 'no-store',
    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await response.json();
  if (!response.ok) throw new Error(({ access_denied: 'Access is not available for this email. Contact Eshik Games through your supporter platform.',
    unauthorized: 'Your access session has expired. Enter your email again.', rate_limited: 'Too many attempts. Please try again later.',
    test_download_disabled: 'Downloads are disabled in this test environment.',
    invalid_email: 'Please enter a valid email address.', release_locked: 'This build has not unlocked yet.', release_not_found: 'No published build is available.' })[data.error] ?? 'Access checking is unavailable. Please try again later.');
  return data;
}
export default function SupporterListAccess({ releases = [] }) {
  const [access, setAccess] = useState({ status: 'loading', enabled: false });
  const [email, setEmail] = useState(''), [notice, setNotice] = useState(''), [busy, setBusy] = useState(false), [clock, setClock] = useState(0);
  const [provider, setProvider] = useState('boosty');
  useEffect(() => { const controller = new AbortController();
    const refresh = () => fetch('/api/early-access/list/status', { cache: 'no-store', signal: controller.signal }).then(async r => {
      if (!r.ok) throw new Error(); const data = await r.json(); if (!controller.signal.aborted) setAccess(data);
    }).catch(() => { if (!controller.signal.aborted) setAccess({ status: 'error', enabled: false }); });
    refresh();
    const timer = setInterval(() => setClock(Date.now()), 1000);
    const statusTimer = setInterval(refresh, 60000);
    return () => { controller.abort(); clearInterval(timer); clearInterval(statusTimer); };
  }, []);
  async function run(task) { setBusy(true); setNotice(''); try { await task(); } catch (error) { setNotice(error.message); } finally { setBusy(false); } }
  return <section className="manual-access" aria-labelledby="manual-access-title">
    <p className="eyebrow">BOOSTY</p><h3 id="manual-access-title">Access with your supporter email</h3>
    <p>Enter the email added to the Eshik Games supporter list. No email code or confirmation link is required.</p>
    <p>Eligible memberships: Resonance Adept, Otsutsuki Chosen and New Era Architect. Access requires an active entry on an enabled platform.</p>
    {access.testMode && <p className="notice" role="status">Boosty test mode. Only test entries can sign in. No downloads or supporter privileges are granted.</p>}
    {access.status === 'loading' && <p role="status">Checking availability…</p>}
    {['active', 'test_active'].includes(access.status) ? <div className="panel manual-session"><h4>{access.testMode ? 'Test session is active' : 'Early Access is available'}</h4><p>Your email matches an active entry. This does not verify who owns the email.</p>
      <dl><dt>Platform</dt><dd>{access.provider === 'boosty' ? 'Boosty' : 'SubscribeStar'}</dd><dt>Membership</dt><dd>{access.tier}</dd>
        <dt>Access until</dt><dd>{access.accessExpiresAt ? new Date(access.accessExpiresAt).toLocaleString() : 'Until manually revoked'}</dd>
        <dt>Session until</dt><dd>{access.sessionExpiresAt ? new Date(access.sessionExpiresAt).toLocaleString() : 'Unavailable'}</dd></dl>
      <button className="button button-secondary" disabled={busy} onClick={() => run(async () => { await call('logout', {}); setAccess({ enabled: true, status: 'unauthorized', testMode: access.testMode }); })}>Logout</button></div>
      : <form className="email-form" onSubmit={e => { e.preventDefault(); run(async () => { const result = await call('start', { email, provider }); setAccess({ enabled: true, ...result }); setEmail(''); }); }}>
        <label>Supporter platform<select value={provider} onChange={e => setProvider(e.target.value)} disabled={busy || !access.enabled}><option value="boosty">Boosty</option></select></label>
        <label>Supporter email<input type="email" required maxLength={254} autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} disabled={busy || !access.enabled} /></label>
        <button className="button button-primary" disabled={busy || !access.enabled}>{busy ? 'Checking…' : 'Continue with Email'}</button>
      </form>}
    {access.status === 'expired' && <p role="status">This email no longer has active access.</p>}
    {access.status !== 'loading' && !access.enabled && <p className="notice">Email access is not available yet. Please use the official supporter pages.</p>}
    {notice && <p role="alert" className="notice">{notice}</p>}
    <p>SubscribeStar email access is not enabled.</p>
    <div className="manual-platforms">{['Windows', 'Android'].map(platform => <article className="panel" key={platform}><h4><Icon name={platform.toLowerCase()} />{platform}</h4><p>{releases.some(r => r.email_access_available && r.platforms.includes(platform)) ? 'Published builds are listed below.' : 'No early build is listed yet.'}</p></article>)}</div>
    <div className="private-release-list">{releases.filter(r => r.email_access_available && !access.testMode).map(r => {
      const locked = !clock || Date.parse(r.early_access_at) > clock;
      return <article className="private-release" key={r.id}><div><h4>{r.version} · {r.platforms.join(', ')}</h4><Countdown unlockAt={r.early_access_at} /></div>
        <button className="button button-primary" disabled={busy || access.status !== 'active' || locked || (clock > 0 && Date.parse(access.sessionExpiresAt) <= clock)} onClick={() => run(async () => {
          const result = await call('download', { releaseId: r.id }); const url = new URL(result.url);
          if (url.origin !== 'https://avdkvtmugeizoqqvayek.supabase.co' || !url.pathname.startsWith('/storage/v1/object/sign/early-access-builds/')) throw new Error('Download verification failed.');
          window.location.assign(url.href);
        })}>{locked ? 'Not unlocked yet' : `Download for ${r.platforms.join(', ')}`}</button></article>;
    })}</div>
  </section>;
}
