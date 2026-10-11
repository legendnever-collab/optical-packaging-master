import test from 'node:test';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';import {readFileSync} from 'node:fs';import vm from 'node:vm';
execFileSync(process.execPath,['scripts/build.mjs']);const html=readFileSync('dist/optical-packaging-master-v0.2.html','utf8');
test('single HTML has correct version and Korean language',()=>{assert.match(html,/v0\.2\.0 RC/);assert.match(html,/<html lang="ko">/);});
test('build contains inline style and script',()=>{assert.match(html,/<style>/);assert.match(html,/<script>/);});
test('no external runtime asset references',()=>{assert.doesNotMatch(html,/<(?:script|link|img|iframe)[^>]*(?:src|href)=["'][^#]/);assert.doesNotMatch(html,/@import|fetch\(|https?:\/\//);});
test('no ESM runtime imports in file deployment',()=>assert.doesNotMatch(html,/^import /m));
test('built JavaScript parses as a classic script',()=>{const code=html.match(/<script>([\s\S]*?)<\/script>/)[1];assert.doesNotThrow(()=>new vm.Script(code));});
test('rebuild is byte reproducible',()=>{execFileSync(process.execPath,['scripts/build.mjs']);assert.equal(readFileSync('dist/optical-packaging-master-v0.2.html','utf8'),html);});
test('scene and accessible controls included',()=>{assert.match(html,/<canvas[^>]*tabindex="0"/);assert.match(html,/touch-action:none/);assert.match(html,/prefers-reduced-motion/);assert.match(html,/id="summary-dialog"/);});
