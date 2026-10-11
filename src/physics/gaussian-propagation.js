/** Scalar, coaxial Gaussian propagation in a single homogeneous medium.
 * q=z+i*zR; 1/q=1/R-i*lambda0/(pi*n*w^2). All lengths in micrometres.
 * Ideal thin lenses and an unfolded ideal plane mirror. No transverse/tilt model.
 */
const propagationPositive=(value,name)=>{if(!Number.isFinite(value)||value<=0)throw new RangeError(name+' must be positive and finite.');};
function propagationQ(q){if(!q||!Number.isFinite(q.re)||!Number.isFinite(q.im)||q.im<=0)throw new RangeError('Physical q requires finite real part and positive imaginary part.');return q;}
export function waistQ(radius,wavelength=1.55,index=1){
 propagationPositive(radius,'Radius');propagationPositive(wavelength,'Wavelength');propagationPositive(index,'Index');
 const im=Math.PI*index*radius*radius/wavelength;return propagationQ({re:0,im});
}
export function beamAtQ(q,wavelength=1.55,index=1){
 propagationQ(q);propagationPositive(wavelength,'Wavelength');propagationPositive(index,'Index');
 const norm=Math.hypot(q.re,q.im),radius=Math.sqrt(wavelength/(Math.PI*index))*norm/Math.sqrt(q.im);
 const inverseR=(q.re/norm)/norm,waist=Math.sqrt(wavelength*q.im/(Math.PI*index));
 if(!Number.isFinite(radius)||!Number.isFinite(waist)||radius<=0||waist<=0)throw new RangeError('Beam parameter overflow/underflow.');
 return {radius,inverseR,curvatureRadius:inverseR===0?Infinity:1/inverseR,waist,rayleighRange:q.im,waistDistance:-q.re};
}
export function multiplyABCD(left,right){
 for(const m of [left,right])if(!m||!['a','b','c','d'].every(k=>Number.isFinite(m[k])))throw new RangeError('Finite ABCD entries required.');
 const {a:A,b:B,c:C,d:D}=left,{a,b,c,d}=right;
 return {a:A*a+B*c,b:A*b+B*d,c:C*a+D*c,d:C*b+D*d};
}
export function freeSpaceABCD(length){if(!Number.isFinite(length))throw new RangeError('Finite propagation length required.');return {a:1,b:length,c:0,d:1};}
export function thinLensABCD(focalLength){if(!Number.isFinite(focalLength)||focalLength===0)throw new RangeError('Finite nonzero focal length required.');return {a:1,b:0,c:-1/focalLength,d:1};}
export function transformQ(q,matrix){
 propagationQ(q);if(!matrix||!['a','b','c','d'].every(k=>Number.isFinite(matrix[k])))throw new RangeError('Finite ABCD entries required.');
 const {a,b,c,d}=matrix,det=a*d-b*c;if(!Number.isFinite(det)||Math.abs(det-1)>1e-8)throw new RangeError('Same-medium ABCD determinant must equal 1.');
 const nr=a*q.re+b,ni=a*q.im,dr=c*q.re+d,di=c*q.im,scale=Math.max(Math.abs(dr),Math.abs(di));
 if(!Number.isFinite(scale)||scale===0)throw new RangeError('Singular/overflowing q transformation.');
 const r=dr/scale,i=di/scale,den=r*r+i*i;
 // Im(q')=det*Im(q)/|Cq+D|² avoids catastrophic imaginary cancellation.
 return propagationQ({re:((nr/scale)*r+(ni/scale)*i)/den,im:(q.im/scale)/scale/den});
}
export function propagateQ(q,length){return transformQ(q,freeSpaceABCD(length));}
export function lensQ(q,focalLength){return transformQ(q,thinLensABCD(focalLength));}
export function coaxialOverlap(q1,q2,wavelength=1.55,index=1){
 propagationQ(q1);propagationQ(q2);const b1=beamAtQ(q1,wavelength,index),b2=beamAtQ(q2,wavelength,index);
 const delta=q1.re-q2.re,sum=q1.im+q2.im,scale=Math.max(Math.abs(delta),sum);
 if(!Number.isFinite(scale))throw new RangeError('Overlap arithmetic overflow.');
 const logEfficiency=Math.min(0,Math.log(4)+Math.log(q1.im)+Math.log(q2.im)-2*Math.log(scale)-Math.log((delta/scale)**2+(sum/scale)**2));
 const overlapLoss=Math.max(0,-10/Math.LN10*logEfficiency);
 const logRatio=Math.abs(Math.log(b1.radius)-Math.log(b2.radius)),logAmplitude=Math.log(2)-logRatio-Math.log1p(Math.exp(-2*logRatio));
 const mismatchLoss=Math.max(0,-20/Math.LN10*logAmplitude),curvatureLoss=Math.max(0,overlapLoss-mismatchLoss);
 return {efficiency:Math.exp(logEfficiency),overlapLoss,mismatchLoss,curvatureLoss,incident:b1,target:b2};
}
export function validateOpticalPath(config){
 const {sourceRadius,targetRadius,wavelength=1.55,index=1,length,sourceWaistZ=0,lenses=[],foldAt=null,lensLoss=.1,mirrorLoss=.15}=config??{};
 waistQ(sourceRadius,wavelength,index);waistQ(targetRadius,wavelength,index);
 if(!Number.isFinite(length)||length<=0||!Number.isFinite(sourceWaistZ))throw new RangeError('Positive path length and finite waist position required.');
 if(!Array.isArray(lenses)||lenses.length>2)throw new RangeError('At most two ideal lenses supported.');
 let previous=0;for(const lens of lenses){if(!lens||!Number.isFinite(lens.z)||lens.z<=previous||lens.z>=length)throw new RangeError('Lens order: 0 < Lens A < Lens B < Receiver.');thinLensABCD(lens.f);previous=lens.z;}
 if(foldAt!==null&&(!Number.isFinite(foldAt)||foldAt<=0||foldAt>=length))throw new RangeError('Mirror must lie inside the unfolded path.');
 if(!Number.isFinite(lensLoss)||lensLoss<0||!Number.isFinite(mirrorLoss)||mirrorLoss<0)throw new RangeError('Fixed loss assumptions must be finite and nonnegative.');
 return {sourceRadius,targetRadius,wavelength,index,length,sourceWaistZ,lenses:lenses.map(l=>({z:l.z,f:l.f})),foldAt,lensLoss,mirrorLoss};
}
export function opticalPathQ(config,z=config.length){
 const c=validateOpticalPath(config);if(!Number.isFinite(z)||z<0||z>c.length)throw new RangeError('Probe must be on the optical path.');
 let q={...waistQ(c.sourceRadius,c.wavelength,c.index),re:-c.sourceWaistZ},previous=0;
 for(const lens of c.lenses){if(lens.z>z)break;q=lensQ(propagateQ(q,lens.z-previous),lens.f);previous=lens.z;}
 return propagateQ(q,z-previous);
}
export function evaluateOpticalPath(config){
 const c=validateOpticalPath(config),q=opticalPathQ(c),targetQ=waistQ(c.targetRadius,c.wavelength,c.index),result=coaxialOverlap(q,targetQ,c.wavelength,c.index);
 const fixedLoss=c.lenses.length*c.lensLoss+(c.foldAt===null?0:c.mirrorLoss),totalLoss=result.overlapLoss+fixedLoss;
 return {...result,q,targetQ,fixedLoss,totalLoss,totalEfficiency:result.efficiency*10**(-fixedLoss/10),error:0,thetaError:0,alignmentLoss:0,angularLoss:0,
 footprint:c.foldAt===null?{width:c.length,height:0}:{width:c.foldAt,height:c.length-c.foldAt}};
}
export function gapWindow(config,deltas=[-100,0,100]){
 if(!Array.isArray(deltas)||!deltas.length||!deltas.every(Number.isFinite))throw new RangeError('Finite probe offsets required.');
 const rows=deltas.map(delta=>({delta,result:evaluateOpticalPath({...config,length:config.length+delta})}));
 return {rows,worstLoss:Math.max(...rows.map(r=>r.result.totalLoss)),worst:rows.reduce((a,b)=>a.result.totalLoss>=b.result.totalLoss?a:b)};
}
