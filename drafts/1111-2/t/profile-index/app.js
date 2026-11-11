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
  var st=[].slice.call(d.querySelectorAll('.st'));
  st.forEach(function(a){function on(){st.forEach(function(b){b.classList.toggle('on',b===a)})}
    a.addEventListener('mouseenter',on);a.addEventListener('focus',on)});
})();
