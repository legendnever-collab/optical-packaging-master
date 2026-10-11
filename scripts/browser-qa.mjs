import {pathToFileURL} from 'node:url';import {resolve} from 'node:path';import {writeFileSync,mkdirSync} from 'node:fs';import assert from 'node:assert/strict';
let pw;try{pw=await import('playwright');}catch{pw=await import(pathToFileURL(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright/index.mjs'));}
writeFileSync('docs/browser-qa-results.json',JSON.stringify({status:'incomplete',pass:0,fail:0})+'\n');
const engines=(process.env.OPM_BROWSERS||'chromium,firefox,webkit').split(',');const results=[],environments=[];
const artifact=pathToFileURL(resolve('dist/optical-packaging-master-v0.1.html')).href;
mkdirSync('tmp/qa',{recursive:true});
async function check(name,fn){try{await fn();results.push({name,status:'PASS'});console.log('PASS '+name);}catch(e){results.push({name,status:'FAIL',error:e.message});console.error('FAIL '+name+': '+e.message);}}
const text=async(p,id)=>p.locator('#'+id).innerText();
async function slider(p,id,value){await p.locator('#'+id).evaluate((el,value)=>{el.value=value;el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));},String(value));}
async function blockNetwork(context,engine){if(engine==='webkit')await context.route(/^https?:/,route=>route.abort('internetdisconnected'));else await context.setOffline(true);}
async function align(p){await slider(p,'x-offset',0);await slider(p,'y-offset',0);}
async function close(p){await p.locator('#dialog-continue').click();}
for(const engine of engines){
 let browser;try{browser=await pw[engine].launch({headless:true,...(engine==='chromium'&&process.env.OPM_CHROMIUM_PATH?{executablePath:process.env.OPM_CHROMIUM_PATH,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']}:{} )});}catch(e){results.push({name:engine+' browser launch',status:'FAIL',error:e.message});continue;}
 environments.push({engine,version:browser.version(),networkMode:engine==='webkit'?'HTTP(S) interception abort':'native offline emulation'});
 const context=await browser.newContext({viewport:{width:1440,height:1080},reducedMotion:'reduce'});await blockNetwork(context,engine);
 const p=await context.newPage(),errors=[],network=[];p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(/^https?:/.test(r.url()))network.push(r.url());});
 const tag=engine+' / ';
 await p.goto(artifact);await p.waitForSelector('#mission-title');
 await check(tag+'local file boots with network blocked',async()=>assert.equal(await text(p,'mission-title'),'Find the Light'));
 await check(tag+'campaign locks later missions',async()=>{assert.ok(await p.locator('[data-mission="2"]').isDisabled());assert.ok(await p.locator('[data-mission="3"]').isDisabled());});
 await check(tag+'desktop layout fits viewport',async()=>assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)));
 await p.screenshot({path:`tmp/qa/${engine}-desktop.png`,fullPage:true});
 await p.locator('#start').click();await p.locator('#complete').click();
 await check(tag+'incorrect Mission 01 cannot pass',async()=>{assert.ok(!(await p.locator('#summary-dialog').evaluate(e=>e.open)));assert.match(await text(p,'feedback'),/TARGET NOT MET/);});
 await p.locator('#hint').click();await check(tag+'concept hint appears',async()=>assert.match(await text(p,'feedback'),/Hint 1/));
 const box=await p.locator('#alignment-canvas').boundingBox(),scale=Math.min(box.width,box.height)/14,cx=box.x+box.width/2,cy=box.y+box.height/2;
 await p.mouse.move(cx+4*scale,cy+3*scale);await p.mouse.down();await p.mouse.move(cx+.2*scale,cy-.1*scale,{steps:12});await p.mouse.up();
 await check(tag+'direct mouse drag updates physical output',async()=>assert.ok(Number(await text(p,'total-loss'))<.1));
 const draggedX=Number(await p.locator('#x-offset').inputValue()),draggedY=Number(await p.locator('#y-offset').inputValue());
 await check(tag+'drag and slider share exact state',async()=>{assert.ok(Math.abs(draggedX-.2)<=2/scale&&Math.abs(draggedY-.1)<=2/scale);assert.equal(await text(p,'x-output'),(draggedX>=0?'+':'−')+Math.abs(draggedX).toFixed(2)+' µm');assert.equal(await text(p,'y-output'),(draggedY>=0?'+':'−')+Math.abs(draggedY).toFixed(2)+' µm');const expected=10/Math.LN10*(draggedX**2+draggedY**2)/2.5**2;assert.equal(await text(p,'total-loss'),expected.toFixed(2));assert.equal(await text(p,'attempts'),'1');});
 await p.locator('#alignment-canvas').focus();await p.keyboard.press('Shift+ArrowRight');
 await check(tag+'keyboard fine alignment works',async()=>assert.equal(Number(await p.locator('#x-offset').inputValue()),Number((draggedX+.01).toFixed(2))));
 await p.locator('#center').click();await check(tag+'Center restores ideal 100 percent and zero loss',async()=>{assert.equal(await text(p,'efficiency'),'100.00%');assert.equal(await text(p,'total-loss'),'0.00');});
 await p.locator('#complete').click();await check(tag+'Mission 01 completes with four learning sections',async()=>{assert.ok(await p.locator('#summary-dialog').evaluate(e=>e.open));assert.equal(await p.locator('#dialog-content h3').count(),4);});await close(p);
 await check(tag+'Mission 02 unlocks',async()=>assert.ok(!(await p.locator('[data-mission="2"]').isDisabled())));
 await p.reload();await check(tag+'progress restores after offline refresh',async()=>{assert.ok(!(await p.locator('[data-mission="2"]').isDisabled()));assert.ok(Number(await text(p,'best-score'))>0);});
 await p.locator('#next').click();await p.locator('#start').click();
 await check(tag+'Mission 02 disables Center shortcut',async()=>assert.ok(await p.locator('#center').isDisabled()));
 await align(p);await p.locator('#complete').click();
 await check(tag+'Challenge one does not prematurely complete mission',async()=>{assert.match(await text(p,'mission-state'),/CHALLENGE 2/);assert.ok(await p.locator('[data-mission="3"]').isDisabled());});
 await align(p);await p.locator('#complete').click();await check(tag+'different third challenge advances',async()=>assert.match(await text(p,'mission-state'),/CHALLENGE 3/));
 await align(p);await p.locator('#complete').click();await check(tag+'all three Challenges complete Mission 02',async()=>{assert.ok(await p.locator('#summary-dialog').evaluate(e=>e.open));assert.match(await text(p,'dialog-content'),/WORST OF 3/);});await close(p);
 await p.locator('#next').click();await p.locator('#start').click();
 await check(tag+'Mission 03 live comparison has all three modes',async()=>{assert.equal(await p.locator('#comparison-rows tr').count(),3);assert.match(await text(p,'comparison-rows'),/4.34 dB/);});
 await p.locator('#capture-comparison').click();await p.locator('#tolerance-answer').selectOption('Narrow');await p.locator('#mismatch-answer').selectOption('Medium');await p.locator('#complete').click();
 await check(tag+'incorrect trade-off answer cannot complete',async()=>assert.ok(!(await p.locator('#summary-dialog').evaluate(e=>e.open))));
 await p.locator('#mode-size').selectOption('4');await p.locator('#pair-type').selectOption('fixed');await p.locator('#center').click();
 await check(tag+'Expanded fixed WG leaves centered mismatch',async()=>{assert.equal(await text(p,'total-loss'),'0.93');assert.equal(await text(p,'alignment-loss'),'0.00 dB');});
 await p.locator('#tolerance-answer').selectOption('Expanded');await p.locator('#complete').click();await check(tag+'Mission 03 completes after comparison and correct principles',async()=>assert.ok(await p.locator('#summary-dialog').evaluate(e=>e.open)));await close(p);
 await p.locator('#reset').click();await check(tag+'Replay preserves Personal Best and resets session',async()=>{assert.equal(await text(p,'attempts'),'0');assert.equal(await text(p,'best-score'),'1000');assert.ok(!(await p.locator('#start').isEnabled()));});
 await p.locator('#practice').click();await p.locator('#mode-size').selectOption('4');await p.locator('#pair-type').selectOption('fixed');await p.locator('#center').click();await slider(p,'fixed-interface',2);
 await check(tag+'practice fixed loss separately adds to total',async()=>{assert.equal(await text(p,'fixed-loss'),'2.00 dB');assert.equal(await text(p,'total-loss'),'2.93');assert.equal(await text(p,'best-score'),'연습 · Score 없음');assert.ok(await p.locator('#complete').isDisabled());});
 await p.screenshot({path:`tmp/qa/${engine}-comparison.png`,fullPage:true});
 await check(tag+'no runtime HTTP asset requests',async()=>assert.deepEqual(network,[]));await check(tag+'no critical JavaScript errors',async()=>assert.deepEqual(errors,[]));
 // Finish desktop context before creating independent failure/mobile contexts.
 await context.close();
 const blocked=await browser.newContext();await blockNetwork(blocked,engine);await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked by policy');}}));const bp=await blocked.newPage();await bp.goto(artifact);await bp.locator('#start').click();await bp.locator('#center').click();await bp.locator('#complete').click();
 await check(tag+'blocked Local Storage still allows completion',async()=>{assert.match(await text(bp,'save-status'),/저장 제한/);assert.ok(await bp.locator('#summary-dialog').evaluate(e=>e.open));});await blocked.close();
 const mobile=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:engine!=='firefox',reducedMotion:'reduce'});await blockNetwork(mobile,engine);const mp=await mobile.newPage();await mp.goto(artifact);await mp.locator('#practice').click();
 await check(tag+'mobile layout has no horizontal page overflow',async()=>assert.ok(await mp.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)));
 await mp.screenshot({path:`tmp/qa/${engine}-mobile.png`,fullPage:true});
 if(engine==='chromium'){
  const cdp=await mobile.newCDPSession(mp),b=await mp.locator('#alignment-canvas').boundingBox(),k=Math.min(b.width,b.height)/14,x=b.x+b.width/2,y=b.y+b.height/2;
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x+2*k,y:y-k}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await check(tag+'actual touch drag updates alignment',async()=>{assert.equal(Number(await mp.locator('#x-offset').inputValue()),0);assert.equal(Number(await mp.locator('#y-offset').inputValue()),0);assert.equal(await text(mp,'attempts'),'1');});
 }
 await mobile.close();
 const resetContext=await browser.newContext();await blockNetwork(resetContext,engine);const rp=await resetContext.newPage();await rp.goto(artifact);await rp.locator('#start').click();await rp.locator('#center').click();await rp.locator('#complete').click();await close(rp);rp.once('dialog',d=>d.accept());await rp.locator('#reset-progress').click();
 await check(tag+'Reset Progress confirms and relocks campaign',async()=>{assert.ok(await rp.locator('[data-mission="2"]').isDisabled());assert.equal(await text(rp,'best-score'),'—');});await resetContext.close();await browser.close();
}
const summary={engines,environments,pass:results.filter(r=>r.status==='PASS').length,fail:results.filter(r=>r.status==='FAIL').length,results};writeFileSync('docs/browser-qa-results.json',JSON.stringify(summary,null,2)+'\n');console.log(JSON.stringify({pass:summary.pass,fail:summary.fail}));if(summary.fail)process.exitCode=1;
