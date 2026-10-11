import {angularCoupling} from '../physics/angular-coupling.js';
export function escapeText(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
export function drawHistogram(svg,report){
 if(!report){svg.innerHTML='<text x="20" y="85" fill="#93a6b8" font-size="13">실험을 실행하면 Loss Distribution이 표시됩니다.</text>';return;}
 const max=Math.max(...report.histogram.map(b=>b.count),1);
 svg.innerHTML=report.histogram.map((b,i)=>{const height=b.count/max*95;return `<rect x="${40+i*52}" y="${120-height}" width="42" height="${height}" fill="${b.low<report.lossLimit?'#51d5df':'#e9b96b'}"/><text x="${61+i*52}" y="${115-height}" text-anchor="middle" fill="#93a6b8" font-size="10">${b.count}</text><text x="${61+i*52}" y="140" text-anchor="middle" fill="#93a6b8" font-size="9">${i===9?'≥': ''}${b.low.toFixed(1)}</text>`;}).join('')+`<text x="590" y="163" text-anchor="end" fill="#93a6b8" font-size="11">Total Loss (dB) · PASS ≤ ${report.lossLimit.toFixed(1)} dB</text>`;
 svg.setAttribute('aria-label',`Loss Distribution: ${report.passCount} Pass, ${report.failCount} Fail, P95 ${report.p95.toFixed(2)} dB. Last bin includes all larger losses.`);
}
export function drawSensitivity(svg,design,kind){
 const signature=JSON.stringify([design,kind]);if(svg.dataset.signature===signature)return;svg.dataset.signature=signature;
 const cells=20,step=160/cells;let paths='';
 for(let i=0;i<cells;i++)for(let j=0;j<cells;j++){const x=(i+.5)/cells*4-2,y=(j+.5)/cells*4-2,state={...design,dx:kind==='lateral'?x:0,dy:kind==='lateral'?y:0,thetaX:kind==='angular'?x:0,thetaY:kind==='angular'?y:0},loss=angularCoupling(state).totalLoss,intensity=Math.exp(-loss*Math.LN10/10);paths+=`<rect x="${40+i*step}" y="${30+j*step}" width="${step+.2}" height="${step+.2}" fill="rgb(${Math.round(35+45*intensity)},${Math.round(45+150*intensity)},${Math.round(60+155*intensity)})"><title>${x.toFixed(2)}, ${y.toFixed(2)}: ${loss.toFixed(2)} dB · ${loss<=1?'PASS':'FAIL'}</title></rect>`;}
 svg.innerHTML=paths+`<text x="120" y="18" text-anchor="middle" fill="#b5c4d0" font-size="12">${kind==='lateral'?'Lateral X/Y':'Angular θx/θy'} · w₁ ${design.w1.toFixed(1)}</text><text x="120" y="210" text-anchor="middle" fill="#93a6b8" font-size="11">−2 ← ${kind==='lateral'?'X (µm)':'θx (°)'} → +2</text><text x="7" y="108" fill="#93a6b8" font-size="10">${kind==='lateral'?'Y µm':'θy °'}</text>`;
 svg.setAttribute('aria-label',`${kind} Loss map at Fiber radius ${design.w1}, Waveguide radius ${design.w2}. Both axes span -2 to +2. Total Loss includes mismatch. Brightness encodes calculated transmitted fraction; each cell title reports exact Loss and Pass/Fail.`);
}
