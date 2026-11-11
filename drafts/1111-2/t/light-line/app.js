(function(){
  var d=document,lock=d.getElementById('lock');
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
      if(ht)ht.textContent=a.children[1].textContent;
      if(hd)hd.innerHTML=a.children[0].textContent+' / 06<br>'+a.children[3].textContent}
      a.addEventListener('mouseenter',on);a.addEventListener('focus',on)});
  }

  var ll=d.getElementById('ll');
  if(ll){var set=function(p){ll.style.setProperty('--p',Math.max(0,Math.min(1,p)).toFixed(4))};
    var rws=d.querySelectorAll('#rows a');
    if(rws.length){set(1/rws.length);rws.forEach(function(a,i){var f=function(){set((i+1)/rws.length)};a.addEventListener('mouseenter',f);a.addEventListener('focus',f)})}
    else{var sc=function(){var h=d.documentElement.scrollHeight-innerHeight;set(h>0?scrollY/h:0)};addEventListener('scroll',sc,{passive:true});sc()}
  }

})();
