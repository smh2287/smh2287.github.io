(function(){
  var d=document,root=d.documentElement;
  /* lock: any input + Enter opens */
  var lock=d.getElementById('lock');
  if(lock){var pw=lock.querySelector('input');
    var show=function(){lock.hidden=false;pw.value='';setTimeout(function(){pw.focus()},30)};
    lock.querySelector('form').addEventListener('submit',function(e){e.preventDefault();if(!pw.value)return;lock.hidden=true;if(location.hash==='#lock')history.replaceState(null,'',location.pathname)});
    var rl=d.getElementById('relock');if(rl)rl.addEventListener('click',show);
    if(location.hash==='#lock')show();
    addEventListener('hashchange',function(){if(location.hash==='#lock')show()});
  }
  /* index sheet */
  var ix=d.getElementById('ix'),sheet=d.getElementById('sheet');
  if(ix&&sheet){
    var tog=function(on){sheet.classList.toggle('on',on);ix.setAttribute('aria-expanded',on);ix.textContent=on?'Close':'Index'};
    ix.addEventListener('click',function(){tog(!sheet.classList.contains('on'))});
    sheet.addEventListener('click',function(e){if(e.target.closest('a'))tog(false)});
    addEventListener('keydown',function(e){if(e.key==='Escape')tog(false)});
  }
  /* ground follows the object on screen */
  var secs=[].slice.call(d.querySelectorAll('[data-g]')),cnt=d.getElementById('cnt');
  if(secs.length&&'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;
      root.style.setProperty('--ground',e.target.dataset.g);
      var i=secs.indexOf(e.target);if(cnt&&e.target.classList.contains('obj'))cnt.textContent=i+1})},{rootMargin:'-50% 0px -50% 0px'});
    secs.forEach(function(s){io.observe(s)});
  }
  /* project: mode switch */
  var st=d.getElementById('stage');
  if(st){var imgs=st.querySelectorAll('img'),btns=d.querySelectorAll('#modes button'),cap=d.getElementById('cap');
    var caps=['The finished car.','Body, doors, seats and wheels separated — the parts that were optimized one by one.','UVs re-edited, shown here with a check pattern.','Rig and wireframe prepared for posing and animation.'];
    btns.forEach(function(b,i){b.addEventListener('click',function(){
      btns.forEach(function(x,k){x.setAttribute('aria-pressed',k===i)});
      imgs.forEach(function(x,k){x.classList.toggle('on',k===i)});cap.textContent=caps[i]})});
  }
})();
