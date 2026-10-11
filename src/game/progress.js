import {validateOpticalPath} from '../physics/gaussian-propagation.js';
export const STORAGE_KEY='optical-packaging-master.progress';
export const SCHEMA_VERSION=4;
export function freshProgress(){return {schemaVersion:4,gameVersion:'0.6.0',tutorialSeen:false,missions:{},content:{},designs:[],lastMission:1,sound:false,interfaceDraft:null};}
function validRecord(m){return m?.complete===true&&Number.isFinite(m.bestScore)&&m.bestScore>=0&&m.bestScore<=1000&&Number.isFinite(m.bestLoss)&&m.bestLoss>=0;}
function validEvaluation(e) {
 const axes=['dx','dy','thetaX','thetaY'];
 return e && Number.isInteger(e.seed) && e.seed>=0 && e.seed<=0xffffffff && e.count===1000
  && Number.isInteger(e.processIndex) && e.processIndex>=0 && e.processIndex<=2
  && e.modelVersion==='gaussian-phase-v2' && e.lossLimit===1
  && [e.yield,e.p95,e.nominalLoss].every(Number.isFinite)
  && e.yield>=0 && e.yield<=1 && e.p95>=0 && e.nominalLoss>=0
  && axes.every(axis=>Number.isFinite(e.process?.[axis]?.bias)
    && Number.isFinite(e.process?.[axis]?.sigma) && e.process[axis].sigma>=0);
}
function copyEvaluation(e) {
 return {seed:e.seed,count:e.count,processIndex:e.processIndex,
  process:Object.fromEntries(['dx','dy','thetaX','thetaY'].map(axis=>[axis,{bias:e.process[axis].bias,sigma:e.process[axis].sigma}])),
  modelVersion:e.modelVersion,lossLimit:e.lossLimit,yield:e.yield,p95:e.p95,nominalLoss:e.nominalLoss};
}
export function validateProgress(value){
 if(!value||typeof value!=='object'||![1,2,3,4].includes(value.schemaVersion))throw new Error('Unsupported or invalid progress schema');
 const p=freshProgress();p.tutorialSeen=value.tutorialSeen===true;p.sound=value.sound===true;p.lastMission=Number.isInteger(value.lastMission)&&value.lastMission>=1&&value.lastMission<=10?value.lastMission:1;
 for(let id=1;id<=10;id++){const m=value.missions?.[id];if(validRecord(m))p.missions[id]={complete:true,bestScore:m.bestScore,bestLoss:m.bestLoss};}
 for(let id=2;id<=10;id++)if(!p.missions[id-1])delete p.missions[id];
 // Preserve legacy achievements; redesigned content earns a separate versioned badge.
 if(value.schemaVersion>=3)for(let id=1;id<=10;id++){const m=value.content?.[id];if(validRecord(m)&&m.version===(id<=7?3:4)&&p.missions[id])p.content[id]={...p.missions[id],bestScore:m.bestScore,bestLoss:m.bestLoss,version:m.version};}
 if(value.schemaVersion>=3&&Array.isArray(value.designs))p.designs=value.designs.slice(0,3).filter(d=>typeof d?.name==='string'&&d.name.length>0&&d.name.length<=32&&Number.isFinite(d.w1)&&d.w1>=1&&d.w1<=5&&Number.isFinite(d.w2)&&d.w2>=1&&d.w2<=5&&['matched','fixed'].includes(d.pairType)).map(d=>({name:d.name,w1:d.w1,w2:d.w2,pairType:d.pairType,evaluations:Array.isArray(d.evaluations)?d.evaluations.slice(-3).filter(validEvaluation).map(copyEvaluation):[]}));
 if(value.schemaVersion>=4)p.interfaceDraft=validateInterfaceDraft(value.interfaceDraft);
 return p;
}
export function loadProgress(storage){try{const raw=storage.getItem(STORAGE_KEY),value=raw?JSON.parse(raw):null;if(value?.schemaVersion>SCHEMA_VERSION)return {progress:freshProgress(),status:'future-schema',writable:false,readOnly:true};return {progress:value?validateProgress(value):freshProgress(),status:'ready',writable:true,readOnly:false};}catch{return {progress:freshProgress(),status:'unavailable',writable:false};}}
export function saveProgress(storage,progress){try{storage.setItem(STORAGE_KEY,JSON.stringify(validateProgress(progress)));return true;}catch{return false;}}
export function recordCompletion(progress,id,score,loss){
 if(!Number.isInteger(id)||id<1||id>10||!Number.isFinite(loss)||loss<0||!Number.isFinite(score)||score<0||score>1000)throw new RangeError('Invalid completion result');
 const old=progress.missions[id],content=progress.content[id];progress.missions[id]={complete:true,bestScore:Math.max(old?.bestScore??0,score),bestLoss:Math.min(old?.bestLoss??Infinity,loss)};
 progress.content[id]={complete:true,version:id<=7?3:4,bestScore:Math.max(content?.bestScore??0,score),bestLoss:Math.min(content?.bestLoss??Infinity,loss)};return progress;
}
export function storeDesign(progress,design){
 if(progress.designs.length>=3)throw new RangeError('Maximum three designs.');
 const candidate={...design,evaluations:[]},validated=validateProgress({...progress,designs:[candidate]}).designs[0];if(!validated)throw new RangeError('Invalid design.');progress.designs.push(validated);return progress.designs.length-1;
}

export function validateInterfaceDraft(value){
 if(!value||value.modelVersion!=='gaussian-q-v1')return null;
 try{const c=validateOpticalPath(value);if(c.index!==1||![1.31,1.55].includes(c.wavelength)||c.sourceRadius<5||c.sourceRadius>30||c.targetRadius<5||c.targetRadius>30||c.length<300||c.length>2500||c.sourceWaistZ<0||c.sourceWaistZ>1000||c.lenses.some(l=>l.f<80||l.f>1200||l.z<100||l.z>c.length-100))return null;return {...c,modelVersion:'gaussian-q-v1'};}catch{return null;}
}
