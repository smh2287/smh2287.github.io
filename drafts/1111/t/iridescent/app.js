(function(){
  var d=document,root=d.documentElement;
  /* thin film: hue along the hairlines depends on the "view angle" = pointer x */
  if(!matchMedia('(prefers-reduced-motion:reduce)').matches){
    var raf=0;
    addEventListener('pointermove',function(e){if(raf)return;raf=requestAnimationFrame(function(){raf=0;root.style.setProperty('--px',(e.clientX/innerWidth).toFixed(3))})},{passive:true});
  }
  /* lock: any input + Enter opens. Shown on #lock or via the Lock button. */
  var lock=d.getElementById('lock');
  if(lock){
    var pw=lock.querySelector('input'),dots=lock.querySelector('.ring i');
    function showLock(){lock.hidden=false;pw.value='';upd();setTimeout(function(){pw.focus()},60)}
    function upd(){lock.style.setProperty('--k',Math.min(pw.value.length/8,1));dots.textContent=pw.value.length?Array(Math.min(pw.value.length,6)+1).join('·'):''}
    if(location.hash==='#lock')showLock();
    pw.addEventListener('input',upd);
    lock.querySelector('form').addEventListener('submit',function(e){e.preventDefault();if(!pw.value)return;lock.hidden=true;history.replaceState(null,'',location.pathname)});
    d.querySelectorAll('[data-lock]').forEach(function(b){b.addEventListener('click',showLock)});
  }
  /* index rows drive the stage */
  var rows=[].slice.call(d.querySelectorAll('.rows a')),imgs=[].slice.call(d.querySelectorAll('.stage .frame img'));
  if(!rows.length)return;
  var f={n:d.getElementById('cn'),t:d.getElementById('ct'),k:d.getElementById('ck'),y:d.getElementById('cy')};
  function act(i){
    rows.forEach(function(r,k){r.classList.toggle('on',k===i)});imgs.forEach(function(m,k){m.classList.toggle('on',k===i)});
    var r=rows[i];f.n.textContent=r.querySelector('.n').textContent+' / 06';f.t.textContent=r.querySelector('.t').textContent;f.k.textContent=r.querySelector('.k').textContent;f.y.textContent=r.querySelector('.y').textContent;
  }
  rows.forEach(function(r,i){r.addEventListener('mouseenter',function(){act(i)});r.addEventListener('focus',function(){act(i)})});
})();
