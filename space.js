/* Spatial project page: (1) a fixed paper-floor background drawn once in WebGL (no prism, no light beam — only a soft glow), (2) pictures that float
   (shadow follows the picture's position on screen), (3) comments tossed as glass tiles. Static scene: it is drawn on load and on resize only. */
(function () {
  var d = document, cv = d.getElementById('sp-bg');
  function paper() {
    if (!cv) return; var gl = cv.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' }); if (!gl) { d.documentElement.style.background = '#181a1b'; return; }
    var vs = 'attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
    var fs = 'precision highp float;varying vec2 uv;uniform vec2 res;'
      + 'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}'
      + 'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}'
      + 'float fib(vec2 p){float s=0.,a=.5;mat2 r=mat2(.8,-.6,.6,.8);for(int i=0;i<5;i++){s+=a*n(p*vec2(1.,.55));p=r*p*2.05;a*=.5;}return s;}'     // paper fibre: anisotropic fbm
      + 'float ht(vec2 p){return fib(p*.9)*.7+fib(p*3.1+7.)*.3+n(p*14.)*.12;}'
      + 'void main(){vec2 q=gl_FragCoord.xy;float a=res.x/res.y;vec2 p=q/res.y*34.;'
      + ' float e=1.2/res.y*34.;float c=ht(p),gx=ht(p+vec2(e,0.))-c,gy=ht(p+vec2(0.,e))-c;vec3 nn=normalize(vec3(-gx*5.5,-gy*5.5,1.));'
      + ' vec2 s=uv-vec2(.5,1.08);vec3 L=normalize(vec3(-s.x*1.6,-s.y*1.2,.65));float dif=clamp(dot(nn,L),0.,1.);'
      + ' float glow=exp(-dot(s*vec2(1.,1.35),s*vec2(1.,1.35))*3.2);'                                     // a soft glow from above the page, nothing else
      + ' float base=.050+.040*glow;float v=base*(.72+.55*dif);v+=.010*(h(q*.37)-.5);'
      + ' vec3 col=vec3(v*.97,v*1.0,v*1.02);col*=1.-.42*smoothstep(.55,1.15,length((uv-.5)*vec2(1.25,1.)));'
      + ' col+=(h(q+3.7)-.5)/255.;gl_FragColor=vec4(col,1.);}';
    function sh(t, s) { var o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; }
    var pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { d.documentElement.style.background = '#181a1b'; return; }
    gl.useProgram(pr); var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    function draw() { var k = Math.min(devicePixelRatio || 1, 1.5), w = Math.round(innerWidth * k), h = Math.round(innerHeight * k); if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
      gl.viewport(0, 0, w, h); gl.uniform2f(gl.getUniformLocation(pr, 'res'), w, h); gl.drawArrays(gl.TRIANGLES, 0, 3); }
    draw(); var t; addEventListener('resize', function () { clearTimeout(t); t = setTimeout(draw, 120); });
  }
  paper();
  /* floating pictures: shadow offset/opacity follow the vertical position on screen (light fixed above) */
  var els = [].slice.call(d.querySelectorAll('.fig > a,.row a,.mosaic3 a')), vis = new Set(), tick = false;
  function upd() { tick = false; var H = innerHeight; vis.forEach(function (el) { var r = el.getBoundingClientRect(), p = Math.max(0, Math.min(1, (r.top + r.height / 2) / H)); el.style.setProperty('--sy', (16 + 46 * p).toFixed(1) + 'px'); el.style.setProperty('--so', (.34 + .34 * p).toFixed(2)); }); }
  function req() { if (!tick) { tick = true; requestAnimationFrame(upd); } }
  if ('IntersectionObserver' in window) { var io = new IntersectionObserver(function (en) { en.forEach(function (e) { e.isIntersecting ? vis.add(e.target) : vis.delete(e.target); }); req(); }, { rootMargin: '80px' }); els.forEach(function (e) { io.observe(e); }); }
  addEventListener('scroll', req, { passive: true }); addEventListener('resize', req);
  /* comments: each tile gets its own tilt / offset / throw direction, and lands when it scrolls into view */
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967295; }
  var tio = 'IntersectionObserver' in window ? new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); tio.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' }) : null;
  function tile(li) {
    if (li.dataset.sp) return; li.dataset.sp = '1'; var id = li.dataset.id || li.textContent.slice(0, 40), a = hash(id), b = hash(id + 'x'), c = hash(id + 'y');
    li.style.setProperty('--r', ((a - .5) * 6.4).toFixed(2) + 'deg'); li.style.setProperty('--dx', ((b - .5) * 26).toFixed(0) + 'px'); li.style.setProperty('--dy', (c * 26).toFixed(0) + 'px');
    li.style.setProperty('--fx', ((b - .5) * 120).toFixed(0) + 'px'); li.style.setProperty('--fr', ((c - .5) * 34).toFixed(0) + 'deg'); li.style.setProperty('--d', (a * .25).toFixed(2) + 's');
    tio ? tio.observe(li) : li.classList.add('in');
  }
  var box = d.querySelector('.cm'); if (box) { var mo = new MutationObserver(function () { [].forEach.call(box.querySelectorAll('ol li'), tile); }); mo.observe(box, { childList: true, subtree: true }); [].forEach.call(box.querySelectorAll('ol li'), tile); }

  /* ?demo=comments: sample tiles drawn only in this browser (nothing is posted) so the glass look can be judged without real comments */
  if (/[?&]demo=comments/.test(location.search) && box) {
    var S = [['Jiwoo K.', 'Product designer', 'The inflated outer shell studies are beautiful — the pattern tessellation really reads as skin.', 3], ['Daniel M.', 'XR studio', 'Love how the suit boards keep the explanations next to the renders. Is the knit reference from a real fabric?', 5],
      ['Seoyeon', '', 'Poster set is striking. 2.3 reads very strongly against the black.', 12], ['A. Rossi', 'Automotive visualization', 'Great concept sheet, the layer diagram is clear at a glance.', 26], ['Hyun', 'Industrial design', 'The neuralink panel is my favourite. Would read a case study on the touch concept.', 41]];
    var put = function () { var cmb = box.querySelector('.cmb'); if (!cmb) return; cmb.innerHTML = '<p class="cmh"><b>Comments</b><i>' + S.length + '</i></p><ol>' + S.map(function (c, i) { return '<li data-id="demo' + i + '"><span class="av" aria-hidden="true">' + c[0][0] + '</span><div><p class="by"><b>' + c[0] + '</b>' + (c[1] ? '<i>' + c[1] + '</i>' : '') + '<time>' + c[3] + ' d ago</time></p><p class="bd">' + c[2] + '</p></div></li>'; }).join('') + '</ol>'; };
    var tries = 0, iv = setInterval(function () { tries++; var cm = box.querySelector('.cmb'); if (cm && !cm.querySelector('ol') && !/Loading/.test(cm.textContent) || tries > 40) { clearInterval(iv); put(); } }, 400);
  }

  /* the prism package stays inside the prism package: links that arrive after an unlock (encrypted pages) are re-pointed the same way make_space.py points the plain ones */
  var PR = 'https://smh2287.github.io/drafts/prism-study/', pid = (location.pathname.match(/\/ps\/([\w-]+)\.html/) || [])[1];
  function fixLinks() { [].forEach.call(d.querySelectorAll('a[href]'), function (a) { var h = a.getAttribute('href'); if (h === '../work.html') a.setAttribute('href', PR + '#/projects/' + (pid || '')); else if (h === '../index.html') a.setAttribute('href', PR + '#/home'); }); }
  fixLinks(); new MutationObserver(fixLinks).observe(d.body, { childList: true, subtree: true });
})();
