import test from 'node:test';import assert from 'node:assert/strict';import {freshProgress,loadProgress,saveProgress,recordCompletion,validateProgress,STORAGE_KEY} from '../src/game/progress.js';
function memory(){const values=new Map();return {getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};}
test('fresh state has version and game version',()=>{const p=freshProgress();assert.equal(p.schemaVersion,1);assert.equal(p.gameVersion,'0.1.0');});
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
