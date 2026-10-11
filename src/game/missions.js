export const CONTENT_VERSION=3;
export const missions=[
 {id:1,chapter:1,title:'First Light',subtitle:'빛을 처음 연결하세요',mechanic:'PRECISION CONTROL',target:1,w1:2.5,w2:2.5,initial:[4,-3],objective:'청록색 Fiber를 드래그해 파란 중심에 맞추고 출력광을 밝히세요.',achievement:'First Light Achieved',hints:['청록색 + 중심을 드래그하세요.','입력은 100%, 출력은 실제 Coupling에 따라 달라집니다.','두 중심을 겹치면 이상적인 Matched Mode의 Loss는 0 dB입니다.']},
 {id:2,chapter:1,title:'Find the Fault',subtitle:'검사로 원인을 찾아 복구하세요',mechanic:'FAULT DIAGNOSIS',target:.5,w1:2.5,w2:2.5,initial:[0,0],objective:'출력 Power가 낮습니다. 최대 2개 검사로 원인을 찾고 알맞은 복구를 선택하세요.',achievement:'Root Cause Identified',hints:['Loss만으로 원인을 단정하지 마세요. 검사는 서로 다른 정보를 줍니다.','Centers는 위치, Radius는 크기 차이, Tilt는 방향 차이를 확인합니다.','진단에 맞는 복구를 선택하세요. 틀린 복구는 다른 Parameter만 바꿉니다.']},
 {id:3,chapter:1,title:'Choose the Optical Interface',subtitle:'조립 환경에 맞는 설계를 선택하세요',mechanic:'DESIGN DECISION',target:.25,w1:2.5,w2:2.5,initial:[0,0],objective:'두 Assembly 환경에서 설계를 먼저 예측하고 실험한 뒤 연결안을 확정하세요.',achievement:'Robust Optical Interface Selected',hints:['작은 Mode는 위치 오차에 민감하지만 방향 오차에는 관대합니다.','큰 Mode는 위치 오차에 관대하지만 방향 오차에는 민감합니다.','비교표는 선택사항입니다. 실험 결과가 요구 Loss를 만족하는지 확인하세요.']},
 {id:4,chapter:1,title:'Aim the Light',subtitle:'중심은 같은데 왜 빛이 약할까요?',mechanic:'DISCOVER & CORRECT',target:.5,w1:4,w2:4,initial:[0,0],objective:'두 중심은 이미 일치합니다. 숨은 오류를 발견하고 Beam Direction을 교정하세요.',achievement:'Direction Restored',hints:['X/Y Error는 0인데 출력이 약합니다. Center를 다시 맞춰도 해결되지 않습니다.','방향을 검사하면 두 Side View에 Relative Angle이 보입니다.','θx와 θy 방향을 모두 파란 축에 맞추세요.']},
 {id:5,chapter:2,title:'The Assembly Lottery',subtitle:'완벽한 설계도 조립하면 달라집니다',mechanic:'ASSEMBLY EXPERIMENT',target:1,w1:2.5,w2:2.5,initial:[0,0],objective:'10개 부품의 조립을 관찰하고, 100개 이상을 평가한 뒤 실패 Sample을 조사하세요.',achievement:'Manufacturing Variation Revealed',hints:['Nominal 0 dB가 모든 조립품의 성공을 의미하지 않습니다.','Yield는 Loss 기준을 만족한 실제 Sample의 비율입니다.','실패 Sample을 누르면 그 부품의 위치·각도와 Loss 원인이 보입니다.']},
 {id:6,chapter:2,title:'Make It Tolerant',subtitle:'95% Yield를 만드는 Radius를 찾으세요',mechanic:'ENGINEERING OPTIMIZATION',target:1,w1:1.5,w2:2.5,initial:[0,0],objective:'공정과 Waveguide는 고정입니다. Fiber Radius를 조정해 동일 1,000 Sample에서 Yield 95% 이상을 달성하세요.',achievement:'Tolerance Design Achieved',hints:['Radius를 바꿔도 Error Sample은 그대로 유지됩니다.','큰 Radius는 Lateral Loss를 줄이지만 Angular/Mismatch Loss를 늘릴 수 있습니다.','Sensitivity Map을 보며 두 극단 사이를 실험하세요.']},
 {id:7,chapter:2,title:'Beat the Factory',subtitle:'공정이 바뀌면 최적 설계도 바뀝니다',mechanic:'COMPARE & ADAPT',target:1,w1:2.5,w2:2.5,initial:[0,0],objective:'설계를 2–3개 저장해 같은 Sample로 비교하세요. 두 공정에서 각각 Yield 95%와 P95 ≤1 dB를 만족하는 설계를 확정하세요.',achievement:'Factory Challenge Beaten',hints:['Matched 설계의 Nominal은 모두 0 dB일 수 있습니다. Yield로 비교하세요.','각 행은 같은 Seed·공정·Sample Count로 계산됩니다.','공정 B에서는 방향 Bias와 Angular 편차가 커집니다. 공정 A의 승자가 그대로 이기지는 않습니다.']}
];
export function canAccess(id,progress,practice=false){return Number.isInteger(id)&&id>=1&&id<=7&&(practice||id===1||Boolean(progress.missions[id-1]?.complete));}
export function makeSession(id){return {id,started:false,completed:false,attempts:0,hints:0,bestLoss:Infinity,caseIndex:0,caseResults:[],inspections:[],diagnosis:null,repair:null,caseRestored:false,environment:0,environmentResults:[],prediction:null,selectedMode:null,experimented:false,angularDiscovered:false,lotteryObserved:false,inspectedFailure:false,report:null,reportDesign:null,factoryRound:0,factoryResults:[],comparison:[],selectedDesign:null};}
export function missionPass(id,result,session){
 if(!session.started||session.completed)return false;
 if(id===2)return session.caseResults.length===3;
 if(id===3)return session.environmentResults.length===2;
 if(id===4)return session.angularDiscovered&&result.totalLoss<=.5+1e-9;
 if(id===5)return session.lotteryObserved&&session.inspectedFailure&&session.report?.count>=100;
 if(id===6)return session.report?.count>=1000&&session.report.yield>=.95;
 if(id===7)return session.factoryResults.length===2;
 return result.totalLoss<=missions[id-1].target+1e-9;
}
