(function(){
  var d=document,lock=d.getElementById('lock');
  if(lock){var pw=lock.querySelector('input');
    var show=function(){lock.hidden=false;pw.value='';setTimeout(function(){pw.focus()},30)};
    lock.querySelector('form').addEventListener('submit',function(e){e.preventDefault();if(!pw.value)return;lock.hidden=true;if(location.hash==='#lock')history.replaceState(null,'',location.pathname)});
    var rl=d.getElementById('relock');if(rl)rl.addEventListener('click',show);
    if(location.hash==='#lock')show();
    addEventListener('hashchange',function(){if(location.hash==='#lock')show()});
  }
  var rail=d.getElementById('rail'),ln=d.getElementById('ln'),pos=d.getElementById('pos');
  function setp(p){if(ln)ln.style.setProperty('--p',(Math.max(0,Math.min(1,p))*100).toFixed(2)+'%')}
  if(rail){var li=[].slice.call(rail.children),cur=0;
    var step=function(){return li[1].offsetLeft-li[0].offsetLeft};
    var upd=function(){var max=rail.scrollWidth-rail.clientWidth;setp(max?rail.scrollLeft/max:0);
      var i=Math.max(0,Math.min(li.length-1,Math.round(rail.scrollLeft/step())));
      if(i!==cur){li[cur].classList.remove('on');li[i].classList.add('on');cur=i;pos.textContent=('0'+(i+1)).slice(-2)}};
    var go=function(i){i=Math.max(0,Math.min(li.length-1,i));rail.scrollTo({left:i*step(),behavior:'smooth'})};
    rail.addEventListener('scroll',upd,{passive:true});
    addEventListener('wheel',function(e){if(!lock.hidden)return;if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){rail.scrollLeft+=e.deltaY;e.preventDefault()}},{passive:false});
    addEventListener('keydown',function(e){if(!lock.hidden)return;
      if(e.key==='ArrowRight'){go(cur+1);e.preventDefault()}else if(e.key==='ArrowLeft'){go(cur-1);e.preventDefault()}});
    var sx=null,sl=0,moved=0;
    rail.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;sx=e.clientX;sl=rail.scrollLeft;moved=0});
    addEventListener('pointermove',function(e){if(sx===null)return;var dx=e.clientX-sx;if(Math.abs(dx)>4){moved=1;rail.classList.add('drag')}if(moved)rail.scrollLeft=sl-dx});
    addEventListener('pointerup',function(){if(sx===null)return;sx=null;if(moved){rail.classList.remove('drag');go(Math.round(rail.scrollLeft/step()))}});
    rail.addEventListener('click',function(e){if(moved){e.preventDefault();moved=0}},true);
    upd();
  }else if(ln){var f=function(){var h=d.documentElement;setp(h.scrollTop/(h.scrollHeight-h.clientHeight||1))};addEventListener('scroll',f,{passive:true});f()}
})();
