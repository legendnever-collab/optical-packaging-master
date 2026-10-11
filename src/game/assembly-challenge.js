import {angularCoupling} from '../physics/angular-coupling.js';
import {generateSamples,wilsonInterval,lossQuantile} from '../physics/assembly.js';
export const challengeVersion='datum-assembly-v1';
export const factoryOrder={count:100,minGood:95,costBudget:4800,timeBudget:3200,lossLimit:1,seed:20261012};
export const fixtures={
 economy:{name:'Economy Fixture',width:600,length:600,sigma:.70,angleSigma:.35,cost:12,time:8},
 precision:{name:'Precision Fixture',width:760,length:600,sigma:.12,angleSigma:.06,cost:24,time:12},
 oversized:{name:'Oversized Fixture',width:1450,length:600,sigma:.08,angleSigma:.04,cost:35,time:16}
};
export const assemblyPackage={length:2000,width:1300,clearance:40,pic:{z:1550,x:0,length:500,width:900},slot:{z:760,x:0},slotTolerance:40};
const axes=['dx','dy','thetaX','thetaY'];
const biases={dx:.45,dy:-.25,thetaX:.10,thetaY:-.08};
const componentSigma={dx:.18,dy:.18,thetaX:.04,thetaY:.04};
const unitProcess=Object.fromEntries(axes.map(a=>[a,{bias:0,sigma:1}]));
export function challengeSession(){return {modelVersion:challengeVersion,fixture:'economy',method:'passive',radius:3,rework:false,stage:'inventory',position:null,calibration:{dx:2.4,dy:-1.8,thetaX:1,thetaY:-.6},prototypeCost:0,prototypeTime:0,unlocks:0,aligned:false,run:null,history:[]};}
export function mechanicalFit(fixtureId,position){
 const f=fixtures[fixtureId];if(!f||!position||![position.z,position.x].every(Number.isFinite))return {pass:false,reasons:['Fixture를 선택하고 Carrier를 설치하세요.']};
 const {length,width,clearance,pic,slot,slotTolerance}=assemblyPackage,reasons=[];
 if(position.z-f.length/2<clearance||position.z+f.length/2>length-clearance||Math.abs(position.x)+f.width/2>width/2-clearance)reasons.push('PACKAGE BOUNDARY / CLEARANCE');
 const zGap=Math.abs(position.z-pic.z)-(f.length+pic.length)/2,xGap=Math.abs(position.x-pic.x)-(f.width+pic.width)/2;
 if(zGap<clearance&&xGap<clearance)reasons.push('CARRIER / PIC CLEARANCE');
 if(Math.abs(position.z-slot.z)>slotTolerance||Math.abs(position.x-slot.x)>slotTolerance)reasons.push('MOUNT SLOT / DATUM 위치');
 return {pass:reasons.length===0,reasons,zGap,xGap};
}
function standards(count,seed){return generateSamples({count,seed,process:unitProcess}).samples;}
function tolerances(s){const f=fixtures[s.fixture];return Object.fromEntries(axes.map(a=>[a,{bias:biases[a]+s.calibration[a]+(a==='dx'?(s.position?.x??0):0),sigma:Math.hypot(a.startsWith('theta')?f.angleSigma:f.sigma,componentSigma[a])}]));}
function rawState(s,unit,fixtureNoise,partNoise){const f=fixtures[s.fixture],state={w1:s.radius,w2:3,wavelength:1.55,index:1,fixedLoss:0};for(const a of axes)state[a]=s.calibration[a]+biases[a]+(a==='dx'?(s.position?.x??0):0)+(a.startsWith('theta')?f.angleSigma:f.sigma)*fixtureNoise[unit][a]+componentSigma[a]*partNoise[unit][a];return state;}
export function prototypeState(s){return rawState(s,0,standards(1,20261011),standards(1,20261011^0x71f9));}
export function prototypeResult(s){return angularCoupling(prototypeState(s));}
export function adjustPrototype(s,axis,value){
 if(s.stage!=='align'||!axes.includes(axis)||!Number.isFinite(value)||Math.abs(value)>(axis.startsWith('theta')?3:6))throw new RangeError('Unlocked valid Alignment required.');
 if(!s.aligned){s.prototypeCost+=9;s.prototypeTime+=8;s.aligned=true;}s.calibration[axis]+=value-prototypeState(s)[axis];s.run=null;return s;
}
export function placeCarrier(s,position){
 if(!['inventory','align'].includes(s.stage)||!position||![position.z,position.x].every(Number.isFinite))throw new RangeError('Carrier is locked or position invalid.');
 if(s.stage==='inventory'){const f=fixtures[s.fixture];s.prototypeCost+=12+f.cost;s.prototypeTime+=8+f.time;}s.position={z:Math.round(position.z),x:Math.round(position.x)};s.stage='align';s.run=null;return s;
}
export function lockAssembly(s){
 if(s.stage!=='align'||!mechanicalFit(s.fixture,s.position).pass)throw new RangeError('Mount / Package fit required before Lock.');
 s.stage='locked';s.prototypeCost+=1;s.prototypeTime+=1;return s;
}
export function testAssembly(s){if(s.stage!=='locked')throw new RangeError('Lock before Optical Test.');s.stage='tested';s.prototypeCost+=2;s.prototypeTime+=2;return prototypeResult(s);}
export function unlockAssembly(s){if(!['locked','tested'].includes(s.stage))throw new RangeError('Only locked assembly can be reworked.');s.stage='align';s.prototypeCost+=9;s.prototypeTime+=6;s.unlocks++;s.run=null;return s;}
function evaluated(state){const result=angularCoupling(state);const dominant=[['Lateral',result.alignmentLoss],['Angular',result.angularLoss],['Mode Mismatch',result.mismatchLoss]].sort((a,b)=>b[1]-a[1])[0][0];return {state,result,pass:result.totalLoss<=factoryOrder.lossLimit+1e-9,dominant};}
export function manufacture(s,seed=factoryOrder.seed){
 if(!fixtures[s.fixture]||!['active','passive'].includes(s.method)||![1.5,3,4].includes(s.radius)||!axes.every(a=>Number.isFinite(s.calibration?.[a])))throw new RangeError('Invalid manufacturing design.');
 if(s.stage!=='tested'||!mechanicalFit(s.fixture,s.position).pass)throw new RangeError('Tested mounted Prototype required.');
 if(!Number.isInteger(seed)||seed<0||seed>0xffffffff)throw new RangeError('uint32 Seed required.');
 const {count}=factoryOrder,f=fixtures[s.fixture],fixtureNoise=standards(count,seed),partNoise=standards(count,seed^0x71f9),residual=standards(count,seed^0x5a3d),rows=[];
 let totalCost=s.prototypeCost,totalTime=s.prototypeTime;
 for(let i=0;i<count;i++){
  const raw=rawState(s,i,fixtureNoise,partNoise),afterActive={...raw};for(const a of axes)afterActive[a]=residual[i][a]*(a.startsWith('theta')?.035:.08);
  const before=evaluated(raw),first=evaluated(s.method==='active'?afterActive:raw),retry=s.rework&&!first.pass,final=retry?evaluated(afterActive):first;
  const cost=12+f.cost+1+2+(s.method==='active'?9:0)+(retry?21:0),time=8+f.time+1+2+(s.method==='active'?8:0)+(retry?17:0);totalCost+=cost;totalTime+=time;
  rows.push({index:i,before,first,...final,reworked:retry,cost,time});
 }
 const prototypePassed=prototypeResult(s).totalLoss<=factoryOrder.lossLimit;
 const firstGood=rows.filter(r=>r.first.pass).length,good=rows.filter(r=>r.pass).length,sorted=rows.map(r=>r.result.totalLoss).sort((a,b)=>a-b),costPerGood=good?totalCost/good:null;
 return {modelVersion:challengeVersion,prototypePassed,prototypeLoss:prototypeResult(s).totalLoss,seed,count,good,reject:count-good,firstGood,firstYield:firstGood/count,yield:good/count,interval:wilsonInterval(good,count),p95:lossQuantile(sorted,.95),rows,totalCost,totalTime,costPerGood,reworked:rows.filter(r=>r.reworked).length,process:tolerances(s),qualified:prototypePassed&&good>=factoryOrder.minGood&&totalCost<=factoryOrder.costBudget&&totalTime<=factoryOrder.timeBudget};
}
export function challengeSnapshot(s){return {fixture:s.fixture,method:s.method,radius:s.radius,rework:s.rework,calibration:{...s.calibration},position:{...s.position},prototypeCost:s.prototypeCost,prototypeTime:s.prototypeTime,unlocks:s.unlocks,aligned:s.aligned};}
export function validateChallenge(value){
 if(value?.modelVersion!==challengeVersion||!fixtures[value.fixture]||!['active','passive'].includes(value.method)||![1.5,3,4].includes(value.radius)||!['inventory','align','locked','tested'].includes(value.stage)||!axes.every(a=>Number.isFinite(value.calibration?.[a])&&Math.abs(value.calibration[a])<=12)||![value.prototypeCost,value.prototypeTime,value.unlocks].every(v=>Number.isInteger(v)&&v>=0&&v<100000))throw new RangeError('Invalid assembly save.');
 const s={...challengeSession(),fixture:value.fixture,method:value.method,radius:value.radius,rework:value.rework===true,stage:value.stage,calibration:{...value.calibration},prototypeCost:value.prototypeCost,prototypeTime:value.prototypeTime,unlocks:value.unlocks,aligned:value.aligned===true};
 if(value.stage!=='inventory'){if(!value.position||![value.position.z,value.position.x].every(v=>Number.isFinite(v)&&Math.abs(v)<=10000))throw new RangeError('Invalid Carrier position.');s.position={...value.position};}
 if(['locked','tested'].includes(s.stage)&&!mechanicalFit(s.fixture,s.position).pass)throw new RangeError('Invalid locked geometry.');
 prototypeResult(s);
 if(value.run){if(s.stage!=='tested'||!Number.isInteger(value.run.seed))throw new RangeError('Invalid saved production.');s.run={seed:value.run.seed,awarded:value.run.awarded===true};}
 s.history=Array.isArray(value.history)?value.history.slice(-3).filter(h=>h?.modelVersion===challengeVersion&&typeof h.name==='string'&&h.name.length<=40&&h.snapshot&&Number.isInteger(h.seed)).map(h=>{const draft=validateChallenge({...challengeSession(),...h.snapshot,stage:'tested',run:null,history:[]});return {modelVersion:challengeVersion,name:h.name,seed:h.seed,snapshot:challengeSnapshot(draft)};}):[];
 return s;
}
