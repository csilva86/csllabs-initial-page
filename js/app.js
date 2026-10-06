/* =====================================================================
   CSLLABS — js/app.js
   ---------------------------------------------------------------------
   Contents (search for these titles):
     EDIT ME ........ contact e-mail and logo path
     STATIONS ....... names, colours and order of the stations on the map
     WORLD .......... city skyline, stars, poles, speed lines (canvas)
     SOUND .......... optional procedural sound (off by default)
     TRAVEL ......... movement of the train between stations
     INTRO .......... platform, boarding and entering the cabin
   The TEXT of each station lives in index.html (<article class="card">).
   ===================================================================== */
(function(){
'use strict';

/* ---------- EDIT ME ---------- */
var CONTACT_EMAIL = 'carlos.silva@csllabs.com';   // shown in the Contact station
var LOGO_SRC = 'img/logo.png';               // logo image file
/* ----------------------------- */

var $ = function(s, r){ return (r||document).querySelector(s); };
var $$ = function(s, r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); };
var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
var mod = function(a, n){ return ((a % n) + n) % n; };
var clamp = function(v, a, b){ return Math.max(a, Math.min(b, v)); };
var wait = function(ms){ return new Promise(function(r){ setTimeout(r, reduce ? Math.min(ms, 200) : ms); }); };

var STATIONS = [
  {id:'home',         name:'Home',         color:'#5df1ff', no:'Station 01'},
  {id:'about-us',     name:'About Us',     color:'#b967ff', no:'Station 02'},
  {id:'developments', name:'Developments', color:'#ff5da2', no:'Station 03'},
  {id:'videos',       name:'Videos',       color:'#ffb454', no:'Station 04'},
  {id:'contact',      name:'Contact',      color:'#6dffb0', no:'Station 05'}
];
var TERMINAL = {name:'CSLLABS', color:'#5df1ff', no:'Central terminal'};
var posOf = function(i){ return i < 0 ? 0 : 10 + 20*i; };   // % position on the route map

/* ---------- logo (file with text fallback) ---------- */
$$('img[data-logo]').forEach(function(img){
  img.addEventListener('error', function(){
    var s = document.createElement('span');
    s.className = 'wm ' + img.className; s.id = img.id; s.textContent = 'CSLLABS';
    s.setAttribute('role', 'img'); s.setAttribute('aria-label', 'CSLLABS');
    img.replaceWith(s);
  });
  img.src = LOGO_SRC;
});
$('#yr').textContent = new Date().getFullYear();

/* ==================================================================
   WORLD: canvas-baked skyline layers, stars, poles, speed lines
   ================================================================== */
function mulberry32(a){ return function(){ a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

var CFG = [
  {id:'Lfar',  f:.05, hFrac:.36, minW:.035, maxW:.08, minH:.35, maxH:.95, top:'#1d1346', bot:'#0e0a26', rim:'rgba(170,150,255,.30)',
   lit:.20, cell:9,  win:2,   cols:['rgba(150,190,255,.45)','rgba(255,150,200,.35)'], ant:.2,  sign:0,   fog:'rgba(40,22,90,.60)', seed:11, glow:false},
  {id:'Lmid',  f:.12, hFrac:.46, minW:.045, maxW:.10, minH:.30, maxH:1,   top:'#160e38', bot:'#0a0720', rim:'rgba(93,241,255,.35)',
   lit:.30, cell:11, win:2.6, cols:['rgba(120,225,255,.75)','rgba(255,120,190,.6)','rgba(255,200,120,.5)'], ant:.3, sign:.12, fog:'rgba(25,14,60,.45)', seed:23, glow:false},
  {id:'Lnear', f:.28, hFrac:.58, minW:.06,  maxW:.13, minH:.22, maxH:1,   top:'#0f0928', bot:'#05030d', rim:'rgba(255,93,162,.4)',
   lit:.36, cell:13, win:3.4, cols:['rgba(93,241,255,.9)','rgba(255,93,162,.75)','rgba(255,200,120,.7)','rgba(185,103,255,.8)'], ant:.35, sign:.2, fog:'rgba(10,6,28,.35)', seed:37, glow:true}
];

function drawBuilding(g, x, w, h, baseY, o, rnd){
  var y = baseY - h, body = [], wins = [], r = rnd();
  var grad = g.createLinearGradient(0, y, 0, baseY);
  grad.addColorStop(0, o.top); grad.addColorStop(1, o.bot);
  g.fillStyle = grad;
  if(r < .28){                                   // stepped tower
    var iw = w * (.55 + rnd()*.2), ix = x + (w - iw) * (.2 + rnd()*.6), mh = h * (.55 + rnd()*.15);
    body.push([x, baseY - mh, w, mh]); body.push([ix, y, iw, h - mh + 1]);
    wins.push([x, baseY - mh, w, mh]); wins.push([ix, y, iw, h - mh]);
    body.forEach(function(b){ g.fillRect(b[0], b[1], b[2], b[3]); });
  } else if(r < .42){                            // slanted roof
    var sl = h * (.05 + rnd()*.05);
    g.beginPath(); g.moveTo(x, baseY); g.lineTo(x, y + sl); g.lineTo(x + w, y); g.lineTo(x + w, baseY); g.closePath(); g.fill();
    body.push([x, y + sl, w, h - sl]); wins.push([x, y + sl + 2, w, h - sl - 2]);
  } else {
    g.fillRect(x, y, w, h); body.push([x, y, w, h]); wins.push([x, y, w, h]);
  }
  g.fillStyle = o.rim;
  body.forEach(function(b){ g.fillRect(b[0], b[1], b[2], 1.2); g.fillRect(b[0], b[1], 1.2, b[3]); });
  wins.forEach(function(s){
    for(var wy = s[1] + 8; wy < baseY - 6 && wy < s[1] + s[3] - 4; wy += o.cell * 1.35){
      for(var wx = s[0] + 6; wx < s[0] + s[2] - o.win - 3; wx += o.cell){
        if(rnd() < o.lit){
          var c = o.cols[(rnd() * o.cols.length) | 0];
          g.fillStyle = c;
          if(o.glow){ g.shadowColor = c; g.shadowBlur = 6; }
          g.fillRect(wx, wy, o.win, o.win * 1.2);
        }
      }
    }
  });
  g.shadowBlur = 0;
  if(rnd() < o.ant){                             // antenna with beacon
    var ax = x + w * (.3 + rnd()*.4), len = 14 + rnd() * 26, col = rnd() < .5 ? '#ff5da2' : '#5df1ff';
    g.strokeStyle = '#0a0720'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(ax, y); g.lineTo(ax, y - len); g.stroke();
    g.fillStyle = col; g.shadowColor = col; g.shadowBlur = 10; g.beginPath(); g.arc(ax, y - len, 2, 0, 7); g.fill(); g.shadowBlur = 0;
  }
  if(rnd() < o.sign){                            // neon sign
    var col2 = ['#ff5da2', '#5df1ff', '#b967ff', '#ffb454'][(rnd() * 4) | 0], sx = x + w * (.15 + rnd() * .5), sy = y + h * (.15 + rnd() * .35);
    g.fillStyle = col2; g.shadowColor = col2; g.shadowBlur = 14; g.fillRect(sx, sy, 4, 24 + rnd() * 26); g.shadowBlur = 0;
  }
}

function drawLayer(cv, o){
  var r = o.ratio, rnd, bs, sum, k, x, i, rep;
  cv.width = Math.round(o.tile * 2 * r); cv.height = Math.round(o.h * r);
  cv.style.width = (o.tile * 2) + 'px'; cv.style.height = o.h + 'px';
  var g = cv.getContext('2d'); g.setTransform(r, 0, 0, r, 0, 0);
  for(rep = 0; rep < 2; rep++){
    rnd = mulberry32(o.seed); bs = []; sum = 0;
    while(sum < o.tile){ var w = (o.minW + rnd() * (o.maxW - o.minW)) * o.tile; bs.push({w:w, h:(o.minH + rnd() * (o.maxH - o.minH)) * o.h * .88}); sum += w; }
    k = o.tile / sum; x = rep * o.tile;
    for(i = 0; i < bs.length; i++){ drawBuilding(g, x, bs[i].w * k, bs[i].h, o.h, o, rnd); x += bs[i].w * k; }
  }
  var fg = g.createLinearGradient(0, 0, 0, o.h);
  fg.addColorStop(0, 'rgba(0,0,0,0)'); fg.addColorStop(.5, 'rgba(0,0,0,0)'); fg.addColorStop(1, o.fog);
  g.fillStyle = fg; g.fillRect(0, 0, o.tile * 2, o.h);
}

var W = 0, H = 0, tile = 0, pitch = 0, layers = [], lineEls = [], lineData = [];
var polesEl = $('#poles'), linesEl = $('#lines');

function buildWorld(){
  W = window.innerWidth; H = window.innerHeight;
  tile = Math.max(W, 1.2 * H);
  var ratio = Math.max(.5, Math.min(1.25, window.devicePixelRatio || 1, 3800 / (2 * tile)));
  layers = CFG.map(function(c){
    var el = document.getElementById(c.id);
    drawLayer(el.firstElementChild, {tile:tile, h:Math.round(c.hFrac * H), ratio:ratio, minW:c.minW, maxW:c.maxW, minH:c.minH, maxH:c.maxH,
      top:c.top, bot:c.bot, rim:c.rim, lit:c.lit, cell:c.cell, win:c.win, cols:c.cols, ant:c.ant, sign:c.sign, fog:c.fog, seed:c.seed, glow:c.glow});
    return {el:el, f:c.f};
  });
  // stars
  var sv = $('#stars'), dpr = Math.min(2, window.devicePixelRatio || 1), sh = Math.round(H * .62);
  sv.width = Math.round(W * dpr); sv.height = Math.round(sh * dpr);
  var sg = sv.getContext('2d'), rnd = mulberry32(5); sg.setTransform(dpr, 0, 0, dpr, 0, 0);
  for(var i = 0; i < 170; i++){
    var sz = .6 + rnd() * 1.6; sg.fillStyle = 'rgba(' + (rnd() < .2 ? '255,200,230' : '225,240,255') + ',' + (.3 + rnd() * .7) + ')';
    sg.fillRect(rnd() * W, rnd() * sh, sz, sz);
  }
  // poles + speed lines
  pitch = Math.round(W * .42);
  polesEl.style.setProperty('--pitch', pitch + 'px'); polesEl.style.width = (W + pitch) + 'px';
  linesEl.innerHTML = ''; lineEls = []; lineData = [];
  var lr = mulberry32(99);
  for(var j = 0; j < 14; j++){
    var el = document.createElement('i'), len = 160 + lr() * 520;
    el.style.top = (30 + lr() * 42) + 'vh'; el.style.width = len + 'px'; el.style.opacity = (.25 + lr() * .6).toFixed(2);
    linesEl.appendChild(el); lineEls.push(el); lineData.push({len:len, x:lr() * (W + 700), f:1.6 + lr() * 1.6});
  }
  applyWorld(scroll, 0);
}

var scroll = 0;
function applyWorld(s, v){
  var i, off;
  for(i = 0; i < layers.length; i++){ off = mod(s * layers[i].f, tile); layers[i].el.style.transform = 'translate3d(' + (-off) + 'px,0,0)'; }
  polesEl.style.transform = 'translate3d(' + (-mod(s, pitch)) + 'px,0,0)';
  polesEl.style.opacity = clamp(v * 2.5, 0, 1);
  linesEl.style.opacity = reduce ? 0 : clamp(v * v, 0, 1) * .9;
  if(v > .02 && !reduce){
    for(i = 0; i < lineEls.length; i++){
      var d = lineData[i], x = mod(d.x - s * d.f, W + d.len + 200) - d.len;
      lineEls[i].style.transform = 'translate3d(' + x + 'px,0,0)';
    }
  }
}

/* ==================================================================
   SOUND (procedural WebAudio, off until the visitor turns it on)
   ================================================================== */
var Sound = (function(){
  var AC = window.AudioContext || window.webkitAudioContext, ctx, master, windG, windF, rumG, noiseBuf, on = false;
  function noise(){
    var len = ctx.sampleRate * 2, b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0), last = 0;
    for(var i = 0; i < len; i++){ last = (last + .02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3.5; }
    return b;
  }
  function init(){
    if(ctx || !AC) return;
    ctx = new AC(); master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
    noiseBuf = noise();
    var s1 = ctx.createBufferSource(); s1.buffer = noiseBuf; s1.loop = true;
    windF = ctx.createBiquadFilter(); windF.type = 'bandpass'; windF.frequency.value = 400; windF.Q.value = .7;
    windG = ctx.createGain(); windG.gain.value = 0; s1.connect(windF); windF.connect(windG); windG.connect(master); s1.start();
    var s2 = ctx.createBufferSource(); s2.buffer = noiseBuf; s2.loop = true;
    var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 140;
    rumG = ctx.createGain(); rumG.gain.value = .25; s2.connect(lp); lp.connect(rumG); rumG.connect(master); s2.start();
    [[58, 'sine', .05], [116, 'triangle', .018]].forEach(function(p){
      var o = ctx.createOscillator(), g = ctx.createGain(); o.type = p[1]; o.frequency.value = p[0]; g.gain.value = p[2];
      o.connect(g); g.connect(master); o.start();
    });
  }
  function tone(f, delay, dur, vol, type){
    if(!on) return; var t = ctx.currentTime + delay, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'sine'; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + .05);
  }
  function burst(dur, f0, f1, vol, delay){
    if(!on) return; var t = ctx.currentTime + (delay || 0), s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noiseBuf; f.type = 'bandpass'; f.Q.value = .9; f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + dur * .25); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(master); s.start(t, Math.random()); s.stop(t + dur + .05);
  }
  return {
    toggle: function(){
      init(); if(!ctx) return false; on = !on;
      if(on && ctx.resume) ctx.resume();
      master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setTargetAtTime(on ? .55 : 0, ctx.currentTime, .15);
      return on;
    },
    speed: function(v){
      if(!ctx || !on) return; var t = ctx.currentTime;
      windG.gain.setTargetAtTime(.55 * v * v, t, .12); windF.frequency.setTargetAtTime(300 + 1500 * v, t, .12); rumG.gain.setTargetAtTime(.25 + .5 * v, t, .15);
    },
    chime: function(){ tone(784, 0, .9, .28); tone(587, .3, 1.2, .28); },
    beeps: function(){ for(var i = 0; i < 3; i++) tone(1000, i * .22, .12, .1, 'square'); },
    swish: function(){ burst(.7, 500, 2400, .5); },
    arrive: function(sec){ burst(sec, 2600, 260, .8); },
    isOn: function(){ return on; }
  };
})();

/* ==================================================================
   STATE + HELPERS
   ================================================================== */
var app = $('#app'), cabin = $('#cabin'), platform = $('#platform'), train = $('#train'), flash = $('#flash');
var stA = $('#stA'), stB = $('#stB'), curEl = stA;
var map = $('#map'), mk = $('#mk'), mapFill = $('#mapFill'), led = $('#led'), ledK = $('#ledK'), ledV = $('#ledV');
var cur = -1, busy = false, doorsOpen = false, phase = 'intro', introAbort = false, stopStatic = null;
var stopEls = [];

function ledSet(k, v){ ledK.textContent = k; ledV.textContent = v; led.classList.remove('fl'); void led.offsetWidth; led.classList.add('fl'); }
function look(el, st){ el.style.setProperty('--c', st.color); $('.st-no', el).textContent = st.no; $('.st-name', el).textContent = st.name; }
function say(t){ $('#sr-live').textContent = t; }
function setMarker(p){ mk.style.left = p + '%'; mapFill.style.width = p + '%'; }
function setAccent(c){ app.style.setProperty('--accent', c); }
function setCurrentNode(i){ stopEls.forEach(function(b, k){ if(k === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); }); }
function setDoors(open){ doorsOpen = open; cabin.classList.toggle('open', open); }

/* route map */
STATIONS.forEach(function(s, i){
  var b = document.createElement('button');
  b.type = 'button'; b.className = 'stop'; b.style.left = posOf(i) + '%'; b.style.setProperty('--accent', s.color);
  b.setAttribute('aria-label', 'Go to ' + s.name); b.innerHTML = '<span>' + s.name + '</span>';
  b.addEventListener('click', function(){ go(i); });
  map.insertBefore(b, mk); stopEls.push(b);
});

/* contact */
(function(){
  var a = $('#mailLink'); a.href = 'mailto:' + CONTACT_EMAIL; a.textContent = CONTACT_EMAIL;
  $('#copyBtn').addEventListener('click', function(){
    var b = this, ok = function(){ b.textContent = 'Copied'; setTimeout(function(){ b.textContent = 'Copy'; }, 1600); };
    if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(CONTACT_EMAIL).then(ok, function(){}); }
    else { var t = document.createElement('textarea'); t.value = CONTACT_EMAIL; document.body.appendChild(t); t.select();
      try{ document.execCommand('copy'); ok(); }catch(e){} t.remove(); }
  });
})();

/* "no signal" TV */
function startStatic(cv){
  var g = cv.getContext('2d'), w = cv.width, h = cv.height, img = g.createImageData(w, h), id = 0, last = 0;
  function frame(t){
    if(t - last > 70){
      last = t; var d = img.data;
      for(var i = 0; i < d.length; i += 4){ var v = (Math.random() * 255) | 0; d[i] = v * .7 | 0; d[i+1] = v; d[i+2] = v; d[i+3] = 255; }
      g.putImageData(img, 0, 0);
    }
    if(!reduce) id = requestAnimationFrame(frame);
  }
  id = requestAnimationFrame(frame);
  return function(){ cancelAnimationFrame(id); };
}

function showCard(i){
  $$('.card').forEach(function(c){ c.classList.remove('show', 'out'); });
  var c = $$('.card')[i]; c.classList.add('show'); c.scrollTop = 0;
  if(stopStatic){ stopStatic(); stopStatic = null; }
  if(i === 3) stopStatic = startStatic($('#tvCanvas'));
  var h = $('h2', c); if(h){ try{ h.focus({preventScroll:true}); }catch(e){} }
}
function hideCard(){
  var c = $('.card.show'); if(stopStatic){ stopStatic(); stopStatic = null; }
  if(!c) return Promise.resolve();
  c.classList.add('out'); c.classList.remove('show');
  return wait(300).then(function(){ c.classList.remove('out'); });
}

/* ==================================================================
   TRAVEL
   ================================================================== */
var A = .28;
var prof = function(t){ return t < A ? t*t/(2*A)/(1-A) : t <= 1-A ? (A/2 + (t-A))/(1-A) : 1 - ((1-t)*(1-t)/(2*A))/(1-A); };
var vel  = function(t){ return Math.min(1, t/A, (1-t)/A); };

function runTravel(from, to, nextEl, target){
  return new Promise(function(resolve){
    var dir = Math.sign(to - from), hops = Math.abs(to - from), K = Math.max(2.4 * W, 1800), Ktot = hops * K;
    var T = reduce ? .8 : 3.4 + 1.1 * (hops - 1), base = scroll, t0 = performance.now(), announced = false;
    var pA = posOf(from), pB = posOf(to);
    nextEl.style.transform = 'translate3d(' + (dir * Ktot) + 'px,0,0)'; nextEl.style.display = 'block';
    function frame(now){
      var t = clamp((now - t0) / (T * 1000), 0, 1), p = prof(t), v = vel(t);
      scroll = base + dir * p * Ktot;
      applyWorld(scroll, v);
      curEl.style.transform = 'translate3d(' + (-dir * p * Ktot) + 'px,0,0)';
      nextEl.style.transform = 'translate3d(' + (dir * Ktot * (1 - p)) + 'px,0,0)';
      setMarker(pA + (pB - pA) * p);
      if(!reduce) cabin.style.transform = 'translate3d(0,' + (Math.sin(now * .05) * .8 * v).toFixed(2) + 'px,0)';
      Sound.speed(v);
      if(!announced && t > .72){ announced = true; ledSet('Now arriving', target.name); }
      if(t < 1) requestAnimationFrame(frame);
      else { cabin.style.transform = ''; Sound.speed(0); applyWorld(scroll, 0); resolve(); }
    }
    requestAnimationFrame(frame);
  });
}

async function go(to){
  if(busy || to === cur || phase !== 'cabin') return;
  busy = true; map.classList.add('busy'); map.classList.remove('attn');
  var target = STATIONS[to];
  if(doorsOpen){
    await hideCard(); await wait(150);
    Sound.beeps(); ledSet('Attention', 'Doors closing'); await wait(900);
    setDoors(false); Sound.swish(); await wait(1300);
  }
  var nextEl = curEl === stA ? stB : stA;
  look(nextEl, target);
  ledSet('Next station', target.name); setMarker(posOf(cur)); await wait(450);
  await runTravel(cur, to, nextEl, target);
  curEl.style.display = 'none'; curEl.style.transform = ''; curEl = nextEl; curEl.style.transform = 'translate3d(0,0,0)';
  cur = to; setAccent(target.color); setCurrentNode(to);
  Sound.chime(); ledSet('Arrived', target.name); say('Arrived at ' + target.name); await wait(650);
  Sound.swish(); setDoors(true); await wait(1250);
  showCard(to); ledSet('Doors open', target.name);
  try{ history.replaceState(null, '', '#' + target.id); }catch(e){}
  document.title = target.name + ' · CSLLABS';
  map.classList.remove('busy'); busy = false;
}

/* ==================================================================
   INTRO: platform -> boarding -> cabin
   ================================================================== */
function enterCabin(){
  phase = 'cabin'; document.body.classList.add('in-cabin');
  platform.style.display = 'none'; cabin.classList.add('on');
  look(stA, TERMINAL); stA.style.display = 'block'; stA.style.transform = 'translate3d(0,0,0)'; curEl = stA;
}

async function intro(){
  var led2 = $('#plLedTxt');
  await wait(600); if(introAbort) return;
  train.classList.add('arrive'); led2.textContent = 'CSLLABS Express · Arriving'; Sound.arrive(7);
  await wait(7100); if(introAbort) return;
  Sound.chime(); train.classList.add('open'); led2.textContent = 'CSLLABS Express · Boarding'; Sound.swish();
  await wait(1200); if(introAbort) return;
  $('#tag').classList.add('show');
  await wait(2200); if(introAbort) return;
  $('#boardBtn').classList.add('show');
}

async function board(){
  if(phase !== 'intro') return; introAbort = true;
  $('#boardBtn').classList.remove('show'); $('#boardBtn').style.pointerEvents = 'none';
  $('#skipBtn').style.display = 'none';
  Sound.swish();
  platform.classList.add('zoom');
  await wait(1750); flash.classList.add('on');
  await wait(380);
  enterCabin(); setDoors(true); setMarker(0);
  await wait(250); flash.classList.remove('on');
  await wait(900);
  Sound.beeps(); ledSet('Attention', 'Doors closing'); await wait(900);
  setDoors(false); Sound.swish(); await wait(1300);
  ledSet('CSLLABS Express', 'Select destination'); say('Doors closed. Select a station on the line map.');
}

function skip(){
  if(phase !== 'intro') return; introAbort = true;
  enterCabin(); setDoors(false); setMarker(0);
  ledSet('CSLLABS Express', 'Select destination');
}

function openDirect(i){
  introAbort = true; enterCabin();
  var s = STATIONS[i]; look(stA, s); cur = i; setAccent(s.color); setCurrentNode(i); setMarker(posOf(i)); map.classList.remove('attn');
  setDoors(true); showCard(i); ledSet('Doors open', s.name); document.title = s.name + ' · CSLLABS';
}

/* ---------- wiring ---------- */
$('#boardBtn').addEventListener('click', board);
$('#skipBtn').addEventListener('click', skip);
$('#sndBtn').addEventListener('click', function(){
  var on = Sound.toggle(); this.setAttribute('aria-pressed', on ? 'true' : 'false');
  this.setAttribute('aria-label', on ? 'Sound on. Press to turn sound off.' : 'Sound off. Press to turn sound on.');
});
window.addEventListener('keydown', function(e){
  if(phase !== 'cabin' || busy) return;
  if(e.key === 'ArrowRight') go(clamp(cur + 1, 0, STATIONS.length - 1));
  if(e.key === 'ArrowLeft') go(clamp(cur - 1, 0, STATIONS.length - 1));
});
var rt = 0;
window.addEventListener('resize', function(){ clearTimeout(rt); rt = setTimeout(buildWorld, 250); });

buildWorld();
var h0 = location.hash.replace('#', ''), di = -1;
STATIONS.forEach(function(s, i){ if(s.id === h0) di = i; });
if(di >= 0) openDirect(di); else intro();

})();
