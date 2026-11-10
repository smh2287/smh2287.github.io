(function(){
  var d=document;
  var lock=d.getElementById('lock');
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
      ht.textContent=a.children[1].textContent;
      hd.innerHTML=a.children[0].textContent+' / 06<br>'+a.children[3].textContent}
      a.addEventListener('mouseenter',on);a.addEventListener('focus',on)});
  }
  var st=d.getElementById('stage');
  if(st){var si=st.querySelectorAll('img'),btns=d.querySelectorAll('#modes button'),cap=d.getElementById('cap');
    var caps=['The finished car.','Body, doors, seats and wheels separated — the parts that were optimized one by one.','UVs re-edited, shown here with a check pattern.','Rig and wireframe prepared for posing and animation.'];
    btns.forEach(function(b,i){b.addEventListener('click',function(){
      btns.forEach(function(x,k){x.setAttribute('aria-pressed',k===i)});
      si.forEach(function(x,k){x.classList.toggle('on',k===i)});cap.textContent=caps[i]})});
  }
})();
