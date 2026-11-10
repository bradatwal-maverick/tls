/**
 * Google Analytics (GA4) summary for the enquiry dashboard.
 * Reads the GA4 Data API with a read-only Google service account (Viewer on the GA4 property).
 * Worker settings (set once per client, no code changes needed):
 *   GA4_PROPERTY_ID      (Text)   the numeric property ID, e.g. 123456789 (not the G- measurement ID)
 *   GA_CLIENT_ID         (Text)   OAuth client ID for the sign-in app (preferred)
 *   GA_CLIENT_SECRET     (Secret) OAuth client secret for the sign-in app
 *   GA_REFRESH_TOKEN     (Secret) long-lived token from a one-time sign-in with analytics.readonly
 *   GA4_SERVICE_ACCOUNT  (Secret) alternative: the full JSON key file for a service account
 * Results are cached for one hour. Enquiry counts come straight from D1 so they are always current.
 */

const CACHE_SECONDS = 3600;
const SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';

export async function ga4Summary(env) {
  if (!env.GA4_PROPERTY_ID || !(env.GA_REFRESH_TOKEN || env.GA4_SERVICE_ACCOUNT)) return { configured: false };

  const cache = caches.default;
  const key = new Request('https://ga4-cache.internal/' + encodeURIComponent(env.GA4_PROPERTY_ID) + '/v1');
  let site = null;
  const hit = await cache.match(key);
  if (hit) {
    site = await hit.json();
  } else {
    try {
      site = await fetchSite(env);
      await cache.put(key, new Response(JSON.stringify(site), { headers: { 'Cache-Control': 'public, max-age=' + CACHE_SECONDS } }));
    } catch (err) {
      return { configured: true, error: true };
    }
  }

  // Enquiries per period, live from D1
  const periods = {};
  for (const days of [7, 30]) {
    const g = site.periods[String(days)];
    const row = await env.DB.prepare("SELECT COUNT(*) AS n FROM enquiries WHERE date(created_at) >= date('now', ?)")
      .bind('-' + days + ' days').first();
    const enquiries = Number(row?.n || 0);
    const visitors = g.visitors;
    periods[String(days)] = {
      ...g,
      enquiries,
      conversion_pct: visitors ? Math.round((enquiries / visitors) * 1000) / 10 : 0,
    };
  }
  return { configured: true, updated_at: site.updated_at, cached: !!hit, periods };
}

async function fetchSite(env) {
  const token = await accessToken(env);
  const reqFor = (days, body) => ({ dateRanges: [{ startDate: days + 'daysAgo', endDate: 'today' }], ...body });
  const days = [7, 30];
  const requests = [
    ...days.map((d) => reqFor(d, { metrics: [{ name: 'activeUsers' }, { name: 'sessions' }, { name: 'screenPageViews' }] })),
    ...days.map((d) => reqFor(d, {
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 5,
    })),
    ...days.map((d) => reqFor(d, {
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 15,
    })),
  ];
  const url = 'https://analyticsdata.googleapis.com/v1beta/properties/' + encodeURIComponent(env.GA4_PROPERTY_ID) + ':batchRunReports';
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ requests }),
  });
  if (!res.ok) throw new Error('GA4 ' + res.status);
  const reports = (await res.json()).reports || [];

  const out = { updated_at: new Date().toISOString(), periods: {} };
  days.forEach((d, i) => {
    const totals = reports[i]?.rows?.[0]?.metricValues || [];
    const pages = reports[2 + i]?.rows || [];
    const channels = reports[4 + i]?.rows || [];
    const sessionsBy = { google_ads: 0, organic: 0, direct: 0, other: 0 };
    let sessionTotal = 0;
    for (const r of channels) {
      const name = r.dimensionValues[0].value;
      const n = Number(r.metricValues[0].value || 0);
      sessionTotal += n;
      if (name === 'Paid Search') sessionsBy.google_ads += n;
      else if (name === 'Organic Search') sessionsBy.organic += n;
      else if (name === 'Direct') sessionsBy.direct += n;
      else sessionsBy.other += n;
    }
    const share = (n) => (sessionTotal ? Math.round((n / sessionTotal) * 1000) / 10 : 0);
    out.periods[String(d)] = {
      visitors: Number(totals[0]?.value || 0),
      sessions: Number(totals[1]?.value || 0),
      page_views: Number(totals[2]?.value || 0),
      top_pages: pages.map((r) => ({ path: r.dimensionValues[0].value, views: Number(r.metricValues[0].value || 0) })),
      sources: {
        google_ads: share(sessionsBy.google_ads),
        organic: share(sessionsBy.organic),
        direct: share(sessionsBy.direct),
        other: share(sessionsBy.other),
      },
    };
  });
  return out;
}

// Short-lived access token. Uses the sign-in refresh token when set, otherwise the service account key.
async function accessToken(env) {
  if (env.GA_REFRESH_TOKEN) {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: env.GA_CLIENT_ID,
        client_secret: env.GA_CLIENT_SECRET,
        refresh_token: env.GA_REFRESH_TOKEN,
        grant_type: 'refresh_token',
      }),
    });
    if (!res.ok) throw new Error('token ' + res.status);
    return (await res.json()).access_token;
  }
  return serviceAccountToken(env);
}

// Exchange a signed JWT for a short-lived access token (service account flow)
async function serviceAccountToken(env) {
  const sa = JSON.parse(env.GA4_SERVICE_ACCOUNT);
  const now = Math.floor(Date.now() / 1000);
  const input = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' })) + '.' + b64url(JSON.stringify({
    iss: sa.client_email,
    scope: SCOPE,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }));
  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToBytes(sa.private_key),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(input));
  const jwt = input + '.' + bytesToB64url(new Uint8Array(sig));
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
  });
  if (!res.ok) throw new Error('token ' + res.status);
  return (await res.json()).access_token;
}

function pemToBytes(pem) {
  const b64 = pem.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

function bytesToB64url(bytes) {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64url(str) {
  return bytesToB64url(new TextEncoder().encode(str));
}
