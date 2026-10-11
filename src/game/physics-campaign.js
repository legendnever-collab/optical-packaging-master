import {ellipticalCoupling} from '../physics/elliptical-gaussian.js';
import {evaluateRelay,validateRelay} from '../physics/beam-interface.js';
import {generateSamples,wilsonInterval,lossQuantile,normalGenerator} from '../physics/assembly.js';
import {fixtures,mechanicalFit,assemblyPackage} from './assembly-challenge.js';
export const campaignKey='optical-packaging-master.physics-campaign';
export const campaignModel='interface-project-v7.1';
export const campaignChapters=[
 {id:1,title:'Connect Two Fibers',short:'First Light',problem:'같은 SMF 두 개. 중심을 맞췄는데도 빛이 줄어들면 무엇을 확인해야 할까요?',action:'SMF를 켜고 Fiber Endface를 검사한 뒤, 움직이는 Fiber를 기준 Fiber에 맞추세요.',goal:'Loss ≤0.5 dB · 위치와 방향 모두 연결',achievement:'First Light Achieved',next:'SMF는 연결됐습니다. Glass Substrate 안의 Waveguide도 같은 Mode일까요?'},
 {id:2,title:'Glass Waveguide Challenge',short:'Glass Mode',problem:'제작된 Glass WG의 Mode는 X/Y 크기가 다릅니다. 정렬과 형상 차이를 구분하세요.',action:'SMF를 정렬하고 X/Y Mode를 확인하세요. 축 회전 실험으로 위치 허용도를 비교하세요.',goal:'Asymmetric Mode 분석 · 개선 Profile Loss ≤1 dB',achievement:'Glass Optical Interface Characterized',next:'Glass WG는 Fiber와 맞는 Mode를 설계할 수 있습니다. Bare Silicon은 어떨까요?'},
 {id:3,title:'The Silicon Mode Mismatch Crisis',short:'Silicon Crisis',problem:'거의 완벽한 정렬인데도 출력이 낮습니다. 더 정밀한 위치 제어가 답일까요?',action:'정밀 정렬로 X/Y/Tilt를 0에 가깝게 만든 후, Mode를 검사하고 지배적인 원인을 진단하세요.',goal:'Loss 통과가 아닌 Mode Mismatch 진단',achievement:'Precision Cannot Fix Mode Mismatch',next:'정밀도가 아니라 Optical Field를 바꿔야 합니다. Mode Converter를 설계해봅시다.'},
 {id:4,title:'Engineer the Mode Converter',short:'Mode Converter',problem:'높은 Silicon Confinement를 완화하고 Optical Field를 SMF와 맞춰야 합니다.',action:'Converter Reference를 선택하고 정렬된 Coupling을 비교하세요. 개선 후 공정 편차를 적용하세요.',goal:'Nominal Loss ≤1 dB · Passive Yield 제약 확인',achievement:'Mode Matched — But Not Production Ready',next:'Nominal Loss는 좋아졌지만 공정 편차를 견디지 못합니다. Packaging Architecture가 필요합니다.'},
 {id:5,title:'Design for Passive Alignment',short:'Passive Design',problem:'좋은 Prototype이 반복 조립을 통과하지 못합니다. 위치·각도·공간을 함께 설계하세요.',action:'Datum 또는 Lens 경로를 선택하고 실제 부품을 설치하세요. 같은 Sample로 조립 Yield를 비교하세요.',goal:'Nominal ≤1 dB · ≥950/1000 Good · Geometry / Cost / WD',achievement:'Passive-ready Interface',next:'모델 조건에서 Passive-ready입니다. 이 설계를 실제 조립·고정·검사 순서로 제조하세요.'},
 {id:6,title:'Build, Lock & Qualify',short:'Manufacturing',problem:'전달받은 Optical Design을 비용과 시간 안에 100개 제품으로 만들어야 합니다.',action:'Carrier와 Fixture를 설치하고 Align → Lock → Test하세요. 독립 생산 Sample로 납품을 검증하세요.',goal:'Prototype ≤1 dB · Good ≥95/100 · Cost ≤6800 · Time ≤4000 s',achievement:'Qualified Optical Packaging Product',next:'빛의 연결과 제조를 함께 해결했습니다. 다른 설계는 Optional Engineering Lab에서 비교하세요.'}
];
const mode=(wx,wy=wx,angle=0)=>({wx,wy,angle});
export const glassProfiles={
 asymmetric:{name:'Asymmetric Glass WG',mode:mode(4.8,2.6),note:'제작 공정에 따라 가능한 비대칭 Gaussian 근사. 모든 Glass WG를 뜻하지 않습니다.'},
 circular:{name:'Fiber-compatible Glass WG',mode:mode(5),note:'원형에 가까운 Mode를 갖도록 재설계한 학습용 Profile.'},
 moderate:{name:'Moderately Asymmetric WG',mode:mode(4.8,4),note:'크기와 X/Y 균형을 조절한 학습용 Profile.'}
};
/** Literature-informed teaching references, not a foundry PDK or measured dataset.
 * No numerical tip-width -> loss surrogate is fabricated. Geometry is metadata;
 * supported effective fields and converter insertion losses are explicit assumptions. */
export const converterReferences={
 bare:{name:'Bare Silicon',modes:[mode(.45,.30)],loss:0,length:0,tip:null,stack:'220 nm SOI / oxide · illustrative TE-like field'},
 inverse:{name:'Silicon Inverse Taper',modes:[mode(1.5),mode(2.5)],loss:.15,length:250,tip:100,stack:'SOI inverse taper / engineered cladding · assumed effective outputs'},
 sin:{name:'SiN-assisted SSC',modes:[mode(3.8),mode(4.8)],loss:.25,length:500,tip:100,stack:'Si inverse taper → lower-index SiN-assisted mode · assumed circular outputs'}
};
export const packagingEnvironments={
 standard:{name:'Serviceable Interface',width:1600,height:900,componentLimit:3,maxCost:65,minWD:100,note:'공간 여유가 있는 Detachable Interface. Straight Relay와 Datum을 비교합니다.'},
 compact:{name:'Compact Corner Package',width:850,height:800,componentLimit:3,maxCost:65,minWD:100,note:'Straight Relay가 길면 접힌 광로가 필요합니다. Direct Datum도 가능한 대안입니다.'},
 angular:{name:'Loose Angular Registration',width:1600,height:900,componentLimit:3,maxCost:65,minWD:100,note:'Connector Tilt σ=0.8°. Expanded Beam의 각도 민감도가 문제가 됩니다.'}
};
export function defaultInterface(){return {modelVersion:campaignModel,sourceType:'SMF',sourceMode:mode(5.2),targetType:'SMF',targetMode:mode(5.2),wavelength:1.55,converter:'bare',converterIndex:0,glass:'asymmetric',alignment:{dx:3.5,dy:-2,thetaX:2.4,thetaY:-.8},architecture:'direct',environment:'standard',relay:{sourceRadius:5.2,targetRadius:4.8,wavelength:1.55,f1:260,f2:240,z1:260,z2:760,length:1000,converterLoss:.25,foldAt:null,installed:0},fixture:'economy',qualificationStatus:'draft',nominalCouplingLoss:null,assemblyDistribution:null,yield:null};}
export function freshCampaign(){return {schemaVersion:1,contentVersion:7,modelVersion:campaignModel,chapter:1,completed:{},drafts:{1:{project:defaultInterface(),evidence:{},factory:null}},frozen:{},baselineHistory:[],legacyHistory:{missions:{},content:{},assemblyDelivered:false}};}
export function chapterDraft(id,previous){
 const p=structuredClone(previous??defaultInterface());p.qualificationStatus='draft';p.nominalCouplingLoss=null;p.assemblyDistribution=null;p.yield=null;
 if(id===2){p.targetType='Glass WG';p.targetMode={...glassProfiles.asymmetric.mode};p.glass='asymmetric';p.alignment={dx:2,dy:-1,thetaX:0,thetaY:0};}
 if(id===3){p.targetType='Silicon PIC';p.targetMode={...converterReferences.bare.modes[0]};p.converter='bare';p.alignment={dx:.7,dy:-.4,thetaX:.4,thetaY:-.3};}
 if(id===4){p.targetType='Silicon PIC';p.converter='bare';p.converterIndex=0;p.targetMode={...converterReferences.bare.modes[0]};p.alignment={dx:0,dy:0,thetaX:0,thetaY:0};}
 if(id===5){p.targetType='Silicon PIC';p.architecture='direct';p.fixture='economy';p.relay={...defaultInterface().relay,targetRadius:Math.max(1.5,p.targetMode.wx),converterLoss:converterReferences[p.converter].loss};}
 return {project:p,evidence:{},factory:id===6?newCampaignFactory(p):null};
}
export function selectConverter(p,key,index=0){const ref=converterReferences[key];if(!ref||!Number.isInteger(index)||!ref.modes[index])throw new RangeError('Unsupported Converter Reference.');p.converter=key;p.converterIndex=index;p.targetMode={...ref.modes[index]};p.relay.targetRadius=Math.max(1.5,p.targetMode.wx);p.relay.converterLoss=ref.loss;p.qualificationStatus='draft';return p;}
export function selectGlass(p,key){if(!glassProfiles[key])throw new RangeError('Unknown Glass Profile.');p.glass=key;p.targetMode={...glassProfiles[key].mode};return p;}
export function nominalInterface(p,alignment=p.alignment){
 validateInterfaceProject(p);
 if(['relay','folded'].includes(p.architecture))return evaluateRelay({...p.relay,foldAt:p.architecture==='folded'?p.relay.z1+p.relay.f1:null},alignment);
 const fixedLoss=p.targetType==='Silicon PIC'?converterReferences[p.converter].loss:0;
 return ellipticalCoupling({source:p.sourceMode,target:p.targetMode,...alignment,wavelength:p.wavelength,fixedLoss});
}
export function axisExperiment(p){
 return [0,90].map(angle=>{const target={...glassProfiles.asymmetric.mode,angle},base=ellipticalCoupling({source:p.sourceMode,target,wavelength:p.wavelength});return {angle,center:base.totalLoss,x:ellipticalCoupling({source:p.sourceMode,target,dx:2,wavelength:p.wavelength}).totalLoss,y:ellipticalCoupling({source:p.sourceMode,target,dy:2,wavelength:p.wavelength}).totalLoss};});
}
export function validateInterfaceProject(p){
 if(p?.modelVersion!==campaignModel||p.sourceType!=='SMF'||!['SMF','Glass WG','Silicon PIC'].includes(p.targetType)||p.wavelength!==1.55||!converterReferences[p.converter]||!Number.isInteger(p.converterIndex)||!converterReferences[p.converter].modes[p.converterIndex]||!glassProfiles[p.glass]||!['direct','datum','relay','folded'].includes(p.architecture)||!packagingEnvironments[p.environment]||!['economy','precision'].includes(p.fixture))throw new RangeError('Unsupported Optical Interface Project.');
 const src=p.sourceMode,tgt=p.targetMode;if(!src||src.wx!==5.2||src.wy!==5.2||src.angle!==0)throw new RangeError('Unsupported SMF Reference.');
 const expected=p.targetType==='SMF'?mode(5.2):p.targetType==='Glass WG'?glassProfiles[p.glass].mode:converterReferences[p.converter].modes[p.converterIndex];
 if(!tgt||tgt.wx!==expected.wx||tgt.wy!==expected.wy||!Number.isFinite(tgt.angle)||Math.abs(tgt.angle)>180)throw new RangeError('Effective mode does not match supported preset.');
 if(p.targetType!=='Glass WG'&&tgt.angle!==0)throw new RangeError('Only glass principal-axis orientation is supported.');
 if(!p.alignment||!['dx','dy','thetaX','thetaY'].every(a=>Number.isFinite(p.alignment[a])&&Math.abs(p.alignment[a])<=(a.startsWith('theta')?3:8)))throw new RangeError('Alignment outside campaign domain.');
 const c=validateRelay(p.relay);
 if(c.sourceRadius!==5.2||c.z1<150||c.z1>380||c.z2!==760||c.length<920||c.length>1080||c.f1!==260||c.f2!==240||!Number.isInteger(c.installed)||c.installed<0||c.installed>2)throw new RangeError('Relay outside supported game geometry.');
 if(['relay','folded'].includes(p.architecture)&&(p.targetType!=='Silicon PIC'||tgt.wx!==tgt.wy||tgt.angle!==0||c.targetRadius!==tgt.wx||c.converterLoss!==converterReferences[p.converter].loss))throw new RangeError('Relay requires the selected circular SSC effective field.');
 return p;
}
export function architectureRequirements(p){
 const env=packagingEnvironments[p.environment],relay=['relay','folded'].includes(p.architecture),r=nominalInterface(p,{dx:0,dy:0,thetaX:0,thetaY:0}),cost=(p.architecture==='datum'?24:12)+(relay?14*p.relay.installed:0)+(p.architecture==='folded'?8:0)+converterReferences[p.converter].loss*8;
 const fp=relay?r.footprint:{width:450,height:400},components=relay?r.componentCount:0;
 const geometry=fp.width<=env.width&&fp.height<=env.height,workingDistance=!relay||r.workingDistance>=env.minWD,inventory=!relay||p.relay.installed===2;
 return {geometry,workingDistance,inventory,components,cost,footprint:fp,pass:geometry&&workingDistance&&inventory&&components<=env.componentLimit&&cost<=env.maxCost,env};
}
export function interfaceCohort(seed=20261013,count=1000){return generateSamples({seed,count,process:Object.fromEntries(['dx','dy','thetaX','thetaY'].map(a=>[a,{bias:0,sigma:1}]))});}
function sampleErrors(p,s,index,seed,method='passive'){
 const sigma=p.fixture==='precision'?.12:1.8,angle=p.environment==='angular'?.8:.08;
 // The same standard-normal samples feed all candidate designs. Mechanical datum alters their scale.
 const e={dx:s.dx*sigma,dy:s.dy*sigma,thetaX:s.thetaX*angle,thetaY:s.thetaY*angle};
 const n=normalGenerator((seed^0x91b7^Math.imul(index+1,2654435761))>>>0);
 if(method==='active'){e.dx=n()*.08;e.dy=n()*.08;e.thetaX=n()*.015;e.thetaY=n()*.015;}
 if(['relay','folded'].includes(p.architecture)){
  // Permanently prealigned source/lens subassemblies retain finite residual errors.
  e.sourceX=n()*.08;e.sourceY=n()*.08;e.lens1X=n()*.08;e.lens1Y=n()*.08;e.lens2X=n()*.08;e.lens2Y=n()*.08;e.axial=n()*2;
 }
 return e;
}
export function evaluateInterfaceCohort(p,cohort=interfaceCohort(),method='passive',bias={dx:0,dy:0,thetaX:0,thetaY:0}){
 validateInterfaceProject(p);if(!['active','passive'].includes(method)||!cohort||cohort.samples?.length!==cohort.count||!Number.isInteger(cohort.seed)||cohort.seed<0||cohort.seed>0xffffffff||!['dx','dy','thetaX','thetaY'].every(a=>Number.isFinite(bias[a])))throw new RangeError('Invalid interface cohort / alignment method.');
 const rows=cohort.samples.map((s,i)=>{const errors=sampleErrors(p,s,i,cohort.seed,method);for(const a of ['dx','dy','thetaX','thetaY'])errors[a]+=bias[a];const result=nominalInterface(p,errors);return {index:i,errors,result,pass:result.totalLoss<=1+1e-9};});
 const good=rows.filter(r=>r.pass).length,sorted=rows.map(r=>r.result.totalLoss).sort((a,b)=>a-b),nominal=nominalInterface(p,{dx:0,dy:0,thetaX:0,thetaY:0}),requirements=architectureRequirements(p);
 return {modelVersion:campaignModel,count:cohort.count,seed:cohort.seed,good,reject:cohort.count-good,yield:good/cohort.count,p95:lossQuantile(sorted,.95),interval:wilsonInterval(good,cohort.count),lossLimit:1,nominalLoss:nominal.totalLoss,requirements,rows,qualified:nominal.totalLoss<=1&&good/cohort.count>=.95&&requirements.pass,process:{matingXYsigma:p.fixture==='precision'?.12:1.8,matingTiltSigma:p.environment==='angular'?.8:.08,permanentXYsigma:['relay','folded'].includes(p.architecture)?.08:0,permanentAxialSigma:['relay','folded'].includes(p.architecture)?2:0,method,distribution:'Independent Normal, educational assumption'}};
}
export function newCampaignFactory(p){return {stage:'inventory',fixture:p.architecture==='datum'?'precision':p.fixture,method:'passive',rework:false,position:null,calibration:{dx:.5,dy:-.35,thetaX:.12,thetaY:-.08},cost:0,time:0,unlocks:0,seed:null};}
export function campaignPrototype(p,f){return nominalInterface({...p,fixture:f.fixture},{...f.calibration});}
export function campaignFactoryAction(p,f,action,value){
 if(action==='install'){if(f.stage!=='inventory')throw new RangeError('Unlocked empty inventory required.');f.position={...assemblyPackage.slot};f.cost+=12+fixtures[f.fixture].cost+(architectureRequirements(p).cost-(p.architecture==='datum'?24:12));f.time+=8+fixtures[f.fixture].time;f.stage='align';}
 else if(action==='place'){if(f.stage!=='align'||!value||![value.z,value.x].every(Number.isFinite))throw new RangeError('Unlocked Carrier required.');f.calibration.dx+=value.x-(f.position?.x??0);f.position={z:value.z,x:value.x};}
 else if(action==='align'){if(f.stage!=='align')throw new RangeError('Unlock before Alignment.');for(const a of ['dx','dy','thetaX','thetaY'])f.calibration[a]=0;f.cost+=9;f.time+=8;}
 else if(action==='lock'){if(f.stage!=='align'||!mechanicalFit(f.fixture,f.position).pass)throw new RangeError('Mount Slot / Mechanical Fit required.');f.stage='locked';f.cost+=1;f.time+=1;}
 else if(action==='test'){if(f.stage!=='locked')throw new RangeError('Lock before Optical Test.');f.stage='tested';f.cost+=2;f.time+=2;}
 else if(action==='unlock'){if(!['locked','tested'].includes(f.stage))throw new RangeError('Only locked parts can be reworked.');f.stage='align';f.cost+=9;f.time+=6;f.unlocks++;f.seed=null;}
 else throw new RangeError('Unknown manufacturing action.');
 return f;
}
export function qualifyCampaignFactory(p,f,seed=20261014){
 if(f.stage!=='tested'||!mechanicalFit(f.fixture,f.position).pass)throw new RangeError('Tested mounted Prototype required.');
 const design={...p,fixture:f.fixture},report=evaluateInterfaceCohort(design,interfaceCohort(seed,100),f.method,f.method==='active'?{dx:0,dy:0,thetaX:0,thetaY:0}:f.calibration),firstGood=report.good;
 let cost=f.cost,time=f.time;const req=architectureRequirements(p);
 const retry=f.rework?evaluateInterfaceCohort(design,interfaceCohort(seed,100),'active'):null;
 const rows=report.rows.map((row,i)=>{const reworked=Boolean(retry&&!row.pass),final=reworked?retry.rows[i]:row;
 const unitCost=12+fixtures[f.fixture].cost+(req.cost-(p.architecture==='datum'?24:12))+3+(f.method==='active'?9:0)+(reworked?21:0),unitTime=11+fixtures[f.fixture].time+(p.architecture==='relay'||p.architecture==='folded'?10:0)+(f.method==='active'?8:0)+(reworked?17:0);
 cost+=unitCost;time+=unitTime;return {...final,before:row,reworked,cost:unitCost,time:unitTime};});
 const good=rows.filter(r=>r.pass).length,prototypeLoss=campaignPrototype(p,f).totalLoss,nominalLoss=report.nominalLoss;
 return {...report,rows,good,reject:100-good,yield:good/100,interval:wilsonInterval(good,100),p95:lossQuantile(rows.map(r=>r.result.totalLoss).sort((a,b)=>a-b),.95),firstGood,totalCost:cost,totalTime:time,prototypeLoss,nominalLoss,reworked:rows.filter(r=>r.reworked).length,qualified:prototypeLoss<=1&&good>=95&&cost<=6800&&time<=4000&&req.pass};
}
export function canCompleteChapter(id,draft){
 const {project:p,evidence:e,factory:f}=draft,r=nominalInterface(p);
 if(id===1)return Boolean(e.light&&e.endface&&e.direction&&r.totalLoss<=.5);
 if(id===2)return Boolean(e.asymmetricTest&&e.axes&&e.profileTest===p.glass&&e.profileTest!=='asymmetric'&&r.totalLoss<=1);
 if(id===3)return Boolean(e.precision&&e.mode&&e.diagnosis==='mismatch'&&Math.hypot(p.alignment.dx,p.alignment.dy,p.alignment.thetaX,p.alignment.thetaY)<.05);
 if(id===4)return Boolean(e.nominalTest===p.converter+':'+p.converterIndex&&e.variationTest===p.converter+':'+p.converterIndex&&r.totalLoss<=1&&!evaluateInterfaceCohort(p).qualified);
 if(id===5)return Boolean(e.architectureTest===designSignature(p)&&evaluateInterfaceCohort(p).qualified);
 if(id===6)return Boolean(f?.stage==='tested'&&f.seed!==null&&qualifyCampaignFactory(p,f,f.seed).qualified);
 return false;
}
export function designSignature(p){return JSON.stringify([p.architecture,p.environment,p.fixture,p.converter,p.converterIndex,p.relay]);}
export function freezeChapter(progress,id){
 const d=progress.drafts[id];if(!canCompleteChapter(id,d))throw new RangeError('현재 Chapter의 Experiment / Qualification 요구를 충족하세요.');
 const p=structuredClone(d.project),report=id>=4?evaluateInterfaceCohort(p):null;
 p.nominalCouplingLoss=nominalInterface(p,{dx:0,dy:0,thetaX:0,thetaY:0}).totalLoss;
 if(report){p.assemblyDistribution={seed:report.seed,count:report.count,process:report.process,lossLimit:report.lossLimit};p.yield=report.yield;}
 p.qualificationStatus=id===3?'limitation-diagnosed':id===4?'nominal-qualified':id===5?'passive-ready-model':id===6?'product-qualified-model':'experiment-completed';
 if(id===6){const q=qualifyCampaignFactory(p,d.factory,d.factory.seed);p.assemblyDistribution={seed:q.seed,count:100,process:q.process,lossLimit:1};p.yield=q.yield;}
 progress.frozen[id]={project:p,evidence:structuredClone(d.evidence),factory:structuredClone(d.factory)};progress.completed[id]={achievement:campaignChapters[id-1].achievement,status:p.qualificationStatus};
 progress.baselineHistory=Object.keys(progress.frozen).map(k=>({chapter:Number(k),targetType:progress.frozen[k].project.targetType,loss:progress.frozen[k].project.nominalCouplingLoss}));
 return p;
}
export function enterChapter(progress,id){
 if(!Number.isInteger(id)||id<1||id>6||id>1&&!progress.completed[id-1])throw new RangeError('이전 개발 단계의 설계를 전달하세요.');
 if(!progress.drafts[id])progress.drafts[id]=chapterDraft(id,progress.frozen[id-1]?.project);
 progress.chapter=id;return progress.drafts[id];
}
function validateCampaignFactory(p,f){
 if(!f||!['inventory','align','locked','tested'].includes(f.stage)||!['economy','precision'].includes(f.fixture)||!['active','passive'].includes(f.method)||![f.cost,f.time,f.unlocks].every(x=>Number.isFinite(x)&&x>=0&&x<1e7)||!['dx','dy','thetaX','thetaY'].every(a=>Number.isFinite(f.calibration?.[a])&&Math.abs(f.calibration[a])<=(a.startsWith('theta')?3:8))||(f.seed!==null&&(!Number.isInteger(f.seed)||f.seed<0||f.seed>0xffffffff)))throw new RangeError('Invalid manufacturing state.');
 if(f.stage!=='inventory'&&(!f.position||![f.position.z,f.position.x].every(v=>Number.isFinite(v)&&Math.abs(v)<=10000)))throw new RangeError('Invalid Carrier placement.');
 if(['locked','tested'].includes(f.stage)&&!mechanicalFit(f.fixture,f.position).pass)throw new RangeError('Invalid locked Carrier geometry.');
 if(f.seed!==null&&f.stage!=='tested')throw new RangeError('Untested production save.');
 campaignPrototype(p,f);return {...f,rework:f.rework===true};
}
export function validateCampaign(value){
 if(value?.schemaVersion!==1||value?.contentVersion!==7||value?.modelVersion!==campaignModel)throw new RangeError('Unsupported Campaign schema / model.');
 const p=freshCampaign();
 for(let id=1;id<=6;id++){
  const d=value.drafts?.[id];if(!d)continue;validateInterfaceProject(d.project);
  if(d.project.targetType!==(id===1?'SMF':id===2?'Glass WG':'Silicon PIC'))throw new RangeError('Invalid chapter platform.');
  const e=d.evidence;if(!e||typeof e!=='object'||Array.isArray(e))throw new RangeError('Invalid experiment evidence.');
  p.drafts[id]={project:structuredClone(d.project),evidence:structuredClone(e),factory:id===6?validateCampaignFactory(d.project,d.factory):null};
  const saved=value.frozen?.[id];if(saved&&value.completed?.[id]&&(id===1||p.completed[id-1])){
   validateInterfaceProject(saved.project);const fd={project:structuredClone(saved.project),evidence:structuredClone(saved.evidence),factory:id===6?validateCampaignFactory(saved.project,saved.factory):null};
   if(canCompleteChapter(id,fd)){p.frozen[id]=fd;p.completed[id]={achievement:campaignChapters[id-1].achievement,status:saved.project.qualificationStatus};}
  }
 }
 p.chapter=Number.isInteger(value.chapter)&&value.chapter>=1&&value.chapter<=6&&(value.chapter===1||p.completed[value.chapter-1])?value.chapter:1;
 if(!p.drafts[p.chapter])p.drafts[p.chapter]=chapterDraft(p.chapter,p.frozen[p.chapter-1]?.project);
 p.baselineHistory=Object.keys(p.frozen).map(k=>({chapter:Number(k),targetType:p.frozen[k].project.targetType,loss:p.frozen[k].project.nominalCouplingLoss}));
 if(value.legacyHistory&&typeof value.legacyHistory==='object')p.legacyHistory={missions:structuredClone(value.legacyHistory.missions??{}),content:structuredClone(value.legacyHistory.content??{}),assemblyDelivered:value.legacyHistory.assemblyDelivered===true};
 return p;
}
export function loadCampaign(storage,preview=false){
 if(preview)return {progress:freshCampaign(),writable:false,status:'preview'};
 try{
  const raw=storage?.getItem(campaignKey);if(raw){const value=JSON.parse(raw);if(value?.schemaVersion>1||value?.contentVersion>7)return {progress:freshCampaign(),writable:false,status:'future-schema'};return {progress:validateCampaign(value),writable:true,status:'restored'};}
  const p=freshCampaign();for(const [key,field] of [['optical-packaging-master.progress','campaign'],['optical-packaging-master.assembly','assembly']]){
   const oldRaw=storage?.getItem(key);if(!oldRaw)continue;try{const old=JSON.parse(oldRaw);if(field==='campaign'&&[1,2,3,4].includes(old.schemaVersion)){p.legacyHistory.missions=old.missions??{};p.legacyHistory.content=old.content??{};}if(field==='assembly'&&old.schemaVersion===1)p.legacyHistory.assemblyDelivered=old.session?.run?.awarded===true;}catch{/* preserve corrupt legacy bytes */}
  }
  return {progress:p,writable:true,status:'new-campaign'};
 }catch{return {progress:freshCampaign(),writable:false,status:'unavailable-or-invalid'};}
}
export function saveCampaign(storage,progress){try{storage.setItem(campaignKey,JSON.stringify(validateCampaign(progress)));return true;}catch{return false;}}
