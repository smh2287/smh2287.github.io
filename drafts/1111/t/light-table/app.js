(function(){
  var d=document,body=d.body;
  /* lock: any input + Enter opens. Shown on #lock or via the Lock button. */
  var lock=d.getElementById('lock');
  if(lock){
    var pw=lock.querySelector('input');
    function showLock(){lock.hidden=false;pw.value='';lock.style.setProperty('--k',0);setTimeout(function(){pw.focus()},60)}
    if(location.hash==='#lock')showLock();
    pw.addEventListener('input',function(){lock.style.setProperty('--k',Math.min(pw.value.length/6,1))});
    lock.querySelector('form').addEventListener('submit',function(e){e.preventDefault();if(!pw.value)return;lock.style.setProperty('--k',1);lock.hidden=true;history.replaceState(null,'',location.pathname)});
    d.querySelectorAll('[data-lock]').forEach(function(b){b.addEventListener('click',showLock)});
  }
  /* lamp */
  d.querySelectorAll('.lamp').forEach(function(b){b.addEventListener('click',function(){var off=body.classList.toggle('off');b.setAttribute('aria-pressed',!off)})});

  /* index <-> slides */
  var rows=[].slice.call(d.querySelectorAll('.list a')),slides=[].slice.call(d.querySelectorAll('.slide')),wrap=d.querySelector('.slides');
  function act(i){rows.forEach(function(r,k){r.classList.toggle('on',k===i)});slides.forEach(function(s,k){s.classList.toggle('on',k===i)});if(wrap)wrap.classList.add('dim')}
  rows.forEach(function(r,i){r.addEventListener('mouseenter',function(){act(i)});r.addEventListener('focus',function(){act(i)})});
  slides.forEach(function(s,i){s.addEventListener('mouseenter',function(){act(i)});s.addEventListener('focus',function(){act(i)})});

  /* loupe */
  var loupe=d.getElementById('loupe');if(!loupe)return;var S=168;
  function lens(img,cx,cy,Z){
    var r=img.getBoundingClientRect(),nw=img.naturalWidth||r.width,nh=img.naturalHeight||r.height;
    var sc=Math.max(r.width/nw,r.height/nh),dw=nw*sc,dh=nh*sc,ox=(r.width-dw)/2,oy=(r.height-dh)/2;
    loupe.style.backgroundImage='url("'+(img.currentSrc||img.src)+'")';
    loupe.style.backgroundSize=(dw*Z)+'px '+(dh*Z)+'px';
    loupe.style.backgroundPosition=(-(cx-r.left-ox)*Z+S/2)+'px '+(-(cy-r.top-oy)*Z+S/2)+'px';
  }
  d.querySelectorAll('[data-loupe]').forEach(function(el){
    var img=el.tagName==='IMG'?el:el.querySelector('img'),Z=parseFloat(el.getAttribute('data-loupe'))||2.2;
    el.addEventListener('pointermove',function(e){
      if(e.pointerType==='touch')return;
      loupe.classList.remove('parked');loupe.style.left=loupe.style.top='0';
      lens(img,e.clientX,e.clientY,Z);
      loupe.style.transform='translate('+(e.clientX-S/2)+'px,'+(e.clientY-S/2)+'px)';loupe.classList.add('on');
    });
    el.addEventListener('pointerleave',function(){loupe.classList.remove('on')});
  });
  /* park the loupe on the first slide, like an object left on the table */
  var first=d.querySelector('.slide .win img');
  if(first&&matchMedia('(min-width:861px)').matches){
    var park=function(){
      var r=first.getBoundingClientRect(),host=d.querySelector('.table').getBoundingClientRect();
      var cx=r.left+r.width*.74,cy=r.top+r.height*.66;
      lens(first,cx,cy,2.4);
      loupe.classList.add('parked','on');loupe.style.transform='none';
      loupe.style.left=(cx-host.left-S/2)+'px';loupe.style.top=(cy-host.top-S/2)+'px';
    };
    if(first.complete)park();else first.addEventListener('load',park);
    act(0);
  }
})();
