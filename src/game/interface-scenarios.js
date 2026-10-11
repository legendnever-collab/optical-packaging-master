import {evaluateOpticalPath,gapWindow} from '../physics/gaussian-propagation.js';
export const interfacePresets={
 8:{sourceRadius:10,targetRadius:10,wavelength:1.55,index:1,length:760,sourceWaistZ:400,lenses:[],foldAt:null,lensLoss:.1,mirrorLoss:.15},
 9:{sourceRadius:10,targetRadius:10,wavelength:1.55,index:1,length:1000,sourceWaistZ:0,lenses:[],foldAt:null,lensLoss:.1,mirrorLoss:.15},
 10:{sourceRadius:10,targetRadius:20,wavelength:1.55,index:1,length:1800,sourceWaistZ:0,lenses:[{z:200,f:200},{z:800,f:400}],foldAt:null,lensLoss:.1,mirrorLoss:.15}
};
export function interfaceMissionConfig(id){if(!interfacePresets[id])throw new RangeError('Unknown optical interface mission.');return structuredClone(interfacePresets[id]);}
export function interfaceAcceptance(id,config){
 const result=evaluateOpticalPath(config);
 if(id===8)return {pass:config.lenses.length===0&&result.totalLoss<=.5+1e-9,result,worstLoss:result.totalLoss};
 if(id===9)return {pass:config.lenses.length===1&&result.totalLoss<=.5+1e-9,result,worstLoss:result.totalLoss};
 if(id===10){const window=gapWindow(config),shapeFit=window.rows.every(r=>r.result.footprint.width<=1000&&r.result.footprint.height<=1000);return {pass:config.lenses.length===2&&config.foldAt!==null&&shapeFit&&window.worstLoss<=.55+1e-9,result,worstLoss:window.worstLoss,window,shapeFit};}
 return {pass:false,result,worstLoss:result.totalLoss};
}
export function lensPairConfig(config,kind){
 const [a,b]=kind==='long'?[300,600]:[200,400];
 return {...config,lenses:[{z:a,f:a},{z:2*a+b,f:b}]};
}
