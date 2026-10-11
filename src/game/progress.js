export const STORAGE_KEY='optical-packaging-master.progress';
export const SCHEMA_VERSION=2;
export function freshProgress() {return {schemaVersion:2,gameVersion:'0.2.0',tutorialSeen:false,missions:{},lastMission:1};}
export function validateProgress(value) {
 if (!value || typeof value!=='object' || ![1,2].includes(value.schemaVersion)) throw new Error('Unsupported or invalid progress schema');
 const p=freshProgress();p.tutorialSeen=value.tutorialSeen===true;
 p.lastMission=[1,2,3,4].includes(value.lastMission)?value.lastMission:1;
 for (const id of [1,2,3,4]) {
  const m=value.missions?.[id];
  if (m?.complete===true && Number.isFinite(m.bestScore)&&m.bestScore>=0&&m.bestScore<=1000&&Number.isFinite(m.bestLoss)&&m.bestLoss>=0)
   p.missions[id]={complete:true,bestScore:m.bestScore,bestLoss:m.bestLoss};
 }
 // Schema 1 migrates in memory. Existing completed M03 remains completed.
 for(const id of [2,3,4])if(!p.missions[id-1])delete p.missions[id];
 return p;
}
export function loadProgress(storage) {
 try {const raw=storage.getItem(STORAGE_KEY),value=raw?JSON.parse(raw):null;
  if(value?.schemaVersion>SCHEMA_VERSION)return {progress:freshProgress(),status:'future-schema',writable:false,readOnly:true};
  return {progress:value?validateProgress(value):freshProgress(),status:'ready',writable:true,readOnly:false};}
 catch(error) {return {progress:freshProgress(),status:'unavailable',writable:false};}
}
export function saveProgress(storage,progress) {
 try {storage.setItem(STORAGE_KEY,JSON.stringify(validateProgress(progress)));return true;}catch {return false;}
}
export function recordCompletion(progress,id,score,loss) {
 if (!Number.isFinite(loss)||loss<0||!Number.isFinite(score)||score<0||score>1000) throw new RangeError('Invalid completion result');
 const old=progress.missions[id];
 progress.missions[id]={complete:true,bestScore:Math.max(old?.bestScore??0,score),bestLoss:Math.min(old?.bestLoss??Infinity,loss)};
 return progress;
}
