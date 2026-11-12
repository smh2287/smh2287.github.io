(function(){
  var d=document,root=d.documentElement,RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
  root.classList.add('js');

  /* lock: any input + Enter opens. Reachable by #lock or the "lock" link. */
  var lock=d.getElementById('lock');
  if(lock){var pw=lock.querySelector('input');
    var show=function(){lock.hidden=false;pw.value='';setTimeout(function(){pw.focus()},30)};
    lock.querySelector('form').addEventListener('submit',function(e){e.preventDefault();if(!pw.value)return;lock.hidden=true;
      if(location.hash==='#lock')history.replaceState(null,'',location.pathname)});
    [].forEach.call(d.querySelectorAll('[data-lock]'),function(a){a.addEventListener('click',function(e){e.preventDefault();show()})});
    if(location.hash==='#lock')show();
    addEventListener('hashchange',function(){if(location.hash==='#lock')show()});
  }

  /* projects without a page yet: stay put */
  [].forEach.call(d.querySelectorAll('a[href="#"]'),function(a){a.addEventListener('click',function(e){e.preventDefault()})});

  /* plates fade in as they arrive (the reference's only motion) */
  var fx=[].slice.call(d.querySelectorAll('.fx'));
  if(RM)fx.forEach(function(e){e.classList.add('in')});
  else{var tick=0,see=function(){tick=0;var h=innerHeight*.96;
      fx=fx.filter(function(e){var r=e.getBoundingClientRect();if(r.top<h&&r.bottom>-200){e.classList.add('in');return false}return r.bottom>-200||(e.classList.add('in'),false)});
      if(!fx.length){removeEventListener('scroll',on);removeEventListener('resize',on)}},
      on=function(){if(!tick)tick=requestAnimationFrame(see)};
    addEventListener('scroll',on,{passive:true});addEventListener('resize',on);addEventListener('load',see);see()}

  /* lightbox: click a plate to see it alone, centred, with air */
  var zs=[].slice.call(d.querySelectorAll('a[data-z]'));
  if(zs.length){var lb=d.createElement('div'),k=0;lb.className='lb';lb.hidden=true;lb.setAttribute('role','dialog');lb.setAttribute('aria-label','Plate');
    lb.innerHTML='<span class="c"><b></b><em style="font-style:normal"></em></span><span class="x">close</span><button class="p" aria-label="Previous">&lt;</button><img alt=""><button class="n" aria-label="Next">&gt;</button>';
    d.body.appendChild(lb);
    var im=lb.querySelector('img'),cb=lb.querySelector('b'),ce=lb.querySelector('em');
    var put=function(i){k=(i+zs.length)%zs.length;var a=zs[k];im.src=a.getAttribute('href');im.alt=a.querySelector('img').alt;cb.textContent='CLE / '+a.dataset.z;ce.textContent=a.dataset.t||''};
    var open=function(i){put(i);lb.hidden=false;d.body.style.overflow='hidden'},close=function(){lb.hidden=true;d.body.style.overflow='';zs[k].focus({preventScroll:true})};
    zs.forEach(function(a,i){a.addEventListener('click',function(e){e.preventDefault();open(i)})});
    lb.addEventListener('click',function(e){if(e.target.classList.contains('p'))put(k-1);else if(e.target.classList.contains('n'))put(k+1);else close()});
    addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape')close();else if(e.key==='ArrowRight')put(k+1);else if(e.key==='ArrowLeft')put(k-1)});
  }

  /* comments: local preview only (widget not connected in this draft) */
  var cf=d.getElementById('cmf');
  if(cf){var cl=d.getElementById('cml');
    var esc=function(s){return s.replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
    var code=function(s){return esc(s).replace(/\b([1-9]\.\d\d)\b/g,'<u>$1</u>')};
    [].forEach.call(cl.querySelectorAll('p'),function(p){p.innerHTML=code(p.textContent)});
    cf.addEventListener('submit',function(e){e.preventDefault();var t=cf.elements.t.value.trim();if(!t)return;var li=d.createElement('li');
      li.innerHTML='<span>'+esc(cf.elements.n.value.trim()||'Guest')+'<br><i>just now</i></span><p>'+code(t)+'</p>';cl.appendChild(li);cf.elements.t.value=''});
    cf.elements.t.addEventListener('keydown',function(e){if(e.key==='Enter'&&(e.metaKey||e.ctrlKey)){e.preventDefault();cf.requestSubmit()}});
  }
})();
