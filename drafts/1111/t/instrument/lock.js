(function(){
  var lock=document.getElementById('lock');if(!lock)return;
  var pw=lock.querySelector('input'),cells=lock.querySelectorAll('.cells i');
  function show(){lock.hidden=false;pw.value='';paint();setTimeout(function(){pw.focus()},30)}
  function hide(){lock.hidden=true;if(location.hash==='#lock')history.replaceState(null,'',location.pathname)}
  function paint(){cells.forEach(function(c,i){c.classList.toggle('f',i<pw.value.length)})}
  pw.addEventListener('input',paint);
  lock.querySelector('form').addEventListener('submit',function(e){e.preventDefault();if(pw.value.length)hide()});
  var b=document.getElementById('relock');if(b)b.addEventListener('click',show);
  if(location.hash==='#lock')show();
  window.addEventListener('hashchange',function(){if(location.hash==='#lock')show()});
})();
