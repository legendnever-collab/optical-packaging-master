export const missions=[
 {id:1,title:'Find the Light',subtitle:'두 Mode의 중심을 만나게 하세요',target:1,w1:2.5,w2:2.5,initial:[4,-3],objective:'Fiber Mode를 드래그해 Total Loss를 1.00 dB 이하로 낮추세요.',hints:['청록색은 움직이는 Fiber Mode, 파란색은 고정된 Waveguide Mode입니다.','두 중심이 가까워질수록 Mode Overlap이 커집니다. X와 Y를 모두 줄여보세요.','Center Alignment를 사용하거나 두 중심의 + 표시를 겹쳐보세요.']},
 {id:2,title:'The Alignment Challenge',subtitle:'정밀함과 효율의 균형',target:.4,w1:1.5,w2:1.5,initial:[3,-2],objective:'서로 다른 시작 위치의 Challenge 3개를 각각 0.40 dB 이하로 정렬하세요. Center는 사용할 수 없습니다.',hints:['Narrow Mode에서는 같은 거리의 Offset도 더 큰 Loss를 만듭니다.','Loss는 횡방향 Error의 제곱에 비례합니다. 마지막 조정은 작게 해보세요.','Slider 또는 방향키로 정밀하게 조정하세요. 조작 횟수는 드래그 한 번을 한 번으로 셉니다.']},
 {id:3,title:'Mode Size Trade-off',subtitle:'비교하고, 맞는 Mode로 연결하세요',target:.1,w1:1.5,w2:1.5,initial:[1.5,0],objective:'① 같은 Offset에서 세 Mode 비교 → ② Center에서 크기 차이 확인 → ③ 0.10 dB 이하로 연결할 Mode 선택.',hints:['지금 할 일은 화면 중앙의 세 Mode 카드를 차례로 누르는 것입니다. 각 카드에 실제 Loss가 기록됩니다.','1단계는 Fiber와 Waveguide 크기가 함께 바뀝니다. 2단계는 Waveguide만 2.5 µm로 고정됩니다.','마지막 연결에서는 Waveguide와 Radius가 같은 Fiber를 선택해보세요.']},
 {id:4,title:'Aim the Light',subtitle:'중심 다음은 방향입니다',target:.5,w1:4,w2:4,initial:[2,-1],objective:'먼저 중심을 맞춰도 남는 Loss를 확인하세요. 다음에는 θx / θy를 조정해 Total Loss를 0.50 dB 이하로 낮추세요.',hints:['Center Alignment는 X/Y 위치만 맞춥니다. Fiber가 기울어져 있으면 Angular Loss는 남습니다.','아래 두 Side View에서 청록색 손잡이를 움직여 파란색 방향과 나란하게 맞춰보세요.','θx와 θy를 모두 줄이세요. 큰 Mode는 횡방향 Error에 강하지만 작은 Tilt에도 민감할 수 있습니다.']}
];
export const challengeOffsets=[[3,-2],[-2.6,2.2],[2.8,2.7]];
export const modeRadii=[1.5,2.5,4];
export function canAccess(id,progress,practice=false) {return [1,2,3,4].includes(id)&&(practice||id===1||Boolean(progress.missions[id-1]?.complete));}
export function guidedReady(session){return session.modeStep<2&&session.modeSamples[session.modeStep].every(Boolean);}
export function missionPass(id,result,session) {
 if(!session.started||session.completed)return false;
 if(id===3 && (session.modeStep!==2||!session.modeSamples.every(row=>row.every(Boolean))||session.selectedMode===null))return false;
 if(id===4 && !session.positionObserved)return false;
 return result.totalLoss<=missions[id-1].target+1e-9;
}
export function makeSession(id){return {started:false,completed:false,attempts:0,hints:0,bestLoss:Infinity,challenge:0,challengeResults:[],modeStep:0,modeSamples:[[null,null,null],[null,null,null]],selectedMode:null,positionObserved:false,id};}
