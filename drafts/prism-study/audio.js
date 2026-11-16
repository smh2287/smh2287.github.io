/* Pass 23 — glass sound effects (Web Audio only, synthesised, no files). Default OFF; the AudioContext is created by the toggle click (a user gesture).
   Everything is wrapped in try/catch: a failure here can never break the page. */
(function () {
  var ctx = null, bus = null, on = false, lastT = {}, noiseBuf = null, KEY = 'prism-snd';
  var PENT = [392.0, 440.0, 523.25, 587.33, 659.25, 783.99];      // G4 A4 C5 D5 E5 G5: one note per project
  var RATIOS = [1, 2.32, 4.25, 6.63], GAINS = [1, 0.34, 0.16, 0.07];   // inharmonic partials = glass
  function ensure() {
    if (ctx) return true;
    try {
      var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
      ctx = new AC();
      var comp = ctx.createDynamicsCompressor(); comp.threshold.value = -20; comp.ratio.value = 6; comp.attack.value = 0.003; comp.release.value = 0.2;
      var master = ctx.createGain(); master.gain.value = 0.18; master.connect(comp); comp.connect(ctx.destination);
      var len = Math.floor(ctx.sampleRate * 1.8), ir = ctx.createBuffer(2, len, ctx.sampleRate);
      for (var c = 0; c < 2; c++) { var d = ir.getChannelData(c); for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.8); }
      var cv = ctx.createConvolver(); cv.buffer = ir; var rg = ctx.createGain(); rg.gain.value = 0.5; cv.connect(rg); rg.connect(master);
      bus = ctx.createGain(); bus.connect(master); bus.connect(cv);
      var nb = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate), nd = nb.getChannelData(0); for (var k = 0; k < nd.length; k++) nd[k] = Math.random() * 2 - 1; noiseBuf = nb;
      return true;
    } catch (e) { ctx = null; return false; }
  }
  function ok() { return on && ctx && ctx.state === 'running'; }
  function gate(name, ms) { var n = performance.now(); if (lastT[name] && n - lastT[name] < ms) return false; lastT[name] = n; return true; }
  function partial(f, t0, dur, g, f1) {                     // one decaying sine (optionally gliding to f1)
    var o = ctx.createOscillator(), a = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(f, t0);
    if (f1) o.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
    a.gain.setValueAtTime(0.0001, t0); a.gain.exponentialRampToValueAtTime(g, t0 + 0.006); a.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(a); a.connect(bus); o.start(t0); o.stop(t0 + dur + 0.05);
  }
  function glass(f, vel, dur) { var t = ctx.currentTime + 0.005; for (var i = 0; i < 4; i++) partial(f * RATIOS[i], t, dur * (1 - i * 0.18), 0.5 * vel * GAINS[i]); }
  function air(f0, f1, dur, g, q) {                          // filtered-noise swell
    var s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
    var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = q || 2.5; var t = ctx.currentTime;
    bp.frequency.setValueAtTime(f0, t); bp.frequency.exponentialRampToValueAtTime(f1, t + dur);
    var a = ctx.createGain(); a.gain.setValueAtTime(0.0001, t); a.gain.exponentialRampToValueAtTime(g, t + dur * 0.5); a.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(bp); bp.connect(a); a.connect(bus); s.start(t); s.stop(t + dur + 0.05);
  }
  var STATE_F = { home: 392, projects: 523.25, about: 440, contact: 349.23 };
  var api = {
    get on() { return on; },
    set: function (v) {
      on = !!v; try { localStorage.setItem(KEY, on ? '1' : '0'); } catch (e) {}
      if (on) { if (ensure() && ctx.state === 'suspended') { try { ctx.resume(); } catch (e) {} } setTimeout(function () { try { if (ok()) glass(659.25, 0.7, 0.9); } catch (e) {} }, 60); }
      var b = document.getElementById('snd'); if (b) { b.textContent = on ? 'sound on' : 'sound off'; b.classList.toggle('on', on); }
    },
    toggle: function () { api.set(!on); },
    swell: function (state) { try { if (!ok() || !gate('swell', 250)) return; var f = STATE_F[state] || 440; air(f * 1.4, f * 5, 0.7, 0.16, 3); partial(f, ctx.currentTime, 0.9, 0.12, f * 1.5); partial(f * 2.32, ctx.currentTime, 0.7, 0.05, f * 3.2); } catch (e) {} },
    tink: function (i) { try { if (!ok() || !gate('tink', 60)) return; glass(PENT[((i % 6) + 6) % 6], 0.8, 1.1); } catch (e) {} },
    tick: function () { try { if (!ok() || !gate('tick', 120)) return; glass(1046.5, 0.3, 0.5); } catch (e) {} },
    hover: function () { try { if (!ok() || !gate('hover', 90)) return; glass(1318.5, 0.14, 0.32); } catch (e) {} },
    dive: function (ms) {                                       // accelerating sweep, then a low glass bloom before the fade ends
      try {
        if (!ok()) return; var d = ms / 1000, t = ctx.currentTime;
        air(300, 6200, d * 0.95, 0.42, 1.6); partial(260, t, d * 0.9, 0.16, 1900); partial(620, t, d * 0.9, 0.08, 4300);
        setTimeout(function () { try { if (!ok()) return; var t2 = ctx.currentTime; partial(110, t2, 1.6, 0.34); partial(110 * 2.32, t2, 1.3, 0.14); partial(110 * 4.25, t2, 1.0, 0.06); } catch (e) {} }, ms * 0.8);
      } catch (e) {}
    }
  };
  document.addEventListener('visibilitychange', function () { try { if (!ctx) return; if (document.hidden) ctx.suspend(); else if (on) ctx.resume(); } catch (e) {} });
  window.PrismSound = api;
  document.addEventListener('DOMContentLoaded', function () {
    var b = document.getElementById('snd'); if (!b) return;
    var want = false; try { want = localStorage.getItem(KEY) === '1'; } catch (e) {} if (/[?&]snd=1/.test(location.search)) want = true;
    b.textContent = 'sound off';
    b.addEventListener('click', function () { api.toggle(); });
    if (want) { on = true; b.textContent = 'sound on'; b.classList.add('on'); var arm = function () { try { if (ensure() && ctx.state === 'suspended') ctx.resume(); } catch (e) {} removeEventListener('pointerdown', arm); removeEventListener('keydown', arm); }; addEventListener('pointerdown', arm); addEventListener('keydown', arm); }   // a remembered "on" starts at the first gesture
    document.addEventListener('mouseover', function (e) { var t = e.target && e.target.closest ? e.target.closest('.nav a, .pix button, .ptl, .foot button') : null; if (t) api.hover(); });
  });
})();
