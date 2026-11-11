(function(){
  var d=document,lock=d.getElementById('lock');
  if(lock){var pw=lock.querySelector('input');
    var show=function(){lock.hidden=false;pw.value='';setTimeout(function(){pw.focus()},30)};
    lock.querySelector('form').addEventListener('submit',function(e){e.preventDefault();if(!pw.value)return;lock.hidden=true;if(location.hash==='#lock')history.replaceState(null,'',location.pathname)});
    var rl=d.getElementById('relock');if(rl)rl.addEventListener('click',show);
    if(location.hash==='#lock')show();
    addEventListener('hashchange',function(){if(location.hash==='#lock')show()});
  }
  var rows=[].slice.call(d.querySelectorAll('#rows a'));
  if(rows.length){var imgs=d.querySelectorAll('#hero img'),ht=d.getElementById('ht'),hd=d.getElementById('hd');
    rows.forEach(function(a,i){function on(){
      rows.forEach(function(r,k){r.classList.toggle('on',k===i)});
      imgs.forEach(function(m,k){m.classList.toggle('on',k===i)});
      if(ht)ht.textContent=a.children[1].textContent;
      if(hd)hd.innerHTML=a.children[0].textContent+' / 06<br>'+a.children[3].textContent}
      a.addEventListener('mouseenter',on);a.addEventListener('focus',on)});
  }

  d.querySelectorAll('.plate,.band').forEach(function(p){var s=p.querySelector('.scrub');if(!s)return;var b=s.style.getPropertyValue('--p');
    p.addEventListener('pointermove',function(e){var r=p.getBoundingClientRect();s.style.setProperty('--p',((e.clientX-r.left)/r.width).toFixed(4))});
    p.addEventListener('pointerleave',function(){s.style.setProperty('--p',b)})});
  var reel=d.getElementById('reel'),tc=d.getElementById('tc');
  if(reel)d.querySelectorAll('#rows a').forEach(function(a,i){var f=function(){reel.style.setProperty('--p',((i+1)/6).toFixed(4));tc.textContent=a.children[0].textContent};a.addEventListener('mouseenter',f);a.addEventListener('focus',f)});
  var ls=d.getElementById('lscrub');
  if(ls){var li=ls.parentNode.querySelector('input');li.addEventListener('input',function(){ls.style.setProperty('--p',Math.min(1,li.value.length/8).toFixed(3))})}

})();
