/**
 * Anonymous first-party visit tracking (the "Intent" view on the dashboard).
 * Stores pageviews, eligibility tool steps and form starts against a random visitor ID kept in the
 * tls_vid cookie. No name, phone, email, IP address or user agent is stored. Obvious bots are ignored.
 * Tables: visitors, visit_events (migration 0005). Records are kept for 90 days.
 */

const EVENT_TYPES = ['pageview', 'tool_step', 'tool_result', 'form_start'];
const BOT = /bot|crawl|spider|slurp|headless|lighthouse|preview|monitor|uptime|curl|wget|python|go-http|java\/|facebookexternalhit/i;
const VISIT_GAP_MS = 30 * 60 * 1000;
const KEEP_DAYS = 90;
const NOSTORE = { 'Cache-Control': 'no-store' };
const ID_PATTERN = /^[A-Za-z0-9-]{8,64}$/;

// Reads the visitor ID cookie (set by public/intent.js). Returns null when missing or malformed.
export function readVisitorId(request) {
  const header = request.headers.get('Cookie') || '';
  const part = header.split(';').map((c) => c.trim()).find((c) => c.startsWith('tls_vid='));
  if (!part) return null;
  const v = part.slice('tls_vid='.length);
  return ID_PATTERN.test(v) ? v : null;
}

// Receives events from public/intent.js. Always answers 204 so the visitor's page is never affected.
export async function handleTrack(request, env, ctx) {
  const done = () => new Response(null, { status: 204, headers: NOSTORE });
  if (!env.DB) return done();
  const ua = request.headers.get('User-Agent') || '';
  if (!ua || BOT.test(ua)) return done();

  let body;
  try {
    const text = await request.text();
    if (text.length > 2000) return done();
    body = JSON.parse(text);
  } catch (err) {
    return done();
  }

  const type = EVENT_TYPES.includes(body.t) ? body.t : null;
  const vid = typeof body.v === 'string' && ID_PATTERN.test(body.v) ? body.v : null;
  if (!type || !vid) return done();

  const path = clean(body.p, 200) || '/';
  const detail = cleanDetail(body.d);
  const detailJson = Object.keys(detail).length ? JSON.stringify(detail) : null;
  const source = type === 'pageview' ? sourceFrom(body) : null;
  const now = new Date();
  const nowIso = now.toISOString();
  const cutoff = new Date(now.getTime() - VISIT_GAP_MS).toISOString();

  try {
    // One visitor row per anonymous ID. A new visit is counted after 30 minutes away.
    await env.DB.prepare(
      `INSERT INTO visitors (id, first_seen, last_seen, visits, first_source, last_source)
       VALUES (?, ?, ?, 1, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         visits = visits + CASE WHEN last_seen < ? THEN 1 ELSE 0 END,
         last_seen = ?,
         last_source = COALESCE(?, last_source)`
    ).bind(vid, nowIso, nowIso, source, source, cutoff, nowIso, source).run();

    await env.DB.prepare(
      'INSERT INTO visit_events (visitor_id, created_at, type, path, detail) VALUES (?, ?, ?, ?, ?)'
    ).bind(vid, nowIso, type, path, detailJson).run();

    // Light housekeeping: about 1 in 50 events clears records older than 90 days
    if (Math.random() < 0.02) {
      const old = new Date(now.getTime() - KEEP_DAYS * 86400000).toISOString();
      const prune = env.DB.batch([
        env.DB.prepare('DELETE FROM visit_events WHERE created_at < ?').bind(old),
        env.DB.prepare('DELETE FROM visitors WHERE last_seen < ?').bind(old),
      ]);
      if (ctx && ctx.waitUntil) ctx.waitUntil(prune.catch(() => {})); else await prune.catch(() => {});
    }
  } catch (err) {
    console.error('visit tracking skipped', err);
  }
  return done();
}

// Where the visit came from, in plain words for Dan. Internal moves return null so the first source is kept.
function sourceFrom(body) {
  const q = body.q && typeof body.q === 'object' ? body.q : {};
  const medium = clean(q.utm_medium, 40).toLowerCase();
  const utmSource = clean(q.utm_source, 60).toLowerCase();
  let host = '';
  try { host = new URL(clean(body.r, 300)).hostname.replace(/^www\./, ''); } catch (err) { /* no referrer */ }
  const paid = /^(cpc|ppc|paid)$/.test(medium);
  if (q.gclid || (paid && /google/.test(utmSource))) return 'Google Ads';
  if (paid) return 'Paid ad';
  if (utmSource) return utmSource.slice(0, 40);
  if (!host) return 'Direct';
  if (host === 'tradelicencesolutions.com.au' || host.endsWith('.tradelicencesolutions.com.au')) return null;
  if (/(^|\.)google\./.test(host)) return 'Google';
  if (/bing\./.test(host)) return 'Bing';
  if (/duckduckgo|yahoo|yandex|ecosia|brave/.test(host)) return 'Other search';
  return host.slice(0, 40);
}

function clean(v, max) {
  return typeof v === 'string' ? v.slice(0, max) : '';
}

function cleanDetail(d) {
  const out = {};
  if (!d || typeof d !== 'object') return out;
  for (const k of ['step', 'licence', 'state', 'result']) {
    if (typeof d[k] === 'string' && d[k]) out[k] = d[k].slice(0, 40);
  }
  return out;
}

// Journey columns added to each enquiry row on the dashboard. Uses the alias e for the enquiries table.
export const JOURNEY_SQL = `,
  (SELECT v.visits FROM visitors v WHERE v.id = e.visitor_id) AS journey_visits,
  (SELECT v.first_source FROM visitors v WHERE v.id = e.visitor_id) AS journey_source,
  (SELECT COUNT(*) FROM visit_events ve WHERE ve.visitor_id = e.visitor_id AND ve.type = 'pageview') AS journey_pages,
  (SELECT COUNT(*) FROM visit_events ve WHERE ve.visitor_id = e.visitor_id AND ve.type = 'tool_step') AS journey_tool`;

// Intent summary for the last 30 days, shown on the dashboard's Intent tab.
export async function intentSummary(env) {
  const since = new Date(Date.now() - 30 * 86400000).toISOString();
  const [visitors, sources, pages, tool, licences, form, enquiries, notSubmitted] = await env.DB.batch([
    env.DB.prepare('SELECT COUNT(*) AS n, COALESCE(SUM(CASE WHEN visits >= 2 THEN 1 ELSE 0 END), 0) AS returning FROM visitors WHERE last_seen >= ?').bind(since),
    env.DB.prepare("SELECT COALESCE(first_source, 'Direct') AS label, COUNT(*) AS n FROM visitors WHERE last_seen >= ? GROUP BY label ORDER BY n DESC LIMIT 8").bind(since),
    env.DB.prepare("SELECT path, COUNT(*) AS views FROM visit_events WHERE type = 'pageview' AND created_at >= ? GROUP BY path ORDER BY views DESC LIMIT 10").bind(since),
    env.DB.prepare("SELECT COUNT(DISTINCT CASE WHEN type = 'tool_step' THEN visitor_id END) AS started, COUNT(DISTINCT CASE WHEN type = 'tool_result' THEN visitor_id END) AS completed FROM visit_events WHERE type IN ('tool_step', 'tool_result') AND created_at >= ?").bind(since),
    env.DB.prepare("SELECT COALESCE(json_extract(detail, '$.licence'), 'Unknown') AS licence, COUNT(*) AS n FROM visit_events WHERE type = 'tool_result' AND created_at >= ? GROUP BY licence ORDER BY n DESC").bind(since),
    env.DB.prepare("SELECT COUNT(DISTINCT visitor_id) AS n FROM visit_events WHERE type = 'form_start' AND created_at >= ?").bind(since),
    env.DB.prepare('SELECT COUNT(*) AS n FROM enquiries WHERE created_at >= ?').bind(since),
    env.DB.prepare("SELECT COUNT(DISTINCT visitor_id) AS n FROM visit_events WHERE type = 'form_start' AND created_at >= ? AND visitor_id NOT IN (SELECT visitor_id FROM enquiries WHERE visitor_id IS NOT NULL)").bind(since),
  ]);
  return {
    days: 30,
    visitors: visitors.results[0].n,
    returning: visitors.results[0].returning,
    sources: sources.results,
    pages: pages.results,
    tool: { started: tool.results[0].started, completed: tool.results[0].completed },
    licences: licences.results,
    form: { started: form.results[0].n, submitted: enquiries.results[0].n, not_submitted: notSubmitted.results[0].n },
  };
}
