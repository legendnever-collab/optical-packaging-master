import {evaluateFAU,fauModel} from '../physics/fau-array.js';
import {normalGenerator,wilsonInterval} from '../physics/assembly.js';
export const fauFixtures={
 economy:{name:'Economy Datum',xy:.55,rotation:.08,pitch:.10,local:.10,cost:28,time:24},
 precision:{name:'Precision Array Datum',xy:.12,rotation:.015,pitch:.018,local:.06,cost:50,time:34},
 active:{name:'Active Array Alignment',xy:.08,rotation:.008,pitch:.012,local:.06,cost:68,time:50}
};
export const fauComparisonSeed=20261015,fauQualificationSeed=20261016;
export function freshFAU(){return {schemaVersion:1,modelVersion:fauModel,stage:4,settings:{dx:3,dy:-2,rotation:0,pitch:127,fixture:'economy',inspection:'center'},completed:{},attempts:[],evaluation:null};}
export function validateFAUSettings(s){
 if(!s||!['dx','dy','rotation','pitch'].every(k=>Number.isFinite(s[k]))||Math.abs(s.dx)>8||Math.abs(s.dy)>8||Math.abs(s.rotation)>1||s.pitch<126.4||s.pitch>127.6||!Object.hasOwn(fauFixtures,s.fixture)||!['center','all'].includes(s.inspection))throw new RangeError('Invalid FAU design / process.');
 return Object.fromEntries(['dx','dy','rotation','pitch','fixture','inspection'].map(k=>[k,s[k]]));
}
export function fauNominal(session){return evaluateFAU({count:session.stage,...validateFAUSettings(session.settings)});}
export function evaluateFAUProduction(settings,{seed=fauComparisonSeed,count=100}={}){
 const design=validateFAUSettings(settings);if(![fauComparisonSeed,fauQualificationSeed].includes(seed)||count!==100)throw new RangeError('Declared FAU cohort required.');
 const process=fauFixtures[design.fixture],normal=normalGenerator(seed);
 const rows=Array.from({length:count},(_,index)=>{
  // Identical standard-normal cohort for every fixture; global errors are shared, locals independent.
  const errors={dx:normal()*process.xy,dy:normal()*process.xy,rotation:normal()*process.rotation,pitch:normal()*process.pitch};
  const localErrors=Array.from({length:16},()=>({dx:normal()*process.local,dy:normal()*process.local}));
  const result=evaluateFAU({count:16,dx:design.dx+errors.dx,dy:design.dy+errors.dy,rotation:design.rotation+errors.rotation,pitch:design.pitch+errors.pitch,localErrors});
  const inspected=design.inspection==='all'?result.channels:[result.channels[7],result.channels[8]],accepted=inspected.every(c=>c.pass);
  return {index,errors,localErrors,result,pass:result.pass,accepted,cost:process.cost+(design.inspection==='all'?4:.5),time:process.time+(design.inspection==='all'?8:1)};
 });
 const good=rows.filter(r=>r.pass).length,accepted=rows.filter(r=>r.accepted).length,falseAccepted=rows.filter(r=>r.accepted&&!r.pass).length,cost=rows.reduce((s,r)=>s+r.cost,0),time=rows.reduce((s,r)=>s+r.time,0),nominal=evaluateFAU({count:16,...design});
 return {modelVersion:fauModel,design,process:{...process},seed,count,lossLimit:1,rows,good,accepted,falseAccepted,yield:good/count,interval:wilsonInterval(good,count),cost,time,nominal,qualified:nominal.pass&&good>=95&&design.inspection==='all'&&falseAccepted===0&&cost<=6500&&time<=4500};
}
export function advanceFAU(session){
 if(![4,8].includes(session.stage)||!fauNominal(session).pass)throw new Error('모든 채널이 ≤1 dB여야 다음 Array로 전달할 수 있습니다.');
 session.completed[session.stage]=validateFAUSettings(session.settings);
 if(session.stage===4){session.stage=8;session.settings={...session.settings,dx:0,dy:0,rotation:.6,pitch:127.6};}else session.stage=16;
 session.evaluation=null;
}
export function recordFAUEvaluation(session,qualification=false){
 if(session.stage!==16)throw new Error('16-channel 제조 단계에서 평가하세요.');
 const descriptor={settings:validateFAUSettings(session.settings),seed:qualification?fauQualificationSeed:fauComparisonSeed,count:100};
 const report=evaluateFAUProduction(descriptor.settings,descriptor);
 session.evaluation=descriptor;session.attempts=session.attempts.concat(descriptor).slice(-6);return report;
}
export function canCompleteFAU(session){
 return session.stage===16&&session.completed[4]&&session.completed[8]&&session.evaluation?.seed===fauQualificationSeed&&JSON.stringify(session.evaluation.settings)===JSON.stringify(validateFAUSettings(session.settings))&&evaluateFAUProduction(session.settings,session.evaluation).qualified;
}
export function validateFAU(value){
 if(!value||value.schemaVersion!==1||value.modelVersion!==fauModel||![4,8,16].includes(value.stage))throw new RangeError('Unsupported FAU save.');
 const result=freshFAU();result.stage=value.stage;result.settings=validateFAUSettings(value.settings);
 for(const stage of [4,8])if(value.completed?.[stage]){const s=validateFAUSettings(value.completed[stage]);if(!evaluateFAU({count:stage,...s}).pass)throw new RangeError('Invalid completed FAU stage.');result.completed[stage]=s;}
 if(result.stage>=8&&!result.completed[4]||result.stage===16&&!result.completed[8])throw new RangeError('Sequential FAU progress required.');
 const descriptor=d=>{if(!d||![fauComparisonSeed,fauQualificationSeed].includes(d.seed)||d.count!==100)throw new RangeError('Invalid saved FAU evaluation.');return {settings:validateFAUSettings(d.settings),seed:d.seed,count:100};};
 if(!Array.isArray(value.attempts)||value.attempts.length>6)throw new RangeError('Invalid FAU history.');result.attempts=value.attempts.map(descriptor);
 if(value.evaluation){result.evaluation=descriptor(value.evaluation);if(result.stage!==16||JSON.stringify(result.evaluation.settings)!==JSON.stringify(result.settings))throw new RangeError('Stale FAU evaluation.');}
 return result;
}
