import {ellipticalCoupling} from './elliptical-gaussian.js';
export const fauModel='independent-common-plane-fau-v1';
/** Isolated parallel channels. In-plane array rotation moves centers; it is NOT phase tilt. */
export function evaluateFAU({count=4,pitch=127,targetPitch=127,rotation=0,dx=0,dy=0,thetaX=0,thetaY=0,source={wx:5.2,wy:5.2,angle:0},target={wx:4.8,wy:4.8,angle:0},wavelength=1.55,fixedLoss=.25,localErrors=null,lossLimit=1}={}){
 if(![4,8,16].includes(count)||![pitch,targetPitch,rotation,dx,dy,lossLimit].every(Number.isFinite)||pitch<120||pitch>134||targetPitch<120||targetPitch>134||Math.abs(rotation)>5||Math.abs(dx)>100||Math.abs(dy)>100||lossLimit<0)throw new RangeError('FAU geometry outside declared domain.');
 if(localErrors!==null&&(!Array.isArray(localErrors)||localErrors.length!==count))throw new RangeError('One local XY error per channel required.');
 const t=rotation*Math.PI/180,c=Math.cos(t),s=Math.sin(t);
 const channels=Array.from({length:count},(_,index)=>{
  const slot=index-(count-1)/2,local=localErrors?.[index]??{dx:0,dy:0};
  if(![local.dx,local.dy].every(Number.isFinite))throw new RangeError('Finite local channel errors required.');
  const targetCenter={x:slot*targetPitch,y:0},sourceCenter={x:dx+slot*pitch*c+local.dx,y:dy+slot*pitch*s+local.dy};
  const offset={dx:sourceCenter.x-targetCenter.x,dy:sourceCenter.y-targetCenter.y};
  const result=ellipticalCoupling({source,target,...offset,thetaX,thetaY,wavelength,fixedLoss});
  return {index,targetCenter,sourceCenter,...offset,result,pass:result.totalLoss<=lossLimit+1e-9};
 });
 const worst=channels.reduce((a,b)=>a.result.totalLoss>=b.result.totalLoss?a:b),good=channels.filter(c=>c.pass).length;
 return {modelVersion:fauModel,count,channels,good,pass:good===count,averagePower:channels.reduce((s,c)=>s+c.result.totalEfficiency,0)/count,worstPower:worst.result.totalEfficiency,worstLoss:worst.result.totalLoss,worstChannel:worst.index,lossLimit};
}
