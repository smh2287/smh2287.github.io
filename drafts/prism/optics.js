/* SPECTRUM prism — CPU optics (browser global `PrismOptics`, also require()-able in Node for checks).
   Model: a vertical "ray-box" slit sheet travelling exactly along world +X at z=0, grazing the floor,
   meets a vertical equilateral glass prism. Every ray is horizontal and every side face is vertical, so
   the whole problem is the 2D Snell problem in the floor plane; the floor trace of the light IS the ray. */
(function (root) {
  'use strict';
  var RIN = 0.46;            // inradius of the triangular section (side = 2*sqrt(3)*RIN = 1.593)
  var HEIGHT = 9.0;          // prism height (astra-film 2.9; first pass 6.0) → about 5.8 : 1 on the same section
  var BEAM_Z = -0.30;        // the beam is aimed off-axis, toward the refracting apex (classic prism diagram)
  var FACE = [30, 150, 270].map(function (d) { return d * Math.PI / 180; });
  var CARD = { c: 0.29, hw: 0.65, y0: 0.50, h: 2.275 };   // about: image slide inside the glass (offset from the axis toward its face, half width, foot, height)
  var TC = { r: 0.86, g: 0.51, b: 0.19, v: 0.035 };   // centres of the display-spectrum lobes in t (0 violet … 1 red)

  function sellmeier(B, C) {
    return function (nm) {
      var x = nm * nm / 1e6;
      return Math.sqrt(1 + B[0] * x / (x - C[0]) + B[1] * x / (x - C[1]) + B[2] * x / (x - C[2]));
    };
  }
  // SCHOTT catalogue Sellmeier coefficients (λ in µm). Checked in checks/optics-check.cjs against nd.
  var F2 = sellmeier([1.34533359, 0.209073176, 0.937357162], [0.00997743871, 0.0470450767, 111.886764]);
  var BK7 = sellmeier([1.03961212, 0.231792344, 1.01046945], [0.00600069867, 0.0200179144, 103.560653]);
  var lam = function (t) { return 400 + 300 * t; };          // t → wavelength (nm), linear, for the real glasses

  var MATERIAL = {
    // The look Minho approved: artistic floor dispersion, crown-like glass appearance (two different "glasses").
    approved: { label: 'approved (artistic n(t), glass RGB unchanged)', n: function (t) { return 1.59 - 0.125 * t + 0.048 * t * t; }, rgb: [1.516, 1.5185, 1.522], physical: false },
    // One real flint glass for both the floor light and the glass appearance.
    f2: { label: 'SCHOTT F2 flint (Sellmeier, one consistent material)', n: function (t) { return F2(lam(t)); }, physical: true },
    // One real crown glass: what an ordinary prism does.
    bk7: { label: 'SCHOTT N-BK7 crown (Sellmeier, one consistent material)', n: function (t) { return BK7(lam(t)); }, physical: true }
  };
  ['f2', 'bk7'].forEach(function (k) { var m = MATERIAL[k]; m.rgb = [m.n(TC.r), m.n(TC.g), m.n(TC.b)]; });

  function fresnel(c, ni, nt) {           // unpolarised dielectric reflectance
    c = Math.max(0, Math.min(1, c));
    var st2 = (ni / nt) * (ni / nt) * (1 - c * c);
    if (st2 >= 1) return 1;
    var ct = Math.sqrt(1 - st2), rs = (ni * c - nt * ct) / (ni * c + nt * ct), rp = (nt * c - ni * ct) / (nt * c + ni * ct);
    return 0.5 * (rs * rs + rp * rp);
  }
  function refract(d, m, eta) {           // vector Snell; m is the surface normal against the ray
    var c = d[0] * m[0] + d[1] * m[1], k = 1 - eta * eta * (1 - c * c);
    if (k < 0) return null;
    var s = eta * c + Math.sqrt(k);
    return [eta * d[0] - s * m[0], eta * d[1] - s * m[1]];
  }
  function normals(rot) { return FACE.map(function (a) { return [Math.cos(a - rot), Math.sin(a - rot)]; }); }
  function hit(ns, o, d) {
    var lo = -1e9, hi = 1e9, Ni = -1, Fi = -1, miss = false;
    ns.forEach(function (m, i) {
      var b = m[0] * d[0] + m[1] * d[1], c = RIN - (m[0] * o[0] + m[1] * o[1]);
      if (Math.abs(b) < 1e-9) { if (c < 0) miss = true; return; }
      var t = c / b;
      if (b < 0) { if (t > lo) { lo = t; Ni = i; } } else if (t < hi) { hi = t; Fi = i; }
    });
    return !miss && hi > Math.max(lo, 0) ? { lo: lo, hi: hi, Ni: Ni, Fi: Fi } : null;
  }
  var unit = function (v) { var l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l]; };

  var HALF = Math.sqrt(3) * RIN;                    // half length of a side
  function vfade(ns, X, i) {                        // 0 at a vertex → 1 well inside the face: a finite slit splits at an edge instead of jumping
    var m = ns[i], a = Math.abs(-m[1] * X[0] + m[0] * X[1]), x = Math.max(0, Math.min(1, (HALF - a) / 0.07));
    return x * x * (3 - 2 * x);
  }
  /* One horizontal ray of index n through the prism at rotation rot (rad). Returns
     E entry point, R1 entry reflectance, refl reflected direction, first = first interior hit,
     direct = what leaves at the first interior hit (power 0 and the grazing direction when totally reflected, so
              the geometry stays continuous through the critical angle),
     route  = the part reflected at the first interior hit, followed until it leaves (F0 = reflected fraction, 1 = TIR),
     main / sec = the old names: dominant exit and the reflected remainder (kept for the window / about checks).
     edge = product of the vertex fades of every surface point on the way. */
  function path(n, rot, w) {
    var ns = normals(rot), o = [-30, w == null ? BEAM_Z : w], d = [1, 0];
    var h = hit(ns, o, d);
    if (!h || h.lo < 0) return null;
    var nE = ns[h.Ni], E = [o[0] + d[0] * h.lo, o[1] + d[1] * h.lo];
    var cosI = -(d[0] * nE[0] + d[1] * nE[1]), R1 = fresnel(cosI, 1, n);
    var out = { E: E, entry: h.Ni, nE: nE, cosI: cosI, R1: R1, refl: [d[0] + 2 * cosI * nE[0], d[1] + 2 * cosI * nE[1]], first: null, direct: null, route: null, main: null, sec: null, edgeE: vfade(ns, E, h.Ni) };
    d = refract(d, nE, 1 / n); o = [E[0] + d[0] * 1e-6, E[1] + d[1] * 1e-6];
    var power = 1 - R1;
    h = hit(ns, o, d); if (!h) return out;
    var m = ns[h.Fi], X = [o[0] + d[0] * h.hi, o[1] + d[1] * h.hi], ci = d[0] * m[0] + d[1] * m[1];
    var t = refract(d, [-m[0], -m[1]], n), F0 = t ? fresnel(ci, n, 1) : 1, e0 = out.edgeE * vfade(ns, X, h.Fi);
    out.first = X;
    out.direct = { X: X, dir: t || unit([d[0] - ci * m[0], d[1] - ci * m[1]]), power: power * (1 - F0), inside: power, face: h.Fi, edge: e0, cosT: t ? t[0] * m[0] + t[1] * m[1] : 0 };
    var pw = power * F0, e = e0, P = X, Y1 = null;
    d = [d[0] - 2 * ci * m[0], d[1] - 2 * ci * m[1]];
    for (var b = 1; b < 7; b++) {
      o = [P[0] + d[0] * 1e-6, P[1] + d[1] * 1e-6]; h = hit(ns, o, d); if (!h) break;
      m = ns[h.Fi]; var Y = [o[0] + d[0] * h.hi, o[1] + d[1] * h.hi]; ci = d[0] * m[0] + d[1] * m[1];
      if (!Y1) Y1 = Y; e *= vfade(ns, Y, h.Fi);
      var t2 = refract(d, [-m[0], -m[1]], n);
      if (t2) { out.route = { X: X, Y1: Y1, Y: Y, dir: t2, inside: pw, power: pw * (1 - fresnel(ci, n, 1)), face: h.Fi, bounce: b, F0: F0, edge: e }; break; }
      P = Y; d = [d[0] - 2 * ci * m[0], d[1] - 2 * ci * m[1]];
    }
    if (t) {
      out.main = { X: X, dir: t, power: out.direct.power, inside: power, bounce: 0, face: out.direct.face };
      if (out.route) out.sec = { X: X, Y: out.route.Y, dir: out.route.dir, inside: pw, power: out.route.power, face: out.route.face };
    } else if (out.route) out.main = { X: out.route.Y, dir: out.route.dir, power: out.route.power, inside: power, bounce: out.route.bounce, face: out.route.face };
    return out;
  }

  /* Direct-transmission window in (30°,60°): every display wavelength leaves through the facing side with no
     internal bounce and the violet end still transmits a useful fraction. Interaction stays inside it, so the
     fan never jumps between branches. */
  function windowFor(mat) {
    var lo = null, hi = null;
    for (var deg = 31; deg <= 60; deg += 0.05) {
      var r = deg * Math.PI / 180, ok = true;
      [0, 0.5, 1].forEach(function (t) { var p = path(mat.n(t), r); if (!p || !p.main || p.main.bounce !== 0) ok = false; });
      if (ok) { var pb = path(mat.n(TC.b), r); ok = pb.main.power > 0.45; }
      if (ok) { if (lo === null) lo = deg; hi = deg; }
    }
    lo = Math.max(lo, 34);                         // keep the finite-width beam clear of the vertex at 30°
    return [lo * Math.PI / 180, hi * Math.PI / 180];
  }

  /* Everything the shader and the DOM need for one rotation.
     Continuity rules (2026-11-16): every slot always carries finite geometry for all four lobes; a lobe that is
     totally reflected keeps its grazing direction with power 0; the directly transmitted fan (slot 1) and the
     internally reflected route (slots 2/3) are both always present, the reflected one shown at
     k2 + (1-k2)·smoothstep(.5,1,F0) so it grows into the full beam through the critical angle instead of switching;
     a fan wider than the widest one of the approved window keeps its total light (gain = S0/spread) instead of
     its brightness; light fades at a prism edge. opts.nk scales the index (Home title pose only). */
  var RB = 4, STRIDE = 6, S0cache = {};
  var angle = function (a, b) { return Math.abs(Math.atan2(a[0] * b[1] - a[1] * b[0], a[0] * b[0] + a[1] * b[1])); };
  function lobeSpread(mat, rot, nk) {
    var pr = path(mat.n(TC.r) * nk, rot), pb = path(mat.n(TC.b) * nk, rot);
    return pr && pb && pr.direct && pb.direct ? angle(pr.direct.dir, pb.direct.dir) : 0;
  }
  function solve(mat, rot, opts) {
    opts = opts || {};
    var nk = opts.nk == null ? 1 : +opts.nk, nOf = function (t) { return mat.n(t) * nk; };
    var key = mat.label, S0 = S0cache[key] || (S0cache[key] = lobeSpread(mat, windowFor(mat)[1], 1));
    var u = new Float32Array(RB * STRIDE * 4);
    var k2 = opts.secondary == null ? 1 : +opts.secondary;      // display strength of the secondary beams (1 = Fresnel ratio)
    var ss = function (a, b, x) { x = Math.max(0, Math.min(1, (x - a) / (b - a))); return x * x * (3 - 2 * x); };
    var ease = function (dr, db) { var sp = dr && db ? angle(dr, db) : 0; return sp > S0 ? S0 / sp : 1; };
    var G = function (q) { return k2 + (1 - k2) * ss(0.5, 1, q.F0); };
    function core(r) {                               // routes and displayed powers of the four lobes at rotation r
      var ch = ['r', 'g', 'b', 'v'].map(function (k) { return path(nOf(TC[k]), r); }), g = ch[1], c = { ch: ch, g: g, P: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], rail: 0, e1: 1 };
      if (!g) return c;
      c.rail = g.R1 * k2 * g.edgeE;
      c.P[0] = ch.map(function (p) { return p && p.first ? (1 - p.R1) * p.edgeE : 0; });
      if (!g.direct) return c;
      var D = c.D = ch.map(function (p) { return p && p.direct && p.direct.face === g.direct.face ? p.direct : null; });
      var e1 = c.e1 = ease(D[0] && D[0].dir, D[2] && D[2].dir);
      c.P[1] = D.map(function (q) { return q ? q.power * q.edge * e1 : 0; });
      if (!g.route) return c;
      var R = c.R = ch.map(function (p, i) { return D[i] && p.route && p.route.face === g.route.face && p.route.bounce === g.route.bounce ? p.route : null; });
      var e3 = ease(R[0] && R[0].dir, R[2] && R[2].dir);
      c.P[2] = R.map(function (q, i) { return q ? q.inside * G(q) * D[i].edge : 0; });
      c.P[3] = R.map(function (q) { return q ? q.power * G(q) * q.edge * e3 : 0; });
      return c;
    }
    // Geometry is the central ray's; the powers are averaged over the slit's small angular spread (±BLUR), so the
    // steep Fresnel edge at the critical angle and the edge fades play out over ≈2° of rotation instead of ≈0.3°.
    var C = core(rot), ch = C.ch, g = C.g, D = C.D, R = C.R;
    var res = { ribbons: u, rail: new Float32Array(5), green: null, bands: [], spreadDeg: null, entryNormal: g ? g.nE : null, gain: C.e1 };
    if (!g) return res;
    var doRamp = opts.ramp !== false && !!(D && D[0] && D[2]), PW = new Float64Array(NW);
    function fanPow(c, r, w) {                       // direct-fan power of the NW ramp wavelengths at rotation r (same rules as the lobes)
      for (var i = 0; i < NW; i++) { var p = path(nOf((i + 0.5) / NW), r), q = p && p.direct; if (q && q.face === c.g.direct.face) PW[i] += w * q.power * q.edge * c.e1; }
    }
    var P = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], rl = 0, BLUR = (opts.blur == null ? 1.0 : +opts.blur) * Math.PI / 180;
    [[-1, 1], [-0.5, 2], [0, 3], [0.5, 2], [1, 1]].forEach(function (s) {
      if (BLUR === 0 && s[0] !== 0) return;
      var c = s[0] === 0 ? C : core(rot + s[0] * BLUR), w = BLUR === 0 ? 1 : s[1] / 9;
      // a neighbour on another branch (other entry/exit face) contributes nothing to this geometry
      var ok0 = c.g && c.g.entry === g.entry, ok1 = ok0 && c.g.direct && g.direct && c.g.direct.face === g.direct.face, ok3 = ok1 && c.g.route && g.route && c.g.route.face === g.route.face && c.g.route.bounce === g.route.bounce;
      for (var i = 0; i < 4; i++) { if (ok0) P[0][i] += w * c.P[0][i]; if (ok1) P[1][i] += w * c.P[1][i]; if (ok3) { P[2][i] += w * c.P[2][i]; P[3][i] += w * c.P[3][i]; } }
      if (ok0) rl += w * c.rail;
      if (ok1 && doRamp) fanPow(c, s[0] === 0 ? rot : rot + s[0] * BLUR, w);
    });
    if (doRamp) ramp(res, nOf, rot, g, D[0], D[2], PW);
    res.rail.set([g.E[0], g.E[1], g.refl[0], g.refl[1], rl]);
    function put(slot, origins, dirs, powers, clip) {
      for (var c = 0; c < 4; c++) {
        var oo = origins[c] || origins[1], dd = dirs[c] || dirs[1];       // a missing lobe rides on green with power 0
        if (!origins[c] || !dirs[c] || !(powers[c] > 0)) powers[c] = 0;
        if (oo && dd) u.set([oo[0], oo[1], dd[0], dd[1]], (slot * STRIDE + c) * 4);
      }
      u.set(powers, (slot * STRIDE + 4) * 4);
      u.set([clip, 0, 0, 0], (slot * STRIDE + 5) * 4);
    }
    // 0: light inside the glass, entry → first face
    put(0, ch.map(function (p) { return p && p.E; }), ch.map(function (p) { return p && p.first && unit([p.first[0] - p.E[0], p.first[1] - p.E[1]]); }), P[0], 1);
    if (!g.direct) return res;
    // 1: the dispersed fan on the floor (direct transmission at the first interior face)
    put(1, D.map(function (q) { return q && q.X; }), D.map(function (q) { return q && q.dir; }), P[1], -1);
    // 2/3: the part reflected inside at that face (all of it beyond the critical angle), and where it leaves
    if (g.route) {
      put(2, R.map(function (q) { return q && q.X; }), R.map(function (q) { return q && unit([q.Y1[0] - q.X[0], q.Y1[1] - q.X[1]]); }), P[2], 1);
      put(3, R.map(function (q) { return q && q.Y; }), R.map(function (q) { return q && q.dir; }), P[3], -1);
    }
    var direct = g.direct.power > 0;
    res.green = direct ? { o: g.direct.X, d: g.direct.dir, E: g.E } : g.route ? { o: g.route.Y, d: g.route.dir, E: g.E } : null;
    var same = function (p) { return p && p.direct && p.direct.power > 0 && p.direct.face === g.direct.face; };
    var pb = path(nOf(0), rot), pr = path(nOf(1), rot);
    if (direct && same(pb) && same(pr)) res.spreadDeg = angle(pb.direct.dir, pr.direct.dir) * 180 / Math.PI;
    // six project bands: exact rays at the band centres (red … violet)
    for (var i = 0; i < 6; i++) {
      var t = 1 - (i + 0.5) / 6, p = path(nOf(t), rot);
      res.bands.push(direct && same(p) ? { t: t, o: p.direct.X, d: p.direct.dir } : null);
    }
    return res;
  }

  /* ---------- pass 4: continuous display spectrum ----------
     NW wavelengths (t = 0 violet … 1 red) are traced per solve. Each gets its geometric spectral coordinate u (where its
     ray lies between the blue and red reference rays of slot 1, exactly as the shader measures it: u = .19 + .67·lb/(lb−lr)),
     its averaged power, and a display colour. They are splatted into a RW×RR texture: x = squashed u (whole real line),
     row = slit blur σu in u units (log spaced SMIN…SMAX). Row value T(u,σ) = ∫P·c·exp(−(u−t)²/2σ²)dt / n(σ),
     n = sqrt(2πσ²/(1+2πσ²)), so T → P·c(u) when sharp and → the white sum when the fan is still narrower than the slit.
     Stored sqrt-encoded relative to the row maximum (alpha = sqrt(rowmax / rampS)): no banding in the dark skirts. */
  var NW = 16, RW = 128, RR = 16, SMIN = 0.012, SMAX = 2.5, UK = 0.75;
  var sstep = function (a, b, x) { x = Math.max(0, Math.min(1, (x - a) / (b - a))); return x * x * (3 - 2 * x); };
  function spectral(t) {                             // display colour of wavelength t (linear RGB). Channel curves with pure zones (the
    t = Math.max(0, Math.min(1, t));                 // filmic tone curve lifts any off-channel above ≈1 % into a visible pastel), violet = blue + a return of red
    var r = Math.pow(sstep(0.56, 0.72, t), 1.6) + 0.55 * Math.pow(1 - sstep(0, 0.13, t), 1.5);
    var g = Math.pow(sstep(0.17, 0.33, t), 1.5) * Math.pow(1 - sstep(0.72, 0.93, t), 1.3);
    var b = Math.pow(1 - sstep(0.20, 0.37, t), 1.6);
    var e = sstep(-0.02, 0.09, t) * sstep(-0.02, 0.08, 1 - t);                          // both ends fade out: soft edges of the wedge
    return [r * e, g * e, b * e];
  }
  var WN = (function () {                            // channel scales: the whole spectrum adds up to the white of the slit beam
    var m = [0, 0, 0], n = 256, i, c; for (i = 0; i < n; i++) { c = spectral((i + 0.5) / n); m[0] += c[0] / n; m[1] += c[1] / n; m[2] += c[2] / n; }
    return [0.190 / m[0], 0.185 / m[1], 0.181 / m[2]];
  })();
  var RAMP = { W: RW, R: RR, N: NW, SMIN: SMIN, SMAX: SMAX, UK: UK, FK: 1.0 / WN[1] };   // FK: far-field gain so a pure green texel reaches 1.1 × farGain
  var UT = new Float64Array(RW); (function () { for (var k = 0; k < RW; k++) { var z = 2 * (k + 0.5) / RW - 1; UT[k] = 0.5 + UK * z / Math.sqrt(1 - z * z); } })();
  var cr2 = function (ax, ay, b) { return ax * b[1] - ay * b[0]; };
  function ramp(res, nOf, rot, g, Rq, Bq, PW) {
    var u = new Float64Array(NW), ok = [], i, j, k, SREF = 8, bad = false;
    for (i = 0; i < NW; i++) {
      var p = path(nOf((i + 0.5) / NW), rot), q = p && p.direct;
      if (!q || q.face !== g.direct.face) { ok[i] = false; PW[i] = 0; continue; }
      var px = q.X[0] + q.dir[0] * SREF, py = q.X[1] + q.dir[1] * SREF;
      var lb = cr2(px - Bq.X[0], py - Bq.X[1], Bq.dir), lr = cr2(px - Rq.X[0], py - Rq.X[1], Rq.dir), dd = lb - lr;
      if (Math.abs(dd) < 1e-7) { bad = true; break; }
      u[i] = 0.19 + 0.67 * lb / dd; ok[i] = true;
    }
    res.rampOK = !bad && ok.some(Boolean);
    if (!res.rampOK) return;
    for (i = 0; i < NW; i++) if (!ok[i]) { for (j = 1; j < NW; j++) { if (ok[i - j]) { u[i] = u[i - j]; break; } if (ok[i + j]) { u[i] = u[i + j]; break; } } }
    var E = [], S = new Float64Array(NW), U = new Float64Array(NW);
    for (i = 0; i < NW; i++) {
      var du = Math.abs(u[Math.min(NW - 1, i + 1)] - u[Math.max(0, i - 1)]) / (i === 0 || i === NW - 1 ? 1 : 2), c = spectral((i + 0.5) / NW);
      du = Math.min(du, 0.6); S[i] = Math.max(0.7 * du, 0.006); U[i] = u[i];
      E.push([c[0] * WN[0] * PW[i] * du, c[1] * WN[1] * PW[i] * du, c[2] * WN[2] * PW[i] * du]);
    }
    var tex = new Uint8Array(RW * RR * 4), row = new Float64Array(RW * 3), mx = new Float64Array(RR), M = 1e-6, rows = [];
    for (j = 0; j < RR; j++) {
      var sj = SMIN * Math.pow(SMAX / SMIN, j / (RR - 1)), nj = Math.sqrt(2 * Math.PI * sj * sj / (1 + 2 * Math.PI * sj * sj)), m = 1e-7;
      row = new Float64Array(RW * 3);
      for (i = 0; i < NW; i++) {
        if (!(PW[i] > 0)) continue;
        var s2 = S[i] * S[i] + sj * sj, a = sj / (Math.sqrt(s2) * nj), e = E[i];
        for (k = 0; k < RW; k++) {
          var d = UT[k] - U[i], x = d * d / (2 * s2);
          if (x > 20) continue;
          var w = a * Math.exp(-x); row[k * 3] += e[0] * w; row[k * 3 + 1] += e[1] * w; row[k * 3 + 2] += e[2] * w;
        }
      }
      for (k = 0; k < RW * 3; k++) if (row[k] > m) m = row[k];
      mx[j] = m; if (m > M) M = m; rows.push(row);
    }
    for (j = 0; j < RR; j++) for (k = 0; k < RW; k++) {
      var o = (j * RW + k) * 4, r = rows[j];
      tex[o] = Math.round(255 * Math.sqrt(r[k * 3] / mx[j])); tex[o + 1] = Math.round(255 * Math.sqrt(r[k * 3 + 1] / mx[j])); tex[o + 2] = Math.round(255 * Math.sqrt(r[k * 3 + 2] / mx[j]));
      tex[o + 3] = Math.round(255 * Math.sqrt(mx[j] / M));
    }
    res.ramp = tex; res.rampS = M; res.rampU = [u[0], u[NW - 1]]; res.rampP = PW; res.rampRows = mx;
  }

  /* Home title pose (pass 4): the same straight-down telephoto camera, only zoom and frame shift. a = aspect (w/h).
     hs = triangle side / frame height (landscape) or / frame width (portrait), hx = centre x / width, hy = beam y / height. */
  function homePose(a, o) {
    o = o || {}; var p = a < 0.9, HD = o.hd || 34, top = HD - HEIGHT, side = 2 * Math.sqrt(3) * RIN;
    var hs = o.hs || (p ? 1.3 : 1.65), hx = o.hx != null ? o.hx : 0.40, hy = o.hy != null ? o.hy : (p ? 0.36 : 0.45);
    var sH = p ? hs * a : hs, lens = side / (2 * top * sH), sy = 1 - 2 * hy + BEAM_Z / (HD * lens), cy = (1 - sy) / 2, f = top / HD;
    return { portrait: p, dist: HD, lens: lens, shift: [(2 * hx - 1) * a, sy], sH: sH, cx: hx, cy: cy, f: f,
      apexY: cy - sH / Math.sqrt(3), baseY: cy + sH / (2 * Math.sqrt(3)), footApexY: cy - f * sH / Math.sqrt(3), footBaseY: cy + f * sH / (2 * Math.sqrt(3)), beamY: hy };
  }

  var api = { RAMP: RAMP, spectral: spectral, homePose: homePose,  CARD: CARD, RIN: RIN, HEIGHT: HEIGHT, BEAM_Z: BEAM_Z, TC: TC, MATERIAL: MATERIAL, fresnel: fresnel, refract: refract, path: path, windowFor: windowFor, solve: solve, RB: RB, STRIDE: STRIDE };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.PrismOptics = api;
})(typeof self !== 'undefined' ? self : this);
