/**
 * Trade Licence Solutions — Cloudflare Worker
 * tradelicencesolutions.com.au
 * Built by Maverick Digital
 */

import { pages } from './pages.js';
import { getCSS } from './styles.js';
import { layout } from './layout.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let path = url.pathname.replace(/\/$/, '') || '/';

    // Serve images and other static files from /public
    if (path.startsWith('/images/')) {
      return env.ASSETS.fetch(request);
    }

    // Entry page: state selector and eligibility check (approved design)
    if (request.method === 'GET' && path === '/') {
      return env.ASSETS.fetch(new Request(new URL('/entry.html', request.url), request));
    }

    // Handle readiness check form submission
    if (request.method === 'POST' && path === '/readiness-check') {
      return handleReadinessCheck(request);
    }

    // Route to page
    const page = pages[path] || pages['/404'];
    if (!page) {
      return new Response('Not found', { status: 404 });
    }

    const html = layout(page, getCSS());
    return new Response(html, {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' },
      status: page.status || 200,
    });
  },
};

async function handleReadinessCheck(request) {
  const formData = await request.formData();
  const licenceType = formData.get('licence_type') || '';
  const state = formData.get('state') || '';
  const firstName = formData.get('first_name') || '';

  // Build result page based on answers
  const html = layout(buildReadinessResult(licenceType, state, firstName), getCSS());
  return new Response(html, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8' },
  });
}

function buildReadinessResult(licenceType, state, firstName) {
  const name = firstName ? firstName : 'You';
  let heading = '';
  let body = '';
  let cta = '';

  if (licenceType === 'builder') {
    heading = `${name}, here's what you need for a builder licence`;
    body = `
      <p>A builder licence lets you contract directly with clients and take on jobs valued above the threshold in your state. Here's what's typically required:</p>
      <ul>
        <li>Proof of trade or building qualifications</li>
        <li>Evidence of relevant work experience (usually 2–5 years)</li>
        <li>Financial fitness check</li>
        <li>Insurance (public liability + home warranty where applicable)</li>
        <li>Fit and proper person declaration</li>
      </ul>
      <p>Dan's fee for a builder licence application is <strong>from $2,000</strong> — including all preparation, lodgement and follow-up with the regulator.</p>
      <p><strong>Compare:</strong> The next cheapest specialist charges $3,495 for the same service.</p>
    `;
    cta = 'book';
  } else if (licenceType === 'company') {
    heading = `${name}, here's what a company licence involves`;
    body = `
      <p>A company contractor licence lets your Pty Ltd entity hold the licence — not just an individual. This protects you personally and is essential for growth.</p>
      <ul>
        <li>A qualified supervisor must be nominated (and notified within 7 days if they leave — or your licence is at risk)</li>
        <li>Company must meet financial fitness requirements</li>
        <li>Directors need fit and proper person declarations</li>
        <li>Insurance held in the company name</li>
      </ul>
      <p>Dan's fee for a company licence is <strong>from $550</strong> — faster than a builder licence application.</p>
    `;
    cta = 'book';
  } else if (licenceType === 'mutual-recognition') {
    heading = `${name}, you may qualify for mutual recognition`;
    body = `
      <p>If you hold a licence in one Australian state, you may be able to work in another state without sitting new exams — this is called mutual recognition.</p>
      <ul>
        <li><strong>Automatic Mutual Recognition (AMR)</strong> applies in most states — you notify the regulator rather than apply</li>
        <li>Some states and licence types still require a formal application</li>
        <li>Endorsement is state-specific — Dan handles the paperwork so you don't miss a step</li>
      </ul>
      <p>Dan's fee for mutual recognition is <strong>from $550</strong>.</p>
    `;
    cta = 'book';
  } else {
    heading = `${name}, let's find the right path for you`;
    body = `<p>Book a free 15-minute call with Dan and he'll tell you exactly what you need and how long it will take.</p>`;
    cta = 'book';
  }

  return {
    title: 'Your Readiness Check Result — Trade Licence Solutions',
    description: 'Your personalised licence readiness result.',
    content: `
      <section class="hero hero--result">
        <div class="container">
          <h1>${heading}</h1>
        </div>
      </section>
      <section class="section">
        <div class="container container--narrow">
          ${body}
          <div class="cta-block">
            <a href="/contact" class="btn btn--primary">Book a free call with Dan</a>
            <a href="/readiness-check" class="btn btn--ghost">Start over</a>
          </div>
        </div>
      </section>
    `,
  };
}
