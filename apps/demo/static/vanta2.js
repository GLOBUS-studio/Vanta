var VANTA2=(function(exports){'use strict';var su=Object.defineProperty;var ru=(i,e,t)=>e in i?su(i,e,{enumerable:true,configurable:true,writable:true,value:t}):i[e]=t;var xe=(i,e,t)=>ru(i,typeof e!="symbol"?e+"":e,t);var ks=class{constructor(){xe(this,"listeners",new Map);}on(e,t){let n=this.listeners.get(e);return n||(n=new Set,this.listeners.set(e,n)),n.add(t),()=>{n.delete(t),n.size===0&&this.listeners.delete(e);}}emit(e,t){let n=this.listeners.get(e);if(n)for(let s of [...n])try{s(t);}catch(r){console.error("[VantaJS2] listener error",r);}}clear(){this.listeners.clear();}};var Yo=class{constructor(){xe(this,"targets",new Set);xe(this,"listening",false);xe(this,"onPointerMove",e=>{for(let t of this.targets)t.handlePointerMove(e.clientX,e.clientY);});xe(this,"onPointerLeave",()=>{for(let e of this.targets)e.handlePointerLeave();});xe(this,"onScroll",()=>{for(let e of this.targets)e.invalidatePointerRect();});}add(e){this.targets.add(e),this.start();}remove(e){this.targets.delete(e),this.targets.size===0&&this.stop();}start(){this.listening||typeof document>"u"||(this.listening=true,document.addEventListener("pointermove",this.onPointerMove,{passive:true}),document.addEventListener("pointerdown",this.onPointerMove,{passive:true}),document.addEventListener("pointerleave",this.onPointerLeave,{passive:true}),window.addEventListener("blur",this.onPointerLeave,{passive:true}),window.addEventListener("scroll",this.onScroll,{passive:true}),window.addEventListener("resize",this.onScroll,{passive:true}));}stop(){this.listening&&(this.listening=false,document.removeEventListener("pointermove",this.onPointerMove),document.removeEventListener("pointerdown",this.onPointerMove),document.removeEventListener("pointerleave",this.onPointerLeave),window.removeEventListener("blur",this.onPointerLeave),window.removeEventListener("scroll",this.onScroll),window.removeEventListener("resize",this.onScroll));}},Il;function Ll(){return Il??(Il=new Yo)}var Hs=class{constructor(e,t){xe(this,"level");xe(this,"lowFrames",0);xe(this,"highFrames",0);xe(this,"samples",0);xe(this,"enabled");this.level=_i(e,.5,1),this.enabled=t;}get value(){return this.level}setLevel(e){this.level=_i(e,.5,1),this.lowFrames=0,this.highFrames=0;}setEnabled(e){this.enabled=e,this.lowFrames=0,this.highFrames=0;}sample(e){if(!this.enabled||(this.samples++,this.samples<90))return null;let t=e*1e3;return t>26?(this.lowFrames++,this.highFrames=0):t<18?(this.highFrames++,this.lowFrames=0):(this.lowFrames=0,this.highFrames=0),this.lowFrames>=30&&this.level>.5?(this.level=Math.max(.5,this.level-.15),this.lowFrames=0,this.level):this.highFrames>=240&&this.level<1?(this.level=Math.min(1,this.level+.1),this.highFrames=0,this.level):null}};function _i(i,e,t){return Math.min(Math.max(i,e),t)}var Zo=class{constructor(){xe(this,"ticks",new Set);xe(this,"raf",0);xe(this,"running",false);xe(this,"visible",true);xe(this,"onVisibilityChange",()=>{this.visible=!document.hidden,this.visible?this.start():this.stop();});xe(this,"loop",e=>{if(this.running){for(let t of [...this.ticks])try{t(e);}catch(n){console.error("[VantaJS2] frame error",n);}this.running&&(this.raf=requestAnimationFrame(this.loop));}});typeof document<"u"&&(this.visible=!document.hidden,document.addEventListener("visibilitychange",this.onVisibilityChange,{passive:true}));}add(e){this.ticks.add(e),this.start();}remove(e){this.ticks.delete(e),this.ticks.size===0&&this.stop();}start(){this.running||!this.visible||this.ticks.size===0||(this.running=true,this.raf=requestAnimationFrame(this.loop));}stop(){this.running&&(this.running=false,cancelAnimationFrame(this.raf),this.raf=0);}destroy(){this.stop(),this.ticks.clear(),typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisibilityChange);}},Dl;function Nl(){return Dl??(Dl=new Zo)}function Jo(i){if(typeof i=="string"){let e=document.querySelector(i);if(!e)throw new Error(`[VantaJS2] Cannot find element: ${i}`);if(!(e instanceof HTMLElement))throw new Error(`[VantaJS2] Element is not an HTMLElement: ${i}`);return e}if(i instanceof HTMLElement)return i;throw new Error('[VantaJS2] The "el" option must be a selector or an HTMLElement')}function Fl(){try{let e=document.createElement("canvas").getContext("webgl2");return e?(e.getExtension?.("WEBGL_lose_context")?.loseContext(),!0):!1}catch{return  false}}function Ul(i,e){let t=!e.canvas,n=e.canvas??document.createElement("canvas");n.classList.add("vantajs2-canvas"),e.className&&n.classList.add(e.className),n.setAttribute("aria-hidden","true"),n.dataset.vantajs2="canvas";let s=n.parentElement!==i;s&&i.prepend(n);let r=i.style.position,o=getComputedStyle(i).position;(o==="static"||o==="")&&(i.style.position="relative");let a=[];if(e.raiseContent!==false)for(let f of Array.from(i.children)){if(!(f instanceof HTMLElement)||f===n)continue;let h=getComputedStyle(f),g=f.style.position,m=f.style.zIndex,y=false;(h.position==="static"||h.position==="")&&(f.style.position="relative",y=true),(h.zIndex==="auto"||h.zIndex==="")&&(f.style.zIndex="1",y=true),y&&a.push({node:f,position:g,zIndex:m});}let c=i.style.background,l=false,u=f=>{Object.assign(n.style,{position:"absolute",top:"0",left:"0",width:"100%",height:"100%",display:"block",pointerEvents:"none",background:"transparent",zIndex:String(f.zIndex??0)});};return u(e),{canvas:n,measure(){let f=i.getBoundingClientRect();return {width:Math.max(f.width,e.minWidth??0,1),height:Math.max(f.height,e.minHeight??0,1)}},setBuffer(f,h,g){let m=Math.max(1,Math.round(f*g)),y=Math.max(1,Math.round(h*g));n.width!==m&&(n.width=m),n.height!==y&&(n.height=y),n.style.width="100%",n.style.height="100%";},applyFallback(f){f!==null&&(l||(c=i.style.background,l=true),i.style.background=f);},updateCanvasStyle:u,destroy(){(t||s)&&n.remove(),l&&(i.style.background=c),i.style.position=r;for(let f of a)f.node.style.position=f.position,f.node.style.zIndex=f.zIndex;}}}var ou={pixelRatio:void 0,maxPixelRatio:2,minWidth:0,minHeight:0,mouseControls:true,gyroControls:false,speed:1,fpsCap:0,autoPause:true,reducedMotion:"respect",fallback:"#05070a",raiseContent:true,zIndex:0,quality:1,adaptiveQuality:true};function Ol(){return typeof window<"u"&&typeof document<"u"}function au(i,e){return {...ou,...i,...e}}function vi(i){return i instanceof Error?i:new Error(String(i))}var Gs=class{constructor(e,t){xe(this,"name");xe(this,"el");xe(this,"canvas");xe(this,"options");xe(this,"stats");xe(this,"ready",Promise.resolve(this));xe(this,"supported",true);xe(this,"error",null);xe(this,"definition");xe(this,"dom");xe(this,"scheduler",Nl());xe(this,"pointers",Ll());xe(this,"emitter",new ks);xe(this,"qualityController");xe(this,"resizeListeners",new Set);xe(this,"pointerListeners",new Set);xe(this,"qualityListeners",new Set);xe(this,"instance",null);xe(this,"width",1);xe(this,"height",1);xe(this,"dpr",1);xe(this,"pointer",{x:0,y:0,nx:.5,ny:.5,active:false});xe(this,"visible",true);xe(this,"userPaused",false);xe(this,"disposed",false);xe(this,"dirty",true);xe(this,"attached",false);xe(this,"lastFrameAt",0);xe(this,"elapsed",0);xe(this,"time",0);xe(this,"fpsEma",0);xe(this,"frameTimeEma",0);xe(this,"rect",null);xe(this,"resizeRaf",0);xe(this,"ro",null);xe(this,"io",null);xe(this,"mediaQuery",null);xe(this,"reducedMotionActive",false);xe(this,"gyroAttached",false);xe(this,"contextLost",false);xe(this,"onWindowResize",()=>this.scheduleResize());xe(this,"onMediaChange",()=>this.updateReducedMotion());xe(this,"onContextLost",e=>{this.disposed||(e.preventDefault(),this.contextLost=true,this.stats.paused=true,this.updateScheduler(),this.emitter.emit("contextlost",e));});xe(this,"onContextRestored",e=>{this.disposed||(this.contextLost=false,this.lastFrameAt=0,this.dirty=true,this.updateScheduler(),this.emitter.emit("contextrestored",e));});xe(this,"onDeviceOrientation",e=>{if(!this.options.mouseControls||this.disposed)return;let t=e.alpha??0,n=e.beta??0,s=(t+180)%360/360*this.width,r=_i((n+90)/180,0,1)*this.height;this.setPointer(s,r,true);});xe(this,"tick",e=>{if(!this.shouldAnimate())return;let t=this.options.fpsCap??0;t>0&&this.lastFrameAt>0&&e-this.lastFrameAt<1e3/t-.5||this.renderFrame(e);});if(!Ol())throw new Error("[VantaJS2] Effects can only be created in a browser environment");if(!t||t.el==null)throw new Error('[VantaJS2] The "el" option is required');if(this.definition=e,this.name=e.name,this.el=Jo(t.el),this.options=au(e.defaults,t),this.qualityController=new Hs(this.options.quality??1,this.options.adaptiveQuality!==false),this.dom=Ul(this.el,this.options),this.canvas=this.dom.canvas,this.stats={fps:0,frameTime:0,quality:this.qualityController.value,dpr:1,frames:0,visible:true,paused:false},this.measure(),this.dom.setBuffer(this.width,this.height,this.dpr),this.pointer={x:this.width/2,y:this.height/2,nx:.5,ny:.5,active:false},this.mediaQuery=typeof window.matchMedia=="function"?window.matchMedia("(prefers-reduced-motion: reduce)"):null,this.reducedMotionActive=this.options.reducedMotion!=="ignore"&&!!this.mediaQuery?.matches,!Fl()){this.supported=false,this.dom.applyFallback(this.options.fallback??"#05070a"),this.stats.paused=true,this.emitter.emit("unsupported",{reason:"WebGL2 is not available"}),this.emitReady();return}try{this.instance=e.setup(this,this.options);}catch(n){this.supported=false,this.error=vi(n),this.dom.applyFallback(this.options.fallback??"#05070a"),this.stats.paused=true,this.emitter.emit("error",this.error),this.emitReady();return}this.renderFrame(performance.now(),true),this.setupObservers(),this.updateScheduler(),this.emitReady();}get size(){return {width:this.width,height:this.height,dpr:this.dpr}}get quality(){return this.qualityController.value}get container(){return this.el}get reducedMotion(){return this.reducedMotionActive}requestRender(){if(!this.disposed){if(this.dirty=true,this.reducedMotionActive&&!this.userPaused){this.renderFrame(performance.now(),true);return}this.attached||this.updateScheduler();}}onResize(e){return this.resizeListeners.add(e),()=>this.resizeListeners.delete(e)}onQualityChange(e){return this.qualityListeners.add(e),()=>this.qualityListeners.delete(e)}onPointerMove(e){return this.pointerListeners.add(e),()=>this.pointerListeners.delete(e)}setOptions(e){if(this.disposed)return;if(e.el!=null&&Jo(e.el)!==this.el)throw new Error('[VantaJS2] The "el" option cannot be changed after creation');let t=this.options,n={...t,...e};if(this.options=n,n.className!==t.className&&(t.className&&this.canvas.classList.remove(t.className),n.className&&this.canvas.classList.add(n.className)),this.dom.updateCanvasStyle(n),n.quality!==t.quality){this.qualityController.setLevel(n.quality??1);let s=this.qualityController.value;this.stats.quality=s;try{this.instance?.onQualityChange?.(s);}catch(r){this.fail(vi(r));}this.emitter.emit("qualitychange",s);}n.adaptiveQuality!==t.adaptiveQuality&&this.qualityController.setEnabled(n.adaptiveQuality!==false),(n.pixelRatio!==t.pixelRatio||n.maxPixelRatio!==t.maxPixelRatio||n.minWidth!==t.minWidth||n.minHeight!==t.minHeight||n.quality!==t.quality||n.adaptiveQuality!==t.adaptiveQuality)&&this.applySize(),n.reducedMotion!==t.reducedMotion&&this.updateReducedMotion(),n.mouseControls!==t.mouseControls&&(n.mouseControls?this.pointers.add(this):(this.pointers.remove(this),this.handlePointerLeave())),n.gyroControls!==t.gyroControls&&this.updateGyro(),n.fpsCap!==t.fpsCap&&(this.lastFrameAt=0),n.fallback!==t.fallback&&!this.supported&&this.dom.applyFallback(n.fallback??"#05070a");try{this.instance?.setOptions?.(n);}catch(s){this.fail(vi(s));}this.emitter.emit("options",n),this.updateScheduler(),this.requestRender();}pause(){this.disposed||this.userPaused||(this.userPaused=true,this.stats.paused=true,this.updateScheduler(),this.emitter.emit("pause",void 0));}resume(){this.disposed||!this.userPaused||(this.userPaused=false,this.lastFrameAt=0,this.updateScheduler(),this.emitter.emit("resume",void 0));}resize(){this.applySize();}destroy(){if(!this.disposed){this.disposed=true,this.attached&&(this.scheduler.remove(this.tick),this.attached=false),this.resizeRaf&&cancelAnimationFrame(this.resizeRaf),this.ro?.disconnect(),this.io?.disconnect(),this.ro=null,this.io=null,window.removeEventListener("resize",this.onWindowResize),this.mediaQuery?.removeEventListener("change",this.onMediaChange),this.canvas.removeEventListener("webglcontextlost",this.onContextLost),this.canvas.removeEventListener("webglcontextrestored",this.onContextRestored),this.pointers.remove(this),this.detachGyro();try{this.instance?.dispose();}catch(e){console.error("[VantaJS2] dispose error",e);}this.instance=null,this.dom.destroy(),this.resizeListeners.clear(),this.pointerListeners.clear(),this.qualityListeners.clear(),this.stats.paused=true,this.emitter.emit("destroy",void 0),this.emitter.clear();}}on(e,t){return this.emitter.on(e,t)}emitReady(){queueMicrotask(()=>{this.disposed||this.emitter.emit("ready",this);});}measure(){let{width:e,height:t}=this.dom.measure();this.width=e,this.height=t;let n=this.options.pixelRatio??Math.min(window.devicePixelRatio||1,this.options.maxPixelRatio??2);this.dpr=_i(n*this.qualityController.value,.5,4);}applySize(){if(this.disposed)return;let e=this.width,t=this.height,n=this.dpr;if(this.measure(),e===this.width&&t===this.height&&n===this.dpr){this.dirty=true;return}this.dom.setBuffer(this.width,this.height,this.dpr);let s={width:this.width,height:this.height,dpr:this.dpr};this.stats.dpr=this.dpr,this.stats.quality=this.qualityController.value,this.pointer.active||(this.pointer={x:this.width/2,y:this.height/2,nx:.5,ny:.5,active:false});try{this.instance?.resize?.(s);}catch(r){this.fail(vi(r));return}for(let r of this.resizeListeners)r(s);this.emitter.emit("resize",s),this.dirty=true,this.requestRender();}scheduleResize(){this.resizeRaf||this.disposed||(this.resizeRaf=requestAnimationFrame(()=>{this.resizeRaf=0,this.applySize();}));}setupObservers(){typeof ResizeObserver<"u"&&(this.ro=new ResizeObserver(()=>this.scheduleResize()),this.ro.observe(this.el)),typeof IntersectionObserver<"u"&&(this.io=new IntersectionObserver(e=>{let t=e[e.length-1];if(!t)return;let n=this.visible;this.visible=t.isIntersecting,this.stats.visible=this.visible,!n&&this.visible&&(this.lastFrameAt=0),this.updateScheduler();},{rootMargin:"200px 0px"}),this.io.observe(this.el)),window.addEventListener("resize",this.onWindowResize,{passive:true}),this.mediaQuery?.addEventListener("change",this.onMediaChange),this.canvas.addEventListener("webglcontextlost",this.onContextLost,false),this.canvas.addEventListener("webglcontextrestored",this.onContextRestored,false),this.options.mouseControls!==false&&this.pointers.add(this),this.updateGyro();}updateReducedMotion(){let e=this.options.reducedMotion!=="ignore"&&!!this.mediaQuery?.matches;e!==this.reducedMotionActive&&(this.reducedMotionActive=e,e?(this.dirty=true,this.renderFrame(performance.now(),true)):(this.lastFrameAt=0,this.dirty=true),this.updateScheduler());}updateGyro(){this.options.gyroControls&&!this.gyroAttached?(window.addEventListener("deviceorientation",this.onDeviceOrientation,{passive:true}),this.gyroAttached=true):!this.options.gyroControls&&this.gyroAttached&&this.detachGyro();}detachGyro(){this.gyroAttached&&(window.removeEventListener("deviceorientation",this.onDeviceOrientation),this.gyroAttached=false);}shouldAnimate(){return !(this.disposed||!this.supported||this.userPaused||this.contextLost||this.reducedMotionActive||this.options.autoPause!==false&&!this.visible)}updateScheduler(){let e=this.shouldAnimate();e&&!this.attached?(this.scheduler.add(this.tick),this.attached=true):!e&&this.attached&&(this.scheduler.remove(this.tick),this.attached=false),this.stats.paused=!e;}renderFrame(e,t=false){if(this.disposed||!this.instance)return;let n=t||!this.lastFrameAt?0:Math.min((e-this.lastFrameAt)/1e3,.1);this.lastFrameAt=e,this.dirty=false,this.elapsed+=n,this.time+=n*(this.options.speed??1);let s={width:this.width,height:this.height,dpr:this.dpr},r={...this.pointer},o={time:this.time,delta:n,elapsed:this.elapsed,pointer:r,size:s,quality:this.qualityController.value},a=performance.now();try{this.instance.render(o);}catch(l){this.fail(vi(l));return}let c=performance.now()-a;if(n>0){let l=_i(1/n,0,240);this.fpsEma=this.fpsEma?this.fpsEma*.9+l*.1:l,this.frameTimeEma=this.frameTimeEma?this.frameTimeEma*.9+c*.1:c;let f=(this.options.fpsCap??0)>0?null:this.qualityController.sample(n);f!==null&&this.handleQualityChange(f);}this.stats.fps=Math.round(this.fpsEma),this.stats.frameTime=Math.round(this.frameTimeEma*100)/100,this.stats.quality=this.qualityController.value,this.stats.dpr=this.dpr,this.stats.frames++,this.stats.visible=this.visible,this.stats.paused=!this.shouldAnimate(),this.dirty&&this.requestRender();}handleQualityChange(e){this.stats.quality=e;for(let t of this.qualityListeners)t(e);try{this.instance?.onQualityChange?.(e);}catch(t){this.fail(vi(t));return}this.emitter.emit("qualitychange",e),this.applySize(),this.requestRender();}fail(e){this.error=e,console.error(`[VantaJS2] ${this.name}`,e),this.userPaused=true,this.stats.paused=true,this.updateScheduler(),this.emitter.emit("error",e);}handlePointerMove(e,t){if(this.disposed||!this.options.mouseControls)return;let n=this.rect??(this.rect=this.el.getBoundingClientRect()),s=e-n.left,r=t-n.top;if(s<0||r<0||s>n.width||r>n.height){this.handlePointerLeave();return}this.setPointer(s,r,true);}handlePointerLeave(){if(this.pointer.active){this.pointer={...this.pointer,active:false};for(let e of this.pointerListeners)e(this.pointer);this.requestRender();}}invalidatePointerRect(){this.rect=null;}setPointer(e,t,n){this.pointer={x:e,y:t,nx:e/Math.max(this.width,1),ny:t/Math.max(this.height,1),active:n};for(let s of this.pointerListeners)s(this.pointer);this.requestRender();}};function $o(i,e){return new Gs(i,e)}function Ke(i){if(!i.name)throw new Error("[VantaJS2] An effect needs a name");return Object.freeze(i)}var fc=0,wa=1,pc=2;var Es=1,mc=2,Gi=3,ei=0,At=1,Kt=2,di=0,Vi=1,zt=2,Aa=3,Ca=4,gc=5;var fi=100,_c=101,vc=102,xc=103,yc=104,Mc=200,Sc=201,bc=202,Ec=203,Ra=204,Pa=205,Tc=206,wc=207,Ac=208,Cc=209,Rc=210,Pc=211,Ic=212,Lc=213,Dc=214,gr=0,_r=1,vr=2,Ni=3,xr=4,yr=5,Mr=6,Sr=7,Ia=0,Nc=1,Fc=2,an=0,La=1,Da=2,Na=3,Fa=4,Ua=5,Oa=6,Ba=7;var za=300,pi=301,Wi=302,Kr=303,Qr=304,br=1e3,Mn=1001,Er=1002,Dt=1003,Uc=1004;var Ts=1005;var Zt=1006,jr=1007;var Bn=1008;var nn=1009,ka=1010,Ha=1011,Xi=1012,eo=1013,_n=1014,ln=1015,vn=1016,to=1017,no=1018,mi=1020,Ga=35902,Va=35899,Wa=1021,Xa=1022,xn=1023,Fn=1026,zn=1027,io=1028,so=1029,ti=1030,ro=1031;var oo=1033,ws=33776,As=33777,Cs=33778,Rs=33779,ao=35840,lo=35841,co=35842,ho=35843,uo=36196,fo=37492,po=37496,mo=37488,go=37489,Ps=37490,_o=37491,vo=37808,xo=37809,yo=37810,Mo=37811,So=37812,bo=37813,Eo=37814,To=37815,wo=37816,Ao=37817,Co=37818,Ro=37819,Po=37820,Io=37821,Lo=36492,Do=36494,No=36495,Fo=36283,Uo=36284,Is=36285,Oo=36286;var Oc=3200;var qa=0,Bc=1,kn="",Yt="srgb",as="srgb-linear",ls="linear",et="srgb";var mr=7680;var zc=519,kc=512,Hc=513,Gc=514,Ya=515,Vc=516,Wc=517,Za=518,Ja=519,Xc=35044,qi=35048;var $a="300 es",rn=2e3,cs=2001;function lu(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return  true;return  false}function hs(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function qc(){let i=hs("canvas");return i.style.display="block",i}var Bl={};function Ka(...i){let e="THREE."+i.shift();console.log(e,...i);}function Yc(i){let e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.';}return i}function Ie(...i){i=Yc(i);let e="THREE."+i.shift();{let t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i);}}function Fe(...i){i=Yc(i);let e="THREE."+i.shift();{let t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i);}}function rs(...i){let e=i.join(" ");e in Bl||(Bl[e]=true,Ie(...i));}function Zc(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n();}}setTimeout(r,t);})}var Jc={[gr]:gr,[vr]:Mr,[xr]:xr,[Ni]:yr,[_r]:_r,[Mr]:vr,[Sr]:Sr,[yr]:Ni},Sn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t);}hasEventListener(e,t){let n=this._listeners;return n===void 0?false:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1);}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null;}}},Gt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var Ko=Math.PI/180,wr=180/Math.PI;function Ls(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return (Gt[i&255]+Gt[i>>8&255]+Gt[i>>16&255]+Gt[i>>24&255]+"-"+Gt[e&255]+Gt[e>>8&255]+"-"+Gt[e>>16&15|64]+Gt[e>>24&255]+"-"+Gt[t&63|128]+Gt[t>>8&255]+"-"+Gt[t>>16&255]+Gt[t>>24&255]+Gt[n&255]+Gt[n>>8&255]+Gt[n>>16&255]+Gt[n>>24&255]).toLowerCase()}function Ze(i,e,t){return Math.max(e,Math.min(t,i))}function hu(i,e){return (i%e+e)%e}function Qo(i,e,t){return (1-t)*i+t*e}function $c(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Qa(i){switch(i.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function uu(i,e){if(e.constructor===Float32Array)return i;let t=Qa(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(i/t,-1)}function du(i,e){if(e.constructor===Float32Array)return i;let t=Qa(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(i*t)}var il=class il{constructor(e=0,t=0){this.x=e,this.y=t;}get width(){return this.x}set width(e){this.x=e;}get height(){return this.y}set height(e){this.y=e;}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ze(this.x,e.x,t.x),this.y=Ze(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ze(this.x,e,t),this.y=Ze(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ze(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Ze(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y;}};il.prototype.isVector2=true;var Pe=il,bn=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=true,this._x=e,this._y=t,this._z=n,this._w=s;}static slerpFlat(e,t,n,s,r,o,a){let c=n[s+0],l=n[s+1],u=n[s+2],f=n[s+3],h=r[o+0],g=r[o+1],m=r[o+2],y=r[o+3];if(f!==y||c!==h||l!==g||u!==m){let p=c*h+l*g+u*m+f*y;p<0&&(h=-h,g=-g,m=-m,y=-y,p=-p);let d=1-a;if(p<.9995){let S=Math.acos(p),C=Math.sin(S);d=Math.sin(d*S)/C,a=Math.sin(a*S)/C,c=c*d+h*a,l=l*d+g*a,u=u*d+m*a,f=f*d+y*a;}else {c=c*d+h*a,l=l*d+g*a,u=u*d+m*a,f=f*d+y*a;let S=1/Math.sqrt(c*c+l*l+u*u+f*f);c*=S,l*=S,u*=S,f*=S;}}e[t]=c,e[t+1]=l,e[t+2]=u,e[t+3]=f;}static multiplyQuaternionsFlat(e,t,n,s,r,o){let a=n[s],c=n[s+1],l=n[s+2],u=n[s+3],f=r[o],h=r[o+1],g=r[o+2],m=r[o+3];return e[t]=a*m+u*f+c*g-l*h,e[t+1]=c*m+u*h+l*f-a*g,e[t+2]=l*m+u*g+a*h-c*f,e[t+3]=u*m-a*f-c*h-l*g,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback();}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback();}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback();}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback();}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=true){let n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(n/2),u=a(s/2),f=a(r/2),h=c(n/2),g=c(s/2),m=c(r/2);switch(o){case "XYZ":this._x=h*u*f+l*g*m,this._y=l*g*f-h*u*m,this._z=l*u*m+h*g*f,this._w=l*u*f-h*g*m;break;case "YXZ":this._x=h*u*f+l*g*m,this._y=l*g*f-h*u*m,this._z=l*u*m-h*g*f,this._w=l*u*f+h*g*m;break;case "ZXY":this._x=h*u*f-l*g*m,this._y=l*g*f+h*u*m,this._z=l*u*m+h*g*f,this._w=l*u*f-h*g*m;break;case "ZYX":this._x=h*u*f-l*g*m,this._y=l*g*f+h*u*m,this._z=l*u*m-h*g*f,this._w=l*u*f+h*g*m;break;case "YZX":this._x=h*u*f+l*g*m,this._y=l*g*f+h*u*m,this._z=l*u*m-h*g*f,this._w=l*u*f-h*g*m;break;case "XZY":this._x=h*u*f-l*g*m,this._y=l*g*f-h*u*m,this._z=l*u*m+h*g*f,this._w=l*u*f+h*g*m;break;default:Ie("Quaternion: .setFromEuler() encountered an unknown order: "+o);}return t===true&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],c=t[9],l=t[2],u=t[6],f=t[10],h=n+a+f;if(h>0){let g=.5/Math.sqrt(h+1);this._w=.25/g,this._x=(u-c)*g,this._y=(r-l)*g,this._z=(o-s)*g;}else if(n>a&&n>f){let g=2*Math.sqrt(1+n-a-f);this._w=(u-c)/g,this._x=.25*g,this._y=(s+o)/g,this._z=(r+l)/g;}else if(a>f){let g=2*Math.sqrt(1+a-n-f);this._w=(r-l)/g,this._x=(s+o)/g,this._y=.25*g,this._z=(c+u)/g;}else {let g=2*Math.sqrt(1+f-n-a);this._w=(o-s)/g,this._x=(r+l)/g,this._y=(c+u)/g,this._z=.25*g;}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ze(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,c=t._y,l=t._z,u=t._w;return this._x=n*u+o*a+s*l-r*c,this._y=s*u+o*c+r*a-n*l,this._z=r*u+o*l+n*c-s*a,this._w=o*u-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=this.dot(e);a<0&&(n=-n,s=-s,r=-r,o=-o,a=-a);let c=1-t;if(a<.9995){let l=Math.acos(a),u=Math.sin(l);c=Math.sin(c*l)/u,t=Math.sin(t*l)/u,this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+o*t,this._onChangeCallback();}else this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+o*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w;}},sl=class sl{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n;}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(zl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(zl.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*s-a*n),u=2*(a*t-r*s),f=2*(r*n-o*t);return this.x=t+c*l+o*f-a*u,this.y=n+c*u+a*l-r*f,this.z=s+c*f+r*u-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ze(this.x,e.x,t.x),this.y=Ze(this.y,e.y,t.y),this.z=Ze(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ze(this.x,e,t),this.y=Ze(this.y,e,t),this.z=Ze(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ze(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,c=t.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return jo.copy(this).projectOnVector(e),this.sub(jo)}reflect(e){return this.sub(jo.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Ze(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z;}};sl.prototype.isVector3=true;var B=sl,jo=new B,zl=new bn,rl=class rl{constructor(e,t,n,s,r,o,a,c,l){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,c,l);}set(e,t,n,s,r,o,a,c,l){let u=this.elements;return u[0]=e,u[1]=s,u[2]=a,u[3]=t,u[4]=r,u[5]=c,u[6]=n,u[7]=o,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],u=n[4],f=n[7],h=n[2],g=n[5],m=n[8],y=s[0],p=s[3],d=s[6],S=s[1],C=s[4],T=s[7],b=s[2],w=s[5],_=s[8];return r[0]=o*y+a*S+c*b,r[3]=o*p+a*C+c*w,r[6]=o*d+a*T+c*_,r[1]=l*y+u*S+f*b,r[4]=l*p+u*C+f*w,r[7]=l*d+u*T+f*_,r[2]=h*y+g*S+m*b,r[5]=h*p+g*C+m*w,r[8]=h*d+g*T+m*_,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8];return t*o*u-t*a*l-n*r*u+n*a*c+s*r*l-s*o*c}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8],f=u*o-a*l,h=a*c-u*r,g=l*r-o*c,m=t*f+n*h+s*g;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let y=1/m;return e[0]=f*y,e[1]=(s*l-u*n)*y,e[2]=(a*n-s*o)*y,e[3]=h*y,e[4]=(u*t-s*c)*y,e[5]=(s*r-a*t)*y,e[6]=g*y,e[7]=(n*c-l*t)*y,e[8]=(o*t-n*r)*y,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+e,-s*l,s*c,-s*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){return rs("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(ea.makeScale(e,t)),this}rotate(e){return rs("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(ea.makeRotation(-e)),this}translate(e,t){return rs("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(ea.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return  false;return  true}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};rl.prototype.isMatrix3=true;var Ue=rl,ea=new Ue,kl=new Ue().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Hl=new Ue().set(3.2409699,-1.5373832,-0.4986108,-0.9692436,1.8759675,.0415551,.0556301,-0.203977,1.0569715);function fu(){let i={enabled:true,workingColorSpace:as,spaces:{},convert:function(s,r,o){return this.enabled===false||r===o||!r||!o||(this.spaces[r].transfer===et&&(s.r=Nn(s.r),s.g=Nn(s.g),s.b=Nn(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===et&&(s.r=Di(s.r),s.g=Di(s.g),s.b=Di(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===kn?ls:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s);},_getMatrix:function(s,r,o){return s.copy(this.spaces[o].fromXYZ).multiply(this.spaces[r].toXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[as]:{primaries:e,whitePoint:n,transfer:ls,toXYZ:kl,fromXYZ:Hl,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Yt},outputColorSpaceConfig:{drawingBufferColorSpace:Yt}},[Yt]:{primaries:e,whitePoint:n,transfer:et,toXYZ:kl,fromXYZ:Hl,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Yt}}}),i}var Ye=fu();function Nn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Di(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var xi,Ar=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else {xi===void 0&&(xi=hs("canvas")),xi.width=e.width,xi.height=e.height;let s=xi.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=xi;}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=hs("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Nn(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Nn(t[n]/255)*255):t[n]=Nn(t[n]);return {data:t,width:e.width,height:e.height}}else return Ie("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},pu=0,Ui=class{constructor(e=null){this.isTextureSource=true,Object.defineProperty(this,"id",{value:pu++}),this.uuid=Ls(),this.data=e,this.dataReady=true,this.version=0;}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width||0,t.height||0,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===true&&this.version++;}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(ta(s[o].image)):r.push(ta(s[o]));}else r=ta(s);n.url=r;}return t||(e.images[this.uuid]=n),n}};function ta(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Ar.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Ie("Texture: Unable to serialize Texture."),{})}var mu=0,na=new B,$t=class i extends Sn{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Mn,s=Mn,r=Zt,o=Bn,a=xn,c=nn,l=i.DEFAULT_ANISOTROPY,u=kn){super(),this.isTexture=true,Object.defineProperty(this,"id",{value:mu++}),this.uuid=Ls(),this.name="",this.source=new Ui(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new Pe(0,0),this.repeat=new Pe(1,1),this.center=new Pe(0,0),this.rotation=0,this.matrixAutoUpdate=true,this.matrix=new Ue,this.generateMipmaps=true,this.mipmapsAutoUpdate=true,this.premultiplyAlpha=false,this.flipY=true,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=false,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.isPMREMTexture=false,this.normalized=false;}get width(){return this.source.getSize(na).x}get height(){return this.source.getSize(na).y}get depth(){return this.source.getSize(na).z}get image(){return this.source.data}set image(e){this.source.data=e;}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y);}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t});}clearUpdateRanges(){this.updateRanges.length=0;}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=true,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){Ie(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Ie(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n;}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"});}transformUv(e){if(this.mapping!==za)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case br:e.x=e.x-Math.floor(e.x);break;case Mn:e.x=e.x<0?0:1;break;case Er:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case br:e.y=e.y-Math.floor(e.y);break;case Mn:e.y=e.y<0?0:1;break;case Er:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===true&&(this.version++,this.source.needsUpdate=true);}set needsPMREMUpdate(e){e===true&&this.pmremVersion++;}};$t.DEFAULT_IMAGE=null;$t.DEFAULT_MAPPING=za;$t.DEFAULT_ANISOTROPY=1;var ol=class ol{constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s;}get width(){return this.z}set width(e){this.z=e;}get height(){return this.w}set height(e){this.w=e;}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,c=e.elements,l=c[0],u=c[4],f=c[8],h=c[1],g=c[5],m=c[9],y=c[2],p=c[6],d=c[10];if(Math.abs(u-h)<.01&&Math.abs(f-y)<.01&&Math.abs(m-p)<.01){if(Math.abs(u+h)<.1&&Math.abs(f+y)<.1&&Math.abs(m+p)<.1&&Math.abs(l+g+d-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let C=(l+1)/2,T=(g+1)/2,b=(d+1)/2,w=(u+h)/4,_=(f+y)/4,M=(m+p)/4;return C>T&&C>b?C<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(C),s=w/n,r=_/n):T>b?T<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(T),n=w/s,r=M/s):b<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(b),n=_/r,s=M/r),this.set(n,s,r,t),this}let S=Math.sqrt((p-m)*(p-m)+(f-y)*(f-y)+(h-u)*(h-u));return Math.abs(S)<.001&&(S=1),this.x=(p-m)/S,this.y=(f-y)/S,this.z=(h-u)/S,this.w=Math.acos((l+g+d-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ze(this.x,e.x,t.x),this.y=Ze(this.y,e.y,t.y),this.z=Ze(this.z,e.z,t.z),this.w=Ze(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ze(this.x,e,t),this.y=Ze(this.y,e,t),this.z=Ze(this.z,e,t),this.w=Ze(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ze(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w;}};ol.prototype.isVector4=true;var xt=ol,Cr=class extends Sn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:false,internalFormat:null,minFilter:Zt,depthBuffer:true,stencilBuffer:false,resolveColorBuffer:true,resolveDepthBuffer:true,resolveStencilBuffer:true,storeMultisampledColorBuffer:true,storeMultisampledDepthBuffer:true,storeMultisampledStencilBuffer:true,depthTexture:null,samples:0,count:1,depth:1,multiview:false,useArrayDepthTexture:false},n),this.isRenderTarget=true,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new xt(0,0,e,t),this.scissorTest=false,this.viewport=new xt(0,0,e,t),this.textures=[];let s=n.count;for(let r=0;r<s;r++)this.textures[r]=new $t({width:e,height:t,depth:n.depth}),this.textures[r].isRenderTargetTexture=true,this.textures[r].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture;}_setTextureOptions(e={}){let t={minFilter:Zt,generateMipmaps:false,flipY:false,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t);}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e;}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e;}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==true&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose();}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t);}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=true,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new Ui(s);}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t;}else this.depthTexture=e.depthTexture;else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"});}},en=class extends Cr{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=true;}},us=class extends $t{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=true,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Dt,this.minFilter=Dt,this.wrapR=Mn,this.generateMipmaps=false,this.flipY=false,this.unpackAlignment=1,this.layerUpdates=new Set;}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e);}clearLayerUpdates(){this.layerUpdates.clear();}};var Rr=class extends $t{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=true,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Dt,this.minFilter=Dt,this.wrapR=Mn,this.generateMipmaps=false,this.flipY=false,this.unpackAlignment=1;}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var $r=class $r{constructor(e,t,n,s,r,o,a,c,l,u,f,h,g,m,y,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,c,l,u,f,h,g,m,y,p);}set(e,t,n,s,r,o,a,c,l,u,f,h,g,m,y,p){let d=this.elements;return d[0]=e,d[4]=t,d[8]=n,d[12]=s,d[1]=r,d[5]=o,d[9]=a,d[13]=c,d[2]=l,d[6]=u,d[10]=f,d[14]=h,d[3]=g,d[7]=m,d[11]=y,d[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new $r().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,s=1/yi.setFromMatrixColumn(e,0).length(),r=1/yi.setFromMatrixColumn(e,1).length(),o=1/yi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),u=Math.cos(r),f=Math.sin(r);if(e.order==="XYZ"){let h=o*u,g=o*f,m=a*u,y=a*f;t[0]=c*u,t[4]=-c*f,t[8]=l,t[1]=g+m*l,t[5]=h-y*l,t[9]=-a*c,t[2]=y-h*l,t[6]=m+g*l,t[10]=o*c;}else if(e.order==="YXZ"){let h=c*u,g=c*f,m=l*u,y=l*f;t[0]=h+y*a,t[4]=m*a-g,t[8]=o*l,t[1]=o*f,t[5]=o*u,t[9]=-a,t[2]=g*a-m,t[6]=y+h*a,t[10]=o*c;}else if(e.order==="ZXY"){let h=c*u,g=c*f,m=l*u,y=l*f;t[0]=h-y*a,t[4]=-o*f,t[8]=m+g*a,t[1]=g+m*a,t[5]=o*u,t[9]=y-h*a,t[2]=-o*l,t[6]=a,t[10]=o*c;}else if(e.order==="ZYX"){let h=o*u,g=o*f,m=a*u,y=a*f;t[0]=c*u,t[4]=m*l-g,t[8]=h*l+y,t[1]=c*f,t[5]=y*l+h,t[9]=g*l-m,t[2]=-l,t[6]=a*c,t[10]=o*c;}else if(e.order==="YZX"){let h=o*c,g=o*l,m=a*c,y=a*l;t[0]=c*u,t[4]=y-h*f,t[8]=m*f+g,t[1]=f,t[5]=o*u,t[9]=-a*u,t[2]=-l*u,t[6]=g*f+m,t[10]=h-y*f;}else if(e.order==="XZY"){let h=o*c,g=o*l,m=a*c,y=a*l;t[0]=c*u,t[4]=-f,t[8]=l*u,t[1]=h*f+y,t[5]=o*u,t[9]=g*f-m,t[2]=m*f-g,t[6]=a*u,t[10]=y*f+h;}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(gu,e,_u)}lookAt(e,t,n){let s=this.elements;return Qt.subVectors(e,t),Qt.lengthSq()===0&&(Qt.z=1),Qt.normalize(),Vn.crossVectors(n,Qt),Vn.lengthSq()===0&&(Math.abs(n.z)===1?Qt.x+=1e-4:Qt.z+=1e-4,Qt.normalize(),Vn.crossVectors(n,Qt)),Vn.normalize(),Vs.crossVectors(Qt,Vn),s[0]=Vn.x,s[4]=Vs.x,s[8]=Qt.x,s[1]=Vn.y,s[5]=Vs.y,s[9]=Qt.y,s[2]=Vn.z,s[6]=Vs.z,s[10]=Qt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],u=n[1],f=n[5],h=n[9],g=n[13],m=n[2],y=n[6],p=n[10],d=n[14],S=n[3],C=n[7],T=n[11],b=n[15],w=s[0],_=s[4],M=s[8],O=s[12],D=s[1],F=s[5],L=s[9],G=s[13],P=s[2],A=s[6],k=s[10],U=s[14],j=s[3],W=s[7],K=s[11],ee=s[15];return r[0]=o*w+a*D+c*P+l*j,r[4]=o*_+a*F+c*A+l*W,r[8]=o*M+a*L+c*k+l*K,r[12]=o*O+a*G+c*U+l*ee,r[1]=u*w+f*D+h*P+g*j,r[5]=u*_+f*F+h*A+g*W,r[9]=u*M+f*L+h*k+g*K,r[13]=u*O+f*G+h*U+g*ee,r[2]=m*w+y*D+p*P+d*j,r[6]=m*_+y*F+p*A+d*W,r[10]=m*M+y*L+p*k+d*K,r[14]=m*O+y*G+p*U+d*ee,r[3]=S*w+C*D+T*P+b*j,r[7]=S*_+C*F+T*A+b*W,r[11]=S*M+C*L+T*k+b*K,r[15]=S*O+C*G+T*U+b*ee,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],c=e[9],l=e[13],u=e[2],f=e[6],h=e[10],g=e[14],m=e[3],y=e[7],p=e[11],d=e[15],S=c*g-l*h,C=a*g-l*f,T=a*h-c*f,b=o*g-l*u,w=o*h-c*u,_=o*f-a*u;return t*(y*S-p*C+d*T)-n*(m*S-p*b+d*w)+s*(m*C-y*b+d*_)-r*(m*T-y*w+p*_)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],o=e[5],a=e[9],c=e[2],l=e[6],u=e[10];return t*(o*u-a*l)-n*(r*u-a*c)+s*(r*l-o*c)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8],f=e[9],h=e[10],g=e[11],m=e[12],y=e[13],p=e[14],d=e[15],S=t*a-n*o,C=t*c-s*o,T=t*l-r*o,b=n*c-s*a,w=n*l-r*a,_=s*l-r*c,M=u*y-f*m,O=u*p-h*m,D=u*d-g*m,F=f*p-h*y,L=f*d-g*y,G=h*d-g*p,P=S*G-C*L+T*F+b*D-w*O+_*M;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/P;return e[0]=(a*G-c*L+l*F)*A,e[1]=(s*L-n*G-r*F)*A,e[2]=(y*_-p*w+d*b)*A,e[3]=(h*w-f*_-g*b)*A,e[4]=(c*D-o*G-l*O)*A,e[5]=(t*G-s*D+r*O)*A,e[6]=(p*T-m*_-d*C)*A,e[7]=(u*_-h*T+g*C)*A,e[8]=(o*L-a*D+l*M)*A,e[9]=(n*D-t*L-r*M)*A,e[10]=(m*w-y*T+d*S)*A,e[11]=(f*T-u*w-g*S)*A,e[12]=(a*O-o*F-c*M)*A,e[13]=(t*F-n*O+s*M)*A,e[14]=(y*C-m*b-p*S)*A,e[15]=(u*b-f*C+h*S)*A,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,c=e.z,l=r*o,u=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,u*a+n,u*c-s*o,0,l*c-s*a,u*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,o=t._y,a=t._z,c=t._w,l=r+r,u=o+o,f=a+a,h=r*l,g=r*u,m=r*f,y=o*u,p=o*f,d=a*f,S=c*l,C=c*u,T=c*f,b=n.x,w=n.y,_=n.z;return s[0]=(1-(y+d))*b,s[1]=(g+T)*b,s[2]=(m-C)*b,s[3]=0,s[4]=(g-T)*w,s[5]=(1-(h+d))*w,s[6]=(p+S)*w,s[7]=0,s[8]=(m+C)*_,s[9]=(p-S)*_,s[10]=(1-(h+y))*_,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let o=yi.set(s[0],s[1],s[2]).length(),a=yi.set(s[4],s[5],s[6]).length(),c=yi.set(s[8],s[9],s[10]).length();r<0&&(o=-o),un.copy(this);let l=1/o,u=1/a,f=1/c;return un.elements[0]*=l,un.elements[1]*=l,un.elements[2]*=l,un.elements[4]*=u,un.elements[5]*=u,un.elements[6]*=u,un.elements[8]*=f,un.elements[9]*=f,un.elements[10]*=f,t.setFromRotationMatrix(un),n.x=o,n.y=a,n.z=c,this}makePerspective(e,t,n,s,r,o,a=rn,c=false){let l=this.elements,u=2*r/(t-e),f=2*r/(n-s),h=(t+e)/(t-e),g=(n+s)/(n-s),m,y;if(c)m=r/(o-r),y=o*r/(o-r);else if(a===rn)m=-(o+r)/(o-r),y=-2*o*r/(o-r);else if(a===cs)m=-o/(o-r),y=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=f,l[9]=g,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=y,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=rn,c=false){let l=this.elements,u=2/(t-e),f=2/(n-s),h=-(t+e)/(t-e),g=-(n+s)/(n-s),m,y;if(c)m=1/(o-r),y=o/(o-r);else if(a===rn)m=-2/(o-r),y=-(o+r)/(o-r);else if(a===cs)m=-1/(o-r),y=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=0,l[12]=h,l[1]=0,l[5]=f,l[9]=0,l[13]=g,l[2]=0,l[6]=0,l[10]=m,l[14]=y,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return  false;return  true}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};$r.prototype.isMatrix4=true;var lt=$r,yi=new B,un=new lt,gu=new B(0,0,0),_u=new B(1,1,1),Vn=new B,Vs=new B,Qt=new B,Gl=new lt,Vl=new bn,Jn=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=true,this._x=e,this._y=t,this._z=n,this._order=s;}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback();}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback();}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback();}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback();}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=true){let s=e.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],u=s[9],f=s[2],h=s[6],g=s[10];switch(t){case "XYZ":this._y=Math.asin(Ze(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,g),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(h,l),this._z=0);break;case "YXZ":this._x=Math.asin(-Ze(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,g),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-f,r),this._z=0);break;case "ZXY":this._x=Math.asin(Ze(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-f,g),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case "ZYX":this._y=Math.asin(-Ze(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(h,g),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case "YZX":this._z=Math.asin(Ze(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(a,g));break;case "XZY":this._z=Math.asin(-Ze(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,g),this._y=0);break;default:Ie("Euler: .setFromRotationMatrix() encountered an unknown order: "+t);}return this._order=t,n===true&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Gl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Gl,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Vl.setFromEuler(this),this.setFromQuaternion(Vl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order;}};Jn.DEFAULT_ORDER="XYZ";var ds=class{constructor(){this.mask=1;}set(e){this.mask=(1<<e|0)>>>0;}enable(e){this.mask|=1<<e|0;}enableAll(){this.mask=-1;}toggle(e){this.mask^=1<<e|0;}disable(e){this.mask&=~(1<<e|0);}disableAll(){this.mask=0;}test(e){return (this.mask&e.mask)!==0}isEnabled(e){return (this.mask&(1<<e|0))!==0}},vu=0,Wl=new B,Mi=new bn,Rn=new lt,Ws=new B,Qi=new B,xu=new B,yu=new bn,Xl=new B(1,0,0),ql=new B(0,1,0),Yl=new B(0,0,1),Zl={type:"added"},Mu={type:"removed"},Si={type:"childadded",child:null},ia={type:"childremoved",child:null},Wt=class i extends Sn{constructor(){super(),this.isObject3D=true,Object.defineProperty(this,"id",{value:vu++}),this.uuid=Ls(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new B,t=new Jn,n=new bn,s=new B(1,1,1);function r(){n.setFromEuler(t,false);}function o(){t.setFromQuaternion(n,void 0,false);}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:true,enumerable:true,value:e},rotation:{configurable:true,enumerable:true,value:t},quaternion:{configurable:true,enumerable:true,value:n},scale:{configurable:true,enumerable:true,value:s},modelViewMatrix:{value:new lt},normalMatrix:{value:new Ue}}),this.matrix=new lt,this.matrixWorld=new lt,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=false,this.layers=new ds,this.visible=true,this.castShadow=false,this.receiveShadow=false,this.frustumCulled=true,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=false,this.userData={},this.pivot=null;}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot);}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t);}setRotationFromEuler(e){this.quaternion.setFromEuler(e,true);}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e);}setRotationFromQuaternion(e){this.quaternion.copy(e);}rotateOnAxis(e,t){return Mi.setFromAxisAngle(e,t),this.quaternion.multiply(Mi),this}rotateOnWorldAxis(e,t){return Mi.setFromAxisAngle(e,t),this.quaternion.premultiply(Mi),this}rotateX(e){return this.rotateOnAxis(Xl,e)}rotateY(e){return this.rotateOnAxis(ql,e)}rotateZ(e){return this.rotateOnAxis(Yl,e)}translateOnAxis(e,t){return Wl.copy(e).applyQuaternion(this.quaternion),this.position.add(Wl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Xl,e)}translateY(e){return this.translateOnAxis(ql,e)}translateZ(e){return this.translateOnAxis(Yl,e)}localToWorld(e){return this.updateWorldMatrix(true,false),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(true,false),e.applyMatrix4(Rn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ws.copy(e):Ws.set(e,t,n);let s=this.parent;this.updateWorldMatrix(true,false),Qi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Rn.lookAt(Qi,Ws,this.up):Rn.lookAt(Ws,Qi,this.up),this.quaternion.setFromRotationMatrix(Rn),s&&(Rn.extractRotation(s.matrixWorld),Mi.setFromRotationMatrix(Rn),this.quaternion.premultiply(Mi.invert()));}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Fe("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Zl),Si.child=e,this.dispatchEvent(Si),Si.child=null):Fe("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Mu),ia.child=e,this.dispatchEvent(ia),ia.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(true,false),Rn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(true,false),Rn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Rn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(false,true),e.dispatchEvent(Zl),Si.child=e,this.dispatchEvent(Si),Si.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(true,false),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(true,false),this.matrixWorld.decompose(Qi,e,xu),e}getWorldScale(e){return this.updateWorldMatrix(true,false),this.matrixWorld.decompose(Qi,yu,e),e}getWorldDirection(e){this.updateWorldMatrix(true,false);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return  true}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e);}traverseVisible(e){if(this.visible===false)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e);}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e));}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s;}this.matrixWorldNeedsUpdate=true;}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===true&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=false,e=true);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e);}updateWorldMatrix(e,t,n=false){let s=this.parent;if(e===true&&s!==null&&s.updateWorldMatrix(true,false),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===true&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=false,n=true),t===true){let r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(false,true,n);}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==true&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){let f=c[l];r(e.shapes,f);}else r(e.shapes,c);}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(e.materials,this.material[c]));s.material=a;}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object);}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];s.animations.push(r(e.animations,c));}}if(t){let a=o(e.geometries),c=o(e.materials),l=o(e.textures),u=o(e.images),f=o(e.shapes),h=o(e.skeletons),g=o(e.animations),m=o(e.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),u.length>0&&(n.images=u),f.length>0&&(n.shapes=f),h.length>0&&(n.skeletons=h),g.length>0&&(n.animations=g),m.length>0&&(n.nodes=m);}return n.object=s,n;function o(a){let c=[];for(let l in a){let u=a[l];delete u.metadata,c.push(u);}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=true){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===true)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone());}return this}dispose(){this.dispatchEvent({type:"dispose"});}};Wt.DEFAULT_UP=new B(0,1,0);Wt.DEFAULT_MATRIX_AUTO_UPDATE=true;Wt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=true;var Bt=class extends Wt{constructor(){super(),this.isGroup=true,this.type="Group";}},Su={type:"move"},Oi=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null;}getHandSpace(){return this._hand===null&&(this._hand=new Bt,this._hand.matrixAutoUpdate=false,this._hand.visible=false,this._hand.joints={},this._hand.inputState={pinching:false}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Bt,this._targetRay.matrixAutoUpdate=false,this._targetRay.visible=false,this._targetRay.hasLinearVelocity=false,this._targetRay.linearVelocity=new B,this._targetRay.hasAngularVelocity=false,this._targetRay.angularVelocity=new B),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Bt,this._grip.matrixAutoUpdate=false,this._grip.visible=false,this._grip.hasLinearVelocity=false,this._grip.linearVelocity=new B,this._grip.hasAngularVelocity=false,this._grip.angularVelocity=new B,this._grip.eventsEnabled=false),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n);}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=false),this._grip!==null&&(this._grip.visible=false),this._hand!==null&&(this._hand.visible=false),this}update(e,t,n){let s=null,r=null,o=null,a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=true;for(let y of e.hand.values()){let p=t.getJointPose(y,n),d=this._getHandJoint(l,y);p!==null&&(d.matrix.fromArray(p.transform.matrix),d.matrix.decompose(d.position,d.quaternion,d.scale),d.matrixWorldNeedsUpdate=true,d.jointRadius=p.radius),d.visible=p!==null;}let u=l.joints["index-finger-tip"],f=l.joints["thumb-tip"],h=u.position.distanceTo(f.position),g=.02,m=.005;l.inputState.pinching&&h>g+m?(l.inputState.pinching=false,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&h<=g-m&&(l.inputState.pinching=true,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}));}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.quaternion,c.scale),c.matrixWorldNeedsUpdate=true,r.linearVelocity?(c.hasLinearVelocity=true,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=false,r.angularVelocity?(c.hasAngularVelocity=true,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=false,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.quaternion,a.scale),a.matrixWorldNeedsUpdate=true,s.linearVelocity?(a.hasLinearVelocity=true,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=false,s.angularVelocity?(a.hasAngularVelocity=true,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=false,this.dispatchEvent(Su)));}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Bt;n.matrixAutoUpdate=false,n.visible=false,e.joints[t.jointName]=n,e.add(n);}return e.joints[t.jointName]}},Kc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Wn={h:0,s:0,l:0},Xs={h:0,s:0,l:0};function sa(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var ne=class{constructor(e,t,n){return this.isColor=true,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s);}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Yt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ye.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=Ye.workingColorSpace){return this.r=e,this.g=t,this.b=n,Ye.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=Ye.workingColorSpace){if(e=hu(e,1),t=Ze(t,0,1),n=Ze(n,0,1),t===0)this.r=this.g=this.b=n;else {let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=sa(o,r,e+1/3),this.g=sa(o,r,e),this.b=sa(o,r,e-1/3);}return Ye.colorSpaceToWorking(this,s),this}setStyle(e,t=Yt){function n(r){r!==void 0&&parseFloat(r)<1&&Ie("Color: Alpha component of "+e+" will be ignored.");}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case "rgb":case "rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseFloat(r[1]))/100,Math.min(100,parseFloat(r[2]))/100,Math.min(100,parseFloat(r[3]))/100,t);break;case "hsl":case "hsla":if(r=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ie("Color: Unknown color model "+e);}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);Ie("Color: Invalid hex color "+e);}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Yt){let n=Kc[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Ie("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Nn(e.r),this.g=Nn(e.g),this.b=Nn(e.b),this}copyLinearToSRGB(e){return this.r=Di(e.r),this.g=Di(e.g),this.b=Di(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Yt){return Ye.workingToColorSpace(Vt.copy(this),e),Math.round(Ze(Vt.r*255,0,255))*65536+Math.round(Ze(Vt.g*255,0,255))*256+Math.round(Ze(Vt.b*255,0,255))}getHexString(e=Yt){return ("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ye.workingColorSpace){Ye.workingToColorSpace(Vt.copy(this),t);let n=Vt.r,s=Vt.g,r=Vt.b,o=Math.max(n,s,r),a=Math.min(n,s,r),c,l,u=(a+o)/2;if(a===o)c=0,l=0;else {let f=o-a;switch(l=u<=.5?f/(o+a):f/(2-o-a),o){case n:c=(s-r)/f+(s<r?6:0);break;case s:c=(r-n)/f+2;break;case r:c=(n-s)/f+4;break}c/=6;}return e.h=c,e.s=l,e.l=u,e}getRGB(e,t=Ye.workingColorSpace){return Ye.workingToColorSpace(Vt.copy(this),t),e.r=Vt.r,e.g=Vt.g,e.b=Vt.b,e}getStyle(e=Yt){Ye.workingToColorSpace(Vt.copy(this),e);let t=Vt.r,n=Vt.g,s=Vt.b;return e!==Yt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Wn),this.setHSL(Wn.h+e,Wn.s+t,Wn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Wn),e.getHSL(Xs);let n=Qo(Wn.h,Xs.h,t),s=Qo(Wn.s,Xs.s,t),r=Qo(Wn.l,Xs.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b;}},Vt=new ne;ne.NAMES=Kc;var fs=class extends Wt{constructor(){super(),this.isScene=true,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Jn,this.environmentIntensity=1,this.environmentRotation=new Jn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}));}copy(e,t){return super.copy(e,t),this.background=e.background!==null?e.background.clone():null,this.environment=e.environment!==null?e.environment.clone():null,this.fog=e.fog!==null?e.fog.clone():null,this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial!==null?e.overrideMaterial.clone():null,this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},dn=new B,Pn=new B,ra=new B,In=new B,bi=new B,Ei=new B,Jl=new B,oa=new B,aa=new B,la=new B,ca=new xt,ha=new xt,ua=new xt,Zn=class i{constructor(e=new B,t=new B,n=new B){this.a=e,this.b=t,this.c=n;}static getNormal(e,t,n,s){s.subVectors(n,t),dn.subVectors(e,t),s.cross(dn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){dn.subVectors(s,t),Pn.subVectors(n,t),ra.subVectors(e,t);let o=dn.dot(dn),a=dn.dot(Pn),c=dn.dot(ra),l=Pn.dot(Pn),u=Pn.dot(ra),f=o*l-a*a;if(f===0)return r.set(0,0,0),null;let h=1/f,g=(l*c-a*u)*h,m=(o*u-a*c)*h;return r.set(1-g-m,m,g)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,In)===null?false:In.x>=0&&In.y>=0&&In.x+In.y<=1}static getInterpolation(e,t,n,s,r,o,a,c){return this.getBarycoord(e,t,n,s,In)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,In.x),c.addScaledVector(o,In.y),c.addScaledVector(a,In.z),c)}static getInterpolatedAttribute(e,t,n,s,r,o){return ca.setScalar(0),ha.setScalar(0),ua.setScalar(0),ca.fromBufferAttribute(e,t),ha.fromBufferAttribute(e,n),ua.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(ca,r.x),o.addScaledVector(ha,r.y),o.addScaledVector(ua,r.z),o}static isFrontFacing(e,t,n,s){return dn.subVectors(n,t),Pn.subVectors(e,t),dn.cross(Pn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return dn.subVectors(this.c,this.b),Pn.subVectors(this.a,this.b),dn.cross(Pn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,o,a;bi.subVectors(s,n),Ei.subVectors(r,n),oa.subVectors(e,n);let c=bi.dot(oa),l=Ei.dot(oa);if(c<=0&&l<=0)return t.copy(n);aa.subVectors(e,s);let u=bi.dot(aa),f=Ei.dot(aa);if(u>=0&&f<=u)return t.copy(s);let h=c*f-u*l;if(h<=0&&c>=0&&u<=0&&c-u>0)return o=c/(c-u),t.copy(n).addScaledVector(bi,o);la.subVectors(e,r);let g=bi.dot(la),m=Ei.dot(la);if(m>=0&&g<=m)return t.copy(r);let y=g*l-c*m;if(y<=0&&l>=0&&m<=0)return a=l/(l-m),t.copy(n).addScaledVector(Ei,a);let p=u*m-g*f;if(p<=0&&f-u>=0&&g-m>=0)return Jl.subVectors(r,s),a=(f-u)/(f-u+(g-m)),t.copy(s).addScaledVector(Jl,a);let d=1/(p+y+h);return o=y*d,a=h*d,t.copy(n).addScaledVector(bi,o).addScaledVector(Ei,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},En=class{constructor(e=new B(1/0,1/0,1/0),t=new B(-1/0,-1/0,-1/0)){this.isBox3=true,this.min=e,this.max=t;}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(fn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(fn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=fn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=false){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=false){e.updateWorldMatrix(false,false);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===true&&r!==void 0&&e.isInstancedMesh!==true&&e.isBatchedMesh!==true)for(let o=0,a=r.count;o<a;o++)e.isMesh===true?e.getVertexPosition(o,fn):fn.fromBufferAttribute(r,o),fn.applyMatrix4(e.matrixWorld),this.expandByPoint(fn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),qs.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),qs.copy(n.boundingBox)),qs.applyMatrix4(e.matrixWorld),this.union(qs);}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,fn),fn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return  false;this.getCenter(ji),Ys.subVectors(this.max,ji),Ti.subVectors(e.a,ji),wi.subVectors(e.b,ji),Ai.subVectors(e.c,ji),Xn.subVectors(wi,Ti),qn.subVectors(Ai,wi),ri.subVectors(Ti,Ai);let t=[0,-Xn.z,Xn.y,0,-qn.z,qn.y,0,-ri.z,ri.y,Xn.z,0,-Xn.x,qn.z,0,-qn.x,ri.z,0,-ri.x,-Xn.y,Xn.x,0,-qn.y,qn.x,0,-ri.y,ri.x,0];return !da(t,Ti,wi,Ai,Ys)||(t=[1,0,0,0,1,0,0,0,1],!da(t,Ti,wi,Ai,Ys))?false:(Zs.crossVectors(Xn,qn),t=[Zs.x,Zs.y,Zs.z],da(t,Ti,wi,Ai,Ys))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,fn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(fn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Ln[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Ln[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Ln[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Ln[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Ln[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Ln[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Ln[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Ln[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Ln),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return {min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Ln=[new B,new B,new B,new B,new B,new B,new B,new B],fn=new B,qs=new En,Ti=new B,wi=new B,Ai=new B,Xn=new B,qn=new B,ri=new B,ji=new B,Ys=new B,Zs=new B,oi=new B;function da(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){oi.fromArray(i,r);let a=s.x*Math.abs(oi.x)+s.y*Math.abs(oi.y)+s.z*Math.abs(oi.z),c=e.dot(oi),l=t.dot(oi),u=n.dot(oi);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>a)return  false}return  true}var bt=new B,Js=new Pe,bu=0,vt=class extends Sn{constructor(e,t,n=false){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=true,Object.defineProperty(this,"id",{value:bu++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Xc,this.updateRanges=[],this.gpuType=ln,this.version=0,this._normalizationScale=e!==void 0?Qa(e):void 0;}onUploadCallback(){}set needsUpdate(e){e===true&&this.version++;}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t});}clearUpdateRanges(){this.updateRanges.length=0;}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Js.fromBufferAttribute(this,t),Js.applyMatrix3(e),this.setXY(t,Js.x,Js.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)bt.fromBufferAttribute(this,t),bt.applyMatrix3(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)bt.fromBufferAttribute(this,t),bt.applyMatrix4(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)bt.fromBufferAttribute(this,t),bt.applyNormalMatrix(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)bt.fromBufferAttribute(this,t),bt.transformDirection(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=this._denormalize(n)),n}setComponent(e,t,n){return this.normalized&&(n=this._normalize(n)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),s=this._normalize(s)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),s=this._normalize(s),r=this._normalize(r)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"});}_denormalize(e){let t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):uu(e,this.array)}_normalize(e){let t=this._normalizationScale;return t!==void 0?Math.round(e*t):du(e,this.array)}};var ps=class extends vt{constructor(e,t,n){super(new Uint16Array(e),t,n);}};var ms=class extends vt{constructor(e,t,n){super(new Uint32Array(e),t,n);}};var ut=class extends vt{constructor(e,t,n){super(new Float32Array(e),t,n);}},Eu=new En,es=new B,fa=new B,Tn=class{constructor(e=new B,t=-1){this.isSphere=true,this.center=e,this.radius=t;}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Eu.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;es.subVectors(e,this.center);let t=es.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(es,s/n),this.radius+=s;}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===true?this.radius=Math.max(this.radius,e.radius):(fa.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(es.copy(e.center).add(fa)),this.expandByPoint(es.copy(e.center).sub(fa))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return {radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Tu=0,sn=new lt,pa=new Wt,Ci=new B,jt=new En,ts=new En,Lt=new B,ct=class i extends Sn{constructor(){super(),this.isBufferGeometry=true,Object.defineProperty(this,"id",{value:Tu++}),this.uuid=Ls(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=false,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=false;}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(lu(e)?ms:ps)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n});}clearGroups(){this.groups=[];}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t;}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=true);let n=this.attributes.normal;if(n!==void 0){let r=new Ue().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=true;}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=true),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=true,this}applyQuaternion(e){return sn.makeRotationFromQuaternion(e),this.applyMatrix4(sn),this}rotateX(e){return sn.makeRotationX(e),this.applyMatrix4(sn),this}rotateY(e){return sn.makeRotationY(e),this.applyMatrix4(sn),this}rotateZ(e){return sn.makeRotationZ(e),this.applyMatrix4(sn),this}translate(e,t,n){return sn.makeTranslation(e,t,n),this.applyMatrix4(sn),this}scale(e,t,n){return sn.makeScale(e,t,n),this.applyMatrix4(sn),this}lookAt(e){return pa.lookAt(e),pa.updateMatrix(),this.applyMatrix4(pa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ci).negate(),this.translate(Ci.x,Ci.y,Ci.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];n.push(o.x,o.y,o.z||0);}this.setAttribute("position",new ut(n,3));}else {let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0);}e.length>t.count&&Ie("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=true;}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new En);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Fe("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new B(-1/0,-1/0,-1/0),new B(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];jt.setFromBufferAttribute(r),this.morphTargetsRelative?(Lt.addVectors(this.boundingBox.min,jt.min),this.boundingBox.expandByPoint(Lt),Lt.addVectors(this.boundingBox.max,jt.max),this.boundingBox.expandByPoint(Lt)):(this.boundingBox.expandByPoint(jt.min),this.boundingBox.expandByPoint(jt.max));}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Fe('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this);}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Tn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Fe("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new B,1/0);return}if(e){let n=this.boundingSphere.center;if(jt.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];ts.setFromBufferAttribute(a),this.morphTargetsRelative?(Lt.addVectors(jt.min,ts.min),jt.expandByPoint(Lt),Lt.addVectors(jt.max,ts.max),jt.expandByPoint(Lt)):(jt.expandByPoint(ts.min),jt.expandByPoint(ts.max));}jt.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)Lt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Lt));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],c=this.morphTargetsRelative;for(let l=0,u=a.count;l<u;l++)Lt.fromBufferAttribute(a,l),c&&(Ci.fromBufferAttribute(e,l),Lt.add(Ci)),s=Math.max(s,n.distanceToSquared(Lt));}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Fe('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this);}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Fe("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==n.count)&&(o=new vt(new Float32Array(4*n.count),4),this.setAttribute("tangent",o));let a=[],c=[],l=new Uint8Array(n.count);for(let O=0;O<n.count;O++)a[O]=new B,c[O]=new B;let u=new B,f=new B,h=new B,g=new Pe,m=new Pe,y=new Pe,p=new B,d=new B;function S(O,D,F){l[O]=l[D]=l[F]=1,u.fromBufferAttribute(n,O),f.fromBufferAttribute(n,D),h.fromBufferAttribute(n,F),g.fromBufferAttribute(r,O),m.fromBufferAttribute(r,D),y.fromBufferAttribute(r,F),f.sub(u),h.sub(u),m.sub(g),y.sub(g);let L=1/(m.x*y.y-y.x*m.y);isFinite(L)&&(p.copy(f).multiplyScalar(y.y).addScaledVector(h,-m.y).multiplyScalar(L),d.copy(h).multiplyScalar(m.x).addScaledVector(f,-y.x).multiplyScalar(L),a[O].add(p),a[D].add(p),a[F].add(p),c[O].add(d),c[D].add(d),c[F].add(d));}let C=this.groups;C.length===0&&(C=[{start:0,count:e.count}]);for(let O=0,D=C.length;O<D;++O){let F=C[O],L=F.start,G=F.count;for(let P=L,A=L+G;P<A;P+=3)S(e.getX(P+0),e.getX(P+1),e.getX(P+2));}let T=new B,b=new B,w=new B,_=new B;function M(O){w.fromBufferAttribute(s,O),_.copy(w);let D=a[O];T.copy(D),T.sub(w.multiplyScalar(w.dot(D))).normalize(),b.crossVectors(_,D);let L=b.dot(c[O])<0?-1:1;o.setXYZW(O,T.x,T.y,T.z,L);}for(let O=0,D=n.count;O<D;++O)l[O]&&M(O);this._transformed=true;}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new vt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let h=0,g=n.count;h<g;h++)n.setXYZ(h,0,0,0);let s=new B,r=new B,o=new B,a=new B,c=new B,l=new B,u=new B,f=new B;if(e)for(let h=0,g=e.count;h<g;h+=3){let m=e.getX(h+0),y=e.getX(h+1),p=e.getX(h+2);s.fromBufferAttribute(t,m),r.fromBufferAttribute(t,y),o.fromBufferAttribute(t,p),u.subVectors(o,r),f.subVectors(s,r),u.cross(f),a.fromBufferAttribute(n,m),c.fromBufferAttribute(n,y),l.fromBufferAttribute(n,p),a.add(u),c.add(u),l.add(u),n.setXYZ(m,a.x,a.y,a.z),n.setXYZ(y,c.x,c.y,c.z),n.setXYZ(p,l.x,l.y,l.z);}else for(let h=0,g=t.count;h<g;h+=3)s.fromBufferAttribute(t,h+0),r.fromBufferAttribute(t,h+1),o.fromBufferAttribute(t,h+2),u.subVectors(o,r),f.subVectors(s,r),u.cross(f),n.setXYZ(h+0,u.x,u.y,u.z),n.setXYZ(h+1,u.x,u.y,u.z),n.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=true;}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Lt.fromBufferAttribute(e,t),Lt.normalize(),e.setXYZ(t,Lt.x,Lt.y,Lt.z);}toNonIndexed(){function e(a,c){let l=a.array,u=a.itemSize,f=a.normalized,h=new l.constructor(c.length*u),g=0,m=0;for(let y=0,p=c.length;y<p;y++){a.isInterleavedBufferAttribute?g=c[y]*a.data.stride+a.offset:g=c[y]*u;for(let d=0;d<u;d++)h[m++]=l[g++];}return new vt(h,u,f)}if(this.index===null)return Ie("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let a in s){let c=s[a],l=e(c,n);t.setAttribute(a,l);}let r=this.morphAttributes;for(let a in r){let c=[],l=r[a];for(let u=0,f=l.length;u<f;u++){let h=l[u],g=e(h,n);c.push(g);}t.morphAttributes[a]=c;}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let l=o[a];t.addGroup(l.start,l.count,l.materialIndex);}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===true?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==true){let c=this.parameters;for(let l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let c in n){let l=n[c];e.data.attributes[c]=l.toJSON(e.data);}let s={},r=false;for(let c in this.morphAttributes){let l=this.morphAttributes[c],u=[];for(let f=0,h=l.length;f<h;f++){let g=l[f];u.push(g.toJSON(e.data));}u.length>0&&(s[c]=u,r=true);}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let l in s){let u=s[l];this.setAttribute(l,u.clone(t));}let r=e.morphAttributes;for(let l in r){let u=[],f=r[l];for(let h=0,g=f.length;h<g;h++)u.push(f[h].clone(t));this.morphAttributes[l]=u;}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let l=0,u=o.length;l<u;l++){let f=o[l];this.addGroup(f.start,f.count,f.materialIndex);}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"});}};var ma=new B,wu=new B,Au=new Ue,pn=class{constructor(e=new B(1,0,0),t=0){this.isPlane=true,this.normal=e,this.constant=t;}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=ma.subVectors(n,t).cross(wu.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=true){let s=e.delta(ma),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let o=-(e.start.dot(this.normal)+this.constant)/r;return n===true&&(o<0||o>1)?null:t.copy(e.start).addScaledVector(s,o)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Au.getNormalMatrix(e),s=this.coplanarPoint(ma).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return {normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Cu=0,Un=class extends Sn{constructor(){super(),this.isMaterial=true,Object.defineProperty(this,"id",{value:Cu++}),this.uuid=Ls(),this.name="",this.type="Material",this.blending=Vi,this.side=ei,this.vertexColors=false,this.opacity=1,this.transparent=false,this.alphaHash=false,this.blendSrc=Ra,this.blendDst=Pa,this.blendEquation=fi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ne(0,0,0),this.blendAlpha=0,this.depthFunc=Ni,this.depthTest=true,this.depthWrite=true,this.stencilWriteMask=255,this.stencilFunc=zc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=mr,this.stencilZFail=mr,this.stencilZPass=mr,this.stencilWrite=false,this.clippingPlanes=null,this.clipIntersection=false,this.clipShadows=false,this.shadowSide=null,this.colorWrite=true,this.precision=null,this.polygonOffset=false,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=false,this.alphaToCoverage=false,this.premultipliedAlpha=false,this.forceSinglePass=false,this.allowOverride=true,this.visible=true,this.toneMapped=true,this.userData={},this.version=0,this._alphaTest=0;}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e;}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){Ie(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Ie(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n;}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(n.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(n.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(n.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(n.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let c=r[a];delete c.metadata,o.push(c);}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o);}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new ne().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new pn().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===false&&(n=[n,n]),this.normalScale=new Pe().fromArray(n);}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Pe().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone();}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"});}set needsUpdate(e){e===true&&this.version++;}};var Dn=new B,ga=new B,$s=new B,Ks=new B,Bi=class{constructor(e=new B,t=new B(0,0,-1)){this.origin=e,this.direction=t;}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Dn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Dn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Dn.copy(this.origin).addScaledVector(this.direction,t),Dn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){ga.copy(e).add(t).multiplyScalar(.5),$s.copy(t).sub(e).normalize(),Ks.copy(this.origin).sub(ga);let r=e.distanceTo(t)*.5,o=-this.direction.dot($s),a=Ks.dot(this.direction),c=-Ks.dot($s),l=Ks.lengthSq(),u=Math.abs(1-o*o),f,h,g,m;if(u>0)if(f=o*c-a,h=o*a-c,m=r*u,f>=0)if(h>=-m)if(h<=m){let y=1/u;f*=y,h*=y,g=f*(f+o*h+2*a)+h*(o*f+h+2*c)+l;}else h=r,f=Math.max(0,-(o*h+a)),g=-f*f+h*(h+2*c)+l;else h=-r,f=Math.max(0,-(o*h+a)),g=-f*f+h*(h+2*c)+l;else h<=-m?(f=Math.max(0,-(-o*r+a)),h=f>0?-r:Math.min(Math.max(-r,-c),r),g=-f*f+h*(h+2*c)+l):h<=m?(f=0,h=Math.min(Math.max(-r,-c),r),g=h*(h+2*c)+l):(f=Math.max(0,-(o*r+a)),h=f>0?r:Math.min(Math.max(-r,-c),r),g=-f*f+h*(h+2*c)+l);else h=o>0?-r:r,f=Math.max(0,-(o*h+a)),g=-f*f+h*(h+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(ga).addScaledVector($s,h),g}intersectSphere(e,t){if(e.radius<0)return null;Dn.subVectors(e.center,this.origin);let n=Dn.dot(this.direction),s=Dn.dot(Dn)-n*n,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?false:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,c,l=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,h=this.origin;return l>=0?(n=(e.min.x-h.x)*l,s=(e.max.x-h.x)*l):(n=(e.max.x-h.x)*l,s=(e.min.x-h.x)*l),u>=0?(r=(e.min.y-h.y)*u,o=(e.max.y-h.y)*u):(r=(e.max.y-h.y)*u,o=(e.min.y-h.y)*u),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),f>=0?(a=(e.min.z-h.z)*f,c=(e.max.z-h.z)*f):(a=(e.max.z-h.z)*f,c=(e.min.z-h.z)*f),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Dn)!==null}intersectTriangle(e,t,n,s,r){let o=this.origin,a=this.direction,c=a.x,l=a.y,u=a.z,f=e.x-o.x,h=e.y-o.y,g=e.z-o.z,m=t.x-o.x,y=t.y-o.y,p=t.z-o.z,d=n.x-o.x,S=n.y-o.y,C=n.z-o.z,T=Math.abs(c),b=Math.abs(l),w=Math.abs(u),_,M,O,D,F,L,G,P,A,k,U,j;if(T>=b&&T>=w?(O=c,L=f,A=m,j=d,c>=0?(_=l,M=u,D=h,F=g,G=y,P=p,k=S,U=C):(_=u,M=l,D=g,F=h,G=p,P=y,k=C,U=S)):b>=w?(O=l,L=h,A=y,j=S,l>=0?(_=u,M=c,D=g,F=f,G=p,P=m,k=C,U=d):(_=c,M=u,D=f,F=g,G=m,P=p,k=d,U=C)):(O=u,L=g,A=p,j=C,u>=0?(_=c,M=l,D=f,F=h,G=m,P=y,k=d,U=S):(_=l,M=c,D=h,F=f,G=y,P=m,k=S,U=d)),O===0)return null;let W=_/O,K=M/O,ee=1/O,ye=D-W*L,Ne=F-K*L,Z=G-W*A,oe=P-K*A,te=k-W*j,Te=U-K*j,me=te*oe-Te*Z,Le=ye*Te-Ne*te,ot=Z*Ne-oe*ye;if(s){if(me<0||Le<0||ot<0)return null}else if((me<0||Le<0||ot<0)&&(me>0||Le>0||ot>0))return null;let Ae=me+Le+ot;if(Ae===0)return null;let Ve=ee*(me*L+Le*A+ot*j);return (Ae>0?Ve<0:Ve>0)?null:this.at(Ve/Ae,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},zi=class extends Un{constructor(e){super(),this.isMeshBasicMaterial=true,this.type="MeshBasicMaterial",this.color=new ne(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Jn,this.combine=Ia,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=false,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=true,this.setValues(e);}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},$l=new lt,ai=new Bi,Qs=new Tn,Kl=new B,js=new B,er=new B,tr=new B,_a=new B,nr=new B,Ql=new B,ir=new B,gt=class extends Wt{constructor(e=new ct,t=new zi){super(),this.isMesh=true,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets();}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r;}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){nr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let u=a[c],f=r[c];u!==0&&(_a.fromBufferAttribute(f,e),o?nr.addScaledVector(_a,u):nr.addScaledVector(_a.sub(t),u));}t.add(nr);}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Qs.copy(n.boundingSphere),Qs.applyMatrix4(r),ai.copy(e.ray).recast(e.near),!(Qs.containsPoint(ai.origin)===false&&(ai.intersectSphere(Qs,Kl)===null||ai.origin.distanceToSquared(Kl)>(e.far-e.near)**2))&&($l.copy(r).invert(),ai.copy(e.ray).applyMatrix4($l),!(n.boundingBox!==null&&ai.intersectsBox(n.boundingBox)===false)&&this._computeIntersections(e,t,ai)));}_computeIntersections(e,t,n){let s,r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,u=r.attributes.uv1,f=r.attributes.normal,h=r.groups,g=r.drawRange;if(a!==null)if(Array.isArray(o))for(let m=0,y=h.length;m<y;m++){let p=h[m],d=o[p.materialIndex],S=Math.max(p.start,g.start),C=Math.min(a.count,Math.min(p.start+p.count,g.start+g.count));for(let T=S,b=C;T<b;T+=3){let w=a.getX(T),_=a.getX(T+1),M=a.getX(T+2);s=sr(this,d,e,n,l,u,f,w,_,M),s&&(s.faceIndex=Math.floor(T/3),s.face.materialIndex=p.materialIndex,t.push(s));}}else {let m=Math.max(0,g.start),y=Math.min(a.count,g.start+g.count);for(let p=m,d=y;p<d;p+=3){let S=a.getX(p),C=a.getX(p+1),T=a.getX(p+2);s=sr(this,o,e,n,l,u,f,S,C,T),s&&(s.faceIndex=Math.floor(p/3),t.push(s));}}else if(c!==void 0)if(Array.isArray(o))for(let m=0,y=h.length;m<y;m++){let p=h[m],d=o[p.materialIndex],S=Math.max(p.start,g.start),C=Math.min(c.count,Math.min(p.start+p.count,g.start+g.count));for(let T=S,b=C;T<b;T+=3){let w=T,_=T+1,M=T+2;s=sr(this,d,e,n,l,u,f,w,_,M),s&&(s.faceIndex=Math.floor(T/3),s.face.materialIndex=p.materialIndex,t.push(s));}}else {let m=Math.max(0,g.start),y=Math.min(c.count,g.start+g.count);for(let p=m,d=y;p<d;p+=3){let S=p,C=p+1,T=p+2;s=sr(this,o,e,n,l,u,f,S,C,T),s&&(s.faceIndex=Math.floor(p/3),t.push(s));}}}};function Ru(i,e,t,n,s,r,o,a){let c;if(e.side===At?c=n.intersectTriangle(o,r,s,true,a):c=n.intersectTriangle(s,r,o,e.side===ei,a),c===null)return null;ir.copy(a),ir.applyMatrix4(i.matrixWorld);let l=t.ray.origin.distanceTo(ir);return l<t.near||l>t.far?null:{distance:l,point:ir.clone(),object:i}}function sr(i,e,t,n,s,r,o,a,c,l){i.getVertexPosition(a,js),i.getVertexPosition(c,er),i.getVertexPosition(l,tr);let u=Ru(i,e,t,n,js,er,tr,Ql);if(u){let f=new B;Zn.getBarycoord(Ql,js,er,tr,f),s&&(u.uv=Zn.getInterpolatedAttribute(s,a,c,l,f,new Pe)),r&&(u.uv1=Zn.getInterpolatedAttribute(r,a,c,l,f,new Pe)),o&&(u.normal=Zn.getInterpolatedAttribute(o,a,c,l,f,new B),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let h={a,b:c,c:l,normal:new B,materialIndex:0};Zn.getNormal(js,er,tr,h.normal),u.face=h,u.barycoord=f;}return u}var gs=class extends $t{constructor(e=null,t=1,n=1,s,r,o,a,c,l=Dt,u=Dt,f,h){super(null,o,a,c,l,u,s,r,f,h),this.isDataTexture=true,this.image={data:e,width:t,height:n},this.generateMipmaps=false,this.flipY=false,this.unpackAlignment=1;}};var _s=class extends vt{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=true,this.meshPerAttribute=s;}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=true,e}},Ri=new lt,jl=new lt,rr=[],ec=new En,Pu=new lt,ns=new gt,is=new Tn,vs=class extends gt{constructor(e,t,n){super(e,t),this.isInstancedMesh=true,this.instanceMatrix=new _s(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Pu);}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new En),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ri),ec.copy(e.boundingBox).applyMatrix4(Ri),this.boundingBox.union(ec);}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Tn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ri),is.copy(e.boundingSphere).applyMatrix4(Ri),this.boundingSphere.union(is);}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),this.morphTexture=e.morphTexture!==null?e.morphTexture.clone():null,this.instanceColor=e.instanceColor!==null?e.instanceColor.clone():null,this.count=e.count,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a];}raycast(e,t){let n=this.matrixWorld,s=this.count;if(ns.geometry=this.geometry,ns.material=this.material,ns.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),is.copy(this.boundingSphere),is.applyMatrix4(n),e.ray.intersectsSphere(is)!==false))for(let r=0;r<s;r++){this.getMatrixAt(r,Ri),jl.multiplyMatrices(n,Ri),ns.matrixWorld=jl,ns.raycast(e,rr);for(let o=0,a=rr.length;o<a;o++){let c=rr[o];c.instanceId=r,c.object=this,t.push(c);}rr.length=0;}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new _s(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new gs(new Float32Array(s*this.count),s,this.count,io,ln));let r=this.morphTexture.source.data.data,o=0;for(let l=0;l<n.length;l++)o+=n[l];let a=this.geometry.morphTargetsRelative?1:1-o,c=s*e;return r[c]=a,r.set(n,c+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null);}},li=new Tn,Iu=new Pe(.5,.5),or=new B,ci=class{constructor(e=new pn,t=new pn,n=new pn,s=new pn,r=new pn,o=new pn){this.planes=[e,t,n,s,r,o];}set(e,t,n,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=rn,n=false){let s=this.planes,r=e.elements,o=r[0],a=r[1],c=r[2],l=r[3],u=r[4],f=r[5],h=r[6],g=r[7],m=r[8],y=r[9],p=r[10],d=r[11],S=r[12],C=r[13],T=r[14],b=r[15];if(s[0].setComponents(l-o,g-u,d-m,b-S).normalize(),s[1].setComponents(l+o,g+u,d+m,b+S).normalize(),s[2].setComponents(l+a,g+f,d+y,b+C).normalize(),s[3].setComponents(l-a,g-f,d-y,b-C).normalize(),n)s[4].setComponents(c,h,p,T).normalize(),s[5].setComponents(l-c,g-h,d-p,b-T).normalize();else if(s[4].setComponents(l-c,g-h,d-p,b-T).normalize(),t===rn)s[5].setComponents(l+c,g+h,d+p,b+T).normalize();else if(t===cs)s[5].setComponents(c,h,p,T).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),li.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else {let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),li.copy(t.boundingSphere).applyMatrix4(e.matrixWorld);}return this.intersectsSphere(li)}intersectsSprite(e){li.center.set(0,0,0);let t=Iu.distanceTo(e.center);return li.radius=.7071067811865476+t,li.applyMatrix4(e.matrixWorld),this.intersectsSphere(li)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return  false;return  true}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(or.x=s.normal.x>0?e.max.x:e.min.x,or.y=s.normal.y>0?e.max.y:e.min.y,or.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(or)<0)return  false}return  true}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return  false;return  true}clone(){return new this.constructor().copy(this)}},tc=new lt,Pr=class i{constructor(){this.coordinateSystem=rn,this._frustums=[],this._count=0;}setFromArrayCamera(e){let t=e.cameras,n=this._frustums;for(let s=0;s<t.length;s++){let r=t[s];tc.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),n[s]===void 0&&(n[s]=new ci),n[s].setFromProjectionMatrix(tc,r.coordinateSystem,r.reversedDepth);}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsObject(e))return  true;return  false}intersectsSprite(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSprite(e))return  true;return  false}intersectsSphere(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSphere(e))return  true;return  false}intersectsBox(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsBox(e))return  true;return  false}containsPoint(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].containsPoint(e))return  true;return  false}copy(e){this.coordinateSystem=e.coordinateSystem;let t=this._frustums,n=e._frustums;for(let s=0;s<e._count;s++)t[s]===void 0&&(t[s]=new ci),t[s].copy(n[s]);return this._count=e._count,this}clone(){return new i().copy(this)}};var $n=class extends Un{constructor(e){super(),this.isLineBasicMaterial=true,this.type="LineBasicMaterial",this.color=new ne(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=true,this.setValues(e);}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Ir=new B,Lr=new B,nc=new lt,ss=new Bi,ar=new Tn,va=new B,ic=new B,Dr=class extends Wt{constructor(e=new ct,t=new $n){super(),this.isLine=true,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets();}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Ir.fromBufferAttribute(t,s-1),Lr.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Ir.distanceTo(Lr);e.setAttribute("lineDistance",new ut(n,1));}else Ie("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ar.copy(n.boundingSphere),ar.applyMatrix4(s),ar.radius+=r,e.ray.intersectsSphere(ar)===false)return;nc.copy(s).invert(),ss.copy(e.ray).applyMatrix4(nc);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,u=n.index,h=n.attributes.position;if(u!==null){let g=Math.max(0,o.start),m=Math.min(u.count,o.start+o.count);for(let y=g,p=m-1;y<p;y+=l){let d=u.getX(y),S=u.getX(y+1),C=lr(this,e,ss,c,d,S,y);C&&t.push(C);}if(this.isLineLoop){let y=u.getX(m-1),p=u.getX(g),d=lr(this,e,ss,c,y,p,m-1);d&&t.push(d);}}else {let g=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let y=g,p=m-1;y<p;y+=l){let d=lr(this,e,ss,c,y,y+1,y);d&&t.push(d);}if(this.isLineLoop){let y=lr(this,e,ss,c,m-1,g,m-1);y&&t.push(y);}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r;}}}}};function lr(i,e,t,n,s,r,o){let a=i.geometry.attributes.position;if(Ir.fromBufferAttribute(a,s),Lr.fromBufferAttribute(a,r),t.distanceSqToSegment(Ir,Lr,va,ic)>n)return;va.applyMatrix4(i.matrixWorld);let l=e.ray.origin.distanceTo(va);if(!(l<e.near||l>e.far))return {distance:l,point:ic.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}var sc=new B,rc=new B,on=class extends Dr{constructor(e,t){super(e,t),this.isLineSegments=true,this.type="LineSegments";}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)sc.fromBufferAttribute(t,s),rc.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+sc.distanceTo(rc);e.setAttribute("lineDistance",new ut(n,1));}else Ie("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var Nr=class extends Un{constructor(e){super(),this.isPointsMaterial=true,this.type="PointsMaterial",this.color=new ne(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=true,this.fog=true,this.setValues(e);}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},oc=new lt,ba=new Bi,cr=new Tn,hr=new B,mn=class extends Wt{constructor(e=new ct,t=new Nr){super(),this.isPoints=true,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets();}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),cr.copy(n.boundingSphere),cr.applyMatrix4(s),cr.radius+=r,e.ray.intersectsSphere(cr)===false)return;oc.copy(s).invert(),ba.copy(e.ray).applyMatrix4(oc);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,f=n.attributes.position;if(l!==null){let h=Math.max(0,o.start),g=Math.min(l.count,o.start+o.count);for(let m=h,y=g;m<y;m++){let p=l.getX(m);hr.fromBufferAttribute(f,p),ac(hr,p,c,s,e,t,this);}}else {let h=Math.max(0,o.start),g=Math.min(f.count,o.start+o.count);for(let m=h,y=g;m<y;m++)hr.fromBufferAttribute(f,m),ac(hr,m,c,s,e,t,this);}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r;}}}}};function ac(i,e,t,n,s,r,o){let a=ba.distanceSqToPoint(i);if(a<t){let c=new B;ba.closestPointToPoint(i,c),c.applyMatrix4(n);let l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:o});}}var xs=class extends $t{constructor(e=[],t=pi,n,s,r,o,a,c,l,u){super(e,t,n,s,r,o,a,c,l,u),this.isCubeTexture=true,this.flipY=false;}get images(){return this.image}set images(e){this.image=e;}};var On=class extends $t{constructor(e,t,n=_n,s,r,o,a=Dt,c=Dt,l,u=Fn,f=1){if(u!==Fn&&u!==zn)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:e,height:t,depth:f};super(h,s,r,o,a,c,u,n,l),this.isDepthTexture=true,this.flipY=false,this.generateMipmaps=false,this.compareFunction=null;}copy(e){return super.copy(e),this.source=new Ui(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},ys=class extends On{constructor(e,t=_n,n=pi,s,r,o=Dt,a=Dt,c,l=Fn){let u={width:e,height:e,depth:1},f=[u,u,u,u,u,u];super(e,e,t,n,s,r,o,a,c,l),this.image=f,this.isCubeDepthTexture=true,this.isCubeTexture=true;}get images(){return this.image}set images(e){this.image=e;}},Ms=class extends $t{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=true;}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},ki=class i extends ct{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let c=[],l=[],u=[],f=[],h=0,g=0;m("z","y","x",-1,-1,n,t,e,o,r,0),m("z","y","x",1,-1,n,t,-e,o,r,1),m("x","z","y",1,1,e,n,t,s,o,2),m("x","z","y",1,-1,e,n,-t,s,o,3),m("x","y","z",1,-1,e,t,n,s,r,4),m("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new ut(l,3)),this.setAttribute("normal",new ut(u,3)),this.setAttribute("uv",new ut(f,2));function m(y,p,d,S,C,T,b,w,_,M,O){let D=T/_,F=b/M,L=T/2,G=b/2,P=w/2,A=_+1,k=M+1,U=0,j=0,W=new B;for(let K=0;K<k;K++){let ee=K*F-G;for(let ye=0;ye<A;ye++){let Ne=ye*D-L;W[y]=Ne*S,W[p]=ee*C,W[d]=P,l.push(W.x,W.y,W.z),W[y]=0,W[p]=0,W[d]=w>0?1:-1,u.push(W.x,W.y,W.z),f.push(ye/_),f.push(1-K/M),U+=1;}}for(let K=0;K<M;K++)for(let ee=0;ee<_;ee++){let ye=h+ee+A*K,Ne=h+ee+A*(K+1),Z=h+(ee+1)+A*(K+1),oe=h+(ee+1)+A*K;c.push(ye,Ne,oe),c.push(Ne,Z,oe),j+=6;}a.addGroup(g,j,O),g+=j,h+=U;}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var gn=class i extends ct{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(n),c=Math.floor(s),l=a+1,u=c+1,f=e/a,h=t/c,g=[],m=[],y=[],p=[];for(let d=0;d<u;d++){let S=d*h-o;for(let C=0;C<l;C++){let T=C*f-r;m.push(T,-S,0),y.push(0,0,1),p.push(C/a),p.push(1-d/c);}}for(let d=0;d<c;d++)for(let S=0;S<a;S++){let C=S+l*d,T=S+l*(d+1),b=S+1+l*(d+1),w=S+1+l*d;g.push(C,T,w),g.push(T,b,w);}this.setIndex(g),this.setAttribute("position",new ut(m,3)),this.setAttribute("normal",new ut(y,3)),this.setAttribute("uv",new ut(p,2));}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};var hi=class i extends ct{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let c=Math.min(o+a,Math.PI),l=0,u=[],f=new B,h=new B,g=[],m=[],y=[],p=[];for(let d=0;d<=n;d++){let S=[],C=d/n,T=o+C*a,b=e*Math.cos(T),w=Math.sqrt(e*e-b*b),_=0;d===0&&o===0?_=.5/t:d===n&&c===Math.PI&&(_=-0.5/t);for(let M=0;M<=t;M++){let O=M/t,D=s+O*r;f.x=-w*Math.cos(D),f.y=b,f.z=w*Math.sin(D),m.push(f.x,f.y,f.z),h.copy(f).normalize(),y.push(h.x,h.y,h.z),p.push(O+_,1-C),S.push(l++);}u.push(S);}for(let d=0;d<n;d++)for(let S=0;S<t;S++){let C=u[d][S+1],T=u[d][S],b=u[d+1][S],w=u[d+1][S+1];(d!==0||o>0)&&g.push(C,T,w),(d!==n-1||c<Math.PI)&&g.push(T,b,w);}this.setIndex(g),this.setAttribute("position",new ut(m,3)),this.setAttribute("normal",new ut(y,3)),this.setAttribute("uv",new ut(p,2));}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var Ss=class i extends ct{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2,o=0,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r,thetaStart:o,thetaLength:a},n=Math.floor(n),s=Math.floor(s);let c=[],l=[],u=[],f=[],h=new B,g=new B,m=new B;for(let y=0;y<=n;y++){let p=o+y/n*a;for(let d=0;d<=s;d++){let S=d/s*r;g.x=(e+t*Math.cos(p))*Math.cos(S),g.y=(e+t*Math.cos(p))*Math.sin(S),g.z=t*Math.sin(p),l.push(g.x,g.y,g.z),h.x=e*Math.cos(S),h.y=e*Math.sin(S),m.subVectors(g,h).normalize(),u.push(m.x,m.y,m.z),f.push(d/s),f.push(y/n);}}for(let y=1;y<=n;y++)for(let p=1;p<=s;p++){let d=(s+1)*y+p-1,S=(s+1)*(y-1)+p-1,C=(s+1)*(y-1)+p,T=(s+1)*y+p;c.push(d,S,T),c.push(S,C,T);}this.setIndex(c),this.setAttribute("position",new ut(l,3)),this.setAttribute("normal",new ut(u,3)),this.setAttribute("uv",new ut(f,2));}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}};function gi(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];if(lc(s))s.isRenderTargetTexture?(Ie("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(lc(s[0])){let r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();e[t][n]=r;}else e[t][n]=s.slice();else e[t][n]=s;}}return e}function Xt(i){let e={};for(let t=0;t<i.length;t++){let n=gi(i[t]);for(let s in n)e[s]=n[s];}return e}function lc(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function Lu(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function ja(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===true?e.texture.colorSpace:Ye.workingColorSpace}var Qc={clone:gi,merge:Xt},Du=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Nu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,rt=class extends Un{constructor(e){super(),this.isShaderMaterial=true,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Du,this.fragmentShader=Nu,this.linewidth=1,this.wireframe=false,this.wireframeLinewidth=1,this.fog=false,this.lights=false,this.clipping=false,this.forceSinglePass=true,this.extensions={clipCullDistance:false,multiDraw:false},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=false,this.glslVersion=null,e!==void 0&&this.setValues(e);}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=gi(e.uniforms),this.uniformsGroups=Lu(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o};}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===true&&(n[s]=true);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case "t":this.uniforms[n].value=t[s.value]||null;break;case "c":this.uniforms[n].value=new ne().setHex(s.value);break;case "v2":this.uniforms[n].value=new Pe().fromArray(s.value);break;case "v3":this.uniforms[n].value=new B().fromArray(s.value);break;case "v4":this.uniforms[n].value=new xt().fromArray(s.value);break;case "m3":this.uniforms[n].value=new Ue().fromArray(s.value);break;case "m4":this.uniforms[n].value=new lt().fromArray(s.value);break;default:this.uniforms[n].value=s.value;}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Fr=class extends rt{constructor(e){super(e),this.isRawShaderMaterial=true,this.type="RawShaderMaterial";}};var Ur=class extends Un{constructor(e){super(),this.isMeshDepthMaterial=true,this.type="MeshDepthMaterial",this.depthPacking=Oc,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=false,this.wireframeLinewidth=1,this.setValues(e);}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Or=class extends Un{constructor(e){super(),this.isMeshDistanceMaterial=true,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e);}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};var dr=new B,fr=new bn,yn=new B,ui=class extends Wt{constructor(){super(),this.isCamera=true,this.type="Camera",this.matrixWorldInverse=new lt,this.projectionMatrix=new lt,this.projectionMatrixInverse=new lt,this.coordinateSystem=rn,this._reversedDepth=false;}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(dr,fr,yn),yn.x===1&&yn.y===1&&yn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(dr,fr,yn.set(1,1,1)).invert();}updateWorldMatrix(e,t,n=false){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(dr,fr,yn),yn.x===1&&yn.y===1&&yn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(dr,fr,yn.set(1,1,1)).invert();}clone(){return new this.constructor().copy(this)}},Yn=new B,uc=new Pe,dc=new Pe,it=class extends ui{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=true,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix();}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=wr*2*Math.atan(t),this.updateProjectionMatrix();}getFocalLength(){let e=Math.tan(Ko*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return wr*2*Math.atan(Math.tan(Ko*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Yn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Yn.x,Yn.y).multiplyScalar(-e/Yn.z),Yn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Yn.x,Yn.y).multiplyScalar(-e/Yn.z);}getViewSize(e,t){return this.getViewBounds(e,uc,dc),t.subVectors(dc,uc)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:true,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=true,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix();}clearViewOffset(){this.view!==null&&(this.view.enabled=false),this.updateProjectionMatrix();}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Ko*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-0.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,t-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l;}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert();}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}};var Zr=class extends ui{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=true,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix();}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:true,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=true,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix();}clearViewOffset(){this.view!==null&&(this.view.enabled=false),this.updateProjectionMatrix();}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,o=n+e,a=s+t,c=s-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=u*this.view.offsetY,c=a-u*this.view.height;}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert();}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}};var Ii=-90,Li=1,Hi=class extends Wt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new it(Ii,Li,e,t);s.layers=this.layers,this.add(s);let r=new it(Ii,Li,e,t);r.layers=this.layers,this.add(r);let o=new it(Ii,Li,e,t);o.layers=this.layers,this.add(o);let a=new it(Ii,Li,e,t);a.layers=this.layers,this.add(a);let c=new it(Ii,Li,e,t);c.layers=this.layers,this.add(c);let l=new it(Ii,Li,e,t);l.layers=this.layers,this.add(l);}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,c]=t;for(let l of t)this.remove(l);if(e===rn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===cs)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let l of t)this.add(l),l.updateMatrixWorld();}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,c,l,u]=this.children,f=e.getRenderTarget(),h=e.getActiveCubeFace(),g=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=false;let y=n.texture.mipmapsAutoUpdate;n.texture.mipmapsAutoUpdate=false;let p=false;e.isWebGLRenderer===true?p=e.state.buffers.depth.getReversed():p=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),p&&e.autoClear===false&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),p&&e.autoClear===false&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,2,s),p&&e.autoClear===false&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,3,s),p&&e.autoClear===false&&e.clearDepth(),e.render(t,c),e.setRenderTarget(n,4,s),p&&e.autoClear===false&&e.clearDepth(),e.render(t,l),n.texture.mipmapsAutoUpdate=y,e.setRenderTarget(n,5,s),p&&e.autoClear===false&&e.clearDepth(),e.render(t,u),e.setRenderTarget(f,h,g),e.xr.enabled=m,n.texture.needsPMREMUpdate=true;}},Jr=class extends it{constructor(e=[]){super(),this.isArrayCamera=true,this.isMultiViewCamera=false,this.cameras=e,this.perCameraFrustumCulled=false;}};var el="\\[\\]\\.:\\/",tl="[^"+el+"]",Bu="[^"+el.replace("\\.","")+"]";/((?:WC+[\/:])*)/.source.replace("WC",tl);/(WCOD+)?/.source.replace("WCOD",Bu);/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",tl);/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",tl);function nl(i,e,t,n){let s=Xu(n);switch(t){case Wa:return i*e;case io:return i*e/s.components*s.byteLength;case so:return i*e/s.components*s.byteLength;case ti:return i*e*2/s.components*s.byteLength;case ro:return i*e*2/s.components*s.byteLength;case Xa:return i*e*3/s.components*s.byteLength;case xn:return i*e*4/s.components*s.byteLength;case oo:return i*e*4/s.components*s.byteLength;case ws:case As:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Cs:case Rs:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case lo:case ho:return Math.max(i,16)*Math.max(e,8)/4;case ao:case co:return Math.max(i,8)*Math.max(e,8)/2;case uo:case fo:case mo:case go:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case po:case Ps:case _o:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case vo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case xo:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case yo:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Mo:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case So:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case bo:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Eo:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case To:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case wo:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Ao:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Co:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Ro:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Po:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Io:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Lo:case Do:case No:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Fo:case Uo:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Is:case Oo:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Xu(i){switch(i){case nn:case ka:return {byteLength:1,components:1};case Xi:case Ha:case vn:return {byteLength:2,components:1};case to:case no:return {byteLength:2,components:4};case _n:case eo:case ln:return {byteLength:4,components:1};case Ga:case Va:return {byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"187"}}));typeof window<"u"&&(window.__THREE__?Ie("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="187");function Sh(){let i=null,e=false,t=null,n=null;function s(r,o){n=i.requestAnimationFrame(s),t(r,o);}return {start:function(){e!==true&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=true);},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=false;},setAnimationLoop:function(r){t=r;},setContext:function(r){i=r;}}}function Yu(i){let e=new WeakMap;function t(a,c){let l=a.array,u=a.usage,f=l.byteLength,h=i.createBuffer();i.bindBuffer(c,h),i.bufferData(c,l,u),a.onUploadCallback();let g;if(l instanceof Float32Array)g=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)g=i.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?g=i.HALF_FLOAT:g=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)g=i.SHORT;else if(l instanceof Uint32Array)g=i.UNSIGNED_INT;else if(l instanceof Int32Array)g=i.INT;else if(l instanceof Int8Array)g=i.BYTE;else if(l instanceof Uint8Array)g=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)g=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return {buffer:h,type:g,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:f}}function n(a,c,l){let u=c.array,f=c.updateRanges;if(i.bindBuffer(l,a),f.length===0)i.bufferSubData(l,0,u);else {f.sort((g,m)=>g.start-m.start);let h=0;for(let g=1;g<f.length;g++){let m=f[h],y=f[g];y.start<=m.start+m.count+1?m.count=Math.max(m.count,y.start+y.count-m.start):(++h,f[h]=y);}f.length=h+1;for(let g=0,m=f.length;g<m;g++){let y=f[g];i.bufferSubData(l,y.start*u.BYTES_PER_ELEMENT,u,y.start,y.count);}c.clearUpdateRanges();}c.onUploadCallback();}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let c=e.get(a);c&&(i.deleteBuffer(c.buffer),e.delete(a));}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let l=e.get(a);if(l===void 0)e.set(a,t(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version;}}return {get:s,remove:r,update:o}}var Zu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Ju=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,$u=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ku=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Qu=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ju=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,ed=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,td=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,nd=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,id=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,sd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,rd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,od=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,ad=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,ld=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,cd=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,hd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,ud=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,dd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,fd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,pd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,md=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,gd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,_d=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,vd=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,xd=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,yd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Md=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Sd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,bd="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ed=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Td=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,wd=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,Ad=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Cd=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Rd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Pd=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Id=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Ld=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Dd=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Nd=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Fd=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ud=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Od=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Bd=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,zd=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,kd=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Hd=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Gd=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Vd=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Wd=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Xd=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,qd=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Yd=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Zd=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Jd=`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,$d=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Kd=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Qd=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,jd=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,ef=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,tf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,nf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,sf=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,rf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,of=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,af=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,lf=`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,cf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,hf=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,uf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,df=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,ff=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,pf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,mf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,gf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,_f=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,vf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,xf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,yf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Mf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Sf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,bf=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Ef=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Tf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,wf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Af=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Cf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Rf=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Pf=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,If=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Lf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Df=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Nf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Ff=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Uf=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Of=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Bf=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,zf=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,kf=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Hf=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Gf=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Vf=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Wf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Xf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,qf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Yf=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Zf=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Jf=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$f=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Kf=`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Qf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,jf=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ep=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,tp=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,np=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,ip=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,sp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,rp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,op=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,ap=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,lp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,cp=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hp=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,up=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,dp=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,fp=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,pp=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,mp=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,gp=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_p=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vp=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,xp=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,yp=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Mp=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Sp=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,bp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Ep=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Tp=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,wp=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Ap=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,He={alphahash_fragment:Zu,alphahash_pars_fragment:Ju,alphamap_fragment:$u,alphamap_pars_fragment:Ku,alphatest_fragment:Qu,alphatest_pars_fragment:ju,aomap_fragment:ed,aomap_pars_fragment:td,batching_pars_vertex:nd,batching_vertex:id,begin_vertex:sd,beginnormal_vertex:rd,bsdfs:od,iridescence_fragment:ad,bumpmap_pars_fragment:ld,clipping_planes_fragment:cd,clipping_planes_pars_fragment:hd,clipping_planes_pars_vertex:ud,clipping_planes_vertex:dd,color_fragment:fd,color_pars_fragment:pd,color_pars_vertex:md,color_vertex:gd,common:_d,defaultnormal_vertex:vd,displacementmap_pars_vertex:xd,displacementmap_vertex:yd,emissivemap_fragment:Md,emissivemap_pars_fragment:Sd,colorspace_fragment:bd,colorspace_pars_fragment:Ed,envmap_fragment:Td,envmap_common_pars_fragment:wd,envmap_pars_fragment:Ad,envmap_pars_vertex:Cd,envmap_physical_pars_fragment:zd,envmap_vertex:Rd,fog_vertex:Pd,fog_pars_vertex:Id,fog_fragment:Ld,fog_pars_fragment:Dd,gradientmap_pars_fragment:Nd,lightmap_pars_fragment:Fd,lights_lambert_fragment:Ud,lights_lambert_pars_fragment:Od,lights_pars_begin:Bd,lights_toon_fragment:kd,lights_toon_pars_fragment:Hd,lights_phong_fragment:Gd,lights_phong_pars_fragment:Vd,lights_physical_fragment:Wd,lights_physical_pars_fragment:Xd,lights_fragment_begin:qd,lights_fragment_maps:Yd,lights_fragment_end:Zd,lightprobes_pars_fragment:Jd,logdepthbuf_fragment:$d,logdepthbuf_pars_fragment:Kd,logdepthbuf_pars_vertex:Qd,logdepthbuf_vertex:jd,map_fragment:ef,map_pars_fragment:tf,map_particle_fragment:nf,map_particle_pars_fragment:sf,metalnessmap_fragment:rf,metalnessmap_pars_fragment:of,morphinstance_vertex:af,morphcolor_vertex:lf,morphnormal_vertex:cf,morphtarget_pars_vertex:hf,morphtarget_vertex:uf,normal_fragment_begin:df,normal_fragment_maps:ff,normal_pars_fragment:pf,normal_pars_vertex:mf,normal_vertex:gf,normalmap_pars_fragment:_f,clearcoat_normal_fragment_begin:vf,clearcoat_normal_fragment_maps:xf,clearcoat_pars_fragment:yf,iridescence_pars_fragment:Mf,opaque_fragment:Sf,packing:bf,premultiplied_alpha_fragment:Ef,project_vertex:Tf,dithering_fragment:wf,dithering_pars_fragment:Af,roughnessmap_fragment:Cf,roughnessmap_pars_fragment:Rf,shadowmap_pars_fragment:Pf,shadowmap_pars_vertex:If,shadowmap_vertex:Lf,shadowmask_pars_fragment:Df,skinbase_vertex:Nf,skinning_pars_vertex:Ff,skinning_vertex:Uf,skinnormal_vertex:Of,specularmap_fragment:Bf,specularmap_pars_fragment:zf,tonemapping_fragment:kf,tonemapping_pars_fragment:Hf,transmission_fragment:Gf,transmission_pars_fragment:Vf,uv_pars_fragment:Wf,uv_pars_vertex:Xf,uv_vertex:qf,worldpos_vertex:Yf,background_vert:Zf,background_frag:Jf,backgroundCube_vert:$f,backgroundCube_frag:Kf,cube_vert:Qf,cube_frag:jf,depth_vert:ep,depth_frag:tp,distance_vert:np,distance_frag:ip,equirect_vert:sp,equirect_frag:rp,linedashed_vert:op,linedashed_frag:ap,meshbasic_vert:lp,meshbasic_frag:cp,meshlambert_vert:hp,meshlambert_frag:up,meshmatcap_vert:dp,meshmatcap_frag:fp,meshnormal_vert:pp,meshnormal_frag:mp,meshphong_vert:gp,meshphong_frag:_p,meshphysical_vert:vp,meshphysical_frag:xp,meshtoon_vert:yp,meshtoon_frag:Mp,points_vert:Sp,points_frag:bp,shadow_vert:Ep,shadow_frag:Tp,sprite_vert:wp,sprite_frag:Ap},_e={common:{diffuse:{value:new ne(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ue},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ue}},envmap:{envMap:{value:null},envMapRotation:{value:new Ue},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ue}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ue}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ue},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ue},normalScale:{value:new Pe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ue},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ue}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ue}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ue}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ne(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new ne(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0},uvTransform:{value:new Ue}},sprite:{diffuse:{value:new ne(16777215)},opacity:{value:1},center:{value:new Pe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ue},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0}}},An={basic:{uniforms:Xt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.fog]),vertexShader:He.meshbasic_vert,fragmentShader:He.meshbasic_frag},lambert:{uniforms:Xt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new ne(0)},envMapIntensity:{value:1}}]),vertexShader:He.meshlambert_vert,fragmentShader:He.meshlambert_frag},phong:{uniforms:Xt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new ne(0)},specular:{value:new ne(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:He.meshphong_vert,fragmentShader:He.meshphong_frag},standard:{uniforms:Xt([_e.common,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.roughnessmap,_e.metalnessmap,_e.fog,_e.lights,{emissive:{value:new ne(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:He.meshphysical_vert,fragmentShader:He.meshphysical_frag},toon:{uniforms:Xt([_e.common,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.gradientmap,_e.fog,_e.lights,{emissive:{value:new ne(0)}}]),vertexShader:He.meshtoon_vert,fragmentShader:He.meshtoon_frag},matcap:{uniforms:Xt([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,{matcap:{value:null}}]),vertexShader:He.meshmatcap_vert,fragmentShader:He.meshmatcap_frag},points:{uniforms:Xt([_e.points,_e.fog]),vertexShader:He.points_vert,fragmentShader:He.points_frag},dashed:{uniforms:Xt([_e.common,_e.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:He.linedashed_vert,fragmentShader:He.linedashed_frag},depth:{uniforms:Xt([_e.common,_e.displacementmap]),vertexShader:He.depth_vert,fragmentShader:He.depth_frag},normal:{uniforms:Xt([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,{opacity:{value:1}}]),vertexShader:He.meshnormal_vert,fragmentShader:He.meshnormal_frag},sprite:{uniforms:Xt([_e.sprite,_e.fog]),vertexShader:He.sprite_vert,fragmentShader:He.sprite_frag},background:{uniforms:{uvTransform:{value:new Ue},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:He.background_vert,fragmentShader:He.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ue}},vertexShader:He.backgroundCube_vert,fragmentShader:He.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:He.cube_vert,fragmentShader:He.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:He.equirect_vert,fragmentShader:He.equirect_frag},distance:{uniforms:Xt([_e.common,_e.displacementmap,{referencePosition:{value:new B},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:He.distance_vert,fragmentShader:He.distance_frag},shadow:{uniforms:Xt([_e.lights,_e.fog,{color:{value:new ne(0)},opacity:{value:1}}]),vertexShader:He.shadow_vert,fragmentShader:He.shadow_frag}};An.physical={uniforms:Xt([An.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ue},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ue},clearcoatNormalScale:{value:new Pe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ue},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new Ue},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ue},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ue},sheen:{value:0},sheenColor:{value:new ne(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ue},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ue},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ue},transmissionSamplerSize:{value:new Pe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ue},attenuationDistance:{value:0},attenuationColor:{value:new ne(0)},specularColor:{value:new ne(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ue},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ue},anisotropyVector:{value:new Pe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ue}}]),vertexShader:He.meshphysical_vert,fragmentShader:He.meshphysical_frag};var Bo={r:0,b:0,g:0},Cp=new lt,bh=new Ue;bh.set(-1,0,0,0,1,0,0,0,1);function Rp(i,e,t,n,s,r){let o=new ne(0),a=s===true?0:1,c,l,u=null,f=0,h=null;function g(S){let C=S.isScene===true?S.background:null;if(C&&C.isTexture){let T=S.backgroundBlurriness>0;C=e.get(C,T);}return C}function m(S){let C=false,T=g(S);T===null?p(o,a):T&&T.isColor&&(p(T,1),C=true);let b=i.xr.getEnvironmentBlendMode();b==="additive"?t.buffers.color.setClear(0,0,0,1,r):b==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||C)&&(t.buffers.depth.setTest(true),t.buffers.depth.setMask(true),t.buffers.color.setMask(true),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil));}function y(S,C){let T=g(C);T&&T.isCubeTexture?(l===void 0&&(l=new gt(new ki(1,1,1),new rt({name:"BackgroundCubeMaterial",uniforms:gi(An.backgroundCube.uniforms),vertexShader:An.backgroundCube.vertexShader,fragmentShader:An.backgroundCube.fragmentShader,side:At,depthTest:false,depthWrite:false,fog:false,allowOverride:false})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(b,w,_){this.matrixWorld.copyPosition(_.matrixWorld);},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(l)),l.material.uniforms.envMap.value=T,l.material.uniforms.backgroundBlurriness.value=C.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=C.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Cp.makeRotationFromEuler(C.backgroundRotation)).transpose(),T.isRenderTargetTexture===false&&l.material.uniforms.backgroundRotation.value.premultiply(bh),l.material.toneMapped=Ye.getTransfer(T.colorSpace)!==et,(u!==T||f!==T.version||h!==i.toneMapping)&&(l.material.needsUpdate=true,u=T,f=T.version,h=i.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null)):T&&T.isTexture&&(c===void 0&&(c=new gt(new gn(2,2),new rt({name:"BackgroundMaterial",uniforms:gi(An.background.uniforms),vertexShader:An.background.vertexShader,fragmentShader:An.background.fragmentShader,side:ei,depthTest:false,depthWrite:false,fog:false,allowOverride:false})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(c)),c.material.uniforms.t2D.value=T,c.material.uniforms.backgroundIntensity.value=C.backgroundIntensity,c.material.toneMapped=Ye.getTransfer(T.colorSpace)!==et,T.matrixAutoUpdate===true&&T.updateMatrix(),c.material.uniforms.uvTransform.value.copy(T.matrix),(u!==T||f!==T.version||h!==i.toneMapping)&&(c.material.needsUpdate=true,u=T,f=T.version,h=i.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null));}function p(S,C){S.getRGB(Bo,ja(i)),t.buffers.color.setClear(Bo.r,Bo.g,Bo.b,C,r);}function d(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0);}return {getClearColor:function(){return o},setClearColor:function(S,C=1){o.set(S),a=C,p(o,a);},getClearAlpha:function(){return a},setClearAlpha:function(S){a=S,p(o,a);},render:m,addToRenderList:y,dispose:d}}function Pp(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=h(null),r=s,o=false;function a(F,L,G,P,A){let k=false,U=f(F,P,G,L);r!==U&&(r=U,l(r.object)),k=g(F,P,G,A),k&&m(F,P,G,A),A!==null&&e.update(A,i.ELEMENT_ARRAY_BUFFER),(k||o)&&(o=false,T(F,L,G,P),A!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(A).buffer));}function c(){return i.createVertexArray()}function l(F){return i.bindVertexArray(F)}function u(F){return i.deleteVertexArray(F)}function f(F,L,G,P){let A=P.wireframe===true,k=n[L.id];k===void 0&&(k={},n[L.id]=k);let U=F.isInstancedMesh===true?F.id:0,j=k[U];j===void 0&&(j={},k[U]=j);let W=j[G.id];W===void 0&&(W={},j[G.id]=W);let K=W[A];return K===void 0&&(K=h(c()),W[A]=K),K}function h(F){let L=[],G=[],P=[];for(let A=0;A<t;A++)L[A]=0,G[A]=0,P[A]=0;return {geometry:null,program:null,wireframe:false,newAttributes:L,enabledAttributes:G,attributeDivisors:P,object:F,attributes:{},index:null}}function g(F,L,G,P){let A=r.attributes,k=L.attributes,U=0,j=G.getAttributes();for(let W in j)if(j[W].location>=0){let ee=A[W],ye=k[W];if(ye===void 0&&(W==="instanceMatrix"&&F.instanceMatrix&&(ye=F.instanceMatrix),W==="instanceColor"&&F.instanceColor&&(ye=F.instanceColor)),ee===void 0||ee.attribute!==ye||ye&&ee.data!==ye.data)return  true;U++;}return r.attributesNum!==U||r.index!==P}function m(F,L,G,P){let A={},k=L.attributes,U=0,j=G.getAttributes();for(let W in j)if(j[W].location>=0){let ee=k[W];ee===void 0&&(W==="instanceMatrix"&&F.instanceMatrix&&(ee=F.instanceMatrix),W==="instanceColor"&&F.instanceColor&&(ee=F.instanceColor));let ye={};ye.attribute=ee,ee&&ee.data&&(ye.data=ee.data),A[W]=ye,U++;}r.attributes=A,r.attributesNum=U,r.index=P;}function y(){let F=r.newAttributes;for(let L=0,G=F.length;L<G;L++)F[L]=0;}function p(F){d(F,0);}function d(F,L){let G=r.newAttributes,P=r.enabledAttributes,A=r.attributeDivisors;G[F]=1,P[F]===0&&(i.enableVertexAttribArray(F),P[F]=1),A[F]!==L&&(i.vertexAttribDivisor(F,L),A[F]=L);}function S(){let F=r.newAttributes,L=r.enabledAttributes;for(let G=0,P=L.length;G<P;G++)L[G]!==F[G]&&(i.disableVertexAttribArray(G),L[G]=0);}function C(F,L,G,P,A,k,U){U===true?i.vertexAttribIPointer(F,L,G,A,k):i.vertexAttribPointer(F,L,G,P,A,k);}function T(F,L,G,P){y();let A=P.attributes,k=G.getAttributes(),U=L.defaultAttributeValues;for(let j in k){let W=k[j];if(W.location>=0){let K=A[j];if(K===void 0&&(j==="instanceMatrix"&&F.instanceMatrix&&(K=F.instanceMatrix),j==="instanceColor"&&F.instanceColor&&(K=F.instanceColor)),K!==void 0){let ee=K.normalized,ye=K.itemSize,Ne=e.get(K);if(Ne===void 0)continue;let Z=Ne.buffer,oe=Ne.type,te=Ne.bytesPerElement,Te=oe===i.INT||oe===i.UNSIGNED_INT||K.gpuType===eo;if(K.isInterleavedBufferAttribute){let me=K.data,Le=me.isInterleavedBuffer===true?me.stride:me.itemSize,ot=K.offset;if(me.isInstancedInterleavedBuffer||me.isInstancedBufferAttribute){for(let Ae=0;Ae<W.locationSize;Ae++)d(W.location+Ae,me.meshPerAttribute);F.isInstancedMesh!==true&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=me.meshPerAttribute*me.count);}else for(let Ae=0;Ae<W.locationSize;Ae++)p(W.location+Ae);i.bindBuffer(i.ARRAY_BUFFER,Z);for(let Ae=0;Ae<W.locationSize;Ae++)C(W.location+Ae,ye/W.locationSize,oe,ee,Le*te,(ot+ye/W.locationSize*Ae)*te,Te);}else {if(K.isInstancedBufferAttribute){for(let me=0;me<W.locationSize;me++)d(W.location+me,K.meshPerAttribute);F.isInstancedMesh!==true&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=K.meshPerAttribute*K.count);}else for(let me=0;me<W.locationSize;me++)p(W.location+me);i.bindBuffer(i.ARRAY_BUFFER,Z);for(let me=0;me<W.locationSize;me++)C(W.location+me,ye/W.locationSize,oe,ee,ye*te,ye/W.locationSize*me*te,Te);}}else if(U!==void 0){let ee=U[j];if(ee!==void 0)switch(ee.length){case 2:i.vertexAttrib2fv(W.location,ee);break;case 3:i.vertexAttrib3fv(W.location,ee);break;case 4:i.vertexAttrib4fv(W.location,ee);break;default:i.vertexAttrib1fv(W.location,ee);}}}}S();}function b(){O();for(let F in n){let L=n[F];for(let G in L){let P=L[G];for(let A in P){let k=P[A];for(let U in k)u(k[U].object),delete k[U];delete P[A];}}delete n[F];}}function w(F){if(n[F.id]===void 0)return;let L=n[F.id];for(let G in L){let P=L[G];for(let A in P){let k=P[A];for(let U in k)u(k[U].object),delete k[U];delete P[A];}}delete n[F.id];}function _(F){for(let L in n){let G=n[L];for(let P in G){let A=G[P];if(A[F.id]===void 0)continue;let k=A[F.id];for(let U in k)u(k[U].object),delete k[U];delete A[F.id];}}}function M(F){for(let L in n){let G=n[L],P=F.isInstancedMesh===true?F.id:0,A=G[P];if(A!==void 0){for(let k in A){let U=A[k];for(let j in U)u(U[j].object),delete U[j];delete A[k];}delete G[P],Object.keys(G).length===0&&delete n[L];}}}function O(){D(),o=true,r!==s&&(r=s,l(r.object));}function D(){s.geometry=null,s.program=null,s.wireframe=false;}return {setup:a,reset:O,resetDefaultState:D,dispose:b,releaseStatesOfGeometry:w,releaseStatesOfObject:M,releaseStatesOfProgram:_,initAttributes:y,enableAttribute:p,disableUnusedAttributes:S}}function Ip(i,e,t){let n;function s(c){n=c;}function r(c,l){i.drawArrays(n,c,l),t.update(l,n,1);}function o(c,l,u){u!==0&&(i.drawArraysInstanced(n,c,l,u),t.update(l,n,u));}function a(c,l,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,l,0,u);let h=0;for(let g=0;g<u;g++)h+=l[g];t.update(h,n,1);}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a;}function Lp(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===true){let _=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(_.MAX_TEXTURE_MAX_ANISOTROPY_EXT);}else s=0;return s}function o(_){return !(_!==xn&&n.convert(_)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(_){let M=_===vn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return !(_!==nn&&_!==ln&&!M&&n.convert(_)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function c(_){if(_==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return "highp";_="mediump";}return _==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp",u=c(l);u!==l&&(Ie("WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);let f=t.reversedDepthBuffer===true&&e.has("EXT_clip_control"),h=t.logarithmicDepthBuffer===true&&f===false;t.reversedDepthBuffer===true&&f===false&&Ie("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),t.logarithmicDepthBuffer===true&&f===true&&Ie("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");let g=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=i.getParameter(i.MAX_TEXTURE_SIZE),p=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),d=i.getParameter(i.MAX_VERTEX_ATTRIBS),S=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),C=i.getParameter(i.MAX_VARYING_VECTORS),T=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),b=i.getParameter(i.MAX_SAMPLES),w=i.getParameter(i.SAMPLES);return {isWebGL2:true,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:h,reversedDepthBuffer:f,maxTextures:g,maxVertexTextures:m,maxTextureSize:y,maxCubemapSize:p,maxAttributes:d,maxVertexUniforms:S,maxVaryings:C,maxFragmentUniforms:T,maxSamples:b,samples:w}}function Dp(i){let e=this,t=null,n=0,s=false,r=false,o=new pn,a=new Ue,c={value:null,needsUpdate:false};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,h){let g=f.length!==0||h||n!==0||s;return s=h,n=f.length,g},this.beginShadows=function(){r=true,u(null);},this.endShadows=function(){r=false;},this.setGlobalState=function(f,h){t=u(f,h,0);},this.setState=function(f,h,g){let m=f.clippingPlanes,y=f.clipIntersection,p=f.clipShadows,d=i.get(f);if(!s||m===null||m.length===0||r&&!p)r?u(null):l();else {let S=r?0:n,C=S*4,T=d.clippingState||null;c.value=T,T=u(m,h,C,g);for(let b=0;b!==C;++b)T[b]=t[b];d.clippingState=T,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=S;}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0;}function u(f,h,g,m){let y=f!==null?f.length:0,p=null;if(y!==0){if(p=c.value,m!==true||p===null){let d=g+y*4,S=h.matrixWorldInverse;a.getNormalMatrix(S),(p===null||p.length<d)&&(p=new Float32Array(d));for(let C=0,T=g;C!==y;++C,T+=4)o.copy(f[C]).applyMatrix4(S,a),o.normal.toArray(p,T),p[T+3]=o.constant;}c.value=p,c.needsUpdate=true;}return e.numPlanes=y,e.numIntersection=0,p}}var Fs=class extends en{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=true;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new xs(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=true;}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new ki(5,5,5),r=new rt({name:"CubemapFromEquirect",uniforms:gi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:At,blending:di});r.uniforms.tEquirect.value=t;let o=new gt(s,r),a=t.minFilter;return t.minFilter===Bn&&(t.minFilter=Zt),new Hi(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=true,n=true,s=true){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r);}},th=256,Np=3,Fp=20,Eh=256,Th=16,Up=3,Op=new B,Bp=new ne,ko=class i{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new Hi(1,10,null),this._boxMesh=new gt(new ki(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null;}fromScene(e,t=0,n=.1,s=100,r={}){let{size:o=256,position:a=Op}=r,c=this._renderer;this._setSize(o);let l=this._allocateTarget(),u=this._getSourceTarget(true);t>0&&(u.texture.mipmapsAutoUpdate=false);let f=c.autoClear,h=c.autoClearColor,g=c.autoClearDepth,m=c.autoClearStencil,y=e.background;c.autoClear=true,c.autoClearColor=true,c.autoClearDepth=true,c.autoClearStencil=true,y===null&&(e.background=c.getClearColor(Bp));let p=new Hi(n,s,u);return p.position.copy(a),p.update(c,e),c.autoClear=f,c.autoClearColor=h,c.autoClearDepth=g,c.autoClearStencil=m,e.background=y,t>0&&(u.texture.mipmapsAutoUpdate=true,this._blur(l,t)),this._applyPMREM(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=sh(),this._compileMaterial(this._cubemapMaterial));}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ih(),this._compileMaterial(this._equirectMaterial));}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose();}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(th,$c(e));}_fromTexture(e,t){e.mapping===pi||e.mapping===Wi?this._setSize(e.image.length===0?th:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);let n=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(n),n}_allocateTarget(){let e=this._cubeSize,t=nh(e,false,false),n=Math.log2(e)-Np;for(let s=0;s<=n;s++)t.texture.mipmaps.push({width:e>>s,height:e>>s});return t.texture.name="PMREM",t.texture.isPMREMTexture=true,t}_getSourceTarget(e=false){let t=this._cubeSize,n=this._sourceTarget;return (n===null||n.width!==t||e&&n.depthBuffer===false)&&(n!==null&&n.dispose(),this._sourceTarget=nh(t,true,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0]);}_renderCube(e,t,n){let s=this._boxMesh,r=this._cubeCamera;s.material=n,r.renderTarget=e,r.activeMipmapLevel=t;let o=e.width>>t;e.viewport.set(0,0,o,o),r.update(this._renderer,s),e.viewport.set(0,0,e.width,e.height);}_textureToCubemap(e){let t;e.mapping===pi||e.mapping===Wi?(this._cubemapMaterial===null&&(this._cubemapMaterial=sh()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===false?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=ih()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t);}_applyPMREM(e){this._ggxMaterial===null&&(this._ggxMaterial=zp(),this._integrationMaterial=kp());let t=this._cubeSize,n=e.texture.mipmaps.length-1,s=this._ggxMaterial.uniforms;s.envMap.value=this._sourceTarget.texture;let r=this._integrationMaterial.uniforms;r.envMap.value=this._sourceTarget.texture,r.sourceLod.value=Math.log2(t/Th);for(let o=0;o<=n;o++){let a=i.lodToRoughness(o,n);if(o>n-Up)r.roughness.value=a,this._renderCube(e,o,this._integrationMaterial);else {let c=a>0?Math.log2(t)+.5*Math.log2(6/(Eh*Math.pow(a,4)))+.5:0;s.roughness.value=a,s.lodBias.value=c,this._renderCube(e,o,this._ggxMaterial);}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=Hp());let n=this._blurMaterial,s=n.uniforms,r=this._sourceTarget;s.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,s.envMap.value=r.texture,this._renderCube(e,0,n),s.envMap.value=e.texture,this._renderCube(r,0,n);}};function nh(i,e,t){return new Fs(i,{minFilter:Bn,generateMipmaps:e,type:vn,colorSpace:as,depthBuffer:t})}function Us(i,e,t){return new rt({name:i,uniforms:e,vertexShader:He.cube_vert,fragmentShader:t,side:At,blending:di,depthTest:false,depthWrite:false})}function zp(){return Us("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${Eh}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function kp(){return Us("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:Th}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function Hp(){return Us("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${Fp}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function ih(){return Us("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function sh(){return Us("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function Gp(i){let e=new WeakMap,t=new WeakMap,n=null;function s(h,g=false){return h==null?null:g?o(h):r(h)}function r(h){if(h&&h.isTexture){let g=h.mapping;if(g===Kr||g===Qr)if(e.has(h)){let m=e.get(h).texture;return a(m,h.mapping)}else {let m=h.image;if(m&&m.height>0){let y=new Fs(m.height);return y.fromEquirectangularTexture(i,h),e.set(h,y),h.addEventListener("dispose",l),a(y.texture,h.mapping)}else return null}}return h}function o(h){if(h&&h.isTexture&&h.isPMREMTexture!==true){let g=h.mapping,m=g===Kr||g===Qr,y=g===pi||g===Wi;if(m||y){let p=t.get(h),d=p!==void 0?p.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==d)return n===null&&(n=new ko(i)),p=m?n.fromEquirectangular(h,p):n.fromCubemap(h,p),p.texture.pmremVersion=h.pmremVersion,t.set(h,p),p.texture;if(p!==void 0)return p.texture;{let S=h.image;return m&&S&&S.height>0||y&&S&&c(S)?(n===null&&(n=new ko(i)),p=m?n.fromEquirectangular(h):n.fromCubemap(h),p.texture.pmremVersion=h.pmremVersion,t.set(h,p),h.addEventListener("dispose",u),p.texture):null}}}return h}function a(h,g){return g===Kr?h.mapping=pi:g===Qr&&(h.mapping=Wi),h}function c(h){let g=0,m=6;for(let y=0;y<m;y++)h[y]!==void 0&&g++;return g===m}function l(h){let g=h.target;g.removeEventListener("dispose",l);let m=e.get(g);m!==void 0&&(e.delete(g),m.dispose());}function u(h){let g=h.target;g.removeEventListener("dispose",u);let m=t.get(g);m!==void 0&&(t.delete(g),m.dispose());}function f(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null);}return {get:s,dispose:f}}function Vp(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s=i.getExtension(n);return e[n]=s,s}return {has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent");},get:function(n){let s=t(n);return s===null&&rs("WebGLRenderer: "+n+" extension not supported."),s}}}function Wp(i,e,t,n){let s={},r=new WeakMap,o=new FinalizationRegistry(m=>delete s[m]);function a(m){c(m.target);}function c(m){m.index!==null&&e.remove(m.index);for(let p in m.attributes)e.remove(m.attributes[p]);m.removeEventListener("dispose",a),delete s[m.id],o.unregister(m);let y=r.get(m);y&&(e.remove(y),r.delete(m)),n.releaseStatesOfGeometry(m),m.isInstancedBufferGeometry===true&&delete m._maxInstanceCount,t.memory.geometries--;}function l(m,y){return s[y.id]!==void 0||(y.addEventListener("dispose",a),s[y.id]=new WeakRef(y),o.register(y,y.id,y),t.memory.geometries++),y}function u(m){let y=m.attributes;for(let p in y)e.update(y[p],i.ARRAY_BUFFER);}function f(m){let y=m.index,p=m.attributes.position,d=0;if(p===void 0)return;let S=y!==null?y.array.length:p.array.length/3-1,C=p.count>=65535?ms:ps,T=new C(Math.ceil(S/3)*6,1),b=T.array;if(y!==null){let _=y.array;d=y.version;for(let M=0,O=0;M<S;M+=3){let D=_[M+0],F=_[M+1],L=_[M+2];b[O++]=D,b[O++]=F,b[O++]=F,b[O++]=L,b[O++]=L,b[O++]=D;}}else {d=p.version;for(let _=0,M=0;_<S;_+=3){let O=_+0,D=_+1,F=_+2;b[M++]=O,b[M++]=D,b[M++]=D,b[M++]=F,b[M++]=F,b[M++]=O;}}T.version=d;let w=r.get(m);w&&e.remove(w),r.set(m,T);}function h(m){let y=r.get(m);if(y){let p=m.index;p!==null&&y.version<p.version&&f(m);}else f(m);return r.get(m)}function g(){for(let m in s){let y=s[m].deref();y!==void 0&&c(y);}}return {get:l,update:u,getWireframeAttribute:h,dispose:g}}function Xp(i,e,t){let n;function s(f){n=f;}let r,o;function a(f){r=f.type,o=f.bytesPerElement;}function c(f,h){i.drawElements(n,h,r,f*o),t.update(h,n,1);}function l(f,h,g){g!==0&&(i.drawElementsInstanced(n,h,r,f*o,g),t.update(h,n,g));}function u(f,h,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,h,0,r,f,0,g);let y=0;for(let p=0;p<g;p++)y+=h[p];t.update(y,n,1);}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=u;}function qp(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:Fe("WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0;}return {memory:e,render:t,programs:null,autoReset:true,reset:s,update:n}}function Yp(i,e,t){let n=new WeakMap,s=new xt;function r(o,a,c){let l=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,f=u!==void 0?u.length:0,h=n.get(a);if(h===void 0||h.count!==f){let D=function(){M.dispose(),n.delete(a),a.removeEventListener("dispose",D);};h!==void 0&&h.texture.dispose();let m=a.morphAttributes.position!==void 0,y=a.morphAttributes.normal!==void 0,p=a.morphAttributes.color!==void 0,d=a.morphAttributes.position||[],S=a.morphAttributes.normal||[],C=a.morphAttributes.color||[],T=0;m===true&&(T=1),y===true&&(T=2),p===true&&(T=3);let b=a.attributes.position.count*T,w=1;b>e.maxTextureSize&&(w=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);let _=new Float32Array(b*w*4*f),M=new us(_,b,w,f);M.type=ln,M.needsUpdate=true;let O=T*4;for(let F=0;F<f;F++){let L=d[F],G=S[F],P=C[F],A=b*w*4*F;for(let k=0;k<L.count;k++){let U=k*O;m===true&&(s.fromBufferAttribute(L,k),_[A+U+0]=s.x,_[A+U+1]=s.y,_[A+U+2]=s.z,_[A+U+3]=0),y===true&&(s.fromBufferAttribute(G,k),_[A+U+4]=s.x,_[A+U+5]=s.y,_[A+U+6]=s.z,_[A+U+7]=0),p===true&&(s.fromBufferAttribute(P,k),_[A+U+8]=s.x,_[A+U+9]=s.y,_[A+U+10]=s.z,_[A+U+11]=P.itemSize===4?s.w:1);}}h={count:f,texture:M,size:new Pe(b,w)},n.set(a,h),a.addEventListener("dispose",D);}if(o.isInstancedMesh===true&&o.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else {let m=0;for(let p=0;p<l.length;p++)m+=l[p];let y=a.morphTargetsRelative?1:1-m;c.getUniforms().setValue(i,"morphTargetBaseInfluence",y),c.getUniforms().setValue(i,"morphTargetInfluences",l);}c.getUniforms().setValue(i,"morphTargetsTexture",h.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",h.size);}return {update:r}}function Zp(i,e,t,n,s){let r=new WeakMap;function o(l){let u=s.render.frame,f=l.geometry,h=e.get(l,f);if(r.get(h)!==u&&(e.update(h),r.set(h,u)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===false&&l.addEventListener("dispose",c),r.get(l)!==u&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),r.set(l,u))),l.isSkinnedMesh){let g=l.skeleton;r.get(g)!==u&&(g.update(),r.set(g,u));}return h}function a(){r=new WeakMap;}function c(l){let u=l.target;u.removeEventListener("dispose",c),n.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor);}return {update:o,dispose:a}}var Jp={[La]:"LINEAR_TONE_MAPPING",[Da]:"REINHARD_TONE_MAPPING",[Na]:"CINEON_TONE_MAPPING",[Fa]:"ACES_FILMIC_TONE_MAPPING",[Oa]:"AGX_TONE_MAPPING",[Ba]:"NEUTRAL_TONE_MAPPING",[Ua]:"CUSTOM_TONE_MAPPING"};function $p(i,e,t,n,s,r){let o=new en(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:false,storeMultisampledStencilBuffer:false,resolveDepthBuffer:false,resolveStencilBuffer:false}),a=null,c=null,l=null,u=new ct;u.setAttribute("position",new ut([-1,3,0,-1,-1,0,3,-1,0],3)),u.setAttribute("uv",new ut([0,2,0,0,2,0],2));let f=new Fr({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:false,depthWrite:false}),h=new gt(u,f),g=new Zr(-1,1,1,-1,0,1),m=null,y=null,p=false,d,S=null,C=[],T=false;this.setSize=function(b,w){o.setSize(b,w),a!==null&&a.setSize(b,w),c!==null&&c.setSize(b,w);for(let _=0;_<C.length;_++){let M=C[_];M.setSize&&M.setSize(b,w);}},this.setEffects=function(b){C=b,T=C.length>0&&C[0].isRenderPass===true;let w=o.width,_=o.height;C.length>0&&a===null&&(a=new en(w,_,{type:vn,depthBuffer:false,stencilBuffer:false}),c=new en(w,_,{type:vn,depthBuffer:false,stencilBuffer:false}));let M=s===true&&C.some(O=>O.needsDepthTexture===true);M!==(o.depthTexture!==null)&&(M===true&&l===null&&(l=new On(w,_),r===true&&(l.format=zn,l.type=mi)),o.dispose(),o.depthTexture=M?l:null,o.resolveDepthBuffer=M,o.storeMultisampledDepthBuffer=M);for(let O=0;O<C.length;O++){let D=C[O];D.setSize&&D.setSize(w,_),M&&D.needsDepthTexture===true&&D.setDepthTexture&&D.setDepthTexture(l);}},this.begin=function(b,w){if(p||b.toneMapping===an&&C.length===0)return  false;if(S=w,w!==null){let _=w.width,M=w.height;(o.width!==_||o.height!==M)&&this.setSize(_,M);}return T===false&&b.setRenderTarget(o),d=b.toneMapping,b.toneMapping=an,true},this.hasRenderPass=function(){return T},this.end=function(b,w){b.toneMapping=d,p=true;let _=o,M=a;for(let O=0;O<C.length;O++){let D=C[O];D.enabled!==false&&(D.render(b,M,_,w),D.needsSwap!==false&&(_=M,M=M===a?c:a));}if(m!==b.outputColorSpace||y!==b.toneMapping){m=b.outputColorSpace,y=b.toneMapping,f.defines={},Ye.getTransfer(m)===et&&(f.defines.SRGB_TRANSFER="");let O=Jp[y];O&&(f.defines[O]=""),f.needsUpdate=true;}f.uniforms.tDiffuse.value=_.texture,b.setRenderTarget(S),b.render(h,g),S=null,p=false;},this.isCompositing=function(){return p},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),c!==null&&c.dispose(),u.dispose(),f.dispose();};}var wh=new $t,Ah=new On(1,1),Ch=new ys(1),Rh=new us,Ph=new Rr,Ih=new xs,rh=[],oh=[],ah=new Float32Array(16),lh=new Float32Array(9),ch=new Float32Array(4);function Zi(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=rh[s];if(r===void 0&&(r=new Float32Array(s),rh[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a);}return r}function Ct(i,e){if(i.length!==e.length)return  false;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return  false;return  true}function Rt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t];}function Go(i,e){let t=oh[e];t===void 0&&(t=new Int32Array(e),oh[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Kp(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e);}function Qp(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else {if(Ct(t,e))return;i.uniform2fv(this.addr,e),Rt(t,e);}}function jp(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else {if(Ct(t,e))return;i.uniform3fv(this.addr,e),Rt(t,e);}}function em(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else {if(Ct(t,e))return;i.uniform4fv(this.addr,e),Rt(t,e);}}function tm(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ct(t,e))return;i.uniformMatrix2fv(this.addr,false,e),Rt(t,e);}else {if(Ct(t,n))return;ch.set(n),i.uniformMatrix2fv(this.addr,false,ch),Rt(t,n);}}function nm(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ct(t,e))return;i.uniformMatrix3fv(this.addr,false,e),Rt(t,e);}else {if(Ct(t,n))return;lh.set(n),i.uniformMatrix3fv(this.addr,false,lh),Rt(t,n);}}function im(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ct(t,e))return;i.uniformMatrix4fv(this.addr,false,e),Rt(t,e);}else {if(Ct(t,n))return;ah.set(n),i.uniformMatrix4fv(this.addr,false,ah),Rt(t,n);}}function sm(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e);}function rm(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else {if(Ct(t,e))return;i.uniform2iv(this.addr,e),Rt(t,e);}}function om(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else {if(Ct(t,e))return;i.uniform3iv(this.addr,e),Rt(t,e);}}function am(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else {if(Ct(t,e))return;i.uniform4iv(this.addr,e),Rt(t,e);}}function lm(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e);}function cm(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else {if(Ct(t,e))return;i.uniform2uiv(this.addr,e),Rt(t,e);}}function hm(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else {if(Ct(t,e))return;i.uniform3uiv(this.addr,e),Rt(t,e);}}function um(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else {if(Ct(t,e))return;i.uniform4uiv(this.addr,e),Rt(t,e);}}function Vo(i){return i.version===0&&(i.compareFunction=Ja,i.needsUpdate=true),i}function dm(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?r=Vo(Ah):r=wh,t.setTexture2D(e||r,s);}function fm(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Ph,s);}function pm(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_CUBE_SHADOW?r=Vo(Ch):r=Ih,t.setTextureCube(e||r,s);}function mm(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Rh,s);}function gm(i){switch(i){case 5126:return Kp;case 35664:return Qp;case 35665:return jp;case 35666:return em;case 35674:return tm;case 35675:return nm;case 35676:return im;case 5124:case 35670:return sm;case 35667:case 35671:return rm;case 35668:case 35672:return om;case 35669:case 35673:return am;case 5125:return lm;case 36294:return cm;case 36295:return hm;case 36296:return um;case 35678:case 36198:case 36298:case 36306:case 35682:return dm;case 35679:case 36299:case 36307:return fm;case 35680:case 36300:case 36308:case 36293:return pm;case 36289:case 36303:case 36311:case 36292:return mm}}function _m(i,e){i.uniform1fv(this.addr,e);}function vm(i,e){let t=Zi(e,this.size,2);i.uniform2fv(this.addr,t);}function xm(i,e){let t=Zi(e,this.size,3);i.uniform3fv(this.addr,t);}function ym(i,e){let t=Zi(e,this.size,4);i.uniform4fv(this.addr,t);}function Mm(i,e){let t=Zi(e,this.size,4);i.uniformMatrix2fv(this.addr,false,t);}function Sm(i,e){let t=Zi(e,this.size,9);i.uniformMatrix3fv(this.addr,false,t);}function bm(i,e){let t=Zi(e,this.size,16);i.uniformMatrix4fv(this.addr,false,t);}function Em(i,e){i.uniform1iv(this.addr,e);}function Tm(i,e){i.uniform2iv(this.addr,e);}function wm(i,e){i.uniform3iv(this.addr,e);}function Am(i,e){i.uniform4iv(this.addr,e);}function Cm(i,e){i.uniform1uiv(this.addr,e);}function Rm(i,e){i.uniform2uiv(this.addr,e);}function Pm(i,e){i.uniform3uiv(this.addr,e);}function Im(i,e){i.uniform4uiv(this.addr,e);}function Lm(i,e,t){let n=this.cache,s=e.length,r=Go(t,s);Ct(n,r)||(i.uniform1iv(this.addr,r),Rt(n,r));let o;this.type===i.SAMPLER_2D_SHADOW?o=Vo(Ah):o=wh;for(let a=0;a!==s;++a)t.setTexture2D(e[a]||o,r[a]);}function Dm(i,e,t){let n=this.cache,s=e.length,r=Go(t,s);Ct(n,r)||(i.uniform1iv(this.addr,r),Rt(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||Ph,r[o]);}function Nm(i,e,t){let n=this.cache,s=e.length,r=Go(t,s);Ct(n,r)||(i.uniform1iv(this.addr,r),Rt(n,r));let o;this.type===i.SAMPLER_CUBE_SHADOW?o=Vo(Ch):o=Ih;for(let a=0;a!==s;++a)t.setTextureCube(e[a]||o,r[a]);}function Fm(i,e,t){let n=this.cache,s=e.length,r=Go(t,s);Ct(n,r)||(i.uniform1iv(this.addr,r),Rt(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||Rh,r[o]);}function Um(i){switch(i){case 5126:return _m;case 35664:return vm;case 35665:return xm;case 35666:return ym;case 35674:return Mm;case 35675:return Sm;case 35676:return bm;case 5124:case 35670:return Em;case 35667:case 35671:return Tm;case 35668:case 35672:return wm;case 35669:case 35673:return Am;case 5125:return Cm;case 36294:return Rm;case 36295:return Pm;case 36296:return Im;case 35678:case 36198:case 36298:case 36306:case 35682:return Lm;case 35679:case 36299:case 36307:return Dm;case 35680:case 36300:case 36308:case 36293:return Nm;case 36289:case 36303:case 36311:case 36292:return Fm}}var hl=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=gm(t.type);}},ul=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Um(t.type);}},dl=class{constructor(e){this.id=e,this.seq=[],this.map={};}setValue(e,t,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],n);}}},ll=/(\w+)(\])?(\[|\.)?/g;function hh(i,e){i.seq.push(e),i.map[e.id]=e;}function Om(i,e,t){let n=i.name,s=n.length;for(ll.lastIndex=0;;){let r=ll.exec(n),o=ll.lastIndex,a=r[1],c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){hh(t,l===void 0?new hl(a,i,e):new ul(a,i,e));break}else {let f=t.map[a];f===void 0&&(f=new dl(a),hh(t,f)),t=f;}}}var Yi=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){let a=e.getActiveUniform(t,o),c=e.getUniformLocation(t,a.name);Om(a,c,this);}let s=[],r=[];for(let o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r));}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s);}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s);}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],c=n[a.id];c.needsUpdate!==false&&a.setValue(e,c.value,s);}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&n.push(o);}return n}};function uh(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var Bm=37297,zm=0;function km(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`);}return n.join(`
`)}var dh=new Ue;function Hm(i){Ye._getMatrix(dh,Ye.workingColorSpace,i);let e=`mat3( ${dh.elements.map(t=>t.toFixed(4))} )`;switch(Ye.getTransfer(i)){case ls:return [e,"LinearTransferOETF"];case et:return [e,"sRGBTransferOETF"];default:return Ie("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function fh(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return "";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+km(i.getShaderSource(e),a)}else return r}function Gm(i,e){let t=Hm(e);return [`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( ${t[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}var Vm={[La]:"Linear",[Da]:"Reinhard",[Na]:"Cineon",[Fa]:"ACESFilmic",[Oa]:"AgX",[Ba]:"Neutral",[Ua]:"Custom"};function Wm(i,e){let t=Vm[e];return t===void 0?(Ie("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var zo=new B;function Xm(){Ye.getLuminanceCoefficients(zo);let i=zo.x.toFixed(4),e=zo.y.toFixed(4),t=zo.z.toFixed(4);return ["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function qm(i){return [i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ns).join(`
`)}function Ym(i){let e=[];for(let t in i){let n=i[t];n!==false&&e.push("#define "+t+" "+n);}return e.join(`
`)}function Zm(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a};}return t}function Ns(i){return i!==""}function ph(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,e.numLightProbeGrids)}function mh(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Jm=/^[ \t]*#include +<([\w\d./]+)>/gm;function fl(i){return i.replace(Jm,$m)}function $m(i,e){let t=He[e];if(t===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">");return fl(t)}var Km=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function gh(i){return i.replace(Km,Qm)}function Qm(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function _h(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}var jm={[Es]:"SHADOWMAP_TYPE_PCF",[Gi]:"SHADOWMAP_TYPE_VSM"};function eg(i){return jm[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var tg={[Wi]:"ENVMAP_MODE_REFRACTION"};function ng(i){return i.envMap===false?"ENVMAP_MODE_REFLECTION":tg[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var ig={[Ia]:"ENVMAP_BLENDING_MULTIPLY",[Nc]:"ENVMAP_BLENDING_MIX",[Fc]:"ENVMAP_BLENDING_ADD"};function sg(i){return i.envMap===false?"ENVMAP_BLENDING_NONE":ig[i.combine]||"ENVMAP_BLENDING_NONE"}function rg(i,e,t,n){let s=i.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,c=eg(t),l=t.envMapPMREM===true?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",u=ng(t),f=sg(t),h=qm(t),g=Ym(r),m=s.createProgram(),y,p,d=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(y=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ns).join(`
`),y.length>0&&(y+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ns).join(`
`),p.length>0&&(p+=`
`)):(y=[_h(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+t.diffuseRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===false?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===false?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ns).join(`
`),p=[_h(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",t.envMap?"#define "+f:"",t.envMapPMREM?"#define ENVMAP_MAX_LOD "+t.envMapMaxLod+".0":"",t.envMapPMREM?"#define ENVMAP_SIZE "+t.envMapSize+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===false?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==an?"#define TONE_MAPPING":"",t.toneMapping!==an?He.tonemapping_pars_fragment:"",t.toneMapping!==an?Wm("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",He.colorspace_pars_fragment,Gm("linearToOutputTexel",t.outputColorSpace),Xm(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ns).join(`
`)),o=fl(o),o=ph(o,t),o=mh(o,t),a=fl(a),a=ph(a,t),a=mh(a,t),o=gh(o),a=gh(a),t.isRawShaderMaterial!==true&&(d=`#version 300 es
`,y=[h,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+y,p=["#define varying in",t.glslVersion===$a?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===$a?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let S=d+y+o,C=d+p+a,T=uh(s,s.VERTEX_SHADER,S),b=uh(s,s.FRAGMENT_SHADER,C);s.attachShader(m,T),s.attachShader(m,b),t.index0AttributeName!==void 0?s.bindAttribLocation(m,0,t.index0AttributeName):t.hasPositionAttribute===true&&s.bindAttribLocation(m,0,"position"),s.linkProgram(m);function w(D){if(i.debug.checkShaderErrors){let F=s.getProgramInfoLog(m)||"",L=s.getShaderInfoLog(T)||"",G=s.getShaderInfoLog(b)||"",P=F.trim(),A=L.trim(),k=G.trim(),U=true,j=true;if(s.getProgramParameter(m,s.LINK_STATUS)===false)if(U=false,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,m,T,b);else {let W=fh(s,T,"vertex"),K=fh(s,b,"fragment");Fe("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(m,s.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+P+`
`+W+`
`+K);}else P!==""?Ie("WebGLProgram: Program Info Log:",P):(A===""||k==="")&&(j=false);j&&(D.diagnostics={runnable:U,programLog:P,vertexShader:{log:A,prefix:y},fragmentShader:{log:k,prefix:p}});}s.deleteShader(T),s.deleteShader(b),_=new Yi(s,m),M=Zm(s,m);}let _;this.getUniforms=function(){return _===void 0&&w(this),_};let M;this.getAttributes=function(){return M===void 0&&w(this),M};let O=t.rendererExtensionParallelShaderCompile===false;return this.isReady=function(){return O===false&&(O=s.getProgramParameter(m,Bm)),O},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(m),this.program=void 0;},this.type=t.shaderType,this.name=t.shaderName,this.id=zm++,this.cacheKey=e,this.usedTimes=1,this.program=m,this.vertexShader=T,this.fragmentShader=b,this}var og=0,pl=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map;}update(e,t,n){let s=this._getShaderCacheForMaterial(e);return s.has(t)===false&&(s.add(t),t.usedTimes++),s.has(n)===false&&(s.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear();}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new ml(e),t.set(e,n)),n}},ml=class{constructor(e){this.id=og++,this.code=e,this.usedTimes=0;}};function ag(i){return i===ti||i===Ps||i===Is}function lg(i,e,t,n,s,r){let o=new ds,a=new pl,c=new Set,l=[],u=new Map,f=n.logarithmicDepthBuffer,h={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(_){return c.add(_),_===0?"uv":`uv${_}`}function m(_,M,O,D,F,L){let G=D.fog,P=F.geometry,A=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?D.environment:null,k=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,U=e.get(_.envMap||A,k),j=h[_.type],W=n.precision;_.precision!==null&&(W=n.getMaxPrecision(_.precision),W!==_.precision&&Ie("WebGLProgram.getParameters:",_.precision,"not supported, using",W,"instead."));let K=P.morphAttributes.position||P.morphAttributes.normal||P.morphAttributes.color,ee=K!==void 0?K.length:0,ye=0;P.morphAttributes.position!==void 0&&(ye=1),P.morphAttributes.normal!==void 0&&(ye=2),P.morphAttributes.color!==void 0&&(ye=3);let Ne,Z,oe,te;if(j){let ge=An[j];Ne=ge.vertexShader,Z=ge.fragmentShader;}else {Ne=_.vertexShader,Z=_.fragmentShader;let ge=a.getVertexShaderStage(_),nt=a.getFragmentShaderStage(_);a.update(_,ge,nt),oe=ge.id,te=nt.id;}let Te=i.getRenderTarget(),me=i.state.buffers.depth.getReversed(),Le=F.isInstancedMesh===true,ot=F.isBatchedMesh===true,Ae=!!_.map,Ve=!!_.matcap,We=!!U,Be=We&&U.isPMREMTexture===true,yt=!!_.aoMap,dt=!!_.lightMap,Mt=!!_.bumpMap&&_.wireframe===false,tt=!!_.normalMap,Ft=!!_.displacementMap,pt=!!_.emissiveMap,Et=!!_.metalnessMap,Ut=!!_.roughnessMap,Tt=_.anisotropy>0,N=_.clearcoat>0,wt=_.diffuseRoughness>0,st=_.dispersion>0,Ge=_.retroreflectivity>0,ae=_.iridescence>0,mt=_.sheen>0,Ce=_.transmission>0,De=Tt&&!!_.anisotropyMap,E=N&&!!_.clearcoatMap,v=N&&!!_.clearcoatNormalMap,H=N&&!!_.clearcoatRoughnessMap,ie=wt&&!!_.diffuseRoughnessMap,Q=ae&&!!_.iridescenceMap,le=ae&&!!_.iridescenceThicknessMap,fe=mt&&!!_.sheenColorMap,Y=mt&&!!_.sheenRoughnessMap,J=!!_.specularMap,he=!!_.specularColorMap,R=!!_.specularIntensityMap,$=Ce&&!!_.transmissionMap,q=Ce&&!!_.thicknessMap,ue=!!_.gradientMap,re=!!_.alphaMap,ce=_.alphaTest>0,we=!!_.alphaHash,ke=!!_.extensions,se=an;_.toneMapped&&(Te===null||Te.isXRRenderTarget===true)&&(se=i.toneMapping);let Re=Be?U.isCompressedCubeTexture?U.image[0].mipmaps:U.mipmaps:null,ze={shaderID:j,shaderType:_.type,shaderName:_.name,vertexShader:Ne,fragmentShader:Z,defines:_.defines,customVertexShaderID:oe,customFragmentShaderID:te,isRawShaderMaterial:_.isRawShaderMaterial===true,glslVersion:_.glslVersion,precision:W,batching:ot,batchingColor:ot&&F._colorsTexture!==null,instancing:Le,instancingColor:Le&&F.instanceColor!==null,instancingMorph:Le&&F.morphTexture!==null,outputColorSpace:Te===null?i.outputColorSpace:Te.isXRRenderTarget===true?Te.texture.colorSpace:Ye.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:Ae,matcap:Ve,envMap:We,envMapMode:We&&U.mapping,envMapPMREM:Be,envMapMaxLod:Be?Re.length-1:null,envMapSize:Be?Re[0].width:null,aoMap:yt,lightMap:dt,bumpMap:Mt,normalMap:tt,displacementMap:Ft,emissiveMap:pt,normalMapObjectSpace:tt&&_.normalMapType===Bc,normalMapTangentSpace:tt&&_.normalMapType===qa,packedNormalMap:tt&&_.normalMapType===qa&&ag(_.normalMap.format),metalnessMap:Et,roughnessMap:Ut,anisotropy:Tt,anisotropyMap:De,clearcoat:N,clearcoatMap:E,clearcoatNormalMap:v,clearcoatRoughnessMap:H,diffuseRoughness:wt,diffuseRoughnessMap:ie,dispersion:st,retroreflection:Ge,iridescence:ae,iridescenceMap:Q,iridescenceThicknessMap:le,sheen:mt,sheenColorMap:fe,sheenRoughnessMap:Y,specularMap:J,specularColorMap:he,specularIntensityMap:R,transmission:Ce,transmissionMap:$,thicknessMap:q,gradientMap:ue,opaque:_.transparent===false&&_.blending===Vi&&_.alphaToCoverage===false,alphaMap:re,alphaTest:ce,alphaHash:we,combine:_.combine,mapUv:Ae&&g(_.map.channel),aoMapUv:yt&&g(_.aoMap.channel),lightMapUv:dt&&g(_.lightMap.channel),bumpMapUv:Mt&&g(_.bumpMap.channel),normalMapUv:tt&&g(_.normalMap.channel),displacementMapUv:Ft&&g(_.displacementMap.channel),emissiveMapUv:pt&&g(_.emissiveMap.channel),metalnessMapUv:Et&&g(_.metalnessMap.channel),roughnessMapUv:Ut&&g(_.roughnessMap.channel),anisotropyMapUv:De&&g(_.anisotropyMap.channel),clearcoatMapUv:E&&g(_.clearcoatMap.channel),clearcoatNormalMapUv:v&&g(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:H&&g(_.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:ie&&g(_.diffuseRoughnessMap.channel),iridescenceMapUv:Q&&g(_.iridescenceMap.channel),iridescenceThicknessMapUv:le&&g(_.iridescenceThicknessMap.channel),sheenColorMapUv:fe&&g(_.sheenColorMap.channel),sheenRoughnessMapUv:Y&&g(_.sheenRoughnessMap.channel),specularMapUv:J&&g(_.specularMap.channel),specularColorMapUv:he&&g(_.specularColorMap.channel),specularIntensityMapUv:R&&g(_.specularIntensityMap.channel),transmissionMapUv:$&&g(_.transmissionMap.channel),thicknessMapUv:q&&g(_.thicknessMap.channel),alphaMapUv:re&&g(_.alphaMap.channel),vertexTangents:!!P.attributes.tangent&&(tt||Tt),vertexNormals:!!P.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===true&&!!P.attributes.color&&P.attributes.color.itemSize===4,pointsUvs:F.isPoints===true&&!!P.attributes.uv&&(Ae||re),fog:!!G,useFog:_.fog===true,fogExp2:!!G&&G.isFogExp2,flatShading:_.wireframe===false&&(_.flatShading===true||P.attributes.normal===void 0&&tt===false&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===true,logarithmicDepthBuffer:f,reversedDepthBuffer:me,skinning:F.isSkinnedMesh===true,hasPositionAttribute:P.attributes.position!==void 0,morphTargets:P.morphAttributes.position!==void 0,morphNormals:P.morphAttributes.normal!==void 0,morphColors:P.morphAttributes.color!==void 0,morphTargetsCount:ee,morphTextureStride:ye,numSunLights:M.sun.length,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numSunLightShadows:M.sunShadowMap.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numLightProbeGrids:L.filter(ge=>ge.texture!==null).length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&O.length>0,shadowMapType:i.shadowMap.type,toneMapping:se,decodeVideoTexture:Ae&&_.map.isVideoTexture===true&&Ye.getTransfer(_.map.colorSpace)===et,decodeVideoTextureEmissive:pt&&_.emissiveMap.isVideoTexture===true&&Ye.getTransfer(_.emissiveMap.colorSpace)===et,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Kt,flipSided:_.side===At,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:ke&&_.extensions.clipCullDistance===true&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ke&&_.extensions.multiDraw===true||ot)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return ze.vertexUv1s=c.has(1),ze.vertexUv2s=c.has(2),ze.vertexUv3s=c.has(3),c.clear(),ze}function y(_){let M=[];if(_.shaderID?M.push(_.shaderID):(M.push(_.customVertexShaderID),M.push(_.customFragmentShaderID)),_.defines!==void 0)for(let O in _.defines)M.push(O),M.push(_.defines[O]);return _.isRawShaderMaterial===false&&(p(M,_),d(M,_),M.push(i.outputColorSpace)),M.push(_.customProgramCacheKey),M.join()}function p(_,M){_.push(M.precision),_.push(M.outputColorSpace),_.push(M.envMapMode),_.push(M.envMapPMREM),_.push(M.envMapMaxLod),_.push(M.envMapSize),_.push(M.mapUv),_.push(M.alphaMapUv),_.push(M.lightMapUv),_.push(M.aoMapUv),_.push(M.bumpMapUv),_.push(M.normalMapUv),_.push(M.displacementMapUv),_.push(M.emissiveMapUv),_.push(M.metalnessMapUv),_.push(M.roughnessMapUv),_.push(M.anisotropyMapUv),_.push(M.clearcoatMapUv),_.push(M.clearcoatNormalMapUv),_.push(M.clearcoatRoughnessMapUv),_.push(M.diffuseRoughnessMapUv),_.push(M.iridescenceMapUv),_.push(M.iridescenceThicknessMapUv),_.push(M.sheenColorMapUv),_.push(M.sheenRoughnessMapUv),_.push(M.specularMapUv),_.push(M.specularColorMapUv),_.push(M.specularIntensityMapUv),_.push(M.transmissionMapUv),_.push(M.thicknessMapUv),_.push(M.combine),_.push(M.fogExp2),_.push(M.sizeAttenuation),_.push(M.morphTargetsCount),_.push(M.numSunLights),_.push(M.numDirLights),_.push(M.numPointLights),_.push(M.numSpotLights),_.push(M.numSpotLightMaps),_.push(M.numHemiLights),_.push(M.numRectAreaLights),_.push(M.numSunLightShadows),_.push(M.numDirLightShadows),_.push(M.numPointLightShadows),_.push(M.numSpotLightShadows),_.push(M.numSpotLightShadowsWithMaps),_.push(M.numLightProbes),_.push(M.numLightProbeGrids),_.push(M.shadowMapType),_.push(M.toneMapping),_.push(M.numClippingPlanes),_.push(M.numClipIntersection),_.push(M.depthPacking);}function d(_,M){o.disableAll(),M.instancing&&o.enable(0),M.instancingColor&&o.enable(1),M.instancingMorph&&o.enable(2),M.matcap&&o.enable(3),M.envMap&&o.enable(4),M.normalMapObjectSpace&&o.enable(5),M.normalMapTangentSpace&&o.enable(6),M.clearcoat&&o.enable(7),M.iridescence&&o.enable(8),M.alphaTest&&o.enable(9),M.vertexColors&&o.enable(10),M.vertexAlphas&&o.enable(11),M.vertexUv1s&&o.enable(12),M.vertexUv2s&&o.enable(13),M.vertexUv3s&&o.enable(14),M.vertexTangents&&o.enable(15),M.anisotropy&&o.enable(16),M.alphaHash&&o.enable(17),M.batching&&o.enable(18),M.dispersion&&o.enable(19),M.retroreflection&&o.enable(24),M.diffuseRoughness&&o.enable(25),M.batchingColor&&o.enable(20),M.gradientMap&&o.enable(21),M.packedNormalMap&&o.enable(22),M.vertexNormals&&o.enable(23),_.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.reversedDepthBuffer&&o.enable(4),M.skinning&&o.enable(5),M.morphTargets&&o.enable(6),M.morphNormals&&o.enable(7),M.morphColors&&o.enable(8),M.premultipliedAlpha&&o.enable(9),M.shadowMapEnabled&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),M.decodeVideoTextureEmissive&&o.enable(20),M.alphaToCoverage&&o.enable(21),M.numLightProbeGrids>0&&o.enable(22),M.hasPositionAttribute&&o.enable(23),_.push(o.mask);}function S(_){let M=h[_.type],O;if(M){let D=An[M];O=Qc.clone(D.uniforms);}else O=_.uniforms;return O}function C(_,M){let O=u.get(M);return O!==void 0?++O.usedTimes:(O=new rg(i,M,_,s),l.push(O),u.set(M,O)),O}function T(_){if(--_.usedTimes===0){let M=l.indexOf(_);l[M]=l[l.length-1],l.pop(),u.delete(_.cacheKey),_.destroy();}}function b(_){a.remove(_);}function w(){a.dispose();}return {getParameters:m,getProgramCacheKey:y,getUniforms:S,acquireProgram:C,releaseProgram:T,releaseShaderCache:b,programs:l,dispose:w}}function cg(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o);}function s(o,a,c){i.get(o)[a]=c;}function r(){i=new WeakMap;}return {has:e,get:t,remove:n,update:s,dispose:r}}function hg(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function vh(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function xh(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0;}function o(h){let g=0;return h.isInstancedMesh&&(g+=2),h.isSkinnedMesh&&(g+=1),g}function a(h,g,m,y,p,d){let S=i[e];return S===void 0?(S={id:h.id,object:h,geometry:g,material:m,materialVariant:o(h),groupOrder:y,renderOrder:h.renderOrder,z:p,group:d},i[e]=S):(S.id=h.id,S.object=h,S.geometry=g,S.material=m,S.materialVariant=o(h),S.groupOrder=y,S.renderOrder=h.renderOrder,S.z=p,S.group=d),e++,S}function c(h,g,m,y,p,d,S){S.reversedDepth===true&&(p=-p);let C=a(h,g,m,y,p,d);m.transmission>0?n.push(C):m.transparent===true?s.push(C):t.push(C);}function l(h,g,m,y,p,d){let S=a(h,g,m,y,p,d);m.transmission>0?n.unshift(S):m.transparent===true?s.unshift(S):t.unshift(S);}function u(h,g){t.length>1&&t.sort(h||hg),n.length>1&&n.sort(g||vh),s.length>1&&s.sort(g||vh);}function f(){for(let h=e,g=i.length;h<g;h++){let m=i[h];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null;}}return {opaque:t,transmissive:n,transparent:s,init:r,push:c,unshift:l,finish:f,sort:u}}function ug(){let i=new WeakMap;function e(n,s){let r=i.get(n),o;return r===void 0?(o=new xh,i.set(n,[o])):s>=r.length?(o=new xh,r.push(o)):o=r[s],o}function t(){i=new WeakMap;}return {get:e,dispose:t}}function dg(){let i={};return {get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case "SunLight":case "DirectionalLight":t={direction:new B,color:new ne};break;case "SpotLight":t={position:new B,direction:new B,color:new ne,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case "PointLight":t={position:new B,color:new ne,distance:0,decay:0};break;case "HemisphereLight":t={direction:new B,skyColor:new ne,groundColor:new ne};break;case "RectAreaLight":t={color:new ne,position:new B,halfWidth:new B,halfHeight:new B};break}return i[e.id]=t,t}}}function fg(){let i={};return {get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case "SunLight":case "DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Pe};break;case "SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Pe};break;case "PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Pe,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var pg=0;function mg(i,e){return (e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function gg(i){let e=new dg,t=fg(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new B);let s=new B,r=new lt,o=new lt;function a(l){let u=0,f=0,h=0;for(let L=0;L<9;L++)n.probe[L].set(0,0,0);let g=0,m=0,y=0,p=0,d=0,S=0,C=0,T=0,b=0,w=0,_=0,M=0,O=0,D=0;l.sort(mg);for(let L=0,G=l.length;L<G;L++){let P=l[L],A=P.color,k=P.intensity,U=P.distance,j=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===ti?j=P.shadow.map.texture:j=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)u+=A.r*k,f+=A.g*k,h+=A.b*k;else if(P.isLightProbe){for(let W=0;W<9;W++)n.probe[W].addScaledVector(P.sh.coefficients[W],k);D++;}else if(P.isSunLight){let W=e.get(P);if(W.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let K=P.shadow,ee=t.get(P);ee.shadowIntensity=K.intensity,ee.shadowBias=K.bias,ee.shadowNormalBias=K.normalBias,ee.shadowRadius=K.radius,ee.shadowMapSize.copy(K.mapSize).multiply(K.getFrameExtents()),n.sunShadow[m]=ee,n.sunShadowMap[m]=j;let ye=K.getViewportCount();for(let Ne=0;Ne<ye;Ne++)n.sunShadowMatrix[y+Ne]=K.getMatrix(Ne),n.sunShadowCascade[y+Ne]=K._cascadeData[Ne];y+=ye,m++;}n.sun[g]=W,g++;}else if(P.isDirectionalLight){let W=e.get(P);if(W.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let K=P.shadow,ee=t.get(P);ee.shadowIntensity=K.intensity,ee.shadowBias=K.bias,ee.shadowNormalBias=K.normalBias,ee.shadowRadius=K.radius,ee.shadowMapSize=K.mapSize,n.directionalShadow[p]=ee,n.directionalShadowMap[p]=j,n.directionalShadowMatrix[p]=P.shadow.matrix,b++;}n.directional[p]=W,p++;}else if(P.isSpotLight){let W=e.get(P);W.position.setFromMatrixPosition(P.matrixWorld),W.color.copy(A).multiplyScalar(k),W.distance=U,W.coneCos=Math.cos(P.angle),W.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),W.decay=P.decay,n.spot[S]=W;let K=P.shadow;if(P.map&&(n.spotLightMap[M]=P.map,M++,K.updateMatrices(P),P.castShadow&&O++),n.spotLightMatrix[S]=K.matrix,P.castShadow){let ee=t.get(P);ee.shadowIntensity=K.intensity,ee.shadowBias=K.bias,ee.shadowNormalBias=K.normalBias,ee.shadowRadius=K.radius,ee.shadowMapSize=K.mapSize,n.spotShadow[S]=ee,n.spotShadowMap[S]=j,_++;}S++;}else if(P.isRectAreaLight){let W=e.get(P);W.color.copy(A).multiplyScalar(k),W.halfWidth.set(P.width*.5,0,0),W.halfHeight.set(0,P.height*.5,0),n.rectArea[C]=W,C++;}else if(P.isPointLight){let W=e.get(P);if(W.color.copy(P.color).multiplyScalar(P.intensity),W.distance=P.distance,W.decay=P.decay,P.castShadow){let K=P.shadow,ee=t.get(P);ee.shadowIntensity=K.intensity,ee.shadowBias=K.bias,ee.shadowNormalBias=K.normalBias,ee.shadowRadius=K.radius,ee.shadowMapSize=K.mapSize,ee.shadowCameraNear=K.camera.near,ee.shadowCameraFar=K.camera.far,n.pointShadow[d]=ee,n.pointShadowMap[d]=j,n.pointShadowMatrix[d]=P.shadow.matrix,w++;}n.point[d]=W,d++;}else if(P.isHemisphereLight){let W=e.get(P);W.skyColor.copy(P.color).multiplyScalar(k),W.groundColor.copy(P.groundColor).multiplyScalar(k),n.hemi[T]=W,T++;}}C>0&&(i.has("OES_texture_float_linear")===true?(n.rectAreaLTC1=_e.LTC_FLOAT_1,n.rectAreaLTC2=_e.LTC_FLOAT_2):(n.rectAreaLTC1=_e.LTC_HALF_1,n.rectAreaLTC2=_e.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=f,n.ambient[2]=h;let F=n.hash;(F.sunLength!==g||F.directionalLength!==p||F.pointLength!==d||F.spotLength!==S||F.rectAreaLength!==C||F.hemiLength!==T||F.numSunShadows!==m||F.numDirectionalShadows!==b||F.numPointShadows!==w||F.numSpotShadows!==_||F.numSpotMaps!==M||F.numLightProbes!==D)&&(n.sun.length=g,n.directional.length=p,n.spot.length=S,n.rectArea.length=C,n.point.length=d,n.hemi.length=T,n.sunShadow.length=m,n.sunShadowMap.length=m,n.sunShadowMatrix.length=y,n.sunShadowCascade.length=y,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.directionalShadowMatrix.length=b,n.pointShadow.length=w,n.pointShadowMap.length=w,n.pointShadowMatrix.length=w,n.spotShadow.length=_,n.spotShadowMap.length=_,n.spotLightMatrix.length=_+M-O,n.spotLightMap.length=M,n.numSpotLightShadowsWithMaps=O,n.numLightProbes=D,F.sunLength=g,F.directionalLength=p,F.pointLength=d,F.spotLength=S,F.rectAreaLength=C,F.hemiLength=T,F.numSunShadows=m,F.numDirectionalShadows=b,F.numPointShadows=w,F.numSpotShadows=_,F.numSpotMaps=M,F.numLightProbes=D,n.version=pg++);}function c(l,u){let f=0,h=0,g=0,m=0,y=0,p=0,d=u.matrixWorldInverse;for(let S=0,C=l.length;S<C;S++){let T=l[S];if(T.isSunLight){let b=n.sun[f];b.direction.setFromMatrixPosition(T.matrixWorld),b.direction.transformDirection(d),f++;}else if(T.isDirectionalLight){let b=n.directional[h];b.direction.setFromMatrixPosition(T.matrixWorld),s.setFromMatrixPosition(T.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(d),h++;}else if(T.isSpotLight){let b=n.spot[m];b.position.setFromMatrixPosition(T.matrixWorld),b.position.applyMatrix4(d),b.direction.setFromMatrixPosition(T.matrixWorld),s.setFromMatrixPosition(T.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(d),m++;}else if(T.isRectAreaLight){let b=n.rectArea[y];b.position.setFromMatrixPosition(T.matrixWorld),b.position.applyMatrix4(d),o.identity(),r.copy(T.matrixWorld),r.premultiply(d),o.extractRotation(r),b.halfWidth.set(T.width*.5,0,0),b.halfHeight.set(0,T.height*.5,0),b.halfWidth.applyMatrix4(o),b.halfHeight.applyMatrix4(o),y++;}else if(T.isPointLight){let b=n.point[g];b.position.setFromMatrixPosition(T.matrixWorld),b.position.applyMatrix4(d),g++;}else if(T.isHemisphereLight){let b=n.hemi[p];b.direction.setFromMatrixPosition(T.matrixWorld),b.direction.transformDirection(d),p++;}}}return {setup:a,setupView:c,state:n}}function yh(i){let e=new gg(i),t=[],n=[],s=[];function r(f){u.camera=f,t.length=0,n.length=0,s.length=0;}function o(f){f.isLightProbeGrid?s.push(f):t.push(f);}function a(f){n.push(f);}function c(){e.setup(t),s.sort((f,h)=>f.priority-h.priority||f.id-h.id);}function l(f){e.setupView(t,f);}let u={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return {init:r,state:u,setupLights:c,setupLightsView:l,pushLight:o,pushShadow:a}}function _g(i){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new yh(i),e.set(s,[a])):r>=o.length?(a=new yh(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap;}return {get:t,dispose:n}}var vg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,xg=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,yg=[new B(1,0,0),new B(-1,0,0),new B(0,1,0),new B(0,-1,0),new B(0,0,1),new B(0,0,-1)],Mg=[new B(0,-1,0),new B(0,-1,0),new B(0,0,1),new B(0,0,-1),new B(0,-1,0),new B(0,-1,0)],Mh=new lt,Ds=new B,cl=new B;function Sg(i,e,t){let n=new ci,s=new Pe,r=new Pe,o=new xt,a=new Ur,c=new Or,l={},u=t.maxTextureSize,f={[ei]:At,[At]:ei,[Kt]:Kt},h=new rt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Pe},radius:{value:4}},vertexShader:vg,fragmentShader:xg}),g=h.clone();g.defines.HORIZONTAL_PASS=1;let m=new ct;m.setAttribute("position",new vt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let y=new gt(m,h),p=this;this.enabled=false,this.autoUpdate=true,this.needsUpdate=false,this.type=Es;let d=this.type;this.render=function(w,_,M){if(p.enabled===false||p.autoUpdate===false&&p.needsUpdate===false||w.length===0)return;this.type===mc&&(Ie("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Es);let O=i.getRenderTarget(),D=i.getActiveCubeFace(),F=i.getActiveMipmapLevel(),L=i.state;L.setBlending(di),L.buffers.depth.getReversed()===true?L.buffers.color.setClear(0,0,0,0):L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(true),L.setScissorTest(false);let G=d!==this.type;G&&_.traverse(function(P){P.material&&(Array.isArray(P.material)?P.material.forEach(A=>A.needsUpdate=true):P.material.needsUpdate=true);});for(let P=0,A=w.length;P<A;P++){let k=w[P],U=k.shadow;if(U===void 0){Ie("WebGLShadowMap:",k,"has no shadow.");continue}if(U.autoUpdate===false&&U.needsUpdate===false)continue;s.copy(U.mapSize);let j=U.getFrameExtents();s.multiply(j),r.copy(U.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/j.x),s.x=r.x*j.x,U.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/j.y),s.y=r.y*j.y,U.mapSize.y=r.y));let W=i.state.buffers.depth.getReversed();if(U.camera._reversedDepth=W,U.map===null||G===true){if(U.map!==null&&(U.map.depthTexture!==null&&(U.map.depthTexture.dispose(),U.map.depthTexture=null),U.map.dispose()),this.type===Gi){if(k.isPointLight){Ie("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}U.map=new en(s.x,s.y,{format:ti,type:vn,minFilter:Zt,magFilter:Zt,generateMipmaps:false}),U.map.texture.name=k.name+".shadowMap",U.map.depthTexture=new On(s.x,s.y,ln),U.map.depthTexture.name=k.name+".shadowMapDepth",U.map.depthTexture.format=Fn,U.map.depthTexture.compareFunction=null,U.map.depthTexture.minFilter=Dt,U.map.depthTexture.magFilter=Dt;}else k.isPointLight?(U.map=new Fs(s.x),U.map.depthTexture=new ys(s.x,_n)):(U.map=new en(s.x,s.y),U.map.depthTexture=new On(s.x,s.y,_n)),U.map.depthTexture.name=k.name+".shadowMap",U.map.depthTexture.format=Fn,this.type===Es?(U.map.depthTexture.compareFunction=W?Za:Ya,U.map.depthTexture.minFilter=Zt,U.map.depthTexture.magFilter=Zt):(U.map.depthTexture.compareFunction=null,U.map.depthTexture.minFilter=Dt,U.map.depthTexture.magFilter=Dt);U.camera.updateProjectionMatrix();}U.map.isWebGLCubeRenderTarget!==true&&(U.map.width!==s.x||U.map.height!==s.y)&&U.map.setSize(s.x,s.y);let K=U.map.isWebGLCubeRenderTarget?6:U.getViewportCount();k.isPointLight!==true&&U.updateMatrices(k,M);let ee=(U.camera.layers.mask&4294967294)!==0?U.camera.layers:M.layers;for(let ye=0;ye<K;ye++){let Ne=U.getCamera(ye);if(k.isPointLight){let Z=U.camera,oe=U.matrix,te=k.distance||Z.far;te!==Z.far&&(Z.far=te,Z.updateProjectionMatrix()),Ds.setFromMatrixPosition(k.matrixWorld),Z.position.copy(Ds),cl.copy(Z.position),cl.add(yg[ye]),Z.up.copy(Mg[ye]),Z.lookAt(cl),Z.updateMatrixWorld(),oe.makeTranslation(-Ds.x,-Ds.y,-Ds.z),Mh.multiplyMatrices(Z.projectionMatrix,Z.matrixWorldInverse),U._frustum.setFromProjectionMatrix(Mh,Z.coordinateSystem,Z.reversedDepth);}if(U.map.isWebGLCubeRenderTarget)i.setRenderTarget(U.map,ye),i.clear();else {ye===0&&(i.setRenderTarget(U.map),i.clear());let Z=U.getViewport(ye);o.set(r.x*Z.x,r.y*Z.y,r.x*Z.z,r.y*Z.w),L.viewport(o);}n=U.getFrustum(ye),T(_,M,Ne,k,ee,this.type);}U.isPointLightShadow!==true&&this.type===Gi&&S(U,M),U.needsUpdate=false;}d=this.type,p.needsUpdate=false,i.setRenderTarget(O,D,F);};function S(w,_){let M=e.update(y);h.defines.VSM_SAMPLES!==w.blurSamples&&(h.defines.VSM_SAMPLES=w.blurSamples,g.defines.VSM_SAMPLES=w.blurSamples,h.needsUpdate=true,g.needsUpdate=true),w.mapPass===null?w.mapPass=new en(s.x,s.y,{format:ti,type:vn}):(w.mapPass.width!==w.map.width||w.mapPass.height!==w.map.height)&&w.mapPass.setSize(w.map.width,w.map.height),h.uniforms.shadow_pass.value=w.map.depthTexture,h.uniforms.resolution.value.set(w.map.width,w.map.height),h.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(_,null,M,h,y,null),g.uniforms.shadow_pass.value=w.mapPass.texture,g.uniforms.resolution.value.set(w.map.width,w.map.height),g.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(_,null,M,g,y,null);}function C(w,_,M,O){let D=null,F=M.isPointLight===true?w.customDistanceMaterial:w.customDepthMaterial;if(F!==void 0)D=F;else if(D=M.isPointLight===true?c:a,i.localClippingEnabled&&_.clipShadows===true&&Array.isArray(_.clippingPlanes)&&_.clippingPlanes.length!==0||_.displacementMap&&_.displacementScale!==0||_.alphaMap&&_.alphaTest>0||_.map&&_.alphaTest>0||_.alphaToCoverage===true){let L=D.uuid,G=_.uuid,P=l[L];P===void 0&&(P={},l[L]=P);let A=P[G];A===void 0&&(A=D.clone(),P[G]=A,_.addEventListener("dispose",b)),D=A;}if(D.visible=_.visible,D.wireframe=_.wireframe,O===Gi?D.side=_.shadowSide!==null?_.shadowSide:_.side:D.side=_.shadowSide!==null?_.shadowSide:f[_.side],D.alphaMap=_.alphaMap,D.alphaTest=_.alphaToCoverage===true?.5:_.alphaTest,D.map=_.map,D.clipShadows=_.clipShadows,D.clippingPlanes=_.clippingPlanes,D.clipIntersection=_.clipIntersection,D.displacementMap=_.displacementMap,D.displacementScale=_.displacementScale,D.displacementBias=_.displacementBias,D.wireframeLinewidth=_.wireframeLinewidth,D.linewidth=_.linewidth,M.isPointLight===true&&D.isMeshDistanceMaterial===true){let L=i.properties.get(D);L.light=M;}return D}function T(w,_,M,O,D,F){if(w.visible===false)return;if(w.layers.test(D)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&F===Gi)&&(!w.frustumCulled||w.intersectsFrustum(n))){w.modelViewMatrix.multiplyMatrices(M.matrixWorldInverse,w.matrixWorld);let P=e.update(w),A=w.material;if(Array.isArray(A)){let k=P.groups;for(let U=0,j=k.length;U<j;U++){let W=k[U],K=A[W.materialIndex];if(K&&K.visible){let ee=C(w,K,O,F);w.onBeforeShadow(i,w,_,M,P,ee,W),i.renderBufferDirect(M,null,P,ee,w,W),w.onAfterShadow(i,w,_,M,P,ee,W);}}}else if(A.visible){let k=C(w,A,O,F);w.onBeforeShadow(i,w,_,M,P,k,null),i.renderBufferDirect(M,null,P,k,w,null),w.onAfterShadow(i,w,_,M,P,k,null);}}let G=w.children;for(let P=0,A=G.length;P<A;P++)T(G[P],_,M,O,D,F);}function b(w){w.target.removeEventListener("dispose",b);for(let M in l){let O=l[M],D=w.target.uuid;D in O&&(O[D].dispose(),delete O[D]);}}}function bg(i,e){function t(){let R=false,$=new xt,q=null,ue=new xt(0,0,0,0);return {setMask:function(re){q!==re&&!R&&(i.colorMask(re,re,re,re),q=re);},setLocked:function(re){R=re;},setClear:function(re,ce,we,ke,se){se===true&&(re*=ke,ce*=ke,we*=ke),$.set(re,ce,we,ke),ue.equals($)===false&&(i.clearColor(re,ce,we,ke),ue.copy($));},reset:function(){R=false,q=null,ue.set(-1,0,0,0);}}}function n(){let R=false,$=false,q=null,ue=null,re=null;return {setReversed:function(ce){if($!==ce){let we=e.get("EXT_clip_control");ce?we.clipControlEXT(we.LOWER_LEFT_EXT,we.ZERO_TO_ONE_EXT):we.clipControlEXT(we.LOWER_LEFT_EXT,we.NEGATIVE_ONE_TO_ONE_EXT),$=ce;let ke=re;re=null,this.setClear(ke);}},getReversed:function(){return $},setTest:function(ce){ce?me(i.DEPTH_TEST):Le(i.DEPTH_TEST);},setMask:function(ce){q!==ce&&!R&&(i.depthMask(ce),q=ce);},setFunc:function(ce){if($&&(ce=Jc[ce]),ue!==ce){switch(ce){case gr:i.depthFunc(i.NEVER);break;case _r:i.depthFunc(i.ALWAYS);break;case vr:i.depthFunc(i.LESS);break;case Ni:i.depthFunc(i.LEQUAL);break;case xr:i.depthFunc(i.EQUAL);break;case yr:i.depthFunc(i.GEQUAL);break;case Mr:i.depthFunc(i.GREATER);break;case Sr:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL);}ue=ce;}},setLocked:function(ce){R=ce;},setClear:function(ce){re!==ce&&(re=ce,$&&(ce=1-ce),i.clearDepth(ce));},reset:function(){R=false,q=null,ue=null,re=null,$=false;}}}function s(){let R=false,$=null,q=null,ue=null,re=null,ce=null,we=null,ke=null,se=null;return {setTest:function(Re){R||(Re?me(i.STENCIL_TEST):Le(i.STENCIL_TEST));},setMask:function(Re){$!==Re&&!R&&(i.stencilMask(Re),$=Re);},setFunc:function(Re,ze,ge){(q!==Re||ue!==ze||re!==ge)&&(i.stencilFunc(Re,ze,ge),q=Re,ue=ze,re=ge);},setOp:function(Re,ze,ge){(ce!==Re||we!==ze||ke!==ge)&&(i.stencilOp(Re,ze,ge),ce=Re,we=ze,ke=ge);},setLocked:function(Re){R=Re;},setClear:function(Re){se!==Re&&(i.clearStencil(Re),se=Re);},reset:function(){R=false,$=null,q=null,ue=null,re=null,ce=null,we=null,ke=null,se=null;}}}let r=new t,o=new n,a=new s,c={},l=new WeakMap,u={},f={},h={},g=new WeakMap,m=[],y=null,p=false,d=null,S=null,C=null,T=null,b=null,w=null,_=null,M=new ne(0,0,0),O=0,D=false,F=null,L=null,G=null,P=null,A=null,k=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),U=false,j=0,W=i.getParameter(i.VERSION);W.indexOf("WebGL")!==-1?(j=parseFloat(/^WebGL (\d)/.exec(W)[1]),U=j>=1):W.indexOf("OpenGL ES")!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),U=j>=2);let K=null,ee={},ye=i.getParameter(i.SCISSOR_BOX),Ne=i.getParameter(i.VIEWPORT),Z=new xt().fromArray(ye),oe=new xt().fromArray(Ne);function te(R,$,q,ue){let re=new Uint8Array(4),ce=i.createTexture();i.bindTexture(R,ce),i.texParameteri(R,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(R,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let we=0;we<q;we++)R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY?i.texImage3D($,0,i.RGBA,1,1,ue,0,i.RGBA,i.UNSIGNED_BYTE,re):i.texImage2D($+we,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,re);return ce}let Te={};Te[i.TEXTURE_2D]=te(i.TEXTURE_2D,i.TEXTURE_2D,1),Te[i.TEXTURE_CUBE_MAP]=te(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Te[i.TEXTURE_2D_ARRAY]=te(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Te[i.TEXTURE_3D]=te(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),me(i.DEPTH_TEST),o.setFunc(Ni),Mt(false),tt(wa),me(i.CULL_FACE),yt(di);function me(R){u[R]!==true&&(i.enable(R),u[R]=true);}function Le(R){u[R]!==false&&(i.disable(R),u[R]=false);}function ot(R,$){return h[R]!==$?(i.bindFramebuffer(R,$),h[R]=$,R===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=$),R===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=$),true):false}function Ae(R,$){let q=m,ue=false;if(R){q=g.get($),q===void 0&&(q=[],g.set($,q));let re=R.textures;if(q.length!==re.length||q[0]!==i.COLOR_ATTACHMENT0){for(let ce=0,we=re.length;ce<we;ce++)q[ce]=i.COLOR_ATTACHMENT0+ce;q.length=re.length,ue=true;}}else q[0]!==i.BACK&&(q[0]=i.BACK,ue=true);ue&&i.drawBuffers(q);}function Ve(R){return y!==R?(i.useProgram(R),y=R,true):false}let We={[fi]:i.FUNC_ADD,[_c]:i.FUNC_SUBTRACT,[vc]:i.FUNC_REVERSE_SUBTRACT};We[xc]=i.MIN,We[yc]=i.MAX;let Be={[Mc]:i.ZERO,[Sc]:i.ONE,[bc]:i.SRC_COLOR,[Ra]:i.SRC_ALPHA,[Rc]:i.SRC_ALPHA_SATURATE,[Ac]:i.DST_COLOR,[Tc]:i.DST_ALPHA,[Ec]:i.ONE_MINUS_SRC_COLOR,[Pa]:i.ONE_MINUS_SRC_ALPHA,[Cc]:i.ONE_MINUS_DST_COLOR,[wc]:i.ONE_MINUS_DST_ALPHA,[Pc]:i.CONSTANT_COLOR,[Ic]:i.ONE_MINUS_CONSTANT_COLOR,[Lc]:i.CONSTANT_ALPHA,[Dc]:i.ONE_MINUS_CONSTANT_ALPHA};function yt(R,$,q,ue,re,ce,we,ke,se,Re){if(R===di){p===true&&(Le(i.BLEND),p=false);return}if(p===false&&(me(i.BLEND),p=true),R!==gc){if(R!==d||Re!==D){if((S!==fi||b!==fi)&&(i.blendEquation(i.FUNC_ADD),S=fi,b=fi),Re)switch(R){case Vi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case zt:i.blendFunc(i.ONE,i.ONE);break;case Aa:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Ca:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Fe("WebGLState: Invalid blending: ",R);break}else switch(R){case Vi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case zt:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Aa:Fe("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Ca:Fe("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Fe("WebGLState: Invalid blending: ",R);break}C=null,T=null,w=null,_=null,M.set(0,0,0),O=0,d=R,D=Re;}return}re=re||$,ce=ce||q,we=we||ue,($!==S||re!==b)&&(i.blendEquationSeparate(We[$],We[re]),S=$,b=re),(q!==C||ue!==T||ce!==w||we!==_)&&(i.blendFuncSeparate(Be[q],Be[ue],Be[ce],Be[we]),C=q,T=ue,w=ce,_=we),(ke.equals(M)===false||se!==O)&&(i.blendColor(ke.r,ke.g,ke.b,se),M.copy(ke),O=se),d=R,D=false;}function dt(R,$){R.side===Kt?Le(i.CULL_FACE):me(i.CULL_FACE);let q=R.side===At;$&&(q=!q),Mt(q),R.blending===Vi&&R.transparent===false?yt(di):yt(R.blending,R.blendEquation,R.blendSrc,R.blendDst,R.blendEquationAlpha,R.blendSrcAlpha,R.blendDstAlpha,R.blendColor,R.blendAlpha,R.premultipliedAlpha),o.setFunc(R.depthFunc),o.setTest(R.depthTest),o.setMask(R.depthWrite),r.setMask(R.colorWrite);let ue=R.stencilWrite;a.setTest(ue),ue&&(a.setMask(R.stencilWriteMask),a.setFunc(R.stencilFunc,R.stencilRef,R.stencilFuncMask),a.setOp(R.stencilFail,R.stencilZFail,R.stencilZPass)),pt(R.polygonOffset,R.polygonOffsetFactor,R.polygonOffsetUnits),R.alphaToCoverage===true?me(i.SAMPLE_ALPHA_TO_COVERAGE):Le(i.SAMPLE_ALPHA_TO_COVERAGE);}function Mt(R){F!==R&&(R?i.frontFace(i.CW):i.frontFace(i.CCW),F=R);}function tt(R){R!==fc?(me(i.CULL_FACE),R!==L&&(R===wa?i.cullFace(i.BACK):R===pc?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Le(i.CULL_FACE),L=R;}function Ft(R){R!==G&&(U&&i.lineWidth(R),G=R);}function pt(R,$,q){R?(me(i.POLYGON_OFFSET_FILL),(P!==$||A!==q)&&(P=$,A=q,o.getReversed()&&($=-$,q=-q),i.polygonOffset($,q))):Le(i.POLYGON_OFFSET_FILL);}function Et(R){R?me(i.SCISSOR_TEST):Le(i.SCISSOR_TEST);}function Ut(R){R===void 0&&(R=i.TEXTURE0+k-1),K!==R&&(i.activeTexture(R),K=R);}function Tt(R,$,q){q===void 0&&(K===null?q=i.TEXTURE0+k-1:q=K);let ue=ee[q];ue===void 0&&(ue={type:void 0,texture:void 0},ee[q]=ue),(ue.type!==R||ue.texture!==$)&&(K!==q&&(i.activeTexture(q),K=q),i.bindTexture(R,$||Te[R]),ue.type=R,ue.texture=$);}function N(){let R=ee[K];R!==void 0&&R.type!==void 0&&(i.bindTexture(R.type,null),R.type=void 0,R.texture=void 0);}function wt(){try{i.compressedTexImage2D(...arguments);}catch(R){Fe("WebGLState:",R);}}function st(){try{i.compressedTexImage3D(...arguments);}catch(R){Fe("WebGLState:",R);}}function Ge(){try{i.texSubImage2D(...arguments);}catch(R){Fe("WebGLState:",R);}}function ae(){try{i.texSubImage3D(...arguments);}catch(R){Fe("WebGLState:",R);}}function mt(){try{i.compressedTexSubImage2D(...arguments);}catch(R){Fe("WebGLState:",R);}}function Ce(){try{i.compressedTexSubImage3D(...arguments);}catch(R){Fe("WebGLState:",R);}}function De(){try{i.texStorage2D(...arguments);}catch(R){Fe("WebGLState:",R);}}function E(){try{i.texStorage3D(...arguments);}catch(R){Fe("WebGLState:",R);}}function v(){try{i.texImage2D(...arguments);}catch(R){Fe("WebGLState:",R);}}function H(){try{i.texImage3D(...arguments);}catch(R){Fe("WebGLState:",R);}}function ie(R){return f[R]!==void 0?f[R]:i.getParameter(R)}function Q(R,$){f[R]!==$&&(i.pixelStorei(R,$),f[R]=$);}function le(R){Z.equals(R)===false&&(i.scissor(R.x,R.y,R.z,R.w),Z.copy(R));}function fe(R){oe.equals(R)===false&&(i.viewport(R.x,R.y,R.z,R.w),oe.copy(R));}function Y(R,$){let q=l.get($);q===void 0&&(q=new WeakMap,l.set($,q));let ue=q.get(R);ue===void 0&&(ue=i.getUniformBlockIndex($,R.name),i.uniformBlockBinding($,ue,ue),q.set(R,ue));}function J(R,$,q){let re=l.get($).get(R);c[re]!==q&&(i.bindBufferBase(i.UNIFORM_BUFFER,re,q),c[re]=q);}function he(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(true,true,true,true),i.clearColor(0,0,0,0),i.depthMask(true),i.depthFunc(i.LESS),o.setReversed(false),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,false),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),u={},f={},K=null,ee={},h={},c={},g=new WeakMap,m=[],y=null,p=false,d=null,S=null,C=null,T=null,b=null,w=null,_=null,M=new ne(0,0,0),O=0,D=false,F=null,L=null,G=null,P=null,A=null,Z.set(0,0,i.canvas.width,i.canvas.height),oe.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset();}return {buffers:{color:r,depth:o,stencil:a},enable:me,disable:Le,bindFramebuffer:ot,drawBuffers:Ae,useProgram:Ve,setBlending:yt,setMaterial:dt,setFlipSided:Mt,setCullFace:tt,setLineWidth:Ft,setPolygonOffset:pt,setScissorTest:Et,activeTexture:Ut,bindTexture:Tt,unbindTexture:N,compressedTexImage2D:wt,compressedTexImage3D:st,texImage2D:v,texImage3D:H,pixelStorei:Q,getParameter:ie,updateUBOMapping:Y,uniformBlockBinding:J,texStorage2D:De,texStorage3D:E,texSubImage2D:Ge,texSubImage3D:ae,compressedTexSubImage2D:mt,compressedTexSubImage3D:Ce,scissor:le,viewport:fe,reset:he}}function Eg(i,e,t,n,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?false:/OculusBrowser/g.test(navigator.userAgent),l=new Pe,u=new WeakMap,f=new Set,h,g=new WeakMap,m=new Set,y=new FinalizationRegistry(E=>m.delete(E)),p=false;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null;}catch{}function d(E,v){return p?new OffscreenCanvas(E,v):hs("canvas")}function S(E,v,H){let ie=1,Q=De(E);if((Q.width>H||Q.height>H)&&(ie=H/Math.max(Q.width,Q.height)),ie<1)if(typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&E instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&E instanceof ImageBitmap||typeof VideoFrame<"u"&&E instanceof VideoFrame){let le=Math.floor(ie*Q.width),fe=Math.floor(ie*Q.height);h===void 0&&(h=d(le,fe));let Y=v?d(le,fe):h;return Y.width=le,Y.height=fe,Y.getContext("2d").drawImage(E,0,0,le,fe),Ie("WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+le+"x"+fe+")."),Y}else return "data"in E&&Ie("WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),E;return E}function C(E){return E.generateMipmaps}function T(E){i.generateMipmap(E);}function b(E){return E.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:E.isWebGL3DRenderTarget?i.TEXTURE_3D:E.isWebGLArrayRenderTarget||E.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function w(E,v,H,ie,Q,le=false){if(E!==null){if(i[E]!==void 0)return i[E];Ie("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'");}let fe;ie&&(fe=e.get("EXT_texture_norm16"),fe||Ie("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Y=v;if(v===i.RED&&(H===i.FLOAT&&(Y=i.R32F),H===i.HALF_FLOAT&&(Y=i.R16F),H===i.UNSIGNED_BYTE&&(Y=i.R8),H===i.UNSIGNED_SHORT&&fe&&(Y=fe.R16_EXT),H===i.SHORT&&fe&&(Y=fe.R16_SNORM_EXT)),v===i.RED_INTEGER&&(H===i.UNSIGNED_BYTE&&(Y=i.R8UI),H===i.UNSIGNED_SHORT&&(Y=i.R16UI),H===i.UNSIGNED_INT&&(Y=i.R32UI),H===i.BYTE&&(Y=i.R8I),H===i.SHORT&&(Y=i.R16I),H===i.INT&&(Y=i.R32I)),v===i.RG&&(H===i.FLOAT&&(Y=i.RG32F),H===i.HALF_FLOAT&&(Y=i.RG16F),H===i.UNSIGNED_BYTE&&(Y=i.RG8),H===i.UNSIGNED_SHORT&&fe&&(Y=fe.RG16_EXT),H===i.SHORT&&fe&&(Y=fe.RG16_SNORM_EXT)),v===i.RG_INTEGER&&(H===i.UNSIGNED_BYTE&&(Y=i.RG8UI),H===i.UNSIGNED_SHORT&&(Y=i.RG16UI),H===i.UNSIGNED_INT&&(Y=i.RG32UI),H===i.BYTE&&(Y=i.RG8I),H===i.SHORT&&(Y=i.RG16I),H===i.INT&&(Y=i.RG32I)),v===i.RGB_INTEGER&&(H===i.UNSIGNED_BYTE&&(Y=i.RGB8UI),H===i.UNSIGNED_SHORT&&(Y=i.RGB16UI),H===i.UNSIGNED_INT&&(Y=i.RGB32UI),H===i.BYTE&&(Y=i.RGB8I),H===i.SHORT&&(Y=i.RGB16I),H===i.INT&&(Y=i.RGB32I)),v===i.RGBA_INTEGER&&(H===i.UNSIGNED_BYTE&&(Y=i.RGBA8UI),H===i.UNSIGNED_SHORT&&(Y=i.RGBA16UI),H===i.UNSIGNED_INT&&(Y=i.RGBA32UI),H===i.BYTE&&(Y=i.RGBA8I),H===i.SHORT&&(Y=i.RGBA16I),H===i.INT&&(Y=i.RGBA32I)),v===i.RGB&&(H===i.UNSIGNED_SHORT&&fe&&(Y=fe.RGB16_EXT),H===i.SHORT&&fe&&(Y=fe.RGB16_SNORM_EXT),H===i.UNSIGNED_INT_5_9_9_9_REV&&(Y=i.RGB9_E5),H===i.UNSIGNED_INT_10F_11F_11F_REV&&(Y=i.R11F_G11F_B10F)),v===i.RGBA){let J=le?ls:Ye.getTransfer(Q);H===i.FLOAT&&(Y=i.RGBA32F),H===i.HALF_FLOAT&&(Y=i.RGBA16F),H===i.UNSIGNED_BYTE&&(Y=J===et?i.SRGB8_ALPHA8:i.RGBA8),H===i.UNSIGNED_SHORT&&fe&&(Y=fe.RGBA16_EXT),H===i.SHORT&&fe&&(Y=fe.RGBA16_SNORM_EXT),H===i.UNSIGNED_SHORT_4_4_4_4&&(Y=i.RGBA4),H===i.UNSIGNED_SHORT_5_5_5_1&&(Y=i.RGB5_A1);}return (Y===i.R16F||Y===i.R32F||Y===i.RG16F||Y===i.RG32F||Y===i.RGBA16F||Y===i.RGBA32F)&&e.get("EXT_color_buffer_float"),Y}function _(E,v){let H;return E?v===null||v===_n||v===mi?H=i.DEPTH24_STENCIL8:v===ln?H=i.DEPTH32F_STENCIL8:v===Xi&&(H=i.DEPTH24_STENCIL8,Ie("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===_n||v===mi?H=i.DEPTH_COMPONENT24:v===ln?H=i.DEPTH_COMPONENT32F:v===Xi&&(H=i.DEPTH_COMPONENT16),H}function M(E,v){return C(E)===true||E.isFramebufferTexture&&E.minFilter!==Dt&&E.minFilter!==Zt?Math.log2(Math.max(v.width,v.height))+1:E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?v.mipmaps.length:1}function O(E){let v=new WeakRef(E);n.get(E).__ref=v,m.add(v),y.register(E,v,v);}function D(E){let v=n.get(E).__ref;v!==void 0&&(m.delete(v),y.unregister(v));}function F(E){G(E.target);}function L(E){P(E.target);}function G(E){E.removeEventListener("dispose",F),D(E),k(E),E.isVideoTexture&&u.delete(E),E.isHTMLTexture&&f.delete(E);}function P(E){E.removeEventListener("dispose",L),D(E),j(E);}function A(){for(let E of m){let v=E.deref();v!==void 0&&(v.isRenderTarget===true?P(v):G(v));}m.clear(),f.clear();}function k(E){let v=n.get(E);if(v.__webglInit===void 0)return;let H=E.source,ie=g.get(H);if(ie){let Q=ie[v.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&U(E),Object.keys(ie).length===0&&g.delete(H);}n.remove(E);}function U(E){let v=n.get(E);i.deleteTexture(v.__webglTexture);let H=E.source,ie=g.get(H);delete ie[v.__cacheKey],o.memory.textures--;}function j(E){let v=n.get(E);v.__depthDisposeCallback&&v.__depthDisposeCallback();let H=E.depthTexture;if(H&&H.renderTarget===E&&G(H),E.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(v.__webglFramebuffer[Q]))for(let le=0;le<v.__webglFramebuffer[Q].length;le++)i.deleteFramebuffer(v.__webglFramebuffer[Q][le]);else i.deleteFramebuffer(v.__webglFramebuffer[Q]);v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer[Q]);}else {if(Array.isArray(v.__webglFramebuffer))for(let Q=0;Q<v.__webglFramebuffer.length;Q++)i.deleteFramebuffer(v.__webglFramebuffer[Q]);else i.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&i.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let Q=0;Q<v.__webglColorRenderbuffer.length;Q++)v.__webglColorRenderbuffer[Q]&&i.deleteRenderbuffer(v.__webglColorRenderbuffer[Q]);v.__webglDepthRenderbuffer&&i.deleteRenderbuffer(v.__webglDepthRenderbuffer);}let ie=E.textures;for(let Q=0,le=ie.length;Q<le;Q++){let fe=n.get(ie[Q]);fe.__webglTexture&&(i.deleteTexture(fe.__webglTexture),o.memory.textures--),n.remove(ie[Q]);}n.remove(E);}let W=0;function K(){W=0;}function ee(){return W}function ye(E){W=E;}function Ne(){let E=W;return E>=s.maxTextures&&Ie("WebGLTextures: Trying to use "+(E+1)+" texture units while this GPU supports only "+s.maxTextures),W+=1,E}function Z(E){let v=[];return v.push(E.wrapS),v.push(E.wrapT),v.push(E.wrapR||0),v.push(E.magFilter),v.push(E.minFilter),v.push(E.anisotropy),v.push(E.internalFormat),v.push(E.format),v.push(E.type),v.push(E.generateMipmaps),v.push(E.mipmapsAutoUpdate),v.push(E.premultiplyAlpha),v.push(E.flipY),v.push(E.unpackAlignment),v.push(E.colorSpace),v.join()}function oe(E,v){let H=n.get(E);if(E.isVideoTexture&&mt(E),E.isRenderTargetTexture===false&&E.isExternalTexture!==true&&E.version>0&&H.__version!==E.version){let ie=E.image;if(ie===null)Ie("WebGLRenderer: Texture marked for update but no image data found.");else if(ie.complete===false)Ie("WebGLRenderer: Texture marked for update but image is incomplete");else {dt(H,E,v);return}}else E.isExternalTexture&&(H.__webglTexture=E.sourceTexture?E.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,H.__webglTexture,i.TEXTURE0+v);}function te(E,v){let H=n.get(E);if(E.isRenderTargetTexture===false&&E.version>0&&H.__version!==E.version){dt(H,E,v);return}else E.isExternalTexture&&(H.__webglTexture=E.sourceTexture?E.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,H.__webglTexture,i.TEXTURE0+v);}function Te(E,v){let H=n.get(E);if(E.isRenderTargetTexture===false&&E.version>0&&H.__version!==E.version){dt(H,E,v);return}t.bindTexture(i.TEXTURE_3D,H.__webglTexture,i.TEXTURE0+v);}function me(E,v){let H=n.get(E);if(E.version>0&&H.__version!==E.version){Mt(H,E,v);return}t.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture,i.TEXTURE0+v);}let Le={[br]:i.REPEAT,[Mn]:i.CLAMP_TO_EDGE,[Er]:i.MIRRORED_REPEAT},ot={[Dt]:i.NEAREST,[Uc]:i.NEAREST_MIPMAP_NEAREST,[Ts]:i.NEAREST_MIPMAP_LINEAR,[Zt]:i.LINEAR,[jr]:i.LINEAR_MIPMAP_NEAREST,[Bn]:i.LINEAR_MIPMAP_LINEAR},Ae={[kc]:i.NEVER,[Ja]:i.ALWAYS,[Hc]:i.LESS,[Ya]:i.LEQUAL,[Gc]:i.EQUAL,[Za]:i.GEQUAL,[Vc]:i.GREATER,[Wc]:i.NOTEQUAL};function Ve(E,v){if(v.type===ln&&e.has("OES_texture_float_linear")===false&&(v.magFilter===Zt||v.magFilter===jr||v.magFilter===Ts||v.magFilter===Bn||v.minFilter===Zt||v.minFilter===jr||v.minFilter===Ts||v.minFilter===Bn)&&Ie("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(E,i.TEXTURE_WRAP_S,Le[v.wrapS]),i.texParameteri(E,i.TEXTURE_WRAP_T,Le[v.wrapT]),(E===i.TEXTURE_3D||E===i.TEXTURE_2D_ARRAY)&&i.texParameteri(E,i.TEXTURE_WRAP_R,Le[v.wrapR]),i.texParameteri(E,i.TEXTURE_MAG_FILTER,ot[v.magFilter]),i.texParameteri(E,i.TEXTURE_MIN_FILTER,ot[v.minFilter]),v.compareFunction&&(i.texParameteri(E,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(E,i.TEXTURE_COMPARE_FUNC,Ae[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===true){if(v.magFilter===Dt||v.minFilter!==Ts&&v.minFilter!==Bn||v.type===ln&&e.has("OES_texture_float_linear")===false)return;if(v.anisotropy>1||n.get(v).__currentAnisotropy){let H=e.get("EXT_texture_filter_anisotropic");i.texParameterf(E,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,s.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy;}}}function We(E,v){let H=false;E.__webglInit===void 0&&(E.__webglInit=true,v.addEventListener("dispose",F),O(v));let ie=v.source,Q=g.get(ie);Q===void 0&&(Q={},g.set(ie,Q));let le=Z(v);if(le!==E.__cacheKey){Q[le]===void 0&&(Q[le]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,H=true),Q[le].usedTimes++;let fe=Q[E.__cacheKey];fe!==void 0&&(Q[E.__cacheKey].usedTimes--,fe.usedTimes===0&&U(v)),E.__cacheKey=le,E.__webglTexture=Q[le].texture;}return H}function Be(E,v,H){return Math.floor(Math.floor(E/H)/v)}function yt(E,v,H,ie){let le=E.updateRanges;if(le.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,v.width,v.height,H,ie,v.data);else {le.sort((R,$)=>R.start-$.start);let fe=0;for(let R=1;R<le.length;R++){let $=le[fe],q=le[R],ue=$.start+$.count,re=Be(q.start,v.width,4),ce=Be($.start,v.width,4);q.start<=ue+1&&re===ce&&Be(q.start+q.count-1,v.width,4)===re?$.count=Math.max($.count,q.start+q.count-$.start):(++fe,le[fe]=q);}le.length=fe+1;let Y=t.getParameter(i.UNPACK_ROW_LENGTH),J=t.getParameter(i.UNPACK_SKIP_PIXELS),he=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,v.width);for(let R=0,$=le.length;R<$;R++){let q=le[R],ue=Math.floor(q.start/4),re=Math.ceil(q.count/4),ce=ue%v.width,we=Math.floor(ue/v.width),ke=re,se=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,ce),t.pixelStorei(i.UNPACK_SKIP_ROWS,we),t.texSubImage2D(i.TEXTURE_2D,0,ce,we,ke,se,H,ie,v.data);}E.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,Y),t.pixelStorei(i.UNPACK_SKIP_PIXELS,J),t.pixelStorei(i.UNPACK_SKIP_ROWS,he);}}function dt(E,v,H){let ie=i.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(ie=i.TEXTURE_2D_ARRAY),v.isData3DTexture&&(ie=i.TEXTURE_3D);let Q=We(E,v),le=v.source;t.bindTexture(ie,E.__webglTexture,i.TEXTURE0+H);let fe=n.get(le);if(le.version!==fe.__version||Q===true){if(t.activeTexture(i.TEXTURE0+H),(typeof ImageBitmap<"u"&&v.image instanceof ImageBitmap)===false){let se=Ye.getPrimaries(Ye.workingColorSpace),Re=v.colorSpace===kn?null:Ye.getPrimaries(v.colorSpace),ze=v.colorSpace===kn||se===Re?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ze);}t.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment);let J=S(v.image,false,s.maxTextureSize);J=Ce(v,J);let he=r.convert(v.format,v.colorSpace),R=r.convert(v.type),$=w(v.internalFormat,he,R,v.normalized,v.colorSpace,v.isVideoTexture);Ve(ie,v);let q,ue=v.mipmaps,re=v.isVideoTexture!==true,ce=fe.__version===void 0||Q===true,we=le.dataReady,ke=M(v,J);if(v.isDepthTexture)$=_(v.format===zn,v.type),ce&&(re?t.texStorage2D(i.TEXTURE_2D,1,$,J.width,J.height):t.texImage2D(i.TEXTURE_2D,0,$,J.width,J.height,0,he,R,null));else if(v.isDataTexture)if(ue.length>0){re&&ce&&t.texStorage2D(i.TEXTURE_2D,ke,$,ue[0].width,ue[0].height);for(let se=0,Re=ue.length;se<Re;se++)q=ue[se],re?we&&t.texSubImage2D(i.TEXTURE_2D,se,0,0,q.width,q.height,he,R,q.data):t.texImage2D(i.TEXTURE_2D,se,$,q.width,q.height,0,he,R,q.data);v.generateMipmaps=false;}else re?(ce&&t.texStorage2D(i.TEXTURE_2D,ke,$,J.width,J.height),we&&yt(v,J,he,R)):t.texImage2D(i.TEXTURE_2D,0,$,J.width,J.height,0,he,R,J.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){re&&ce&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ke,$,ue[0].width,ue[0].height,J.depth);for(let se=0,Re=ue.length;se<Re;se++)if(q=ue[se],v.format!==xn)if(he!==null)if(re){if(we)if(v.layerUpdates.size>0){let ze=nl(q.width,q.height,v.format,v.type);for(let ge of v.layerUpdates){let nt=q.data.subarray(ge*ze/q.data.BYTES_PER_ELEMENT,(ge+1)*ze/q.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,se,0,0,ge,q.width,q.height,1,he,nt);}}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,se,0,0,0,q.width,q.height,J.depth,he,q.data);}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,se,$,q.width,q.height,J.depth,0,q.data,0,0);else Ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else re?we&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,se,0,0,0,q.width,q.height,J.depth,he,R,q.data):t.texImage3D(i.TEXTURE_2D_ARRAY,se,$,q.width,q.height,J.depth,0,he,R,q.data);v.layerUpdates.size>0&&v.clearLayerUpdates();}else {re&&ce&&t.texStorage2D(i.TEXTURE_2D,ke,$,ue[0].width,ue[0].height);for(let se=0,Re=ue.length;se<Re;se++)q=ue[se],v.format!==xn?he!==null?re?we&&t.compressedTexSubImage2D(i.TEXTURE_2D,se,0,0,q.width,q.height,he,q.data):t.compressedTexImage2D(i.TEXTURE_2D,se,$,q.width,q.height,0,q.data):Ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):re?we&&t.texSubImage2D(i.TEXTURE_2D,se,0,0,q.width,q.height,he,R,q.data):t.texImage2D(i.TEXTURE_2D,se,$,q.width,q.height,0,he,R,q.data);}else if(v.isDataArrayTexture)if(re){if(ce&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ke,$,J.width,J.height,J.depth),we)if(v.layerUpdates.size>0){let se=nl(J.width,J.height,v.format,v.type);for(let Re of v.layerUpdates){let ze=J.data.subarray(Re*se/J.data.BYTES_PER_ELEMENT,(Re+1)*se/J.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Re,J.width,J.height,1,he,R,ze);}v.clearLayerUpdates();}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,J.width,J.height,J.depth,he,R,J.data);}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,$,J.width,J.height,J.depth,0,he,R,J.data);else if(v.isData3DTexture)re?(ce&&t.texStorage3D(i.TEXTURE_3D,ke,$,J.width,J.height,J.depth),we&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,J.width,J.height,J.depth,he,R,J.data)):t.texImage3D(i.TEXTURE_3D,0,$,J.width,J.height,J.depth,0,he,R,J.data);else if(v.isFramebufferTexture){if(ce)if(re)t.texStorage2D(i.TEXTURE_2D,ke,$,J.width,J.height);else {let se=J.width,Re=J.height;for(let ze=0;ze<ke;ze++)t.texImage2D(i.TEXTURE_2D,ze,$,se,Re,0,he,R,null),se>>=1,Re>>=1;}}else if(v.isHTMLTexture){if("texElementImage2D"in i){let se=i.canvas;if(se.hasAttribute("layoutsubtree")||se.setAttribute("layoutsubtree","true"),J.parentNode!==se){se.appendChild(J),f.add(v),se.onpaint=Re=>{let ze=Re.changedElements;for(let ge of f)ze.includes(ge.image)&&(ge.needsUpdate=true);},se.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,J);else {let ze=i.RGBA,ge=i.RGBA,nt=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,ze,ge,nt,J);}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE);}}else if(ue.length>0){if(re&&ce){let se=De(ue[0]);t.texStorage2D(i.TEXTURE_2D,ke,$,se.width,se.height);}for(let se=0,Re=ue.length;se<Re;se++)q=ue[se],re?we&&t.texSubImage2D(i.TEXTURE_2D,se,0,0,he,R,q):t.texImage2D(i.TEXTURE_2D,se,$,he,R,q);v.generateMipmaps=false;}else if(re){if(ce){let se=De(J);t.texStorage2D(i.TEXTURE_2D,ke,$,se.width,se.height);}we&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,he,R,J);}else t.texImage2D(i.TEXTURE_2D,0,$,he,R,J);C(v)&&v.mipmapsAutoUpdate===true&&T(ie),fe.__version=le.version,v.onUpdate&&v.onUpdate(v);}E.__version=v.version;}function Mt(E,v,H){if(v.image.length!==6)return;let ie=We(E,v),Q=v.source;t.bindTexture(i.TEXTURE_CUBE_MAP,E.__webglTexture,i.TEXTURE0+H);let le=n.get(Q);if(Q.version!==le.__version||ie===true){t.activeTexture(i.TEXTURE0+H);let fe=Ye.getPrimaries(Ye.workingColorSpace),Y=v.colorSpace===kn?null:Ye.getPrimaries(v.colorSpace),J=v.colorSpace===kn||fe===Y?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,J);let he=v.isCompressedTexture||v.image[0].isCompressedTexture,R=v.image[0]&&v.image[0].isDataTexture,$=[];for(let ge=0;ge<6;ge++)!he&&!R?$[ge]=S(v.image[ge],true,s.maxCubemapSize):$[ge]=R?v.image[ge].image:v.image[ge],$[ge]=Ce(v,$[ge]);let q=$[0],ue=r.convert(v.format,v.colorSpace),re=r.convert(v.type),ce=w(v.internalFormat,ue,re,v.normalized,v.colorSpace),we=v.isVideoTexture!==true,ke=le.__version===void 0||ie===true,se=Q.dataReady,Re=M(v,q);Ve(i.TEXTURE_CUBE_MAP,v);let ze;if(v.isDepthTexture){if(ce=_(v.format===zn,v.type),ke)if(we)t.texStorage2D(i.TEXTURE_CUBE_MAP,1,ce,q.width,q.height);else for(let ge=0;ge<6;ge++)t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,ce,q.width,q.height,0,ue,re,null);}else if(he){we&&ke&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Re,ce,q.width,q.height);for(let ge=0;ge<6;ge++){ze=$[ge].mipmaps;for(let nt=0;nt<ze.length;nt++){let Pt=ze[nt];v.format!==xn?ue!==null?we?se&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ge,nt,0,0,Pt.width,Pt.height,ue,Pt.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ge,nt,ce,Pt.width,Pt.height,0,Pt.data):Ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):we?se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ge,nt,0,0,Pt.width,Pt.height,ue,re,Pt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ge,nt,ce,Pt.width,Pt.height,0,ue,re,Pt.data);}}}else {if(ze=v.mipmaps,we&&ke){ze.length>0&&Re++;let ge=De($[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Re,ce,ge.width,ge.height);}for(let ge=0;ge<6;ge++)if(R){we?se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,0,0,$[ge].width,$[ge].height,ue,re,$[ge].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,ce,$[ge].width,$[ge].height,0,ue,re,$[ge].data);for(let nt=0;nt<ze.length;nt++){let Hn=ze[nt].image[ge].image;we?se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ge,nt+1,0,0,Hn.width,Hn.height,ue,re,Hn.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ge,nt+1,ce,Hn.width,Hn.height,0,ue,re,Hn.data);}}else {we?se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,0,0,ue,re,$[ge]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,ce,ue,re,$[ge]);for(let nt=0;nt<ze.length;nt++){let Pt=ze[nt];we?se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ge,nt+1,0,0,ue,re,Pt.image[ge]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ge,nt+1,ce,ue,re,Pt.image[ge]);}}}C(v)&&v.mipmapsAutoUpdate===true&&T(i.TEXTURE_CUBE_MAP),le.__version=Q.version,v.onUpdate&&v.onUpdate(v);}E.__version=v.version;}function tt(E,v,H,ie,Q,le){let fe=r.convert(H.format,H.colorSpace),Y=r.convert(H.type),J=w(H.internalFormat,fe,Y,H.normalized,H.colorSpace),he=n.get(v),R=n.get(H);if(R.__renderTarget=v,!he.__hasExternalTextures){let $=Math.max(1,v.width>>le),q=Math.max(1,v.height>>le);Q===i.TEXTURE_3D||Q===i.TEXTURE_2D_ARRAY?t.texImage3D(Q,le,J,$,q,v.depth,0,fe,Y,null):t.texImage2D(Q,le,J,$,q,0,fe,Y,null);}t.bindFramebuffer(i.FRAMEBUFFER,E),ae(v)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ie,Q,R.__webglTexture,0,Ge(v)):(Q===i.TEXTURE_2D||Q>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,ie,Q,R.__webglTexture,le),t.bindFramebuffer(i.FRAMEBUFFER,null);}function Ft(E,v,H){if(i.bindRenderbuffer(i.RENDERBUFFER,E),v.depthBuffer){let ie=v.depthTexture,Q=ie&&ie.isDepthTexture?ie.type:null,le=_(v.stencilBuffer,Q),fe=v.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;ae(v)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ge(v),le,v.width,v.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ge(v),le,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,le,v.width,v.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,fe,i.RENDERBUFFER,E);}else {let ie=v.textures;for(let Q=0;Q<ie.length;Q++){let le=ie[Q],fe=r.convert(le.format,le.colorSpace),Y=r.convert(le.type),J=w(le.internalFormat,fe,Y,le.normalized,le.colorSpace);ae(v)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ge(v),J,v.width,v.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ge(v),J,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,J,v.width,v.height);}}i.bindRenderbuffer(i.RENDERBUFFER,null);}function pt(E,v,H){let ie=v.isWebGLCubeRenderTarget===true;if(t.bindFramebuffer(i.FRAMEBUFFER,E),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let Q=n.get(v.depthTexture);Q.__renderTarget=v;let le=ie?v.depthTexture.image[0]:v.depthTexture.image;(!Q.__webglTexture||le.width!==v.width||le.height!==v.height)&&(le.width=v.width,le.height=v.height,v.depthTexture.needsUpdate=true),ie?me(v.depthTexture,0):oe(v.depthTexture,0);let fe=Q.__webglTexture,Y=Ge(v),J=ie?i.TEXTURE_CUBE_MAP_POSITIVE_X+H:i.TEXTURE_2D,he=v.depthTexture.format===zn?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(v.depthTexture.format===Fn)ae(v)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,he,J,fe,0,Y):i.framebufferTexture2D(i.FRAMEBUFFER,he,J,fe,0);else if(v.depthTexture.format===zn)ae(v)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,he,J,fe,0,Y):i.framebufferTexture2D(i.FRAMEBUFFER,he,J,fe,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Et(E){let v=n.get(E),H=E.isWebGLCubeRenderTarget===true;if(v.__boundDepthTexture!==E.depthTexture){let ie=E.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),ie){let Q=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,ie.removeEventListener("dispose",Q);};ie.addEventListener("dispose",Q),v.__depthDisposeCallback=Q;}v.__boundDepthTexture=ie;}if(E.depthTexture&&!v.__autoAllocateDepthBuffer)if(H)for(let ie=0;ie<6;ie++)pt(v.__webglFramebuffer[ie],E,ie);else E.texture.mipmaps.length>0?pt(v.__webglFramebuffer[0],E,0):pt(v.__webglFramebuffer,E,0);else if(H){v.__webglDepthbuffer=[];for(let ie=0;ie<6;ie++)if(t.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[ie]),v.__webglDepthbuffer[ie]===void 0)v.__webglDepthbuffer[ie]=i.createRenderbuffer(),Ft(v.__webglDepthbuffer[ie],E,false);else {let Q=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,le=v.__webglDepthbuffer[ie];i.bindRenderbuffer(i.RENDERBUFFER,le),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,le);}}else if(E.texture.mipmaps.length>0?t.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=i.createRenderbuffer(),Ft(v.__webglDepthbuffer,E,false);else {let Q=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,le=v.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,le),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,le);}t.bindFramebuffer(i.FRAMEBUFFER,null);}function Ut(E,v,H){let ie=n.get(E);v!==void 0&&tt(ie.__webglFramebuffer,E,E.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),H!==void 0&&Et(E);}function Tt(E){let v=E.texture,H=n.get(E),ie=n.get(v);E.addEventListener("dispose",L),O(E);let Q=E.textures,le=E.isWebGLCubeRenderTarget===true,fe=Q.length>1;if(fe||(ie.__webglTexture===void 0&&(ie.__webglTexture=i.createTexture()),ie.__version=v.version,o.memory.textures++),le){H.__webglFramebuffer=[];for(let Y=0;Y<6;Y++)if(v.mipmaps.length>0){H.__webglFramebuffer[Y]=[];for(let J=0;J<v.mipmaps.length;J++)H.__webglFramebuffer[Y][J]=i.createFramebuffer();}else H.__webglFramebuffer[Y]=i.createFramebuffer();}else {if(v.mipmaps.length>0){H.__webglFramebuffer=[];for(let Y=0;Y<v.mipmaps.length;Y++)H.__webglFramebuffer[Y]=i.createFramebuffer();}else H.__webglFramebuffer=i.createFramebuffer();if(fe)for(let Y=0,J=Q.length;Y<J;Y++){let he=n.get(Q[Y]);he.__webglTexture===void 0&&(he.__webglTexture=i.createTexture(),o.memory.textures++);}if(E.samples>0&&ae(E)===false){H.__webglMultisampledFramebuffer=i.createFramebuffer(),H.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let Y=0;Y<Q.length;Y++){let J=Q[Y];H.__webglColorRenderbuffer[Y]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,H.__webglColorRenderbuffer[Y]);let he=r.convert(J.format,J.colorSpace),R=r.convert(J.type),$=w(J.internalFormat,he,R,J.normalized,J.colorSpace,E.isXRRenderTarget===true),q=Ge(E);i.renderbufferStorageMultisample(i.RENDERBUFFER,q,$,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Y,i.RENDERBUFFER,H.__webglColorRenderbuffer[Y]);}i.bindRenderbuffer(i.RENDERBUFFER,null),E.depthBuffer&&(H.__webglDepthRenderbuffer=i.createRenderbuffer(),Ft(H.__webglDepthRenderbuffer,E,true)),t.bindFramebuffer(i.FRAMEBUFFER,null);}}if(le){t.bindTexture(i.TEXTURE_CUBE_MAP,ie.__webglTexture),Ve(i.TEXTURE_CUBE_MAP,v);for(let Y=0;Y<6;Y++)if(v.mipmaps.length>0)for(let J=0;J<v.mipmaps.length;J++)tt(H.__webglFramebuffer[Y][J],E,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,J);else tt(H.__webglFramebuffer[Y],E,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0);C(v)?T(i.TEXTURE_CUBE_MAP):v.mipmaps.length>0&&i.texParameteri(i.TEXTURE_CUBE_MAP,i.TEXTURE_MAX_LEVEL,v.mipmaps.length-1),t.unbindTexture();}else if(fe){for(let Y=0,J=Q.length;Y<J;Y++){let he=Q[Y],R=n.get(he),$=i.TEXTURE_2D;(E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&($=E.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture($,R.__webglTexture),Ve($,he),tt(H.__webglFramebuffer,E,he,i.COLOR_ATTACHMENT0+Y,$,0),C(he)&&T($);}t.unbindTexture();}else {let Y=i.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(Y=E.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(Y,ie.__webglTexture),Ve(Y,v),v.mipmaps.length>0)for(let J=0;J<v.mipmaps.length;J++)tt(H.__webglFramebuffer[J],E,v,i.COLOR_ATTACHMENT0,Y,J);else tt(H.__webglFramebuffer,E,v,i.COLOR_ATTACHMENT0,Y,0);C(v)?T(Y):v.mipmaps.length>0&&i.texParameteri(Y,i.TEXTURE_MAX_LEVEL,v.mipmaps.length-1),t.unbindTexture();}E.depthBuffer&&Et(E);}function N(E){let v=E.textures;for(let H=0,ie=v.length;H<ie;H++){let Q=v[H];if(C(Q)&&Q.mipmapsAutoUpdate===true){let le=b(E),fe=n.get(Q).__webglTexture;t.bindTexture(le,fe),T(le),t.unbindTexture();}}}let wt=[];function st(E){if(E.samples>0){if(ae(E)===false){let v=E.textures,H=E.width,ie=E.height,Q=i.COLOR_BUFFER_BIT,le=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,fe=n.get(E),Y=v.length>1;if(Y)for(let he=0;he<v.length;he++)t.bindFramebuffer(i.FRAMEBUFFER,fe.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+he,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,fe.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+he,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,fe.__webglMultisampledFramebuffer),E.texture.mipmaps.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,fe.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,fe.__webglFramebuffer);for(let he=0;he<v.length;he++){if(E.resolveDepthBuffer&&(E.depthBuffer&&(Q|=i.DEPTH_BUFFER_BIT),E.stencilBuffer&&E.resolveStencilBuffer&&(Q|=i.STENCIL_BUFFER_BIT)),Y){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,fe.__webglColorRenderbuffer[he]);let R=n.get(v[he]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,R,0);}i.blitFramebuffer(0,0,H,ie,0,0,H,ie,Q,i.NEAREST),c===true&&(wt.length=0,wt.push(i.COLOR_ATTACHMENT0+he),E.depthBuffer&&E.storeMultisampledDepthBuffer===false&&wt.push(le),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,wt));}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Y)for(let he=0;he<v.length;he++){t.bindFramebuffer(i.FRAMEBUFFER,fe.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+he,i.RENDERBUFFER,fe.__webglColorRenderbuffer[he]);let R=n.get(v[he]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,fe.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+he,i.TEXTURE_2D,R,0);}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,fe.__webglMultisampledFramebuffer);}else if(E.depthBuffer&&E.storeMultisampledDepthBuffer===false&&c){let v=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[v]);}}}function Ge(E){return Math.min(s.maxSamples,E.samples)}function ae(E){let v=n.get(E);return E.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===true&&v.__useRenderToTexture!==false}function mt(E){let v=o.render.frame;u.get(E)!==v&&(u.set(E,v),E.update());}function Ce(E,v){let H=E.colorSpace,ie=E.format,Q=E.type;return E.isCompressedTexture===true||E.isVideoTexture===true||H!==as&&H!==kn&&(Ye.getTransfer(H)===et?(ie!==xn||Q!==nn)&&Ie("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Fe("WebGLTextures: Unsupported texture color space:",H)),v}function De(E){return typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement?(l.width=E.naturalWidth||E.width,l.height=E.naturalHeight||E.height):typeof VideoFrame<"u"&&E instanceof VideoFrame?(l.width=E.displayWidth,l.height=E.displayHeight):(l.width=E.width,l.height=E.height),l}this.allocateTextureUnit=Ne,this.resetTextureUnits=K,this.getTextureUnits=ee,this.setTextureUnits=ye,this.setTexture2D=oe,this.setTexture2DArray=te,this.setTexture3D=Te,this.setTextureCube=me,this.rebindTextures=Ut,this.setupRenderTarget=Tt,this.updateRenderTargetMipmap=N,this.updateMultisampleRenderTarget=st,this.setupDepthRenderbuffer=Et,this.setupFrameBufferTexture=tt,this.useMultisampledRTT=ae,this.dispose=A;}function Tg(i,e){function t(n,s=kn){let r,o=Ye.getTransfer(s);if(n===nn)return i.UNSIGNED_BYTE;if(n===to)return i.UNSIGNED_SHORT_4_4_4_4;if(n===no)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Ga)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Va)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===ka)return i.BYTE;if(n===Ha)return i.SHORT;if(n===Xi)return i.UNSIGNED_SHORT;if(n===eo)return i.INT;if(n===_n)return i.UNSIGNED_INT;if(n===ln)return i.FLOAT;if(n===vn)return i.HALF_FLOAT;if(n===Wa)return i.ALPHA;if(n===Xa)return i.RGB;if(n===xn)return i.RGBA;if(n===Fn)return i.DEPTH_COMPONENT;if(n===zn)return i.DEPTH_STENCIL;if(n===io)return i.RED;if(n===so)return i.RED_INTEGER;if(n===ti)return i.RG;if(n===ro)return i.RG_INTEGER;if(n===oo)return i.RGBA_INTEGER;if(n===ws||n===As||n===Cs||n===Rs)if(o===et)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===ws)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===As)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Cs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Rs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===ws)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===As)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Cs)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Rs)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ao||n===lo||n===co||n===ho)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===ao)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===lo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===co)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===ho)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===uo||n===fo||n===po||n===mo||n===go||n===Ps||n===_o)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===uo||n===fo)return o===et?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===po)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===mo)return r.COMPRESSED_R11_EAC;if(n===go)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Ps)return r.COMPRESSED_RG11_EAC;if(n===_o)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===vo||n===xo||n===yo||n===Mo||n===So||n===bo||n===Eo||n===To||n===wo||n===Ao||n===Co||n===Ro||n===Po||n===Io)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===vo)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===xo)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===yo)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Mo)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===So)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===bo)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Eo)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===To)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===wo)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ao)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Co)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ro)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Po)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Io)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Lo||n===Do||n===No)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Lo)return o===et?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Do)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===No)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Fo||n===Uo||n===Is||n===Oo)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Fo)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Uo)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Is)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Oo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===mi?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return {convert:t}}var wg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Ag=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,gl=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0;}init(e,t){if(this.texture===null){let n=new Ms(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n;}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new rt({vertexShader:wg,fragmentShader:Ag,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new gt(new gn(20,20),n);}return this.mesh}reset(){this.texture=null,this.mesh=null;}getDepthTexture(){return this.texture}},_l=class extends Sn{constructor(e,t){super();let n=this,s=null,r=1,o=null,a="local-floor",c=1,l=null,u=null,f=null,h=null,g=null,m=null,y=typeof XRWebGLBinding<"u",p=new gl,d={},S=t.getContextAttributes(),C=null,T=null,b=[],w=[],_=new Pe,M=null,O=null,D=new it;D.viewport=new xt;let F=new it;F.viewport=new xt;let L=[D,F],G=new Jr,P=null,A=null;this.cameraAutoUpdate=true,this.enabled=false,this.isPresenting=false,this.getController=function(Z){let oe=b[Z];return oe===void 0&&(oe=new Oi,b[Z]=oe),oe.getTargetRaySpace()},this.getControllerGrip=function(Z){let oe=b[Z];return oe===void 0&&(oe=new Oi,b[Z]=oe),oe.getGripSpace()},this.getHand=function(Z){let oe=b[Z];return oe===void 0&&(oe=new Oi,b[Z]=oe),oe.getHandSpace()};function k(Z){let oe=w.indexOf(Z.inputSource);if(oe===-1)return;let te=b[oe];te!==void 0&&(te.update(Z.inputSource,Z.frame,l||o),te.dispatchEvent({type:Z.type,data:Z.inputSource}));}function U(){s.removeEventListener("select",k),s.removeEventListener("selectstart",k),s.removeEventListener("selectend",k),s.removeEventListener("squeeze",k),s.removeEventListener("squeezestart",k),s.removeEventListener("squeezeend",k),s.removeEventListener("end",U),s.removeEventListener("inputsourceschange",j);for(let Z=0;Z<b.length;Z++){let oe=w[Z];oe!==null&&(w[Z]=null,b[Z].disconnect(oe));}P=null,A=null,p.reset();for(let Z in d)delete d[Z];if(e.setRenderTarget(C),g=null,h=null,f=null,s=null,T=null,Ne.stop(),n.isPresenting=false,e.setPixelRatio(M),e.setSize(_.width,_.height,false),O!==null){let Z=O.camera;Z.fov=O.fov,Z.zoom=O.zoom,Z.updateProjectionMatrix(),O=null;}n.dispatchEvent({type:"sessionend"});}this.setFramebufferScaleFactor=function(Z){r=Z,n.isPresenting===true&&Ie("WebXRManager: Cannot change framebuffer scale while presenting.");},this.setReferenceSpaceType=function(Z){a=Z,n.isPresenting===true&&Ie("WebXRManager: Cannot change reference space type while presenting.");},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(Z){l=Z;},this.getBaseLayer=function(){return h!==null?h:g},this.getBinding=function(){return f===null&&y&&(f=new XRWebGLBinding(s,t)),f},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(Z){if(s=Z,s!==null){if(C=e.getRenderTarget(),s.addEventListener("select",k),s.addEventListener("selectstart",k),s.addEventListener("selectend",k),s.addEventListener("squeeze",k),s.addEventListener("squeezestart",k),s.addEventListener("squeezeend",k),s.addEventListener("end",U),s.addEventListener("inputsourceschange",j),S.xrCompatible!==true&&await t.makeXRCompatible(),M=e.getPixelRatio(),e.getSize(_),y&&"createProjectionLayer"in XRWebGLBinding.prototype){let te=null,Te=null,me=null;S.depth&&(me=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,te=S.stencil?zn:Fn,Te=S.stencil?mi:_n);let Le={colorFormat:t.RGBA8,depthFormat:me,scaleFactor:r};f=this.getBinding(),h=f.createProjectionLayer(Le),s.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,false),T=new en(h.textureWidth,h.textureHeight,{format:xn,type:nn,depthTexture:new On(h.textureWidth,h.textureHeight,Te,void 0,void 0,void 0,void 0,void 0,void 0,te),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===false,resolveStencilBuffer:h.ignoreDepthValues===false,storeMultisampledDepthBuffer:h.ignoreDepthValues===false,storeMultisampledStencilBuffer:h.ignoreDepthValues===false});}else {let te={antialias:S.antialias,alpha:true,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};g=new XRWebGLLayer(s,t,te),s.updateRenderState({baseLayer:g}),e.setPixelRatio(1),e.setSize(g.framebufferWidth,g.framebufferHeight,false),T=new en(g.framebufferWidth,g.framebufferHeight,{format:xn,type:nn,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:g.ignoreDepthValues===false,resolveStencilBuffer:g.ignoreDepthValues===false,storeMultisampledDepthBuffer:g.ignoreDepthValues===false,storeMultisampledStencilBuffer:g.ignoreDepthValues===false});}T.isXRRenderTarget=true,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),Ne.setContext(s),Ne.start(),n.isPresenting=true,n.dispatchEvent({type:"sessionstart"});}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function j(Z){for(let oe=0;oe<Z.removed.length;oe++){let te=Z.removed[oe],Te=w.indexOf(te);Te>=0&&(w[Te]=null,b[Te].disconnect(te));}for(let oe=0;oe<Z.added.length;oe++){let te=Z.added[oe],Te=w.indexOf(te);if(Te===-1){for(let Le=0;Le<b.length;Le++)if(Le>=w.length){w.push(te),Te=Le;break}else if(w[Le]===null){w[Le]=te,Te=Le;break}if(Te===-1)break}let me=b[Te];me&&me.connect(te);}}function W(Z,oe){oe===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(oe.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert();}this.updateCamera=function(Z){if(s===null)return;let oe=Z.near,te=Z.far;p.texture!==null&&(p.depthNear>0&&(oe=p.depthNear),p.depthFar>0&&(te=p.depthFar)),G.near=F.near=D.near=oe,G.far=F.far=D.far=te,(P!==G.near||A!==G.far)&&(s.updateRenderState({depthNear:G.near,depthFar:G.far}),P=G.near,A=G.far),G.layers.mask=Z.layers.mask|6,D.layers.mask=G.layers.mask&-5,F.layers.mask=G.layers.mask&-3;let Te=Z.parent,me=G.cameras;W(G,Te);for(let Le=0;Le<me.length;Le++)W(me[Le],Te);G.projectionMatrix.copy(D.projectionMatrix),G.projectionMatrixInverse.copy(D.projectionMatrixInverse),O===null&&Z.isPerspectiveCamera&&(O={camera:Z,fov:Z.fov,zoom:Z.zoom}),K(Z,G,Te);};function K(Z,oe,te){te===null?Z.matrix.copy(oe.matrixWorld):(Z.matrix.copy(te.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(oe.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(true),Z.projectionMatrix.copy(oe.projectionMatrix),Z.projectionMatrixInverse.copy(oe.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=wr*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1);}this.getCamera=function(){return G},this.getFoveation=function(){if(!(h===null&&g===null))return c},this.setFoveation=function(Z){c=Z,h!==null&&(h.fixedFoveation=Z),g!==null&&g.fixedFoveation!==void 0&&(g.fixedFoveation=Z);},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(G)},this.getCameraTexture=function(Z){return d[Z]};let ee=null;function ye(Z,oe){if(u=oe.getViewerPose(l||o),m=oe,u!==null){let te=u.views;g!==null&&(e.setRenderTargetFramebuffer(T,g.framebuffer),e.setRenderTarget(T));let Te=false;te.length!==G.cameras.length&&(G.cameras.length=0,Te=true);for(let Ae=0;Ae<te.length;Ae++){let Ve=te[Ae],We=null;if(g!==null)We=g.getViewport(Ve);else {let yt=f.getViewSubImage(h,Ve);We=yt.viewport,Ae===0&&(e.setRenderTargetTextures(T,yt.colorTexture,yt.depthStencilTexture),e.setRenderTarget(T));}let Be=L[Ae];Be===void 0&&(Be=new it,Be.layers.enable(Ae),Be.viewport=new xt,L[Ae]=Be),Be.matrix.fromArray(Ve.transform.matrix),Be.matrix.decompose(Be.position,Be.quaternion,Be.scale),Be.projectionMatrix.fromArray(Ve.projectionMatrix),Be.projectionMatrixInverse.copy(Be.projectionMatrix).invert(),Be.viewport.set(We.x,We.y,We.width,We.height),Ae===0&&(G.matrix.copy(Be.matrix),G.matrix.decompose(G.position,G.quaternion,G.scale)),Te===true&&G.cameras.push(Be);}let me=s.enabledFeatures;if(me&&me.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&y){f=n.getBinding();let Ae=f.getDepthInformation(te[0]);Ae&&Ae.isValid&&Ae.texture&&p.init(Ae,s.renderState);}if(me&&me.includes("camera-access")&&y){e.state.unbindTexture(),f=n.getBinding();for(let Ae=0;Ae<te.length;Ae++){let Ve=te[Ae].camera;if(Ve){let We=d[Ve];We||(We=new Ms,d[Ve]=We);let Be=f.getCameraImage(Ve);We.sourceTexture=Be;}}}}for(let te=0;te<b.length;te++){let Te=w[te],me=b[te];Te!==null&&me!==void 0&&me.update(Te,oe,l||o);}ee&&ee(Z,oe),oe.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:oe}),m=null;}let Ne=new Sh;Ne.setAnimationLoop(ye),this.setAnimationLoop=function(Z){ee=Z;},this.dispose=function(){};}},Cg=new lt,Lh=new Ue;Lh.set(-1,0,0,0,1,0,0,0,1);function Rg(i,e){function t(p,d){p.matrixAutoUpdate===true&&p.updateMatrix(),d.value.copy(p.matrix);}function n(p,d){d.color.getRGB(p.fogColor.value,ja(i)),d.isFog?(p.fogNear.value=d.near,p.fogFar.value=d.far):d.isFogExp2&&(p.fogDensity.value=d.density);}function s(p,d,S,C,T){d.isNodeMaterial?d.uniformsNeedUpdate=false:d.isMeshBasicMaterial?r(p,d):d.isMeshLambertMaterial?(r(p,d),d.envMap&&(p.envMapIntensity.value=d.envMapIntensity)):d.isMeshToonMaterial?(r(p,d),f(p,d)):d.isMeshPhongMaterial?(r(p,d),u(p,d),d.envMap&&(p.envMapIntensity.value=d.envMapIntensity)):d.isMeshStandardMaterial?(r(p,d),h(p,d),d.isMeshPhysicalMaterial&&g(p,d,T)):d.isMeshMatcapMaterial?(r(p,d),m(p,d)):d.isMeshDepthMaterial?r(p,d):d.isMeshDistanceMaterial?(r(p,d),y(p,d)):d.isMeshNormalMaterial?r(p,d):d.isLineBasicMaterial?(o(p,d),d.isLineDashedMaterial&&a(p,d)):d.isPointsMaterial?c(p,d,S,C):d.isSpriteMaterial?l(p,d):d.isShadowMaterial?(p.color.value.copy(d.color),p.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=false);}function r(p,d){p.opacity.value=d.opacity,d.color&&p.diffuse.value.copy(d.color),d.emissive&&p.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(p.map.value=d.map,t(d.map,p.mapTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,t(d.alphaMap,p.alphaMapTransform)),d.bumpMap&&(p.bumpMap.value=d.bumpMap,t(d.bumpMap,p.bumpMapTransform),p.bumpScale.value=d.bumpScale,d.side===At&&(p.bumpScale.value*=-1)),d.normalMap&&(p.normalMap.value=d.normalMap,t(d.normalMap,p.normalMapTransform),p.normalScale.value.copy(d.normalScale),d.side===At&&p.normalScale.value.negate()),d.displacementMap&&(p.displacementMap.value=d.displacementMap,t(d.displacementMap,p.displacementMapTransform),p.displacementScale.value=d.displacementScale,p.displacementBias.value=d.displacementBias),d.emissiveMap&&(p.emissiveMap.value=d.emissiveMap,t(d.emissiveMap,p.emissiveMapTransform)),d.specularMap&&(p.specularMap.value=d.specularMap,t(d.specularMap,p.specularMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest);let S=e.get(d),C=S.envMap,T=S.envMapRotation;C&&(p.envMap.value=C,p.envMapRotation.value.setFromMatrix4(Cg.makeRotationFromEuler(T)).transpose(),C.isCubeTexture&&C.isRenderTargetTexture===false&&p.envMapRotation.value.premultiply(Lh),p.reflectivity.value=d.reflectivity,p.ior.value=d.ior,p.refractionRatio.value=d.refractionRatio),d.lightMap&&(p.lightMap.value=d.lightMap,p.lightMapIntensity.value=d.lightMapIntensity,t(d.lightMap,p.lightMapTransform)),d.aoMap&&(p.aoMap.value=d.aoMap,p.aoMapIntensity.value=d.aoMapIntensity,t(d.aoMap,p.aoMapTransform));}function o(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,d.map&&(p.map.value=d.map,t(d.map,p.mapTransform));}function a(p,d){p.dashSize.value=d.dashSize,p.totalSize.value=d.dashSize+d.gapSize,p.scale.value=d.scale;}function c(p,d,S,C){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.size.value=d.size*S,p.scale.value=C*.5,d.map&&(p.map.value=d.map,t(d.map,p.uvTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,t(d.alphaMap,p.alphaMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest);}function l(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.rotation.value=d.rotation,d.map&&(p.map.value=d.map,t(d.map,p.mapTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,t(d.alphaMap,p.alphaMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest);}function u(p,d){p.specular.value.copy(d.specular),p.shininess.value=Math.max(d.shininess,1e-4);}function f(p,d){d.gradientMap&&(p.gradientMap.value=d.gradientMap);}function h(p,d){p.metalness.value=d.metalness,d.metalnessMap&&(p.metalnessMap.value=d.metalnessMap,t(d.metalnessMap,p.metalnessMapTransform)),p.roughness.value=d.roughness,d.roughnessMap&&(p.roughnessMap.value=d.roughnessMap,t(d.roughnessMap,p.roughnessMapTransform)),d.envMap&&(p.envMapIntensity.value=d.envMapIntensity);}function g(p,d,S){p.ior.value=d.ior,d.diffuseRoughness>0&&(p.diffuseRoughness.value=d.diffuseRoughness,d.diffuseRoughnessMap&&(p.diffuseRoughnessMap.value=d.diffuseRoughnessMap,t(d.diffuseRoughnessMap,p.diffuseRoughnessMapTransform))),d.sheen>0&&(p.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),p.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(p.sheenColorMap.value=d.sheenColorMap,t(d.sheenColorMap,p.sheenColorMapTransform)),d.sheenRoughnessMap&&(p.sheenRoughnessMap.value=d.sheenRoughnessMap,t(d.sheenRoughnessMap,p.sheenRoughnessMapTransform))),d.clearcoat>0&&(p.clearcoat.value=d.clearcoat,p.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(p.clearcoatMap.value=d.clearcoatMap,t(d.clearcoatMap,p.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,t(d.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(p.clearcoatNormalMap.value=d.clearcoatNormalMap,t(d.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===At&&p.clearcoatNormalScale.value.negate())),d.dispersion>0&&(p.dispersion.value=d.dispersion),d.retroreflectivity>0&&(p.retroreflectivity.value=d.retroreflectivity),d.iridescence>0&&(p.iridescence.value=d.iridescence,p.iridescenceIOR.value=d.iridescenceIOR,p.iridescenceThicknessMinimum.value=d.iridescenceThicknessMinimum,p.iridescenceThicknessMaximum.value=d.iridescenceThicknessMaximum,d.iridescenceMap&&(p.iridescenceMap.value=d.iridescenceMap,t(d.iridescenceMap,p.iridescenceMapTransform)),d.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=d.iridescenceThicknessMap,t(d.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),d.transmission>0&&(p.transmission.value=d.transmission,p.transmissionSamplerMap.value=S.texture,p.transmissionSamplerSize.value.set(S.width,S.height),d.transmissionMap&&(p.transmissionMap.value=d.transmissionMap,t(d.transmissionMap,p.transmissionMapTransform)),p.thickness.value=d.thickness,d.thicknessMap&&(p.thicknessMap.value=d.thicknessMap,t(d.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=d.attenuationDistance,p.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(p.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(p.anisotropyMap.value=d.anisotropyMap,t(d.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=d.specularIntensity,p.specularColor.value.copy(d.specularColor),d.specularColorMap&&(p.specularColorMap.value=d.specularColorMap,t(d.specularColorMap,p.specularColorMapTransform)),d.specularIntensityMap&&(p.specularIntensityMap.value=d.specularIntensityMap,t(d.specularIntensityMap,p.specularIntensityMapTransform));}function m(p,d){d.matcap&&(p.matcap.value=d.matcap);}function y(p,d){let S=e.get(d).light;p.referencePosition.value.setFromMatrixPosition(S.matrixWorld),p.nearDistance.value=S.shadow.camera.near,p.farDistance.value=S.shadow.camera.far;}return {refreshFogUniforms:n,refreshMaterialUniforms:s}}function Pg(i,e,t,n){let s={},r={};function o(S,C){let T=C.program;n.uniformBlockBinding(S,T,s[S.id]);}function a(S,C){let T=s[S.id];T===void 0&&(m(S),T=c(S),s[S.id]=T,S.addEventListener("dispose",p));let b=C.program;n.updateUBOMapping(S,b);let w=e.render.frame;r[S.id]!==w&&(l(S),r[S.id]=w);}function c(S){let C=i.createBuffer(),T=S.__size,b=S.usage;return i.bindBuffer(i.UNIFORM_BUFFER,C),i.bufferData(i.UNIFORM_BUFFER,T,b),i.bindBuffer(i.UNIFORM_BUFFER,null),C}function l(S){let C=s[S.id],T=S.uniforms,b=S.__cache;i.bindBuffer(i.UNIFORM_BUFFER,C);for(let w=0,_=T.length;w<_;w++){let M=T[w];if(Array.isArray(M))for(let O=0,D=M.length;O<D;O++)u(M[O],w,O,b);else u(M,w,0,b);}i.bindBuffer(i.UNIFORM_BUFFER,null);}function u(S,C,T,b){if(h(S,C,T,b)===true){let w=S.__offset,_=S.value;if(Array.isArray(_)){let M=0;for(let O=0;O<_.length;O++){let D=_[O],F=y(D,true);f(D,S.__data,M),M+=F.storage/Float32Array.BYTES_PER_ELEMENT;}}else f(_,S.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,w,S.__data);}}function f(S,C,T){typeof S=="number"||typeof S=="boolean"?C[T]=S:S.isMatrix3?(C[T]=S.elements[0],C[T+1]=S.elements[1],C[T+2]=S.elements[2],C[T+3]=0,C[T+4]=S.elements[3],C[T+5]=S.elements[4],C[T+6]=S.elements[5],C[T+7]=0,C[T+8]=S.elements[6],C[T+9]=S.elements[7],C[T+10]=S.elements[8],C[T+11]=0):ArrayBuffer.isView(S)?C.set(S.subarray(0,C.length-T),T):S.toArray(C,T);}function h(S,C,T,b){let w=S.value,_=C+"_"+T;if(Array.isArray(w)){b[_]===void 0&&(b[_]=[]);let M=b[_],O=false;for(let D=0;D<w.length;D++)g(w[D],M,D)===true&&(O=true);return O}return g(w,b,_)}function g(S,C,T){if(C[T]===void 0)return typeof S=="number"||typeof S=="boolean"?C[T]=S:ArrayBuffer.isView(S)?C[T]=S.slice():C[T]=S.clone(),true;{let b=C[T];if(typeof S=="number"||typeof S=="boolean"){if(b!==S)return C[T]=S,true}else {if(ArrayBuffer.isView(S))return  true;if(b.equals(S)===false)return b.copy(S),true}}return  false}function m(S){let C=S.uniforms,T=0,b=16;for(let _=0,M=C.length;_<M;_++){let O=Array.isArray(C[_])?C[_]:[C[_]];for(let D=0,F=O.length;D<F;D++){let L=O[D],G=Array.isArray(L.value)?L.value:[L.value],P=Array.isArray(C[_])||Array.isArray(L.value),A=T;for(let U=0,j=G.length;U<j;U++){let W=G[U],K=y(W,P),ee=T%b,ye=ee%K.boundary,Ne=ee+ye;T+=ye,Ne!==0&&b-Ne<K.storage&&(T+=b-Ne),U===0&&(A=T),T+=K.storage;}let k=L.type==="int"?Int32Array:L.type==="uint"?Uint32Array:Float32Array;L.__data=new k((T-A)/Float32Array.BYTES_PER_ELEMENT),L.__offset=A;}}let w=T%b;return w>0&&(T+=b-w),S.__size=T,S.__cache={},this}function y(S,C){let T={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(T.boundary=4,T.storage=4):S.isVector2?(T.boundary=8,T.storage=8):S.isVector3||S.isColor?(T.boundary=16,T.storage=12):S.isVector4?(T.boundary=16,T.storage=16):S.isMatrix3?(T.boundary=16,T.storage=48):S.isMatrix4?(T.boundary=16,T.storage=64):S.isTexture?Ie("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(S)?(T.boundary=16,T.storage=S.byteLength):Ie("WebGLRenderer: Unsupported uniform value type.",S),C===true&&(T.boundary=16,T.storage=Math.ceil(T.storage/16)*16),T}function p(S){let C=S.target;C.removeEventListener("dispose",p),i.deleteBuffer(s[C.id]),delete s[C.id],delete r[C.id];}function d(){for(let S in s)i.deleteBuffer(s[S]);s={},r={};}return {bind:o,update:a,dispose:d}}var Ig=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),wn=null;function Lg(){return wn===null&&(wn=new gs(Ig,16,16,ti,vn),wn.name="DFG_LUT",wn.minFilter=Zt,wn.magFilter=Zt,wn.wrapS=Mn,wn.wrapT=Mn,wn.generateMipmaps=false,wn.needsUpdate=true),wn}var Ho=class{constructor(e={}){let{canvas:t=qc(),context:n=null,depth:s=true,stencil:r=false,alpha:o=false,antialias:a=false,premultipliedAlpha:c=true,preserveDrawingBuffer:l=false,powerPreference:u="default",failIfMajorPerformanceCaveat:f=false,reversedDepthBuffer:h=false,outputBufferType:g=nn}=e;this.isWebGLRenderer=true;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha;}else m=o;let y=g,p=new Set([oo,ro,so]),d=new Set([nn,_n,Xi,mi,to,no]),S=new Uint32Array(4),C=new Int32Array(4),T={textures:[],min:[],max:[],resolution:[]},b=null,w=null,_=[],M=[],O=null;this.domElement=t,this.debug={checkShaderErrors:true,diagnostics:{keywords:false},onShaderError:null},this.autoClear=true,this.autoClearColor=true,this.autoClearDepth=true,this.autoClearStencil=true,this.sortObjects=true,this.clippingPlanes=[],this.localClippingEnabled=false,this.toneMapping=an,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let D=this,F=false,L=null,G=null,P=null,A=null;this._outputColorSpace=Yt;let k=0,U=0,j=null,W=-1,K=null,ee=new xt,ye=new xt,Ne=null,Z=new ne(0),oe=0,te=t.width,Te=t.height,me=1,Le=null,ot=null,Ae=new xt(0,0,te,Te),Ve=new xt(0,0,te,Te),We=false,Be=new ci,yt=new Pr,dt=false,Mt=false,tt=new lt,Ft=new B,pt=new xt,Et={background:null,fog:null,environment:null,overrideMaterial:null,isScene:true},Ut=false;function Tt(){return j===null?me:1}let N=n;function wt(x,I){return t.getContext(x,I)}let st,Ge,ae,mt,Ce,De,E,v,H,ie,Q,le,fe,Y,J,he,R,$,q,ue,re,ce,we;try{let x={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"187"}`),t.addEventListener("webglcontextlost",Re,!1),t.addEventListener("webglcontextrestored",ze,!1),t.addEventListener("webglcontextcreationerror",ge,!1),N===null){let I="webgl2";if(N=wt(I,x),N===null)throw wt(I)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}ke();}catch(x){throw t.removeEventListener("webglcontextlost",Re,false),t.removeEventListener("webglcontextrestored",ze,false),t.removeEventListener("webglcontextcreationerror",ge,false),Fe("WebGLRenderer: "+x.message),x}function ke(){st=new Vp(N),st.init(),re=new Tg(N,st),Ge=new Lp(N,st,e,re),ae=new bg(N,st),Ge.reversedDepthBuffer&&h&&ae.buffers.depth.setReversed(true),G=N.createFramebuffer(),P=N.createFramebuffer(),A=N.createFramebuffer(),mt=new qp(N),Ce=new cg,De=new Eg(N,st,ae,Ce,Ge,re,mt),E=new Gp(D),v=new Yu(N),ce=new Pp(N,v),H=new Wp(N,v,mt,ce),ie=new Zp(N,H,v,ce,mt),$=new Yp(N,Ge,De),J=new Dp(Ce),Q=new lg(D,E,st,Ge,ce,J),le=new Rg(D,Ce),fe=new ug,Y=new _g(st),R=new Rp(D,E,ae,ie,m,c),he=new Sg(D,ie,Ge),we=new Pg(N,mt,Ge,ae),q=new Ip(N,st,mt),ue=new Xp(N,st,mt),mt.programs=Q.programs,D.capabilities=Ge,D.extensions=st,D.properties=Ce,D.renderLists=fe,D.shadowMap=he,D.state=ae,D.info=mt;}y!==nn&&(O=new $p(y,t.width,t.height,a,s,r));let se=new _l(D,N);this.xr=se,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){let x=st.get("WEBGL_lose_context");x&&x.loseContext();},this.forceContextRestore=function(){let x=st.get("WEBGL_lose_context");x&&x.restoreContext();},this.getPixelRatio=function(){return me},this.setPixelRatio=function(x){x!==void 0&&(me=x,this.setSize(te,Te,false));},this.getSize=function(x){return x.set(te,Te)},this.setSize=function(x,I,X=true){if(se.isPresenting){Ie("WebGLRenderer: Can't change size while VR device is presenting.");return}te=x,Te=I,t.width=Math.floor(x*me),t.height=Math.floor(I*me),X===true&&(t.style.width=x+"px",t.style.height=I+"px"),O!==null&&O.setSize(t.width,t.height),this.setViewport(0,0,x,I);},this.getDrawingBufferSize=function(x){return x.set(te*me,Te*me).floor()},this.setDrawingBufferSize=function(x,I,X){te=x,Te=I,me=X,t.width=Math.floor(x*X),t.height=Math.floor(I*X),this.setViewport(0,0,x,I);},this.setEffects=function(x){if(y===nn){Fe("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(x){for(let I=0;I<x.length;I++)if(x[I].isOutputPass===true){Ie("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}O.setEffects(x||[]);},this.getCurrentViewport=function(x){return x.copy(ee)},this.getViewport=function(x){return x.copy(Ae)},this.setViewport=function(x,I,X,z){x.isVector4?Ae.set(x.x,x.y,x.z,x.w):Ae.set(x,I,X,z),ae.viewport(ee.copy(Ae).multiplyScalar(Tt()).round());},this.getScissor=function(x){return x.copy(Ve)},this.setScissor=function(x,I,X,z){x.isVector4?Ve.set(x.x,x.y,x.z,x.w):Ve.set(x,I,X,z),ae.scissor(ye.copy(Ve).multiplyScalar(Tt()).round());},this.getScissorTest=function(){return We},this.setScissorTest=function(x){ae.setScissorTest(We=x);},this.setOpaqueSort=function(x){Le=x;},this.setTransparentSort=function(x){ot=x;},this.getClearColor=function(x){return x.copy(R.getClearColor())},this.setClearColor=function(){R.setClearColor(...arguments);},this.getClearAlpha=function(){return R.getClearAlpha()},this.setClearAlpha=function(){R.setClearAlpha(...arguments);},this.clear=function(x=true,I=true,X=true){let z=0;if(x){let V=false;if(j!==null){let pe=j.texture.format;V=p.has(pe);}if(V){let pe=j.texture.type,Me=d.has(pe),de=R.getClearColor(),ve=R.getClearAlpha(),Ee=de.r,Oe=de.g,Xe=de.b;Me?(S[0]=Ee,S[1]=Oe,S[2]=Xe,S[3]=ve,N.clearBufferuiv(N.COLOR,0,S)):(C[0]=Ee,C[1]=Oe,C[2]=Xe,C[3]=ve,N.clearBufferiv(N.COLOR,0,C));}else z|=N.COLOR_BUFFER_BIT;}I&&(z|=N.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(true)),X&&(z|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),z!==0&&N.clear(z);},this.clearColor=function(){this.clear(true,false,false);},this.clearDepth=function(){this.clear(false,true,false);},this.clearStencil=function(){this.clear(false,false,true);},this.setNodesHandler=function(x){x.setRenderer(this),L=x;},this.dispose=function(){t.removeEventListener("webglcontextlost",Re,false),t.removeEventListener("webglcontextrestored",ze,false),t.removeEventListener("webglcontextcreationerror",ge,false),R.dispose(),fe.dispose(),Y.dispose(),De.dispose(),Ce.dispose(),E.dispose(),ie.dispose(),H.dispose(),ce.dispose(),we.dispose(),Q.dispose(),se.dispose(),se.removeEventListener("sessionstart",Ml),se.removeEventListener("sessionend",Sl),ni.stop();};function Re(x){x.preventDefault(),Ka("WebGLRenderer: Context Lost."),F=true;}function ze(){Ka("WebGLRenderer: Context Restored."),F=false;let x=mt.autoReset,I=he.enabled,X=he.autoUpdate,z=he.needsUpdate,V=he.type;ke(),mt.autoReset=x,he.enabled=I,he.autoUpdate=X,he.needsUpdate=z,he.type=V;}function ge(x){Fe("WebGLRenderer: A WebGL context could not be created. Reason: ",x.statusMessage);}function nt(x){let I=x.target;I.removeEventListener("dispose",nt),Pt(I);}function Pt(x){Hn(x),Ce.remove(x);}function Hn(x){let I=Ce.get(x).programs;I!==void 0&&(I.forEach(function(X){Q.releaseProgram(X);}),x.isShaderMaterial&&Q.releaseShaderCache(x));}this.renderBufferDirect=function(x,I,X,z,V,pe){I===null&&(I=Et);let Me=V.isMesh&&V.matrixWorld.determinantAffine()<0,de=tu(x,I,X,z,V);ae.setMaterial(z,Me);let ve=X.index,Ee=1;if(z.wireframe===true){if(ve=H.getWireframeAttribute(X),ve===void 0)return;Ee=2;}let Oe=X.drawRange,Xe=X.attributes.position,Se=Oe.start*Ee,qe=(Oe.start+Oe.count)*Ee;pe!==null&&(Se=Math.max(Se,pe.start*Ee),qe=Math.min(qe,(pe.start+pe.count)*Ee)),ve!==null?(Se=Math.max(Se,0),qe=Math.min(qe,ve.count)):Xe!=null&&(Se=Math.max(Se,0),qe=Math.min(qe,Xe.count));let St=qe-Se;if(St<0||St===1/0)return;ce.setup(V,z,de,X,ve);let ht,at=q;if(ve!==null&&(ht=v.get(ve),at=ue,at.setIndex(ht)),V.isMesh)z.wireframe===true?(ae.setLineWidth(z.wireframeLinewidth*Tt()),at.setMode(N.LINES)):at.setMode(N.TRIANGLES);else if(V.isLine){let kt=z.linewidth;kt===void 0&&(kt=1),ae.setLineWidth(kt*Tt()),V.isLineSegments?at.setMode(N.LINES):V.isLineLoop?at.setMode(N.LINE_LOOP):at.setMode(N.LINE_STRIP);}else V.isPoints?at.setMode(N.POINTS):V.isSprite&&at.setMode(N.TRIANGLES);if(V.isBatchedMesh)if(st.get("WEBGL_multi_draw"))at.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else {let kt=V._multiDrawStarts,be=V._multiDrawCounts,qt=V._multiDrawCount,$e=ve?v.get(ve).bytesPerElement:1,ii=Ce.get(z).currentProgram.getUniforms();for(let Ht=0;Ht<qt;Ht++)ii.setValue(N,"_gl_DrawID",Ht),at.render(kt[Ht]/$e,be[Ht]);}else if(V.isInstancedMesh)at.renderInstances(Se,St,V.count);else if(X.isInstancedBufferGeometry){let kt=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,be=Math.min(X.instanceCount,kt);at.renderInstances(Se,St,be);}else at.render(Se,St);};function yl(x,I,X,z){L!==null&&x.isNodeMaterial&&L.setObject(z,x),dt===true&&J.setState(x,X,false),x.transparent===true&&x.side===Kt&&x.forceSinglePass===false?(x.side=At,x.needsUpdate=true,Ki(x,I,z),x.side=ei,x.needsUpdate=true,Ki(x,I,z),x.side=Kt):Ki(x,I,z);}this.compile=function(x,I,X=null){X===null&&(X=x),L!==null&&L.renderStart(x,I,X),w=Y.get(X),w.init(I),M.push(w),X.traverseVisible(function(V){V.isLight&&V.layers.test(I.layers)&&(w.pushLight(V),V.castShadow&&w.pushShadow(V));}),x!==X&&x.traverseVisible(function(V){V.isLight&&V.layers.test(I.layers)&&(w.pushLight(V),V.castShadow&&w.pushShadow(V));}),w.setupLights(),L!==null&&L.updateLights(w.state.lightsArray),Mt=this.localClippingEnabled,dt=J.init(this.clippingPlanes,Mt),dt===true&&J.setGlobalState(this.clippingPlanes,I),L!==null&&he.render(w.state.shadowsArray,X,I);let z=new Set;return x.traverse(function(V){if(!(V.isMesh||V.isPoints||V.isLine||V.isSprite))return;let pe=V.material;if(pe)if(Array.isArray(pe))for(let Me=0;Me<pe.length;Me++){let de=pe[Me];yl(de,X,I,V),z.add(de);}else yl(pe,X,I,V),z.add(pe);}),w=M.pop(),L!==null&&L.renderEnd(),z},this.compileAsync=function(x,I,X=null){let z=this.compile(x,I,X);return new Promise(V=>{function pe(){if(z.forEach(function(Me){let ve=Ce.get(Me).currentProgram;(ve===void 0||ve.isReady())&&z.delete(Me);}),z.size===0){V(x);return}setTimeout(pe,10);}st.get("KHR_parallel_shader_compile")!==null?pe():setTimeout(pe,10);})};let Xo=null;function jh(x){Xo&&Xo(x);}function Ml(){ni.stop();}function Sl(){ni.start();}let ni=new Sh;ni.setAnimationLoop(jh),typeof self<"u"&&ni.setContext(self),this.setAnimationLoop=function(x){Xo=x,se.setAnimationLoop(x),x===null?ni.stop():ni.start();},se.addEventListener("sessionstart",Ml),se.addEventListener("sessionend",Sl),this.render=function(x,I){if(I!==void 0&&I.isCamera!==true){Fe("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(F===true)return;L!==null&&L.renderStart(x,I);let X=se.enabled===true&&se.isPresenting===true,z=O!==null&&(j===null||X)&&O.begin(D,j);if(x.matrixWorldAutoUpdate===true&&x.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===true&&I.updateMatrixWorld(),se.enabled===true&&se.isPresenting===true&&(O===null||O.isCompositing()===false)&&(se.cameraAutoUpdate===true&&se.updateCamera(I),I=se.getCamera()),x.isScene===true&&x.onBeforeRender(D,x,I,j),w=Y.get(x,M.length),w.init(I),w.state.textureUnits=De.getTextureUnits(),M.push(w),tt.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),I.isArrayCamera?yt.setFromArrayCamera(I):Be.setFromProjectionMatrix(tt,rn,I.reversedDepth),Mt=this.localClippingEnabled,dt=J.init(this.clippingPlanes,Mt),b=fe.get(x,_.length),b.init(),_.push(b),this.info.render.frame++,se.enabled===true&&se.isPresenting===true){let Me=D.xr.getDepthSensingMesh();Me!==null&&qo(Me,I,-1/0,D.sortObjects);}qo(x,I,0,D.sortObjects),b.finish(),L!==null&&L.updateLights(w.state.lightsArray),D.sortObjects===true&&b.sort(Le,ot),Ut=se.enabled===false||se.isPresenting===false||se.hasDepthSensing()===false,Ut&&R.addToRenderList(b,x),this.info.autoReset===true&&this.info.reset(),dt===true&&J.beginShadows();let V=w.state.shadowsArray;if(he.render(V,x,I),dt===true&&J.endShadows(),(z&&O.hasRenderPass())===false){let Me=b.opaque,de=b.transmissive;if(w.setupLights(),I.isArrayCamera){let ve=I.cameras;if(de.length>0)for(let Ee=0,Oe=ve.length;Ee<Oe;Ee++){let Xe=ve[Ee];El(Me,de,x,Xe);}Ut&&R.render(x);for(let Ee=0,Oe=ve.length;Ee<Oe;Ee++){let Xe=ve[Ee];bl(b,x,Xe,Xe.viewport);}}else de.length>0&&El(Me,de,x,I),Ut&&R.render(x),bl(b,x,I);}j!==null&&U===0&&(De.updateMultisampleRenderTarget(j),De.updateRenderTargetMipmap(j)),z&&O.end(D),x.isScene===true&&x.onAfterRender(D,x,I),ce.resetDefaultState(),W=-1,K=null,M.pop(),M.length>0?(w=M[M.length-1],De.setTextureUnits(w.state.textureUnits),dt===true&&J.setGlobalState(D.clippingPlanes,w.state.camera)):w=null,_.pop(),_.length>0?b=_[_.length-1]:b=null,L!==null&&L.renderEnd();};function qo(x,I,X,z){if(x.visible===false)return;if(x.layers.test(I.layers)){if(x.isGroup)X=x.renderOrder;else if(x.isLOD)x.autoUpdate===true&&x.update(I);else if(x.isLight)w.pushLight(x),x.castShadow&&w.pushShadow(x);else if(x.isSprite){let Me=I.isArrayCamera?yt:Be;if(!x.frustumCulled||x.intersectsFrustum(Me)){z&&pt.setFromMatrixPosition(x.matrixWorld).applyMatrix4(tt);let de=ie.update(x),ve=x.material;ve.visible&&b.push(x,de,ve,X,pt.z,null,I);}}else if(x.isMesh||x.isLine||x.isPoints){let Me=I.isArrayCamera?yt:Be;if(!x.frustumCulled||x.intersectsFrustum(Me)){let de=ie.update(x),ve=x.material;if(z&&(x.boundingSphere!==void 0?(x.boundingSphere===null&&x.computeBoundingSphere(),pt.copy(x.boundingSphere.center)):(de.boundingSphere===null&&de.computeBoundingSphere(),pt.copy(de.boundingSphere.center)),pt.applyMatrix4(x.matrixWorld).applyMatrix4(tt)),Array.isArray(ve)){let Ee=de.groups;for(let Oe=0,Xe=Ee.length;Oe<Xe;Oe++){let Se=Ee[Oe],qe=ve[Se.materialIndex];qe&&qe.visible&&b.push(x,de,qe,X,pt.z,Se,I);}}else ve.visible&&b.push(x,de,ve,X,pt.z,null,I);}}}let pe=x.children;for(let Me=0,de=pe.length;Me<de;Me++)qo(pe[Me],I,X,z);}function bl(x,I,X,z){let{opaque:V,transmissive:pe,transparent:Me}=x;w.setupLightsView(X),dt===true&&J.setGlobalState(D.clippingPlanes,X),z&&ae.viewport(ee.copy(z)),V.length>0&&Bs(V,I,X),pe.length>0&&Bs(pe,I,X),Me.length>0&&Bs(Me,I,X),ae.buffers.depth.setTest(true),ae.buffers.depth.setMask(true),ae.buffers.color.setMask(true),ae.setPolygonOffset(false);}function El(x,I,X,z){if((X.isScene===true?X.overrideMaterial:null)!==null)return;if(w.state.transmissionRenderTarget[z.id]===void 0){let Se=st.has("EXT_color_buffer_half_float")||st.has("EXT_color_buffer_float");w.state.transmissionRenderTarget[z.id]=new en(1,1,{generateMipmaps:true,type:Se?vn:nn,minFilter:Bn,samples:Math.max(4,Ge.samples),stencilBuffer:r,resolveDepthBuffer:false,resolveStencilBuffer:false,storeMultisampledDepthBuffer:false,storeMultisampledStencilBuffer:false,colorSpace:Ye.workingColorSpace});}let pe=w.state.transmissionRenderTarget[z.id],Me=z.viewport||ee;pe.setSize(Me.z*D.transmissionResolutionScale,Me.w*D.transmissionResolutionScale);let de=D.getRenderTarget(),ve=D.getActiveCubeFace(),Ee=D.getActiveMipmapLevel();D.setRenderTarget(pe),D.getClearColor(Z),oe=D.getClearAlpha(),oe<1&&D.setClearColor(16777215,.5),D.clear(),Ut&&R.render(X);let Oe=D.toneMapping;D.toneMapping=an;let Xe=z.viewport;if(z.viewport!==void 0&&(z.viewport=void 0),w.setupLightsView(z),dt===true&&J.setGlobalState(D.clippingPlanes,z),Bs(x,X,z),De.updateMultisampleRenderTarget(pe),De.updateRenderTargetMipmap(pe),st.has("WEBGL_multisampled_render_to_texture")===false){let Se=false;for(let qe=0,St=I.length;qe<St;qe++){let ht=I[qe],{object:at,geometry:kt,material:be,group:qt}=ht;if(be.side===Kt&&at.layers.test(z.layers)){let $e=be.side;be.side=At,be.needsUpdate=true,Tl(at,X,z,kt,be,qt),be.side=$e,be.needsUpdate=true,Se=true;}}Se===true&&(De.updateMultisampleRenderTarget(pe),De.updateRenderTargetMipmap(pe));}D.setRenderTarget(de,ve,Ee),D.setClearColor(Z,oe),Xe!==void 0&&(z.viewport=Xe),D.toneMapping=Oe;}function Bs(x,I,X){let z=I.isScene===true?I.overrideMaterial:null;for(let V=0,pe=x.length;V<pe;V++){let Me=x[V],{object:de,geometry:ve,group:Ee}=Me,Oe=Me.material;Oe.allowOverride===true&&z!==null&&(Oe=z),de.layers.test(X.layers)&&Tl(de,I,X,ve,Oe,Ee);}}function Tl(x,I,X,z,V,pe){L!==null&&V.isNodeMaterial&&L.setObject(x,V),x.onBeforeRender(D,I,X,z,V,pe),x.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,x.matrixWorld),x.normalMatrix.getNormalMatrix(x.modelViewMatrix),V.onBeforeRender(D,I,X,z,x,pe),V.transparent===true&&V.side===Kt&&V.forceSinglePass===false?(V.side=At,V.needsUpdate=true,D.renderBufferDirect(X,I,z,V,x,pe),V.side=ei,V.needsUpdate=true,D.renderBufferDirect(X,I,z,V,x,pe),V.side=Kt):D.renderBufferDirect(X,I,z,V,x,pe),x.onAfterRender(D,I,X,z,V,pe);}function wl(x){let I=0;for(let X of x)X.texture!==null&&I++;return I}function Ki(x,I,X){I.isScene!==true&&(I=Et);let z=Ce.get(x),V=w.state.lights,pe=w.state.shadowsArray,Me=V.state.version,de=Q.getParameters(x,V.state,pe,I,X,w.state.lightProbeGridArray),ve=Q.getProgramCacheKey(de),Ee=z.programs;z.environment=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?I.environment:null,z.fog=I.fog;let Oe=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap;z.envMap=E.get(x.envMap||z.environment,Oe),z.envMapRotation=z.environment!==null&&x.envMap===null?I.environmentRotation:x.envMapRotation,Ee===void 0&&(x.addEventListener("dispose",nt),Ee=new Map,z.programs=Ee,z.programVariants=new Map);let Xe=Ee.get(ve);if(Xe!==void 0){if(z.currentProgram===Xe&&z.lightsStateVersion===Me)return Cl(x,de),Xe}else de.uniforms=Q.getUniforms(x),L!==null&&x.isNodeMaterial&&L.build(x,X,de),x.onBeforeCompile(de,D),Xe=Q.acquireProgram(de,ve),Ee.set(ve,Xe),z.uniforms=de.uniforms;let Se=z.uniforms;return (!x.isShaderMaterial&&!x.isRawShaderMaterial||x.clipping===true)&&(Se.clippingPlanes=J.uniform),Cl(x,de),z.needsLights=iu(x),z.lightsStateVersion=Me,z.needsLights&&(Se.ambientLightColor.value=V.state.ambient,Se.lightProbe.value=V.state.probe,Se.sunLights.value=V.state.sun,Se.sunLightShadows.value=V.state.sunShadow,Se.directionalLights.value=V.state.directional,Se.directionalLightShadows.value=V.state.directionalShadow,Se.spotLights.value=V.state.spot,Se.spotLightShadows.value=V.state.spotShadow,Se.rectAreaLights.value=V.state.rectArea,Se.ltc_1.value=V.state.rectAreaLTC1,Se.ltc_2.value=V.state.rectAreaLTC2,Se.pointLights.value=V.state.point,Se.pointLightShadows.value=V.state.pointShadow,Se.hemisphereLights.value=V.state.hemi,Se.sunShadowMatrix.value=V.state.sunShadowMatrix,Se.sunShadowCascade.value=V.state.sunShadowCascade,Se.directionalShadowMatrix.value=V.state.directionalShadowMatrix,Se.spotLightMatrix.value=V.state.spotLightMatrix,Se.spotLightMap.value=V.state.spotLightMap,Se.pointShadowMatrix.value=V.state.pointShadowMatrix),z.numLightProbeGrids=wl(w.state.lightProbeGridArray),z.currentProgram=Xe,z.uniformsList=null,Xe}function eu(x,I,X,z,V){let pe=Ce.get(x),Me=pe.currentProgram.id+","+z+","+V,de=pe.programVariants.get(Me);return de===void 0?(de=Ki(x,I,X),pe.programVariants.set(Me,de)):(pe.currentProgram=de,pe.uniformsList=null,pe.outputColorSpace=z,pe.toneMapping=V),de}function Al(x){if(x.uniformsList===null){let I=x.currentProgram.getUniforms();x.uniformsList=Yi.seqWithValue(I.seq,x.uniforms);}return x.uniformsList}function Cl(x,I){let X=Ce.get(x);X.outputColorSpace=I.outputColorSpace,X.batching=I.batching,X.batchingColor=I.batchingColor,X.instancing=I.instancing,X.instancingColor=I.instancingColor,X.instancingMorph=I.instancingMorph,X.skinning=I.skinning,X.morphTargets=I.morphTargets,X.morphNormals=I.morphNormals,X.morphColors=I.morphColors,X.morphTargetsCount=I.morphTargetsCount,X.numClippingPlanes=I.numClippingPlanes,X.numIntersection=I.numClipIntersection,X.vertexAlphas=I.vertexAlphas,X.vertexTangents=I.vertexTangents,X.toneMapping=I.toneMapping;}function tu(x,I,X,z,V){I.isScene!==true&&(I=Et),De.resetTextureUnits();let pe=I.fog,Me=z.isMeshStandardMaterial||z.isMeshLambertMaterial||z.isMeshPhongMaterial?I.environment:null,de=j===null?D.outputColorSpace:j.isXRRenderTarget===true?j.texture.colorSpace:Ye.workingColorSpace,ve=z.isMeshStandardMaterial||z.isMeshLambertMaterial&&!z.envMap||z.isMeshPhongMaterial&&!z.envMap,Ee=E.get(z.envMap||Me,ve),Oe=z.vertexColors===true&&!!X.attributes.color&&X.attributes.color.itemSize===4,Xe=!!X.attributes.tangent&&(!!z.normalMap||z.anisotropy>0),Se=!!X.morphAttributes.position,qe=!!X.morphAttributes.normal,St=!!X.morphAttributes.color,ht=an;z.toneMapped&&(j===null||j.isXRRenderTarget===true)&&(ht=D.toneMapping);let at=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,kt=at!==void 0?at.length:0,be=Ce.get(z),qt=w.state.lights;if(dt===true&&(Mt===true||x!==K)){let _t=x===K&&z.id===W;J.setState(z,x,_t);}let $e=false,ii=false;z.version===be.__version?be.needsLights&&be.lightsStateVersion!==qt.state.version||V.isBatchedMesh&&be.batching===false||!V.isBatchedMesh&&be.batching===true||V.isBatchedMesh&&be.batchingColor===true&&V._colorsTexture===null||V.isBatchedMesh&&be.batchingColor===false&&V._colorsTexture!==null||V.isInstancedMesh&&be.instancing===false||!V.isInstancedMesh&&be.instancing===true||V.isSkinnedMesh&&be.skinning===false||!V.isSkinnedMesh&&be.skinning===true||V.isInstancedMesh&&be.instancingColor===true&&V.instanceColor===null||V.isInstancedMesh&&be.instancingColor===false&&V.instanceColor!==null||V.isInstancedMesh&&be.instancingMorph===true&&V.morphTexture===null||V.isInstancedMesh&&be.instancingMorph===false&&V.morphTexture!==null||be.envMap!==Ee||z.fog===true&&be.fog!==pe||be.numClippingPlanes!==void 0&&(be.numClippingPlanes!==J.numPlanes||be.numIntersection!==J.numIntersection)||be.vertexAlphas!==Oe||be.vertexTangents!==Xe||be.morphTargets!==Se||be.morphNormals!==qe||be.morphColors!==St||be.morphTargetsCount!==kt||be.numLightProbeGrids!==wl(w.state.lightProbeGridArray)?$e=true:(be.outputColorSpace!==de||be.toneMapping!==ht)&&(ii=true):($e=true,be.__version=z.version);let Ht=be.currentProgram;($e===true||ii===true)&&(Ht=ii===true?eu(z,I,V,de,ht):Ki(z,I,V),L&&z.isNodeMaterial&&L.onUpdateProgram(z,Ht,be));let zs=false,Gn=false,si=false,Je=Ht.getUniforms(),Ot=be.uniforms;if(ae.useProgram(Ht.program)&&(zs=true,Gn=true,si=true),z.id!==W&&(W=z.id,Gn=true),zs||K!==x){ae.buffers.depth.getReversed()&&x.reversedDepth!==true&&(x._reversedDepth=true,x.updateProjectionMatrix()),Je.setValue(N,"projectionMatrix",x.projectionMatrix),Je.setValue(N,"viewMatrix",x.matrixWorldInverse);let It=Je.map.cameraPosition;It!==void 0&&It.setValue(N,Ft.setFromMatrixPosition(x.matrixWorld)),Ge.logarithmicDepthBuffer&&Je.setValue(N,"logDepthBufFC",2/(Math.log(x.far+1)/Math.LN2)),(z.isMeshPhongMaterial||z.isMeshToonMaterial||z.isMeshLambertMaterial||z.isMeshBasicMaterial||z.isMeshStandardMaterial||z.isShaderMaterial)&&Je.setValue(N,"isOrthographic",x.isOrthographicCamera===true),K!==x&&(K=x,Gn=true,si=true);}if(be.needsLights&&(qt.state.sunShadowMap.length>0&&Je.setValue(N,"sunShadowMap",qt.state.sunShadowMap,De),qt.state.directionalShadowMap.length>0&&Je.setValue(N,"directionalShadowMap",qt.state.directionalShadowMap,De),qt.state.spotShadowMap.length>0&&Je.setValue(N,"spotShadowMap",qt.state.spotShadowMap,De),qt.state.pointShadowMap.length>0&&Je.setValue(N,"pointShadowMap",qt.state.pointShadowMap,De)),V.isSkinnedMesh){Je.setOptional(N,V,"bindMatrix"),Je.setOptional(N,V,"bindMatrixInverse");let _t=V.skeleton;_t&&(_t.boneTexture===null&&_t.computeBoneTexture(),Je.setValue(N,"boneTexture",_t.boneTexture,De));}V.isBatchedMesh&&(Je.setOptional(N,V,"batchingTexture"),Je.setValue(N,"batchingTexture",V._matricesTexture,De),Je.setOptional(N,V,"batchingIdTexture"),Je.setValue(N,"batchingIdTexture",V._indirectTexture,De),Je.setOptional(N,V,"batchingColorTexture"),V._colorsTexture!==null&&Je.setValue(N,"batchingColorTexture",V._colorsTexture,De));let hn=X.morphAttributes;if((hn.position!==void 0||hn.normal!==void 0||hn.color!==void 0)&&$.update(V,X,Ht),(Gn||be.receiveShadow!==V.receiveShadow)&&(be.receiveShadow=V.receiveShadow,Je.setValue(N,"receiveShadow",V.receiveShadow)),(z.isMeshStandardMaterial||z.isMeshLambertMaterial||z.isMeshPhongMaterial)&&z.envMap===null&&I.environment!==null&&(Ot.envMapIntensity.value=I.environmentIntensity),Ot.dfgLUT!==void 0&&(Ot.dfgLUT.value=Lg()),Gn){if(Je.setValue(N,"toneMappingExposure",D.toneMappingExposure),be.needsLights&&nu(Ot,si),pe&&z.fog===true&&le.refreshFogUniforms(Ot,pe),le.refreshMaterialUniforms(Ot,z,me,Te,w.state.transmissionRenderTarget[x.id]),be.needsLights&&be.numLightProbeGrids>0){let _t=T,It=0;for(let Cn of w.state.lightProbeGridArray)Cn.texture!==null&&(_t.textures[It]=Cn.texture,_t.min[It]=Cn.boundingBox.min,_t.max[It]=Cn.boundingBox.max,_t.resolution[It]=Cn.resolution,It++);for(let Cn in _t)_t[Cn].length=It;Ot.probesSH.value=_t.textures,Ot.probesMin.value=_t.min,Ot.probesMax.value=_t.max,Ot.probesResolution.value=_t.resolution;}Yi.upload(N,Al(be),Ot,De);}if(z.isShaderMaterial&&z.uniformsNeedUpdate===true&&(Yi.upload(N,Al(be),Ot,De),z.uniformsNeedUpdate=false),z.isSpriteMaterial&&Je.setValue(N,"center",V.center),Je.setValue(N,"modelViewMatrix",V.modelViewMatrix),Je.setValue(N,"normalMatrix",V.normalMatrix),Je.setValue(N,"modelMatrix",V.matrixWorld),z.uniformsGroups!==void 0){let _t=z.uniformsGroups;for(let It=0,Cn=_t.length;It<Cn;It++){let Pl=_t[It];we.update(Pl,Ht),we.bind(Pl,Ht);}}return Ht}function nu(x,I){x.ambientLightColor.needsUpdate=I,x.lightProbe.needsUpdate=I,x.sunLights.needsUpdate=I,x.sunLightShadows.needsUpdate=I,x.directionalLights.needsUpdate=I,x.directionalLightShadows.needsUpdate=I,x.pointLights.needsUpdate=I,x.pointLightShadows.needsUpdate=I,x.spotLights.needsUpdate=I,x.spotLightShadows.needsUpdate=I,x.rectAreaLights.needsUpdate=I,x.hemisphereLights.needsUpdate=I;}function iu(x){return x.isMeshLambertMaterial||x.isMeshToonMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isShadowMaterial||x.isShaderMaterial&&x.lights===true}this.getActiveCubeFace=function(){return k},this.getActiveMipmapLevel=function(){return U},this.getRenderTarget=function(){return j},this.setRenderTargetTextures=function(x,I,X){let z=Ce.get(x);z.__autoAllocateDepthBuffer=x.resolveDepthBuffer===false,z.__autoAllocateDepthBuffer===false&&(z.__useRenderToTexture=false),Ce.get(x.texture).__webglTexture=I,Ce.get(x.depthTexture).__webglTexture=z.__autoAllocateDepthBuffer?void 0:X,z.__hasExternalTextures=true;},this.setRenderTargetFramebuffer=function(x,I){let X=Ce.get(x);X.__webglFramebuffer=I,X.__useDefaultFramebuffer=I===void 0;},this.setRenderTarget=function(x,I=0,X=0){j=x,k=I,U=X;let z=null,V=false,pe=false;if(x){let de=Ce.get(x);if(de.__useDefaultFramebuffer!==void 0){ae.bindFramebuffer(N.FRAMEBUFFER,de.__webglFramebuffer),ee.copy(x.viewport),ye.copy(x.scissor),Ne=x.scissorTest,ae.viewport(ee),ae.scissor(ye),ae.setScissorTest(Ne),W=-1;return}else if(de.__webglFramebuffer===void 0)De.setupRenderTarget(x);else if(de.__hasExternalTextures)De.rebindTextures(x,Ce.get(x.texture).__webglTexture,Ce.get(x.depthTexture).__webglTexture);else if(x.depthBuffer){let Oe=x.depthTexture;if(de.__boundDepthTexture!==Oe){if(Oe!==null&&Ce.has(Oe)&&(x.width!==Oe.image.width||x.height!==Oe.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");De.setupDepthRenderbuffer(x);}}let ve=x.texture;(ve.isData3DTexture||ve.isDataArrayTexture||ve.isCompressedArrayTexture)&&(pe=true);let Ee=Ce.get(x).__webglFramebuffer;x.isWebGLCubeRenderTarget?(Array.isArray(Ee[I])?z=Ee[I][X]:z=Ee[I],V=true):x.samples>0&&De.useMultisampledRTT(x)===false?z=Ce.get(x).__webglMultisampledFramebuffer:Array.isArray(Ee)?z=Ee[X]:z=Ee,ee.copy(x.viewport),ye.copy(x.scissor),Ne=x.scissorTest;}else ee.copy(Ae).multiplyScalar(me).floor(),ye.copy(Ve).multiplyScalar(me).floor(),Ne=We;if(X!==0&&(z=G),ae.bindFramebuffer(N.FRAMEBUFFER,z)&&ae.drawBuffers(x,z),ae.viewport(ee),ae.scissor(ye),ae.setScissorTest(Ne),V){let de=Ce.get(x.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+I,de.__webglTexture,X);}else if(pe){let de=I;for(let ve=0;ve<x.textures.length;ve++){let Ee=Ce.get(x.textures[ve]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+ve,Ee.__webglTexture,X,de);}}else if(x!==null&&X!==0){let de=Ce.get(x.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,de.__webglTexture,X);}W=-1;};function Rl(x){let I=Ce.get(x);return (I.__readFormat!==x.format||I.__readType!==x.type)&&(I.__readFormat=x.format,I.__readType=x.type,I.__formatReadable=Ge.textureFormatReadable(x.format),I.__typeReadable=Ge.textureTypeReadable(x.type)),I}this.readRenderTargetPixels=function(x,I,X,z,V,pe,Me,de=0){if(!(x&&x.isWebGLRenderTarget)){Fe("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ve=Ce.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&Me!==void 0&&(ve=ve[Me],Array.isArray(ve)&&(ve=ve[0])),ve){ae.bindFramebuffer(N.FRAMEBUFFER,ve);try{let Ee=x.textures[de],Oe=Ee.format,Xe=Ee.type;x.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+de);let Se=Rl(Ee);if(Se.__formatReadable===!1){Fe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Se.__typeReadable===!1){Fe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=x.width-z&&X>=0&&X<=x.height-V&&N.readPixels(I,X,z,V,re.convert(Oe),re.convert(Xe),pe);}finally{let Ee=j!==null?Ce.get(j).__webglFramebuffer:null;ae.bindFramebuffer(N.FRAMEBUFFER,Ee);}}},this.readRenderTargetPixelsAsync=async function(x,I,X,z,V,pe,Me,de=0){if(!(x&&x.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ve=Ce.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&Me!==void 0&&(ve=ve[Me],Array.isArray(ve)&&(ve=ve[0])),ve)if(I>=0&&I<=x.width-z&&X>=0&&X<=x.height-V){ae.bindFramebuffer(N.FRAMEBUFFER,ve);let Ee=x.textures[de],Oe=Ee.format,Xe=Ee.type;x.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+de);let Se=Rl(Ee);if(Se.__formatReadable===false)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Se.__typeReadable===false)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let qe=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,qe),N.bufferData(N.PIXEL_PACK_BUFFER,pe.byteLength,N.STREAM_READ),N.readPixels(I,X,z,V,re.convert(Oe),re.convert(Xe),0),N.bindBuffer(N.PIXEL_PACK_BUFFER,null);let St=j!==null?Ce.get(j).__webglFramebuffer:null;ae.bindFramebuffer(N.FRAMEBUFFER,St);let ht=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await Zc(N,ht,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,qe),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,pe),N.bindBuffer(N.PIXEL_PACK_BUFFER,null),N.deleteBuffer(qe),N.deleteSync(ht),pe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(x,I=null,X=0){let z=Math.pow(2,-X),V=Math.floor(x.image.width*z),pe=Math.floor(x.image.height*z),Me=I!==null?I.x:0,de=I!==null?I.y:0;De.setTexture2D(x,0),N.copyTexSubImage2D(N.TEXTURE_2D,X,0,0,Me,de,V,pe),ae.unbindTexture();},this.copyTextureToTexture=function(x,I,X=null,z=null,V=0,pe=0){let Me,de,ve,Ee,Oe,Xe,Se,qe,St,ht=x.isCompressedTexture?x.mipmaps[pe]:x.image;if(X!==null)Me=X.max.x-X.min.x,de=X.max.y-X.min.y,ve=X.isBox3?X.max.z-X.min.z:1,Ee=X.min.x,Oe=X.min.y,Xe=X.isBox3?X.min.z:0;else {let Je=Math.pow(2,-V);Me=Math.floor(ht.width*Je),de=Math.floor(ht.height*Je),x.isDataArrayTexture?ve=ht.depth:x.isData3DTexture?ve=Math.floor(ht.depth*Je):ve=1,Ee=0,Oe=0,Xe=0;}z!==null?(Se=z.x,qe=z.y,St=z.z):(Se=0,qe=0,St=0);let at=re.convert(I.format),kt=re.convert(I.type),be;I.isData3DTexture?(De.setTexture3D(I,0),be=N.TEXTURE_3D):I.isDataArrayTexture||I.isCompressedArrayTexture?(De.setTexture2DArray(I,0),be=N.TEXTURE_2D_ARRAY):(De.setTexture2D(I,0),be=N.TEXTURE_2D),ae.activeTexture(N.TEXTURE0),ae.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,I.flipY),ae.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),ae.pixelStorei(N.UNPACK_ALIGNMENT,I.unpackAlignment);let qt=ae.getParameter(N.UNPACK_ROW_LENGTH),$e=ae.getParameter(N.UNPACK_IMAGE_HEIGHT),ii=ae.getParameter(N.UNPACK_SKIP_PIXELS),Ht=ae.getParameter(N.UNPACK_SKIP_ROWS),zs=ae.getParameter(N.UNPACK_SKIP_IMAGES);ae.pixelStorei(N.UNPACK_ROW_LENGTH,ht.width),ae.pixelStorei(N.UNPACK_IMAGE_HEIGHT,ht.height),ae.pixelStorei(N.UNPACK_SKIP_PIXELS,Ee),ae.pixelStorei(N.UNPACK_SKIP_ROWS,Oe),ae.pixelStorei(N.UNPACK_SKIP_IMAGES,Xe);let Gn=x.isDataArrayTexture||x.isData3DTexture,si=I.isDataArrayTexture||I.isData3DTexture;if(x.isDepthTexture){let Je=Ce.get(x),Ot=Ce.get(I),hn=Ce.get(Je.__renderTarget),_t=Ce.get(Ot.__renderTarget);ae.bindFramebuffer(N.READ_FRAMEBUFFER,hn.__webglFramebuffer),ae.bindFramebuffer(N.DRAW_FRAMEBUFFER,_t.__webglFramebuffer);for(let It=0;It<ve;It++)Gn&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Ce.get(x).__webglTexture,V,Xe+It),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Ce.get(I).__webglTexture,pe,St+It)),N.blitFramebuffer(Ee,Oe,Ee+Me,Oe+de,Se,qe,Se+Me,qe+de,N.DEPTH_BUFFER_BIT,N.NEAREST);ae.bindFramebuffer(N.READ_FRAMEBUFFER,null),ae.bindFramebuffer(N.DRAW_FRAMEBUFFER,null);}else if(V!==0||x.isRenderTargetTexture||Ce.has(x)){let Je=Ce.get(x),Ot=Ce.get(I);ae.bindFramebuffer(N.READ_FRAMEBUFFER,P),ae.bindFramebuffer(N.DRAW_FRAMEBUFFER,A);for(let hn=0;hn<ve;hn++)Gn?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Je.__webglTexture,V,Xe+hn):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Je.__webglTexture,V),si?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Ot.__webglTexture,pe,St+hn):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Ot.__webglTexture,pe),V!==0?N.blitFramebuffer(Ee,Oe,Ee+Me,Oe+de,Se,qe,Se+Me,qe+de,N.COLOR_BUFFER_BIT,N.NEAREST):si?N.copyTexSubImage3D(be,pe,Se,qe,St+hn,Ee,Oe,Me,de):N.copyTexSubImage2D(be,pe,Se,qe,Ee,Oe,Me,de);ae.bindFramebuffer(N.READ_FRAMEBUFFER,null),ae.bindFramebuffer(N.DRAW_FRAMEBUFFER,null);}else si?x.isDataTexture||x.isData3DTexture?N.texSubImage3D(be,pe,Se,qe,St,Me,de,ve,at,kt,ht.data):I.isCompressedArrayTexture?N.compressedTexSubImage3D(be,pe,Se,qe,St,Me,de,ve,at,ht.data):N.texSubImage3D(be,pe,Se,qe,St,Me,de,ve,at,kt,ht):x.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,pe,Se,qe,Me,de,at,kt,ht.data):x.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,pe,Se,qe,ht.width,ht.height,at,ht.data):N.texSubImage2D(N.TEXTURE_2D,pe,Se,qe,Me,de,at,kt,ht);ae.pixelStorei(N.UNPACK_ROW_LENGTH,qt),ae.pixelStorei(N.UNPACK_IMAGE_HEIGHT,$e),ae.pixelStorei(N.UNPACK_SKIP_PIXELS,ii),ae.pixelStorei(N.UNPACK_SKIP_ROWS,Ht),ae.pixelStorei(N.UNPACK_SKIP_IMAGES,zs),pe===0&&I.generateMipmaps===true&&I.mipmapsAutoUpdate===true&&N.generateMipmap(be),ae.unbindTexture();},this.initRenderTarget=function(x){Ce.get(x).__webglFramebuffer===void 0&&De.setupRenderTarget(x);},this.initTexture=function(x){x.isCubeTexture?De.setTextureCube(x,0):x.isData3DTexture?De.setTexture3D(x,0):x.isDataArrayTexture||x.isCompressedArrayTexture?De.setTexture2DArray(x,0):De.setTexture2D(x,0),ae.unbindTexture();},this.resetState=function(){k=0,U=0,j=null,ae.reset(),ce.reset();},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}));}get coordinateSystem(){return rn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Ye._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ye._getUnpackColorSpace();}};function Qe(i,e={}){let t=new Ho({canvas:i.canvas,alpha:e.alpha??true,antialias:e.antialias??false,powerPreference:e.powerPreference??"high-performance",preserveDrawingBuffer:e.preserveDrawingBuffer??false});t.outputColorSpace=Yt,t.toneMapping=an,t.setClearColor(e.clearColor??0,e.clearAlpha??0),t.setPixelRatio(i.size.dpr),t.setSize(i.size.width,i.size.height,false);let n=new fs,r=new ui,o=l=>{l.preventDefault(),e.onContextLost?.(l);},a=l=>{e.onContextRestored?.(l);};i.canvas.addEventListener("webglcontextlost",o,false),i.canvas.addEventListener("webglcontextrestored",a,false);let c=false;return {renderer:t,scene:n,get camera(){return r},setCamera(l){r=l;},resize(l){t.setPixelRatio(l.dpr),t.setSize(l.width,l.height,false);},render(){t.render(n,r);},dispose(){c||(c=true,i.canvas.removeEventListener("webglcontextlost",o),i.canvas.removeEventListener("webglcontextrestored",a),t.dispose(),t.forceContextLoss());}}}var Dh=`
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;function Jt(i,e,t=Dh){let n=new gn(2,2),s=new rt({uniforms:e,vertexShader:t,fragmentShader:i,depthTest:false,depthWrite:false,toneMapped:false}),r=new gt(n,s);return r.frustumCulled=false,{mesh:r,geometry:n,material:s,uniforms:e}}function Dg(i){return !!(i&&typeof i=="object"&&"isTexture"in i)}function vl(i){if(Dg(i)){i.dispose();return}if(Array.isArray(i))for(let e of i)vl(e);}function Nh(i){for(let t of Object.values(i))vl(t);let e=i.uniforms;if(e)for(let t of Object.values(e))vl(t?.value);i.dispose();}function Fh(i){i.traverse(e=>{let t=e.geometry;t&&t.dispose();let n=e.material;if(Array.isArray(n))for(let s of n)Nh(s);else n&&Nh(n);});}function je(i){Fh(i),i.clear();}var Ng=`
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform float uIntensity;
uniform float uScale;
uniform float uQuality;
varying vec2 vUv;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  mat2 rotate = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p = rotate * p * 2.02 + 13.7;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  p *= uScale;
  p += (uPointer - 0.5) * 0.2;

  float t = uTime * 0.25;
  float warp = fbm(vec2(p.x * 0.9 + t * 0.8, p.y * 0.7 - t * 0.35));
  float warp2 = fbm(vec2(p.x * 1.7 - t * 0.4, p.y * 1.1 + t * 0.2) + warp);

  float curtain = 0.0;
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    float x = p.x * (2.1 + fi * 0.35) + warp * 1.15 + fi * 1.7;
    x += sin(p.y * 1.8 + t * 1.2 + fi) * 0.12;
    float band = sin(x * 3.0 + t * (1.3 + fi * 0.2) + fi * 2.3);
    band = pow(max(band, 0.0), 5.0);
    float vertical = smoothstep(1.15, -0.15, abs(p.y + 0.12 + fi * 0.16));
    float edge = smoothstep(0.15, 1.0, warp2);
    curtain += band * vertical * (0.55 + edge * 0.6) * (1.0 - fi * 0.16);
  }
  curtain = clamp(curtain * 1.25, 0.0, 1.0);

  float streaks = fbm(vec2(p.x * 7.0 + warp * 1.5, p.y * 0.6 - t * 1.4));
  curtain *= 0.6 + streaks * 0.8;

  vec3 background = mix(vec3(0.006, 0.012, 0.03), uColorA, smoothstep(-0.6, 0.8, uv.y));
  float star = step(0.9975, hash21(floor(uv * uResolution * 0.5)));
  background += star * vec3(0.5, 0.7, 0.9) * (0.25 + 0.75 * uv.y);

  vec3 auroraColor = mix(uColorB, uColorC, smoothstep(-0.2, 0.9, uv.y + warp * 0.2));
  auroraColor = mix(auroraColor, vec3(0.85, 1.0, 0.95), pow(curtain, 3.0) * 0.35);

  vec3 color = background + auroraColor * curtain * uIntensity * 1.35;

  float horizon = smoothstep(0.55, -0.1, abs(p.y + 0.45));
  color += uColorB * horizon * 0.06 * uIntensity;

  float vignette = smoothstep(1.3, 0.2, length(p * vec2(0.75, 1.0)));
  color *= 0.55 + vignette * 0.65;

  // Dithering keeps large gradients from banding on 8-bit displays.
  float dither = hash21(gl_FragCoord.xy + fract(uTime)) - 0.5;
  color += dither / 255.0;

  gl_FragColor = vec4(color, 1.0);
}
`,Fg={colorA:198676,colorB:3535048,colorC:9133311,backgroundColor:132106,backgroundAlpha:1,intensity:1,scale:1},Uh=Ke({name:"aurora",defaults:Fg,setup(i,e){let t=Qe(i,{clearColor:e.backgroundColor,clearAlpha:e.backgroundAlpha}),n={uTime:{value:0},uResolution:{value:new Pe(i.size.width,i.size.height)},uPointer:{value:new Pe(.5,.5)},uColorA:{value:new ne(e.colorA)},uColorB:{value:new ne(e.colorB)},uColorC:{value:new ne(e.colorC)},uIntensity:{value:e.intensity},uScale:{value:e.scale},uQuality:{value:i.quality}},s=Jt(Ng,n);t.scene.add(s.mesh);let r=o=>{n.uColorA.value.set(o.colorA),n.uColorB.value.set(o.colorB),n.uColorC.value.set(o.colorC),n.uIntensity.value=o.intensity,n.uScale.value=o.scale,t.renderer.setClearColor(o.backgroundColor,o.backgroundAlpha);};return r(e),{resize(o){n.uResolution.value.set(o.width,o.height),t.resize(o);},render(o){n.uTime.value=o.time,n.uPointer.value.set(o.pointer.nx,o.pointer.ny),n.uQuality.value=o.quality,t.render();},setOptions(o){r(o);},onQualityChange(o){n.uQuality.value=o;},dispose(){je(t.scene),t.dispose();}}}});function Ji(i){let e=i>>>0;return ()=>{e=e+1831565813>>>0;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}function Oh(){return typeof window.matchMedia=="function"?window.matchMedia("(pointer: coarse)").matches:false}function Wo(i,e){let t=[],n=Math.PI*(3-Math.sqrt(5));for(let s=0;s<i;s++){let r=1-s/Math.max(i-1,1)*2,o=Math.sqrt(Math.max(1-r*r,0)),a=n*s;t.push(new B(Math.cos(a)*o*e,r*e,Math.sin(a)*o*e));}return t}var Ug=`
uniform float uSize;
uniform float uPixelRatio;
uniform vec3 uColor;
varying vec3 vColor;

void main() {
  vColor = uColor;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = uSize * uPixelRatio * (280.0 / max(-mvPosition.z, 1.0));
  gl_Position = projectionMatrix * mvPosition;
}
`,Og=`
uniform float uOpacity;
varying vec3 vColor;

void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  float alpha = smoothstep(0.5, 0.05, d);
  gl_FragColor = vec4(vColor, alpha * uOpacity);
}
`;function $i({color:i,size:e,opacity:t=.95,pixelRatio:n}){return new rt({uniforms:{uColor:{value:new ne(i)},uSize:{value:e},uPixelRatio:{value:n},uOpacity:{value:t}},vertexShader:Ug,fragmentShader:Og,transparent:true,depthWrite:false,blending:zt,toneMapped:false})}function Os(i,e=.16){return new $n({color:i,transparent:true,opacity:e,depthWrite:false,blending:zt})}var cn=`
precision highp float;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uTime;
varying vec2 vUv;
`;var Bg=`
varying float vY;
void main() {
  vY = normalize(position).y;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,zg=`
uniform vec3 uTop;
uniform vec3 uBottom;
varying float vY;
void main() {
  vec3 color = mix(uBottom, uTop, smoothstep(-0.8, 0.8, vY));
  gl_FragColor = vec4(color, 1.0);
}
`,kg={backgroundColor:465199,backgroundAlpha:1,color1:16711680,color2:53759,birdSize:1,wingSpan:30,speedLimit:5,separation:20,alignment:20,cohesion:20,quantity:5,seed:31};function Hg(){let i=new ct;return i.setAttribute("position",new ut([-0.72,0,-0.18,0,0,.5,0,0,-0.28,.72,0,-0.18,0,0,.5,0,0,-0.28],3)),i.computeVertexNormals(),i}var Bh=Ke({name:"birds",defaults:kg,setup(i,e){let t=Qe(i,{clearColor:e.backgroundColor,clearAlpha:e.backgroundAlpha}),n=new it(55,i.size.width/Math.max(i.size.height,1),.1,500);n.position.set(0,0,60),n.lookAt(0,0,0),t.setCamera(n);let s={uTop:{value:new ne(e.backgroundColor).lerp(new ne(e.color1),.15)},uBottom:{value:new ne(e.backgroundColor).multiplyScalar(.7)}},r=new hi(180,32,16),o=new rt({uniforms:s,vertexShader:Bg,fragmentShader:zg,side:At,depthWrite:false}),a=new gt(r,o);t.scene.add(a);let c=Ji(e.seed),l=Oh(),u=Math.max(40,Math.min(260,Math.round(e.quantity*36*(l?.65:1)))),f=new Float32Array(u*3),h=new Float32Array(u*3),g=new Float32Array(u),m=new Float32Array(u);for(let L=0;L<u;L++){let G=c()*Math.PI*2,P=Math.acos(2*c()-1),A=8+c()*14;f[L*3]=Math.sin(P)*Math.cos(G)*A,f[L*3+1]=Math.sin(P)*Math.sin(G)*A*.75,f[L*3+2]=Math.cos(P)*A;let k=1.4+c()*1.8,U=c()*Math.PI*2,j=Math.acos(2*c()-1);h[L*3]=Math.sin(j)*Math.cos(U)*k,h[L*3+1]=Math.sin(j)*Math.sin(U)*k,h[L*3+2]=Math.cos(j)*k,g[L]=c()*Math.PI*2,m[L]=1.05+c()*.85;}let y=Hg(),p=new zi({color:16777215,side:Kt,transparent:true,opacity:.95}),d=new vs(y,p,u);d.instanceMatrix.setUsage(qi),d.frustumCulled=false,t.scene.add(d);let S=new ne(e.color1),C=new ne(e.color2),T=new ne,b=L=>{S.set(L.color1),C.set(L.color2);for(let G=0;G<u;G++){let P=(f[G*3+1]+22)/44,A=Math.max(0,Math.min(1,P));T.copy(S).lerp(C,.15+A*.55),d.setColorAt(G,T);}d.instanceColor&&(d.instanceColor.needsUpdate=true);},w=new Wt,_=new B,M=e,O=L=>{M=L,S.set(L.color1),C.set(L.color2),b(L),s.uTop.value.set(L.backgroundColor).lerp(new ne(L.color1),.15),s.uBottom.value.set(L.backgroundColor).multiplyScalar(.7),t.renderer.setClearColor(L.backgroundColor,L.backgroundAlpha);};O(e);let D=0,F=0;return {resize(L){n.aspect=L.width/Math.max(L.height,1),n.updateProjectionMatrix(),t.resize(L);},render(L){let G=Math.min(L.delta,.05),P=G*60,A=Math.max(.5,M.speedLimit),k=49,U=225,j=400,W=M.separation*.024,K=M.alignment*.006,ee=M.cohesion*.0012,ye=Math.sin(L.time*.35)*15,Ne=Math.cos(L.time*.41)*8,Z=Math.sin(L.time*.27)*11;if(G>0)for(let oe=0;oe<u;oe++){let te=oe*3,Te=0,me=0,Le=0,ot=0,Ae=0,Ve=0,We=0,Be=0,yt=0,dt=0,Mt=0,tt=0;for(let Ge=0;Ge<u;Ge++){if(oe===Ge)continue;let ae=Ge*3,mt=f[ae]-f[te],Ce=f[ae+1]-f[te+1],De=f[ae+2]-f[te+2],E=mt*mt+Ce*Ce+De*De;if(E!==0&&(E<j&&(We+=mt,Be+=Ce,yt+=De,tt++),E<U&&(ot+=h[ae],Ae+=h[ae+1],Ve+=h[ae+2],Mt++),E<k)){let v=1/E;Te-=mt*v,me-=Ce*v,Le-=De*v,dt++;}}dt>0&&(Te/=dt,me/=dt,Le/=dt),Mt>0&&(ot=ot/Mt-h[te],Ae=Ae/Mt-h[te+1],Ve=Ve/Mt-h[te+2]),tt>0&&(We=We/tt,Be=Be/tt,yt=yt/tt),h[te]+=(Te*W+ot*K+We*ee)*P,h[te+1]+=(me*W+Ae*K+Be*ee)*P,h[te+2]+=(Le*W+Ve*K+yt*ee)*P;let Ft=f[te],pt=f[te+1],Et=f[te+2];h[te]+=(ye-Ft)*.0028*P,h[te+1]+=(Ne-pt)*.0028*P,h[te+2]+=(Z-Et)*.0028*P,h[te]+=-Et*.0012*P,h[te+2]+=Ft*.0012*P;let Ut=Math.sqrt(Ft*Ft+pt*pt+Et*Et);if(Ut>24){let Ge=.18*P;h[te]-=Ft/Ut*Ge,h[te+1]-=pt/Ut*Ge,h[te+2]-=Et/Ut*Ge;}let Tt=h[te],N=h[te+1],wt=h[te+2],st=Math.sqrt(Tt*Tt+N*N+wt*wt);if(st>A){let Ge=A/st;Tt*=Ge,N*=Ge,wt*=Ge;}else st<.6&&(Tt+=(c()-.5)*.2,N+=(c()-.5)*.2,wt+=(c()-.5)*.2);h[te]=Tt,h[te+1]=N,h[te+2]=wt,f[te]=Ft+Tt*G,f[te+1]=pt+N*G,f[te+2]=Et+wt*G;}for(let oe=0;oe<u;oe++){let te=oe*3,Te=f[te],me=f[te+1],Le=f[te+2],ot=h[te],Ae=h[te+1],Ve=h[te+2];w.position.set(Te,me,Le),_.set(Te+ot,me+Ae,Le+Ve),w.lookAt(_),w.rotateZ(Math.sin(L.time*6+g[oe])*.35);let We=M.birdSize*m[oe];w.scale.set(We*(M.wingSpan/30),We,We),w.updateMatrix(),d.setMatrixAt(oe,w.matrix);}d.instanceMatrix.needsUpdate=true,L.pointer.active?(D=(L.pointer.nx-.5)*7,F=(L.pointer.ny-.5)*-5):(D=0,F=0),n.position.x+=(D-n.position.x)*.03,n.position.y+=(F-n.position.y)*.03,n.lookAt(0,0,0),t.render();},setOptions(L){O(L);},dispose(){d.dispose(),je(t.scene),t.dispose();}}}});var Gg=cn+`
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uBackground;
uniform float uAmplitude;
uniform float uRing;
uniform float uRotation;
uniform float uSize;

vec2 hash22(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}

float worley(vec2 p, out float edge) {
  vec2 n = floor(p);
  vec2 f = fract(p);
  float d1 = 8.0;
  float d2 = 8.0;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j));
      vec2 o = hash22(n + g);
      o = 0.5 + 0.5 * sin(uTime * 0.6 + 6.2831 * o);
      vec2 r = g + o - f;
      float d = length(r);
      if (d < d1) {
        d2 = d1;
        d1 = d;
      } else if (d < d2) {
        d2 = d;
      }
    }
  }
  edge = d2 - d1;
  return d1;
}

void main() {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
  p *= uSize;
  float angle = uTime * 0.03 * uRotation;
  mat2 rotate = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  p = rotate * p;

  float edge;
  float d = worley(p, edge);
  float wall = 1.0 - smoothstep(0.0, 0.07, edge);
  float body = smoothstep(0.05, 0.52, d);
  float ring = 0.5 + 0.5 * sin(d * 20.0 * uRing - uTime * 1.6);

  vec3 color = mix(uColor1, uColor2, body);
  color = mix(uBackground, color, smoothstep(0.0, 0.62, d));
  color = mix(color, uColor1, wall * 0.82);
  color += uColor2 * (1.0 - smoothstep(0.0, 0.2, d)) * 0.36;
  color += uColor2 * max(ring, 0.0) * 0.07 * uAmplitude;

  float vignette = smoothstep(1.35, 0.2, length(p * vec2(0.7, 1.0)));
  color *= 0.62 + vignette * 0.5;
  gl_FragColor = vec4(color, 1.0);
}
`,Vg={color1:35980,color2:15918901,backgroundColor:14155663,backgroundAlpha:1,amplitudeFactor:1,ringFactor:1,rotationFactor:1,size:2},zh=Ke({name:"cells",defaults:Vg,setup(i,e){let t=Qe(i,{clearColor:e.backgroundColor,clearAlpha:e.backgroundAlpha}),n={uResolution:{value:new Pe(i.size.width,i.size.height)},uPointer:{value:new Pe(.5,.5)},uTime:{value:0},uColor1:{value:new ne(e.color1)},uColor2:{value:new ne(e.color2)},uBackground:{value:new ne(e.backgroundColor)},uAmplitude:{value:e.amplitudeFactor},uRing:{value:e.ringFactor},uRotation:{value:e.rotationFactor},uSize:{value:e.size}},s=Jt(Gg,n);t.scene.add(s.mesh);let r=o=>{n.uColor1.value.set(o.color1),n.uColor2.value.set(o.color2),n.uBackground.value.set(o.backgroundColor),n.uAmplitude.value=o.amplitudeFactor,n.uRing.value=o.ringFactor,n.uRotation.value=o.rotationFactor,n.uSize.value=o.size,t.renderer.setClearColor(o.backgroundColor,o.backgroundAlpha);};return r(e),{resize(o){n.uResolution.value.set(o.width,o.height),t.resize(o);},render(o){n.uTime.value=o.time,n.uPointer.value.set(o.pointer.nx,o.pointer.ny),t.render();},setOptions(o){r(o);},dispose(){je(t.scene),t.dispose();}}}});var Wg=cn+`
uniform vec3 uSky;
uniform vec3 uCloud;
uniform vec3 uShadow;
uniform vec3 uSun;
uniform vec3 uGlare;
uniform vec3 uSunlight;
uniform float uScale;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  mat2 rotate = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p = rotate * p * 2.03 + 11.3;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 uv = vUv;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  p += (uPointer - 0.5) * 0.15;
  p *= uScale;

  float t = uTime * 0.018;
  vec3 sky = mix(uSky, uSky * 0.52 + vec3(0.02), smoothstep(0.0, 1.0, uv.y));

  vec2 sunPos = vec2(0.73, 0.68);
  float sunDist = length((uv - sunPos) * vec2(aspect, 1.0));
  float sun = smoothstep(0.085, 0.015, sunDist);
  float glare = exp(-sunDist * 4.2);
  sky += uSun * sun * 0.95 + uGlare * glare * 0.28;

  vec2 q = p + vec2(t * 1.3, 0.0);
  float warp = fbm(q * 0.55 + fbm(q * 0.28));
  float n = fbm(q * 1.15 + warp * 0.9);
  float detail = fbm(q * 2.6 - warp * 0.4 + vec2(t * 2.1, 0.0));
  float cloud = smoothstep(0.46, 0.72, n + detail * 0.16);

  float light = fbm(q * 1.5 + vec2(0.1, 0.2) + t);
  float shade = smoothstep(0.25, 0.78, light);
  vec3 cloudColor = mix(uShadow, uCloud, shade);
  cloudColor = mix(cloudColor, uSunlight, smoothstep(0.62, 0.96, detail) * 0.38);

  float sunSide = smoothstep(0.22, 0.0, sunDist);
  cloudColor += uSunlight * sunSide * cloud * 0.28;

  vec3 color = mix(sky, cloudColor, cloud);
  color = mix(color, uSky, smoothstep(0.9, 0.15, uv.y) * 0.18);
  color += uGlare * glare * cloud * 0.06;

  float vignette = smoothstep(1.35, 0.2, length(p * vec2(0.7, 1.0)));
  color *= 0.65 + vignette * 0.45;
  gl_FragColor = vec4(color, 1.0);
}
`,Xg={backgroundColor:16777215,backgroundAlpha:1,skyColor:6863063,cloudColor:11387358,cloudShadowColor:1586512,sunColor:16750873,sunGlareColor:16737843,sunlightColor:16750899,scale:3},kh=Ke({name:"clouds",defaults:Xg,setup(i,e){let t=Qe(i,{clearColor:e.backgroundColor,clearAlpha:e.backgroundAlpha}),n={uResolution:{value:new Pe(i.size.width,i.size.height)},uPointer:{value:new Pe(.5,.5)},uTime:{value:0},uSky:{value:new ne(e.skyColor)},uCloud:{value:new ne(e.cloudColor)},uShadow:{value:new ne(e.cloudShadowColor)},uSun:{value:new ne(e.sunColor)},uGlare:{value:new ne(e.sunGlareColor)},uSunlight:{value:new ne(e.sunlightColor)},uScale:{value:e.scale}},s=Jt(Wg,n);t.scene.add(s.mesh);let r=o=>{n.uSky.value.set(o.skyColor),n.uCloud.value.set(o.cloudColor),n.uShadow.value.set(o.cloudShadowColor),n.uSun.value.set(o.sunColor),n.uGlare.value.set(o.sunGlareColor),n.uSunlight.value.set(o.sunlightColor),n.uScale.value=o.scale,t.renderer.setClearColor(o.backgroundColor,o.backgroundAlpha);};return r(e),{resize(o){n.uResolution.value.set(o.width,o.height),t.resize(o);},render(o){n.uTime.value=o.time,n.uPointer.value.set(o.pointer.nx,o.pointer.ny),t.render();},setOptions(o){r(o);},dispose(){je(t.scene),t.dispose();}}}});var qg=cn+`
uniform vec3 uSky;
uniform vec3 uCloud;
uniform vec3 uLight;
uniform float uScale;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  mat2 rotate = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p = rotate * p * 2.03 + 7.1;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
  p += (uPointer - 0.5) * 0.16;
  p *= uScale;

  float t = uTime * 0.03;
  float warp = fbm(p * 1.4 + vec2(t, -t * 0.6));
  float n = fbm(p * 2.0 + warp * 1.7 + vec2(-t * 0.4, t * 0.3));
  float detail = fbm(p * 4.8 + warp * 2.1 + t * 0.5);

  float cloud = smoothstep(0.38, 0.78, n);
  vec3 color = mix(uSky, uCloud, cloud);
  color = mix(color, uLight, smoothstep(0.62, 0.96, detail) * 0.45);
  color += uLight * pow(max(n, 0.0), 7.0) * 0.18;
  color += uCloud * smoothstep(0.1, 0.9, warp) * 0.08;

  float star = step(0.9975, hash21(floor(vUv * uResolution * 0.5)));
  color += star * uLight * (0.25 + 0.75 * vUv.y);

  float vignette = smoothstep(1.3, 0.15, length(p * vec2(0.75, 1.0)));
  color *= 0.5 + vignette * 0.6;
  gl_FragColor = vec4(color, 1.0);
}
`,Yg={backgroundColor:0,backgroundAlpha:1,skyColor:6072010,cloudColor:3362176,lightColor:16777215,scale:1.4},Hh=Ke({name:"clouds2",defaults:Yg,setup(i,e){let t=Qe(i,{clearColor:e.backgroundColor,clearAlpha:e.backgroundAlpha}),n={uResolution:{value:new Pe(i.size.width,i.size.height)},uPointer:{value:new Pe(.5,.5)},uTime:{value:0},uSky:{value:new ne(e.skyColor)},uCloud:{value:new ne(e.cloudColor)},uLight:{value:new ne(e.lightColor)},uScale:{value:e.scale}},s=Jt(qg,n);t.scene.add(s.mesh);let r=o=>{n.uSky.value.set(o.skyColor),n.uCloud.value.set(o.cloudColor),n.uLight.value.set(o.lightColor),n.uScale.value=o.scale,t.renderer.setClearColor(o.backgroundColor,o.backgroundAlpha);};return r(e),{resize(o){n.uResolution.value.set(o.width,o.height),t.resize(o);},render(o){n.uTime.value=o.time,n.uPointer.value.set(o.pointer.nx,o.pointer.ny),t.render();},setOptions(o){r(o);},dispose(){je(t.scene),t.dispose();}}}});var Zg={color:16746528,color2:16746528,backgroundColor:2236962,backgroundAlpha:1,size:3,spacing:35,showLines:true},Gh=Ke({name:"dots",defaults:Zg,setup(i,e){let t=Qe(i,{clearColor:e.backgroundColor,clearAlpha:e.backgroundAlpha}),n=new it(50,i.size.width/Math.max(i.size.height,1),.1,300);n.position.set(0,0,48),t.setCamera(n);let s=new Bt;t.scene.add(s);let r=Math.max(180,Math.min(1400,Math.round(9e3/Math.max(e.spacing,8)))),o=14,a=Wo(r,o),c=new Float32Array(r*3);for(let b=0;b<r;b++){let w=a[b];c[b*3]=w.x,c[b*3+1]=w.y,c[b*3+2]=w.z;}let l=new ct;l.setAttribute("position",new vt(c,3));let u=$i({color:e.color,size:e.size*.3,pixelRatio:i.size.dpr}),f=new mn(l,u);s.add(f);let h=[],g=o*.22;for(let b=0;b<r;b++)for(let w=b+1;w<r;w++)a[b].distanceTo(a[w])<=g&&h.push([b,w]);let m=new Float32Array(h.length*6);for(let b=0;b<h.length;b++){let[w,_]=h[b];m[b*6]=a[w].x,m[b*6+1]=a[w].y,m[b*6+2]=a[w].z,m[b*6+3]=a[_].x,m[b*6+4]=a[_].y,m[b*6+5]=a[_].z;}let y=new ct;y.setAttribute("position",new vt(m,3));let p=Os(e.color2,.1),d=new on(y,p);s.add(d);let S=0,C=0,T=b=>{u.uniforms.uColor.value.set(b.color),u.uniforms.uSize.value=b.size*.3,p.color.set(b.color2),f.visible=true,d.visible=b.showLines,t.renderer.setClearColor(b.backgroundColor,b.backgroundAlpha);};return T(e),{resize(b){n.aspect=b.width/Math.max(b.height,1),n.updateProjectionMatrix(),u.uniforms.uPixelRatio.value=b.dpr,t.resize(b);},render(b){s.rotation.y=b.time*.05,b.pointer.active?(S=(b.pointer.ny-.5)*.35,C=(b.pointer.nx-.5)*.5):(S=0,C=0),s.rotation.x+=(S-s.rotation.x)*.05,s.rotation.z+=(C-s.rotation.z)*.03,t.render();},setOptions(b){T(b);},dispose(){je(t.scene),t.dispose();}}}});var Jg=cn+`
uniform vec3 uHighlight;
uniform vec3 uMidtone;
uniform vec3 uLowlight;
uniform vec3 uBase;
uniform float uBlur;
uniform float uZoom;
uniform float uScale;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  mat2 rotate = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p = rotate * p * 2.02 + 13.7;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 p = (vUv - 0.5) * vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
  p *= uZoom;
  p += (uPointer - 0.5) * 0.2;

  float t = uTime * 0.15;
  float warp = fbm(p * 1.1 + vec2(t, -t * 0.6));
  float base = fbm(p * (2.0 + uScale * 0.2) + vec2(-t * 0.4, t * 0.3) + warp * 1.1);
  float detail = fbm(p * 5.0 + warp * 2.0 + vec2(-t * 0.7, t * 0.5));
  float n = mix(base, detail, 0.3 + uBlur * 0.35);
  n = mix(n, fbm(p * 9.0 + warp * 2.5), uBlur * 0.25);

  float v = vUv.y;
  vec3 color = mix(uBase, uLowlight, smoothstep(0.0, 0.45, v));
  color = mix(color, uMidtone, smoothstep(0.35, 0.72, v));
  color = mix(color, uHighlight, smoothstep(0.62, 0.98, v));

  float density = smoothstep(0.42, 0.62, n);
  color = mix(color, uHighlight, density * 0.55);
  color = mix(color, uLowlight, (1.0 - density) * 0.2);
  color += uMidtone * smoothstep(0.55, 0.75, n) * 0.15;
  color *= 0.72 + density * 0.4;

  float vignette = smoothstep(1.25, 0.15, length(p * vec2(0.8, 1.0)));
  color *= 0.62 + vignette * 0.5;
  gl_FragColor = vec4(color, 1.0);
}
`,$g={highlightColor:16761600,midtoneColor:16719616,lowlightColor:2949375,baseColor:16772075,backgroundColor:16772075,backgroundAlpha:1,blurFactor:.6,zoom:1,scale:2},Vh=Ke({name:"fog",defaults:$g,setup(i,e){let t=Qe(i,{clearColor:e.backgroundColor,clearAlpha:e.backgroundAlpha}),n={uResolution:{value:new Pe(i.size.width,i.size.height)},uPointer:{value:new Pe(.5,.5)},uTime:{value:0},uHighlight:{value:new ne(e.highlightColor)},uMidtone:{value:new ne(e.midtoneColor)},uLowlight:{value:new ne(e.lowlightColor)},uBase:{value:new ne(e.baseColor)},uBlur:{value:e.blurFactor},uZoom:{value:e.zoom},uScale:{value:e.scale}},s=Jt(Jg,n);t.scene.add(s.mesh);let r=o=>{n.uHighlight.value.set(o.highlightColor),n.uMidtone.value.set(o.midtoneColor),n.uLowlight.value.set(o.lowlightColor),n.uBase.value.set(o.baseColor),n.uBlur.value=o.blurFactor,n.uZoom.value=o.zoom,n.uScale.value=o.scale,t.renderer.setClearColor(o.backgroundColor,o.backgroundAlpha);};return r(e),{resize(o){n.uResolution.value.set(o.width,o.height),t.resize(o);},render(o){n.uTime.value=o.time,n.uPointer.value.set(o.pointer.nx,o.pointer.ny),t.render();},setOptions(o){r(o);},dispose(){je(t.scene),t.dispose();}}}});var Kg=`
varying vec3 vNormal;
varying vec3 vView;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vView = normalize(-mvPosition.xyz);
  gl_Position = projectionMatrix * mvPosition;
}
`,Qg=`
uniform vec3 uColor;
varying vec3 vNormal;
varying vec3 vView;

void main() {
  float fresnel = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 2.5);
  gl_FragColor = vec4(uColor, fresnel * 0.55);
}
`,jg={color:16727937,color2:16777215,backgroundColor:2299196,backgroundAlpha:1,size:1,points:10,maxDistance:20,spacing:15,showDots:true},Wh=Ke({name:"globe",defaults:jg,setup(i,e){let t=Qe(i,{clearColor:e.backgroundColor,clearAlpha:e.backgroundAlpha}),n=new it(50,i.size.width/Math.max(i.size.height,1),.1,300);n.position.set(0,0,48),t.setCamera(n);let s=new Bt;t.scene.add(s);let r=15*e.size,o=Math.max(80,Math.round(e.points*e.points*2)),a=Wo(o,r*1.015),c=new Float32Array(o*3);for(let A=0;A<o;A++){let k=a[A];c[A*3]=k.x,c[A*3+1]=k.y,c[A*3+2]=k.z;}let l=new ct;l.setAttribute("position",new vt(c,3));let u=$i({color:e.color,size:.55,pixelRatio:i.size.dpr}),f=new mn(l,u);s.add(f);let h=r*Math.min(.32,Math.max(.14,e.maxDistance/90)),g=[];for(let A=0;A<o;A++)for(let k=A+1;k<o;k++)a[A].distanceTo(a[k])<=h&&g.push([A,k]);let m=new Float32Array(g.length*6);for(let A=0;A<g.length;A++){let[k,U]=g[A];m[A*6]=a[k].x,m[A*6+1]=a[k].y,m[A*6+2]=a[k].z,m[A*6+3]=a[U].x,m[A*6+4]=a[U].y,m[A*6+5]=a[U].z;}let y=new ct;y.setAttribute("position",new vt(m,3));let p=Os(e.color,.13),d=new on(y,p);s.add(d);let S=[],C=Math.PI/9,T=Math.PI/12,b=72;for(let A=-Math.PI/2+C;A<Math.PI/2;A+=C){let k=Math.sin(A)*r,U=Math.cos(A)*r;for(let j=0;j<b;j++){let W=j/b*Math.PI*2,K=(j+1)/b*Math.PI*2;S.push(Math.cos(W)*U,k,Math.sin(W)*U,Math.cos(K)*U,k,Math.sin(K)*U);}}for(let A=0;A<Math.PI*2;A+=T)for(let k=0;k<b/2;k++){let U=-Math.PI/2+k/(b/2)*Math.PI,j=-Math.PI/2+(k+1)/(b/2)*Math.PI;S.push(Math.cos(U)*Math.cos(A)*r,Math.sin(U)*r,Math.cos(U)*Math.sin(A)*r,Math.cos(j)*Math.cos(A)*r,Math.sin(j)*r,Math.cos(j)*Math.sin(A)*r);}let w=new ct;w.setAttribute("position",new ut(S,3));let _=Os(e.color2,.16),M=new on(w,_);s.add(M);let O=new hi(r*1.12,32,24),D=new rt({uniforms:{uColor:{value:new ne(e.color2)}},vertexShader:Kg,fragmentShader:Qg,transparent:true,depthWrite:false,blending:zt,side:At}),F=new gt(O,D);s.add(F);let L=0,G=0,P=A=>{u.uniforms.uColor.value.set(A.color),p.color.set(A.color),_.color.set(A.color2),D.uniforms.uColor.value.set(A.color2),f.visible=A.showDots,t.renderer.setClearColor(A.backgroundColor,A.backgroundAlpha);};return P(e),{resize(A){n.aspect=A.width/Math.max(A.height,1),n.updateProjectionMatrix(),u.uniforms.uPixelRatio.value=A.dpr,t.resize(A);},render(A){s.rotation.y=A.time*.06,A.pointer.active?(L=(A.pointer.ny-.5)*-0.35,G=(A.pointer.nx-.5)*.45):(L=0,G=0),s.rotation.x+=(L-s.rotation.x)*.04,s.rotation.z+=(G-s.rotation.z)*.04,t.render();},setOptions(A){P(A);},dispose(){je(t.scene),t.dispose();}}}});var e0=cn+`
uniform vec3 uBaseColor;
uniform vec3 uColor2;
uniform vec3 uBackground;
uniform float uAmplitude;
uniform float uRing;
uniform float uRotation;
uniform float uSize;
uniform float uXOffset;
uniform float uYOffset;

void main() {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
  p -= vec2(uXOffset, uYOffset);
  p /= max(uSize, 0.1);

  float r = length(p);
  float a = atan(p.y, p.x) + uTime * 0.04 * uRotation;
  float rays = pow(0.5 + 0.5 * sin(a * 18.0 + sin(r * 9.0 - uTime * 1.5) * 2.0), 5.0);
  float ring = pow(max(sin(r * 20.0 * uRing - uTime * 2.2), 0.0), 3.0) * exp(-r * 2.6);
  float glow = exp(-r * 2.8);
  float core = exp(-r * 6.2);
  vec3 coreColor = mix(uBaseColor, vec3(0.65, 0.85, 1.0), 0.85);

  vec3 color = uBackground;
  color += coreColor * core * 1.7;
  color += coreColor * glow * 0.22;
  color += uColor2 * ring * 0.55 * uAmplitude;
  color += uColor2 * rays * glow * 0.05;
  color += uColor2 * smoothstep(0.25, 0.95, r) * 0.035;

  float vignette = smoothstep(1.4, 0.2, length(p * vec2(0.75, 1.0)));
  color *= 0.65 + vignette * 0.45;
  gl_FragColor = vec4(color, 1.0);
}
`,t0={baseColor:6745,color2:15918901,backgroundColor:1251907,backgroundAlpha:1,amplitudeFactor:1,ringFactor:1,rotationFactor:1,xOffset:0,yOffset:0,size:1},Xh=Ke({name:"halo",defaults:t0,setup(i,e){let t=Qe(i,{clearColor:e.backgroundColor,clearAlpha:e.backgroundAlpha}),n={uResolution:{value:new Pe(i.size.width,i.size.height)},uPointer:{value:new Pe(.5,.5)},uTime:{value:0},uBaseColor:{value:new ne(e.baseColor)},uColor2:{value:new ne(e.color2)},uBackground:{value:new ne(e.backgroundColor)},uAmplitude:{value:e.amplitudeFactor},uRing:{value:e.ringFactor},uRotation:{value:e.rotationFactor},uSize:{value:e.size},uXOffset:{value:e.xOffset},uYOffset:{value:e.yOffset}},s=Jt(e0,n);t.scene.add(s.mesh);let r=o=>{n.uBaseColor.value.set(o.baseColor),n.uColor2.value.set(o.color2),n.uBackground.value.set(o.backgroundColor),n.uAmplitude.value=o.amplitudeFactor,n.uRing.value=o.ringFactor,n.uRotation.value=o.rotationFactor,n.uSize.value=o.size,n.uXOffset.value=o.xOffset,n.uYOffset.value=o.yOffset,t.renderer.setClearColor(o.backgroundColor,o.backgroundAlpha);};return r(e),{resize(o){n.uResolution.value.set(o.width,o.height),t.resize(o);},render(o){n.uTime.value=o.time,n.uPointer.value.set(o.pointer.nx,o.pointer.ny),t.render();},setOptions(o){r(o);},dispose(){je(t.scene),t.dispose();}}}});var n0=`
uniform float uSize;
uniform float uPixelRatio;
uniform vec3 uColor;
varying vec3 vColor;

void main() {
  vColor = uColor;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = uSize * uPixelRatio * (280.0 / max(-mvPosition.z, 1.0));
  gl_Position = projectionMatrix * mvPosition;
}
`,i0=`
uniform float uOpacity;
varying vec3 vColor;

void main() {
  float distanceToCenter = length(gl_PointCoord - vec2(0.5));
  float alpha = smoothstep(0.5, 0.05, distanceToCenter);
  gl_FragColor = vec4(vColor, alpha * uOpacity);
}
`,s0={color:5822207,backgroundColor:263690,backgroundAlpha:1,points:10,spacing:14,maxDistance:22,pointSize:.85,showDots:true,showLines:true,drift:1,seed:7};function r0(i){let e=i>>>0;return ()=>{e=e+1831565813>>>0;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}function o0(){return typeof window.matchMedia=="function"?window.matchMedia("(pointer: coarse)").matches:false}var qh=Ke({name:"net",defaults:s0,setup(i,e){let t=Qe(i,{clearColor:e.backgroundColor,clearAlpha:e.backgroundAlpha}),n=new it(58,i.size.width/Math.max(i.size.height,1),.1,400);n.position.set(0,0,58),t.setCamera(n);let s=new Bt;t.scene.add(s);let r=o0(),o=Math.max(4,Math.round(e.points*(r?.72:1))),a=o*o*2,c=[],l=new Float32Array(a*3),u=(o-1)/2,f=r0(e.seed);for(let M=0;M<2;M++)for(let O=0;O<o;O++)for(let D=0;D<o;D++){let F=c.length,L=(f()-.5)*e.spacing*.35,G=(f()-.5)*e.spacing*.35,P=new B((O-u)*e.spacing+L,(M===0?-1:1)*e.spacing*.45+(f()-.5)*8,(D-u)*e.spacing+G);c.push({base:P,phase:f()*Math.PI*2}),l[F*3]=P.x,l[F*3+1]=P.y,l[F*3+2]=P.z;}let h=new ct;h.setAttribute("position",new vt(l,3).setUsage(qi));let g=new rt({uniforms:{uColor:{value:new ne(e.color)},uSize:{value:e.pointSize},uPixelRatio:{value:i.size.dpr},uOpacity:{value:.95}},vertexShader:n0,fragmentShader:i0,transparent:true,depthWrite:false,blending:zt,toneMapped:false}),m=new mn(h,g);m.frustumCulled=false,s.add(m);let y=[];for(let M=0;M<a;M++)for(let O=M+1;O<a;O++)c[M].base.distanceTo(c[O].base)<=e.maxDistance&&y.push([M,O]);let p=new Float32Array(y.length*6),d=new ct;d.setAttribute("position",new vt(p,3).setUsage(qi));let S=new $n({color:e.color,transparent:true,opacity:.16,depthWrite:false,blending:zt}),C=new on(d,S);C.frustumCulled=false,s.add(C);let T=0,b=0,w=e,_=M=>{w=M,g.uniforms.uColor.value.set(M.color),g.uniforms.uSize.value=M.pointSize,S.color.set(M.color),m.visible=M.showDots,C.visible=M.showLines,t.renderer.setClearColor(M.backgroundColor,M.backgroundAlpha);};return _(e),{resize(M){n.aspect=M.width/Math.max(M.height,1),n.updateProjectionMatrix(),g.uniforms.uPixelRatio.value=M.dpr,t.resize(M);},render(M){let O=M.time*w.drift,D=h.getAttribute("position"),F=d.getAttribute("position");for(let L=0;L<c.length;L++){let G=c[L],P=Math.sin(O*.42+G.phase)*1.5,A=Math.cos(O*.35+G.phase*1.31)*1.15,k=Math.sin(O*.29+G.phase*.73)*1.5,U=G.base.x+P,j=G.base.y+A,W=G.base.z+k;l[L*3]=U,l[L*3+1]=j,l[L*3+2]=W,D.setXYZ(L,U,j,W);}D.needsUpdate=true;for(let L=0;L<y.length;L++){let[G,P]=y[L];F.setXYZ(L*2,l[G*3],l[G*3+1],l[G*3+2]),F.setXYZ(L*2+1,l[P*3],l[P*3+1],l[P*3+2]);}F.needsUpdate=true,M.pointer.active?(T=(M.pointer.ny-.5)*-0.28,b=(M.pointer.nx-.5)*.38):(T=0,b=0),s.rotation.x+=(T-s.rotation.x)*.05,s.rotation.y+=(b-s.rotation.y)*.05,t.render();},setOptions(M){_(M);},dispose(){je(t.scene),t.dispose();}}}});var a0=`
varying vec3 vNormal;
varying vec3 vView;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vView = normalize(-mvPosition.xyz);
  gl_Position = projectionMatrix * mvPosition;
}
`,l0=`
uniform vec3 uColor;
uniform vec3 uColor2;
uniform float uOpacity;
varying vec3 vNormal;
varying vec3 vView;

void main() {
  float fresnel = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 1.8);
  vec3 color = mix(uColor, uColor2, fresnel);
  gl_FragColor = vec4(color, (0.22 + fresnel * 0.78) * uOpacity);
}
`,c0={backgroundColor:2106408,backgroundAlpha:1,color:8978176,color2:16720469,rings:8,size:1,speed:1,seed:11},Yh=Ke({name:"rings",defaults:c0,setup(i,e){let t=Qe(i,{clearColor:e.backgroundColor,clearAlpha:e.backgroundAlpha}),n=new it(52,i.size.width/Math.max(i.size.height,1),.1,300);n.position.set(0,0,62),t.setCamera(n);let s=new Bt;s.rotation.x=.15,t.scene.add(s);let r=new Ss(1,.028,8,192),o=Ji(e.seed),a=Math.max(2,Math.min(14,Math.round(e.rings))),c=[],l=new ne(e.color),u=new ne(e.color2);for(let m=0;m<a;m++){let y=a>1?m/(a-1):0,p=new rt({uniforms:{uColor:{value:l.clone().lerp(u,y*.6)},uColor2:{value:u.clone().lerp(l,y*.5)},uOpacity:{value:.8+o()*.2}},vertexShader:a0,fragmentShader:l0,transparent:true,depthWrite:false,blending:zt,side:Kt}),d=new gt(r,p),S=6+o()*12;d.scale.setScalar(S),d.rotation.set(Math.PI/2+(o()-.5)*.7,m*.9+o()*.3,(o()-.5)*.55),s.add(d),c.push({mesh:d,material:p,baseRotation:d.rotation.clone(),speed:new B((o()-.5)*.28,(o()-.5)*.28,(o()-.5)*.28)});}let f=0,h=0,g=m=>{let y=new ne(m.color),p=new ne(m.color2);for(let d of c)d.material.uniforms.uColor.value.copy(y),d.material.uniforms.uColor2.value.copy(p);s.scale.setScalar(m.size*1.15),t.renderer.setClearColor(m.backgroundColor,m.backgroundAlpha);};return g(e),{resize(m){n.aspect=m.width/Math.max(m.height,1),n.updateProjectionMatrix(),t.resize(m);},render(m){let y=m.time*.6;for(let p of c)p.mesh.rotation.set(p.baseRotation.x+y*p.speed.x,p.baseRotation.y+y*p.speed.y,p.baseRotation.z+y*p.speed.z);m.pointer.active?(f=.15+(m.pointer.ny-.5)*-0.25,h=(m.pointer.nx-.5)*.4):(f=.15,h=0),s.rotation.x+=(f-s.rotation.x)*.04,s.rotation.y+=(h-s.rotation.y)*.04,t.render();},setOptions(m){g(m);},dispose(){je(t.scene),t.dispose();}}}});var h0=cn+`
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uBackground;
uniform float uAmplitude;
uniform float uRing;
uniform float uRotation;

void main() {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
  vec2 center = (uPointer - 0.5) * vec2(aspect, 1.0) * 0.9;
  float angle = uTime * 0.04 * uRotation;
  mat2 rotate = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  vec2 q = rotate * (p - center);

  float d = length(q);
  float t = uTime * 0.9;
  float wave = sin(d * 22.0 * uRing - t * 2.2) * exp(-d * 2.2);
  float wave2 = sin(d * 11.0 * uRing + t * 1.3) * exp(-d * 1.5);
  float ring = (wave * 0.65 + wave2 * 0.35) * uAmplitude;

  vec3 color = mix(uBackground, uColor1, smoothstep(1.0, 0.0, d) * 0.58);
  color = mix(color, uColor2, max(ring, 0.0) * 0.7);
  color += uColor1 * max(-ring, 0.0) * 0.34;
  color += uColor2 * smoothstep(0.12, 0.0, d) * 0.24;

  float vignette = smoothstep(1.35, 0.15, length(p * vec2(0.8, 1.0)));
  color *= 0.65 + vignette * 0.45;
  gl_FragColor = vec4(color, 1.0);
}
`,u0={color1:1784458,color2:16777215,backgroundColor:15791359,backgroundAlpha:1,amplitudeFactor:1,ringFactor:4,rotationFactor:.1},Zh=Ke({name:"ripple",defaults:u0,setup(i,e){let t=Qe(i,{clearColor:e.backgroundColor,clearAlpha:e.backgroundAlpha}),n={uResolution:{value:new Pe(i.size.width,i.size.height)},uPointer:{value:new Pe(.5,.5)},uTime:{value:0},uColor1:{value:new ne(e.color1)},uColor2:{value:new ne(e.color2)},uBackground:{value:new ne(e.backgroundColor)},uAmplitude:{value:e.amplitudeFactor},uRing:{value:e.ringFactor},uRotation:{value:e.rotationFactor}},s=Jt(h0,n);t.scene.add(s.mesh);let r=o=>{n.uColor1.value.set(o.color1),n.uColor2.value.set(o.color2),n.uBackground.value.set(o.backgroundColor),n.uAmplitude.value=o.amplitudeFactor,n.uRing.value=o.ringFactor,n.uRotation.value=o.rotationFactor,t.renderer.setClearColor(o.backgroundColor,o.backgroundAlpha);};return r(e),{resize(o){n.uResolution.value.set(o.width,o.height),t.resize(o);},render(o){n.uTime.value=o.time,n.uPointer.value.set(o.pointer.nx,o.pointer.ny),t.render();},setOptions(o){r(o);},dispose(){je(t.scene),t.dispose();}}}});var d0=`
uniform float uTime;
uniform float uAmp;
varying float vHeight;

float terrain(vec2 p) {
  float t = uTime * 0.28;
  float h = sin(p.x * 0.18 + t) * 0.5;
  h += sin(p.y * 0.22 - t * 0.8) * 0.4;
  h += sin((p.x + p.y) * 0.1 + t * 0.6) * 0.3;
  h += sin(length(p) * 0.25 - t) * 0.2;
  return h;
}

void main() {
  vec3 p = position;
  float h = terrain(p.xz);
  p.y += h * uAmp;
  vHeight = h;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`,f0=`
uniform vec3 uColor;
varying float vHeight;

void main() {
  vec3 color = mix(uColor * 0.12, uColor, smoothstep(-1.0, 1.0, vHeight));
  gl_FragColor = vec4(color, 0.62);
}
`,p0={color:9016910,backgroundColor:8738,backgroundAlpha:1,density:1,scale:1},Jh=Ke({name:"topology",defaults:p0,setup(i,e){let t=Qe(i,{clearColor:e.backgroundColor,clearAlpha:e.backgroundAlpha}),n=new it(55,i.size.width/Math.max(i.size.height,1),.1,400);n.position.set(0,34,76),n.lookAt(0,0,0),t.setCamera(n);let s=Math.max(24,Math.min(120,Math.round(64*e.density))),r=new gn(120,120,s,s);r.rotateX(-Math.PI/2);let o={uTime:{value:0},uAmp:{value:10*e.scale},uColor:{value:new ne(e.color)}},a=new rt({uniforms:o,vertexShader:d0,fragmentShader:f0,wireframe:true,transparent:true,depthWrite:false,blending:zt}),c=new gt(r,a);t.scene.add(c);let l=u=>{o.uColor.value.set(u.color),o.uAmp.value=10*u.scale,t.renderer.setClearColor(u.backgroundColor,u.backgroundAlpha);};return l(e),{resize(u){n.aspect=u.width/Math.max(u.height,1),n.updateProjectionMatrix(),t.resize(u);},render(u){o.uTime.value=u.time,t.render();},setOptions(u){l(u);},dispose(){je(t.scene),t.dispose();}}}});var m0=`
attribute vec3 color;
uniform float uTime;
uniform float uSway;
varying vec3 vColor;

void main() {
  vColor = color;
  vec3 p = position;
  float sway = sin(p.y * 0.08 + uTime * 0.8) * uSway * max(p.y, 0.0) * 0.012;
  p.x += sway;
  p.z += cos(p.y * 0.06 + uTime * 0.6) * uSway * max(p.y, 0.0) * 0.007;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`,g0=`
varying vec3 vColor;

void main() {
  gl_FragColor = vec4(vColor, 0.9);
}
`,_0={color:9979487,backgroundColor:2237478,backgroundAlpha:1,spacing:0,chaos:1,density:1,seed:23},$h=Ke({name:"trunk",defaults:_0,setup(i,e){let t=Qe(i,{clearColor:e.backgroundColor,clearAlpha:e.backgroundAlpha}),n=new it(48,i.size.width/Math.max(i.size.height,1),.1,400);n.position.set(0,6,68),n.lookAt(0,2,0),t.setCamera(n);let s=new Bt;s.scale.setScalar(1.3),t.scene.add(s);let r=Ji(e.seed),o=[],a=Math.max(4,Math.min(9,Math.round(5+e.density*2))),c=13+e.spacing,l=new B(0,-30,0),u=new B(0,1,0),f=.3+e.chaos*.45,h=(A,k,U,j)=>{let W=A.clone().addScaledVector(k,U);if(o.push({start:A.clone(),end:W,depth:j}),j>=a)return;let K=j<2?3:2;for(let ee=0;ee<K;ee++){let ye=new B(r()-.5,r()-.5,r()-.5).normalize(),Ne=(.22+r()*.5)*f,Z=k.clone().applyAxisAngle(ye,Ne).addScaledVector(u,.18+r()*.18).normalize();h(W,Z,U*(.66+r()*.12),j+1);}};h(l,u,c,0);let g=new Float32Array(o.length*6),m=new Float32Array(o.length*6),y=new ne(e.color),p=y.clone().offsetHSL(.05,.12,.26),d=new ne;for(let A=0;A<o.length;A++){let k=o[A],U=k.depth/a;d.copy(y).lerp(p,U),g[A*6]=k.start.x,g[A*6+1]=k.start.y,g[A*6+2]=k.start.z,g[A*6+3]=k.end.x,g[A*6+4]=k.end.y,g[A*6+5]=k.end.z,m[A*6]=d.r,m[A*6+1]=d.g,m[A*6+2]=d.b,m[A*6+3]=d.r,m[A*6+4]=d.g,m[A*6+5]=d.b;}let S=new ct,C=new vt(g,3),T=new vt(m,3);S.setAttribute("position",C),S.setAttribute("color",T);let b=[];for(let A of o)A.depth>=a&&b.push(A.end.x,A.end.y,A.end.z);let w=new ct;w.setAttribute("position",new ut(b,3));let _=$i({color:p,size:.55,opacity:.8,pixelRatio:i.size.dpr}),M=new mn(w,_);s.add(M);let O={uTime:{value:0},uSway:{value:1}},D=new rt({uniforms:O,vertexShader:m0,fragmentShader:g0,transparent:true,depthWrite:false,blending:zt}),F=new on(S,D);s.add(F);let L=0,G=0,P=A=>{O.uSway.value=.6+A.chaos,y=new ne(A.color),p=y.clone().offsetHSL(.05,.12,.26);for(let k=0;k<o.length;k++){let U=o[k];d.copy(y).lerp(p,U.depth/a),T.setXYZ(k*2,d.r,d.g,d.b),T.setXYZ(k*2+1,d.r,d.g,d.b);}T.needsUpdate=true,_.uniforms.uColor.value.copy(p),t.renderer.setClearColor(A.backgroundColor,A.backgroundAlpha);};return P(e),{resize(A){n.aspect=A.width/Math.max(A.height,1),n.updateProjectionMatrix(),_.uniforms.uPixelRatio.value=A.dpr,t.resize(A);},render(A){O.uTime.value=A.time,s.rotation.y=Math.sin(A.time*.12)*.35,A.pointer.active?(L=(A.pointer.ny-.5)*-0.2,G=(A.pointer.nx-.5)*.25):(L=0,G=0),s.rotation.x+=(L-s.rotation.x)*.04,s.rotation.z+=(G-s.rotation.z)*.04,t.render();},setOptions(A){P(A);},dispose(){je(t.scene),t.dispose();}}}});var v0=`
uniform float uTime;
uniform float uHeight;
uniform float uScale;
varying vec3 vWorld;
varying float vHeight;

float waveHeight(vec2 p) {
  float t = uTime;
  float h = 0.0;
  h += sin(p.x * 0.55 + t * 0.90) * 0.55;
  h += sin(p.y * 0.85 - t * 0.70) * 0.28;
  h += sin((p.x + p.y) * 0.38 + t * 0.55) * 0.17;
  h += sin(length(p) * 0.65 - t * 1.15) * 0.12;
  return h;
}

void main() {
  vec3 p = position;
  float h = waveHeight(p.xz * uScale);
  p.y += h * uHeight;
  vHeight = h;
  vec4 world = modelMatrix * vec4(p, 1.0);
  vWorld = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`,x0=`
uniform float uTime;
uniform vec3 uColor;
uniform vec3 uHighlight;
uniform vec3 uFog;
uniform vec3 uLight;
varying vec3 vWorld;
varying float vHeight;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  vec3 normal = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
  if (normal.y < 0.0) normal = -normal;

  vec3 viewDir = normalize(cameraPosition - vWorld);
  vec3 lightDir = normalize(uLight);
  float diffuse = max(dot(normal, lightDir), 0.0);
  vec3 halfDir = normalize(lightDir + viewDir);
  float specular = pow(max(dot(normal, halfDir), 0.0), 96.0);
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);

  float heightMix = smoothstep(-0.85, 0.85, vHeight);
  float crest = smoothstep(0.42, 1.0, heightMix);
  vec3 color = mix(uColor, uHighlight, crest * 0.82);
  color *= 0.32 + diffuse * 0.95;
  color += uHighlight * fresnel * 0.28;
  color += vec3(0.9, 0.97, 1.0) * specular * 1.15;

  float sparkle = step(0.994, hash21(floor(vWorld.xz * 3.2) + floor(uTime * 1.7)));
  color += sparkle * uHighlight * 0.35;

  float distanceToCamera = length(vWorld.xz - cameraPosition.xz);
  float fog = smoothstep(34.0, 86.0, distanceToCamera);
  color = mix(color, uFog, fog);

  gl_FragColor = vec4(color, 1.0);
}
`,y0={color:468024,highlightColor:6547199,backgroundColor:198413,backgroundAlpha:1,waveHeight:2.6,waveSpeed:.9,waveScale:.17,zoom:1};function M0(){return typeof window.matchMedia=="function"?window.matchMedia("(pointer: coarse)").matches:false}var Kh=Ke({name:"waves",defaults:y0,setup(i,e){let t=Qe(i,{clearColor:e.backgroundColor,clearAlpha:e.backgroundAlpha}),n=new it(42,i.size.width/Math.max(i.size.height,1),.1,400),s=new B(0,16,48);n.position.copy(s),n.lookAt(0,-4,4),t.setCamera(n);let r=M0(),o=new gn(140,100,r?96:180,r?64:128);o.rotateX(-Math.PI/2);let a={uTime:{value:0},uHeight:{value:e.waveHeight},uScale:{value:e.waveScale},uColor:{value:new ne(e.color)},uHighlight:{value:new ne(e.highlightColor)},uFog:{value:new ne(e.backgroundColor)},uLight:{value:new B(-0.45,.9,.35).normalize()}},c=new rt({uniforms:a,vertexShader:v0,fragmentShader:x0}),l=new gt(o,c);l.position.y=-7,t.scene.add(l);let u=s.x,f=s.y,h=e,g=m=>{h=m,a.uHeight.value=m.waveHeight,a.uScale.value=m.waveScale,a.uColor.value.set(m.color),a.uHighlight.value.set(m.highlightColor),a.uFog.value.set(m.backgroundColor),t.renderer.setClearColor(m.backgroundColor,m.backgroundAlpha),n.position.z=s.z/Math.max(m.zoom,.1);};return g(e),{resize(m){n.aspect=m.width/Math.max(m.height,1),n.updateProjectionMatrix(),t.resize(m);},render(m){a.uTime.value=m.time*h.waveSpeed,m.pointer.active?(u=s.x+(m.pointer.nx-.5)*12,f=s.y+(m.pointer.ny-.5)*-5):(u=s.x,f=s.y),n.position.x+=(u-n.position.x)*.045,n.position.y+=(f-n.position.y)*.045,n.lookAt(0,-4,4),t.render();},setOptions(m){g(m);},dispose(){je(t.scene),t.dispose();}}}});var xl=[{key:"waves",name:"Waves",description:"A displaced water surface with custom specular lighting and pointer parallax.",category:"geometry",tags:["geometry","lighting","water"],definition:Kh,options:{color:"#072438",highlightColor:"#63e6ff",waveHeight:2.6,waveSpeed:.9,waveScale:.17,zoom:1}},{key:"aurora",name:"Aurora",description:"Domain-warped FBM curtains under a field of stars.",category:"shader",tags:["shader","fbm","stars"],definition:Uh,options:{colorA:"#030814",colorB:"#35f0c8",colorC:"#8b5cff",intensity:1,scale:1}},{key:"net",name:"Net",description:"A drifting point lattice connected by additive lines.",category:"geometry",tags:["points","lines","additive"],definition:qh,options:{color:"#58d6ff",points:10,spacing:14,maxDistance:22,pointSize:.85,drift:1,seed:7}},{key:"fog",name:"Fog",description:"Layered procedural fog with a four-color vertical ramp.",category:"shader",tags:["shader","noise","fog"],definition:Vh,options:{highlightColor:"#ffc300",midtoneColor:"#ff1f00",lowlightColor:"#2d00ff",baseColor:"#ffebeb",backgroundColor:"#ffebeb",blurFactor:.6,zoom:1,scale:2}},{key:"clouds",name:"Clouds",description:"A sunset cloudscape with a sun disc and directional shading.",category:"shader",tags:["shader","clouds","sunset"],definition:kh,options:{backgroundColor:"#ffffff",skyColor:"#68b8d7",cloudColor:"#adc1de",cloudShadowColor:"#183550",sunColor:"#ff9919",sunGlareColor:"#ff6633",sunlightColor:"#ff9933",scale:3}},{key:"clouds2",name:"Clouds2",description:"Cosmic clouds, stars, and a cold blue palette.",category:"shader",tags:["shader","cosmic","stars"],definition:Hh,options:{backgroundColor:"#000000",skyColor:"#5ca6ca",cloudColor:"#334d80",lightColor:"#ffffff",scale:1.4}},{key:"cells",name:"Cells",description:"Animated Worley cells with glowing membranes.",category:"shader",tags:["shader","worley","organic"],definition:zh,options:{color1:"#008c8c",color2:"#f2e735",backgroundColor:"#d7ff8f",amplitudeFactor:1,ringFactor:1,rotationFactor:1,size:2}},{key:"ripple",name:"Ripple",description:"Pointer-driven concentric ripples on a calm surface.",category:"shader",tags:["shader","pointer","water"],definition:Zh,options:{color1:"#1b3a8a",color2:"#ffffff",backgroundColor:"#f0f4ff",amplitudeFactor:1,ringFactor:4,rotationFactor:.1}},{key:"dots",name:"Dots",description:"A rotating Fibonacci sphere of glowing points and thin links.",category:"geometry",tags:["points","sphere","fibonacci"],definition:Gh,options:{color:"#ff8820",color2:"#ff8820",backgroundColor:"#222222",size:3,spacing:35,showLines:true}},{key:"globe",name:"Globe",description:"A wireframe globe with linked nodes and an atmospheric rim.",category:"geometry",tags:["globe","wireframe","atmosphere"],definition:Wh,options:{color:"#ff3f81",color2:"#ffffff",backgroundColor:"#23153c",size:1,points:10,maxDistance:20,spacing:15,showDots:true}},{key:"halo",name:"Halo",description:"A radial halo with rotating filaments and thin rings.",category:"shader",tags:["shader","radial","glow"],definition:Xh,options:{baseColor:"#001a59",color2:"#f2e735",backgroundColor:"#131a43",amplitudeFactor:1,ringFactor:1,rotationFactor:1,size:1}},{key:"rings",name:"Rings",description:"Orbital neon rings assembled from additive, fresnel-shaded tori.",category:"geometry",tags:["torus","additive","orbital"],definition:Yh,options:{backgroundColor:"#202428",color:"#88ff00",color2:"#ff2255",rings:8,size:1,seed:11}},{key:"birds",name:"Birds",description:"A CPU boids flock rendered with instanced chevrons.",category:"simulation",tags:["boids","instancing","flock"],definition:Bh,options:{backgroundColor:"#07192f",color1:"#ff0000",color2:"#00d1ff",birdSize:1,wingSpan:30,speedLimit:5,separation:20,alignment:20,cohesion:20,quantity:5,seed:31}},{key:"topology",name:"Topology",description:"An animated wireframe topographic landscape.",category:"geometry",tags:["wireframe","terrain","shader"],definition:Jh,options:{color:"#89964e",backgroundColor:"#002222",density:1,scale:1}},{key:"trunk",name:"Trunk",description:"A recursive fractal tree with glowing tips and a slow sway.",category:"simulation",tags:["fractal","tree","lines"],definition:$h,options:{color:"#98465f",backgroundColor:"#222426",spacing:0,chaos:1,density:1,seed:23}}],Qh=new Map(xl.map(i=>[i.key,i]));var $M=Object.fromEntries(xl.map(i=>[i.key,i.definition])),KM="0.1.0";function QM(i,e,t={}){let n=Qh.get(i);if(!n)throw new Error(`[VantaJS2] Unknown effect: ${i}`);return $o(n.definition,{...n.options,...t,el:e})}/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/exports.catalog=xl;exports.createEffect=$o;exports.definitions=$M;exports.mount=QM;exports.version=KM;return exports;})({});