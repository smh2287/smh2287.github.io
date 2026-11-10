(function(){
  var d=document,$=function(s){return d.querySelector(s)},$$=function(s){return [].slice.call(d.querySelectorAll(s))};
  var typing=function(e){var t=e.target;return t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA')};
  var pad=function(n){return (n<10?'0':'')+n};

  /* clock */
  var clk=$('#clock');
  if(clk){var tick=function(){clk.textContent=new Date().toLocaleTimeString('en-GB',{timeZone:'Asia/Seoul'})};tick();setInterval(tick,1000)}

  /* lock: any input + Enter opens. Shown on #lock, the lock button or the L key. */
  var lock=$('#lock'),pw=lock&&lock.querySelector('input');
  function showLock(){lock.hidden=false;pw.value='';meter();setTimeout(function(){pw.focus()},40)}
  function meter(){$$('.lock .meter i').forEach(function(m,k){m.classList.toggle('on',k<pw.value.length)})}
  if(lock){
    if(location.hash==='#lock')showLock();
    pw.addEventListener('input',meter);
    lock.querySelector('form').addEventListener('submit',function(e){e.preventDefault();if(!pw.value)return;lock.hidden=true;history.replaceState(null,'',location.pathname)});
    $$('[data-lock]').forEach(function(b){b.addEventListener('click',showLock)});
  }

  /* ---------- index ---------- */
  var rows=$$('.idx a');
  if(rows.length){
    var imgs=$$('.pv .im img'),sel=0,f=$('#filter'),count=$('#count'),sum=$('#sum'),empty=$('#empty');
    var out={name:$('#o-name'),kind:$('#o-kind'),year:$('#o-year'),plates:$('#o-plates'),path:$('#o-path')};
    var vis=function(){return rows.filter(function(r){return !r.parentNode.hidden})};
    function select(i,scroll){
      sel=i;rows.forEach(function(r,k){r.classList.toggle('sel',k===i);r.setAttribute('aria-current',k===i)});
      imgs.forEach(function(m,k){m.classList.toggle('on',k===i)});
      var r=rows[i];out.name.textContent=r.dataset.name;out.kind.textContent=r.dataset.kind;out.year.textContent=r.dataset.year;out.plates.textContent=r.dataset.plates;out.path.textContent='/work/'+r.dataset.slug;
      var v=vis();count.textContent=pad(v.indexOf(r)+1)+'/'+pad(v.length);
      if(scroll)r.scrollIntoView({block:'nearest'});
    }
    function move(dir){var v=vis();if(!v.length)return;var p=v.indexOf(rows[sel]);p=(p+dir+v.length)%v.length;select(rows.indexOf(v[p]),true)}
    rows.forEach(function(r,i){r.addEventListener('mouseenter',function(){select(i)});r.addEventListener('focus',function(){select(i)})});
    f.addEventListener('input',function(){
      var q=f.value.trim().toLowerCase(),n=0;
      rows.forEach(function(r){var hit=!q||r.textContent.toLowerCase().indexOf(q)>-1;r.parentNode.hidden=!hit;if(hit)n++});
      empty.hidden=n>0;sum.textContent=n+' of '+rows.length+' projects';
      var v=vis();if(v.length&&v.indexOf(rows[sel])<0)select(rows.indexOf(v[0]));else if(v.length)select(sel);else count.textContent='00/00';
    });
    d.addEventListener('keydown',function(e){
      if(lock&&!lock.hidden)return;
      if(e.metaKey||e.ctrlKey||e.altKey)return;
      if(typing(e)){if(e.key==='Escape'){f.value='';f.dispatchEvent(new Event('input'));f.blur()}else if(e.key==='Enter'){var v=vis();if(v.length)v[Math.max(v.indexOf(rows[sel]),0)].click()}else if(e.key==='ArrowDown'){e.preventDefault();move(1)}else if(e.key==='ArrowUp'){e.preventDefault();move(-1)}return}
      var k=e.key;
      if(k==='j'||k==='ArrowDown'){e.preventDefault();move(1)}
      else if(k==='k'||k==='ArrowUp'){e.preventDefault();move(-1)}
      else if(k==='Enter'){if(d.activeElement&&d.activeElement.tagName==='A')return;rows[sel].click()}
      else if(k==='/'){e.preventDefault();f.focus()}
      else if(k==='l'){showLock()}
      else if(/^[1-9]$/.test(k)&&rows[+k-1]&&!rows[+k-1].parentNode.hidden){select(+k-1,true)}
    });
    select(0);return;
  }

  /* ---------- project ---------- */
  var figs=$$('.doc figure');if(!figs.length)return;
  var cur=0,crumb=$('#crumb'),cnt=$('#count'),prog=$('#prog'),links=$$('#tree a');
  var smooth=matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth';
  function mark(i){
    cur=i;figs.forEach(function(g,k){g.classList.toggle('cur',k===i)});
    var g=figs[i],sec=g.closest('[data-name]');
    crumb.textContent='cle › '+(sec?sec.dataset.name:'')+' › '+g.dataset.code;cnt.textContent=pad(i+1)+'/'+pad(figs.length);
  }
  function go(i){i=Math.max(0,Math.min(figs.length-1,i));mark(i);figs[i].scrollIntoView({behavior:smooth,block:'center'})}
  d.addEventListener('keydown',function(e){
    if(typing(e)||e.metaKey||e.ctrlKey||e.altKey)return;
    if(e.key==='j'||e.key==='ArrowRight'){e.preventDefault();go(cur+1)}
    else if(e.key==='k'||e.key==='ArrowLeft'){e.preventDefault();go(cur-1)}
    else if(e.key==='g'){scrollTo({top:0,behavior:smooth});mark(0)}
    else if(e.key==='Escape'){location.href='./'}
  });
  var ticking=0;
  function onScroll(){
    if(ticking)return;ticking=requestAnimationFrame(function(){ticking=0;
      var h=d.documentElement.scrollHeight-innerHeight;prog.style.transform='scaleX('+(h>0?scrollY/h:0)+')';
      var mid=innerHeight/2,best=0,bd=1e9;
      figs.forEach(function(g,k){var r=g.getBoundingClientRect(),c=Math.abs((r.top+r.bottom)/2-mid);if(c<bd){bd=c;best=k}});
      mark(best);
      var on=null;links.forEach(function(l){var t=d.querySelector(l.getAttribute('href'));if(t&&t.getBoundingClientRect().top<innerHeight*.45)on=l});
      links.forEach(function(l){l.classList.toggle('on',l===on)});
    });
  }
  addEventListener('scroll',onScroll,{passive:true});onScroll();
})();
