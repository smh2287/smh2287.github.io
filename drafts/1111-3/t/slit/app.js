(function(){
  var d=document,lock=d.getElementById('lock'),RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
  d.documentElement.classList.add('js');
  if(lock){var pw=lock.querySelector('input');
    var show=function(){lock.hidden=false;pw.value='';setTimeout(function(){pw.focus()},30)};
    lock.querySelector('form').addEventListener('submit',function(e){e.preventDefault();if(!pw.value)return;lock.hidden=true;if(location.hash==='#lock')history.replaceState(null,'',location.pathname)});
    var rl=d.getElementById('relock');if(rl)rl.addEventListener('click',show);
    if(location.hash==='#lock')show();
    addEventListener('hashchange',function(){if(location.hash==='#lock')show()});
  }
  var $=function(id){return d.getElementById(id)},set=function(id,t){var e=$(id);if(e)e.textContent=t};
  var H={};/* template hooks: H.swap(a,b,dir), H.go(img,i,dir), H.dur, H.sec(k,el) */
  var sl=$('sl'),E='cubic-bezier(.62,0,.18,1)',T=1050;
  H.dur=1500;
  H.swap=function(a,b,dir){
    if(RM){a.classList.remove('on');b.classList.add('on');return}
    var f=dir>0;/* forward: slit crosses right → left and the next car is exposed behind it */
    b.style.transition=a.style.transition=sl.style.transition='none';
    b.style.clipPath=f?'inset(0 0 0 100%)':'inset(0 100% 0 0)';a.style.clipPath='inset(0 0 0 0)';
    b.style.opacity=1;sl.style.left=f?'100%':'0%';sl.classList.add('run');
    void sl.offsetWidth;
    b.style.transition=a.style.transition='clip-path '+T+'ms '+E;sl.style.transition='left '+T+'ms '+E;
    b.style.clipPath='inset(0 0 0 0)';a.style.clipPath=f?'inset(0 100% 0 0)':'inset(0 0 0 100%)';
    sl.style.left=f?'0%':'100%';
    setTimeout(function(){a.classList.remove('on');b.classList.add('on');
      [a,b].forEach(function(m){m.style.transition=m.style.clipPath=m.style.opacity=''});
      sl.classList.remove('run');
      if(f){sl.style.transition='opacity .18s';sl.style.opacity=0;
        setTimeout(function(){sl.style.transition='none';sl.style.left='';void sl.offsetWidth;sl.style.transition='opacity .25s';sl.style.opacity=''},200)}
      else{sl.style.transition='left .3s ease-out';sl.style.left=''}
    },T+20)};
  H.go=function(b,i,dir,im){var k=(i+1)%im.length;set('nn',('0'+(k+1)).slice(-2));set('nt',im[k].dataset.n)};
  /* home: one plate, wheel / arrows / swipe swap the car */
  var pl=$('plate');
  if(pl){var im=[].slice.call(pl.querySelectorAll('img')),i=0,busy=0,n=im.length;
    var go=function(k,dir){k=(k+n)%n;if(k===i)return;var a=im[i],b=im[k];i=k;
      if(H.swap)H.swap(a,b,dir);else{a.classList.remove('on');b.classList.add('on')}
      set('lt',b.dataset.l);set('lb',b.dataset.b);set('ln',('0'+(i+1)).slice(-2)+' / 0'+n);pl.href=b.dataset.h;
      if(H.go)H.go(b,i,dir,im)};
    var step=function(s){if(busy)return;busy=1;go(i+s,s);setTimeout(function(){busy=0},RM?150:(H.dur||850))};
    addEventListener('wheel',function(e){if(lock&&!lock.hidden)return;if(Math.abs(e.deltaY)+Math.abs(e.deltaX)<8)return;step((e.deltaY||e.deltaX)>0?1:-1)},{passive:true});
    addEventListener('keydown',function(e){if(!lock.hidden)return;
      if(/Arrow(Right|Down)|PageDown| /.test(e.key)){e.preventDefault();step(1)}
      else if(/Arrow(Left|Up)|PageUp/.test(e.key)){e.preventDefault();step(-1)}
      else if(e.key==='Enter'&&pl.getAttribute('href')!=='#')location.href=pl.href});
    var sx=null;addEventListener('touchstart',function(e){sx=[e.touches[0].clientX,e.touches[0].clientY]},{passive:true});
    addEventListener('touchend',function(e){if(!sx)return;var t=e.changedTouches[0],dx=t.clientX-sx[0],dy=t.clientY-sx[1];
      if(Math.max(Math.abs(dx),Math.abs(dy))>40)step((Math.abs(dx)>Math.abs(dy)?-dx:-dy)>0?1:-1);sx=null},{passive:true});
    if(H.init)H.init(im);
  }
  /* project: one plate per screen; arrow keys step; current screen reported to H.sec */
  var sc=[].slice.call(d.querySelectorAll('.scr'));
  if(sc.length){d.documentElement.classList.add('snap');
    var cur=function(){var y=scrollY+innerHeight/2,k=0;sc.forEach(function(s,j){if(s.offsetTop<=y)k=j});return k};
    addEventListener('keydown',function(e){if(!lock.hidden||!/Arrow(Right|Left)/.test(e.key))return;
      var k=Math.max(0,Math.min(sc.length-1,cur()+(e.key==='ArrowRight'?1:-1)));
      sc[k].scrollIntoView({behavior:RM?'auto':'smooth',block:'center'})});
    if(H.sec){var last=-1,up=function(){var k=cur();if(k!==last){last=k;H.sec(k,sc[k],sc)}};addEventListener('scroll',up,{passive:true});up()}
    if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.35});
      sc.forEach(function(s){io.observe(s)})}else sc.forEach(function(s){s.classList.add('in')});
  }
})();
