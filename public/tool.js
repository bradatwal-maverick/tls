(function(){
  // All 8 states checked against their regulators, 6 Nov 2026.
  // Each state sets its own builder qualification, experience, contracting trigger and rules,
  // so a WA builder isn't told NSW's numbers. A state with verified:false shows a "call Dan" screen instead.
  //   builder: qualKey/qualShort = the qualification a builder licence needs; years = on-site experience (null = assessed case by case)
  //   tradeQ = the question that decides if they contract licensable work; contractText = the same trigger in a sentence
  var STATES = {
    nsw:{name:"New South Wales",page:"/new-south-wales",verified:true,regulator:"Building Commission NSW (formerly NSW Fair Trading)",
      builder:{qualKey:"cert4",qualShort:"Cert IV in Building",years:2},
      tradeQ:"Will you contract jobs over $5,000 including GST?",contractText:"contracting work over $5,000",
      employeeNote:"A "+jt("supervisor","supervisor certificate")+" lets you do and supervise work. We can tell you which fits.",
      rules:["Contractor licence needed for residential work over $5,000, labour and materials and GST included.",
             "Your company must hold its own licence. Your personal licence doesn't cover it.",
             "If your qualified supervisor leaves, you have 7 days to nominate a replacement."]},
    qld:{name:"Queensland",page:"/queensland",verified:true,regulator:"QBCC",
      builder:{qualKey:"cert4",qualShort:"Cert IV in Building",years:2},
      tradeQ:"Will you contract building work over $3,300?",contractText:"building work over $3,300",
      rules:["The QBCC issues all building and trade licences in Queensland.",
             "Building work over $3,300 needs a licence. Some trades, like plumbing, gas fitting and fire protection, need one at any value.",
             "Like NSW, your company must hold its own QBCC licence. Trading as a company under your personal licence is a breach."]},
    vic:{name:"Victoria",page:"/victoria",verified:true,regulator:"Building and Plumbing Commission (formerly the VBA)",
      builder:{qualKey:"cert4",qualShort:"Cert IV in Building",years:2},
      tradeQ:"Will you contract domestic building work over $10,000?",contractText:"domestic building work over $10,000",
      rules:["The Building and Plumbing Commission (BPC) replaced the VBA on 1 July 2025 and registers domestic builders.",
             "Domestic building work over $10,000 needs registration. Domestic building insurance is needed at $16,000 or more."]},
    act:{name:"ACT",inName:"the ACT",page:"/australian-capital-territory",verified:true,regulator:"Access Canberra (Construction Occupations Registrar)",
      builder:{qualKey:"cert4",qualShort:"Cert IV in Building",years:2,yearsLabel:"2 years (3,650 hours)"},
      tradeQ:"Will you do or advertise building work for clients?",contractText:"doing or advertising building work for clients",
      rules:["Builder licences come in four classes: A (any height), B (up to 3 storeys), C (homes up to 2 storeys) and D (non-structural basic work).",
             "Classes A to C need a qualification (a Cert IV for Class C), 3,650 hours on site and a pass in the ACT Regulatory Assessment at CIT.",
             "A company or partnership needs its own licence, with a licensed nominee in the same class."]},
    sa:{name:"South Australia",page:"/south-australia",verified:true,regulator:"Consumer and Business Services (CBS)",
      builder:{qualKey:"cert4",qualShort:"Cert IV in Building",years:null,
        expQ:"Can you show on-site experience in the work you'll supervise, with a work history and referees?"},
      tradeQ:"Will you carry out or organise building work for other people?",contractText:"carrying out or organising building work for others",
      rules:["Anyone who carries out or organises building work for others needs a contractor's licence. There's no dollar threshold.",
             "All building work must be supervised by a registered building work supervisor. CBS checks experience with a work history record and a technical interview.",
             "Trade work like carpentry or bricklaying needs $10,000 in net assets, or a restricted subcontractor licence."]},
    wa:{name:"Western Australia",page:"/western-australia",verified:true,regulator:"Building and Energy (Department of Local Government, Industry Regulation and Safety)",
      builder:{qualKey:"diploma",qualShort:"Diploma of Building",years:7},
      tradeQ:"Will you contract work worth $20,000 or more that needs a building permit?",contractText:"work of $20,000 or more that needs a building permit",
      employeeNote:"In WA, Building and Energy registers builders, building surveyors, building engineers and painters. We can tell you if your trade needs registering.",
      rules:["You need to be a registered building contractor when the work needs a building permit and is worth $20,000 or more.",
             "Every contractor needs a nominated supervisor who is a registered building practitioner. The usual path is a Diploma of Building plus 7 years' experience.",
             "If your nominated supervisor changes, you must tell the Building Services Board within 7 days."]},
    tas:{name:"Tasmania",page:"/tasmania",verified:true,regulator:"Consumer, Building and Occupational Services (CBOS)",
      builder:{qualKey:"cert4",qualShort:"Cert IV in Building",years:2,yearsLabel:"2 years (4 without a trade ticket)"},
      tradeQ:"Will you contract building work for clients yourself?",contractText:"contracting building work for clients",
      rules:["CBOS licenses builders in four categories: Domestic, Low Rise, Medium Rise and Open.",
             "You need a Cert IV, Diploma or Advanced Diploma in building, plus 2 years' experience with a trade qualification or 4 years without. Builder Open needs more.",
             "Residential building contracts of $20,000 or more must be in writing and show your licence number."]},
    nt:{name:"Northern Territory",inName:"the Northern Territory",page:"/northern-territory",verified:true,regulator:"Building Practitioners Board",
      builder:{qualKey:"cert4",qualShort:"Cert IV in Building",years:3},
      tradeQ:"Will you contract building work worth $12,000 or more?",contractText:"building work worth $12,000 or more",
      rules:["You need to be a registered building contractor for work worth $12,000 or more, like new homes and extensions.",
             "You need a Cert IV in Building, 3 years' experience, 3 references from registered practitioners and $50,000 in net tangible assets.",
             "A company needs a registered director or nominee in the right category, and $50,000 in net assets."]}
  };
  var ABBR = {nsw:"NSW",qld:"QLD",vic:"VIC",act:"ACT",sa:"SA",wa:"WA",tas:"TAS",nt:"NT"};
  var STATE_ORDER = ["act","nsw","nt","qld","sa","tas","vic","wa"];
  var TYPE_LABELS = {builder:"Builder licence",company:"Company licence",mutual:"Mutual recognition",trade:"Trade licence"};
  var TOTAL = 5;

  // Jargon Buster — same in-place pop-up everywhere on the site. Click, not hover. Never a link out.
  var JARGON = {
    cert4:{t:"Cert IV in Building",d:"A formal building and construction qualification (CPC40120). It's usually the baseline a builder licence application asks for.",dad:"A piece of paper that says you've been taught how to run a building job properly, not just do the work."},
    cert3:{t:"Cert III",d:"The hands-on trade qualification for your specific trade — carpentry, tiling, bricklaying and so on. It's the usual base for a trade licence.",dad:"The ticket that says you know your trade."},
    supervisor:{t:"Qualified supervisor",d:"The licensed person who can sign off and personally supervise the work a company does. A company licence needs one, and there are rules for what happens if they leave.",dad:"The person allowed to put their name on the job and say it was done right."},
    mutual:{t:"Mutual recognition",d:"A rule that lets a licence from another Australian state or New Zealand be recognised here, as long as it covers the same kind of work and is still current.",dad:"If you're already licensed somewhere else, you often don't have to start from scratch here."},
    abn:{t:"ABN",d:"Australian Business Number — the ID your company is registered under. A company licence application needs this in place.",dad:"The number that says your business is official."},
    diploma:{t:"Diploma of Building",d:"A higher building and construction qualification (CPC50220). In WA it's the usual qualification for building practitioner registration.",dad:"A step up from the Cert IV. It shows you can manage bigger building jobs."}
  };
  var jargonModal = null, jargonReturnFocus = null;
  function ensureJargonModal(){
    if (jargonModal) return jargonModal;
    var m = document.createElement("div");
    m.className = "jargon-modal";
    m.setAttribute("role", "dialog");
    m.setAttribute("aria-modal", "true");
    m.innerHTML = '<div class="jargon-card"><div class="jargon-head"><h4 id="jargon-title"></h4><button type="button" class="jargon-x" aria-label="Close">&times;</button></div><p class="jargon-def" id="jargon-def"></p><div class="jargon-dad"><strong>Explain it to my dad</strong><span id="jargon-dad"></span></div></div>';
    document.body.appendChild(m);
    m.addEventListener("click", function(e){ if (e.target === m) closeJargon(); });
    m.querySelector(".jargon-x").addEventListener("click", closeJargon);
    jargonModal = m;
    return m;
  }
  function openJargon(key){
    var j = JARGON[key];
    if (!j) return;
    var m = ensureJargonModal();
    m.querySelector("#jargon-title").textContent = j.t;
    m.querySelector("#jargon-def").textContent = j.d;
    m.querySelector("#jargon-dad").textContent = j.dad;
    jargonReturnFocus = document.activeElement;
    m.classList.add("open");
    m.querySelector(".jargon-x").focus();
  }
  function closeJargon(){
    if (jargonModal) jargonModal.classList.remove("open");
    if (jargonReturnFocus) jargonReturnFocus.focus();
  }
  document.addEventListener("keydown", function(e){ if (e.key === "Escape" && jargonModal && jargonModal.classList.contains("open")) closeJargon(); });
  // A span, never a button — these sit inside q-opt buttons, and a button can't nest inside a button.
  function jargonTrigger(key, label){
    return '<span class="jargon-term" data-jargon="'+key+'" role="button" tabindex="0">'+label+'<span class="jargon-mark" aria-hidden="true">?</span></span>';
  }
  function isJargonHit(e){
    var hit = e.target.closest && e.target.closest("[data-jargon]");
    if (!hit) return false;
    e.stopPropagation();
    openJargon(hit.dataset.jargon);
    return true;
  }
  function bindJargon(root){
    (root || tool).querySelectorAll("[data-jargon]").forEach(function(t){
      t.addEventListener("keydown", function(e){
        if (e.key === "Enter" || e.key === " "){ e.preventDefault(); e.stopPropagation(); openJargon(t.dataset.jargon); }
      });
      t.addEventListener("click", function(e){ e.stopPropagation(); openJargon(t.dataset.jargon); });
    });
  }

  function jt(key, label){ return jargonTrigger(key, label); }
  function years(b){ return b.yearsLabel || (b.years+" years"); }

  // Question tree. Each option either goes to a follow-up question or ends with a result.
  // Built per state, because the builder and trade questions use that state's own numbers.
  function getNode(key){
    var s = STATES[st], b = s.builder;
    // Jargon terms go in the question, never inside an answer button, so a tap on an answer always picks it.
    if(key==="builder") return {q:"Do you hold a "+jt(b.qualKey,b.qualShort)+" or higher?",opts:[
      {t:"Yes",next:"builderExp",score:2},
      {t:"I have a Cert III in a trade only",next:"builderExp",score:1},
      {t:"Not yet",next:"builderExp",score:0}]};
    if(key==="builderExp") return b.years ?
      {q:"How long have you worked on site?",opts:[
        {t:years(b)+" or more",end:true,exp:true},
        {t:"Under "+b.years+" years",end:true,exp:false}]} :
      {q:b.expQ,opts:[
        {t:"Yes",end:true,exp:true},
        {t:"Not yet, or not sure",end:true,exp:false}]};
    if(key==="tradeExp") return {q:s.tradeQ,opts:[
      {t:"Yes",end:true,exp:true},
      {t:"No, I only work as an employee",end:true,exp:false}]};
    return TREE[key];
  }
  var TREE = {
    company:{q:"Is your company set up with an "+jargonTrigger("abn","ABN")+"?",opts:[
      {t:"Yes",next:"companySup",score:1},
      {t:"Not yet",next:"companySup",score:0}]},
    companySup:{q:"Does a director or employee hold the right licence or "+jargonTrigger("supervisor","supervisor certificate")+"?",opts:[
      {t:"Yes",end:true,exp:true},
      {t:"No, or not sure",end:true,exp:false}]},
    mutual:{q:"For "+jargonTrigger("mutual","mutual recognition")+", is your interstate or NZ licence current?",opts:[
      {t:"Yes, it's current",next:"mutualMatch",score:1},
      {t:"It's expired or suspended",next:"mutualMatch",score:0}]},
    mutualMatch:{q:"Does it cover the same kind of work you'll do?",opts:[
      {t:"Yes, same work",end:true,exp:true},
      {t:"Not sure",end:true,exp:false}]},
    trade:{q:"Do you hold a "+jargonTrigger("cert3","Cert III")+" in your trade?",opts:[
      {t:"Yes",next:"tradeExp",score:1},
      {t:"Not yet",next:"tradeExp",score:0}]}
  };

  function verdict(type, score, exp){
    var s = STATES[st], b = s.builder, where = s.inName || s.name;
    if(type==="builder"){
      if(score===2&&exp) return {k:"green",head:"You look ready for your builder licence",pts:["Next we line up your evidence and referee statements.","Most knock-backs come from paperwork, not experience."]};
      if(score===2) return {k:"amber",head:"Qualified, building your experience",pts:[b.years ? "In "+where+" you'll usually need about "+years(b)+" of relevant on-site work." : "In "+where+" your on-site experience is checked case by case, with a work history and an interview.","Talk to Dan about what counts as experience."]};
      if(score===1) return {k:"amber",head:"A trade cert is a strong start",pts:["A builder licence in "+where+" usually needs a "+jt(b.qualKey,b.qualShort)+".","We can map the fastest path from your "+jt("cert3","Cert III")+"."]};
      return {k:"red",head:"Start with the qualification",pts:["Get your building qualification first. In "+where+" that's usually a "+jt(b.qualKey,b.qualShort)+".","We can point you to the right course, then help with the licence."]};
    }
    if(type==="company"){
      if(score&&exp) return {k:"green",head:"Your company looks ready to apply",pts:["We check the supervisor's licence class matches the work.","Then we line up the company paperwork."]};
      if(exp) return {k:"amber",head:"Set up the company first",pts:["Applying needs the company's ABN and a current director.","Your supervisor is sorted, so you're close."]};
      return {k:"amber",head:"You need a nominated supervisor",pts:["Someone in the business needs the right individual licence.","We can work out the quickest way to get there."]};
    }
    if(type==="mutual"){
      if(score&&exp) return {k:"green",head:"Mutual recognition looks likely",pts:["We match your licence to its equivalent.","Then you lodge with our checklist beside you."]};
      if(score) return {k:"amber",head:"Let's check the licence class",pts:["The new licence has to cover the same work.","We can compare the two classes for you."]};
      return {k:"red",head:"Renew your current licence first",pts:["Mutual recognition needs a current licence.","Once it's current, come back and we'll match it."]};
    }
    if(score&&exp) return {k:"green",head:"You look ready for your trade licence",pts:["Next we check your evidence and referees.","Then you lodge with your state regulator."]};
    if(!exp) return {k:"amber",head:"Check what your role needs",pts:["In "+where+" a contractor licence is for "+s.contractText+".",s.employeeNote || "Employees of a licensed business usually work under that business's licence. We can tell you what fits your role."]};
    return {k:"red",head:"Start with your Cert III",pts:["In "+where+", "+s.contractText+" needs a licence, and that needs the "+jt("cert3","Cert III")+" qualification.","We can point you to the right course."]};
  }

  var tool = document.getElementById("tool");
  if(!tool) return;
  var LOCKED = document.body.dataset.state;
  var history = [];   // screen functions, so Back can redo the last one
  var st = null, type = null, score = 0;

  function track(type, detail){ if (window.trackIntent) trackIntent(type, detail); }
  function go(fn){ history.push(fn); fn(); }
  function back(){ history.pop(); var prev = history.pop(); go(prev || showState); }
  function progress(n){
    var h = '<div class="q-progress" aria-hidden="true">';
    for(var i=1;i<=TOTAL;i++) h += '<span class="'+(i<=n?'on':'')+'"></span>';
    return h + '</div>';
  }
  function backBtn(){ return history.length > 1 ? '<button type="button" class="q-back" id="q-back">Back</button>' : ''; }
  function bind(){
    var b = document.getElementById("q-back");
    if(b) b.addEventListener("click", back);
    bindJargon();
  }

  function showState(){
    track('tool_step', { step: 'state' });
    st = null; type = null; score = 0;
    var h = progress(1) + '<p class="q-question">Which state are you licensing in?</p><div class="q-opts states">';
    STATE_ORDER.forEach(function(k){ h += '<button type="button" class="q-opt" data-st="'+k+'" aria-label="'+STATES[k].name+'" title="'+STATES[k].name+'">'+ABBR[k]+'</button>'; });
    tool.innerHTML = h + '</div>';
    tool.querySelectorAll("[data-st]").forEach(function(b){
      b.addEventListener("click", function(){ st = b.dataset.st; go(STATES[st].verified ? showType : showUnverified); });
    });
    bind();
  }

  function showType(){
    track('tool_step', { step: 'type' });
    var h = progress(2) + '<p class="q-question">What licence do you need?</p><div class="q-opts">';
    [["builder","Builder licence","Run your own building jobs"],["company","Company licence","Your business is a company"],["mutual","Mutual recognition","Licensed in another state or NZ"],["trade","Trade licence","Carpentry, painting, bricklaying and more"]].forEach(function(t){
      h += '<button type="button" class="q-opt" data-t="'+t[0]+'">'+t[1]+'<small>'+t[2]+'</small></button>';
    });
    tool.innerHTML = h + '</div>' + backBtn();
    tool.querySelectorAll("[data-t]").forEach(function(b){
      b.addEventListener("click", function(e){ if(isJargonHit(e)) return; type = b.dataset.t; score = 0; go(function(){ showQ(type); }); });
    });
    bind();
  }

  function showQ(key){
    track('tool_step', { step: 'question', licence: type || '' });
    var node = getNode(key);
    var step = (key===type) ? 3 : 4;
    var h = progress(step) + '<p class="q-question">'+node.q+'</p><div class="q-opts">';
    node.opts.forEach(function(o,i){ h += '<button type="button" class="q-opt" data-i="'+i+'">'+o.t+'</button>'; });
    tool.innerHTML = h + '</div>' + backBtn();
    tool.querySelectorAll("[data-i]").forEach(function(b){
      b.addEventListener("click", function(e){
        if(isJargonHit(e)) return;
        var o = node.opts[+b.dataset.i];
        if(o.end){ go(function(){ showResult(verdict(type, score, o.exp)); }); return; }
        score = o.score;
        go(function(){ showQ(o.next); });
      });
    });
    bind();
  }

  function showUnverified(){
    track('tool_step', { step: 'unverified', licence: type || '', state: st || '' });
    var s = STATES[st];
    tool.innerHTML = progress(2) + '<div class="result grey"><span class="badge">Rules not yet checked</span><h3>We haven\'t verified '+s.name+' yet</h3><p>We don\'t want to give you wrong steps. Send Dan an enquiry and he\'ll walk you through the exact rules for '+s.name+'.</p><div class="result actions" style="display:flex;flex-wrap:wrap;gap:10px"><a class="btn btn-ghost" href="'+s.page+'">'+s.name+' page</a></div></div>' + backBtn();
    bind();
  }

  function showResult(r){
    var s = STATES[st];
    var rules = '<div class="rules"><strong>'+s.name+' rules</strong><ul>';
    s.rules.forEach(function(x){ rules += '<li>'+x+'</li>'; });
    rules += '</ul><p class="fine" style="margin-top:6px">Regulator: '+s.regulator+'.</p></div>';
    var label = {green:"Ready to apply",amber:"Nearly there",red:"First step needed"}[r.k];
    var refCode = "TLS-" + (Date.now() % 100000).toString().padStart(5, "0");
    var today = new Date().toLocaleDateString("en-AU", {day:"numeric", month:"short", year:"numeric"});
    var cert = '<div class="ready-card ready-'+r.k+'"><span class="ready-label">Licence Ready Check</span>'+
      '<strong class="ready-verdict">'+label+' &mdash; '+TYPE_LABELS[type]+'</strong>'+
      '<span class="ready-meta">'+s.name+' &middot; Ref '+refCode+' &middot; '+today+'</span></div>';
    var html = progress(5) + '<div class="result '+r.k+'"><span class="badge">'+label+'</span><h3>'+r.head+'</h3><ul>';
    r.pts.forEach(function(p){ html += '<li>'+p+'</li>'; });
    html += '</ul>'+rules+cert+'<div class="actions"><a class="btn btn-hivis" href="'+s.page+'">'+s.name+' details</a><a class="btn btn-ghost" href="/contact?state='+st+'&amp;licence='+encodeURIComponent(TYPE_LABELS[type])+'">Send to Dan</a></div>'+
      (r.k === 'green' ? '<div class="actions"><a class="btn btn-ghost" href="https://pci.jotform.com/form/263016069377057" target="_blank" rel="noopener" onclick="if(window.trackEvent)trackEvent(\'apply_now_click\',{step:\'eligibility\',licence:\''+(type||'')+'\'});if(window.trackIntent)trackIntent(\'apply_click\',{step:\'eligibility\',licence:\''+(type||'')+'\'})">Apply now</a></div>' : '') + '</div>';
    html += '<button type="button" class="q-back" id="q-again">Start again</button>';
    tool.innerHTML = html;
    bindJargon();
    if (window.trackEvent) trackEvent('tool_complete', { licence_type: type, state: st, result: r.k });
    track('tool_result', { licence: type || '', state: st || '', result: r.k });
    document.getElementById("q-again").addEventListener("click", function(){ history = []; go(LOCKED && STATES[LOCKED] ? showType : showState); });
  }

  if(LOCKED && STATES[LOCKED]){ st = LOCKED; go(STATES[LOCKED].verified ? showType : showUnverified); }
  else { go(showState); }
})();
