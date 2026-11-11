(function(){
  var d=document,lock=d.getElementById('lock');
  if(lock){var pw=lock.querySelector('input');
    var show=function(){lock.hidden=false;pw.value='';setTimeout(function(){pw.focus()},30)};
    lock.querySelector('form').addEventListener('submit',function(e){e.preventDefault();if(!pw.value)return;lock.hidden=true;if(location.hash==='#lock')history.replaceState(null,'',location.pathname)});
    var rl=d.getElementById('relock');if(rl)rl.addEventListener('click',show);
    if(location.hash==='#lock')show();
    addEventListener('hashchange',function(){if(location.hash==='#lock')show()});
  }
})();
