export const missions=[
 {id:1,title:'Find the Light',subtitle:'두 Mode의 중심을 만나게 하세요',target:1,w1:2.5,w2:2.5,initial:[4,-3],objective:'Fiber Mode를 드래그해 Total Loss를 1.00 dB 이하로 낮추세요.',hints:['청록색은 움직이는 Fiber Mode, 파란색은 고정된 Waveguide Mode입니다.','두 중심이 가까워질수록 Mode Overlap이 커집니다. X와 Y를 모두 줄여보세요.','Center Alignment를 사용하거나 두 중심의 + 표시를 겹쳐보세요.']},
 {id:2,title:'The Alignment Challenge',subtitle:'정밀함과 효율의 균형',target:.4,w1:1.5,w2:1.5,initial:[3,-2],objective:'서로 다른 시작 위치의 Challenge 3개를 각각 0.40 dB 이하로 정렬하세요. Center는 사용할 수 없습니다.',hints:['Narrow Mode에서는 같은 거리의 Offset도 더 큰 Loss를 만듭니다.','Loss는 횡방향 Error의 제곱에 비례합니다. 마지막 조정은 작게 해보세요.','Slider 또는 방향키로 정밀하게 조정하세요. 조작 횟수는 드래그 한 번을 한 번으로 셉니다.']},
 {id:3,title:'Mode Size Trade-off',subtitle:'허용도는 넓어지고, Mismatch는 남는다',target:1,w1:1.5,w2:1.5,initial:[1.5,0],objective:'동일한 Offset에서 세 Mode를 비교한 뒤, 정렬 허용도와 Mode Mismatch 질문에 답하세요.',hints:['Matched pair에서는 Fiber와 Waveguide의 Radius가 함께 바뀝니다.','Fixed Waveguide에서는 Waveguide Radius가 2.5 µm로 유지됩니다. Center에서도 Mismatch가 남을 수 있습니다.','횡방향 정렬 허용도와 서로 다른 Mode의 크기 차이를 따로 판단하세요.']}
];
export const challengeOffsets=[[3,-2],[-2.6,2.2],[2.8,2.7]];
export function canAccess(id,progress,practice=false) { return practice || id===1 || Boolean(progress.missions[id-1]?.complete); }
export function missionPass(id,result,session) {
 if (!session.started || session.completed) return false;
 if (id===3) return session.comparisonRecorded && session.toleranceAnswer==='Expanded' && session.mismatchAnswer==='Medium';
 return result.totalLoss<=missions[id-1].target+1e-9;
}
export function makeSession(id) {return {started:false,completed:false,attempts:0,hints:0,bestLoss:Infinity,challenge:0,challengeResults:[],comparisonRecorded:false,toleranceAnswer:'',mismatchAnswer:'',id};}
