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
  var st=d.getElementById('stage');
  if(st){var si=st.querySelectorAll('img'),btns=d.querySelectorAll('#modes button'),cap=d.getElementById('cap');
    var caps=['The finished car.','Body, doors, seats and wheels separated — the parts that were optimized one by one.','UVs re-edited, shown here with a check pattern.','Rig and wireframe prepared for posing and animation.'];
    btns.forEach(function(b,i){b.addEventListener('click',function(){
      btns.forEach(function(x,k){x.setAttribute('aria-pressed',k===i)});
      si.forEach(function(x,k){x.classList.toggle('on',k===i)});cap.textContent=caps[i]})});
  }
})();
