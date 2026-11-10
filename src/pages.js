export const pages = {

  // ===== COMPANY LICENCE =====
  '/company-licence': {
    title: 'Company Contractor Licence — NSW & QLD from $550 | Trade Licence Solutions',
    description: 'Your Pty Ltd company must hold its own contractor licence. Dan Pleaner gets company licences approved in NSW and QLD from $550 — fast, compliant, done right.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Company contractor licence application',
      serviceType: 'Company contractor licence application',
      description: 'Preparation and lodgement of company (Pty Ltd) contractor licence applications in NSW and QLD, including supervisor nomination and compliance advice.',
      provider: { '@type': 'ProfessionalService', name: 'Trade Licence Solutions', telephone: '+61412767129', url: 'https://tradelicencesolutions.com.au' },
      areaServed: { '@type': 'Country', name: 'Australia' },
      offers: { '@type': 'Offer', price: '550', priceCurrency: 'AUD', description: 'Company contractor licence — from $550' },
    },
    content: `
      <section class="hero hero--inner">
        <div class="container">
          <p class="breadcrumb">Services</p>
          <h1>Company contractor licence</h1>
          <p style="color:rgba(255,255,255,0.85);max-width:580px;margin-top:0.5rem;">Operating without a mandatory company licence is a serious risk. Dan fixes that.</p>
        </div>
      </section>

      <section class="section">
        <div class="container container--narrow">
          <div class="quick-answer">
            <p><strong>In short:</strong> If your Pty Ltd company contracts, sub-contracts or advertises residential building work worth more than $5,000 (incl GST), the company itself must hold a contractor licence — a director's personal licence is not enough. Dan prepares and lodges company contractor licence applications in NSW and QLD <strong>from $550</strong> and follows up with the regulator until it's issued.</p>
          </div>

          <div class="alert-box">
            <strong>Important:</strong> Operating without a company contractor licence carries serious fines in NSW. This is not a technicality — it is actively enforced by NSW Fair Trading and the QBCC.
          </div>

          <h2>The issue catching building businesses off guard</h2>
          <p>Here's the scenario Dan sees regularly — and it affects businesses that have been operating for years.</p>
          <p>A licensed builder sets up a company to run their building operations. Their individual contractor licence is current and valid. They're experienced, qualified, and doing good work. But the company itself — the entity entering contracts with clients, signing quotes, and advertising building services — doesn't hold its own contractor licence.</p>
          <p>In NSW, this is a direct breach of the <em>Home Building Act 1989</em>. In Queensland, it's a breach of QBCC licensing requirements.</p>
          <p><strong>The rule is clear:</strong> Your company or partnership must hold a contractor licence before it can contract, sub-contract or advertise to do residential building work where the reasonable market cost of labour and materials is more than $5,000 (including GST).</p>

          <h2 style="margin-top:2rem;">The 7-day supervisor risk</h2>
          <p>Company licences require a nominated qualified supervisor. If that supervisor leaves your business, you have just 7 days to notify the regulator and nominate a replacement — or your company licence is at risk. Most business owners don't know this rule exists until it's too late. Dan makes sure you do.</p>

          <h2 style="margin-top:2rem;">What Dan does for you</h2>
          <ul>
            <li>Confirms whether your company needs a licence (and in which states)</li>
            <li>Prepares all documentation and forms</li>
            <li>Lodges your application with the right regulator</li>
            <li>Follows up until your licence is issued</li>
            <li>Advises on supervisor nomination and ongoing compliance</li>
          </ul>

          <div class="pricing-grid" style="margin-top:2rem;">
            <div class="pricing-card pricing-card--featured">
              <div class="pricing-card__header">
                <h3>Company licence</h3>
                <div class="pricing-card__price">From $550</div>
              </div>
              <div class="pricing-card__body">
                <ul class="pricing-card__features">
                  <li>Eligibility check</li>
                  <li>Full document preparation</li>
                  <li>Application lodgement</li>
                  <li>Regulator follow-up</li>
                  <li>Supervisor compliance advice</li>
                </ul>
                <a href="/contact" class="btn btn--primary" style="width:100%;display:block;text-align:center;">Book a Callback</a>
              </div>
            </div>
          </div>

          <div class="cta-block" style="margin-top:2.5rem;">
            <a href="/contact" class="btn btn--primary">Book a Callback online</a>
          </div>

          <h2 style="margin-top:2.5rem;">Company licence FAQs</h2>
          <div class="faq-list">
            <details>
              <summary>Does my company need its own licence if I already hold a personal contractor licence?</summary>
              <div class="faq-answer"><p>Yes, in most cases. In NSW, if your company contracts for residential building work valued over $5,000 (incl GST), the company must hold its own contractor licence — a director's personal licence does not cover the company. Queensland has the same principle under QBCC rules. A free 15-minute call will confirm exactly where your company stands.</p></div>
            </details>
            <details>
              <summary>How much does a company contractor licence cost?</summary>
              <div class="faq-answer"><p>Dan's fee starts from $550, including the eligibility check, full document preparation, lodgement with the regulator and follow-up until the licence is issued. Government lodgement fees are separate and vary by state.</p></div>
            </details>
            <details>
              <summary>What happens if my nominated supervisor leaves?</summary>
              <div class="faq-answer"><p>A company licence needs a nominated qualified supervisor at all times. If they leave, you generally have just 7 days to notify the regulator and nominate a replacement, or the company licence is at risk. Dan advises you on supervisor nomination so this does not catch you out.</p></div>
            </details>
            <details>
              <summary>Which states does Dan handle company licences in?</summary>
              <div class="faq-answer"><p>Dan prepares company contractor licence applications across all 8 Australian states and territories. Most company-licence work is in NSW (NSW Fair Trading) and Queensland (QBCC), where the requirement is most strictly enforced.</p></div>
            </details>
          </div>
        </div>
      </section>
    `,
  },

  // ===== MUTUAL RECOGNITION =====
  '/mutual-recognition': {
    title: 'Mutual Recognition — Work in Any Australian State from $550 | Trade Licence Solutions',
    description: 'Already licensed in one state? Dan Pleaner maps your licence across to any other state through mutual recognition. From $550. All states covered.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Mutual recognition — interstate licence transfer',
      serviceType: 'Mutual recognition licence application',
      description: 'Transferring a trade or builder licence from one Australian state to another through Automatic Mutual Recognition (AMR) or standard mutual recognition.',
      provider: { '@type': 'ProfessionalService', name: 'Trade Licence Solutions', telephone: '+61412767129', url: 'https://tradelicencesolutions.com.au' },
      areaServed: { '@type': 'Country', name: 'Australia' },
      offers: { '@type': 'Offer', price: '550', priceCurrency: 'AUD', description: 'Mutual recognition — from $550 per state' },
    },
    content: `
      <section class="hero hero--inner">
        <div class="container">
          <p class="breadcrumb">Services</p>
          <h1>Mutual recognition — work in any state</h1>
          <p style="color:rgba(255,255,255,0.85);max-width:580px;margin-top:0.5rem;">If you hold a licence in one Australian state, you may be able to work in other states without sitting new exams. Dan handles the paperwork.</p>
        </div>
      </section>

      <section class="section">
        <div class="container container--narrow">
          <div class="quick-answer">
            <p><strong>In short:</strong> If you already hold a trade or builder licence in one Australian state, mutual recognition lets you work in another state without sitting new exams. Under <strong>Automatic Mutual Recognition (AMR)</strong> you notify the regulator rather than re-apply; some states and licence types still need a formal application. Dan confirms which path applies and handles the paperwork <strong>from $550 per state</strong>.</p>
          </div>

          <h2>Two types of mutual recognition</h2>

          <h3 style="margin-top:1.5rem;">Automatic Mutual Recognition (AMR)</h3>
          <p>Under AMR, most licensed builders and trade contractors can notify the regulator in another state and start working there immediately — without a new application. This applies in most states for most licence types. Dan confirms whether AMR applies to your situation and handles the notification.</p>

          <h3 style="margin-top:1.5rem;">Standard Mutual Recognition</h3>
          <p>Some states and licence types still require a formal application. Dan maps your existing licence and experience across to meet the requirements of the new state, prepares your application, and follows up with the regulator.</p>

          <h2 style="margin-top:2rem;">Which states recognise each other?</h2>
          <p>All Australian states and territories participate in mutual recognition. However, the process and requirements differ significantly between states. Some states require endorsement, some require a notification, and some have specific carve-outs. Dan tells you exactly what applies in your situation.</p>

          <div class="state-grid" style="margin-top:1.5rem;">
            <a href="/australian-capital-territory" class="state-tile"><span class="state-tile__name">ACT</span><span class="state-tile__detail">Access Canberra</span></a>
            <a href="/new-south-wales" class="state-tile"><span class="state-tile__name">NSW</span><span class="state-tile__detail">NSW Fair Trading</span></a>
            <a href="/northern-territory" class="state-tile"><span class="state-tile__name">NT</span><span class="state-tile__detail">NT Building Practitioners Board</span></a>
            <a href="/queensland" class="state-tile"><span class="state-tile__name">QLD</span><span class="state-tile__detail">QBCC</span></a>
            <a href="/south-australia" class="state-tile"><span class="state-tile__name">SA</span><span class="state-tile__detail">CBS</span></a>
            <a href="/tasmania" class="state-tile"><span class="state-tile__name">TAS</span><span class="state-tile__detail">CBOS</span></a>
            <a href="/victoria" class="state-tile"><span class="state-tile__name">VIC</span><span class="state-tile__detail">Building Commission VIC</span></a>
            <a href="/western-australia" class="state-tile"><span class="state-tile__name">WA</span><span class="state-tile__detail">Building and Energy</span></a>
          </div>

          <h2 style="margin-top:2rem;">What Dan does for you</h2>
          <ul>
            <li>Confirms whether AMR or standard MR applies in your situation</li>
            <li>Checks your existing licence against the requirements of the target state</li>
            <li>Identifies any gap training or additional documentation needed</li>
            <li>Prepares and lodges your application or notification</li>
            <li>Follows up with the regulator until you're licensed and working</li>
          </ul>

          <div class="compare-bar">
            <strong>From $550 per state</strong> — including everything. Book a free 15-minute call to find out exactly which path applies to you.
          </div>

          <div class="cta-block">
            <a href="/contact" class="btn btn--primary">Book a Callback</a>
          </div>

          <h2 style="margin-top:2.5rem;">Mutual recognition FAQs</h2>
          <div class="faq-list">
            <details>
              <summary>What is Automatic Mutual Recognition (AMR)?</summary>
              <div class="faq-answer"><p>AMR lets most licensed builders and trade contractors notify the regulator in another state and start working there, without a fresh application. It applies in most states for most licence types. Dan confirms whether AMR covers your licence and handles the notification.</p></div>
            </details>
            <details>
              <summary>Do I need to sit exams again to work in another state?</summary>
              <div class="faq-answer"><p>Usually not. Mutual recognition is designed so you don't repeat training or exams you've already passed. Dan maps your existing licence and experience across to the new state's requirements and flags any gap before you apply.</p></div>
            </details>
            <details>
              <summary>How much does mutual recognition cost?</summary>
              <div class="faq-answer"><p>From $550 per state, including the eligibility check, document preparation, lodgement or notification, and follow-up with the regulator. Government fees are separate and vary by state.</p></div>
            </details>
            <details>
              <summary>Which states take part in mutual recognition?</summary>
              <div class="faq-answer"><p>All 8 Australian states and territories participate, but the process differs between them — some need a notification, some a formal application, some an endorsement. Dan tells you exactly what applies for your licence and your target state.</p></div>
            </details>
          </div>
        </div>
      </section>
    `,
  },

  // ===== BUILDER LICENCE =====
  '/builder-licence': {
    title: 'Builder Licence Application Help — All States from $2,000 | Trade Licence Solutions',
    description: 'Get your builder licence approved the first time. Dan Pleaner handles your NSW Fair Trading or QBCC application from $2,000.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Builder licence application',
      serviceType: 'Builder licence application',
      description: 'Preparation and lodgement of individual builder licence applications with NSW Fair Trading, QBCC and other state regulators, including referee and experience documentation.',
      provider: { '@type': 'ProfessionalService', name: 'Trade Licence Solutions', telephone: '+61412767129', url: 'https://tradelicencesolutions.com.au' },
      areaServed: { '@type': 'Country', name: 'Australia' },
      offers: { '@type': 'Offer', price: '2000', priceCurrency: 'AUD', description: 'Builder licence application — from $2,000' },
    },
    content: `
      <section class="hero hero--inner">
        <div class="container">
          <p class="breadcrumb">Services</p>
          <h1>Builder licence application</h1>
          <p style="color:rgba(255,255,255,0.85);max-width:580px;margin-top:0.5rem;">A builder licence lets you contract directly with clients, run your own sites, and build your own business. Dan makes the application process straightforward.</p>
        </div>
      </section>

      <section class="section">
        <div class="container container--narrow">
          <div class="quick-answer">
            <p><strong>In short:</strong> A builder licence lets you contract directly with clients, run your own sites and legally quote for residential work over $5,000. Most applications that stall fail on experience documentation or referees — not qualifications. Dan prepares and lodges your NSW Fair Trading, QBCC or other state application <strong>from $2,000</strong>, built to be approved the first time.</p>
          </div>

          <h2>What a builder licence lets you do</h2>
          <ul>
            <li>Contract, manage and supervise residential building work in your own name or under your company</li>
            <li>Take on new home builds, renovations and extensions</li>
            <li>Legally advertise and quote for work valued over $5,000</li>
            <li>Supervise subcontractors at every stage of construction</li>
          </ul>

          <h2 style="margin-top:2rem;">Why applications fail (and how Dan prevents it)</h2>
          <p>Most builder licence applications that fail or get delayed have nothing to do with qualifications. Here's what actually causes problems:</p>

          <div style="margin:1.5rem 0;">
            <div class="alert-box">
              <strong>Incomplete experience documentation.</strong> The regulator requires detailed referee statements covering a wide range of building work stages. Generic or vague statements are the number one cause of delays — adding weeks to your timeline.
            </div>
            <div class="alert-box" style="margin-top:1rem;">
              <strong>Referees who aren't properly licensed.</strong> Your referee must hold a current contractor licence in general building work. A referee whose licence lapsed — or who wasn't licensed during the period they supervised you — can invalidate your entire application.
            </div>
            <div class="alert-box" style="margin-top:1rem;">
              <strong>Qualifications that don't tick the right boxes.</strong> Regulators are specific about which qualifications satisfy which requirements. Dan checks this before you apply.
            </div>
          </div>

          <div class="compare-bar">
            <strong>Price check:</strong> Builder licences start from $2,000, including document preparation and regulator follow-up.
          </div>

          <div class="cta-block" style="margin-top:2rem;">
            <a href="/contact" class="btn btn--primary">Book a Callback</a>
          </div>

          <h2 style="margin-top:2.5rem;">Builder licence FAQs</h2>
          <div class="faq-list">
            <details>
              <summary>How much does a builder licence application cost?</summary>
              <div class="faq-answer"><p>Dan's fee starts from $2,000, covering document preparation, referee and experience statements, lodgement and follow-up with the regulator. Government lodgement fees are separate and vary by state.</p></div>
            </details>
            <details>
              <summary>Why do builder licence applications get delayed?</summary>
              <div class="faq-answer"><p>Most delays come down to incomplete experience documentation, referees who aren't properly licensed, or qualifications that don't match the exact requirement — not a lack of skill. Dan checks all three before you lodge, so your application isn't sent back.</p></div>
            </details>
            <details>
              <summary>How long does a builder licence take to approve?</summary>
              <div class="faq-answer"><p>It depends on the state and how complete the application is. A clean, well-documented application moves far faster than one the regulator has to query. Getting it right the first time is the single biggest thing you can do to speed it up.</p></div>
            </details>
            <details>
              <summary>Which states does Dan handle builder licences in?</summary>
              <div class="faq-answer"><p>Dan prepares builder licence applications across ACT, NSW, QLD, SA, TAS, VIC and WA. Not sure which regulator covers you? A free 15-minute call will tell you exactly what applies in your state.</p></div>
            </details>
          </div>
        </div>
      </section>
    `,
  },

  // ===== TRADE CONTRACTOR =====
  '/trade-contractor': {
    title: 'Trade Contractor Licence Help — All Trades, All States from $495 | Trade Licence Solutions',
    description: 'Electrical, plumbing, carpentry and more. Dan Pleaner helps trade contractors get the right licence for their trade and their state from $495.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Trade contractor licence application',
      serviceType: 'Trade contractor licence application',
      description: 'Helping trade contractors — carpentry, plumbing, electrical, air conditioning, roof plumbing and more — get the right licence for their trade and state.',
      provider: { '@type': 'ProfessionalService', name: 'Trade Licence Solutions', telephone: '+61412767129', url: 'https://tradelicencesolutions.com.au' },
      areaServed: { '@type': 'Country', name: 'Australia' },
      offers: { '@type': 'Offer', price: '495', priceCurrency: 'AUD', description: 'Trade contractor licence — from $495' },
    },
    content: `
      <section class="hero hero--inner">
        <div class="container">
          <p class="breadcrumb">Services</p>
          <h1>Trade contractor licences</h1>
          <p style="color:rgba(255,255,255,0.85);max-width:580px;margin-top:0.5rem;">Whether you're in electrical, plumbing, carpentry or another trade — Dan gets you the right licence for your trade and your state.</p>
        </div>
      </section>

      <section class="section">
        <div class="container container--narrow">
          <div class="quick-answer">
            <p><strong>In short:</strong> A trade contractor licence lets you contract for work in your specific trade — carpentry, plumbing, electrical, air conditioning, roof plumbing and more. The right licence type depends on your trade and your state. Dan checks your qualifications, prepares the application and lodges it <strong>from $495</strong>.</p>
          </div>

          <h2>Trades Dan assists with</h2>
          <ul>
            <li>General building and carpentry</li>
            <li>Electrical (where licensing is applicable)</li>
            <li>Plumbing and drainage</li>
            <li>Air conditioning and refrigeration</li>
            <li>Roof plumbing</li>
            <li>Excavation</li>
            <li>Painting (where licensing is applicable)</li>
            <li>Structural landscaping</li>
          </ul>

          <p style="margin-top:1rem;"><strong>Dan generally cannot assist with:</strong> forklift and warehouse licences, white cards, rigging in most states, and some specialist licences. If you're unsure whether he can help with your trade, the fastest way to find out is a free 15-minute call.</p>

          <h2 style="margin-top:2rem;">What Dan does for you</h2>
          <ul>
            <li>Confirms which licence type applies to your trade and state</li>
            <li>Checks your qualifications and experience against the requirements</li>
            <li>Prepares all forms and documentation</li>
            <li>Lodges your application</li>
            <li>Follows up with the regulator until your licence is issued</li>
          </ul>

          <div class="cta-block" style="margin-top:2rem;">
            <a href="/contact" class="btn btn--primary">Book a Callback</a>
            <a href="/pricing" class="btn btn--navy">See pricing</a>
          </div>

          <h2 style="margin-top:2.5rem;">Trade contractor FAQs</h2>
          <div class="faq-list">
            <details>
              <summary>Which trades can Dan help licence?</summary>
              <div class="faq-answer"><p>Dan assists with most construction trades, including general building and carpentry, plumbing and drainage, air conditioning and refrigeration, roof plumbing, excavation, structural landscaping, and electrical or painting where those are licensed in your state. If you're unsure, a free 15-minute call will confirm it.</p></div>
            </details>
            <details>
              <summary>How much does a trade contractor licence cost?</summary>
              <div class="faq-answer"><p>From $495, including checking your qualifications and experience, preparing the forms, lodging the application and following up with the regulator. Government lodgement fees are separate and vary by state.</p></div>
            </details>
            <details>
              <summary>What can't Dan help with?</summary>
              <div class="faq-answer"><p>Dan generally can't assist with forklift and warehouse licences, white cards, rigging in most states, and some specialist licences. The fastest way to check your specific trade is a free 15-minute call.</p></div>
            </details>
            <details>
              <summary>Do I need a different licence in each state?</summary>
              <div class="faq-answer"><p>Licensing rules differ by state, so the right licence depends on where you work. If you're already licensed in one state and want to work in another, mutual recognition may let you transfer it — Dan can map that across for you too.</p></div>
            </details>
          </div>
        </div>
      </section>
    `,
  },

  // ===== PRICING =====
  '/pricing': {
    title: 'Pricing — Trade Licence Solutions',
    description: 'Transparent, all-inclusive pricing for trade licence applications. Builder licences from $2,000. Company licences and mutual recognition from $550. No hidden fees.',
    content: `
      <section class="hero hero--inner">
        <div class="container">
          
          <h1>Pricing</h1>
          <p style="color:rgba(255,255,255,0.85);margin-top:0.5rem;">No hidden fees. No surprises. Everything included.</p>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="compare-bar" style="max-width:760px;margin:0 auto 2rem;">
            <strong>Price check:</strong> Builder licences start from $2,000, all-inclusive. Company licences and mutual recognition start from $550.
          </div>

          <div class="pricing-grid">
            <div class="pricing-card">
              <div class="pricing-card__header">
                <h3>Builder licence</h3>
                <div class="pricing-card__price">From $2,000</div>
              </div>
              <div class="pricing-card__body">
                <ul class="pricing-card__features">
                  <li>Eligibility and experience check</li>
                  <li>Referee statement preparation</li>
                  <li>Full document preparation</li>
                  <li>Application lodgement</li>
                  <li>Regulator follow-up</li>
                  <li>NSW and QLD covered</li>
                </ul>
                <a href="/contact" class="btn btn--navy" style="display:block;text-align:center;">Book a Callback</a>
                <a href="/apply" class="btn btn--outline" style="display:block;text-align:center;margin-top:0.75rem;" onclick="window.trackEvent&&trackEvent('apply_now_click',{step:'pricing',licence:'builder'}); window.trackIntent&&trackIntent('apply_click',{step:'pricing',licence:'builder'})">Apply now</a>
              </div>
            </div>

            <div class="pricing-card pricing-card--featured">
              <div class="pricing-card__header">
                <h3>Company licence</h3>
                <div class="pricing-card__price">From $550</div>
              </div>
              <div class="pricing-card__body">
                <ul class="pricing-card__features">
                  <li>Eligibility check</li>
                  <li>Full document preparation</li>
                  <li>Application lodgement</li>
                  <li>Regulator follow-up</li>
                  <li>Supervisor compliance advice</li>
                  <li>NSW and QLD covered</li>
                </ul>
                <a href="/contact" class="btn btn--primary" style="display:block;text-align:center;">Book a Callback</a>
                <a href="/apply" class="btn btn--outline" style="display:block;text-align:center;margin-top:0.75rem;" onclick="window.trackEvent&&trackEvent('apply_now_click',{step:'pricing',licence:'company'}); window.trackIntent&&trackIntent('apply_click',{step:'pricing',licence:'company'})">Apply now</a>
              </div>
            </div>

            <div class="pricing-card">
              <div class="pricing-card__header">
                <h3>Mutual recognition</h3>
                <div class="pricing-card__price">From $550</div>
              </div>
              <div class="pricing-card__body">
                <ul class="pricing-card__features">
                  <li>AMR or standard MR assessment</li>
                  <li>Licence mapping across states</li>
                  <li>Gap training identification</li>
                  <li>Application or notification prepared</li>
                  <li>Regulator follow-up</li>
                  <li>All 8 states and territories</li>
                </ul>
                <a href="/contact" class="btn btn--navy" style="display:block;text-align:center;">Book a Callback</a>
                <a href="/apply" class="btn btn--outline" style="display:block;text-align:center;margin-top:0.75rem;" onclick="window.trackEvent&&trackEvent('apply_now_click',{step:'pricing',licence:'mutual-recognition'}); window.trackIntent&&trackIntent('apply_click',{step:'pricing',licence:'mutual-recognition'})">Apply now</a>
              </div>
            </div>
          </div>

          <p style="text-align:center;color:var(--mid-grey);margin-top:2rem;font-size:0.9rem;">All prices are AUD and include GST. Final pricing confirmed in your free 15-minute call based on your specific situation and state.</p>
        </div>
      </section>
    `,
  },

  // ===== NSW =====
  '/nsw': {
    title: 'NSW Builder & Trade Licences — NSW Fair Trading | Trade Licence Solutions',
    description: 'Get your NSW builder licence or trade contractor licence approved the first time. Dan Pleaner handles all NSW Fair Trading applications. From $550.',
    content: `
      <section class="hero hero--inner">
        <div class="container">
          <p class="breadcrumb"><a href="/states">States</a></p>
          <h1>New South Wales licensing</h1>
          <p style="color:rgba(255,255,255,0.85);max-width:580px;margin-top:0.5rem;">NSW Fair Trading is the regulator for builder and trade contractor licences in New South Wales. Dan knows the NSW system inside out.</p>
        </div>
      </section>

      <section class="section">
        <div class="container container--narrow">
          <h2>Licences Dan obtains in NSW</h2>
          <ul>
            <li>Individual contractor licence (general building work)</li>
            <li>Company contractor licence</li>
            <li>Trade contractor licences (carpentry, excavation, structural landscaping and more)</li>
            <li>Owner-builder permits</li>
          </ul>

          <h2 style="margin-top:2rem;">The NSW rules you need to know</h2>
          <p>In NSW, you need a contractor licence if the value of residential building work you contract, sub-contract or advertise for exceeds $5,000 (including labour and materials, GST included).</p>
          <p>Your <strong>company</strong> must hold its own licence — your personal licence does not cover the company's activities. This catches many experienced builders off guard, with fines of up to $110,000 for non-compliance.</p>
          <p>If your qualified supervisor leaves, you have <strong>7 days</strong> to notify NSW Fair Trading and nominate a replacement. Missing this window puts your licence at risk.</p>

          <h2 style="margin-top:2rem;">Official NSW regulator</h2>
          <p>
            <a href="https://www.fairtrading.nsw.gov.au/trades-and-businesses/construction-and-trade-essentials/contractor-licences" target="_blank" rel="noopener" class="inline-link">NSW Fair Trading — contractor licences ↗</a>
          </p>

          <div class="cta-block" style="margin-top:2rem;">
            <a href="/contact" class="btn btn--primary">Book a Callback</a>
          </div>
        </div>
      </section>
    `,
  },

  // ===== QLD =====
  '/qld': {
    title: 'Queensland Builder & Trade Licences — QBCC | Trade Licence Solutions',
    description: 'Get your QBCC builder or contractor licence approved the first time. Dan Pleaner handles all Queensland licence applications. From $550.',
    content: `
      <section class="hero hero--inner">
        <div class="container">
          <p class="breadcrumb"><a href="/states">States</a></p>
          <h1>Queensland licensing</h1>
          <p style="color:rgba(255,255,255,0.85);max-width:580px;margin-top:0.5rem;">The Queensland Building and Construction Commission (QBCC) issues all building and trade licences in Queensland. Dan handles QBCC applications from start to approval.</p>
        </div>
      </section>

      <section class="section">
        <div class="container container--narrow">
          <h2>QBCC licences Dan obtains</h2>
          <ul>
            <li>Builder licence (medium-rise and low-rise)</li>
            <li>Contractor licence (various categories)</li>
            <li>Company contractor licence</li>
            <li>Trade licence (relevant trades)</li>
          </ul>

          <h2 style="margin-top:2rem;">Company licence requirement in QLD</h2>
          <p>Like NSW, Queensland requires the company entity to hold its own QBCC licence. Operating as a company under an individual's licence is a breach of QBCC requirements and carries significant penalties.</p>

          <h2 style="margin-top:2rem;">Official QLD regulator</h2>
          <p>
            <a href="https://www.qbcc.qld.gov.au/licences-permits/getting-a-licence" target="_blank" rel="noopener" class="inline-link">QBCC — getting a licence ↗</a>
          </p>

          <div class="cta-block" style="margin-top:2rem;">
            <a href="/contact" class="btn btn--primary">Book a Callback</a>
          </div>
        </div>
      </section>
    `,
  },

  // ===== VIC =====
  '/vic': {
    title: 'Victoria Builder & Trade Licences — Building Commission VIC | Trade Licence Solutions',
    description: 'Get your Victorian builder or trade licence through the Building Commission VIC. Dan Pleaner handles VIC licence applications from $550.',
    content: `
      <section class="hero hero--inner">
        <div class="container">
          <p class="breadcrumb"><a href="/states">States</a></p>
          <h1>Victoria licensing</h1>
          <p style="color:rgba(255,255,255,0.85);max-width:580px;margin-top:0.5rem;">The Building Commission Victoria (formerly the VBA) is the regulator for all building and plumbing practitioners in Victoria.</p>
        </div>
      </section>
      <section class="section">
        <div class="container container--narrow">
          <p>Dan assists with Victorian domestic building and trade licences, including mutual recognition for licensed practitioners from other states. The VIC system has specific requirements around minimum insurance levels and financial reporting.</p>
          <p><a href="https://www.buildingcommission.com.au/practitioners/registration-and-licensing" target="_blank" rel="noopener" class="inline-link">Building Commission VIC — registration and licensing ↗</a></p>
          <div class="cta-block" style="margin-top:2rem;">
            <a href="/contact" class="btn btn--primary">Book a Callback</a>
          </div>
        </div>
      </section>
    `,
  },

  // ===== STATES =====
  '/states': {
    title: 'All States — Trade Licences Across Australia | Trade Licence Solutions',
    description: 'Trade Licence Solutions covers all 8 Australian states and territories. Builder licences, company licences, mutual recognition — whatever state, Dan handles it.',
    content: `
      <section class="hero hero--inner">
        <div class="container">
          
          <h1>All states and territories</h1>
          <p style="color:rgba(255,255,255,0.85);max-width:580px;margin-top:0.5rem;">Each state has its own regulator, its own forms, its own quirks. Dan knows them all.</p>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="state-grid">
            <a href="/australian-capital-territory" class="state-tile">
              <span class="state-tile__name">Australian Capital Territory</span>
              <span class="state-tile__detail">Access Canberra</span>
            </a>
            <a href="/new-south-wales" class="state-tile">
              <span class="state-tile__name">New South Wales</span>
              <span class="state-tile__detail">NSW Fair Trading</span>
            </a>
            <a href="/northern-territory" class="state-tile">
              <span class="state-tile__name">Northern Territory</span>
              <span class="state-tile__detail">NT Building Practitioners Board</span>
            </a>
            <a href="/queensland" class="state-tile">
              <span class="state-tile__name">Queensland</span>
              <span class="state-tile__detail">QBCC</span>
            </a>
            <a href="/south-australia" class="state-tile">
              <span class="state-tile__name">South Australia</span>
              <span class="state-tile__detail">Consumer and Business Services (CBS)</span>
            </a>
            <a href="/tasmania" class="state-tile">
              <span class="state-tile__name">Tasmania</span>
              <span class="state-tile__detail">CBOS</span>
            </a>
            <a href="/victoria" class="state-tile">
              <span class="state-tile__name">Victoria</span>
              <span class="state-tile__detail">Building Commission VIC</span>
            </a>
            <a href="/western-australia" class="state-tile">
              <span class="state-tile__name">Western Australia</span>
              <span class="state-tile__detail">Building and Energy (DMIRS)</span>
            </a>
          </div>
        </div>
      </section>
    `,
  },

  // ===== ACT =====
  '/act': {
    title: 'ACT Builder & Trade Licences — Access Canberra | Trade Licence Solutions',
    description: 'Get your ACT builder or trade licence through Access Canberra. Dan Pleaner handles ACT licence applications. From $550.',
    content: `
      <section class="hero hero--inner"><div class="container"><p class="breadcrumb"><a href="/states">States</a></p><h1>ACT licensing</h1></div></section>
      <section class="section"><div class="container container--narrow">
        <p>Building and trade licences in the ACT are issued by Access Canberra. Dan assists with ACT contractor licences and mutual recognition for interstate licensees.</p>
        <p><a href="https://www.accesscanberra.act.gov.au/app/answers/detail/a_id/1986" target="_blank" rel="noopener" class="inline-link">Access Canberra — building licences ↗</a></p>
        <div class="cta-block" style="margin-top:2rem;"><a href="/contact" class="btn btn--primary">Book a Callback</a></div>
      </div></section>
    `,
  },

  '/sa': {
    title: 'South Australia Builder & Trade Licences — CBS | Trade Licence Solutions',
    description: 'Get your SA builder or trade licence through Consumer and Business Services. Dan Pleaner handles SA licence applications. From $550.',
    content: `
      <section class="hero hero--inner"><div class="container"><p class="breadcrumb"><a href="/states">States</a></p><h1>South Australia licensing</h1></div></section>
      <section class="section"><div class="container container--narrow">
        <p>Building and trade licences in South Australia are issued by Consumer and Business Services (CBS). Dan assists with SA contractor licences and mutual recognition.</p>
        <p><a href="https://www.cbs.sa.gov.au/licences/building" target="_blank" rel="noopener" class="inline-link">CBS South Australia — building licences ↗</a></p>
        <div class="cta-block" style="margin-top:2rem;"><a href="/contact" class="btn btn--primary">Book a Callback</a></div>
      </div></section>
    `,
  },

  '/wa': {
    title: 'Western Australia Builder & Trade Licences — Building and Energy | Trade Licence Solutions',
    description: 'Get your WA builder or trade licence through Building and Energy. Dan Pleaner handles WA licence applications. From $550.',
    content: `
      <section class="hero hero--inner"><div class="container"><p class="breadcrumb"><a href="/states">States</a></p><h1>Western Australia licensing</h1></div></section>
      <section class="section"><div class="container container--narrow">
        <p>Building and trade licences in Western Australia are issued by Building and Energy, a division of the Department of Mines, Industry Regulation and Safety (DMIRS). Dan assists with WA builder and trade licences and mutual recognition.</p>
        <p><a href="https://www.buildingcommission.wa.gov.au/licensing" target="_blank" rel="noopener" class="inline-link">Building and Energy WA — licensing ↗</a></p>
        <div class="cta-block" style="margin-top:2rem;"><a href="/contact" class="btn btn--primary">Book a Callback</a></div>
      </div></section>
    `,
  },

  '/tas': {
    title: 'Tasmania Builder & Trade Licences — CBOS | Trade Licence Solutions',
    description: 'Get your Tasmanian builder or trade licence through CBOS. Dan Pleaner handles TAS licence applications. From $550.',
    content: `
      <section class="hero hero--inner"><div class="container"><p class="breadcrumb"><a href="/states">States</a></p><h1>Tasmania licensing</h1></div></section>
      <section class="section"><div class="container container--narrow">
        <p>Building and trade licences in Tasmania are issued by the Consumer, Building and Occupational Services (CBOS). Dan assists with Tasmanian contractor licences and mutual recognition from mainland states.</p>
        <p><a href="https://www.cbos.tas.gov.au/topics/licensing" target="_blank" rel="noopener" class="inline-link">CBOS Tasmania — licensing ↗</a></p>
        <div class="cta-block" style="margin-top:2rem;"><a href="/contact" class="btn btn--primary">Book a Callback</a></div>
      </div></section>
    `,
  },

  '/nt': {
    title: 'Northern Territory Builder & Trade Licences | Trade Licence Solutions',
    description: 'Get your NT builder or trade licence through the NT Building Practitioners Board. Dan Pleaner handles NT licence applications. From $550.',
    content: `
      <section class="hero hero--inner"><div class="container"><p class="breadcrumb"><a href="/states">States</a></p><h1>Northern Territory licensing</h1></div></section>
      <section class="section"><div class="container container--narrow">
        <p>Building and trade licences in the Northern Territory are issued by the NT Building Practitioners Board. Dan assists with NT contractor licences and mutual recognition.</p>
        <div class="cta-block" style="margin-top:2rem;"><a href="/contact" class="btn btn--primary">Book a Callback</a></div>
      </div></section>
    `,
  },

  // ===== SERVICES =====
  '/services': {
    title: 'Services — Trade Licence Solutions',
    description: 'Company licences, mutual recognition, builder licences, trade contractor licences. Dan Pleaner covers all licence types across all 8 Australian states.',
    content: `
      <section class="hero hero--inner">
        <div class="container">
          
          <h1>Services</h1>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="cards">
            <div class="card card--hero">
              <div class="card__label">Most requested</div>
              <h3>Company contractor licence</h3>
              <p>Your Pty Ltd company must hold its own licence. Non-compliance can bring serious fines. Dan gets your company licensed fast.</p>
              <div class="card__price">From $550</div>
              <a href="/company-licence" class="btn btn--primary">Learn more</a>
            </div>
            <div class="card card--hero">
              <div class="card__label">Work interstate</div>
              <h3>Mutual recognition</h3>
              <p>Already licensed in one state? Dan maps your licence across to any other state through AMR or standard mutual recognition.</p>
              <div class="card__price">From $550</div>
              <a href="/mutual-recognition" class="btn btn--primary">Learn more</a>
            </div>
            <div class="card">
              <div class="card__label">Build your business</div>
              <h3>Individual builder licence</h3>
              <p>Contract directly with clients and run your own sites. Dan handles your NSW Fair Trading or QBCC application from go to approval.</p>
              <div class="card__price">From $2,000</div>
              <a href="/builder-licence" class="btn btn--navy">Learn more</a>
            </div>
            <div class="card">
              <div class="card__label">Tradespeople</div>
              <h3>Trade contractor licence</h3>
              <p>Electrical, plumbing, carpentry and more. The right licence for your trade and your state.</p>
              <div class="card__price">From $495</div>
              <a href="/trade-contractor" class="btn btn--navy">Learn more</a>
            </div>
          </div>
        </div>
      </section>
    `,
  },

  // ===== FAQ =====
  '/faq': {
    title: 'FAQs — Trade Licence Solutions',
    description: 'Answers to the most common questions about trade and builder licences in Australia. Company licences, mutual recognition, approval rates and more.',
    content: `
      <section class="hero hero--inner">
        <div class="container">
          
          <h1>Frequently asked questions</h1>
        </div>
      </section>
      <section class="section">
        <div class="container container--narrow">
          <div class="faq-list">
            <details>
              <summary>Which licences can Dan assist with?</summary>
              <div class="faq-answer">
                <p>Dan assists with the majority of licences across the construction industry, including: QBCC licences in Queensland, NSW Fair Trading licences, Building Commission VIC licences, Consumer and Business Services (CBS) licences in SA, CBOS Tasmania, and Access Canberra ACT licences. He generally cannot assist with forklift and warehouse licences, white cards, or rigging in most states.</p>
              </div>
            </details>
            <details>
              <summary>Is Trade Licence Solutions a training organisation?</summary>
              <div class="faq-answer">
                <p>No. Dan is not a registered training organisation and does not issue qualifications. To apply for a trade or builder's licence you'll need the right qualification — we can point you to a suitable training organisation if needed. We handle the licence application, not the training.</p>
              </div>
            </details>
            <details>
              <summary>Does Trade Licence Solutions issue the licence itself?</summary>
              <div class="faq-answer">
                <p>No. Each state and territory has its own government body that issues licences. Dan's role is to prepare your application, lodge it with the right regulator, and follow up until your licence is issued.</p>
              </div>
            </details>
            <details>
              <summary>Can I apply for a licence myself?</summary>
              <div class="faq-answer">
                <p>Absolutely. Some people get through the process without help. Dan's here for those who want it done right the first time, without delays. Even a free 15-minute call can save you weeks — most people don't know what they don't know until they're already in trouble with their application.</p>
              </div>
            </details>
            <details>
              <summary>Do you guarantee approval?</summary>
              <div class="faq-answer">
                <p>We can't guarantee approval — no one legitimately can, because the final decision rests with the state regulator. What we can promise is that your application will be as strong as it possibly can be. If an application isn't successful, we'll tell you exactly why and what to do next — including how to challenge the decision if appropriate.</p>
              </div>
            </details>
            <details>
              <summary>My company is already operating. Do I need a company licence?</summary>
              <div class="faq-answer">
                <p>In NSW, if your company is contracting for residential building work valued over $5,000 (including GST), it must hold its own contractor licence — regardless of whether a director holds a personal licence. This is one of the most common and costly compliance gaps Dan sees. A free 15-minute call will tell you exactly where your company stands.</p>
              </div>
            </details>
            <details>
              <summary>What's the 7-day supervisor rule?</summary>
              <div class="faq-answer">
                <p>In NSW, if your nominated qualified supervisor leaves your business, you have just 7 days to notify NSW Fair Trading and nominate a replacement. If you don't, your company licence is at risk. Most business owners don't know this rule exists. Dan makes sure you do — and helps you stay compliant.</p>
              </div>
            </details>
            <details>
              <summary>What is automatic mutual recognition (AMR)?</summary>
              <div class="faq-answer">
                <p>Automatic Mutual Recognition (AMR) allows most licensed builders and trade contractors to notify the regulator in another state and start working there immediately — without a new application. It applies in most states for most licence types. Dan confirms whether AMR applies in your situation and handles the notification. <a href="/mutual-recognition">Learn more about mutual recognition →</a></p>
              </div>
            </details>
            <details>
              <summary>How long does the application take?</summary>
              <div class="faq-answer">
                <p>Timeframes vary significantly by state, licence type and the regulator's current workload. Dan gives you a realistic timeline in your free call. Dan works to keep your application from getting stuck in a back-and-forth with the regulator, which is typically how timelines blow out.</p>
              </div>
            </details>
            <details>
              <summary>How much does it cost?</summary>
              <div class="faq-answer">
                <p>Company licences and mutual recognition start from $550. Individual builder licence applications start from $2,000. Final pricing depends on the state and the complexity of your application and is confirmed in your free 15-minute call. <a href="/pricing">See full pricing →</a></p>
              </div>
            </details>
          </div>
          <div class="cta-block" style="margin-top:2rem;">
            <a href="/contact" class="btn btn--primary">Book a Callback with Dan</a>
            <a href="/apply" class="btn btn--outline" onclick="window.trackEvent&&trackEvent('apply_now_click',{step:'services'}); window.trackIntent&&trackIntent('apply_click',{step:'services'})">Apply now</a>
          </div>
        </div>
      </section>
    `,
  },

  // ===== ABOUT =====
  '/about': {
    title: 'About Dan Pleaner — Trade Licence Solutions',
    description: 'Dan Pleaner founded Trade Licence Solutions to help tradies and builders get licensed first time. Expert guidance, personal support and honest advice across Australia.',
    content: `
      <section class="hero hero--inner">
        <div class="container">
          
          <h1>About Dan Pleaner</h1>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="bio-block">
            <div class="bio-block__photo">
              <img src="/images/dan-headshot.jpg" alt="Dan Pleaner, founder of Trade Licence Solutions" loading="lazy" style="max-width:100%;border-radius:12px;">
            </div>
            <div>
              <p class="section-label" style="color:var(--orange,#f5a623);">My story</p>
              <h2>Dedicated to help you get licensed.</h2>
              <p>As a dedicated professional with extensive experience in the residential construction sector, I have had the privilege of supporting countless tradespeople across New South Wales in obtaining their builder licences.</p>
              <p>During my tenure with the Housing Industry Association (HIA), I provided tailored guidance on licensing pathways, regulatory compliance, and qualification requirements, helping tradies navigate the often-complex application process with confidence and clarity.</p>
              <p>My commitment lies in empowering skilled professionals to advance their careers and contribute to the growth and integrity of the building industry.</p>
              <p style="margin-top:1.5rem;"><img src="/images/dan-signature.png" alt="Daniel Pleaner signature" width="150" height="75" style="height:auto;max-width:150px;"></p>
              <p><strong>Daniel Pleaner</strong><br>Founder, Trade Licence Solutions Australia</p>
              <div class="cta-block">
                <a href="/contact" class="btn btn--primary">Book a Callback with Dan</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="section section--grey">
        <div class="container container--narrow">
          <p class="section-label text-center">Why choose us</p>
          <h2 class="text-center">Expert advice. Personal support. First-time approval.</h2>
          <ul style="max-width:640px;margin:1.5rem auto 0;line-height:1.9;">
            <li>Honest, professional advice based on real experience in licensing and building</li>
            <li>A tailored plan for your business, licence type and goals</li>
            <li>Strong, accurate applications, prepared so you get approved first time</li>
            <li>Referee statement and documentation help</li>
            <li>One-on-one support from Dan, from first call to approval</li>
            <li>Up to date with the latest licensing requirements</li>
          </ul>
        </div>
      </section>
    `,
  },

  // ===== READINESS CHECK =====
  '/readiness-check': {
    title: 'Licence Readiness Check — Trade Licence Solutions',
    description: 'Answer a few quick questions and get a personalised breakdown of what you need for your trade licence application in Australia.',
    content: `
      <section class="hero hero--inner">
        <div class="container">
          
          <h1>Licence readiness check</h1>
          <p style="color:rgba(255,255,255,0.85);margin-top:0.5rem;">2 minutes. No sign-up. Personalised to your situation.</p>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <form class="check-form" method="POST" action="/readiness-check">
            <div class="form-group">
              <label for="first_name">Your first name</label>
              <input type="text" id="first_name" name="first_name" placeholder="e.g. James" autocomplete="given-name">
            </div>
            <div class="form-group">
              <label for="licence_type">What are you looking to get?</label>
              <select id="licence_type" name="licence_type" required>
                <option value="">— Select one —</option>
                <option value="builder">Individual builder licence</option>
                <option value="company">Company contractor licence</option>
                <option value="mutual-recognition">Work in another state (mutual recognition)</option>
                <option value="trade">Trade contractor licence</option>
                <option value="unsure">Not sure yet</option>
              </select>
            </div>
            <div class="form-group">
              <label for="state">Which state are you applying in?</label>
              <select id="state" name="state" required>
                <option value="">— Select state —</option>
                <option value="nsw">New South Wales</option>
                <option value="qld">Queensland</option>
                <option value="vic">Victoria</option>
                <option value="act">ACT</option>
                <option value="sa">South Australia</option>
                <option value="wa">Western Australia</option>
                <option value="tas">Tasmania</option>
                <option value="nt">Northern Territory</option>
              </select>
            </div>
            <div class="form-group">
              <label for="experience">Years of relevant experience</label>
              <select id="experience" name="experience">
                <option value="">— Select —</option>
                <option value="lt2">Less than 2 years</option>
                <option value="2to5">2–5 years</option>
                <option value="5plus">5+ years</option>
              </select>
            </div>
            <div class="form-group">
              <label for="qualifications">Do you hold relevant trade or building qualifications?</label>
              <select id="qualifications" name="qualifications">
                <option value="">— Select —</option>
                <option value="yes">Yes</option>
                <option value="no">Not yet</option>
                <option value="unsure">Not sure</option>
              </select>
            </div>
            <button type="submit" class="btn btn--primary" style="width:100%;">Get my readiness result →</button>
          </form>
        </div>
      </section>
    `,
  },

  // ===== CONTACT =====
  '/contact': {
    title: 'Contact Dan — Book a Callback | Trade Licence Solutions',
    description: 'Book a free 15-minute call with Dan Pleaner. No obligation.',
    content: `
      <section class="hero hero--inner">
        <div class="container">
          
          <h1>Book a free 15-minute call</h1>
          <p style="color:rgba(255,255,255,0.85);margin-top:0.5rem;">No obligation. Dan answers his own phone. Tell him your situation and he'll tell you exactly what you need.</p>
        </div>
      </section>
      <section class="section">
        <div class="container two-col">
          <div>
            <h2>Get in touch</h2>
            <p>The fastest way to find out where you stand is a 15-minute call with Dan. He'll tell you exactly what licence you need, what it'll cost, and how long it'll take — before you commit to anything.</p>
            <p style="margin-top:1rem;"><strong>Or send a message below</strong> and Dan will call you back.</p>
          </div>
          <div>
            <form class="check-form" style="box-shadow:var(--shadow);" method="POST" action="/contact-submitted">
              <div class="form-group">
                <label for="c_name">Your name</label>
                <input type="text" id="c_name" name="name" required placeholder="Your name" autocomplete="name">
              </div>
              <div class="form-group">
                <label for="c_phone">Best phone number</label>
                <input type="tel" id="c_phone" name="phone" required placeholder="e.g. 0400 000 000" autocomplete="tel">
              </div>
              <div class="form-group">
                <label for="c_state">State you're applying in</label>
                <select id="c_state" name="state">
                  <option value="">— Select state —</option>
                  <option value="nsw">New South Wales</option>
                  <option value="qld">Queensland</option>
                  <option value="vic">Victoria</option>
                  <option value="act">ACT</option>
                  <option value="sa">South Australia</option>
                  <option value="wa">Western Australia</option>
                  <option value="tas">Tasmania</option>
                  <option value="nt">Northern Territory</option>
                </select>
              </div>
              <div class="form-group">
                <label for="c_licence">Licence you need</label>
                <select id="c_licence" name="licence">
                  <option value="">— Select one —</option>
                  <option value="builder">Builder licence</option>
                  <option value="company">Company licence</option>
                  <option value="mutual">Mutual recognition</option>
                  <option value="trade">Trade licence</option>
                  <option value="not sure">Not sure yet</option>
                </select>
              </div>
              <div class="form-group">
                <label for="c_email">Email (optional)</label>
                <input type="email" id="c_email" name="email" placeholder="your@email.com" autocomplete="email">
              </div>
              <div class="form-group">
                <label for="c_message">What do you need help with? (optional)</label>
                <textarea id="c_message" name="message" placeholder="e.g. I need a company licence in NSW…"></textarea>
              </div>
              <div class="hp" aria-hidden="true"><label>Leave this field empty<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
              {{TURNSTILE_WIDGET}}
              <button type="submit" class="btn btn--primary" style="width:100%;">Send message →</button>
            </form>
          </div>
        </div>
      </section>
    `,
  },

  // ===== CONTACT SUBMITTED =====
  '/contact-submitted': {
    title: 'Message received — Trade Licence Solutions',
    description: 'Dan will call you back shortly.',
    noindex: true,
    content: `
      <section class="hero">
        <div class="container">
          <h1>Message received — Dan will call you.</h1>
          <p>Dan personally calls everyone back. If it's urgent, call him directly on <a href="tel:+61412767129" style="color:var(--orange);">0412 767 129</a>.</p>
          <div class="hero__ctas">
            <a href="/" class="btn btn--primary">Back to home</a>
          </div>
        </div>
      </section>
      <span data-track-form-complete="contact" hidden></span>
    `,
  },

  // ===== PRIVACY & TERMS =====
  '/privacy': {
    title: 'Privacy & Terms — Trade Licence Solutions',
    description: 'Privacy policy and terms of use for Trade Licence Solutions — how your information is collected and used, and the terms for using this website.',
    noindex: true,
    content: `
      <section class="hero hero--inner"><div class="container"><h1>Privacy &amp; terms</h1><p style="color:rgba(255,255,255,0.85);margin-top:0.5rem;">Last updated: 10 November 2026</p></div></section>
      <section class="section"><div class="container container--narrow">

        <h2>Privacy policy</h2>
        <p>Trade Licence Solutions (Dan Pleaner) respects your privacy. This page explains what information this website collects and how it's used.</p>

        <h3 style="margin-top:1.5rem;">What we collect</h3>
        <p>When you use the contact form or the licence readiness check, we collect what you enter — typically your name, phone number, the state and licence type you're asking about, and, if you choose to add them, your email and a message. Nothing else is required to use the site.</p>

        <h3 style="margin-top:1.5rem;">How it's used</h3>
        <p>Information you submit is sent straight to Dan (as an email, and saved in a private enquiry log he uses to track enquiries) so he can call you back. It's used only to respond to your enquiry and, if you go ahead, to help with your licence application. It is not sold, and it is not shared with anyone else — except the relevant state licensing regulator where that's genuinely needed to process your application (for example, NSW Fair Trading or the QBCC).</p>

        <h3 style="margin-top:1.5rem;">Analytics</h3>
        <p>This site uses two tools to understand how it's used:</p>
        <ul>
          <li><strong>Cloudflare Web Analytics</strong> — a privacy-friendly analytics tool that doesn't use cookies or track you individually. It just gives us aggregate numbers like how many people visited and which pages were popular.</li>
          <li><strong>Google Analytics</strong> — measures site traffic and how people navigate the site. It may use cookies and collect your approximate location, device and browser type, the pages you view, and a small number of actions such as completing the licence check tool, submitting the contact form, clicking to call, or clicking through to book a call. It does not collect your name, phone number or email unless you submit the contact form separately.</li>
        </ul>
        <p><strong>Anonymous visit tracking</strong> is this site's own, first-party tracking. A random visitor ID is kept in a cookie on your device. It records the pages you view, the steps you take in the licence check tool, and where you came from (for example, Google). It doesn't store your name, phone number, email or IP address, and records are kept for 90 days. If you send an enquiry, it is linked to this ID so Dan can see how you found the site.</p>
        <p>No advertising pixels (such as Meta/Facebook) are used on this site.</p>

        <h3 style="margin-top:1.5rem;">Security and retention</h3>
        <p>Enquiry details are kept only as long as needed to assist with your licence application and for reasonable record-keeping afterwards. The form is protected against spam and bots using Cloudflare Turnstile.</p>

        <h3 style="margin-top:1.5rem;">Your rights</h3>
        <p>You can ask what information we hold about you, ask us to correct it, or ask us to delete it. Contact Dan through the <a href="/contact">contact form</a> and he'll sort it personally.</p>

        <h2 style="margin-top:2.5rem;">Terms of use</h2>

        <h3 style="margin-top:1.5rem;">About this site</h3>
        <p>This website is published by Dan Pleaner, trading as Trade Licence Solutions. Content on this site is general information only and doesn't take the place of a conversation with Dan about your specific situation — pricing, timeframes and eligibility are always confirmed in your free call.</p>

        <h3 style="margin-top:1.5rem;">No guarantee of approval</h3>
        <p>Trade Licence Solutions prepares and lodges licence applications on your behalf. The decision to approve or refuse any licence rests entirely with the relevant state or territory regulator (such as NSW Fair Trading or the QBCC) — not with Trade Licence Solutions. We can't and don't guarantee approval.</p>

        <h3 style="margin-top:1.5rem;">Not a training organisation</h3>
        <p>Trade Licence Solutions is not a registered training organisation and doesn't issue qualifications. Where a qualification is needed, we can point you to a suitable training provider, but the training itself isn't part of this service.</p>

        <h3 style="margin-top:1.5rem;">Pricing</h3>
        <p>Prices shown on this site are indicative starting prices in Australian dollars, including GST. Your final price is confirmed during your free call based on your specific situation and state.</p>

        <h3 style="margin-top:1.5rem;">Website content</h3>
        <p>Everything on this site — text, design and logo — belongs to Trade Licence Solutions unless otherwise noted, and shouldn't be copied without permission. We've made reasonable efforts to keep information accurate, but licensing rules change, so always confirm current requirements with Dan or the relevant regulator before relying on anything here.</p>

        <h3 style="margin-top:1.5rem;">Governing law</h3>
        <p>These terms are governed by the laws of New South Wales, Australia.</p>

        <h3 style="margin-top:1.5rem;">Changes</h3>
        <p>This page may be updated from time to time. The date at the top shows when it was last changed.</p>

        <h3 style="margin-top:1.5rem;">Questions?</h3>
        <p>Send Dan an <a href="/contact">enquiry</a>.</p>

      </div></section>
    `,
  },

  // ===== FUTURE PROOFED =====
  '/future-proofed': {
    title: 'Future Proofed by Maverick Digital',
    description: 'This site was built and future proofed by Maverick Digital — AI-powered websites for small business.',
    noindex: true,
    content: `
      <section class="hero hero--inner"><div class="container"><h1>Future proofed by Maverick Digital</h1></div></section>
      <section class="section"><div class="container container--narrow">
        <p>This website was built by <a href="https://maverickdigital.com.ai" target="_blank" rel="noopener">Maverick Digital</a> — a Coffs Harbour based digital agency specialising in AI-powered websites and tools for small business owners.</p>
        <p>Dan updates this site by talking into his phone. No agency middleman, no delays, no double handling.</p>
        <a href="https://maverickdigital.com.ai" target="_blank" rel="noopener" class="btn btn--primary" style="margin-top:1rem;">Visit Maverick Digital</a>
      </div></section>
    `,
  },

  // ===== 404 =====
  '/404': {
    title: 'Page not found — Trade Licence Solutions',
    description: 'Page not found.',
    status: 404,
    noindex: true,
    content: `
      <section class="hero">
        <div class="container">
          <h1>Page not found</h1>
          <p>That page doesn't exist. Try the links below, or <a href="/contact">send Dan an enquiry</a>.</p>
          <div class="hero__ctas">
            <a href="/" class="btn btn--primary">Back to home</a>
          </div>
        </div>
      </section>
    `,
  },
};
