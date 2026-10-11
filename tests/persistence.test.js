import test from 'node:test';import assert from 'node:assert/strict';import {storeDesign,freshProgress,loadProgress,saveProgress,recordCompletion,validateProgress,STORAGE_KEY} from '../src/game/progress.js';
function memory(){const values=new Map();return {getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};}
test('fresh state has version and game version',()=>{const p=freshProgress();assert.equal(p.schemaVersion,3);assert.equal(p.gameVersion,'0.3.0');});
test('empty storage restores clean progress',()=>assert.deepEqual(loadProgress(memory()).progress,freshProgress()));
test('progress save and restore roundtrip',()=>{const s=memory(),p=freshProgress();recordCompletion(p,1,880,.2);p.tutorialSeen=true;assert.ok(saveProgress(s,p));assert.deepEqual(loadProgress(s).progress,p);});
test('best score and best loss update independently',()=>{const p=freshProgress();recordCompletion(p,1,950,.3);recordCompletion(p,1,700,.1);assert.deepEqual(p.missions[1],{complete:true,bestScore:950,bestLoss:.1});recordCompletion(p,1,400,.8);assert.equal(p.missions[1].bestLoss,.1);});
test('blocked storage load is playable',()=>{const s={getItem(){throw Error('blocked');}};const r=loadProgress(s);assert.deepEqual(r.progress,freshProgress());assert.equal(r.writable,false);});
test('quota failure does not throw',()=>assert.equal(saveProgress({setItem(){throw Error('quota');}},freshProgress()),false));
test('missing storage does not throw',()=>{assert.equal(loadProgress(null).writable,false);assert.equal(saveProgress(null,freshProgress()),false);});
test('malformed JSON cannot break boot',()=>{const s=memory();s.setItem(STORAGE_KEY,'{broken');assert.deepEqual(loadProgress(s).progress,freshProgress());});
test('unsupported schema rejected for future explicit migration',()=>assert.throws(()=>validateProgress({schemaVersion:99}),/schema/));
test('invalid completion values filtered',()=>{const p=freshProgress();p.missions[1]={complete:true,bestScore:99999,bestLoss:NaN};assert.deepEqual(validateProgress(p).missions,{});});
test('corrupt later-mission unlock claims are removed',()=>{const p=freshProgress();p.missions[3]={complete:true,bestScore:900,bestLoss:.1};assert.deepEqual(validateProgress(p).missions,{});});
test('invalid result never recorded',()=>assert.throws(()=>recordCompletion(freshProgress(),1,900,Infinity),RangeError));
test('reset is a fresh independent object',()=>{const p=freshProgress();recordCompletion(p,1,900,.1);assert.deepEqual(freshProgress().missions,{});});

test('schema 1 migration preserves prior mission records and unlocks Angular',()=>{const s=memory(),old={schemaVersion:1,gameVersion:'0.1.0',tutorialSeen:true,lastMission:3,missions:{1:{complete:true,bestScore:950,bestLoss:.1},2:{complete:true,bestScore:900,bestLoss:.2},3:{complete:true,bestScore:800,bestLoss:.93}}};s.setItem(STORAGE_KEY,JSON.stringify(old));const loaded=loadProgress(s);assert.equal(loaded.progress.schemaVersion,3);assert.deepEqual(loaded.progress.missions,old.missions);assert.equal(loaded.progress.tutorialSeen,true);assert.equal(loaded.progress.lastMission,3);assert.ok(saveProgress(s,loaded.progress));assert.equal(JSON.parse(s.getItem(STORAGE_KEY)).schemaVersion,3);});
test('future schema loads read-only without modifying original bytes',()=>{const s=memory(),raw=JSON.stringify({schemaVersion:99,missions:{important:'preserve'}});s.setItem(STORAGE_KEY,raw);const loaded=loadProgress(s);assert.equal(loaded.readOnly,true);assert.equal(loaded.status,'future-schema');assert.equal(s.getItem(STORAGE_KEY),raw);});
test('all four mission records survive save and reload',()=>{const s=memory(),p=freshProgress();for(let i=1;i<=4;i++)recordCompletion(p,i,900-i,.1*i);p.lastMission=4;assert.ok(saveProgress(s,p));assert.deepEqual(loadProgress(s).progress,p);});

test('schema 2 achievements and scores migrate without claiming new content completion',()=>{const old={schemaVersion:2,gameVersion:'0.2.0',lastMission:4,tutorialSeen:true,missions:{}};for(let id=1;id<=4;id++)old.missions[id]={complete:true,bestScore:900,bestLoss:.2};const p=validateProgress(old);assert.deepEqual(p.missions,old.missions);assert.deepEqual(p.content,{});assert.equal(p.lastMission,4);assert.equal(p.schemaVersion,3);});
test('redesigned completion records a separate content achievement and preserves old best',()=>{const p=freshProgress();p.missions[3]={complete:true,bestScore:1000,bestLoss:0};recordCompletion(p,3,900,.7);assert.equal(p.missions[3].bestLoss,0);assert.equal(p.content[3].bestLoss,.7);assert.equal(p.content[3].version,3);});
test('named design persistence retains optical parameters and evaluation conditions',()=>{const p=freshProgress();storeDesign(p,{name:'Test 4.0',w1:4,w2:4,pairType:'matched'});const restored=validateProgress(p);assert.equal(restored.designs[0].w1,4);assert.equal(restored.designs[0].name,'Test 4.0');});
test('maximum three saved designs and invalid radii rejected',()=>{const p=freshProgress();for(let i=0;i<3;i++)storeDesign(p,{name:'Mode '+i,w1:2,w2:2,pairType:'matched'});assert.throws(()=>storeDesign(p,{name:'fourth',w1:2,w2:2,pairType:'matched'}),RangeError);assert.throws(()=>storeDesign(freshProgress(),{name:'bad',w1:0,w2:2,pairType:'matched'}),RangeError);});
test('invalid content versions cannot claim redesigned achievements',()=>{const p=freshProgress();recordCompletion(p,1,900,0);p.content[1].version=99;assert.deepEqual(validateProgress(p).content,{});});
test('all seven mission records, sound preference and design survive reload',()=>{const p=freshProgress(),s=memory();for(let i=1;i<=7;i++)recordCompletion(p,i,900,.1*i);p.lastMission=7;p.sound=true;storeDesign(p,{name:'Matched',w1:2.5,w2:2.5,pairType:'matched'});saveProgress(s,p);assert.deepEqual(loadProgress(s).progress,p);});


test('evaluation snapshot roundtrip retains model, process, seed and statistics without aliasing',()=>{
 const p=freshProgress(),s=memory();storeDesign(p,{name:'Evaluated',w1:4,w2:4,pairType:'matched'});
 const e={seed:0,count:1000,processIndex:1,modelVersion:'gaussian-phase-v2',lossLimit:1,yield:.98,p95:.8,nominalLoss:0,
 process:{dx:{bias:.12,sigma:.2},dy:{bias:0,sigma:.2},thetaX:{bias:2.5,sigma:.45},thetaY:{bias:1.8,sigma:.45}}};
 p.designs[0].evaluations.push(e);assert.ok(saveProgress(s,p));assert.deepEqual(loadProgress(s).progress.designs[0].evaluations,[e]);
 const clean=validateProgress(p);clean.designs[0].evaluations[0].process.dx.bias=9;assert.equal(e.process.dx.bias,.12);
});
test('corrupt evaluation conditions cannot masquerade as a valid stored comparison',()=>{
 const p=freshProgress();storeDesign(p,{name:'Corrupt',w1:2,w2:2,pairType:'matched'});
 p.designs[0].evaluations=[{seed:1,count:1000,processIndex:0,yield:.99,p95:.2,nominalLoss:0,modelVersion:'gaussian-phase-v2',lossLimit:1,process:{}}];
 assert.deepEqual(validateProgress(p).designs[0].evaluations,[]);
});

test('null saved designs are filtered without losing valid achievements',()=>{const p=freshProgress();recordCompletion(p,1,900,.2);p.designs=[null,{name:'Kept',w1:2,w2:2,pairType:'matched'}];const clean=validateProgress(p);assert.equal(clean.missions[1].bestScore,900);assert.equal(clean.designs.length,1);});
