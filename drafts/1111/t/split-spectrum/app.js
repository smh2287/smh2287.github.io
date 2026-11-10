(function(){
  var d=document,$=function(s){return d.querySelector(s)},$$=function(s){return [].slice.call(d.querySelectorAll(s))};
  var calm=matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* lock: any input + Enter opens. Shown on #lock or via the Lock button. The needle advances per character. */
  var lock=$('#lock');
  if(lock){
    var pw=lock.querySelector('input'),lr=lock.querySelector('.lockrule');
    var upd=function(){lr.style.setProperty('--x',Math.min(pw.value.length*12.5,100)+'%')};
    var showLock=function(){lock.hidden=false;pw.value='';upd();setTimeout(function(){pw.focus()},60)};
    if(location.hash==='#lock')showLock();
    pw.addEventListener('input',upd);
    lock.querySelector('form').addEventListener('submit',function(e){e.preventDefault();if(!pw.value)return;lock.hidden=true;history.replaceState(null,'',location.pathname)});
    $$('[data-lock]').forEach(function(b){b.addEventListener('click',showLock)});
  }

  /* split plates: channels meet under the pointer and part towards the edges */
  $$('.split').forEach(function(f){
    var rest=calm?0:parseFloat(f.getAttribute('data-rest')||3)*(innerWidth<861?.5:1),max=parseFloat(f.getAttribute('data-max')||14);
    f.style.setProperty('--d',rest+'px');
    if(calm)return;
    f.addEventListener('pointermove',function(e){
      if(e.pointerType==='touch')return;
      var r=f.getBoundingClientRect(),k=(e.clientX-r.left)/r.width*2-1;
      f.classList.add('live');f.style.setProperty('--d',(k*max).toFixed(2)+'px');
    });
    f.addEventListener('pointerleave',function(){f.classList.remove('live');f.style.setProperty('--d',rest+'px')});
  });

  /* ---------- home: the ruler is the index ---------- */
  var stops=$$('.stops a');
  if(stops.length){
    var idx=$('.index'),plate=$('#plate'),imgs=$$('#plate img'),h1=$('#title'),cur=-1,t=0;
    var o={n:$('#o-n'),nm:$('#o-nm'),k:$('#o-k'),y:$('#o-y'),r:$('#o-r'),p:$('#o-p')};
    var act=function(i,pulse){
      if(i===cur)return;cur=i;var a=stops[i],ds=a.dataset,p=parseFloat(a.parentNode.style.getPropertyValue('--p'));
      stops.forEach(function(s,k){s.classList.toggle('on',k===i);if(k===i)s.setAttribute('aria-current','true');else s.removeAttribute('aria-current')});
      idx.style.setProperty('--x',p+'%');
      h1.innerHTML=ds.title;o.n.textContent=ds.n+' / 06';o.nm.textContent=Math.round(380+p*4);o.k.textContent=ds.kind;o.y.textContent=ds.year;o.r.textContent=ds.role;o.p.textContent=ds.plates;
      imgs.forEach(function(m){m.src=ds.img;m.style.objectPosition=ds.pos||'50% 50%'});imgs[0].alt=a.querySelector('.t').textContent;
      plate.setAttribute('data-href',a.getAttribute('href'));
      if(pulse&&!calm&&!plate.classList.contains('live')){plate.style.setProperty('--d','12px');clearTimeout(t);t=setTimeout(function(){plate.style.setProperty('--d','3px')},90)}
    };
    stops.forEach(function(s,i){s.addEventListener('mouseenter',function(){act(i,1)});s.addEventListener('focus',function(){act(i,1)})});
    plate.addEventListener('click',function(){var h=plate.getAttribute('data-href');if(h&&h!=='#')location.href=h});
    d.addEventListener('keydown',function(e){
      if(lock&&!lock.hidden)return;if(e.metaKey||e.ctrlKey||e.altKey)return;
      if(e.key==='ArrowRight'){e.preventDefault();stops[(cur+1)%stops.length].focus()}
      else if(e.key==='ArrowLeft'){e.preventDefault();stops[(cur-1+stops.length)%stops.length].focus()}
    });
    act(0);return;
  }

  /* ---------- project: the same ruler measures the scroll ---------- */
  var prog=$('#prog');if(!prog)return;
  var secs=$$('[data-tick]'),where=$('#where'),marks=[],raf=0;
  var slit=d.createElement('u');prog.appendChild(slit);
  var H=function(){return Math.max(d.documentElement.scrollHeight-innerHeight,1)};
  function layout(){
    marks.forEach(function(m){m.remove()});marks=[];var h=H();
    secs.forEach(function(s){
      var top=s.getBoundingClientRect().top+scrollY-80,b=d.createElement('b');
      b.style.left=Math.max(0,Math.min(100,top/h*100))+'%';b.setAttribute('data-t',s.getAttribute('data-tick'));prog.appendChild(b);marks.push(b);
    });
    onScroll();
  }
  function onScroll(){
    if(raf)return;raf=requestAnimationFrame(function(){raf=0;
      prog.style.setProperty('--x',(Math.min(scrollY/H(),1)*100).toFixed(2)+'%');
      var on=secs[0];secs.forEach(function(s){if(s.getBoundingClientRect().top<innerHeight*.5)on=s});
      where.textContent='CLE · '+on.getAttribute('data-tick');
    });
  }
  addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',layout);addEventListener('load',layout);layout();
})();
