import {angularCoupling} from '../physics/angular-coupling.js';
export const faultCases=[
 {name:'장치 A · 출력 저하',cause:'lateral',state:{w1:2.5,w2:2.5,dx:2.5,dy:-1.5,thetaX:0,thetaY:0}},
 {name:'장치 B · 교체 후 출력 저하',cause:'mismatch',state:{w1:1.2,w2:4,dx:0,dy:0,thetaX:0,thetaY:0}},
 {name:'장치 C · 조립 후 출력 저하',cause:'angular',state:{w1:4,w2:4,dx:0,dy:0,thetaX:3,thetaY:-2}}
];
export const diagnosticNames={lateral:'Mode Centers 검사',angular:'Angular Tilt 측정',mismatch:'Mode Field Size 측정'};
export const repairNames={lateral:'Fiber 위치 재정렬',mismatch:'Matching Mode로 교체',angular:'Beam Direction 교정'};
export function inspectFault(session,key){if(!session.started||session.completed||!diagnosticNames[key]||session.inspections.includes(key)||session.inspections.length>=2)return false;session.inspections.push(key);return true;}
export function diagnosticEvidence(state,key){if(key==='lateral')return `X ${state.dx.toFixed(2)} / Y ${state.dy.toFixed(2)} µm · Error ${Math.hypot(state.dx,state.dy).toFixed(2)} µm`;if(key==='angular')return `θx ${state.thetaX.toFixed(2)}° / θy ${state.thetaY.toFixed(2)}°`;return `Fiber Radius ${state.w1.toFixed(2)} / Waveguide Radius ${state.w2.toFixed(2)} µm`;}
export function repairState(state,key){const next={...state};if(key==='lateral')next.dx=next.dy=0;if(key==='mismatch')next.w1=next.w2;if(key==='angular')next.thetaX=next.thetaY=0;return next;}
export function restoreFault(session,state,cause,repair){
 if(!session.started||session.completed||session.inspections.length===0)return {state,correct:false};
 const next=repairState(state,repair),actual=faultCases[session.caseIndex].cause,correct=cause===actual&&repair===actual&&angularCoupling(next).totalLoss<=.5;
 if(correct)session.caseResults.push({cause,loss:angularCoupling(next).totalLoss,inspections:[...session.inspections]});
 return {state:next,correct};
}
export const interfaceEnvironments=[
 {name:'A · High-Precision Assembly',subtitle:'위치는 정밀하지만 방향 편차가 큽니다',state:{dx:.15,dy:.1,thetaX:2.5,thetaY:1.8},target:.25},
 {name:'B · Relaxed Positioning',subtitle:'위치 편차가 크지만 방향은 안정적입니다',state:{dx:1.4,dy:.8,thetaX:.15,thetaY:.1},target:.9}
];
export const interfaceRadii=[1.5,2.5,4];
export function interfaceResult(environment,radius){return angularCoupling({w1:radius,w2:radius,...environment.state});}
export function processPreset(lateral=.7,angular=.18,bias=0){return {dx:{bias,sigma:lateral},dy:{bias:0,sigma:lateral},thetaX:{bias:0,sigma:angular},thetaY:{bias:0,sigma:angular}};}
export const factoryProcesses=[
 {name:'공정 A · Lateral 편차 우세',process:processPreset(.7,.12),targetYield:.95},
 {name:'공정 B · Angular 편차 증가',process:{...processPreset(.2,.45,.12),thetaX:{bias:2.5,sigma:.45},thetaY:{bias:1.8,sigma:.45}},targetYield:.95},
 {name:'공정 C · Systematic Bias',process:processPreset(.45,.22,.75),targetYield:.95}
];
export const optimizationProcess=processPreset(.45,.3);
export function radiusDesign(radius,matched=true){return {w1:radius,w2:matched?radius:2.5,wavelength:1.55,index:1,fixedLoss:0};}
export function manufacturingScore(report,hints=0){return Math.max(0,Math.min(1000,Math.round(report.yield*1000-hints*20)));}
