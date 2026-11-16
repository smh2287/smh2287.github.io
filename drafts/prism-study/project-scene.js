/* Projects: art-directed 2.5D light sheet. No ray marching / spectral solves.
   Geometry is normalized to the frame; the selected wavelength opens like an accordion.
   One capped-resolution canvas, repainted only when selection or viewport changes. */
(function(root){
 'use strict';
 var O=typeof module!=='undefined'&&module.exports?require('./optics.js'):root.PrismOptics;
 function layout(w,h){var mobile=w/h<.9;return {w:w,h:h,x:w*(mobile?.14:.205),y:h*(mobile?.64:.735),right:w*1.08,top:h*(mobile?.08:-.18),bottom:h*(mobile?.65:.75),pillar:w*(mobile?.042:.036),artX:w*(mobile?.64:.67),artY:h*(mobile?.53:.57),artW:w*(mobile?.73:.59)};}
 // A monotone wavelength remap: preserve the whole spectrum, expand only around
 // the wavelength found by the prism's current rotation (not a per-project color).
 function weights(t){var a=[],sum=0;for(var i=0;i<128;i++){var v=.25+8*Math.exp(-.5*Math.pow(((i+.5)/128-t)/.045,2));a.push(v);sum+=v;}return a.map(function(v){return v/sum;});}
 function wavelength(y,ws){var acc=0;for(var i=0;i<ws.length;i++){if(y<=acc+ws[i]||i===ws.length-1)return (i+Math.max(0,Math.min(1,(y-acc)/ws[i])))/ws.length;acc+=ws[i];}return 1;}
 function color(y,ws){var t=wavelength(y,ws),c=O.spectral(t),peak=Math.max(c[0],c[1],c[2],.001);return c.map(function(v){return Math.round(255*Math.pow(Math.max(0,v/peak),1/2.2));});}
 function init(el){
  var cx=el.getContext('2d'),buffer=document.createElement('canvas'),bc=buffer.getContext('2d'),last='',draws=0;
  function draw(s,w,h){var key=w+'|'+h+'|'+s.toFixed(3);if(key===last)return;last=key;draws++;
   var g=layout(w,h),dpr=Math.min(devicePixelRatio||1,1.25),scale=Math.min(dpr,Math.sqrt(1600000/(w*h)));
   var W=Math.round(w*scale),H=Math.round(h*scale);if(el.width!==W||el.height!==H){el.width=buffer.width=W;el.height=buffer.height=H;}
   cx.setTransform(scale,0,0,scale,0,0);bc.setTransform(scale,0,0,scale,0,0);bc.clearRect(0,0,w,h);cx.fillStyle='#282828';cx.fillRect(0,0,w,h);
   var ws=weights(s),count=240;
   for(var i=0;i<count;i++){var t=i/count,u=(i+1.35)/count,c=color((i+.5)/count,ws),a=g.top+(g.bottom-g.top)*t,b=g.top+(g.bottom-g.top)*u;
    bc.fillStyle='rgb('+c.join(',')+')';bc.beginPath();bc.moveTo(g.x,g.y);bc.lineTo(g.right,a);bc.lineTo(g.right,b);bc.closePath();bc.fill();}
   // Feather the aperture and distant edge in a single compositing pass.
   bc.globalCompositeOperation='destination-in';var fade=bc.createLinearGradient(g.x-4,0,g.x+w*.24,0);fade.addColorStop(0,'rgba(255,255,255,0)');fade.addColorStop(.2,'rgba(255,255,255,.8)');fade.addColorStop(1,'white');bc.fillStyle=fade;bc.fillRect(0,0,w,h);bc.globalCompositeOperation='source-over';
   cx.save();cx.filter='blur('+Math.max(2,h*.004)+'px)';cx.drawImage(buffer,0,0,w,h);cx.restore();
   // Crisp, fine incident slit; the glass is a long, slender three-facet column.
   var foot=g.x-g.pillar*.15,l=foot-g.pillar*.64,r=foot+g.pillar*.36,head=-h*.16;
   var glass=cx.createLinearGradient(l,0,r,0);glass.addColorStop(0,'rgba(255,255,255,.015)');glass.addColorStop(.46,'rgba(226,245,255,.065)');glass.addColorStop(.5,'rgba(255,255,255,.17)');glass.addColorStop(.55,'rgba(255,255,255,.025)');glass.addColorStop(1,'rgba(255,255,255,.07)');
   cx.fillStyle=glass;cx.beginPath();cx.moveTo(l,head);cx.lineTo(r,head);cx.lineTo(r,g.y);cx.lineTo(foot,g.y+9);cx.lineTo(l,g.y-10);cx.closePath();cx.fill();
   function line(points,color,width){cx.strokeStyle=color;cx.lineWidth=width;cx.beginPath();points.forEach(function(v,i){if(i)cx.lineTo(v[0],v[1]);else cx.moveTo(v[0],v[1]);});cx.stroke();}
   line([[l,head],[l,g.y-10],[foot,g.y+9],[r,g.y],[r,head]],'rgba(240,247,255,.24)',.8);
   line([[foot,head],[foot,g.y+9]],'rgba(245,250,255,.35)',.7);
   line([[-20,g.y+h*.15],[g.x-5,g.y-2]],'rgba(255,255,255,.13)',9);
   line([[-20,g.y+h*.15],[g.x-5,g.y-2]],'rgba(255,255,255,.95)',2);
   line([[l,g.y-9],[r,g.y-20],[foot,g.y+4],[g.x,g.y]],'rgba(255,255,255,.85)',1);
   // Small prism reflection at the navigation's top; it is not another light source.
   var cy=h*.15;line([[l,cy-10],[r,cy],[l,cy+14],[r,cy-4]],'rgba(255,255,255,.55)',.8);
   return g;
  }
  return {draw:draw,stats:function(){return {renderer:'canvas2d-light-sheet',draws:draws,maxPixels:1600000};}};
 }
 var api={layout:layout,weights:weights,wavelength:wavelength,color:color,init:init};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ProjectScene=api;
})(this);
