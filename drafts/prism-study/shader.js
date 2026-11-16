/* SPECTRUM prism — one full-screen fragment shader (WebGL1). Derived from astra-film Study 08.
   Changed: longer prism, CPU-built camera basis (no pole logic in GLSL), floor light as an analytic
   finite-slit model (white beam → dispersed fan, continuous), light path inside the glass, faint
   secondary beams, project-band emphasis, shared entry reflection, no per-pixel trig. */
window.PRISM_BASIS = function (l) {   // constant orthonormal basis of a studio card direction, as GLSL literals
  var n = Math.hypot(l[0], l[1], l[2]), f = l.map(function (x) { return x / n; });
  var r = [-f[2], 0, f[0]], rn = Math.hypot(r[0], r[2]); r = r.map(function (x) { return x / rn; });
  var u = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]];
  var v = function (a) { return 'vec3(' + a.map(function (x) { return x.toFixed(6); }).join(',') + ')'; };
  return v(f) + ',' + v(r) + ',' + v(u);
};
window.PRISM_VS = 'attribute vec2 p;varying vec2 uv;void main(){uv=p;gl_Position=vec4(p,0.,1.);}';
window.PRISM_FS = [
'precision highp float;',
'varying vec2 uv;',
'uniform vec2 res,shift,rc;',                 // rc = (cos rot, sin rot)
'uniform vec3 camE,camF,camR,camU,nrgb;',
'uniform float lens,aa,farGain,selT,selAmt,dimAmt,amb,air,bandW,fanSpread;uniform vec4 fld;',   // fld (pass 16, Projects only): amount, field half-width, stripe-zone width (both in honest-u units), hue drift inside the field   // bandW: width of the emphasised band (1 = the old six-band width; wider in Projects)
'uniform vec4 rb[24];',                        // 4 ribbons × (R,G,B,V origin.xz+dir.xz, power, meta)
'uniform vec4 rail;uniform float railP;',
'uniform sampler2D atlas;uniform vec4 cd[3];uniform vec4 key;uniform vec3 glow;uniform float ab;',   // about: image cards inside the glass (per face: alpha, tile offset, flip, tile width), key light, floor glow
'uniform sampler2D ramp,paper;uniform float spK,fanK,rampS,bloom,pap,legT;',   // pass 4: spectrum ramp (x = squashed spectral coordinate, y = blur level), paper grain, switches
'const float RV0=' + (0.5 / PrismOptics.RAMP.R).toFixed(6) + ',RV1=' + ((PrismOptics.RAMP.R - 1) / PrismOptics.RAMP.R / Math.log2(PrismOptics.RAMP.SMAX / PrismOptics.RAMP.SMIN)).toFixed(6) + ',RL0=' + Math.log2(PrismOptics.RAMP.SMIN).toFixed(6) + ',RSC=' + PrismOptics.RAMP.SMAX.toFixed(4) + ',RUK=' + PrismOptics.RAMP.UK.toFixed(4) + ',RFK=' + PrismOptics.RAMP.FK.toFixed(5) + ';',
'uniform float SIG2;uniform vec2 rampE;',       // slit half-width² (.00048 = σ≈.022 world units; finer in the Home close-up), u of the violet / red edge rays
'vec2 gGr;float gSp,gH;',
'vec2 gFa,gFb;',                               // pass 7: floor footprint of the current pixel (across / along the view), zero for rays inside the glass
// thin light lines on the floor are widened by the pixel footprint across them and dimmed by the same factor (energy kept):
// far beams seen at a grazing angle no longer break up into dashes
'float fp2(vec2 dir){float a=gFa.x*dir.y-gFa.y*dir.x,b=gFb.x*dir.y-gFb.y*dir.x;return .33*(a*a+b*b);}',
'float lineP(float l2,float f){return exp(-l2/(SIG2+f))*3.8*sqrt(SIG2/(SIG2+f))+exp(-l2/(.007+f))*.22*sqrt(.007/(.007+f))+exp(-l2/(.06+f))*.025*sqrt(.06/(.06+f));}',   // profile of a white rail (core + two skirts), each widened by the footprint f                      // paper under the current primary floor point: scaled gradient, sparkle, albedo factor (all neutral for rays inside the glass)
'const float CC=' + PrismOptics.CARD.c.toFixed(4) + ',CHW=' + PrismOptics.CARD.hw.toFixed(4) + ',CY0=' + PrismOptics.CARD.y0.toFixed(4) + ',CH=' + PrismOptics.CARD.h.toFixed(4) + ';',      // entry point xz, reflected dir xz, entry reflectance
'const float RIN=' + PrismOptics.RIN.toFixed(4) + ';',
'const float HT=' + PrismOptics.HEIGHT.toFixed(4) + ';',       // slit half-width² (.00048 = σ≈.022 world units; finer in the Home close-up), u of the violet / red edge rays
'const float CN=18.5;',                        // near-field gain: white beam core ≈3.8 like the approved beam
'const vec2 N0=vec2(.8660254,.5),N1=vec2(-.8660254,.5),N2=vec2(0.,-1.);',
'vec3 toLocal(vec3 p){return vec3(rc.x*p.x-rc.y*p.z,p.y,rc.y*p.x+rc.x*p.z);}',
'vec3 toWorld(vec3 p){return vec3(rc.x*p.x+rc.y*p.z,p.y,-rc.y*p.x+rc.x*p.z);}',
'void slab(vec3 n,float d,vec3 ro,vec3 rd,inout float nearT,inout float farT,inout vec3 nn,inout vec3 fn,inout bool ok){float den=dot(n,rd),dist=d-dot(n,ro);if(abs(den)<.00001){if(dist<0.)ok=false;}else{float t=dist/den;if(den<0.){if(t>nearT){nearT=t;nn=n;}}else{if(t<farT){farT=t;fn=n;}}}}',
'bool hit(vec3 ro,vec3 rd,out float nearT,out float farT,out vec3 nn,out vec3 fn){nearT=-10000.;farT=10000.;nn=vec3(0.);fn=nn;bool ok=true;',
' slab(vec3(N0.x,0.,N0.y),RIN,ro,rd,nearT,farT,nn,fn,ok);slab(vec3(N1.x,0.,N1.y),RIN,ro,rd,nearT,farT,nn,fn,ok);slab(vec3(N2.x,0.,N2.y),RIN,ro,rd,nearT,farT,nn,fn,ok);',
' slab(vec3(0.,1.,0.),HT,ro,rd,nearT,farT,nn,fn,ok);slab(vec3(0.,-1.,0.),0.,ro,rd,nearT,farT,nn,fn,ok);return ok&&farT>max(nearT,0.);}',
'float fresnel(float c,float ni,float nt){c=clamp(c,0.,1.);float st2=pow(ni/nt,2.)*(1.-c*c);if(st2>=1.)return 1.;float ct=sqrt(1.-st2);float rs=(ni*c-nt*ct)/(ni*c+nt*ct),rp=(nt*c-ni*ct)/(nt*c+ni*ct);return .5*(rs*rs+rp*rp);}',
'float boxLight(vec3 d,vec3 f,vec3 r,vec3 u,float sx,float sy){float z=dot(d,f);vec2 p=vec2(dot(d,r),dot(d,u))/max(z,.001);return (1.-smoothstep(sx,sx+.018,abs(p.x)))*(1.-smoothstep(sy,sy+.04,abs(p.y)))*step(.01,z);}',
// One seamless dark room: backdrop and distant floor share the same radiance.
'vec3 environment(){return vec3(.0080,.0082,.0080);}',
// Studio cards (unchanged tone). Bases are precomputed constants instead of per-pixel normalize/cross.
'vec3 studio(vec3 d){vec3 c=environment();',
' c+=vec3(.85,.90,1.0)*boxLight(d,' + PRISM_BASIS([-2,2.2,1]) + ',.13,.9);',
' c+=vec3(.35,.40,.48)*boxLight(d,' + PRISM_BASIS([2,1,-1.5]) + ',.055,.8);',
' c+=vec3(.035,.032,.028)*boxLight(d,' + PRISM_BASIS([1,.5,3]) + ',.28,.55);',
' c+=vec3(.56,.76,.73)*boxLight(d,' + PRISM_BASIS([.3,.5,-1]) + ',.11,1.4);return c;}',
'float cross2(vec2 a,vec2 b){return a.x*b.y-a.y*b.x;}',
/* Finite-slit dispersed light on the floor. Four spectral lobes (R,G,B + the violet return of red) are each
   traced exactly on the CPU; here every lobe is the convolution of a Gaussian slit (σ) with its spectral
   width, so the same expression is a white beam where the lobes still overlap and a rainbow where they have
   separated. farGain>0 keeps the fan bright along its length (approved look); farGain=0 is the
   energy-conserving 1/width falloff. */
'vec3 ribbon(vec2 p,vec4 cr,vec4 cg,vec4 cb,vec4 cv,vec4 pw,float fan){',
' vec2 q=p-cg.xy;float s=dot(q,cg.zw);',
' vec2 sp=((cb.xy-cr.xy)+(cb.zw-cr.zw)*s)*1.4925;float w2=dot(sp,sp);',
' float lr=cross2(p-cr.xy,cr.zw),lg=cross2(q,cg.zw),lb=cross2(p-cb.xy,cb.zw),lv=cross2(p-cv.xy,cv.zw);',
' vec4 l2=vec4(lr*lr,lg*lg,lb*lb,lv*lv),sc=vec4(.21,.205,.18,.09),A=vec4(1.,1.,1.12,.10)*pw;',
' float fq=fp2(cg.zw);vec4 den=sc*sc*w2+SIG2+fq;',
' vec4 g=A*sc*sqrt((farGain*farGain*w2+CN*CN*SIG2)/den)*exp(-l2/den);',
' vec4 d2=(sc*sc+.64)*w2+SIG2*14.;g+=A*(.096*fan+.04)*exp(-l2/(d2+fq))*sqrt(d2/(d2+fq));',          // restrained bloom along the whole rail
' vec3 c=vec3(g.x+g.w,g.y,g.z);',
' if(fan>.5){float dd=lb-lr;float u=.19+.67*lb/(dd+(dd<0.?-1e-5:1e-5));',   // spectral coordinate 0 violet … 1 red
'  float farw=w2*.04/(w2*.04+SIG2);float band=1.-smoothstep(.055*bandW,.115*bandW,abs(u-selT));',
'  c*=mix(1.,dimAmt+(1.28-dimAmt)*band,selAmt*farw);',
'  c*=smoothstep(-.03,.08,s)*(1.-smoothstep(55.,80.,s))/(1.+.018*max(s,0.));}',
' return c;}',
/* Pass 4: the dispersed fan as a continuous spectrum. u = where the pixel lies between the blue and red reference rays
   (0 violet … 1 red, exact for a linear pencil), W = their separation scaled to the whole spectrum. One lookup:
   T(u, σu) with σu = slit σ in u units. Amplitude = white slit beam (CN) while the fan is narrower than the slit, the
   approved constant far brightness (farGain) afterwards (farGain 0 = energy conserving 1/W). */
// Projects-only art direction: inverse transverse stretch around the green exit ray.
'vec2 fanPoint(vec2 p){vec4 g=rb[7];vec2 n=vec2(-g.w,g.z);return p-n*dot(p-g.xy,n)*(1.-1./fanSpread);}',
'vec3 fan(vec2 p,vec4 cr,vec4 cg,vec4 cb,vec4 pw){',
' p=fanPoint(p);',
' float s=dot(p-cg.xy,cg.zw);float lr=cross2(p-cr.xy,cr.zw),lb=cross2(p-cb.xy,cb.zw),dd=lb-lr;',
/* Pass 16 — Projects "light field" (DECLARED STYLISATION, like NK_HOME; fld.x = 0 everywhere else, and with ?field=0).
   The honest spectral coordinate uh of this floor point is re-read through a monotonic map around the selected colour selT
   (= the colour that really passes through the reference point at this rotation): within fld.y of it the colour only drifts by
   fld.w (one wide colour field), the rest of the spectrum on each side is laid into a zone fld.z wide (the thin stripes).
   lb/dd are then rescaled as if the glass dispersed E times more, so the brightness / blur model of the fan stays the same one. */
' if(fld.x>.001){float uh=.19+.67*lb/(dd+(dd<0.?-1e-5:1e-5)),x=uh-selT,ax=abs(x);',
'  float R=max((x>0.?1.07-selT:selT+.07)-fld.w,.03),k0=fld.w/fld.y,k1=R/fld.z;',
'  float q=max(ax-fld.y,0.),e=.3*fld.z,sm=q*q/(q+e),dsm=q*(q+2.*e)/((q+e)*(q+e));',
'  float u2=mix(uh,selT+(x<0.?-1.:1.)*(k0*ax+(k1-k0)*sm),fld.x),E=mix(1.,1./max(k0+(k1-k0)*dsm,.02),fld.x);',
'  dd*=E;lb=(u2-.19)*1.4925*dd;}',
' float sg=dd<0.?-1.:1.,W2=2.2276*dd*dd+1e-9,lc=(lb-.4627*dd)*sg;',
' float su2=SIG2*.5/W2;',                                             // σu²
' float uq=lc*min(inversesqrt(W2),RSC*sqrt(2./SIG2));',               // u−.5; beyond the last row the profile is self-similar, so u is rescaled instead
' float v=RV0+RV1*clamp(.5*log2(su2)-RL0,0.,log2(RSC)-RL0);',
' vec4 t=TEX0(ramp,vec2(.5+.5*uq*inversesqrt(uq*uq+RUK*RUK),v));',
' float fg=farGain*RFK;',
' vec3 c=t.rgb*t.rgb*(t.a*t.a*rampS*fanK*sqrt((fg*fg*W2+CN*CN*3.14159*SIG2)/(W2+3.14159*SIG2)));',
// pass 7: the ramp texture ends at |u-.5|≈5.9 and its edge texel of the widest row is not zero. Far outside the fan, on the line where the
// blue and red reference rays are equally far (dd→0), that texel was read with the white-core gain: a thin ghost line across the floor
// (the "stray blue beam"). Beyond |uq|=5 the profile now continues as the Gaussian tail it stands for. Unchanged inside.
' float tl=max(abs(uq)-5.,0.);c*=exp(-tl*tl*.08);',
// soft glow along the wedge: three very wide lobes (about half the fan each), a skirt that also softens both edges
' vec2 le=(vec2(lb)-(rampE-.19)*(1.4925*dd))*sg;float hd=.035*W2+SIG2*14.,hf=W2/(W2+SIG2*40.);',
' c+=(.07+.07*bloom)*hf*(pw.x*vec3(1.,.10,0.)*exp(-le.y*le.y/hd)+pw.z*vec3(.42,0.,1.)*exp(-le.x*le.x/hd))+pw.xyz*(.05*(1.-hf))*exp(-lc*lc/(SIG2*14.));',
' float u=.5+.67*lc*sg/(dd+sg*1e-5);float farw=W2*.04/(W2*.04+SIG2);float band=1.-smoothstep(.055*bandW,.115*bandW,abs(u-selT));',
' c*=mix(1.,dimAmt+(1.28-dimAmt)*band,selAmt*farw);',
' return c*smoothstep(-.03,.08,s)*(1.-smoothstep(55.,80.,s))/(1.+.018*max(s,0.));}',
// Paper: how much of a light travelling along d this point of the sheet catches (slopes facing the light are brighter,
// those facing away fall into shade), plus the odd glint.
'float pm(vec2 d){return clamp(1.+dot(gGr,d),.45,1.7)+gSp;}',
'void paperAt(vec2 xz,float k){if(k>.004){vec4 t=texture2D(paper,vec2(.6504*xz.x-.3314*xz.y,.3314*xz.x+.6504*xz.y));gGr=(t.rg-.5)*(3.0*k);gSp=k*.9*smoothstep(.30,.95,t.a);gH=1.+k*.30*(t.b-.5);}else{gGr=vec2(0.);gSp=0.;gH=1.;}}',
'vec3 floorLight(vec2 p,float ins){vec3 c=vec3(0.);',
' for(int i=0;i<4;i++){vec4 pw=rb[i*6+4];if(pw.x+pw.y+pw.z>.0005){float clip=rb[i*6+5].x;float m=clip>0.?ins:1.-ins;if(m>.001){vec3 l;if(i==1&&spK>.5)l=fan(p,rb[6],rb[7],rb[8],pw);else l=ribbon(i==1?fanPoint(p):p,rb[i*6],rb[i*6+1],rb[i*6+2],rb[i*6+3],pw,clip>0.?0.:1.);c+=l*(m*pm(rb[i*6+1].zw));}}}',
// white rails: the incident slit beam (ends at the entry point) and its reflection off the entry face
' vec2 q=p-rail.xy;float l2=q.y*q.y;float prof=lineP(l2,fp2(vec2(1.,0.)));',
' c+=vec3(1.,.975,.90)*prof*(1.-smoothstep(-.02,.004,q.x))*(1.-ins)*pm(vec2(1.,0.));',
// restrained bloom where the beam meets the glass: a tight warm core and a wide faint halo on the floor
' float r2=dot(q,q);c+=vec3(1.,.90,.74)*bloom*(.42*exp(-r2/.014)+.065*exp(-r2/.08)+.008*exp(-r2/1.))*(1.-.55*ins)*(.5+.5*gH);',
' if(railP>.0005){float s=dot(q,rail.zw);float l=cross2(q,rail.zw);l2=l*l;prof=lineP(l2,fp2(rail.zw));c+=vec3(1.,.975,.90)*prof*railP*smoothstep(-.004,.03,s)*(1.-ins)/(1.+.018*max(s,0.))*pm(rail.zw);}',
' return c;}',
'vec3 ground(vec3 p){',
' vec3 v=toLocal(p);float edge=max(max(dot(v.xz,N0),dot(v.xz,N1)),dot(v.xz,N2))-RIN;',
' float contact=1.-exp(-max(edge,0.)*18.);float ins=1.-smoothstep(-.004,.004,edge);',
' vec3 c=environment()*(.72+.28*contact);',
' contact*=amb;c+=vec3(.014,.017,.017)*exp(-dot(p.xz,p.xz)*.055)*contact;',
' vec2 along=vec2(.86,.51),side=vec2(-along.y,along.x);float axial=dot(p.xz,along),lateral=dot(p.xz,side);',
' c+=vec3(.029,.032,.031)*exp(-pow(lateral/1.9,2.)-pow(axial/6.5,2.))*contact;',
' c+=vec3(.012,.020,.019)*exp(-dot(p.xz-vec2(-1.,1.),p.xz-vec2(-1.,1.))*.18)*contact;',
' c+=glow*(exp(-dot(p.xz,p.xz)*.55)+.5*exp(-dot(p.xz,p.xz)*.07))*contact;',
' return c*gH+floorLight(p.xz,ins);}',
'vec3 world(vec3 o,vec3 d){if(d.y<-.0001){float t=max(-o.y/d.y,0.);vec3 p=o+d*t;vec3 c=ground(p);float gloss=pow(max(dot(reflect(d,vec3(0.,1.,0.)),' + PRISM_BASIS([-2,2.2,1]).split('),')[0] + ')),0.),100.);c+=vec3(.002)*gloss;return mix(c,environment(),1.-exp(-t*.003));}return studio(d);}',
/* About: one image card per side face, a thin emissive slide standing inside the glass, parallel to its face and
   CC from the axis. It is met by the already refracted ray (so it shifts against the glass edges as the prism
   turns), seen from its front only, bright parts emit and occlude, dark parts are clear. ca = signed spectral
   offset of this colour channel: a small lateral shift (exaggerated dispersion). One texture fetch per hit. */
'void card(vec2 N,vec4 c,vec3 o,vec3 d,float tmax,float ca,inout vec3 sum,inout vec3 weight){',
' if(c.x<.004)return;float den=dot(N,d.xz);if(den>-.03)return;',
' float t=(CC-dot(N,o.xz))/den;if(t<=0.||t>=tmax)return;',
' vec3 h=o+d*t;vec2 T=vec2(-N.y,N.x);float u=dot(T,h.xz)*c.z;u+=ca*(.04*dot(T,d.xz)*c.z+.013*u);',
' float v=(h.y-CY0)/CH,eu=CHW-abs(u),ev=min(v,1.-v)*CH;if(eu<0.||ev<0.)return;',
' vec3 tx=TEX0(atlas,vec2(clamp(u/(2.*CHW)+.5,.006,.994)*c.w+c.y,v)).rgb;float lum=dot(tx,vec3(.30,.59,.11));',
' float fade=smoothstep(0.,.045,eu)*smoothstep(0.,.07,ev)*c.x*smoothstep(.03,.30,-den);',
' vec2 r=vec2(u/CHW,v*2.-1.);float vig=1.-.30*dot(r*r,r*r);',
' vec3 em=pow(tx,vec3(2.2))*.90*smoothstep(.04,.22,lum)*vig;',
' em+=vec3(.020,.026,.025)*(1.-smoothstep(.0,.012,min(eu,ev)));',             // the cut edge of the slide catches a little light
' sum+=weight*em*fade;weight*=1.-fade*.86*smoothstep(.10,.45,lum);}',
// Transmitted part of one colour channel through the glass (Snell, Fresnel, TIR, three interior legs).
'vec3 glassT(vec3 entry,vec3 dir,vec3 normal,float ior){float entryF=fresnel(max(dot(-dir,normal),0.),1.,ior);vec3 d=refract(dir,normal,1./ior);vec3 o=entry+d*.0003;vec3 sum=vec3(0.),weight=vec3(1.-entryF);float ca=(ior-nrgb.y)/(nrgb.z-nrgb.x+.00001);',
' for(int bounce=0;bounce<3;bounce++){float a,b;vec3 n,ex;if(!hit(o,d,a,b,n,ex))break;if(ab>.002){card(N0,cd[0],o,d,b,ca,sum,weight);card(N1,cd[1],o,d,b,ca,sum,weight);card(N2,cd[2],o,d,b,ca,sum,weight);}vec3 end=o+d*b;weight*=exp(-vec3(.009,.004,.002)*b);vec3 outRay=refract(d,-ex,ior);float F=fresnel(abs(dot(d,ex)),ior,1.);if(dot(outRay,outRay)>.001){sum+=weight*(1.-F)*world(toWorld(end),toWorld(outRay));weight*=F;}d=reflect(d,ex);o=end+d*.0003;}',
' return sum+weight*world(toWorld(o),toWorld(d))*.5;}',
// The slit sheet has a little height: a faint body in the air above its floor trace (closest approach to the
// beam axis at y=.06, clipped by the first surface). Artistic haze, not a scattering integral.
'float airBeam(vec3 o,vec3 d,float limit){vec3 bo=vec3(rail.x-60.,.06,rail.y),w=o-bo;float b=d.x,den=max(1.-b*b,.00001);float t=(b*w.x-dot(d,w))/den;float along=clamp(w.x+b*t,0.,60.);t=clamp(dot(bo+vec3(along,0.,0.)-o,d),0.,limit);vec3 dl=o+d*t-bo-vec3(along,0.,0.);float d2=dot(dl,dl);return (exp(-d2/.0022)*1.1+exp(-d2/.016)*.10)*smoothstep(0.,.04,t)*smoothstep(0.,.008,limit-t);}',
'vec3 viewRay(vec2 st){vec2 q=st;q.x*=res.x/res.y;q-=shift;return normalize(camF+q.x*camR*lens+q.y*camU*lens);}',
'vec3 scene(vec2 st){vec3 rd=viewRay(st);vec3 ro=toLocal(camE),di=toLocal(rd);float a,b;vec3 n,ex;',
' vec3 col=environment();float limit=200.;gFa=vec2(0.);gFb=vec2(0.);',
' if(rd.y<-.0001){limit=-camE.y/rd.y;paperAt(camE.xz+rd.xz*limit,pap*smoothstep(.03,.22,-rd.y)*exp(-limit*.012));float fk=limit*lens*2./res.y;gFa=camR.xz*fk;gFb=normalize(rd.xz+vec2(1e-6,0.))*(fk/max(-rd.y,.02));col=world(camE,rd);}',
' paperAt(vec2(0.),0.);gFa=vec2(0.);gFb=vec2(0.);',
' if(hit(ro,di,a,b,n,ex)&&a>0.){limit=a;vec3 entry=ro+di*a;',
'  vec3 rf=reflect(di,n);float F=fresnel(max(dot(-di,n),0.),1.,nrgb.y);',
'  vec3 wr=toWorld(rf);vec3 refl=(world(toWorld(entry),wr)+studio(wr)*.20)*F;',
'  refl+=F*key.w*vec3(.92,1.,1.04)*exp(-(1.-dot(wr,key.xyz))*34.);',          // about: one broad soft key card, read as a sheen in front of the image
'  col=vec3(glassT(entry,di,n,nrgb.x).r,glassT(entry,di,n,nrgb.y).g,glassT(entry,di,n,nrgb.z).b);',
// Home title only (legT): the band between the top outline and the floor footprint, where the view through the top
// meets a side wall, shows the floor behind it (at its refracted position, tinted) instead of the total-internal mirror:
// the translucent glass legs of the title art, with the beam and the spectrum passing behind them. Declared cheat.
'  if(legT>.002&&n.y>.5){vec3 dg=refract(di,n,1./nrgb.y);vec3 q=entry-dg*(entry.y/dg.y);float e=max(max(dot(q.xz,N0),dot(q.xz,N1)),dot(q.xz,N2))-RIN;float mk=legT*smoothstep(-.010,.014,e);',
'   if(mk>.002){vec3 wq=toWorld(vec3(q.x,.0005,q.z));paperAt(wq.xz,pap*.6);vec3 fl=world(wq,toWorld(dg));paperAt(vec2(0.),0.);col=mix(col,fl*vec3(.74,.84,.80)+vec3(.040,.052,.048)*(.55+.45*smoothstep(0.,.5,e)),mk);}}',
'  col+=refl;',
'  float edge=10.;',
'  if(dot(n,vec3(N0.x,0.,N0.y))<.99)edge=min(edge,abs(dot(N0,entry.xz)-RIN));',
'  if(dot(n,vec3(N1.x,0.,N1.y))<.99)edge=min(edge,abs(dot(N1,entry.xz)-RIN));',
'  if(dot(n,vec3(N2.x,0.,N2.y))<.99)edge=min(edge,abs(dot(N2,entry.xz)-RIN));',
'  if(n.y<.99)edge=min(edge,abs(entry.y-HT));if(n.y>-.99)edge=min(edge,abs(entry.y));',
'  float bevel=1.-smoothstep(.001,.012,edge);col+=bevel*vec3(.18,.24,.23)*(.3+.7*abs(dot(rd,vec3(.4,.8,.3))))*(1.+.7*ab);}',
' col+=vec3(1.,.975,.90)*airBeam(camE,rd,limit)*air;',
' return max(col,vec3(0.));}',
// Geometry-aware edge AA: four subpixel samples only at silhouettes / facet seams.
'vec4 surfaceKey(vec2 st){vec3 rd=viewRay(st);float a,b;vec3 n,e;bool h=hit(toLocal(camE),toLocal(rd),a,b,n,e);return h&&a>0.?vec4(n,1.):vec4(0.);}',
'void main(){vec2 px=2./res;vec3 col;float edge=0.;',
' if(aa>.5){vec4 key=surfaceKey(uv);edge=length(key-surfaceKey(uv+vec2(px.x,0.)))+length(key-surfaceKey(uv-vec2(px.x,0.)))+length(key-surfaceKey(uv+vec2(0.,px.y)))+length(key-surfaceKey(uv-vec2(0.,px.y)));}',
' if(edge>.1){col=(scene(uv+px*vec2(-.25,-.25))+scene(uv+px*vec2(.25,-.25))+scene(uv+px*vec2(-.25,.25))+scene(uv+px*vec2(.25,.25)))*.25;}else{col=scene(uv);}',
' col=(col*(2.51*col+.03))/(col*(2.43*col+.59)+.14);col=pow(clamp(col,0.,1.),vec3(.454545));',
// Pass 7: only a fixed ±1 LSB dither is left here (keeps the dark gradients free of banding). The visible film grain moves and lives in a DOM overlay (.grain).
' vec2 gp=gl_FragCoord.xy;float g1=fract(sin(dot(gp,vec2(12.9898,78.233)))*43758.5453);float g2=fract(sin(dot(gp+19.17,vec2(39.346,11.135)))*24634.6345);',
' float luma=dot(col,vec3(.2126,.7152,.0722));col+=(g1+g2-1.)*.0045*(1.-.55*smoothstep(.4,1.,luma));',
' gl_FragColor=vec4(clamp(col,0.,1.),1.);}'
].join('\n');

window.PRISM_FS_HIGH = window.PRISM_FS;
/* Preserve RGB dispersion and all three internal reflection legs. Move edge AA
   to four additive passes so the driver compiles a SINGLE scene call site.
   Edge samples are averaged after display transfer (not the old linear HDR
   average); this small edge-only difference is documented, not lossless. */
window.PRISM_FS_COMPACT = window.PRISM_FS_HIGH
 .replace('uniform vec2 res,shift,rc;', 'uniform vec2 res,shift,rc;uniform vec2 jitter;uniform float samplePass;')
 .replace(/ if\(edge>\.1\)\{[^\n]*\}else\{col=scene\(uv\);\}/,
          ' if(samplePass>.5&&edge<=.1)discard;col=scene(edge>.1?uv+px*jitter:uv);')
 .replace('gl_FragColor=vec4(clamp(col,0.,1.),1.);', 'gl_FragColor=vec4(clamp(col,0.,1.),1.)*(edge>.1?.25:1.);');

/* Pass 5: program variants. Same optics in all of them.
   o.gl2   : GLSL ES 3.00 spelling (WebGL2 context).
   o.lod   : ramp/atlas are fetched with an explicit LOD 0. Both textures have no mip chain, so the value is identical;
             without implicit derivatives the HLSL back end does not have to unroll the bounce / ribbon loops for gradients.
   o.cards : false = the About image-card code is left out (it only ever contributes when `ab` > 0). */
window.PRISM_BUILD = function (o) {
  var fs = window.PRISM_FS_COMPACT, vs = window.PRISM_VS, head = '';
  if (!o.cards) {
    fs = fs.replace(/void card\([\s\S]*?smoothstep\(\.10,\.45,lum\);\}/, '')
           .replace(/if\(ab>\.002\)\{card\([^}]*\}/, '');
    if (fs.indexOf('card(') >= 0) throw Error('card strip failed');
  }
  if (o.gl2) {
    head = '#version 300 es\n';
    fs = fs.replace('varying vec2 uv;', 'in vec2 uv;out vec4 fragColor;').replace(/gl_FragColor/g, 'fragColor').replace(/texture2D\(/g, 'texture(');
    vs = vs.replace('attribute', 'in').replace('varying', 'out');
    fs = '#define TEX0(s,c) textureLod(s,c,0.)\n' + fs;
  } else if (o.lod) {
    head = '#extension GL_EXT_shader_texture_lod : enable\n';
    fs = '#define TEX0(s,c) texture2DLodEXT(s,c,0.)\n' + fs;
  } else fs = '#define TEX0(s,c) texture2D(s,c)\n' + fs;
  return { vs: (o.gl2 ? head : '') + vs, fs: head + fs };
};
window.PRISM_BLIT = function (gl2) {   // presents an offscreen frame (or its sub-rectangle, stretched) on the canvas
  var fs = [
    'precision highp float;varying vec2 uv;uniform sampler2D t;uniform vec4 sr;uniform vec2 tp;uniform float fx;',
    'vec3 S(vec2 p){return texture2D(t,min(p,sr.zw)).rgb;}',
    'float L(vec3 c){return dot(c,vec3(.299,.587,.114));}',
    // Post AA (FXAA 1 style, 9 taps, edge-directed): catches every contrast edge — glass bevels, image-card edges, beam edges —
    // which the geometric silhouette AA of the scene shader cannot see. It reads the finished frame only; it never changes the optics.
    'void main(){vec2 p=(uv*.5+.5)*sr.xy;vec3 m=S(p);if(fx<.5){gl_FragColor=vec4(m,1.);return;}',
    ' vec3 nw=S(p+vec2(-1.,-1.)*tp),ne=S(p+vec2(1.,-1.)*tp),sw=S(p+vec2(-1.,1.)*tp),se=S(p+vec2(1.,1.)*tp);',
    ' float lm=L(m),lnw=L(nw),lne=L(ne),lsw=L(sw),lse=L(se);float lo=min(lm,min(min(lnw,lne),min(lsw,lse))),hi=max(lm,max(max(lnw,lne),max(lsw,lse)));',
    ' if(hi-lo<max(.0312,hi*.125)){gl_FragColor=vec4(m,1.);return;}',
    ' vec2 d=vec2(-((lnw+lne)-(lsw+lse)),(lnw+lsw)-(lne+lse));',
    ' float red=max((lnw+lne+lsw+lse)*.25*.125,.0078125);float inv=1./(min(abs(d.x),abs(d.y))+red);d=clamp(d*inv,-8.,8.)*tp;',
    ' vec3 a=.5*(S(p+d*(1./3.-.5))+S(p+d*(2./3.-.5)));vec3 b=a*.5+.25*(S(p+d*-.5)+S(p+d*.5));float lb=L(b);',
    ' gl_FragColor=vec4((lb<lo||lb>hi)?a:b,1.);}'
  ].join('\n'), vs = window.PRISM_VS;
  if (gl2) { fs = '#version 300 es\n' + fs.replace('varying vec2 uv;', 'in vec2 uv;out vec4 fragColor;').replace(/gl_FragColor/g, 'fragColor').replace(/texture2D\(/g, 'texture('); /* pass 7: /g — the first-only replace left two gl_FragColor and the WebGL2 blit never compiled */ vs = '#version 300 es\n' + vs.replace('attribute', 'in').replace('varying', 'out'); }
  return { vs: vs, fs: fs };
};
