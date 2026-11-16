/* SPECTRUM prism home — states, camera, input. Prototype only: not wired into the live site. */
(function () {
  'use strict';
  var O = PrismOptics, d = document, B = d.body, $ = function (s) { return d.querySelector(s); };
  var Q = new URLSearchParams(location.search);
  var RM = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var COARSE = matchMedia('(pointer:coarse)').matches;
  var LIVE = 'https://smh2287.github.io/drafts/1113-site/';
  var IMG = 'https://songfamhome.synology.me/portfolio2026/';
  /* Names, years, titles and role lines are the ones on the live site (index.html, work.html, p/*.html). */
  var PROJECTS = [
    { id: 'mercedes', name: 'Mercedes-Benz CLE Cabriolet', year: '2025', title: '2025 Mercedes-Benz : CLE CABRIOLET', line: 'AI-integrated high quality automotive visualization.', img: IMG + 'mercedes/08-ext-front34-ll-20261116@1280.webp', alt: 'Front three-quarter view, roof open' },
    { id: 'kia2022', name: 'KIA × K’arts IAC 2022', year: '2022 – 2023', title: '2022 KIA : MDEK MOBILITY LINEUP', line: 'Interior and exterior research / visualization team leader, designer.', locked: true },
    { id: 'hyundai2022', name: 'HYUNDAI × K’arts IAC 2022', year: '2022 – 2023', title: '2022 HYUNDAI : MOBED ROBOTIC APPLICATIONS', line: 'Robotics research / project manager, visualization team leader.', locked: true },
    { id: 'kia2021', name: 'KIA × K’arts IAC 2021', year: '2021', title: '2021 KIA : CPS MOBILITY', line: 'Interior research / visualization team leader.', locked: true },
    { id: 'vishow', name: 'VISHOW', year: '2019–2022', title: '2019–2022 VISHOW : CREATIVE VISUALIZATION', line: 'VISHOW visualization team (2020 – 2022) / visualization artist.', img: IMG + 'vishow/01-collection-dith-20261116@1280.webp', alt: 'Rows of gold car trophies on VISHOW plinths' },
    { id: 'niva', name: 'Nike NIVA', year: '2020', title: '2020 NIKE : NIVA', line: 'Co-project, concept.', img: IMG + 'niva/01-helmet@1280.webp', alt: 'Close-up of the NIVA helmet' }
  ];
  var TEXT_ONLY = { after: 2, text: 'SAMSUNG × K’arts, wearable research / 2022' };   // no page on the site: a line, not a link
  var N = PROJECTS.length;
  var SHORT = { mercedes: 'MERCEDES-BENZ', kia2022: 'KIA 2022', hyundai2022: 'HYUNDAI 2022', kia2021: 'KIA 2021', vishow: 'VISHOW', niva: 'NIKE NIVA' };   // the word that sits at the light
  var MAIL = 'songminh0442@gmail.com';             // public in the portfolio PDF; the only contact action is this mailto
  var PDIM = num('pdim', 0.03, 0, 1), PBW = num('pbw', 1.25, 0.5, 3);   // Projects: how much of the rest of the spectrum stays visible beside the project's colour (linear; the fan is HDR, 0.03 still reads), and the width of that colour band
  var PKEY = num('pkey', 1.2, 0, 4);              // Projects: strength of the key card on the glass
  var FLOOD_FIX = Q.get('flood') != null ? num('flood', 0, 0, 1) : null;
  var CSTEP = Q.get('cstep') !== '0';              // Home: one step back (wheel up / swipe right / arrow left) goes to Contact; ?cstep=0 turns that off

  /* ---------- options (URL or keys; none of this is page chrome) ---------- */
  function num(k, d, lo, hi) { var v = Q.get(k); v = v == null || v === '' || isNaN(+v) ? d : +v; return Math.max(lo, Math.min(hi, v)); }
  var HOPT = { hs: +Q.get('hs') || 0, hx: Q.get('hx') != null ? +Q.get('hx') : null, hy: Q.get('hy') != null ? +Q.get('hy') : null, hd: +Q.get('hd') || 0 };
  var opt = {
    optics: O.MATERIAL[Q.get('optics')] ? Q.get('optics') : 'approved',
    falloff: Q.get('falloff') === 'physical' ? 'physical' : 'approved',
    secondary: Q.get('secondary') == null ? 0.18 : Math.max(0, Math.min(1, +Q.get('secondary'))),   // 1 = true Fresnel ratio at this exposure
    q: Q.get('q'),                       // high | mid | low → fixed; absent → auto
    snap: Q.get('snap') === '1' || RM,   // no camera travel
    sp: Q.get('sp') === '4' ? 0 : 1,     // 1 = continuous 16-wavelength ramp, ?sp=4 = the old four-lobe fan
    bloom: num('bloom', 1, 0, 3),        // entry bloom + wedge glow
    paper: num('paper', 0.6, 0, 1),      // paper grain of the floor (off in low power)
    slit: num('slit', 0.65, 0.3, 1.5),   // Home close-up: slit width relative to the approved beam (1 everywhere else)
    leg: num('leg', 0.85, 0, 1),         // Home: translucent glass legs (floor seen through the side band)
    debug: Q.get('debug') === '1'
  };
  if (Q.get('ui') === '0') B.classList.add('bare');
  if (COARSE) B.classList.add('touch');

  /* ---------- WebGL ----------
     Pass 5 (freeze fix). Nothing here may stall the browser's GPU process:
     - programs are compiled in the background (KHR_parallel_shader_compile) and never queried before they are done;
     - every scene draw is a scissored band of bounded size, rendered into an offscreen frame and presented by a trivial blit;
     - no new GPU work is queued while the previous slice is unfinished (WebGL2 fence; WebGL1: rAF-gap heuristic). */
  var canvas = $('#c'), gl = null, glOK = false, GL2 = false, EXT = {}, progs = {}, blit = null, rampTex = null, paperTex = null;
  var TILE = Q.get('tile') !== '0', FXAA = Q.get('fxaa') !== '0', DBG = Q.get('dbg') === '1' || opt.debug, lostN = 0, bootFrames = 0;
  var UNI = ['res', 'shift', 'rc', 'camE', 'camF', 'camR', 'camU', 'nrgb', 'lens', 'aa', 'farGain', 'selT', 'selAmt', 'dimAmt', 'amb', 'air', 'rb[0]', 'rail', 'railP', 'atlas', 'cd[0]', 'key', 'glow', 'ab', 'ramp', 'paper', 'SIG2', 'rampE', 'spK', 'fanK', 'rampS', 'bloom', 'pap', 'legT', 'jitter', 'samplePass', 'bandW'];
  function fail(msg) {
    glOK = false; B.classList.add('nogl'); B.classList.remove('live');
    var e = $('#error'); e.hidden = false; e.textContent = msg;
  }
  function makeProgram(src, names) {                 // compile + link are only *requested* here; see pollProgram
    var P = { p: gl.createProgram(), names: names, loc: {}, ready: false, failed: false, t0: performance.now(), ms: 0 };
    P.vs = gl.createShader(gl.VERTEX_SHADER); gl.shaderSource(P.vs, src.vs); gl.compileShader(P.vs);
    P.fs = gl.createShader(gl.FRAGMENT_SHADER); gl.shaderSource(P.fs, src.fs); gl.compileShader(P.fs);
    gl.attachShader(P.p, P.vs); gl.attachShader(P.p, P.fs); gl.bindAttribLocation(P.p, 0, 'p'); gl.linkProgram(P.p); gl.flush();
    return P;
  }
  function pollProgram(P) {                          // true once usable. Never blocks when the parallel-compile extension exists.
    if (!P || P.failed) return false; if (P.ready) return true;
    if (EXT.par) { if (!gl.getProgramParameter(P.p, EXT.par.COMPLETION_STATUS_KHR)) return false; }
    else if (bootFrames < 3) return false;           // no extension: the status query below blocks, so let the text paint first
    if (!gl.getProgramParameter(P.p, gl.LINK_STATUS)) {
      if (gl.isContextLost && gl.isContextLost()) return false;
      P.failed = true; P.err = String(gl.getProgramInfoLog(P.p) || gl.getShaderInfoLog(P.fs) || gl.getShaderInfoLog(P.vs) || 'link failed').slice(0, 300); return false;
    }
    gl.useProgram(P.p); P.names.forEach(function (k) { P.loc[k] = gl.getUniformLocation(P.p, k); });
    if (P.loc.atlas) { gl.uniform1i(P.loc.atlas, 0); } if (P.loc.ramp) gl.uniform1i(P.loc.ramp, 1); if (P.loc.paper) gl.uniform1i(P.loc.paper, 2); if (P.loc.t) gl.uniform1i(P.loc.t, 3);
    P.ready = true; P.ms = performance.now() - P.t0; return true;
  }
  function sceneProgram(cards) { return makeProgram(PRISM_BUILD({ gl2: GL2, lod: EXT.lod, cards: cards }), UNI); }
  function ensureCardsProgram() { if (glOK && !progs.cards) progs.cards = sceneProgram(true); }
  function setupGL() {                               // also used after a restored context
    var hp = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
    if (!hp || !hp.precision) throw Error('highp float is not available in fragment shaders');
    EXT.par = Q.get('par') === '0' ? null : gl.getExtension('KHR_parallel_shader_compile');
    EXT.lod = GL2 || !!gl.getExtension('EXT_shader_texture_lod');
    gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    // texture units: 0 = about atlas (loaded on demand), 1 = spectrum ramp (rewritten when the optics change), 2 = paper grain, 3 = offscreen frame being presented
    rampTex = gl.createTexture(); gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, rampTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, O.RAMP.W, O.RAMP.R, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(O.RAMP.W * O.RAMP.R * 4));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    paperTex = gl.createTexture(); gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, paperTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([128, 128, 128, 0]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.activeTexture(gl.TEXTURE0);
    glOK = true;
    blit = makeProgram(PRISM_BLIT(GL2), ['t', 'sr', 'tp', 'fx']);
    progs = { base: sceneProgram(false), cards: null };   // `cards` (About images inside the glass) is compiled when About is first needed
  }
  try {
    var glo = { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'high-performance' };
    if (Q.get('gl') !== '1') { try { gl = canvas.getContext('webgl2', glo); } catch (e2) { gl = null; } GL2 = !!gl; }
    if (!gl) gl = canvas.getContext('webgl', glo);
    if (!gl) throw Error('WebGL is not available');
    setupGL();
  } catch (err) {
    gl = null; fail('The live prism needs WebGL (' + err.message + '). The projects below still work.');
  }
  canvas.addEventListener('webglcontextlost', function (e) {
    e.preventDefault(); lostN++; glOK = false; dropFrames(); if (raf) { cancelAnimationFrame(raf); raf = 0; }
    B.classList.remove('live'); var el = $('#error'); el.hidden = false; el.textContent = 'Graphics paused. Project links remain available.';
  });
  canvas.addEventListener('webglcontextrestored', function () {      // rebuild in place: a reload here could loop (load → heavy draw → lost → reload …)
    if (lostN > 2) { fail('Graphics stopped after repeated resets. Reload to retry; project links remain available.'); return; }
    try {
      setupGL(); P_MAX = Math.max(32768, Math.min(P_MAX, budgetPx * 0.5)); budgetPx = P_MIN;     // come back gently
      tex.started = tex.ready = tex.failed = false; paperState = 0; rampDirty = true; rtW = rtH = 0;
      $('#error').hidden = true; allocTargets(); ensurePaper(); if (state === 'about') loadCards(); invalidate();
    } catch (err) { fail('Graphics could not be restored (' + err.message + '). Reload to retry.'); }
  });

  var stat = { draws: 0, maxDrawPx: 0, sliceMs: 0, emaMs: 0, blocked: 0, slices: 0, frames: 0, solveRun: 0, solveHit: 0, shrink: 0 };
  /* ---------- optics state ---------- */
  var DEG = Math.PI / 180;
  var AB_DELTA = (Q.get('abd') != null ? +Q.get('abd') : 10) * DEG, AB_AZ = 0, AB_BASE = 0;   // about: the front face is turned AB_DELTA away from the camera; azimuth and rest rotation follow from the optics window
  var solveCache = new Map(), rampDirty = true, mat, win, rotHome, rotP1, HOME_AZ = 90 * DEG, solved = null, solvedRot = 99, solvedG = 1, solvedNk = 1;
  var NK_HOME = Q.get('nk') != null ? +Q.get('nk') : 0.955, ROT_FIX = Q.get('rot') != null ? +Q.get('rot') * DEG : null;   // ?rot=deg freezes the prism rotation (checks)
  function setOptics(name) {
    opt.optics = name; mat = O.MATERIAL[name]; win = O.windowFor(mat);
    // Home title pose: exactly upright (apex up, base horizontal) = world rotation 60°. With the approved index a
    // horizontal beam is totally reflected there (window top ≈55°), so near that pose the floor-light index is
    // scaled down by NK_HOME (see nkFor). `?hr=0..1` restores the old in-window pose, `?nk=` overrides the scale.
    rotHome = Q.get('hr') != null ? win[0] + (win[1] - win[0]) * +Q.get('hr') : (Q.get('hrot') != null ? +Q.get('hrot') : 38) * DEG;
    // Title pose v2 (Minho): prism upright on screen, beam rising in from the lower left, spectrum leaving to the right at a shallow angle.
    // Physically exact with the approved indices: rot 38° sits inside the direct-transmission window (34–55°), so no index cheat (nk=1).
    // The camera is rolled by (60° − rot) so the prism stays upright; beam on screen rises (60°−rot), the fan leaves ≈ (41° − (60° − rot)) below horizontal.
    HOME_AZ = 90 * DEG + (60 * DEG - rotHome);
    rotP1 = win[1];                                 // pass 7: Projects uses the window up to its top (≤55°); the index scale is 1 everywhere inside it
    projRots();
    solvedRot = 99;
    // about: rest on the middle of the transmission window so the spectrum is valid on all three faces
    AB_BASE = (win[0] + win[1]) / 2; AB_AZ = 270 * DEG - AB_BASE + AB_DELTA - 120 * DEG;   // the prism looks the same every 120°: this equivalent pose is ≈15° (not ≈105°) of spin and ≈25° (not ≈145°) of camera roll away from Home
  }
  function lightOK(r) {                    // true where R, G, B and V leave through the same face after the same number of bounces
    var ps = ['r', 'g', 'b', 'v'].map(function (k) { return O.path(mat.n(O.TC[k]), r); }), g = ps[1];
    return !!g && !!g.main && ps.every(function (p) { return p && p.main && p.main.bounce === g.main.bounce && p.main.face === g.main.face; });
  }
  function lightGain(r) { var e = 2.5 * DEG; return lightOK(r) && lightOK(r - e) && lightOK(r + e) ? 1 : 0; }
  /* Pass 7 — Projects as a monochromator. PT = one fixed floor point, PS units down the fan. uAt(r) = spectral coordinate (0 violet … 1 red,
     the shader's own u) of the light that passes through PT at rotation r. The six project rotations space that colour evenly and the
     emphasised band IS the light at PT (selT = uAt(rot)): a slight turn of the prism changes the colour at the title. Only the rotation moves. */
  var PT = [0, 0], PROT = [], PS = num('ps', innerWidth / innerHeight < 0.9 ? 8 : 20, 6, 30), PTH = num('pth', 44.2, 40, 48) * DEG;
  function uAt(r) {
    var b = O.path(mat.n(O.TC.b), r), q = O.path(mat.n(O.TC.r), r); b = b && b.direct; q = q && q.direct; if (!b || !q) return 0.5;
    var lb = (PT[0] - b.X[0]) * b.dir[1] - (PT[1] - b.X[1]) * b.dir[0], lr = (PT[0] - q.X[0]) * q.dir[1] - (PT[1] - q.X[1]) * q.dir[0], dd = lb - lr;
    return Math.abs(dd) < 1e-7 ? 0.5 : Math.max(0, Math.min(1, 0.19 + 0.67 * lb / dd));
  }
  function projRots() {
    PT = [0.46 + PS * Math.cos(PTH), -0.08 + PS * Math.sin(PTH)];
    var hi = Math.min(win[1], 55 * DEG), lo = Math.max(win[0], 40 * DEG), u1 = uAt(hi), u0 = uAt(lo) + 0.004; PROT = [];
    for (var i = 0; i < N; i++) { var u = u1 - i * (u1 - u0) / (N - 1), a = lo, b = hi; for (var k = 0; k < 40; k++) { var m = (a + b) / 2; if (uAt(m) < u) a = m; else b = m; } PROT.push((a + b) / 2); }
  }
  var rotFor = function (s) {                      // piecewise linear through the six rotations (decreasing: the next project turns the front face to the left)
    var i = Math.max(0, Math.min(N - 2, Math.floor(s)));
    return Math.max(win[0], Math.min(win[1], PROT[i] + (PROT[i + 1] - PROT[i]) * (s - i)));
  };
  function nkFor(r) {                      // index scale of the floor light: 1 everywhere Projects can go, NK_HOME at the upright title pose and beyond
    if (Q.get('hr') != null) return 1;
    var x = Math.max(0, Math.min(1, (r - rotP1) / (60 * DEG - rotP1)));
    var y = Math.max(0, Math.min(7, r / DEG - 60));          // past upright (Home drag only) the scale keeps falling so the fan stays whole to ≈67°, then fades into the reflected beam
    return 1 - ((1 - NK_HOME) * x * (2 - x) + 0.0085 * y) * (1 - abAmt);
  }
  function solve(rot, g) {                 // g < 1 (about only): fade the light where the colour channels take different routes
    g = g == null ? 1 : g; var nk = nkFor(rot);
    if (solved && Math.abs(rot - solvedRot) < 1e-5 && g === solvedG && nk === solvedNk) return solved;
    // pass 8: results are kept per rotation rounded to 1e-4 rad (0.006°: far below one pixel of fan movement), so going back and forth
    // between projects / returning to a rest pose does not trace the 16 wavelengths and rebuild the ramp again. About's faded light (g < 1)
    // edits the arrays in place and is therefore never cached.
    var ck = g === 1 ? opt.optics + '|' + opt.secondary + '|' + opt.sp + '|' + nk.toFixed(5) + '|' + Math.round(rot * 1e4) : null, hit = ck && solveCache.get(ck);
    if (hit) { solved = hit; stat.solveHit++; }
    else {
      solved = O.solve(mat, rot, { secondary: opt.secondary, nk: nk, ramp: !!opt.sp }); stat.solveRun++;
      if (ck) { if (solveCache.size >= 360) solveCache.delete(solveCache.keys().next().value); solveCache.set(ck, solved); }
    }
    solvedRot = rot; solvedG = g; solvedNk = nk;
    if (g < 1) {
      var u = solved.ribbons, k;
      for (var sl = 0; sl < O.RB; sl++) { var gg = sl === 0 ? 0.35 + 0.65 * g : g, o4 = (sl * O.STRIDE + 4) * 4; for (k = 0; k < 4; k++) u[o4 + k] *= gg; }
      solved.rail[4] *= 0.4 + 0.6 * g;
    }
    rampDirty = true;
    return solved;
  }

  /* ---------- camera: orbital poses, basis built on the CPU ---------- */
  var aspect = function () { return innerWidth / innerHeight; };
  var portrait = function () { return aspect() < 0.9; };
  function poseFor(state, selF) {
    var a = aspect(), p = portrait();
    if (state === 'home') {
      // Straight down the long axis. Roll (= azimuth at the pole) puts the entry face on the left of an
      // apex-up triangle; telephoto so the far end of the prism reads as the thickness of the glass.
      // Pass 4: close, like the title art — the apex is cropped and the legs run off the frame (O.homePose: zoom + shift only).
      var hp = O.homePose(a, HOPT);
      return { az: Q.get('haz') != null ? +Q.get('haz') * DEG : HOME_AZ, el: 90 * DEG, dist: hp.dist, aim: [0, 0, 0], lens: hp.lens, shift: hp.shift, amb: 0.22, air: 0 };
    }
    if (state === 'about') {
      // Front view: one flat face toward the camera, prism standing on the left, its upper end leaves the frame.
      // The foot of the prism (and the light on the floor) is kept in frame: baseY = where the foot sits, in px from the top.
      var el = 3 * DEG, dist = p ? 11 : 10, aimY = p ? 1.6 : 1.95, lens = p ? +(Q.get('ablens') || 0.215) : +(Q.get('ablens') || 0.19);
      var baseY = p ? Math.round(innerHeight * 0.655) : Math.round(innerHeight * 0.87), sx = 0;
      if (!p && Q.get('absx')) sx = +Q.get('absx');
      else if (!p) {                                 // pass 5: the resting face stands on the site axis (--ax); the turning prism never takes more than ≈36 % of the width
        var W = innerWidth, axp = Math.max(16, (W - Math.max(980, 0.68 * W)) / 2), hw = O.RIN * innerHeight / (dist * lens);
        var kk = Math.min(1, 0.36 * W / (2 * hw)); lens /= kk; hw *= kk;
        sx = (2 * (axp + 0.866 * hw) / W - 1) * a;
      }
      var sy = (1 - 2 * baseY / innerHeight) + aimY * Math.cos(el) / ((dist + aimY * Math.sin(el)) * lens);
      return { az: AB_AZ, el: el, dist: dist, aim: [0, aimY, 0], lens: lens, shift: [sx, sy], amb: 1, air: 1 };
    }
    if (state === 'contact') {
      // Pass 9: beside the source, looking TOWARD the prism. Light stays in the composition; no white-out.
      var C = { az: 145 * DEG, el: (p ? 10 : 9) * DEG, dist: p ? 32 : 30,
        aim: [-6, 2, 0], lens: p ? 0.47 : 0.34, shift: [0, 0], amb: 1, air: 1 };
      var cf = toScreen(basis(C), [0, 0, 0]);
      if (cf) C.shift = [((p ? 0.72 : 0.78) * innerWidth - cf[0]) / innerWidth * 2 * a,
        -((p ? 0.55 : 0.73) * innerHeight - cf[1]) / innerHeight * 2];
      return C;
    }
    // Pass 9: near-orthographic editorial view. The fan axis is almost perpendicular to the view,
    // so it reads horizontally without rolling the upright column or changing the refraction.
    var P = { az: num('paz', 128, 0, 360) * DEG, el: num('pel', p ? 13 : 12, 2, 89) * DEG,
      dist: num('pd', p ? 39 : 35, 6, 80), lens: num('plens', p ? 0.43 : 0.34, 0.1, 1),
      roll: num('proll', 0, -45, 45) * DEG,
      aim: [0.46 + 0.5 * PS * Math.cos(PTH), 2, -0.08 + 0.5 * PS * Math.sin(PTH)],
      shift: [0, 0], amb: 1, air: 1 };
    var ft = toScreen(basis(P), [0, 0, 0]), fx = num('pfx', p ? 0.14 : 0.20, 0, 1), fy = num('pfy', p ? 0.50 : 0.66, 0, 1);
    if (ft) P.shift = [(fx * innerWidth - ft[0]) / innerWidth * 2 * a, -(fy * innerHeight - ft[1]) / innerHeight * 2];
    return P;
  }
  function mixPose(A, Bp, t) {
    var da = Bp.az - A.az; da -= Math.round(da / (2 * Math.PI)) * 2 * Math.PI;
    var L = function (x, y) { return x + (y - x) * t; }, G = function (x, y) { return Math.exp(L(Math.log(x), Math.log(y))); };
    return { amb: L(A.amb, Bp.amb), air: L(A.air, Bp.air), az: A.az + da * t, roll: L(A.roll || 0, Bp.roll || 0), el: L(A.el, Bp.el), dist: G(A.dist, Bp.dist), lens: G(A.lens, Bp.lens),
      aim: [L(A.aim[0], Bp.aim[0]), L(A.aim[1], Bp.aim[1]), L(A.aim[2], Bp.aim[2])], shift: [L(A.shift[0], Bp.shift[0]), L(A.shift[1], Bp.shift[1])] };
  }
  function basis(P) {
    var ce = Math.cos(P.el), se = Math.sin(P.el), ca = Math.cos(P.az), sa = Math.sin(P.az);
    var dir = [ce * ca, se, ce * sa], f = [-dir[0], -dir[1], -dir[2]];
    var u = [-se * ca, ce, -se * sa];                 // d(dir)/d(el): defined at the pole, no axis switch anywhere
    var r = [f[1] * u[2] - f[2] * u[1], f[2] * u[0] - f[0] * u[2], f[0] * u[1] - f[1] * u[0]];
    if (P.roll) {                                     // pass 8: camera roll about the view axis (a real camera move; the optics are untouched)
      var cR = Math.cos(P.roll), sR = Math.sin(P.roll), r2 = [cR * r[0] + sR * u[0], cR * r[1] + sR * u[1], cR * r[2] + sR * u[2]];
      u = [cR * u[0] - sR * r[0], cR * u[1] - sR * r[1], cR * u[2] - sR * r[2]]; r = r2;
    }
    return { e: [P.aim[0] + P.dist * dir[0], P.aim[1] + P.dist * dir[1], P.aim[2] + P.dist * dir[2]], f: f, r: r, u: u, lens: P.lens, shift: P.shift, amb: P.amb, air: P.air };
  }
  function toScreen(Bs, w) {                          // world point → CSS px (null when behind the camera)
    var v = [w[0] - Bs.e[0], w[1] - Bs.e[1], w[2] - Bs.e[2]], z = v[0] * Bs.f[0] + v[1] * Bs.f[1] + v[2] * Bs.f[2];
    if (z < 0.05) return null;
    var x = (v[0] * Bs.r[0] + v[1] * Bs.r[1] + v[2] * Bs.r[2]) / (z * Bs.lens) + Bs.shift[0];
    var y = (v[0] * Bs.u[0] + v[1] * Bs.u[1] + v[2] * Bs.u[2]) / (z * Bs.lens) + Bs.shift[1];
    return [(x / aspect() * 0.5 + 0.5) * innerWidth, (0.5 - y * 0.5) * innerHeight];
  }

  /* ---------- app state ---------- */
  var state = 'home', sel = 0;
  var ABV = (+Q.get('abv') || 2.25) * DEG;          // About: slow constant turn (rad/s), clockwise seen from above, until the next face/image comes round
  var abT = 0, abTimer = 0, abAmt = 0, abGain = 1;
  var selF = 0, selCur = 0, rot = 0, homeTurn = 0, selAmt = 0, dim = 1;
  var mvShown = false, selU = 0.5, pAmt = 0, flood = 0, floodShown = -1, pReady = null;   // selU: spectral coordinate of the emphasised band; flood: Contact white-out 0…1
  var pose, tween = null, cur = null;
  var dirty = true, raf = 0, last = 0;
  var easeIO = function (t) { return t * t * t * (t * (t * 6 - 15) + 10); };
  var DUR = { 'home>projects': 2.8, 'projects>home': 2.6, 'home>about': 2.6, 'about>home': 2.4, 'about>projects': 2.8, 'projects>about': 2.8, 'home>contact': 2.6, 'contact>home': 2.2, 'projects>contact': 2.8, 'contact>projects': 2.8, 'about>contact': 2.6, 'contact>about': 2.6 };

  function target() { return poseFor(state, selF); }
  function travel(from) {
    var to = target(), dur = opt.snap ? 0 : (DUR[from + '>' + state] || 1.2);
    if (!pose || dur === 0) { pose = to; tween = null; } else tween = { a: pose, b: to, t0: performance.now(), dur: dur * 1000 };
    invalidate();
  }
  function rotTarget() { return ROT_FIX != null ? ROT_FIX : state === 'home' || state === 'contact' ? rotHome + homeTurn : state === 'about' ? abT : rotFor(selF); }

  /* ---------- DOM ---------- */
  var list = $('#list'), items = [], silEl = $('#sil'), silImg = silEl.querySelector('img'), silT = 0;
  var urlOf = function (p) { return LIVE + 'p/' + p.id + '.html'; };      // pass 7: no in-between "entry" view; every project link is the real page (locked ones ask for the passcode there)
  PROJECTS.forEach(function (p, i) {
    var li = d.createElement('li'), a = d.createElement('a');
    a.href = urlOf(p);
    a.innerHTML = '<i>0' + (i + 1) + '</i><b></b><span class="y"> / ' + p.year + '</span>' + (p.locked ? '<span class="k">locked</span>' : '');
    a.querySelector('b').textContent = p.name;
    a.addEventListener('mouseenter', function () { if (state === 'projects') select(i); });
    a.addEventListener('focus', function () { if (state === 'projects') select(i); });
    a.addEventListener('click', function (e) { if (COARSE && state === 'projects' && i !== sel) { e.preventDefault(); select(i); } });   // touch: first tap turns the prism to it, second tap opens it
    li.appendChild(a); list.appendChild(li); items.push(li);
    if (i === TEXT_ONLY.after) { var t = d.createElement('li'); t.className = 'to'; t.innerHTML = '<i>—</i>'; t.appendChild(d.createTextNode(TEXT_ONLY.text)); list.appendChild(t); }
  });
  /* pass 8: the list and the "Projects" + vision header are hidden by default; the scene carries the page. A quiet index (six numbers)
     and an "all projects" switch sit at the bottom left; the switch shows the header block (body.plist). */
  var pix = $('#pix'), pixB = [], pall = $('#pall');
  PROJECTS.forEach(function (p, i) {
    var b = d.createElement('button'); b.type = 'button'; b.textContent = '0' + (i + 1); b.title = p.name; b.setAttribute('aria-label', 'Project ' + (i + 1) + ': ' + p.name);
    b.addEventListener('click', function () { select(i); }); pix.insertBefore(b, pall); pixB.push(b);
  });
  function setList(on) { if (B.classList.contains('plist') === on) return; B.classList.toggle('plist', on); pall.setAttribute('aria-expanded', on ? 'true' : 'false'); pall.textContent = on ? 'close list' : 'all projects'; }
  pall.addEventListener('click', function () { setList(!B.classList.contains('plist')); });
  if (Q.get('list') === '1') setList(true);
  if (Q.get('sil') === '0') B.classList.add('nosil');        // A/B switch: the silhouette plate is the only blend-mode layer of the page
  function setSil(p) {                                // the silhouette plate (sil/<id>.webp: grey, dark shape on white) — multiplied over the canvas, so it only exists where there is light
    if (silEl.dataset.id === p.id) return;
    var had = !!silEl.dataset.id; silEl.dataset.id = p.id; silEl.classList.remove('in'); silEl.classList.toggle('lk', !!p.locked); silEl.classList.toggle('profile', p.id === 'mercedes'); clearTimeout(silT);
    silT = setTimeout(function () { silImg.onload = function () { silEl.classList.add('in'); }; silImg.onerror = function () { silEl.classList.remove('in'); }; silImg.src = p.id === 'mercedes' ? 'sil/mercedes-side.webp?v=p9a' : 'sil/' + p.id + '.webp?v=p8'; }, had ? 260 : 0);
  }
  function paint() {
    var p = PROJECTS[sel], tt = p.title.split(' : ');
    B.dataset.state = state;
    items.forEach(function (li, i) { li.classList.toggle('on', i === sel); pixB[i].classList.toggle('on', i === sel); pixB[i].setAttribute('aria-current', i === sel ? 'true' : 'false'); });
    if (state !== 'projects' && Q.get('list') !== '1') setList(false);
    $('#ptl').href = $('#phit').href = urlOf(p);
    $('#pN').textContent = '0' + (sel + 1) + ' / 0' + N; $('#pT').textContent = SHORT[p.id] || p.name;
    $('#pS').textContent = (tt[1] || p.name) + ' — ' + p.year; $('#pO').textContent = p.locked ? 'open project (passcode)' : 'open project';
    setSil(p);
  }
  function hash() { return state === 'home' ? '#/' : state === 'about' ? '#/about' : state === 'contact' ? '#/contact' : '#/projects/' + PROJECTS[sel].id; }
  function go(next, nextSel, how) {                   // how: 'push' (default) | 'replace' | 'none'
    var from = state, changed = next !== state;
    state = next;
    if (nextSel != null) { sel = Math.max(0, Math.min(N - 1, nextSel)); selF = sel; }
    if (next === 'home' || next === 'contact') homeTurn = 0;
    if (next === 'about') { loadCards(); abKick(); } else clearTimeout(abTimer);
    if (changed && !opt.snap) {
      // The prism looks the same every 120°. Entering About restarts at the resting front face (image 1); every change of page then
      // takes the nearest equivalent rotation, so the prism never spins through the turns About's slow drift (or earlier drags) piled up.
      if (next === 'about') abT = AB_BASE;
      var rT0 = rotTarget(), TW = 120 * DEG, dr = rot - rT0;
      rot = rT0 + dr - Math.round(dr / TW) * TW;
    }
    paint();
    if (changed) travel(from); else invalidate();
    if (changed && next === 'contact') setTimeout(function () { if (state === 'contact') try { $('#cm').focus({ preventScroll: true }); } catch (e) {} }, opt.snap ? 1700 : 3300);   // keyboard lands on the one action
    if (how !== 'none' && hash() !== location.hash) history[changed && how !== 'replace' ? 'pushState' : 'replaceState'](null, '', hash());
  }
  function select(i) { if (i !== sel || selF !== i) go(state, i, 'replace'); }
  /* One step. dir > 0 = forward = wheel down / swipe left / drag left / arrow right or down. Everywhere forward turns the prism so that
     its front surface moves to the LEFT (rot decreases), the same way the finger moves. The story is laid out along the light:
     contact (the source, left) · home (the prism) · projects 1…6 (the spectrum, right). */
  function step(dir) {
    if (state === 'about') { var kc = Math.floor((abT - (AB_BASE - 60 * DEG)) / (120 * DEG)); abT = AB_BASE + (kc - dir) * 120 * DEG; invalidate(); return; }   // accelerate straight to the next (dir>0) or previous image
    if (state === 'contact') { if (dir > 0) go('home'); return; }
    if (state === 'home') { if (dir > 0) go('projects', 0); else if (CSTEP) go('contact'); return; }
    if (state === 'projects' && dir < 0 && sel === 0) { go('home'); return; }
    select(sel + dir);
  }
  function back() { if (state !== 'home') go('home'); }
  function fromHash(how) {
    var m = location.hash.match(/^#\/(projects|p|about|contact)?\/?([\w-]*)/) || [], idx = PROJECTS.findIndex(function (p) { return p.id === m[2]; });
    go(m[1] === 'p' || m[1] === 'projects' ? 'projects' : m[1] === 'about' ? 'about' : m[1] === 'contact' ? 'contact' : 'home', idx >= 0 ? idx : (m[1] ? sel : 0), how);   // old #/p/<id> links land on that project in Projects
  }
  addEventListener('popstate', function () { fromHash('none'); });
  d.addEventListener('click', function (e) {          // in-page links travel instead of jumping
    var a = e.target.closest && e.target.closest('a[href^="#/"]'); if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    if (a.getAttribute('href') !== location.hash) history.pushState(null, '', a.getAttribute('href'));
    fromHash('none');
  });

  /* ---------- input: one gesture forward/back, drag turns the prism ---------- */
  var wheelAcc = 0, wheelLock = 0;
  addEventListener('wheel', function (e) {
    if (state === 'about' && e.target && e.target.closest && e.target.closest('.atx')) { var sc = $('#atx'); if (sc.scrollHeight > sc.clientHeight + 1) return; }   // the text column scrolls by itself
    var now = performance.now(); if (now < wheelLock) return;
    var v = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;       // wheel down, or two fingers swiped to the left (deltaX > 0): forward
    wheelAcc += e.deltaMode === 1 ? v * 32 : v;
    if (Math.abs(wheelAcc) > 50) { step(wheelAcc > 0 ? 1 : -1); wheelAcc = 0; wheelLock = now + (state !== 'projects' || sel === 0 ? 900 : 380); }
  }, { passive: true });
  addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var k = e.key;
    if (k === 'ArrowDown' || k === 'ArrowRight' || k === 'PageDown') { step(1); e.preventDefault(); }
    else if (k === 'ArrowUp' || k === 'ArrowLeft' || k === 'PageUp') { step(-1); e.preventDefault(); }
    else if (k === 'Enter' && state === 'projects' && d.activeElement === B) location.href = urlOf(PROJECTS[sel]);
    else if (k === 'Enter' && state === 'home' && d.activeElement === B) go('projects', 0);
    else if (k === 'Escape') { if (state === 'projects' && B.classList.contains('plist')) setList(false); else back(); }
    else if (k === 'o') { var ks = Object.keys(O.MATERIAL); var kf = Math.round((abT - AB_BASE) / (120 * DEG)); setOptics(ks[(ks.indexOf(opt.optics) + 1) % ks.length]); abT = AB_BASE + kf * 120 * DEG; pose = target(); tween = null; resize(); }
    else if (k === 'f') { opt.falloff = opt.falloff === 'physical' ? 'approved' : 'physical'; invalidate(); }
    else if (k === 's') { opt.secondary = opt.secondary === 0 ? 0.18 : opt.secondary < 1 ? 1 : 0; solvedRot = 99; invalidate(); }
    else if (k === 'q') setQuality((quality + 1) % 3, true);
  });
  var drag = null;
  canvas.addEventListener('pointerdown', function (e) {
    if (e.button > 0) return;
    // k: radians per px so that the glass surface roughly follows the finger (About: the prism is ≈0.6 units "deep" at the grabbed face)
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY, s0: selF, a0: abT, moved: 0, touch: e.pointerType !== 'mouse', axis: 0, k: 2 * pose.dist * pose.lens / (0.6 * innerHeight) };
    canvas.setPointerCapture(e.pointerId); canvas.classList.add('drag');
  });
  canvas.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    var dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
    drag.moved = Math.max(drag.moved, Math.abs(dx), Math.abs(dy));
    if (!drag.axis && drag.moved > 8) drag.axis = Math.abs(dx) >= Math.abs(dy) ? 1 : 2;
    if (drag.axis !== 1) return;
    if (state === 'home') homeTurn = Math.max(-0.07, Math.min(0.07, dx * 0.0035));   // stays inside the transmission window around the title rotation; it settles back
    else if (state === 'about') { abT = drag.a0 + dx * drag.k; clearTimeout(abTimer); }   // pass 7: sign fixed — drag left = front surface to the left (was the other way round)
    else if (state === 'projects') {                  // drag left = next project = rot decreases = front surface to the left
      selF = Math.max(-0.3, Math.min(N - 0.7, drag.s0 - dx / Math.min(170, innerWidth / 3.4)));
      var n = Math.max(0, Math.min(N - 1, Math.round(selF))); if (n !== sel) { sel = n; paint(); history.replaceState(null, '', hash()); }
    }
    invalidate();
  });
  function drop(e) {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    var g = drag; drag = null; canvas.classList.remove('drag');
    homeTurn = 0; if (state === 'projects') selF = sel;
    if (g.touch && e) {
      var sx = e.clientX - g.x0, sy = e.clientY - g.y0;
      if (g.axis === 2 && Math.abs(sy) > 44) step(sy < 0 ? 1 : -1);                                                        // swipe up = forward
      else if (g.axis === 1 && Math.abs(sx) > 70 && (state === 'home' || state === 'contact')) step(sx < 0 ? 1 : -1);    // swipe left = forward (toward the spectrum), swipe right = back toward the light
    }
    invalidate();
  }
  canvas.addEventListener('pointerup', drop); canvas.addEventListener('pointercancel', drop);


  /* ---------- about: image slides standing inside the glass, one per side face (drawn in the shader) ---------- */
  var IMGS = [                                     // swap freely: any number, any size; each is cover-cropped to the 4:7 slide
    { src: 'about/portrait.webp', cap: 'Minho Song' },
    { src: 'about/office.webp', cap: 'At work' },
    { src: 'about/sup.webp', cap: 'Off work' }                   // Minho's candidates (Profile 1/Original: Personal.jpg, 20190730_142432.jpg); portrait stays fixed
  ];
  var capEl = $('#abcap'), abIdx = -1, cardK = 0, cardU = { glow: [0, 0, 0], key: [0, 1, 0, 0] }, cards = new Float32Array(12), tex = { started: false, ready: false, failed: false, mean: [] };
  var FACE_SLOT = [1, 2, 0];                       // face 2 is in front at the rest rotation, then face 0, then face 1
  function nearestFace(t) { return AB_BASE + Math.round((t - AB_BASE) / (120 * DEG)) * 120 * DEG; }
  function abKick() { clearTimeout(abTimer); }   // no more timed 120° jumps: About drifts slowly (ABV) and scroll/arrows accelerate to the next image
  function loadCards() {                           // all images → one atlas texture (a single sampler, one fetch per glass hit)
    if (!glOK || tex.started) return; tex.started = true; ensureCardsProgram();
    var n = IMGS.length, TW = Math.min(448, Math.floor(gl.getParameter(gl.MAX_TEXTURE_SIZE) / n)), TH = Math.round(TW * 1.75);
    var cv = d.createElement('canvas'), left = n; cv.width = TW * n; cv.height = TH;
    var cx = cv.getContext('2d'); cx.fillStyle = '#000'; cx.fillRect(0, 0, cv.width, TH);
    function done() {
      if (--left) return;
      try {
        var t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, t);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, cv);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        var sm = d.createElement('canvas'); sm.width = n * 6; sm.height = 10; var sx = sm.getContext('2d'); sx.drawImage(cv, 0, 0, sm.width, sm.height);
        var px = sx.getImageData(0, 0, sm.width, sm.height).data;
        for (var i = 0; i < n; i++) { var m = [0, 0, 0]; for (var y = 0; y < 10; y++) for (var x = 0; x < 6; x++) { var o = (y * sm.width + i * 6 + x) * 4; for (var c = 0; c < 3; c++) m[c] += Math.pow(px[o + c] / 255, 2.2) / 60; } tex.mean[i] = m; }
        tex.ready = true;
      } catch (e) { tex.failed = true; }           // e.g. file:// (tainted canvas): the glass simply stays empty
      invalidate();
    }
    IMGS.forEach(function (im, i) {
      var el = new Image();
      el.onload = function () {                    // cover-crop into the tile
        var k = Math.max(TW / el.naturalWidth, TH / el.naturalHeight), w = el.naturalWidth * k, h = el.naturalHeight * k;
        cx.save(); cx.beginPath(); cx.rect(i * TW, 0, TW, TH); cx.clip(); cx.drawImage(el, i * TW + (TW - w) / 2, (TH - h) * (im.top == null ? 0.5 : im.top), w, h); cx.restore(); done();
      };
      el.onerror = done; el.src = im.src;
    });
  }
  function updateCards(Bs) {                       // per face: visibility by facing, which image it carries, mirror sign
    var n = IMGS.length, best = 0, bi = -1, glow = [0, 0, 0];
    for (var i = 0; i < 3; i++) {
      var a = [30, 150, 270][i] * DEG - rot, cf = Math.cos(a - pose.az);
      var al = Math.max(0, Math.min(1, (cf - 0.45) / 0.4)); al = al * al * (3 - 2 * al) * abAmt * cardK;
      var turn = Math.round((rot - AB_BASE - FACE_SLOT[i] * 120 * DEG) / (360 * DEG)), k = 3 * turn + FACE_SLOT[i] + 1, idx = ((k % n) + n) % n;   // +1: AB_BASE moved by -120°, so the face that rests in front now has slot 2   // changes only while the face is at the back
      var flip = -Math.sin(a) * Bs.r[0] + Math.cos(a) * Bs.r[2] >= 0 ? 1 : -1;
      cards.set([al, idx / n, flip, 1 / n], i * 4);
      if (cf > best) { best = cf; bi = idx; }
      var m = tex.mean[idx]; if (m) for (var c = 0; c < 3; c++) glow[c] += al * m[c] * 0.16;
    }
    cardU.glow = glow;
    var ka = AB_AZ - 2 * AB_DELTA - 12 * DEG, ke = 16 * DEG;     // soft key card, placed where the resting front face mirrors it toward the camera
    // pass 7: Projects has its own soft key card (world az 156°, el 7°: mirrored toward the camera by the face that looks at it around the middle
    // of the project rotations), so the small prism reads as glass and glints as it turns. Blended with About's card by weight.
    var wA = 0.95 * abAmt, wP = PKEY * pAmt * (1 - abAmt), kp = 156 * DEG, kq = 7 * DEG;
    var kv = [wA * Math.cos(ke) * Math.cos(ka) + wP * Math.cos(kq) * Math.cos(kp), wA * Math.sin(ke) + wP * Math.sin(kq), wA * Math.cos(ke) * Math.sin(ka) + wP * Math.cos(kq) * Math.sin(kp)], kl = Math.hypot(kv[0], kv[1], kv[2]) || 1;
    cardU.key = [kv[0] / kl, kv[1] / kl, kv[2] / kl, wA + wP];
    if (state === 'about' && bi !== abIdx && bi >= 0) { abIdx = bi; capEl.textContent = '0' + (bi + 1) + ' / 0' + n + '   ' + IMGS[bi].cap; }
  }
  function layoutAbout() {                         // text column starts right of the widest silhouette of the turning prism; on phones below its foot
    var P = poseFor('about', 0), Bs = basis(P), R = 2 * O.RIN, st = d.documentElement.style;
    var e = toScreen(Bs, [R * Bs.r[0], 1, R * Bs.r[2]]), f = toScreen(Bs, [0, 0, 0]);
    if (e) st.setProperty('--abx', Math.round(e[0] + 34) + 'px');
    if (f) st.setProperty('--aby', Math.round(f[1]) + 'px');
  }

  /* ---------- resolution, quality, offscreen frames ---------- */
  var quality = opt.q === 'low' ? 2 : opt.q === 'mid' ? 1 : 0;
  var BUDGET = (COARSE ? 0.8e6 : 2.3e6) * (opt.q === 'high' ? 1.6 : 1), QS = [1, 0.58, 0.34];
  try { if (!opt.q && navigator.connection && navigator.connection.saveData) quality = 2; } catch (e) {}
  // Two offscreen frames of canvas size: `base` = the last complete frame (any scale, kept in the lower-left w×h of its
  // texture), the other one receives the frame in progress. The canvas itself is only ever written by the blit.
  var RT = [null, null], rtW = 0, rtH = 0, base = null, job = null, sceneRev = 1, shown = false;
  function dropFrames() { base = null; job = null; fence = null; RT = [null, null]; rtW = rtH = 0; }
  function allocTargets() {
    if (!glOK || !TILE || (RT[0] && rtW === canvas.width && rtH === canvas.height)) return;
    RT.forEach(function (r) { if (r) { gl.deleteFramebuffer(r.fb); gl.deleteTexture(r.tex); } });
    rtW = canvas.width; rtH = canvas.height; base = null; job = null;
    gl.activeTexture(gl.TEXTURE3);
    RT = [0, 1].map(function () {
      var r = { tex: gl.createTexture(), fb: gl.createFramebuffer(), w: 0, h: 0, rev: 0, scale: 0 };
      gl.bindTexture(gl.TEXTURE_2D, r.tex); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, rtW, rtH, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.bindFramebuffer(gl.FRAMEBUFFER, r.fb); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, r.tex, 0);
      return r;
    });
    gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.bindTexture(gl.TEXTURE_2D, null); gl.activeTexture(gl.TEXTURE0);
  }
  function resize() {                                 // the canvas is allocated once at the full target size; scale changes never re-allocate it
    var dpr = Math.min(devicePixelRatio || 1, 1.5), w = innerWidth * dpr, h = innerHeight * dpr;
    var k = Math.min(1, Math.sqrt(BUDGET * QS[quality] / (w * h)));
    var cw = Math.max(2, Math.round(w * k)), ch = Math.max(2, Math.round(h * k));
    if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
    allocTargets();
    layoutHome(); layoutAbout(); layoutProjects(); layoutContact(); invalidate();
  }
  function setQuality(q, manual) {
    quality = q; solvedRot = 99;
    $('#lp').classList.toggle('on', quality === 2); $('#lp').textContent = quality === 2 ? 'low power on' : 'low power';
    B.classList.toggle('lowp', quality === 2); if (quality !== 2) makeGrain();
    ensurePaper();
    resize();
  }
  $('#lp').addEventListener('click', function () { setQuality(quality === 2 ? 0 : 2, true); });
  addEventListener('resize', function () { PS = num('ps', portrait() ? 8 : 20, 6, 30); projRots(); if (!tween) pose = target(); else tween.b = target(); resize(); });
  d.addEventListener('visibilitychange', function () { if (!d.hidden) invalidate(); });

  function layoutHome() {                             // hang the wordmark between the legs, lower centre (pass 4: from the pose numbers)
    var W = innerWidth, H = innerHeight, hp = O.homePose(aspect(), HOPT), st = d.documentElement.style;
    var ty = hp.portrait ? Math.max(hp.beamY + 0.085, hp.footBaseY - 0.122) : Math.min(0.668, hp.footBaseY - 0.16);
    var room = 2 * (ty + 0.06 - hp.footApexY) * H / Math.sqrt(3);                       // width of the floor footprint at the wordmark
    var tw = hp.portrait ? Math.min(0.74 * W, 340) : Math.max(260, Math.min(0.40 * W, 0.9 * room, 780));
    st.setProperty('--tx', (hp.cx * W).toFixed(1) + 'px'); st.setProperty('--ty', (ty * H).toFixed(1) + 'px');
    st.setProperty('--wf', (tw / 7.05).toFixed(2) + 'px'); st.setProperty('--ts', tw.toFixed(1) + 'px');
    // pass 7: the Contact label rides on the incoming beam (two projected points of the beam → position and angle)
    var Bh = basis(poseFor('home', 0)), p1 = toScreen(Bh, [-3, 0, O.BEAM_Z]), p2 = toScreen(Bh, [-6, 0, O.BEAM_Z]);
    if (p1 && p2 && Math.abs(p1[0] - p2[0]) > 1) {
      var cx = hp.portrait ? 0.17 * W : Math.max(0.085 * W, 96), kq = (cx - p2[0]) / (p1[0] - p2[0]);
      st.setProperty('--cx', cx.toFixed(1) + 'px'); st.setProperty('--cy', (p2[1] + (p1[1] - p2[1]) * kq).toFixed(1) + 'px');
      st.setProperty('--ca', (Math.atan2(p1[1] - p2[1], p1[0] - p2[0]) / DEG).toFixed(2) + 'deg');
    }
  }
  function layoutProjects() {                         // where the title point PT lands on screen → silhouette and title
    var t = toScreen(basis(poseFor('projects', 0)), [PT[0], 0, PT[1]]), st = d.documentElement.style, W = innerWidth, H = innerHeight;
    if (!t) return;
    st.setProperty('--px', t[0].toFixed(1) + 'px'); st.setProperty('--py', t[1].toFixed(1) + 'px');
    st.setProperty('--sw', Math.round(portrait() ? Math.min(0.64 * W, 0.36 * H) : Math.min(0.40 * W, 0.60 * H, 2 * (W - t[0]) - 40)) + 'px');
  }
  function layoutContact() {                          // the white-out grows from where the source is seen (the vanishing point of the beam)
    var t = toScreen(basis(poseFor('contact', 0)), [-60, 0.06, O.BEAM_Z]), st = d.documentElement.style;
    if (t) { st.setProperty('--lx', t[0].toFixed(1) + 'px'); st.setProperty('--ly', t[1].toFixed(1) + 'px'); }
  }
  var floodEl = $('#flood');
  function setFlood() {                               // bloom disc first (from the source), then the even warm white; the UI appears on the white
    var ss = function (a, b, x) { x = Math.max(0, Math.min(1, (x - a) / (b - a))); return x * x * (3 - 2 * x); }, st = floodEl.style;
    st.setProperty('--fd', ss(0, 0.3, flood).toFixed(3)); st.setProperty('--fs', (0.04 + 2.2 * easeIO(flood)).toFixed(3)); st.setProperty('--fo', ss(0.4, 1, flood).toFixed(3));
    floodEl.style.visibility = flood > 0 ? 'visible' : 'hidden';
    B.classList.toggle('flooded', flood > 0.86 && state === 'contact'); floodShown = flood;
  }
  /* ---------- film grain (pass 7): a DOM overlay, not part of the scene ----------
     One 256² noise tile (white / black specks with a little alpha, triangular distribution) on an oversized fixed layer whose
     transform jumps between a few offsets ≈11 times a second (CSS steps animation, compositor only). The scene is never redrawn
     for it. Static with prefers-reduced-motion, absent in low power. ?grain=0…3 scales the amount. */
  var grainEl = $('#grain');
  function makeGrain() {
    if (grainEl.dataset.ok) return; grainEl.dataset.ok = '1';
    var A = num('grain', 1, 0, 3); if (A <= 0) { grainEl.style.display = 'none'; return; }
    try {
      var n = 256, cv = d.createElement('canvas'); cv.width = cv.height = n; var cx = cv.getContext('2d'), im = cx.createImageData(n, n), px = im.data;
      for (var i = 0; i < n * n; i++) { var t = Math.random() + Math.random() - 1, o = i * 4, w = t > 0; px[o] = px[o + 1] = px[o + 2] = w ? 255 : 0; px[o + 3] = Math.min(255, Math.abs(t) * (w ? 10 : 17) * A); }
      cx.putImageData(im, 0, 0); grainEl.style.backgroundImage = 'url(' + cv.toDataURL() + ')';
      grainEl.style.backgroundSize = Math.round(256 / Math.max(1, Math.min(2, devicePixelRatio || 1))) + 'px';
    } catch (e) { grainEl.style.display = 'none'; }
  }
  /* ---------- paper grain: one tiling 512² texture, built once in JS (no image file) ----------
     R,G = surface gradient, B = height (albedo), A = sparse glint seeds. Own mip chain: gradient/height are averaged
     (the grain melts away with distance by itself), glints are picked, not averaged, so they stay sparse at every scale. */
  var paperState = 0;
  function ensurePaper() {
    if (!glOK || paperState || quality === 2 || opt.paper <= 0) return;
    paperState = 1;
    fetch('paper-grain.bin?v=perf2').then(function(r){ if(!r.ok) throw Error('paper asset'); return r.arrayBuffer(); }).then(function(data){
      if (!glOK) { paperState=0; return; }
      gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D,paperTex); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
      if(data.byteLength!==1398100)throw Error('incomplete paper mip chain');
      var bytes=new Uint8Array(data),offset=0;
      for(var level=0,sz=512;sz>=1;level++,sz>>=1){ var count=sz*sz*4; gl.texImage2D(gl.TEXTURE_2D,level,gl.RGBA,sz,sz,0,gl.RGBA,gl.UNSIGNED_BYTE,bytes.subarray(offset,offset+count)); offset+=count; }
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.REPEAT);
      gl.activeTexture(gl.TEXTURE0); paperState=2; invalidate();
    }).catch(function(){paperState=3; if(glOK)gl.activeTexture(gl.TEXTURE0); invalidate();});
  }
  /* ---------- time-sliced rendering ----------
     budgetPx = frame pixels (each with all its edge passes) submitted per animation frame. It starts at ≤96k, grows ×1.25
     while the GPU keeps up and shrinks when it does not (AIMD). One draw call never covers more than TILE_MAX_PX.
     Moving: the whole frame is rendered at a scale that fits the budget and shown when complete.
     Still: the frame is refined to full resolution band by band (top → bottom) over the last complete frame, then nothing runs. */
  var P_MIN = 8192, P_MAX = 4e6, TILE_MAX_PX = 262144, budgetPx = Math.min(96000, +Q.get('p0') || 96000);
  var LATE_OK = Q.get('bp') === '1' ? 0 : 1, PACE = Q.get('pace') != null ? num('pace', 0, 0, 100) : null;
  var fence = null, fenceT = 0, fenceBlocked = 0, submitT = 0, submitPx = 0, gapMin = 1e9, lastRaf = 0, lastMotion = 0;

  function fullPx() { return canvas.width * canvas.height; }
  function adapt(ms, blocked, used) {                 // ms: submit → observed completion (quantised to animation frames)
    stat.sliceMs = ms; stat.emaMs = stat.emaMs ? stat.emaMs * 0.8 + ms * 0.2 : ms;
    var g = Math.min(gapMin, 34), quick = Math.max(24, g * 1.35 + 3);   // g: the display's own frame interval (no display is slower than 30 Hz)
    // pass 8: ONE late frame no longer cuts the resolution (some mobile drivers signal the fence a frame late as a habit: the budget fell
    // to its floor there and motion turned to mush); it only stops the growth. Two or more late frames, or > 70 ms, still shrink. ?bp=1 = old rule.
    if (blocked > LATE_OK || ms > Math.max(70, g * 3)) { budgetPx = Math.max(P_MIN, budgetPx * (blocked > 2 || ms > 200 ? 0.4 : 0.65)); stat.shrink++; }
    else if (blocked > 0) { /* hold */ }
    else if (ms <= quick && used >= budgetPx * 0.7) budgetPx = Math.min(P_MAX, fullPx(), budgetPx * 1.25);
  }
  function uniforms(Pg, Bs, w, h) {                   // the complete state of one frame; set once when its job starts
    var l = Pg.loc, s = solved, useRamp = !!(opt.sp && s.rampOK);
    gl.useProgram(Pg.p);
    if (rampDirty && useRamp) {
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, rampTex); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, O.RAMP.W, O.RAMP.R, gl.RGBA, gl.UNSIGNED_BYTE, s.ramp); gl.activeTexture(gl.TEXTURE0); rampDirty = false;
    }
    gl.uniform4fv(l['rb[0]'], s.ribbons); gl.uniform4fv(l.rail, s.rail.subarray(0, 4)); gl.uniform1f(l.railP, s.rail[4]);
    if (useRamp) { gl.uniform1f(l.rampS, s.rampS); gl.uniform2f(l.rampE, s.rampU[0] - 0.03, s.rampU[1] + 0.04); }
    gl.uniform1f(l.spK, useRamp ? 1 : 0); gl.uniform1f(l.fanK, solvedG); gl.uniform3fv(l.nrgb, mat.rgb);
    gl.uniform2f(l.res, w, h); gl.uniform2fv(l.shift, Bs.shift);
    gl.uniform2f(l.rc, Math.cos(rot), Math.sin(rot));
    gl.uniform3fv(l.camE, Bs.e); gl.uniform3fv(l.camF, Bs.f); gl.uniform3fv(l.camR, Bs.r); gl.uniform3fv(l.camU, Bs.u);
    gl.uniform1f(l.lens, Bs.lens); gl.uniform1f(l.aa, quality === 0 ? 1 : 0);
    gl.uniform1f(l.farGain, opt.falloff === 'physical' ? 0 : 2.75);
    var homeAmt = (1 - selAmt) * (1 - abAmt), sl = 1 + (opt.slit - 1) * homeAmt; gl.uniform1f(l.SIG2, 0.00048 * sl * sl);
    gl.uniform1f(l.bloom, opt.bloom); gl.uniform1f(l.pap, quality !== 2 && paperState === 2 ? opt.paper : 0); gl.uniform1f(l.legT, opt.leg * (1 - selAmt) * (1 - abAmt));
    gl.uniform1f(l.selT, selU); gl.uniform1f(l.bandW, 1 + (PBW - 1) * pAmt); gl.uniform1f(l.selAmt, selAmt); gl.uniform1f(l.dimAmt, dim); gl.uniform1f(l.amb, Bs.amb); gl.uniform1f(l.air, Bs.air);
    gl.uniform4fv(l['cd[0]'], cards); gl.uniform1f(l.ab, abAmt); gl.uniform3fv(l.glow, cardU.glow); gl.uniform4fv(l.key, cardU.key);
  }
  function startJob(kind, Bs, f) {
    var cw = canvas.width, ch = canvas.height, k = 1;
    if (kind === 'motion' && TILE) { k = Math.sqrt(Math.max(24000, budgetPx * f) / (cw * ch)); if (k > 0.94) k = 1; }
    var j = { kind: kind, rev: sceneRev, scale: k, w: k === 1 ? cw : Math.max(2, Math.round(cw * k)), h: k === 1 ? ch : Math.max(2, Math.round(ch * k)), y: 0,
      rt: TILE ? RT[base === RT[0] ? 1 : 0] : null, prog: abAmt > 0 && cardK > 0 && pollProgram(progs.cards) ? progs.cards : progs.base };
    solve(rot, 1 - abAmt * (1 - abGain)); uniforms(j.prog, Bs, j.w, j.h); return j;
  }
  var JIT = [[-0.25, -0.25], [0.25, -0.25], [-0.25, 0.25], [0.25, 0.25]];
  function runSlice(j, px) {                          // scissored bands, top → bottom; returns the frame pixels submitted
    var l = j.prog.loc, left = px, cap = TILE ? TILE_MAX_PX : Infinity, done = 0;
    gl.bindFramebuffer(gl.FRAMEBUFFER, j.rt ? j.rt.fb : null); gl.viewport(0, 0, j.w, j.h); gl.useProgram(j.prog.p); gl.enable(gl.SCISSOR_TEST);
    while (left > 0 && j.y < j.h) {
      var rows = Math.max(1, Math.min(j.h - j.y, Math.floor(Math.min(left, cap) / j.w)));
      gl.scissor(0, j.h - j.y - rows, j.w, rows);
      // four edge samples, one scene call site: pass 0 shades every pixel, passes 1–3 only add the other samples on silhouette pixels
      gl.disable(gl.BLEND); gl.uniform1f(l.samplePass, 0); gl.uniform2f(l.jitter, JIT[0][0], JIT[0][1]); gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (quality === 0) {
        gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE); gl.uniform1f(l.samplePass, 1);
        for (var i = 1; i < 4; i++) { gl.uniform2f(l.jitter, JIT[i][0], JIT[i][1]); gl.drawArrays(gl.TRIANGLES, 0, 6); }
        gl.disable(gl.BLEND);
      }
      j.y += rows; left -= rows * j.w; done += rows * j.w; stat.draws += quality === 0 ? 4 : 1; if (rows * j.w > stat.maxDrawPx) stat.maxDrawPx = rows * j.w;
    }
    gl.disable(gl.SCISSOR_TEST); stat.slices++;
    return done;
  }
  function present() {                                // base frame stretched over the canvas, then the refined bands on top
    if (!TILE || !base || !pollProgram(blit)) return;
    var cw = canvas.width, ch = canvas.height;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, cw, ch); gl.useProgram(blit.p); gl.disable(gl.BLEND); gl.activeTexture(gl.TEXTURE3); gl.uniform2f(blit.loc.tp, 1 / rtW, 1 / rtH); gl.uniform1f(blit.loc.fx, FXAA ? 1 : 0);
    gl.bindTexture(gl.TEXTURE_2D, base.tex); gl.uniform4f(blit.loc.sr, base.w / cw, base.h / ch, (base.w - 0.5) / cw, (base.h - 0.5) / ch); gl.drawArrays(gl.TRIANGLES, 0, 6);
    if (job && job.kind === 'refine' && job.y > 0) {
      gl.enable(gl.SCISSOR_TEST); gl.scissor(0, ch - job.y, cw, job.y);
      gl.bindTexture(gl.TEXTURE_2D, job.rt.tex); gl.uniform4f(blit.loc.sr, 1, 1, 1, 1); gl.drawArrays(gl.TRIANGLES, 0, 6); gl.disable(gl.SCISSOR_TEST);
    }
    gl.bindTexture(gl.TEXTURE_2D, null); gl.activeTexture(gl.TEXTURE0);
    if (!shown) { shown = true; B.classList.add('live'); }
  }
  function render(now, Bs, animating) {               // returns true while GPU work is outstanding
    if (TILE) pollProgram(blit);
    if (!pollProgram(progs.base)) { if (progs.base.failed) { fail('The live prism could not start (' + progs.base.err + '). The projects below still work.'); return false; } return true; }
    if (TILE && !pollProgram(blit)) { if (blit.failed) { TILE = false; dropFrames(); } return true; }
    if (progs.cards && !progs.cards.ready) pollProgram(progs.cards);
    if (TILE && !RT[0]) allocTargets();
    // back-pressure: is the slice submitted earlier finished?
    var gap = lastRaf ? now - lastRaf : 0; lastRaf = now; if (gap > 4 && gap < gapMin) gapMin = gap;
    if (fence) {
      var st = gl.clientWaitSync(fence, 0, 0);
      if (st === gl.TIMEOUT_EXPIRED) { fenceBlocked++; stat.blocked++; return true; }       // GPU still busy: queue nothing
      gl.deleteSync(fence); fence = null; adapt(now - fenceT, fenceBlocked, submitPx);
    } else if (submitT) { adapt(now - submitT, 0, submitPx); }
    submitT = 0;
    if (job && job.kind === 'refine' && job.rev !== sceneRev) job = null;                     // the scene moved on: drop the refinement
    if (!job) {
      var have = base && base.rev === sceneRev;
      if (!have && (animating || !base || !TILE)) {
        var slowOnly = animating === 2, pace = PACE != null ? PACE : slowOnly ? 30 : 0;          // pass 8: only the slow About drift is held at ≈30 new frames/s. Touch devices were capped at 30 for every move since pass 5 (felt heavy once the tiled path really ran again in pass 7); the fence still holds back a GPU that cannot keep up. ?pace=30 = old cap
        if (base && now - lastMotion < pace) return true;
        lastMotion = now; job = startJob('motion', Bs, slowOnly ? 3 : 1);
      } else if (!have) job = startJob('refine', Bs, 1);       // still scene, new content (paper / images arrived): replace band by band, never drop to low resolution
      else if (base.scale < 1) job = startJob('refine', Bs, 1);
      else return false;                                                                       // full resolution on screen: idle
    }
    submitPx = runSlice(job, TILE ? budgetPx : Infinity);
    if (job.y >= job.h) {
      stat.frames++;
      if (TILE) { job.rt.w = job.w; job.rt.h = job.h; job.rt.rev = job.rev; job.rt.scale = job.scale; base = job.rt; } else { base = { rev: job.rev, scale: 1 }; if (!shown) { shown = true; B.classList.add('live'); } }
      job = null;
    }
    present();
    if (GL2 && TILE) { fence = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0); fenceT = now; fenceBlocked = 0; } else submitT = now;
    gl.flush();
    return !!job || !base || base.rev !== sceneRev || base.scale < 1;
  }
  function debugLine(s) {
    $('#dbg').textContent = (GL2 ? 'gl2' : 'gl1') + (EXT.par ? '+par' : '') + (TILE ? '' : ' tile=0') + ' · prog ' + (progs.base && progs.base.ready ? Math.round(progs.base.ms) + 'ms' : '…') + '/' + (progs.cards ? (progs.cards.ready ? Math.round(progs.cards.ms) + 'ms' : '…') : '–') +
      ' · ' + canvas.width + '×' + canvas.height + (base && base.scale < 1 ? ' ← ' + base.w + '×' + base.h : '') + (job ? ' ' + job.kind + ' ' + Math.round(100 * job.y / job.h) + '%' : '') +
      ' · ' + Math.round(budgetPx / 1000) + 'k px/f · slice ' + Math.round(stat.sliceMs) + 'ms ema ' + Math.round(stat.emaMs) + ' · max draw ' + Math.round(stat.maxDrawPx / 1000) + 'k · wait ' + stat.blocked + ' · q' + quality + ' · spread ' + ((s && s.spreadDeg) || 0).toFixed(1) + '°';
  }

  function invalidate() { dirty = true; if (!raf) { last = 0; raf = requestAnimationFrame(frame); } }
  function chase(v, to, rate, dt, eps) { var n = v + (to - v) * (1 - Math.exp(-dt * rate)); return Math.abs(to - n) < eps ? to : n; }
  function frame(now) {                               // the only animation-frame loop of the page
    raf = 0;
    if (d.hidden) return;                             // hidden tab: nothing runs; visibilitychange invalidates
    bootFrames++;
    var dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016, first = !last; last = now;
    var moving = 0;                                   // 0 still, 1 camera / interaction, 2 only the slow About drift
    if (tween) {
      var t = Math.min(1, (now - tween.t0) / tween.dur);
      pose = mixPose(tween.a, tween.b, easeIO(t));
      if (t >= 1) { pose = tween.b; tween = null; } moving = 1;
    }
    var drift = state === 'about' && !drag && !RM && ROT_FIX == null && Q.get('abauto') !== '0';
    if (drift) abT -= ABV * dt;                       // very slow clockwise drift
    var rT = rotTarget(), aT = state === 'home' || state === 'contact' ? 0 : 1, dT = state === 'projects' ? PDIM : 0.07;
    var bT = state === 'about' ? 1 : 0, kT = tex.ready && pollProgram(progs.cards) ? 1 : 0;
    if (opt.snap && first) { rot = rT; selCur = selF; selAmt = aT; dim = dT; abAmt = bT; cardK = kT; }
    if (opt.snap && first) pAmt = state === 'projects' ? 1 : 0;
    var r0 = rot, c0 = selCur, a0 = selAmt, d0 = dim, b0 = abAmt, g0 = abGain, k0 = cardK, u0 = selU, p0 = pAmt;
    pAmt = chase(pAmt, state === 'projects' ? 1 : 0, 2.4, dt, 0.004);
    rot = chase(rot, rT, state === 'about' ? 2.6 : 6, dt, 0.0003); selCur = chase(selCur, selF, 7, dt, 0.002);
    selAmt = chase(selAmt, aT, 2.4, dt, 0.004); dim = chase(dim, dT, 3, dt, 0.004);
    abAmt = chase(abAmt, bT, 2.2, dt, 0.004); abGain = abAmt > 0 ? chase(abGain, lightGain(rot), 9, dt, 0.004) : 1;
    cardK = chase(cardK, kT, 3, dt, 0.004);
    // the emphasised band: in Projects it is the light that passes through the title point (follows the rotation itself); elsewhere the old per-index band
    var uT = state === 'projects' ? uAt(rot) : 1 - (selCur + 0.5) / N; selU = opt.snap && first ? uT : chase(selU, uT, 10, dt, 0.0005);
    var changed = rot !== r0 || selCur !== c0 || selAmt !== a0 || dim !== d0 || abAmt !== b0 || abGain !== g0 || cardK !== k0 || selU !== u0 || pAmt !== p0;
    // Contact: the white-out starts once the camera is half-way down the beam and leaves as soon as it turns back (DOM only: no scene redraw)
    var fT = 0; // Pass 9: no source-facing flood; preserve the beam and glass.
    flood = opt.snap && first ? fT : fT > flood ? Math.min(1, flood + dt / 1.5) : Math.max(0, flood - dt / 0.9);
    if (FLOOD_FIX != null) flood = FLOOD_FIX;        // ?flood=0…1 holds the white-out at one stage (checks)
    if (flood !== floodShown) setFlood();
    var mv = moving === 1 || !!drag; if (mv !== mvShown) { mvShown = mv; B.classList.toggle('mv', mv); }
    var pr = state === 'projects' && !tween; if (pr !== pReady) { pReady = pr; B.classList.toggle('pready', pr); }
    if (changed && !moving) moving = drift && Math.abs(rot - rT) < 0.02 && selAmt === a0 && dim === d0 && abAmt === b0 && cardK === k0 ? 2 : 1;
    if (changed || moving || dirty) { sceneRev++; dirty = false; }
    // the optics solve (CPU) runs only when something uses it: the band ticks in Projects, or a frame that is about to be rendered (startJob)
    var Bs = basis(pose); if (!solved || !glOK) solve(rot, 1 - abAmt * (1 - abGain));
    updateCards(Bs); cur = Bs;
    var busy = glOK ? render(now, Bs, moving) : false;
    if (!busy && glOK && EXT.par && !progs.cards && progs.base.ready) ensureCardsProgram();   // idle and compiling is free: have About's program ready before it is asked for
    if (DBG) debugLine(solved);
    if (moving || drift || busy || (FLOOD_FIX == null && flood !== fT) || (progs.cards && !progs.cards.ready && !progs.cards.failed && glOK)) { if (!raf) raf = requestAnimationFrame(frame); }
  }

  /* ---------- start ---------- */
  setOptics(opt.optics);
  abT = AB_BASE + 120 * DEG * (+Q.get('abk') || 0) + (+Q.get('abturn') || 0) * DEG;   // abturn: hold a mid-turn angle for checks
  var qs = Q.get('state');
  if (qs) { state = qs === 'contact' ? 'contact' : qs === 'projects' || qs === 'entry' ? 'projects' : qs === 'about' ? 'about' : 'home'; sel = Math.max(0, Math.min(N - 1, +(Q.get('sel') || 0))); selF = sel; paint(); if (state === 'about') { loadCards(); abKick(); } }
  else fromHash('none');
  rot = rotTarget(); abAmt = state === 'about' ? 1 : 0; abGain = lightGain(rot); selCur = selF; selAmt = state === 'home' || state === 'contact' ? 0 : 1; dim = state === 'projects' ? PDIM : 0.07;
  pose = target(); tween = null;
  setQuality(quality);
  window.prism = {
    go: go, select: select, step: step, back: back, setOptics: function (n) { setOptics(n); pose = target(); tween = null; resize(); },
    idle: function () { return !raf && !dirty && (FLOOD_FIX != null || flood === 0) && paperState !== 1 && (state !== 'about' || !glOK || tex.ready || tex.failed) && (!glOK || (!!base && base.rev === sceneRev && base.scale === 1 && !job)); },
    state: function () { return { state: state, sel: sel, rot: rot, rotDeg: rot / DEG, selU: selU, flood: flood, prot: PROT.map(function (r) { return +(r / DEG).toFixed(2); }), pt: PT, optics: opt.optics, falloff: opt.falloff, quality: quality, width: canvas.width, height: canvas.height, webgl: glOK, gl2: GL2, parallel: !!EXT.par, lod: !!EXT.lod, tile: TILE, shader: 'compact-full-optics', programs: { base: progs.base ? (progs.base.ready ? Math.round(progs.base.ms) : progs.base.failed ? 'failed' : 'pending') : null, cards: progs.cards ? (progs.cards.ready ? Math.round(progs.cards.ms) : progs.cards.failed ? 'failed: ' + progs.cards.err : 'pending') : null }, budgetPx: Math.round(budgetPx), baseScale: base ? base.scale : 0, stat: stat, spreadDeg: solved && solved.spreadDeg, nk: solvedNk, gain: solved && solved.gain, window: win, moving: !!raf, ramp: !!(solved && solved.rampOK && opt.sp), rampU: solved && solved.rampU, paper: paperState, about: { img: abIdx, tex: tex.ready, light: abGain, az: AB_AZ / DEG, base: AB_BASE / DEG } }; }
  };
})();
