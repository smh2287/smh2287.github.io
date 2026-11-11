(function(){
  var d=document,lock=d.getElementById('lock'),root=d.documentElement;
  if(lock){var pw=lock.querySelector('input');
    var show=function(){lock.hidden=false;pw.value='';setTimeout(function(){pw.focus()},30)};
    lock.querySelector('form').addEventListener('submit',function(e){e.preventDefault();if(!pw.value)return;lock.hidden=true;if(location.hash==='#lock')history.replaceState(null,'',location.pathname)});
    var rl=d.getElementById('relock');if(rl)rl.addEventListener('click',show);
    if(location.hash==='#lock')show();
    addEventListener('hashchange',function(){if(location.hash==='#lock')show()});
  }
  var RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
  function two(n){return ('0'+n).slice(-2)}
  function bind(k,v){[].forEach.call(d.querySelectorAll('[data-b="'+k+'"]'),function(e){e.textContent=v})}
  var HOOK={
  fire:function(f){if(!f||RM)return;f.classList.add('go');setTimeout(function(){f.classList.remove('go')},300)},
  home:function(){HOOK.fire(d.querySelector('.fr'))},
  proj:function(k,p,sc){if(p<0)return;HOOK.fire(sc[k].querySelector('.fr'))}
};
  /* home: one car per gesture */
  var pl=d.getElementById('plate');
  if(pl){var im=[].slice.call(pl.querySelectorAll('img')),i=0,busy=0,n=im.length;
    var go=function(k){k=(k+n)%n;if(k===i)return;var p=i;i=k;
      if(HOOK.pre)HOOK.pre(i,p,im);
      im.forEach(function(m,j){m.classList.toggle('on',j===i)});
      root.style.setProperty('--i',i);
      bind('label',im[i].dataset.l);bind('brand',im[i].dataset.br);bind('num',two(i+1)+' / '+two(n));bind('n',two(i+1));
      pl.href=im[i].dataset.h;if(HOOK.home)HOOK.home(i,p,n,im)};
    var step=function(s){if(busy)return;busy=1;go(i+s);setTimeout(function(){busy=0},RM?150:950)};
    window.MFgo=function(k){if(!busy){busy=1;go(k);setTimeout(function(){busy=0},RM?150:950)}};
    addEventListener('wheel',function(e){if(!lock.hidden||Math.abs(e.deltaY)+Math.abs(e.deltaX)<8)return;step((e.deltaY||e.deltaX)>0?1:-1)},{passive:true});
    addEventListener('keydown',function(e){if(!lock.hidden)return;
      if(/Arrow(Right|Down)|PageDown| /.test(e.key)){e.preventDefault();step(1)}
      else if(/Arrow(Left|Up)|PageUp/.test(e.key)){e.preventDefault();step(-1)}
      else if(e.key==='Enter'&&pl.getAttribute('href')!=='#')location.href=pl.href});
    var sx=null;addEventListener('touchstart',function(e){sx=[e.touches[0].clientX,e.touches[0].clientY]},{passive:true});
    addEventListener('touchend',function(e){if(!sx)return;var t=e.changedTouches[0],dx=t.clientX-sx[0],dy=t.clientY-sx[1];
      if(Math.max(Math.abs(dx),Math.abs(dy))>40)step((Math.abs(dx)>Math.abs(dy)?-dx:-dy)>0?1:-1);sx=null},{passive:true});
    [].forEach.call(d.querySelectorAll('[data-go]'),function(a){a.addEventListener('click',function(e){e.preventDefault();var k=+a.dataset.go;if(k===i&&pl.getAttribute('href')!=='#')location.href=pl.href;else window.MFgo(k)})});
    if(HOOK.init)HOOK.init(im);
  }
  /* project: one plate per screen; the current screen is reported to the template */
  var sc=[].slice.call(d.querySelectorAll('.scr'));
  if(sc.length){root.classList.add('snap');var cur=-1;
    var at=function(){var y=scrollY+innerHeight/2,k=0;sc.forEach(function(s,j){if(s.offsetTop<=y)k=j});
      if(k!==cur){var p=cur;cur=k;sc.forEach(function(s,j){s.classList.toggle('cur',j===k)});root.style.setProperty('--k',k);if(HOOK.proj)HOOK.proj(k,p,sc)}};
    addEventListener('scroll',at,{passive:true});addEventListener('resize',at);at();
    [].forEach.call(d.querySelectorAll('[data-to]'),function(a){a.addEventListener('click',function(e){e.preventDefault();var t=d.getElementById(a.dataset.to);if(t)t.scrollIntoView({behavior:RM?'auto':'smooth',block:'center'})})});
    addEventListener('keydown',function(e){if(!lock.hidden||!/Arrow(Right|Left)/.test(e.key)||/INPUT|TEXTAREA/.test(e.target.tagName))return;
      var k=Math.max(0,Math.min(sc.length-1,cur+(e.key==='ArrowRight'?1:-1)));
      sc[k].scrollIntoView({behavior:RM?'auto':'smooth',block:'center'})});
  }
  /* comments: local preview of the fixed last section; plate codes become mint links */
  var cf=d.getElementById('cmf');
  if(cf){var cl=d.getElementById('cml');
    var esc=function(s){return s.replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
    var link=function(s){return esc(s).replace(/\b([1-9])\.(\d\d)\b/g,function(m,a,b){var id='p'+a+'-'+b;return d.getElementById(id)?'<a href="#'+id+'" data-to="'+id+'">'+m+'</a>':m})};
    [].forEach.call(cl.querySelectorAll('p'),function(p){p.innerHTML=link(p.textContent)});
    cf.addEventListener('submit',function(e){e.preventDefault();var t=cf.elements.t.value.trim();if(!t)return;var li=d.createElement('li');
      li.innerHTML='<span class="m">'+esc(cf.elements.n.value.trim()||'Guest')+'<br><i>Just now</i></span><p>'+link(t)+'</p>';cl.appendChild(li);cf.elements.t.value=''});
    cf.elements.t.addEventListener('keydown',function(e){if(e.key==='Enter'&&(e.metaKey||e.ctrlKey)){e.preventDefault();cf.requestSubmit()}});
    cl.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[data-to]');if(!a)return;e.preventDefault();var t=d.getElementById(a.dataset.to);if(t)t.scrollIntoView({behavior:RM?'auto':'smooth',block:'center'})});
  }
})();
