(function(){
  var d=document,lock=d.getElementById('lock');
  if(lock){var pw=lock.querySelector('input');
    var show=function(){lock.hidden=false;pw.value='';setTimeout(function(){pw.focus()},30)};
    lock.querySelector('form').addEventListener('submit',function(e){e.preventDefault();if(!pw.value)return;lock.hidden=true;if(location.hash==='#lock')history.replaceState(null,'',location.pathname)});
    var rl=d.getElementById('relock');if(rl)rl.addEventListener('click',show);
    if(location.hash==='#lock')show();
    addEventListener('hashchange',function(){if(location.hash==='#lock')show()});
  }
  var RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
  var tr=d.getElementById('track');if(!tr)return;
  var it=[].slice.call(tr.children),cnt=d.getElementById('cnt'),cur=0,busy=0,isP=it[0].classList.contains('txt');
  function pad(n){return ('0'+n).slice(-2)}
  function mark(){var c=tr.scrollLeft+innerWidth/2,b=0,bd=1e9;
    it.forEach(function(e,k){var m=e.offsetLeft+e.offsetWidth/2,dd=Math.abs(m-c);if(dd<bd){bd=dd;b=k}});
    if(b===cur&&it[b].classList.contains('on'))return;cur=b;
    it.forEach(function(e,k){e.classList.toggle('on',k===b)});
    if(cnt)cnt.textContent=isP?pad(b)+' / '+pad(it.length-1):pad(b+1)+' / '+pad(it.length)}
  function go(k){k=Math.max(0,Math.min(it.length-1,k));var e=it[k];
    tr.scrollTo({left:e.offsetLeft-(innerWidth-e.offsetWidth)/2,behavior:RM?'auto':'smooth'})}
  tr.addEventListener('scroll',function(){requestAnimationFrame(mark)},{passive:true});
  tr.addEventListener('wheel',function(e){if(Math.abs(e.deltaX)>Math.abs(e.deltaY))return;e.preventDefault();
    if(busy||Math.abs(e.deltaY)<6)return;busy=1;go(cur+(e.deltaY>0?1:-1));setTimeout(function(){busy=0},RM?120:650)},{passive:false});
  addEventListener('keydown',function(e){if(lock&&!lock.hidden)return;
    if(/Arrow(Right|Down)|PageDown/.test(e.key)){e.preventDefault();go(cur+1)}
    else if(/Arrow(Left|Up)|PageUp/.test(e.key)){e.preventDefault();go(cur-1)}
    else if(e.key==='Home')go(0);else if(e.key==='End')go(it.length-1)});
  it.forEach(function(e,k){e.addEventListener('click',function(ev){if(k!==cur){ev.preventDefault();go(k)}})});
  var cm=d.getElementById('tocm');if(cm)cm.addEventListener('click',function(e){e.preventDefault();go(it.length-1)});
  if(location.hash==='#comments')setTimeout(function(){go(it.length-1)},50);
  addEventListener('resize',function(){go(cur)});
  mark();
})();
