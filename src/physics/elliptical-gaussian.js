/** Normalized scalar 2D Gaussian fields. Radii = field 1/e, lengths in µm.
 * E(r)=N exp(-(r-d)^T(A+iB)(r-d)+i k theta.r), N²=2 sqrt(det A)/pi.
 * A=R diag(1/wx²,1/wy²) R^T. B=k/2 * curvature matrix.
 * Exact complex Gaussian integral includes displacement/curvature/tilt cross effects.
 * This is not a full-vector silicon mode solver. */
const egC=(re,im=0)=>({re,im});
const egAdd=(a,b)=>egC(a.re+b.re,a.im+b.im);
const egSub=(a,b)=>egC(a.re-b.re,a.im-b.im);
const egMul=(a,b)=>egC(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re);
const egScale=(a,s)=>egC(a.re*s,a.im*s);
const egDiv=(a,b)=>{const den=b.re*b.re+b.im*b.im;return egC((a.re*b.re+a.im*b.im)/den,(a.im*b.re-a.re*b.im)/den);};
export function modePrecision(mode){
 const {wx,wy,angle=0}=mode??{};
 if(![wx,wy,angle].every(Number.isFinite)||wx<.1||wy<.1||wx>200||wy>200||Math.abs(angle)>360)throw new RangeError('Gaussian domain: radii 0.1–200 µm; orientation within ±360°.');
 const t=angle*Math.PI/180,c=Math.cos(t),s=Math.sin(t),a=1/wx**2,b=1/wy**2;
 return {xx:c*c*a+s*s*b,xy:c*s*(a-b),yy:s*s*a+c*c*b,det:a*b};
}
export function gaussianField(mode,x,y){
 if(![x,y].every(Number.isFinite))throw new RangeError('Finite field coordinates required.');
 const a=modePrecision(mode),intensityNormalization=2*Math.sqrt(a.det)/Math.PI;
 return Math.sqrt(intensityNormalization)*Math.exp(-(a.xx*x*x+2*a.xy*x*y+a.yy*y*y));
}
export function ellipticalOverlap({source,target,dx=0,dy=0,thetaX=0,thetaY=0,wavelength=1.55,index=1,fixedLoss=0,sourceCurvature={xx:0,xy:0,yy:0},targetCurvature={xx:0,xy:0,yy:0}}){
 const a1=modePrecision(source),a2=modePrecision(target);
 if(![dx,dy,thetaX,thetaY,wavelength,index,fixedLoss].every(Number.isFinite)||wavelength<=0||index<=0||fixedLoss<0||Math.abs(thetaX)>5||Math.abs(thetaY)>5||Math.abs(dx)>10000||Math.abs(dy)>10000)throw new RangeError('Finite common-plane inputs, positive wavelength/index, nonnegative fixed loss; tilt ±5°.');
 for(const c of [sourceCurvature,targetCurvature])if(!c||!['xx','xy','yy'].every(k=>Number.isFinite(c[k])&&Math.abs(c[k])<=10))throw new RangeError('Finite symmetric inverse-curvature matrix required.');
 const k=2*Math.PI*index/wavelength;
 const h1={xx:egC(a1.xx,k/2*sourceCurvature.xx),xy:egC(a1.xy,k/2*sourceCurvature.xy),yy:egC(a1.yy,k/2*sourceCurvature.yy)};
 const h2={xx:egC(a2.xx,-k/2*targetCurvature.xx),xy:egC(a2.xy,-k/2*targetCurvature.xy),yy:egC(a2.yy,-k/2*targetCurvature.yy)};
 const s={xx:egAdd(h1.xx,h2.xx),xy:egAdd(h1.xy,h2.xy),yy:egAdd(h1.yy,h2.yy)};
 const det=egSub(egMul(s.xx,s.yy),egMul(s.xy,s.xy));
 const inv={xx:egDiv(s.yy,det),xy:egScale(egDiv(s.xy,det),-1),yy:egDiv(s.xx,det)};
 // curvature sign is exp(-i kr²/2R); ray tilt is therefore exp(-i k theta.r).
 const lx=egAdd(egScale(egAdd(egScale(h1.xx,dx),egScale(h1.xy,dy)),2),egC(0,-k*thetaX*Math.PI/180));
 const ly=egAdd(egScale(egAdd(egScale(h1.xy,dx),egScale(h1.yy,dy)),2),egC(0,-k*thetaY*Math.PI/180));
 const quad=egAdd(egAdd(egMul(egMul(lx,lx),inv.xx),egScale(egMul(egMul(lx,ly),inv.xy),2)),egMul(egMul(ly,ly),inv.yy));
 const constant=egAdd(egAdd(egScale(h1.xx,dx*dx),egScale(h1.xy,2*dx*dy)),egScale(h1.yy,dy*dy));
 const logPrefactor=Math.log(4)+.5*(Math.log(a1.det)+Math.log(a2.det))-Math.log(Math.hypot(det.re,det.im));
 const logEta=Math.min(0,logPrefactor-2*constant.re+.5*quad.re);
 if(!Number.isFinite(logEta))throw new RangeError('Gaussian integral outside numeric domain.');
 const overlapLoss=Math.max(0,-10/Math.LN10*logEta),totalLoss=overlapLoss+fixedLoss;
 return {efficiency:Math.exp(logEta),totalEfficiency:Math.exp(logEta-fixedLoss*Math.LN10/10),overlapLoss,totalLoss,fixedLoss,modelVersion:'normalized-complex-gaussian-2d-v1'};
}
export function ellipticalCoupling(input){
 const result=ellipticalOverlap(input),base=ellipticalOverlap({...input,dx:0,dy:0,thetaX:0,thetaY:0,fixedLoss:0});
 const lateral=ellipticalOverlap({...input,thetaX:0,thetaY:0,fixedLoss:0});
 // Only the planar real-field specialization decomposes into independent positive losses.
 const planar=!input.sourceCurvature&&!input.targetCurvature;
 return {...result,mismatchLoss:base.overlapLoss,alignmentLoss:planar?Math.max(0,lateral.overlapLoss-base.overlapLoss):null,angularLoss:planar?Math.max(0,result.overlapLoss-lateral.overlapLoss):null};
}
