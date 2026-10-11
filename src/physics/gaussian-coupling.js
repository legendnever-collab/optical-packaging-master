// Independent scalar Gaussian physics; every length is in micrometres.
export function gaussianCoupling({w1, w2, dx=0, dy=0, fixedLoss=0}) {
  if (![w1,w2,dx,dy,fixedLoss].every(Number.isFinite) || w1<=0 || w2<=0 || fixedLoss<0)
    throw new RangeError('Finite positive radii, finite offsets and nonnegative fixedLoss required.');
  const l1=Math.log(w1), l2=Math.log(w2), top=Math.max(l1,l2);
  const logSum=2*top+Math.log(Math.exp(2*(l1-top))+Math.exp(2*(l2-top)));
  const logPrefactor=Math.min(0,2*(Math.LN2+l1+l2-logSum));
  const r=Math.hypot(dx,dy);
  const radiusScale=Math.max(w1,w2),a=w1/radiusScale,b=w2/radiusScale;
  const offsetExponent=2*((dx/radiusScale)**2+(dy/radiusScale)**2)/(a*a+b*b);
  const logEta=logPrefactor-offsetExponent;
  const efficiency=Math.min(1,Math.max(0,Math.exp(logEta)));
  const mismatchLoss=Math.max(0,-10/Math.LN10*logPrefactor);
  const alignmentLoss=10/Math.LN10*offsetExponent;
  const overlapLoss=mismatchLoss+alignmentLoss;
  const totalLoss=overlapLoss+fixedLoss;
  return {efficiency, totalEfficiency:Math.exp(logEta-fixedLoss*Math.LN10/10), mismatchLoss, alignmentLoss, overlapLoss, fixedLoss, totalLoss, error:r};
}
export function alignmentTolerance(w1,w2,targetLoss,fixedLoss=0) {
  if (!Number.isFinite(targetLoss) || targetLoss<0) throw new RangeError('Nonnegative finite target loss required.');
  const base=gaussianCoupling({w1,w2,fixedLoss}).totalLoss;
  if (targetLoss<base) return null; // Impossible target, not a zero-tolerance success.
  const budget=targetLoss-base;
  if (budget===0) return 0;
  const scale=Math.max(w1,w2),sum=(w1/scale)**2+(w2/scale)**2;
  return Math.exp(Math.log(scale)+.5*(Math.log(sum)+Math.log(budget)+Math.log(Math.LN10/20)));
}
export function compareModes(dx,dy,matched=true) {
  return [1.5,2.5,4].map((w1,i)=>({name:['Narrow','Medium','Expanded'][i],w1,w2:matched?w1:2.5,...gaussianCoupling({w1,w2:matched?w1:2.5,dx,dy}),tolerance:alignmentTolerance(w1,matched?w1:2.5,1)}));
}
