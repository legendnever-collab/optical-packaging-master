import test from 'node:test';import assert from 'node:assert/strict';import {freshProgress,loadProgress,saveProgress,recordCompletion,validateProgress,STORAGE_KEY} from '../src/game/progress.js';
function memory(){const values=new Map();return {getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};}
test('fresh state has version and game version',()=>{const p=freshProgress();assert.equal(p.schemaVersion,2);assert.equal(p.gameVersion,'0.2.0');});
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

test('schema 1 migration preserves prior mission records and unlocks Angular',()=>{const s=memory(),old={schemaVersion:1,gameVersion:'0.1.0',tutorialSeen:true,lastMission:3,missions:{1:{complete:true,bestScore:950,bestLoss:.1},2:{complete:true,bestScore:900,bestLoss:.2},3:{complete:true,bestScore:800,bestLoss:.93}}};s.setItem(STORAGE_KEY,JSON.stringify(old));const loaded=loadProgress(s);assert.equal(loaded.progress.schemaVersion,2);assert.deepEqual(loaded.progress.missions,old.missions);assert.equal(loaded.progress.tutorialSeen,true);assert.equal(loaded.progress.lastMission,3);assert.ok(saveProgress(s,loaded.progress));assert.equal(JSON.parse(s.getItem(STORAGE_KEY)).schemaVersion,2);});
test('future schema loads read-only without modifying original bytes',()=>{const s=memory(),raw=JSON.stringify({schemaVersion:99,missions:{important:'preserve'}});s.setItem(STORAGE_KEY,raw);const loaded=loadProgress(s);assert.equal(loaded.readOnly,true);assert.equal(loaded.status,'future-schema');assert.equal(s.getItem(STORAGE_KEY),raw);});
test('all four mission records survive save and reload',()=>{const s=memory(),p=freshProgress();for(let i=1;i<=4;i++)recordCompletion(p,i,900-i,.1*i);p.lastMission=4;assert.ok(saveProgress(s,p));assert.deepEqual(loadProgress(s).progress,p);});
