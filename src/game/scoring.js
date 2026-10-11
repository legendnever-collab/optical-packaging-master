// Game reward only; never changes the physics or PASS threshold.
export function gameScore(loss,target,attempts,hints=0) {
 if (!Number.isFinite(loss)||loss>target+1e-9) return 0;
 const accuracy=600+300*Math.max(0,1-loss/target);
 const efficiency=Math.max(0,100-4*Math.max(0,attempts-1));
 return Math.max(0,Math.round(accuracy+efficiency-20*hints));
}
