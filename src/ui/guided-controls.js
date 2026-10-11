// UI-only controls: dispatch the existing input path; never keep a second physics state.
export function installFineControls(root, specs) {
 for (const [id, step, unit] of specs) {
  const input=root.querySelector('#'+id);
  if(!input || root.querySelector(`[data-fine-for="${id}"]`))continue;
  const row=document.createElement('div');row.className='fine-controls';row.dataset.fineFor=id;
  const name=input.getAttribute('aria-label')||input.closest('label')?.childNodes[0]?.textContent.trim()||root.querySelector(`label[for="${id}"]`)?.textContent.trim()||id;
  for(const sign of [-1,1]){
   const b=document.createElement('button');b.type='button';b.className='secondary fine-button';b.textContent=sign<0?'−':'+';b.dataset.fineSign=sign;b.setAttribute('aria-label',`${name} ${sign<0?'감소':'증가'} ${step} ${unit}`);
   b.addEventListener('click',()=>{if(input.disabled||!input.getClientRects().length)return;
    input.value=String(Math.round(Math.max(Number(input.min),Math.min(Number(input.max),Number(input.value)+sign*step))*10000)/10000);
    input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));
   });row.append(b);
   if(sign<0){const o=document.createElement('output');o.dataset.fineUnit=unit;o.dataset.fineDecimals=step<1?'2':'0';row.append(o);}
  }input.before(row);
 }syncFineControls(root);
}
export function syncFineControls(root) {
 for(const row of root.querySelectorAll('[data-fine-for]')){
  const input=root.querySelector('#'+row.dataset.fineFor);if(!input)continue;
  const o=row.querySelector('output'),v=Number(input.value),n=Number(o.dataset.fineDecimals);
  o.textContent=(v>0?'+':'')+(Math.abs(v)<.5*10**-n?0:v).toFixed(n)+' '+o.dataset.fineUnit;
  for(const b of row.querySelectorAll('button'))b.disabled=input.disabled||(Number(b.dataset.fineSign)<0?v<=Number(input.min):v>=Number(input.max));
 }
}
export function highlightAction(root, targetId) {
 for(const el of root.querySelectorAll('.next-target')){el.classList.remove('next-target');el.removeAttribute('data-next');}
 if(!targetId)return null;
 const target=root.querySelector('#'+targetId);if(!target||target.disabled||target.hidden)return null;
 // Closed Details are opened only by explicit reveal, preserving the user's view while editing.
 if(target.closest('[hidden]'))return null;
 const mark=target.matches('input[type=range]')?root.querySelector(`[data-fine-for="${targetId}"]`)||target:target.matches('select')?target.closest('label')||target:target;
 mark.classList.add('next-target');mark.dataset.next='NEXT →';return target;
}
export function revealAction(target, focus=true) {
 if(!target||target.disabled)return;
 for(let el=target.parentElement;el;el=el.parentElement)if(el.tagName==='DETAILS')el.open=true;
 target.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 if(focus)target.focus({preventScroll:true});
}
