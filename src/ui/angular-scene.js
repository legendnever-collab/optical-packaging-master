export class AngularScene {
 constructor(svg,axis,state,move,attempt){this.svg=svg;this.axis=axis;this.state=state;this.move=move;this.attempt=attempt;this.pointer=null;
 svg.addEventListener('pointerdown',e=>{if(!state().enabled||!e.target.closest('[data-handle]'))return;e.preventDefault();this.pointer=e.pointerId;svg.setPointerCapture(e.pointerId);this.update(e);});
 svg.addEventListener('pointermove',e=>{if(this.pointer===e.pointerId)this.update(e);});
 const end=e=>{if(this.pointer!==e.pointerId)return;this.pointer=null;if(svg.hasPointerCapture(e.pointerId))svg.releasePointerCapture(e.pointerId);attempt();};svg.addEventListener('pointerup',end);svg.addEventListener('pointercancel',end);svg.addEventListener('lostpointercapture',end);
 svg.addEventListener('keydown',e=>{if(!state().enabled||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();move(state().theta+(['ArrowLeft','ArrowDown'].includes(e.key)?-1:1)*(e.shiftKey?.01:.1));attempt();});
 }
 update(e){const point=this.svg.createSVGPoint();point.x=e.clientX;point.y=e.clientY;const local=point.matrixTransform(this.svg.getScreenCTM().inverse());this.move(Math.atan2(local.y-75,210-local.x)*180/Math.PI/4);}
 draw(){const {theta,enabled}=this.state(),y=75+Math.tan(theta*Math.PI/180*4)*160;this.svg.setAttribute('aria-valuenow',theta.toFixed(2));this.svg.setAttribute('aria-disabled',String(!enabled));
 // Keep the captured pointer target stable while rendering each movement.
 if(!this.svg.firstChild)this.svg.innerHTML='<path d="M20 75H270 M210 25V125" stroke="#304355"/><path d="M210 75H270" stroke="#759ef4" stroke-width="5"/><path data-ray stroke="#51d5df" stroke-width="3"/><circle data-handle r="12" fill="#172d38" stroke="#51d5df" stroke-width="2"/><circle data-center cx="210" cy="75" r="4" fill="#e9b96b"/><text x="218" y="140" fill="#93a6b8" font-size="10">Z →</text><text data-angle x="16" y="20" fill="#e9b96b" font-size="12"/>';
 this.svg.querySelector('[data-ray]').setAttribute('d',`M50 ${y}L210 75`);const handle=this.svg.querySelector('[data-handle]');handle.setAttribute('cx','50');handle.setAttribute('cy',String(y));handle.style.opacity=enabled?'1':'.4';this.svg.querySelector('[data-angle]').textContent=`θ${this.axis} ${theta>=0?'+':''}${theta.toFixed(2)}° · 4×`;
 }
}
