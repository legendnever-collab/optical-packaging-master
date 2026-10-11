import {gaussianCoupling} from './gaussian-coupling.js';
// Paraxial common-plane phase tilt, not a geometric projection/refraction model.
export function angularCoupling({w1,w2,dx=0,dy=0,thetaX=0,thetaY=0,wavelength=1.55,index=1,fixedLoss=0}) {
 if (![thetaX,thetaY,wavelength,index].every(Number.isFinite)||wavelength<=0||index<=0||Math.abs(thetaX)>5||Math.abs(thetaY)>5)
  throw new RangeError('Finite tilt components within ±5 degrees, positive wavelength and medium index required.');
 const base=gaussianCoupling({w1,w2,dx,dy,fixedLoss});
 const low=Math.min(w1,w2),high=Math.max(w1,w2),effective=low/Math.sqrt(1+(low/high)**2);
 const tilt=Math.hypot(thetaX,thetaY)*Math.PI/180;
 const exponent=tilt===0?0:(2*Math.PI*index*effective/wavelength*tilt)**2/2;
 const angularLoss=10/Math.LN10*exponent,overlapLoss=base.overlapLoss+angularLoss,totalLoss=overlapLoss+fixedLoss;
 return {...base,spatialEfficiency:base.efficiency,angularLoss,angularEfficiency:Math.exp(-exponent),overlapLoss,totalLoss,
  efficiency:thetaX===0&&thetaY===0?base.efficiency:Math.exp(-overlapLoss*Math.LN10/10),
  totalEfficiency:thetaX===0&&thetaY===0?base.totalEfficiency:Math.exp(-totalLoss*Math.LN10/10),thetaError:Math.hypot(thetaX,thetaY)};
}
export function angularTolerance(w1,w2,wavelength=1.55,index=1,budget=1) {
 angularCoupling({w1,w2,wavelength,index});
 if(!Number.isFinite(budget)||budget<0)throw new RangeError('Nonnegative finite angular-loss budget required.');
 const lo=Math.min(w1,w2),hi=Math.max(w1,w2),effective=lo/Math.sqrt(1+(lo/hi)**2);
 return Math.sqrt(2*budget*Math.LN10/10)*wavelength/(2*Math.PI*index*effective)*180/Math.PI;
}
