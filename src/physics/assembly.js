import {angularCoupling} from './angular-coupling.js';
export const assemblyAxes=['dx','dy','thetaX','thetaY'];
export function validateProcess(process){
 for(const axis of assemblyAxes){const p=process?.[axis];if(!p||![p.bias,p.sigma].every(Number.isFinite)||p.sigma<0)throw new RangeError('Each process axis needs finite bias and nonnegative sigma.');}
 return Object.fromEntries(assemblyAxes.map(axis=>[axis,{...process[axis]}]));
}
export function randomGenerator(seed){
 if(!Number.isInteger(seed)||seed<0||seed>0xffffffff)throw new RangeError('Seed must be a uint32.');
 let value=seed;
 return ()=>{value=(value+0x6D2B79F5)>>>0;let t=value;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};
}
export function normalGenerator(seed){const random=randomGenerator(seed);let spare=null;return ()=>{if(spare!==null){const v=spare;spare=null;return v;}const u=1-random(),v=random(),r=Math.sqrt(-2*Math.log(u)),angle=2*Math.PI*v;spare=r*Math.sin(angle);return r*Math.cos(angle);};}
export function generateSamples({count,seed,process}){
 if(!Number.isInteger(count)||count<1||count>10000)throw new RangeError('Sample count must be 1–10000.');
 const config=validateProcess(process),normal=normalGenerator(seed),samples=[];
 for(let i=0;i<count;i++){const sample={};for(const axis of assemblyAxes){const p=config[axis];sample[axis]=p.bias+p.sigma*normal();if(!Number.isFinite(sample[axis]))throw new RangeError('Process sample overflow.');}samples.push(sample);}
 return {seed,count,process:config,samples};
}
export function wilsonInterval(passes,count){
 if(!Number.isInteger(count)||count<1||!Number.isInteger(passes)||passes<0||passes>count)throw new RangeError('Valid binomial counts required.');
 const z=1.959963984540054,p=passes/count,d=1+z*z/count,center=(p+z*z/(2*count))/d,half=z*Math.sqrt(p*(1-p)/count+z*z/(4*count*count))/d;
 return {low:Math.max(0,center-half),high:Math.min(1,center+half),level:.95,method:'Wilson score'};
}
export function lossQuantile(sorted,p){if(!sorted.length||!Number.isFinite(p)||p<0||p>1)throw new RangeError('Nonempty sorted losses and quantile in [0,1] required.');return sorted[Math.max(0,Math.ceil(p*sorted.length)-1)];}
export function evaluateDesign(design,cohort,lossLimit=1){
 if(!Number.isFinite(lossLimit)||lossLimit<0||!cohort?.samples?.length||cohort.count!==cohort.samples.length)throw new RangeError('Valid cohort and nonnegative Loss limit required.');
 const nominal={dx:0,dy:0,thetaX:0,thetaY:0,...design.nominal},nominalResult=angularCoupling({...design,...nominal});
 const rows=cohort.samples.map((sample,i)=>{
  const state={...design};for(const axis of assemblyAxes){if(!Number.isFinite(sample[axis]))throw new RangeError('Finite sample required.');state[axis]=nominal[axis]+sample[axis];}
  // Never truncate or silently discard out-of-domain angular samples.
  if(Math.abs(state.thetaX)>5||Math.abs(state.thetaY)>5)throw new RangeError('Assembly sample outside ±5° phase-tilt model domain. No Yield computed.');
  const result=angularCoupling(state),dominant=[['Mismatch',result.mismatchLoss],['Lateral',result.alignmentLoss],['Angular',result.angularLoss],['Fixed',result.fixedLoss]].sort((a,b)=>b[1]-a[1])[0][0];
  return {index:i,state,result,pass:result.totalLoss<=lossLimit+1e-9,dominant};
 });
 const passCount=rows.filter(r=>r.pass).length,sorted=rows.map(r=>r.result.totalLoss).sort((a,b)=>a-b),p95=lossQuantile(sorted,.95),worst=rows.reduce((a,b)=>a.result.totalLoss>=b.result.totalLoss?a:b);
 const histogram=Array.from({length:10},(_,i)=>({low:i*lossLimit/5,high:(i+1)*lossLimit/5,count:0}));
 for(const loss of sorted){const i=lossLimit===0?loss===0?0:9:Math.min(9,Math.floor(loss/(lossLimit/5)));histogram[i].count++;}
 return {count:rows.length,passCount,failCount:rows.length-passCount,yield:passCount/rows.length,interval:wilsonInterval(passCount,rows.length),nominalLoss:nominalResult.totalLoss,p95,worst,rows,histogram,robustness:lossLimit-p95,lossLimit,seed:cohort.seed,process:validateProcess(cohort.process)};
}
export function sensitivityCurve(design,kind){
 if(!['lateral','angular'].includes(kind))throw new RangeError('Unknown sensitivity axis.');
 return Array.from({length:25},(_,i)=>{const error=i/24*(kind==='lateral'?3:3);return {error,loss:angularCoupling({...design,dx:kind==='lateral'?error:0,dy:0,thetaX:kind==='angular'?error:0,thetaY:0}).totalLoss};});
}
