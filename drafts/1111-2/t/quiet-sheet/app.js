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
  var pl=d.getElementById('plate');if(!pl)return;
  var im=[].slice.call(pl.querySelectorAll('img')),ln=[].slice.call(d.querySelectorAll('#idx a')),
      b=d.getElementById('lb-b'),n=d.getElementById('lb-n'),s=d.getElementById('lb-s');
  ln.forEach(function(a,i){function on(){
      ln.forEach(function(x,k){x.classList.toggle('on',k===i)});
      im.forEach(function(x,k){x.classList.toggle('on',k===i)});
      b.textContent=im[i].dataset.b;n.textContent=im[i].dataset.n;s.textContent=im[i].dataset.s;pl.href=im[i].dataset.h}
    a.addEventListener('mouseenter',on);a.addEventListener('focus',on)});
})();
