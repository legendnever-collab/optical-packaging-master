export const STORAGE_KEY='optical-packaging-master.progress';
export const SCHEMA_VERSION=1;
export function freshProgress() {return {schemaVersion:1,gameVersion:'0.1.0',tutorialSeen:false,missions:{},lastMission:1};}
export function validateProgress(value) {
 if (!value || typeof value!=='object' || value.schemaVersion!==1) throw new Error('Unsupported or invalid progress schema');
 const p=freshProgress();p.tutorialSeen=value.tutorialSeen===true;
 p.lastMission=[1,2,3].includes(value.lastMission)?value.lastMission:1;
 for (const id of [1,2,3]) {
  const m=value.missions?.[id];
  if (m?.complete===true && Number.isFinite(m.bestScore)&&m.bestScore>=0&&m.bestScore<=1000&&Number.isFinite(m.bestLoss)&&m.bestLoss>=0)
   p.missions[id]={complete:true,bestScore:m.bestScore,bestLoss:m.bestLoss};
 }
 // Preserve campaign ordering even if a corrupt save claims an unlocked later mission.
 if (!p.missions[1]) {delete p.missions[2];delete p.missions[3];}
 else if (!p.missions[2]) delete p.missions[3];
 return p;
}
export function loadProgress(storage) {
 try {const raw=storage.getItem(STORAGE_KEY);return {progress:raw?validateProgress(JSON.parse(raw)):freshProgress(),status:'ready',writable:true};}
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
