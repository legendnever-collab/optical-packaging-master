import {gaussianCoupling,alignmentTolerance,compareModes} from './physics/gaussian-coupling.js';
import {missions,challengeOffsets,canAccess,makeSession,missionPass} from './game/missions.js';
import {gameScore} from './game/scoring.js';
import {freshProgress,loadProgress,saveProgress,recordCompletion} from './game/progress.js';
import {AlignmentScene} from './ui/alignment-scene.js';
import {bindControls} from './ui/controls.js';
import {learningSummary,showLearning} from './ui/learning-panel.js';
const $=id=>document.getElementById(id);
let storage;try{storage=window.localStorage;}catch{storage=null;}
const loaded=loadProgress(storage);let progress=loaded.progress,saved=loaded.writable;
let missionId=canAccess(progress.lastMission,progress)?progress.lastMission:1,practice=false,session=makeSession(missionId),dx=0,dy=0,w1=2.5,w2=2.5,fixedLoss=0,pairType='matched',result,initialLoss=0,scene;
const fmt=(v,n=2)=>Number.isFinite(v)?v.toFixed(n):'∞';
const signed=v=>(v>=0?'+':'−')+Math.abs(v).toFixed(2);
function persist(){saved=saveProgress(storage,progress);$('save-status').textContent=saved?'● Progress 저장됨':'△ 저장 제한 · 이 세션에서 플레이 가능';}
function feedback(text,tone=''){$('feedback').textContent=text;$('feedback').className='feedback '+tone;}
function renderNav(){
 $('mission-nav').innerHTML=missions.map(m=>`<button class="mission-button ${!practice&&m.id===missionId?'active':''}" data-mission="${m.id}" ${canAccess(m.id,progress)?'':'disabled'} aria-current="${!practice&&m.id===missionId?'step':'false'}"><span class="number">0${m.id}</span><span><strong>${m.title}</strong><small>${canAccess(m.id,progress)?m.subtitle:'이전 Mission 완료 후 Unlock'}</small></span>${progress.missions[m.id]?.complete?'<span class="done" aria-label="완료">✓</span>':''}</button>`).join('');
 $('practice').classList.toggle('active',practice);
}
function loadMission(id,isPractice=false){
 if(!canAccess(id,progress,isPractice))return;
 missionId=id;practice=isPractice;session=makeSession(id);const m=missions[id-1];[dx,dy]=m.initial;w1=m.w1;w2=m.w2;fixedLoss=0;pairType='matched';
 if(practice){dx=2;dy=1;w1=w2=2.5;session.started=true;}
 result=gaussianCoupling({w1,w2,dx,dy,fixedLoss});initialLoss=result.totalLoss;
 if(!practice){progress.lastMission=id;persist();}
 $('mission-title').textContent=practice?'Free Practice':m.title;$('objective').textContent=practice?'Mode Radius, Pair Type, X/Y Offset와 Fixed Loss를 바꿔 자유롭게 비교하세요. Campaign Progress와 Score에는 영향을 주지 않습니다.':m.objective;
 $('scene-title').textContent=practice?'자유로운 Optical Experiment':m.subtitle;
 $('mode-badge').textContent=practice?'ENGINEERING SANDBOX':`ALIGNMENT STATION / 0${id}`;
 $('target-label').textContent=id===3&&!practice?'MISSION TARGET':'TOTAL LOSS TARGET';$('target-value').textContent=id===3&&!practice?'비교 + 원리 이해':`≤ ${m.target.toFixed(2)} dB`;
 $('hint-text').textContent=m.hints[0];$('mode-controls').hidden=!(id===3||practice);$('fixed-controls').hidden=!practice;$('comparison-panel').hidden=!(id===3||practice);$('comparison-quiz').hidden=practice;
 $('mode-size').value=String(w1);$('pair-type').value=pairType;$('fixed-interface').value='0';$('tolerance-answer').value='';$('mismatch-answer').value='';
 $('capture-status').textContent='0.5 µm 이상의 Error에서 비교 실험을 기록하세요.';
 $('tutorial').hidden=progress.tutorialSeen||practice||id!==1;$('tutorial-title').textContent='01 / 실험을 시작하세요';$('tutorial-text').textContent='Start를 누른 뒤 Fiber Mode의 중심을 잡고 움직여보세요. 약 20초면 첫 원리를 경험합니다.';
 renderNav();feedback(practice?'자유 실험 중 · 결과는 Physics Model에 따라 실시간 계산됩니다.':'관찰하고, 움직이고, 빛을 연결하세요.');render();
}
function renderComparison(){
 const matched=compareModes(dx,dy,true),fixed=compareModes(dx,dy,false);
 $('comparison-caption').textContent=`공통 Offset: X ${signed(dx)} / Y ${signed(dy)} µm · 현재 표시: ${pairType==='matched'?'Matched pair':'Fixed Waveguide'}`;
 $('comparison-rows').innerHTML=matched.map((m,i)=>`<tr class="${w1===m.w1?'selected':''}"><td>${m.name} / ${m.w1.toFixed(1)} µm</td><td>${fmt(m.totalLoss)} dB</td><td>${fmt(fixed[i].totalLoss)} dB</td><td>${fmt(m.tolerance)} µm</td></tr>`).join('');
}
function render(){
 result=gaussianCoupling({w1,w2,dx,dy,fixedLoss});const m=missions[missionId-1],enabled=session.started&&!session.completed;
 if(session.started)session.bestLoss=Math.min(session.bestLoss,result.totalLoss);
 $('total-loss').textContent=fmt(result.totalLoss);$('efficiency').textContent=fmt(result.efficiency*100)+'%';$('alignment-error').textContent=fmt(result.error)+' µm';
 for(const [key,val] of [['mismatch-loss',result.mismatchLoss],['alignment-loss',result.alignmentLoss],['overlap-loss',result.overlapLoss],['fixed-loss',fixedLoss]])$(key).textContent=fmt(val)+' dB';
 $('power-fill').style.width=(result.totalEfficiency*100)+'%';$('power-number').textContent=fmt(result.totalEfficiency*100)+'%';$('loss-fill').style.width=Math.min(100,result.totalLoss/10*100)+'%';$('loss-target-marker').style.left=(m.target/10*100)+'%';
 const within=result.totalLoss<=m.target+1e-9;
 $('loss-status').textContent=missionId===3&&!practice?'Loss는 관찰값 · 완료 조건은 비교와 원리 이해':within?'PASS · 현재 Loss Target 달성':'TARGET NOT MET · 중심 간격 또는 Mismatch를 확인';
 $('mission-state').textContent=practice?'FREE PRACTICE':session.completed?'COMPLETE':!session.started?'READY':missionId===2?`CHALLENGE ${session.challenge+1} / 3`:missionId===3?'COMPARE':within?'TARGET MET':'ALIGNING';$('mission-state').classList.toggle('pass',session.completed||within&&session.started);
 $('x-offset').value=dx.toFixed(2);$('y-offset').value=dy.toFixed(2);$('x-output').textContent=signed(dx)+' µm';$('y-output').textContent=signed(dy)+' µm';$('scene-coordinates').textContent=`X ${signed(dx)} / Y ${signed(dy)} µm`;
 $('radii-label').textContent=`w₁ ${w1.toFixed(1)} µm / w₂ ${w2.toFixed(1)} µm`;$('fixed-output').textContent=fixedLoss.toFixed(1)+' dB';
 $('attempts').textContent=session.attempts;$('best-loss').textContent=Number.isFinite(session.bestLoss)?fmt(session.bestLoss)+' dB':'—';$('best-score').textContent=practice?'연습 · Score 없음':progress.missions[missionId]?.bestScore??'—';$('personal-best-loss').textContent=!practice&&progress.missions[missionId]?fmt(progress.missions[missionId].bestLoss)+' dB':'—';
 for(const id of ['x-offset','y-offset','mode-size','pair-type','fixed-interface'])$(id).disabled=!enabled;
 $('center').disabled=!enabled||!practice&&missionId===2;$('start').disabled=session.started;$('start').hidden=practice;$('scene-lock').hidden=enabled;
 $('scene-lock').textContent=session.completed?'Mission Complete · Retry로 다시 실험':'Start를 눌러 Alignment를 시작하세요';
 $('complete').disabled=practice||!session.started||session.completed;$('complete').textContent=missionId===2&&!session.completed?`Challenge ${session.challenge+1} 완료`:'Complete Mission';
 $('next').disabled=practice||missionId===3||!progress.missions[missionId]?.complete;$('hint').disabled=!session.started||session.completed;$('capture-comparison').disabled=!enabled;
 $('tolerance-answer').disabled=!enabled;$('mismatch-answer').disabled=!enabled;
 if(missionId===3||practice)renderComparison();
 if(scene)scene.draw();
}
function moveTo(x,y){if(!session.started||session.completed)return;dx=Math.round(Math.max(-6,Math.min(6,x))*100)/100;dy=Math.round(Math.max(-6,Math.min(6,y))*100)/100;
 if(!progress.tutorialSeen&&!practice&&missionId===1){$('tutorial-title').textContent='03 / Loss 변화를 관찰하세요';$('tutorial-text').textContent='중심이 가까워질수록 Error와 Loss가 함께 줄어듭니다. Target 이하라면 Complete Mission을 누르세요.';}
 render();
}
function attempt(){if(session.started&&!session.completed){session.attempts++;render();}}
function complete(){
 if(practice)return;
 if(!missionPass(missionId,result,session)){feedback(missionId===3?'비교 실험을 기록하고 두 질문을 다시 확인하세요. Matched와 Fixed WG를 구분해보세요.':`TARGET NOT MET · Total Loss를 ${missions[missionId-1].target.toFixed(2)} dB 이하로 조정하세요.`,'warning');return;}
 if(missionId===2){
  session.challengeResults.push({loss:result.totalLoss,score:gameScore(result.totalLoss,.4,session.attempts,session.hints),attempts:session.attempts});
  if(session.challenge<2){session.challenge++;[dx,dy]=challengeOffsets[session.challenge];session.attempts=0;session.hints=0;session.bestLoss=Infinity;feedback(`Challenge ${session.challenge} PASS · 다음 위치에서도 정렬해보세요.`,'success');render();return;}
 }
 let score=missionId===3?Math.max(0,1000-20*session.hints):gameScore(result.totalLoss,missions[missionId-1].target,session.attempts,session.hints);
 let loss=result.totalLoss;
 if(missionId===2){score=Math.round(session.challengeResults.reduce((n,r)=>n+r.score,0)/3);loss=Math.max(...session.challengeResults.map(r=>r.loss));}
 // Mission 03 stores the selected comparison design's actual Loss; no Loss-based grading.
 session.completed=true;recordCompletion(progress,missionId,score,loss);progress.tutorialSeen=true;persist();renderNav();render();feedback('MISSION COMPLETE · Learning Summary에서 결과의 이유를 확인하세요.','success');
 const learn=learningSummary(missionId,initialLoss,loss);
 if(missionId===2)learn.happened+=` Challenge Loss: ${session.challengeResults.map(r=>r.loss.toFixed(2)+' dB').join(' / ')}.`;
 showLearning($('summary-dialog'),learn,score,loss,missionId===2?' / WORST OF 3':missionId===3?' / SELECTED DESIGN':'');
}
bindControls({move:(axis,v)=>moveTo(axis==='x'?v:dx,axis==='y'?v:dy),attempt,
 selectMode:v=>{w1=v;w2=pairType==='matched'?v:2.5;attempt();render();},selectPair:v=>{pairType=v;w2=v==='matched'?w1:2.5;attempt();render();},selectFixed:v=>{fixedLoss=v;render();},
 answer:(key,v)=>{session[key+'Answer']=v;render();}});
$('mission-nav').addEventListener('click',e=>{const b=e.target.closest('[data-mission]');if(b)loadMission(Number(b.dataset.mission));});
$('practice').addEventListener('click',()=>loadMission(3,true));
$('start').addEventListener('click',()=>{session.started=true;session.bestLoss=result.totalLoss;feedback('Fiber Mode의 중심을 드래그해보세요.');
 $('tutorial-title').textContent='02 / Fiber를 잡고 움직이세요';$('tutorial-text').textContent='청록색 + 표시를 파란색 + 표시 쪽으로 옮기세요. Slider와 방향키도 같은 위치를 조정합니다.';render();});
$('reset').addEventListener('click',()=>{const wasStarted=session.started;loadMission(missionId,practice);session.started=wasStarted||practice;render();feedback('실험을 초기 위치로 되돌렸습니다. Progress와 Personal Best는 유지됩니다.');});
$('center').addEventListener('click',()=>{if($('center').disabled)return;moveTo(0,0);attempt();feedback(result.mismatchLoss>0?'Center Alignment 완료 · Mode 크기가 다르면 Mismatch Loss는 남습니다.':'Center Alignment 완료 · 이상적인 Matched Mode에서 0 dB를 확인하세요.');});
$('hint').addEventListener('click',()=>{const m=missions[missionId-1];$('hint-text').textContent=m.hints[Math.min(session.hints,m.hints.length-1)];session.hints++;feedback(`Hint ${Math.min(session.hints,3)} · Engineering Note를 확인하세요.`);render();});
$('complete').addEventListener('click',complete);$('next').addEventListener('click',()=>loadMission(Math.min(3,missionId+1)));
$('skip-tutorial').addEventListener('click',()=>{progress.tutorialSeen=true;$('tutorial').hidden=true;persist();});
$('capture-comparison').addEventListener('click',()=>{if(result.error<.5){feedback('Error 0.5 µm 이상에서 비교해보세요. Center 결과는 Mismatch 확인에 활용할 수 있습니다.','warning');return;}
 session.comparisonRecorded=true;session.captured={dx,dy,matched:compareModes(dx,dy,true),fixed:compareModes(dx,dy,false)};
 $('capture-status').textContent=`비교 기록 ✓ X ${signed(dx)} / Y ${signed(dy)} µm에서 3 Matched + 3 Fixed WG 측정. 이제 Center에서도 Mismatch를 관찰하세요.`;feedback('동일한 Offset의 여섯 계산값을 기록했습니다. 두 원리 질문에 답해보세요.','success');render();});
const closeDialog=()=>$('summary-dialog').close();$('close-dialog').addEventListener('click',closeDialog);$('dialog-continue').addEventListener('click',closeDialog);
$('assumptions').addEventListener('click',()=>{$('dialog-content').innerHTML='<h2>Engineering Assumptions</h2><h3>Simplified Gaussian Mode Model</h3><p>같은 평면의 이상적인 원형 Gaussian Mode, 횡방향 X/Y Offset만 계산합니다. Mode Radius는 Field Amplitude 1/e 반경이며, 모든 길이는 µm입니다.</p><h3>Physics Result와 Game Score</h3><p>η = [2w₁w₂/(w₁²+w₂²)]² × exp[−2(dx²+dy²)/(w₁²+w₂²)]. Loss = −10 log₁₀(η). Fixed Interface Loss는 별도 dB 항목입니다. Game Score가 Physics Result를 바꾸지 않습니다.</p><h3>Visual Interpretation</h3><p>Heatmap은 상대 Intensity, 중앙 장면은 Transverse Plane입니다. 하단 Transmission Pulse와 Power Meter는 실제 Total Efficiency에 연동된 지표입니다. 색상의 겹침 자체가 Overlap Integral은 아닙니다.</p><h3>현재 계산하지 않는 항목</h3><p>Full-vector EM, Fresnel Reflection, Polarization, Gap, Angular Offset, Evanescent Coupling, Propagation, Thermal, Adhesive, Yield. 실제 공정 가능성은 후속 버전에서 별도 모델로 다룹니다.</p><h3>Progress 저장</h3><p>Local Storage를 사용하며 Browser·Profile·파일 경로에 따라 저장 영역이 달라질 수 있습니다. 같은 HTML 경로와 같은 Browser Profile에서 이어서 실행하세요. 저장이 제한되면 이 세션에서는 계속 플레이할 수 있습니다.</p>';$('summary-dialog').showModal();});
$('reset-progress').addEventListener('click',()=>{if(!confirm('저장된 Mission 완료 상태와 Personal Best를 모두 초기화할까요?'))return;progress=freshProgress();persist();loadMission(1);});
scene=new AlignmentScene($('alignment-canvas'),()=>({dx,dy,w1,w2,result,enabled:session.started&&!session.completed,showTolerance:missionId===3||practice,tolerance:alignmentTolerance(w1,w2,1,fixedLoss)}),moveTo,attempt);
loadMission(missionId);persist();
