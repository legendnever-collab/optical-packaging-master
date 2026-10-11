import {gaussianCoupling,alignmentTolerance,compareModes} from './physics/gaussian-coupling.js';
import {angularCoupling} from './physics/angular-coupling.js';
import {AngularScene} from './ui/angular-scene.js';
import {missions,modeRadii,guidedReady,challengeOffsets,canAccess,makeSession,missionPass} from './game/missions.js';
import {gameScore} from './game/scoring.js';
import {freshProgress,loadProgress,saveProgress,recordCompletion} from './game/progress.js';
import {AlignmentScene} from './ui/alignment-scene.js';
import {bindControls} from './ui/controls.js';
import {learningSummary,showLearning} from './ui/learning-panel.js';
const $=id=>document.getElementById(id);
let storage;try{storage=window.localStorage;}catch{storage=null;}
const loaded=loadProgress(storage);let progress=loaded.progress,saved=loaded.writable;
let missionId=canAccess(progress.lastMission,progress)?progress.lastMission:1,practice=false,session=makeSession(missionId),dx=0,dy=0,w1=2.5,w2=2.5,fixedLoss=0,pairType='matched',thetaX=0,thetaY=0,wavelength=1.55,result,initialLoss=0,scene;
const fmt=(v,n=2)=>Number.isFinite(v)?v.toFixed(n):'∞';
const signed=v=>(v>=0?'+':'−')+Math.abs(v).toFixed(2);
function persist(){if(loaded.readOnly){$('save-status').textContent='△ 새 버전의 저장 데이터 보존 · 현재 세션만 진행';return;}saved=saveProgress(storage,progress);$('save-status').textContent=saved?'● Progress 저장됨':'△ 저장 제한 · 이 세션에서 플레이 가능';}
function feedback(text,tone=''){$('feedback').textContent=text;$('feedback').className='feedback '+tone;}
function renderNav(){
 $('mission-nav').innerHTML=missions.map(m=>`<button class="mission-button ${!practice&&m.id===missionId?'active':''}" data-mission="${m.id}" ${canAccess(m.id,progress)?'':'disabled'} aria-current="${!practice&&m.id===missionId?'step':'false'}"><span class="number">0${m.id}</span><span><strong>${m.title}</strong><small>${canAccess(m.id,progress)?m.subtitle:'이전 Mission 완료 후 Unlock'}</small></span>${progress.missions[m.id]?.complete?'<span class="done" aria-label="완료">✓</span>':''}</button>`).join('');
 $('practice').classList.toggle('active',practice);
}
function loadMission(id,isPractice=false){
 if(!canAccess(id,progress,isPractice))return;
 missionId=id;practice=isPractice;session=makeSession(id);const m=missions[id-1];[dx,dy]=m.initial;w1=m.w1;w2=m.w2;fixedLoss=0;pairType='matched';thetaX=id===4?3:0;thetaY=id===4?-2:0;wavelength=1.55;
 if(practice){dx=2;dy=1;w1=w2=2.5;session.started=true;}
 result=angularCoupling({w1,w2,dx,dy,thetaX,thetaY,wavelength,fixedLoss});initialLoss=result.totalLoss;
 if(!practice){progress.lastMission=id;persist();}
 $('mission-title').textContent=practice?'Free Practice':m.title;$('objective').textContent=practice?'Mode Radius, X/Y, Tilt, Wavelength와 Fixed Loss를 바꿔 자유롭게 비교하세요. Campaign Progress와 Score에는 영향을 주지 않습니다.':m.objective;
 $('scene-title').textContent=practice?'자유로운 Optical Experiment':m.subtitle;
 $('mode-badge').textContent=practice?'ENGINEERING SANDBOX':`ALIGNMENT STATION / 0${id}`;
 $('target-label').textContent='TOTAL LOSS TARGET';$('target-value').textContent=`≤ ${m.target.toFixed(2)} dB`;
 $('hint-text').textContent=m.hints[0];$('mode-controls').hidden=!practice;$('fixed-controls').hidden=!practice;$('comparison-panel').hidden=!practice;
 $('mode-experiment').hidden=practice||id!==3;$('angular-panel').hidden=!(practice||id===4);$('angle-controls').hidden=!(practice||id===4);$('angular-loss-row').hidden=!(practice||id===4);$('wavelength-control').hidden=!practice;$('zero-tilt').hidden=!practice;
 $('mode-size').value=String(w1);$('pair-type').value=pairType;$('fixed-interface').value='0';$('wavelength').value='1.55';
 $('tutorial').hidden=progress.tutorialSeen||practice||id!==1;$('tutorial-title').textContent='01 / 실험을 시작하세요';$('tutorial-text').textContent='Start를 누른 뒤 Fiber Mode의 중심을 잡고 움직여보세요. 약 20초면 첫 원리를 경험합니다.';
 renderNav();feedback(practice?'자유 실험 중 · 결과는 Physics Model에 따라 실시간 계산됩니다.':'관찰하고, 움직이고, 빛을 연결하세요.');render();
}
function renderComparison(){
 const matched=compareModes(dx,dy,true),fixed=compareModes(dx,dy,false);
 $('comparison-caption').textContent=`공통 Offset: X ${signed(dx)} / Y ${signed(dy)} µm · 현재 표시: ${pairType==='matched'?'Matched pair':'Fixed Waveguide'}`;
 $('comparison-rows').innerHTML=matched.map((m,i)=>`<tr class="${w1===m.w1?'selected':''}"><td>${m.name} / ${m.w1.toFixed(1)} µm</td><td>${fmt(m.totalLoss)} dB</td><td>${fmt(fixed[i].totalLoss)} dB</td><td>${fmt(m.tolerance)} µm</td></tr>`).join('');
}
function renderModeExperiment(){
 const stage=session.modeStep,names=['Narrow','Medium','Expanded'];
 $('mode-steps').innerHTML=['같은 Offset','Center 검사','연결 설계'].map((v,i)=>`<li class="${i===stage?'current':i<stage?'finished':''}">${i+1}. ${v}</li>`).join('');
 $('mode-instruction').textContent=['① 카드 3개를 눌러, 같은 Offset의 Loss를 비교하세요','② 카드 3개를 눌러, Center에서도 Loss가 남는지 확인하세요','③ Fixed Waveguide에 맞는 Mode를 골라 연결하세요'][stage];
 $('mode-condition').textContent=stage===0?'조건 고정 · X = +1.50 µm / Y = 0 · 두 Mode Radius를 함께 변경':'조건 고정 · X = Y = 0 · Waveguide Radius = 2.50 µm';
 $('mode-cards').innerHTML=modeRadii.map((w,i)=>{const measurement=stage<2?session.modeSamples[stage][i]:null,selected=session.selectedMode===i;return `<button data-mode-card="${i}" class="mode-card ${selected?'chosen':''}" ${!session.started||session.completed?'disabled':''} aria-pressed="${selected}"><span class="mode-symbol" style="--radius:${w*7}px"></span><strong>${names[i]}</strong><small>Fiber Radius ${w.toFixed(1)} µm</small><b>${measurement?fmt(measurement.totalLoss)+' dB':stage===2&&selected?fmt(result.totalLoss)+' dB':'눌러서 측정'}</b><span>${measurement?'✓ 측정 완료':selected?'선택됨':'Mode 선택'}</span></button>`;}).join('');
 $('mode-insight').textContent=stage===0?'두 Mode를 함께 키우면 같은 횡방향 오차의 Loss가 작아집니다.':stage===1?'중심이 같아도 크기가 다르면 Mismatch Loss가 남습니다.':`연결 목표 ≤ 0.10 dB · 선택한 설계 ${session.selectedMode===null?'—':fmt(result.totalLoss)+' dB'}. 선택 후 아래 ‘이 Mode로 연결’을 누르세요.`;
 $('mode-next').hidden=stage===2;$('mode-next').textContent=stage===0?'다음 → Center 검사':'다음 → 연결 설계';$('mode-next').disabled=!session.started||!guidedReady(session);
}
$('mode-cards').addEventListener('click',e=>{const card=e.target.closest('[data-mode-card]');if(!card||!session.started||session.completed)return;const i=Number(card.dataset.modeCard);session.selectedMode=i;w1=modeRadii[i];w2=session.modeStep===0?w1:2.5;pairType=session.modeStep===0?'matched':'fixed';dx=session.modeStep===0?1.5:0;dy=0;render();if(session.modeStep<2)session.modeSamples[session.modeStep][i]={...result};attempt();feedback(`${['Narrow','Medium','Expanded'][i]} 측정: ${fmt(result.totalLoss)} dB · ${fmt(result.efficiency*100)}%`);});
$('mode-next').addEventListener('click',()=>{if(!session.started||!guidedReady(session))return;session.modeStep++;session.selectedMode=null;dx=dy=0;w1=1.5;w2=2.5;pairType='fixed';feedback('조건을 바꿨습니다. Mode 카드를 다시 선택해 측정하세요.');render();});
function setTilt(axis,value){if(!session.started||session.completed||!practice&&!(missionId===4&&session.positionObserved))return;value=Math.round(Math.max(-4,Math.min(4,value))*100)/100;if(axis==='x')thetaX=value;else thetaY=value;render();}
for(const axis of ['x','y']){$('theta-'+axis).addEventListener('input',e=>setTilt(axis,Number(e.target.value)));$('theta-'+axis).addEventListener('change',attempt);}
$('wavelength').addEventListener('change',e=>{wavelength=Number(e.target.value);attempt();});
$('zero-tilt').addEventListener('click',()=>{if(!practice)return;thetaX=thetaY=0;attempt();});
$('angular-center').addEventListener('click',()=>$('center').click());
$('observe-position').addEventListener('click',()=>{if($('observe-position').disabled)return;session.positionObserved=true;dx=dy=0;feedback(`중심을 맞춰도 Angular Loss ${fmt(result.angularLoss)} dB가 남았습니다. 이제 두 방향을 맞춰보세요.`);render();});
function render(){
 result=angularCoupling({w1,w2,dx,dy,thetaX,thetaY,wavelength,fixedLoss});const m=missions[missionId-1],enabled=session.started&&!session.completed;
 if(session.started)session.bestLoss=Math.min(session.bestLoss,result.totalLoss);
 $('total-loss').textContent=fmt(result.totalLoss);$('efficiency').textContent=fmt(result.efficiency*100)+'%';$('alignment-error').textContent=fmt(result.error)+' µm';
 for(const [key,val] of [['mismatch-loss',result.mismatchLoss],['alignment-loss',result.alignmentLoss],['overlap-loss',result.overlapLoss],['fixed-loss',fixedLoss]])$(key).textContent=fmt(val)+' dB';
 $('power-fill').style.width=(result.totalEfficiency*100)+'%';$('power-number').textContent=fmt(result.totalEfficiency*100)+'%';$('loss-fill').style.width=Math.min(100,result.totalLoss/10*100)+'%';$('loss-target-marker').style.left=(m.target/10*100)+'%';
 const within=result.totalLoss<=m.target+1e-9;
 $('loss-status').textContent=within?'PASS · 현재 Loss Target 달성':'TARGET NOT MET · 중심 간격 또는 Mismatch를 확인';
 $('mission-state').textContent=practice?'FREE PRACTICE':session.completed?'COMPLETE':!session.started?'READY':missionId===2?`CHALLENGE ${session.challenge+1} / 3`:missionId===3?`EXPERIMENT ${session.modeStep+1} / 3`:within?'TARGET MET':'ALIGNING';$('mission-state').classList.toggle('pass',session.completed||within&&session.started);
 $('x-offset').value=dx.toFixed(2);$('y-offset').value=dy.toFixed(2);$('x-output').textContent=signed(dx)+' µm';$('y-output').textContent=signed(dy)+' µm';$('scene-coordinates').textContent=`X ${signed(dx)} / Y ${signed(dy)} µm`;
 $('radii-label').textContent=`w₁ ${w1.toFixed(1)} µm / w₂ ${w2.toFixed(1)} µm`;$('fixed-output').textContent=fixedLoss.toFixed(1)+' dB';
 $('attempts').textContent=session.attempts;$('best-loss').textContent=Number.isFinite(session.bestLoss)?fmt(session.bestLoss)+' dB':'—';$('best-score').textContent=practice?'연습 · Score 없음':progress.missions[missionId]?.bestScore??'—';$('personal-best-loss').textContent=!practice&&progress.missions[missionId]?fmt(progress.missions[missionId].bestLoss)+' dB':'—';
 for(const id of ['x-offset','y-offset','mode-size','pair-type','fixed-interface'])$(id).disabled=!enabled;
 $('center').disabled=!enabled||!practice&&missionId===2;$('start').disabled=session.started;$('start').hidden=practice;$('scene-lock').hidden=enabled;
 $('scene-lock').textContent=session.completed?'Mission Complete · Retry로 다시 실험':'Start를 눌러 Alignment를 시작하세요';
 $('complete').disabled=practice||!session.started||session.completed;$('complete').textContent=missionId===2&&!session.completed?`Challenge ${session.challenge+1} 완료`:'Complete Mission';
 $('next').disabled=practice||missionId===4||!progress.missions[missionId]?.complete;$('hint').disabled=!session.started||session.completed;
 const xyEnabled=enabled&&(practice||missionId!==3&&!(missionId===4&&session.positionObserved));
 for(const id of ['x-offset','y-offset'])$(id).disabled=!xyEnabled;
 $('center').disabled=!xyEnabled||!practice&&missionId===2;
 $('scene-lock').hidden=xyEnabled;$('scene-lock').textContent=!enabled?(session.completed?'Complete · Retry로 다시 실험':'Start를 눌러 실험을 시작하세요'):missionId===3?'조건 고정 · 아래 Mode 카드를 선택하세요':'중심 고정 · 아래 방향 핸들을 조정하세요';
 $('complete').disabled=practice||!enabled||missionId===3&&(session.modeStep!==2||session.selectedMode===null)||missionId===4&&!session.positionObserved;
 if(missionId===3&&!practice)$('complete').textContent='이 Mode로 연결';
 const angleEnabled=enabled&&(practice||missionId===4&&session.positionObserved);
 for(const [axis,val] of [['x',thetaX],['y',thetaY]]){$('theta-'+axis).value=val.toFixed(2);$('theta-'+axis).disabled=!angleEnabled;$('theta-'+axis+'-output').textContent=signed(val)+'°';}
 $('theta-error').textContent=fmt(result.thetaError)+'°';$('angular-loss').textContent=fmt(result.angularLoss)+' dB';$('lambda-label').textContent=wavelength.toFixed(2);
 $('angular-center').hidden=practice||session.positionObserved;$('angular-center').disabled=!enabled;
 $('observe-position').hidden=practice||session.positionObserved;$('observe-position').disabled=!enabled||result.error>.1||result.angularLoss<=missions[3].target;
 $('angular-instruction').textContent=practice?'중심과 방향을 독립적으로 실험하세요':session.positionObserved?'② 청록색 방향을 파란 축과 나란히 맞추세요':'① 먼저 Center Alignment로 두 중심을 맞추세요';
 $('angular-note').textContent=practice?'X/Y와 θx / θy는 같은 Physics State를 공유합니다.':'중심이 겹쳐도 방향이 다르면 Loss가 남습니다. 중심 확인 후 두 방향 핸들이 활성화됩니다.';
 $('angular-comparison').innerHTML=modeRadii.map((w,i)=>`<div><span>${['Narrow','Medium','Expanded'][i]} / ${w} µm</span><strong>${fmt(angularCoupling({w1:w,w2:w,thetaX,thetaY,wavelength}).angularLoss)} dB</strong><small>Angular Loss</small></div>`).join('');
 if(practice)renderComparison();if(missionId===3&&!practice)renderModeExperiment();
 for(const view of angleViews)view.draw();
 if(scene)scene.draw();
}
function moveTo(x,y){if(!session.started||session.completed||!practice&&(missionId===3||missionId===4&&session.positionObserved))return;dx=Math.round(Math.max(-6,Math.min(6,x))*100)/100;dy=Math.round(Math.max(-6,Math.min(6,y))*100)/100;
 if(!progress.tutorialSeen&&!practice&&missionId===1){$('tutorial-title').textContent='03 / Loss 변화를 관찰하세요';$('tutorial-text').textContent='중심이 가까워질수록 Error와 Loss가 함께 줄어듭니다. Target 이하라면 Complete Mission을 누르세요.';}
 render();
}
function attempt(){if(session.started&&!session.completed){session.attempts++;render();}}
function complete(){
 if(practice)return;
 if(!missionPass(missionId,result,session)){feedback(missionId===3?'연결 실패 · Fixed Waveguide는 2.5 µm입니다. Center에서도 Mode Radius가 다르면 Mismatch Loss가 남습니다.':`TARGET NOT MET · Total Loss를 ${missions[missionId-1].target.toFixed(2)} dB 이하로 조정하세요.`,'warning');return;}
 if(missionId===2){
  session.challengeResults.push({loss:result.totalLoss,score:gameScore(result.totalLoss,.4,session.attempts,session.hints),attempts:session.attempts});
  if(session.challenge<2){session.challenge++;[dx,dy]=challengeOffsets[session.challenge];session.attempts=0;session.hints=0;session.bestLoss=Infinity;feedback(`Challenge ${session.challenge} PASS · 다음 위치에서도 정렬해보세요.`,'success');render();return;}
 }
 let score=gameScore(result.totalLoss,missions[missionId-1].target,session.attempts,session.hints);
 let loss=result.totalLoss;
 if(missionId===2){score=Math.round(session.challengeResults.reduce((n,r)=>n+r.score,0)/3);loss=Math.max(...session.challengeResults.map(r=>r.loss));}
 session.completed=true;recordCompletion(progress,missionId,score,loss);progress.tutorialSeen=true;persist();renderNav();render();feedback('MISSION COMPLETE · Learning Summary에서 결과의 이유를 확인하세요.','success');
 const learn=learningSummary(missionId,initialLoss,loss);
 if(missionId===2)learn.happened+=` Challenge Loss: ${session.challengeResults.map(r=>r.loss.toFixed(2)+' dB').join(' / ')}.`;
 showLearning($('summary-dialog'),learn,score,loss,missionId===2?' / WORST OF 3':missionId===3?' / SELECTED DESIGN':'');
}
bindControls({move:(axis,v)=>moveTo(axis==='x'?v:dx,axis==='y'?v:dy),attempt,
 selectMode:v=>{w1=v;w2=pairType==='matched'?v:2.5;attempt();render();},selectPair:v=>{pairType=v;w2=v==='matched'?w1:2.5;attempt();render();},selectFixed:v=>{fixedLoss=v;render();}});
$('mission-nav').addEventListener('click',e=>{const b=e.target.closest('[data-mission]');if(b)loadMission(Number(b.dataset.mission));});
$('practice').addEventListener('click',()=>loadMission(3,true));
$('start').addEventListener('click',()=>{session.started=true;session.bestLoss=result.totalLoss;feedback('Fiber Mode의 중심을 드래그해보세요.');
 $('tutorial-title').textContent='02 / Fiber를 잡고 움직이세요';$('tutorial-text').textContent='청록색 + 표시를 파란색 + 표시 쪽으로 옮기세요. Slider와 방향키도 같은 위치를 조정합니다.';render();});
$('reset').addEventListener('click',()=>{const wasStarted=session.started;loadMission(missionId,practice);session.started=wasStarted||practice;render();feedback('실험을 초기 위치로 되돌렸습니다. Progress와 Personal Best는 유지됩니다.');});
$('center').addEventListener('click',()=>{if($('center').disabled)return;moveTo(0,0);attempt();feedback(result.angularLoss>0?'Center Alignment 완료 · 중심은 같아도 Angular Loss가 남습니다. 아래 중심 확인 버튼을 눌러 방향 조정을 시작하세요.':result.mismatchLoss>0?'Center Alignment 완료 · Mode 크기가 다르면 Mismatch Loss는 남습니다.':'Center Alignment 완료 · 이상적인 Matched Mode에서 0 dB를 확인하세요.');});
$('hint').addEventListener('click',()=>{const m=missions[missionId-1];$('hint-text').textContent=m.hints[Math.min(session.hints,m.hints.length-1)];session.hints++;feedback(`Hint ${Math.min(session.hints,3)} · Engineering Note를 확인하세요.`);render();});
$('complete').addEventListener('click',complete);$('next').addEventListener('click',()=>loadMission(Math.min(4,missionId+1)));
$('skip-tutorial').addEventListener('click',()=>{progress.tutorialSeen=true;$('tutorial').hidden=true;persist();});
const closeDialog=()=>$('summary-dialog').close();$('close-dialog').addEventListener('click',closeDialog);$('dialog-continue').addEventListener('click',closeDialog);
$('assumptions').addEventListener('click',()=>{$('dialog-content').innerHTML='<h2>Engineering Assumptions</h2><h3>Simplified Gaussian Mode Model</h3><p>같은 평면의 이상적인 원형 Gaussian Mode, 횡방향 X/Y 및 같은 평면에서의 Paraxial Phase Tilt를 계산합니다. Mode Radius는 Field Amplitude 1/e 반경이며, 모든 길이는 µm입니다.</p><h3>Physics Result와 Game Score</h3><p>η = [2w₁w₂/(w₁²+w₂²)]² × exp[−2(dx²+dy²)/(w₁²+w₂²)]. Loss = −10 log₁₀(η). Fixed Interface Loss는 별도 dB 항목입니다. Game Score가 Physics Result를 바꾸지 않습니다.</p><h3>Angular Model</h3><p>Angular Factor = exp[−w₁²w₂²(qx²+qy²)/(2(w₁²+w₂²))], q = (2πn/λ₀)θ (radians). λ₀는 진공 파장, n = 1은 공통 매질 Air입니다. UI Tilt 성분 ±4°, 모델 범위 ±5°. Angular Loss는 별도 표시합니다. 큰 Mode는 횡방향 오차에 관대하지만 각도 오차에 민감합니다.</p><h3>Visual Interpretation</h3><p>Heatmap은 상대 Intensity, 중앙 장면은 Transverse Plane입니다. 하단 Transmission Pulse와 Power Meter는 실제 Total Efficiency에 연동된 지표입니다. 색상의 겹침 자체가 Overlap Integral은 아닙니다.</p><h3>현재 계산하지 않는 항목</h3><p>Full-vector EM, Fresnel Reflection, Polarization, Gap, Beam Walk-off, Refraction, Roll, Evanescent Coupling, Propagation, Thermal, Adhesive, Yield. 실제 공정 가능성은 후속 버전에서 별도 모델로 다룹니다.</p><h3>Progress 저장</h3><p>Local Storage를 사용하며 Browser·Profile·파일 경로에 따라 저장 영역이 달라질 수 있습니다. 같은 HTML 경로와 같은 Browser Profile에서 이어서 실행하세요. 저장이 제한되면 이 세션에서는 계속 플레이할 수 있습니다.</p>';$('summary-dialog').showModal();});
$('reset-progress').addEventListener('click',()=>{if(!confirm('저장된 Mission 완료 상태와 Personal Best를 모두 초기화할까요?'))return;progress=freshProgress();persist();loadMission(1);});
scene=new AlignmentScene($('alignment-canvas'),()=>({dx,dy,w1,w2,result,enabled:session.started&&!session.completed&&(practice||missionId!==3&&!(missionId===4&&session.positionObserved)),showTolerance:missionId===3||practice,tolerance:alignmentTolerance(w1,w2,1,fixedLoss)}),moveTo,attempt);
const angleViews=['x','y'].map(axis=>new AngularScene($('angular-'+axis),axis,()=>({theta:axis==='x'?thetaX:thetaY,enabled:session.started&&!session.completed&&(practice||missionId===4&&session.positionObserved)}),(value)=>setTilt(axis,value),attempt));
loadMission(missionId);persist();
