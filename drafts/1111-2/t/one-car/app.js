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
  var pl=d.getElementById('plate');
  if(pl){var im=[].slice.call(pl.querySelectorAll('img')),lt=d.getElementById('lt'),ln=d.getElementById('ln'),i=0,busy=0,n=im.length;
    function go(k){k=(k+n)%n;if(k===i)return;i=k;
      im.forEach(function(m,j){m.classList.toggle('on',j===i)});
      lt.textContent=im[i].dataset.l;ln.textContent=('0'+(i+1)).slice(-2)+' / 0'+n;pl.href=im[i].dataset.h}
    function step(s){if(busy)return;busy=1;go(i+s);setTimeout(function(){busy=0},RM?150:850)}
    addEventListener('wheel',function(e){if(Math.abs(e.deltaY)+Math.abs(e.deltaX)<8)return;step((e.deltaY||e.deltaX)>0?1:-1)},{passive:true});
    addEventListener('keydown',function(e){if(!lock.hidden)return;
      if(/Arrow(Right|Down)|PageDown| /.test(e.key)){e.preventDefault();step(1)}
      else if(/Arrow(Left|Up)|PageUp/.test(e.key)){e.preventDefault();step(-1)}
      else if(e.key==='Enter'&&pl.getAttribute('href')!=='#')location.href=pl.href});
    var sx=null;addEventListener('touchstart',function(e){sx=[e.touches[0].clientX,e.touches[0].clientY]},{passive:true});
    addEventListener('touchend',function(e){if(!sx)return;var t=e.changedTouches[0],dx=t.clientX-sx[0],dy=t.clientY-sx[1];
      if(Math.max(Math.abs(dx),Math.abs(dy))>40)step((Math.abs(dx)>Math.abs(dy)?-dx:-dy)>0?1:-1);sx=null},{passive:true});
  }
  /* project page: arrow keys move one plate per screen */
  var sc=[].slice.call(d.querySelectorAll('.scr'));
  if(sc.length){d.documentElement.classList.add('snap');
    addEventListener('keydown',function(e){if(!lock.hidden||!/Arrow(Right|Left)/.test(e.key))return;
      var y=scrollY+innerHeight/2,k=0;sc.forEach(function(s,j){if(s.offsetTop<=y)k=j});
      k=Math.max(0,Math.min(sc.length-1,k+(e.key==='ArrowRight'?1:-1)));
      sc[k].scrollIntoView({behavior:RM?'auto':'smooth',block:'center'})});
  }
})();
