(function(){
  // NSW, QLD and VIC have checked rules from their state pages.
  // Other states are marked as not yet verified, so no wrong steps are shown.
  var STATES = {
    nsw:{name:"New South Wales",page:"/new-south-wales",verified:true,regulator:"NSW Fair Trading",
      rules:["Contractor licence needed for residential work over $5,000, labour and materials and GST included.",
             "Your company must hold its own licence. Your personal licence doesn't cover it.",
             "If your qualified supervisor leaves, you have 7 days to nominate a replacement."]},
    qld:{name:"Queensland",page:"/queensland",verified:true,regulator:"QBCC",
      rules:["The QBCC issues all building and trade licences in Queensland.",
             "Like NSW, your company must hold its own QBCC licence. Trading as a company under your personal licence is a breach."]},
    vic:{name:"Victoria",page:"/victoria",verified:true,regulator:"Building Commission Victoria",
      rules:["Building Commission Victoria (formerly the VBA) regulates building and plumbing practitioners.",
             "Victoria has specific minimum insurance and financial reporting requirements. Dan will walk you through them (to verify)."]},
    act:{name:"ACT",page:"/australian-capital-territory",verified:false},
    sa:{name:"South Australia",page:"/south-australia",verified:false},
    wa:{name:"Western Australia",page:"/western-australia",verified:false},
    tas:{name:"Tasmania",page:"/tasmania",verified:false},
    nt:{name:"Northern Territory",page:"/northern-territory",verified:false}
  };
  var STATE_ORDER = ["nsw","qld","vic","act","sa","wa","tas","nt"];
  var TYPE_LABELS = {builder:"Builder licence",company:"Company licence",mutual:"Mutual recognition",trade:"Trade licence"};
  var TOTAL = 5;

  // Question tree. Each option either goes to a follow-up question or ends with a result.
  var TREE = {
    builder:{q:"Do you hold a building qualification?",opts:[
      {t:"Yes, Cert IV in Building or a building degree",next:"builderExp",score:2},
      {t:"I have a Cert III in a trade only",next:"builderExp",score:1},
      {t:"Not yet",next:"builderExp",score:0}]},
    builderExp:{q:"How long have you worked on site?",opts:[
      {t:"2 years or more",end:true,exp:true},
      {t:"Under 2 years",end:true,exp:false}]},
    company:{q:"Is your company set up with an ABN?",opts:[
      {t:"Yes",next:"companySup",score:1},
      {t:"Not yet",next:"companySup",score:0}]},
    companySup:{q:"Does a director or employee hold the right licence or supervisor certificate?",opts:[
      {t:"Yes",end:true,exp:true},
      {t:"No, or not sure",end:true,exp:false}]},
    mutual:{q:"Is your interstate or NZ licence current?",opts:[
      {t:"Yes, it's current",next:"mutualMatch",score:1},
      {t:"It's expired or suspended",next:"mutualMatch",score:0}]},
    mutualMatch:{q:"Does it cover the same kind of work you'll do?",opts:[
      {t:"Yes, same work",end:true,exp:true},
      {t:"Not sure",end:true,exp:false}]},
    trade:{q:"Do you hold a Cert III in your trade?",opts:[
      {t:"Yes",next:"tradeExp",score:1},
      {t:"Not yet",next:"tradeExp",score:0}]},
    tradeExp:{q:"Will you contract jobs over $5,000 including GST?",opts:[
      {t:"Yes",end:true,exp:true},
      {t:"No, I only work as an employee",end:true,exp:false}]}
  };

  function verdict(type, score, exp){
    if(type==="builder"){
      if(score===2&&exp) return {k:"green",head:"You look ready for your builder licence",pts:["Next we line up your evidence and referee statements.","Most knock-backs come from paperwork, not experience."]};
      if(score===2) return {k:"amber",head:"Qualified, building your experience",pts:["You'll usually need about two years of relevant on-site work.","Talk to Dan about what counts as experience."]};
      if(score===1) return {k:"amber",head:"A trade cert is a strong start",pts:["A builder licence usually needs a Cert IV in Building and Construction.","Dan can map the fastest path from your Cert III."]};
      return {k:"red",head:"Start with the qualification",pts:["Get your building qualification first.","Dan can point you to the right course, then help with the licence."]};
    }
    if(type==="company"){
      if(score&&exp) return {k:"green",head:"Your company looks ready to apply",pts:["We check the supervisor's licence class matches the work.","Then we line up the company paperwork."]};
      if(exp) return {k:"amber",head:"Set up the company first",pts:["Applying needs the company's ABN and a current director.","Your supervisor is sorted, so you're close."]};
      return {k:"amber",head:"You need a nominated supervisor",pts:["Someone in the business needs the right individual licence.","Dan can work out the quickest way to get there."]};
    }
    if(type==="mutual"){
      if(score&&exp) return {k:"green",head:"Mutual recognition looks likely",pts:["We match your licence to its equivalent.","Then you lodge with our checklist beside you."]};
      if(score) return {k:"amber",head:"Let's check the licence class",pts:["The new licence has to cover the same work.","Dan can compare the two classes for you."]};
      return {k:"red",head:"Renew your current licence first",pts:["Mutual recognition needs a current licence.","Once it's current, come back and we'll match it."]};
    }
    if(score&&exp) return {k:"green",head:"You look ready for your trade licence",pts:["Next we check your evidence and referees.","Then you lodge with your state regulator."]};
    if(!exp) return {k:"amber",head:"Check what your role needs",pts:["A contractor licence is for contracting work over $5,000.","A supervisor certificate lets you do and supervise work. Dan can tell you which fits."]};
    return {k:"red",head:"Start with your Cert III",pts:["Contracting work over $5,000 needs a licence, and that needs the qualification.","Dan can point you to the right course."]};
  }

  var tool = document.getElementById("tool");
  if(!tool) return;
  var LOCKED = document.body.dataset.state;
  var history = [];   // screen functions, so Back can redo the last one
  var st = null, type = null, score = 0;

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
  }

  function showState(){
    st = null; type = null; score = 0;
    var h = progress(1) + '<p class="q-question">Which state are you licensing in?</p><div class="q-opts states">';
    STATE_ORDER.forEach(function(k){ h += '<button type="button" class="q-opt" data-st="'+k+'">'+STATES[k].name+'</button>'; });
    tool.innerHTML = h + '</div>';
    tool.querySelectorAll("[data-st]").forEach(function(b){
      b.addEventListener("click", function(){ st = b.dataset.st; go(STATES[st].verified ? showType : showUnverified); });
    });
    bind();
  }

  function showType(){
    var h = progress(2) + '<p class="q-question">What licence do you need?</p><div class="q-opts">';
    [["builder","Builder licence","Run your own building jobs"],["company","Company licence","Your business is a company"],["mutual","Mutual recognition","Licensed in another state or NZ"],["trade","Trade licence","Carpentry, painting, bricklaying and more"]].forEach(function(t){
      h += '<button type="button" class="q-opt" data-t="'+t[0]+'">'+t[1]+'<small>'+t[2]+'</small></button>';
    });
    tool.innerHTML = h + '</div>' + backBtn();
    tool.querySelectorAll("[data-t]").forEach(function(b){
      b.addEventListener("click", function(){ type = b.dataset.t; score = 0; go(function(){ showQ(type); }); });
    });
    bind();
  }

  function showQ(key){
    var node = TREE[key];
    var step = (key===type) ? 3 : 4;
    var h = progress(step) + '<p class="q-question">'+node.q+'</p><div class="q-opts">';
    node.opts.forEach(function(o,i){ h += '<button type="button" class="q-opt" data-i="'+i+'">'+o.t+'</button>'; });
    tool.innerHTML = h + '</div>' + backBtn();
    tool.querySelectorAll("[data-i]").forEach(function(b){
      b.addEventListener("click", function(){
        var o = node.opts[+b.dataset.i];
        if(o.end){ go(function(){ showResult(verdict(type, score, o.exp)); }); return; }
        score = o.score;
        go(function(){ showQ(o.next); });
      });
    });
    bind();
  }

  function showUnverified(){
    var s = STATES[st];
    tool.innerHTML = progress(2) + '<div class="result grey"><span class="badge">Rules not yet checked</span><h3>We haven\'t verified '+s.name+' yet</h3><p>We don\'t want to give you wrong steps. Call Dan and he\'ll walk you through the exact rules for '+s.name+'.</p><div class="result actions" style="display:flex;flex-wrap:wrap;gap:10px"><a class="btn btn-hivis" href="tel:+61412767129">Call 0412 767 129</a><a class="btn btn-ghost" href="'+s.page+'">'+s.name+' page</a></div></div>' + backBtn();
    bind();
  }

  function showResult(r){
    var s = STATES[st];
    var rules = '<div class="rules"><strong>'+s.name+' rules</strong><ul>';
    s.rules.forEach(function(x){ rules += '<li>'+x+'</li>'; });
    rules += '</ul><p class="fine" style="margin-top:6px">Regulator: '+s.regulator+'.</p></div>';
    var label = {green:"Ready to apply",amber:"Nearly there",red:"First step needed"}[r.k];
    var html = progress(5) + '<div class="result '+r.k+'"><span class="badge">'+label+'</span><h3>'+r.head+'</h3><ul>';
    r.pts.forEach(function(p){ html += '<li>'+p+'</li>'; });
    html += '</ul>'+rules+'<div class="actions"><a class="btn btn-hivis" href="'+s.page+'">'+s.name+' details</a><a class="btn btn-ghost" href="/contact?state='+st+'&amp;licence='+encodeURIComponent(TYPE_LABELS[type])+'">Send to Dan</a><a class="btn btn-ghost" href="tel:+61412767129">Call</a></div></div>';
    html += '<button type="button" class="q-back" id="q-again">Start again</button>';
    tool.innerHTML = html;
    document.getElementById("q-again").addEventListener("click", function(){ history = []; go(LOCKED && STATES[LOCKED] ? showType : showState); });
  }

  if(LOCKED && STATES[LOCKED]){ st = LOCKED; go(STATES[LOCKED].verified ? showType : showUnverified); }
  else { go(showState); }
})();
