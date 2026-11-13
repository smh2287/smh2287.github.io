/* Minho Song portfolio 2026 — vanilla JS. Own code: fade-in, lock, viewer, film covers, comments. */
(function(){
  var d=document,root=d.documentElement,RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
  root.classList.add('js');
  var B=d.body,KEY='pf2026-key';
  var b64=function(s){var b=atob(s),u=new Uint8Array(b.length);for(var i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u};
  var u64=function(buf){var u=new Uint8Array(buf),s='';for(var i=0;i<u.length;i++)s+=String.fromCharCode(u[i]);return btoa(s)};
  var subtle=window.crypto&&crypto.subtle;
  var vw,group=[],k=0,lastFocus=null,box,vimg,cap;
  var ARW='<svg viewBox="0 0 17 30" aria-hidden="true"><path d="M16 1 2 15l14 14"/></svg>';
  var API='https://s-home.catfish-teeth.ts.net',TK='pfc-token:'+API,cms=[];

  /* ---------- fade-in as images arrive ---------- */
  var fx=[],tick=0;
  function see(){tick=0;var h=innerHeight*1.1;
    fx=fx.filter(function(e){var r=e.getBoundingClientRect();if(r.top<h){var go=function(){e.classList.add('in')};if(e.complete)go();else{e.addEventListener('load',go);e.addEventListener('error',go)}return false}return true})}
  function onS(){if(!tick)tick=requestAnimationFrame(see)}
  function watch(scope){var n=[].slice.call(scope.querySelectorAll('.fx:not(.in)'));
    if(RM){n.forEach(function(e){e.classList.add('in')});return}
    fx=fx.concat(n);see()}
  addEventListener('scroll',onS,{passive:true});addEventListener('resize',onS);

  /* ---------- key handling (AES-GCM, PBKDF2 from passcode) ---------- */
  function derive(pass){
    return subtle.importKey('raw',new TextEncoder().encode(pass),'PBKDF2',false,['deriveKey']).then(function(k){
      return subtle.deriveKey({name:'PBKDF2',salt:b64(B.dataset.salt),iterations:+B.dataset.iter,hash:'SHA-256'},k,{name:'AES-GCM',length:256},true,['decrypt'])})}
  function stored(){var s=null;try{s=sessionStorage.getItem(KEY)}catch(e){}
    return s?subtle.importKey('raw',b64(s),'AES-GCM',true,['decrypt']):Promise.reject()}
  function keep(k){return subtle.exportKey('raw',k).then(function(r){try{sessionStorage.setItem(KEY,u64(r))}catch(e){}return k})}
  function dec(k,iv,ct){return subtle.decrypt({name:'AES-GCM',iv:b64(iv)},k,b64(ct)).then(function(p){return new TextDecoder().decode(p)})}

  /* ---------- project page lock ---------- */
  var gate=d.getElementById('gate'),encEl=d.getElementById('enc'),main=d.getElementById('content');
  function openWith(k){return dec(k,encEl.dataset.iv,encEl.textContent.trim()).then(function(h){
      main.innerHTML=h;main.hidden=false;if(gate)gate.hidden=true;B.classList.add('unlocked');init(main);return k})}
  if(encEl&&main){
    if(!subtle){gate.hidden=false;gate.querySelector('p').textContent='This page needs a secure (https) connection to open.'}
    else stored().then(openWith).then(function(){var q=new URLSearchParams(location.search).get('lightbox');if(q)openById(q)},function(){
      gate.hidden=false;var pw=gate.querySelector('input');setTimeout(function(){pw.focus({preventScroll:true})},60);
      gate.addEventListener('submit',function(e){e.preventDefault();var v=pw.value.trim();if(!v)return;
        derive(v).then(openWith).then(keep).then(function(){
          var q=new URLSearchParams(location.search).get('lightbox');if(q)openById(q);
          if(location.hash){var t=d.getElementById(location.hash.slice(1));if(t)t.scrollIntoView()}
        }).catch(function(){gate.classList.remove('no');void gate.offsetWidth;gate.classList.add('no');pw.select()})});
      pw.addEventListener('input',function(){gate.classList.remove('no')});
    });
  } else if(main) init(main);

  /* ---------- projects list: locked covers stay blurred until the key is known ---------- */
  var bl=[].slice.call(d.querySelectorAll('img.bl[data-ct]'));
  if(bl.length&&subtle)stored().then(function(k){B.classList.add('unlocked');
    bl.forEach(function(im){dec(k,im.dataset.iv,im.dataset.ct).then(function(j){j=JSON.parse(j);
      var n=new Image();n.onload=function(){im.srcset=j.srcset;im.sizes='(max-width:760px) 100vw, 78vw';im.src=j.src;im.style.objectPosition=im.dataset.pos||'';im.classList.remove('bl')};n.src=j.src})})}).catch(function(){});
  watch(d);

  /* ---------- per-page init (runs after unlock on locked pages) ---------- */
  function init(scope){
    watch(scope);
    group=[].slice.call(scope.querySelectorAll('a[data-v]'));
    group.forEach(function(a,i){a.addEventListener('click',function(e){if(e.metaKey||e.ctrlKey||e.shiftKey)return;e.preventDefault();lastFocus=a;open(i)})});
    [].forEach.call(scope.querySelectorAll('button.yt'),function(b){b.addEventListener('click',function(){play(b)})});
    [].forEach.call(scope.querySelectorAll('.cm[data-pf]'),comments);
    var q=new URLSearchParams(location.search).get('lightbox');if(q&&!encEl)openById(q);
  }

  /* ---------- viewer: one image alone over the dimmed page ---------- */
  function build(){
    vw=d.createElement('div');vw.className='vw';vw.hidden=true;vw.setAttribute('role','dialog');vw.setAttribute('aria-modal','true');vw.setAttribute('aria-label','Image viewer');
    vw.innerHTML='<p class="c" aria-live="polite"></p><div class="bx"><img alt=""></div>'+
      '<button class="z zp" type="button" aria-label="Previous image">'+ARW+'</button>'+
      '<button class="z zn" type="button" aria-label="Next image"><svg viewBox="0 0 17 30" aria-hidden="true"><path d="M1 1l14 14L1 29"/></svg></button>'+
      '<button class="x" type="button" aria-label="Close"><svg viewBox="0 0 18 18" aria-hidden="true"><path d="M1 1l16 16M17 1 1 17"/></svg></button>';
    B.appendChild(vw);box=vw.querySelector('.bx');vimg=box.querySelector('img');cap=vw.querySelector('.c');
    vw.querySelector('.zp').onclick=function(){go(k-1)};vw.querySelector('.zn').onclick=function(){go(k+1)};
    vw.querySelector('.x').onclick=close;
    vw.addEventListener('click',function(e){if(e.target===vw||e.target===box)close()});
    var sx=null;vw.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
    vw.addEventListener('touchend',function(e){if(sx===null)return;var dx=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(dx)>50)go(dx<0?k+1:k-1)});
    addEventListener('keydown',function(e){if(vw.hidden)return;
      if(e.key==='Escape')close();else if(e.key==='ArrowRight')go(k+1);else if(e.key==='ArrowLeft')go(k-1);
      else if(e.key==='Tab'){var f=[].slice.call(vw.querySelectorAll('button')).filter(function(b){return b.offsetParent});var i=f.indexOf(d.activeElement);e.preventDefault();f[(i+(e.shiftKey?-1:1)+f.length)%f.length].focus()}});
    addEventListener('popstate',function(){if(!vw.hidden&&!new URLSearchParams(location.search).get('lightbox'))close(true)});
  }
  function put(i,fade){k=(i+group.length)%group.length;var a=group[k];
    var set=function(){vimg.removeAttribute('src');vimg.srcset=a.dataset.s+' 1280w, '+a.getAttribute('href')+' '+a.dataset.w+'w';
      vimg.sizes='84vw';vimg.src=a.getAttribute('href');vimg.width=a.dataset.w;vimg.height=a.dataset.h;
      vimg.alt=(a.querySelector('img')||{}).alt||'';cap.innerHTML='';var b=d.createElement('b');b.textContent=a.dataset.c;cap.appendChild(b);cap.appendChild(d.createTextNode(a.dataset.t||''));
      var show=function(){box.classList.add('in')};if(vimg.complete)requestAnimationFrame(show);else{vimg.onload=show;vimg.onerror=show}
      var u=new URL(location.href);u.searchParams.set('lightbox',a.dataset.v);history.replaceState(history.state,'',u)};
    if(fade&&!RM){box.classList.remove('in');setTimeout(set,250)}else{box.classList.remove('in');set()}
    var n=group[(k+1)%group.length];if(n){var p=new Image();p.src=n.dataset.s}}
  function go(i){if(group.length>1)put(i,true)}
  function open(i){if(!vw)build();vw.classList.toggle('one',group.length<2);
    var u=new URL(location.href);if(!u.searchParams.get('lightbox')){u.searchParams.set('lightbox',group[i].dataset.v);history.pushState({vw:1},'',u)}
    vw.hidden=false;root.classList.add('vwo');put(i,false);requestAnimationFrame(function(){vw.classList.add('on')});vw.querySelector('.x').focus({preventScroll:true})}
  function close(fromPop){if(!vw||vw.hidden)return;vw.classList.remove('on');box.classList.remove('in');root.classList.remove('vwo');
    var a=group[k];setTimeout(function(){vw.hidden=true;vimg.removeAttribute('src');vimg.removeAttribute('srcset')},RM?0:350);
    if(fromPop!==true){if(history.state&&history.state.vw)history.back();else{var u=new URL(location.href);u.searchParams.delete('lightbox');history.replaceState(null,'',u)}}
    if(a){a.scrollIntoView({block:'nearest'});(lastFocus||a).focus({preventScroll:true})}}
  function openById(v){for(var i=0;i<group.length;i++)if(group[i].dataset.v===v){lastFocus=group[i];group[i].scrollIntoView({block:'center'});open(i);return}}

  /* ---------- film: cover first, player only on click ---------- */
  function play(b){var f=d.createElement('iframe');
    f.src='https://www.youtube-nocookie.com/embed/'+encodeURIComponent(b.dataset.yt)+'?autoplay=1&rel=0&modestbranding=1&playsinline=1';
    f.title=b.dataset.title||'Film';f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';f.allowFullscreen=true;f.referrerPolicy='strict-origin-when-cross-origin';
    b.replaceWith(f)}

  /* ---------- comments: inline last section, existing API ---------- */
  var tok=function(){try{return localStorage.getItem(TK)}catch(e){return null}};
  function api(p,o){o=o||{};var h={'Content-Type':'application/json'},t=tok();if(t)h.Authorization='Bearer '+t;o.headers=h;
    return fetch(API+p,o).then(function(r){return r.json().catch(function(){return{}}).then(function(j){if(!r.ok)throw new Error(j.error||('HTTP '+r.status));return j})})}
  addEventListener('message',function(e){if(e.origin!==API||!e.data||e.data.type!=='pf-comments-auth')return;
    if(e.data.token)try{localStorage.setItem(TK,e.data.token)}catch(x){}
    cms.forEach(function(f){f()})});
  var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
  var codes=function(s){return esc(s).replace(/\b(\d{1,2}\.\d\d)\b/g,'<u>$1</u>')};
  var ago=function(ts){var s=(Date.now()-ts)/1e3;if(s<60)return'just now';if(s<3600)return Math.floor(s/60)+' min ago';if(s<86400)return Math.floor(s/3600)+' h ago';if(s<2592e3)return Math.floor(s/86400)+' d ago';return new Date(ts).toLocaleDateString('en-GB')};
  var LBL={google:'Google',linkedin:'LinkedIn',dev:'test'};
  function comments(sec){var id=sec.dataset.pf,box=sec.querySelector('.cmb'),provs=null;
    function login(p){var w=520,h=640;window.open(API+'/auth/'+p+'/start?origin='+encodeURIComponent(location.origin),'pfc-login','width='+w+',height='+h+',left='+((screen.width-w)/2)+',top='+((screen.height-h)/2))}
    function draw(me,list){var h='';
      if(list.length){h+='<ol>'+list.map(function(c){var a=c.author||{};
        return '<li'+(c.hidden?' class="hid"':'')+' data-id="'+esc(c.id)+'"><span>'+esc(a.name||'Guest')+(a.headline?'<i>'+esc(a.headline)+'</i>':'')+'<i>'+ago(c.createdAt)+(c.hidden?' · hidden':'')+'</i></span><p>'+codes(c.body||'')+'</p>'+
          ((c.mine||(me&&me.isAdmin))?'<small>'+(me&&me.isAdmin?'<button type="button" data-a="hide">'+(c.hidden?'unhide':'hide')+'</button>':'')+'<button type="button" data-a="del">delete</button></small>':'')+'</li>'}).join('')+'</ol>'}
      else h+='<p class="none">No comments yet.</p>';
      if(me){h+='<form><span class="who">'+esc(me.name)+'<i>via '+esc(LBL[me.provider]||me.provider)+(me.isAdmin?' · owner':'')+'</i></span>'+
        '<textarea name="t" rows="3" maxlength="4000" placeholder="Write a comment" aria-label="Comment" required></textarea>'+
        '<input name="h" maxlength="80" placeholder="Role / company (optional)" aria-label="Role or company" value="'+esc(me.headline||'')+'">'+
        '<div class="acts"><button type="submit">post</button><button type="button" class="q" data-a="out">sign out</button></div></form>'}
      else h+='<div class="sign"><span class="who">Sign in to comment</span><p>'+(provs||[]).map(function(p){return '<button type="button" data-p="'+esc(p)+'">'+esc(LBL[p]||p)+'</button>'}).join(' &nbsp; ')+'</p></div>';
      box.innerHTML=h;
      [].forEach.call(box.querySelectorAll('[data-p]'),function(b){b.onclick=function(){login(b.dataset.p)}});
      [].forEach.call(box.querySelectorAll('[data-a]'),function(b){b.onclick=function(){var li=b.closest('li'),a=b.dataset.a;
        if(a==='out')api('/api/logout',{method:'POST'}).catch(function(){}).then(function(){try{localStorage.removeItem(TK)}catch(e){}refresh()});
        else if(a==='del'){if(confirm('Delete this comment?'))api('/api/comments/'+li.dataset.id,{method:'DELETE'}).then(refresh)}
        else if(a==='hide')api('/api/comments/'+li.dataset.id+'/hide',{method:'POST',body:JSON.stringify({hidden:b.textContent==='hide'})}).then(refresh)}});
      var f=box.querySelector('form');
      if(f){f.t.addEventListener('keydown',function(e){if(e.key==='Enter'&&(e.metaKey||e.ctrlKey)){e.preventDefault();f.requestSubmit()}});
        f.onsubmit=function(e){e.preventDefault();var t=f.t.value.trim();if(!t)return;var s=f.querySelector('[type=submit]');s.disabled=true;
          var hd=f.h.value.trim()||null,p=hd!==(me.headline||null)?api('/api/me',{method:'POST',body:JSON.stringify({headline:hd||''})}):Promise.resolve();
          p.then(function(){return api('/api/projects/'+encodeURIComponent(id)+'/comments',{method:'POST',body:JSON.stringify({body:t})})}).then(refresh)
           .catch(function(err){s.disabled=false;alert(err.message)})}}
    }
    function refresh(){Promise.all([api('/api/me').catch(function(){return{}}),api('/api/projects/'+encodeURIComponent(id)+'/comments'),provs?Promise.resolve({providers:provs}):api('/api/providers')])
      .then(function(r){provs=r[2].providers||[];if(tok()&&!r[0].user)try{localStorage.removeItem(TK)}catch(e){}draw(r[0].user,r[1].comments||[])})
      .catch(function(){box.innerHTML='<p class="none">Comments are unavailable right now.</p>'})}
    cms.push(refresh);
    if('IntersectionObserver' in window){var io=new IntersectionObserver(function(en){if(en[0].isIntersecting){io.disconnect();refresh()}},{rootMargin:'600px'});io.observe(sec)}else refresh();
  }
})();
