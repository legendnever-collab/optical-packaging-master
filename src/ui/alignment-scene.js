export class AlignmentScene {
 constructor(canvas,getState,onMove,onAttempt) {
  this.canvas=canvas;this.ctx=canvas.getContext('2d');this.getState=getState;this.onMove=onMove;this.onAttempt=onAttempt;this.drag=null;
  this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  new ResizeObserver(()=>this.draw()).observe(canvas);
  canvas.addEventListener('pointerdown',e=>this.down(e));
  canvas.addEventListener('pointermove',e=>this.move(e));
  for(const event of ['pointerup','pointercancel','lostpointercapture']) canvas.addEventListener(event,e=>this.up(e));
  canvas.addEventListener('keydown',e=>{
   const s=this.getState();if (!s.enabled || !['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) return;
   e.preventDefault();const d=e.shiftKey?.01:.1;
   this.onMove(s.dx+(e.key==='ArrowLeft'?-d:e.key==='ArrowRight'?d:0),s.dy+(e.key==='ArrowUp'?d:e.key==='ArrowDown'?-d:0));this.onAttempt();
  });
  const tick=t=>{if(!this.reduced && !document.hidden)this.draw(t);this.frame=requestAnimationFrame(tick);};
  this.frame=requestAnimationFrame(tick);
 }
 dimensions(){const r=this.canvas.getBoundingClientRect();return {width:r.width,height:r.height,scale:Math.min(r.width,r.height)/14};}
 point(e){const r=this.canvas.getBoundingClientRect(),{scale}=this.dimensions();return {x:(e.clientX-r.left-r.width/2)/scale,y:-(e.clientY-r.top-r.height/2)/scale};}
 down(e){const s=this.getState();if(!s.enabled || e.button>0 || this.drag)return;const p=this.point(e),{scale}=this.dimensions();if(Math.hypot(p.x-s.dx,p.y-s.dy)>Math.max(s.w1,24/scale))return;
  this.canvas.focus({preventScroll:true});this.canvas.setPointerCapture(e.pointerId);this.drag={id:e.pointerId,ox:s.dx-p.x,oy:s.dy-p.y,moved:false};this.canvas.classList.add('dragging');e.preventDefault();}
 move(e){if(!this.drag || this.drag.id!==e.pointerId)return;const p=this.point(e);this.drag.moved=true;this.onMove(p.x+this.drag.ox,p.y+this.drag.oy);}
 up(e){if(!this.drag || this.drag.id!==e.pointerId)return;const d=this.drag;this.drag=null;this.canvas.classList.remove('dragging');if(this.canvas.hasPointerCapture(e.pointerId))this.canvas.releasePointerCapture(e.pointerId);if(d.moved)this.onAttempt();}
 draw(time=0){const s=this.getState(),c=this.ctx,{width:w,height:h,scale:k}=this.dimensions();if(!w||!h)return;const dpr=Math.min(devicePixelRatio||1,2);
  if(this.canvas.width!==Math.round(w*dpr)||this.canvas.height!==Math.round(h*dpr)){this.canvas.width=Math.round(w*dpr);this.canvas.height=Math.round(h*dpr);}
  c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);const cx=w/2,cy=h/2;
  c.strokeStyle='#1c2b3b';c.lineWidth=.7;
  for(let i=-6;i<=6;i++){c.beginPath();c.moveTo(cx+i*k,cy-6*k);c.lineTo(cx+i*k,cy+6*k);c.stroke();c.beginPath();c.moveTo(cx-6*k,cy+i*k);c.lineTo(cx+6*k,cy+i*k);c.stroke();}
  c.strokeStyle='#3c5063';c.lineWidth=1;c.beginPath();c.moveTo(cx-6.5*k,cy);c.lineTo(cx+6.5*k,cy);c.moveTo(cx,cy-6.5*k);c.lineTo(cx,cy+6.5*k);c.stroke();
  c.fillStyle='#6e869b';c.font='9px monospace';c.textAlign='center';for(const i of [-6,-4,-2,2,4,6]){c.fillText(i.toString(),cx+i*k,cy+13);c.fillText(i.toString(),cx-13,cy-i*k+3);}c.fillText('X',cx+6.5*k,cy-8);c.fillText('Y',cx+11,cy-6.5*k);
  if(s.tolerance!==null&&s.showTolerance){c.beginPath();c.arc(cx,cy,s.tolerance*k,0,Math.PI*2);c.fillStyle='#e9b96b0b';c.fill();c.setLineDash([4,4]);c.strokeStyle='#e9b96b8c';c.stroke();c.setLineDash([]);}
  const heat=(x,y,r,rgb)=>{const radius=2*r*k,g=c.createRadialGradient(x,y,0,x,y,radius);for(let i=0;i<=20;i++){const t=i/20;g.addColorStop(t,`rgba(${rgb},${.68*Math.exp(-8*t*t)})`);}c.fillStyle=g;c.beginPath();c.arc(x,y,radius,0,2*Math.PI);c.fill();c.beginPath();c.arc(x,y,r*k,0,2*Math.PI);c.strokeStyle=`rgba(${rgb},.55)`;c.lineWidth=1;c.stroke();};
  heat(cx,cy,s.w2,'117,158,244');c.globalCompositeOperation='screen';heat(cx+s.dx*k,cy-s.dy*k,s.w1,'81,213,223');c.globalCompositeOperation='source-over';
  const fx=cx+s.dx*k,fy=cy-s.dy*k;c.setLineDash([3,4]);c.strokeStyle='#e9b96b99';c.beginPath();c.moveTo(cx,cy);c.lineTo(fx,fy);c.stroke();c.setLineDash([]);
  const marker=(x,y,color)=>{c.strokeStyle=color;c.lineWidth=1.5;c.beginPath();c.moveTo(x-6,y);c.lineTo(x+6,y);c.moveTo(x,y-6);c.lineTo(x,y+6);c.stroke();c.beginPath();c.arc(x,y,11,0,Math.PI*2);c.stroke();};marker(cx,cy,'#759ef4');marker(fx,fy,'#70e7ec');
  // Transmission pulses are explicitly a power indicator, not longitudinal rays.
  c.fillStyle='#71899e';c.font='8px monospace';c.textAlign='left';c.fillText('RELATIVE MODE INTENSITY',12,18);c.fillText('POWER INDICATOR',12,h-15);
  const power=s.result.totalEfficiency;c.strokeStyle=`rgba(81,213,223,${power*.75})`;c.lineWidth=2;c.beginPath();c.moveTo(w*.43,h-18);c.lineTo(w-20,h-18);c.stroke();
  for(let i=0;i<5;i++){const phase=this.reduced?i/5:((time/1800+i/5)%1);c.fillStyle=`rgba(133,237,242,${power})`;c.beginPath();c.arc(w*.43+(w*.57-20)*phase,h-18,2+2*power,0,2*Math.PI);c.fill();}
 }
}
