(function(){
  var d=document,lock=d.getElementById('lock');
  if(lock){var pw=lock.querySelector('input');
    var show=function(){lock.hidden=false;pw.value='';setTimeout(function(){pw.focus()},30)};
    lock.querySelector('form').addEventListener('submit',function(e){e.preventDefault();if(!pw.value)return;lock.hidden=true;if(location.hash==='#lock')history.replaceState(null,'',location.pathname)});
    var rl=d.getElementById('relock');if(rl)rl.addEventListener('click',show);
    if(location.hash==='#lock')show();
    addEventListener('hashchange',function(){if(location.hash==='#lock')show()});
  }
  var RM=matchMedia('(prefers-reduced-motion:reduce)').matches,root=d.documentElement;
  function two(n){return ('0'+n).slice(-2)}
  function bind(k,v){[].forEach.call(d.querySelectorAll('[data-b="'+k+'"]'),function(e){e.textContent=v})}
  var HOOK={home:function(i){var s=d.getElementById('d2');s.textContent=i+1;s.classList.remove('roll');void s.offsetWidth;s.classList.add('roll')},
    proj:function(k,p,n){if(k===n-1)return;var t=two(k+1);['d1','d2'].forEach(function(id,j){var s=d.getElementById(id);if(s.textContent===t[j])return;s.textContent=t[j];s.classList.remove('roll');void s.offsetWidth;s.classList.add('roll')})}};
  /* home: one car per gesture */
  var pl=d.getElementById('plate');
  if(pl){var im=[].slice.call(pl.querySelectorAll('img')),i=0,busy=0,n=im.length;
    var go=function(k){k=(k+n)%n;if(k===i)return;var p=i;i=k;
      im.forEach(function(m,j){m.classList.toggle('on',j===i)});
      root.style.setProperty('--i',i);
      bind('label',im[i].dataset.l);bind('brand',im[i].dataset.br);bind('num',two(i+1)+' / '+two(n));bind('n',two(i+1));
      pl.href=im[i].dataset.h;if(HOOK.home)HOOK.home(i,p,n)};
    var step=function(s){if(busy)return;busy=1;go(i+s);setTimeout(function(){busy=0},RM?150:850)};
    window.MFgo=function(k){if(!busy)go(k)};
    addEventListener('wheel',function(e){if(Math.abs(e.deltaY)+Math.abs(e.deltaX)<8)return;step((e.deltaY||e.deltaX)>0?1:-1)},{passive:true});
    addEventListener('keydown',function(e){if(!lock.hidden)return;
      if(/Arrow(Right|Down)|PageDown| /.test(e.key)){e.preventDefault();step(1)}
      else if(/Arrow(Left|Up)|PageUp/.test(e.key)){e.preventDefault();step(-1)}
      else if(e.key==='Enter'&&pl.getAttribute('href')!=='#')location.href=pl.href});
    var sx=null;addEventListener('touchstart',function(e){sx=[e.touches[0].clientX,e.touches[0].clientY]},{passive:true});
    addEventListener('touchend',function(e){if(!sx)return;var t=e.changedTouches[0],dx=t.clientX-sx[0],dy=t.clientY-sx[1];
      if(Math.max(Math.abs(dx),Math.abs(dy))>40)step((Math.abs(dx)>Math.abs(dy)?-dx:-dy)>0?1:-1);sx=null},{passive:true});
    [].forEach.call(d.querySelectorAll('[data-go]'),function(a){a.addEventListener('click',function(e){e.preventDefault();var k=+a.dataset.go;if(k===i&&pl.getAttribute('href')!=='#')location.href=pl.href;else window.MFgo(k)})});
    if(HOOK.init)HOOK.init();
  }
  /* project: arrow keys move one plate per screen; the current screen is reported to the template */
  var sc=[].slice.call(d.querySelectorAll('.scr'));
  if(sc.length){root.classList.add('snap');var cur=-1;
    var at=function(){var y=scrollY+innerHeight/2,k=0;sc.forEach(function(s,j){if(s.offsetTop<=y)k=j});
      if(k!==cur){var p=cur;cur=k;root.style.setProperty('--k',k);d.body.classList.toggle('end',k===sc.length-1);if(HOOK.proj)HOOK.proj(k,p,sc.length)}};
    addEventListener('scroll',at,{passive:true});addEventListener('resize',at);at();
    addEventListener('keydown',function(e){if(!lock.hidden||!/Arrow(Right|Left)/.test(e.key))return;
      var k=Math.max(0,Math.min(sc.length-1,cur+(e.key==='ArrowRight'?1:-1)));
      sc[k].scrollIntoView({behavior:RM?'auto':'smooth',block:'center'})});
  }
})();
