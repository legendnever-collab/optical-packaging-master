import {waistQ,propagateQ,lensQ,beamAtQ,evaluateOpticalPath} from './gaussian-propagation.js';
import {ellipticalOverlap} from './elliptical-gaussian.js';
/** A same-medium two-lens relay with module errors inserted at its detachable plane.
 * q and central ray use the same transforms. Infinite ideal thin lens decenter
 * produces theta += decenter/f. Module decenter/tilt changes the receiver frame.
 * An ideal planar fold is unfolded; not an off-axis reflector/aberration model. */
export function rayTransfer(ray,{a,b,c,d},kick=0){
 if(!ray||![ray.x,ray.theta,a,b,c,d,kick].every(Number.isFinite)||Math.abs(a*d-b*c-1)>1e-8)throw new RangeError('Finite unit-determinant ray transform required.');
 return {x:a*ray.x+b*ray.theta,theta:c*ray.x+d*ray.theta+kick};
}
export function validateRelay(c){
 if(!c||![c.sourceRadius,c.targetRadius,c.f1,c.f2,c.z1,c.z2,c.length,c.wavelength,c.converterLoss].every(Number.isFinite)||c.sourceRadius<1||c.sourceRadius>10||c.targetRadius<1||c.targetRadius>10||c.f1<80||c.f2<80||c.f1>1000||c.f2>1000||c.z1<=0||c.z2<=c.z1||c.length<=c.z2||c.wavelength!==1.55||c.converterLoss<0)throw new RangeError('Unsupported two-lens relay geometry / effective mode.');
 const plane=c.z1+c.f1;
 if(plane>=c.z2)throw new RangeError('Detachable plane must precede the receiving lens.');
 if(c.foldAt!==null&&(!Number.isFinite(c.foldAt)||c.foldAt<=c.z1||c.foldAt>=c.z2))throw new RangeError('Fold must be between relay lenses.');
 return {...c,plane};
}
export function evaluateRelay(config,errors={}){
 const c=validateRelay(config),e={dx:0,dy:0,thetaX:0,thetaY:0,sourceX:0,sourceY:0,lens1X:0,lens1Y:0,lens2X:0,lens2Y:0,axial:0,...errors};
 if(!Object.values(e).every(Number.isFinite)||Math.abs(e.thetaX)>5||Math.abs(e.thetaY)>5||Math.abs(e.axial)>100)throw new RangeError('Relay error outside paraxial / axial domain.');
 const length=c.length+e.axial;
 if(length<=c.z2)throw new RangeError('Receiver intersects receiving lens.');
 const lenses=c.installed??2;if(!Number.isInteger(lenses)||lenses<0||lenses>2)throw new RangeError('Unsupported lens inventory state.');
 const path={sourceRadius:c.sourceRadius,targetRadius:c.targetRadius,wavelength:c.wavelength,index:1,length,lenses:lenses===0?[]:lenses===1?[{z:c.z1,f:c.f1}]:[{z:c.z1,f:c.f1},{z:c.z2,f:c.f2}],foldAt:c.foldAt,lensLoss:.10,mirrorLoss:.15};
 const coaxial=evaluateOpticalPath(path);
 const traverse=(source,offset,angle,d1,d2)=>{
  let ray={x:source,theta:0};const p=d=>({a:1,b:d,c:0,d:1}),l=f=>({a:1,b:0,c:-1/f,d:1});
  ray=rayTransfer(ray,p(c.z1));if(lenses>=1)ray=rayTransfer(ray,l(c.f1),d1/c.f1);
  ray=rayTransfer(ray,p(c.plane-c.z1));ray={x:ray.x-offset,theta:ray.theta-angle*Math.PI/180};
  ray=rayTransfer(ray,p(c.z2-c.plane));if(lenses>=2)ray=rayTransfer(ray,l(c.f2),d2/c.f2);
  return rayTransfer(ray,p(length-c.z2));
 };
 const x=traverse(e.sourceX,e.dx,e.thetaX,e.lens1X,e.lens2X),y=traverse(e.sourceY,e.dy,e.thetaY,e.lens1Y,e.lens2Y),b=beamAtQ(coaxial.q,c.wavelength),curvature={xx:b.inverseR,xy:0,yy:b.inverseR};
 const result=ellipticalOverlap({source:{wx:b.radius,wy:b.radius},target:{wx:c.targetRadius,wy:c.targetRadius},sourceCurvature:curvature,dx:x.x,dy:y.x,thetaX:x.theta*180/Math.PI,thetaY:y.theta*180/Math.PI,wavelength:c.wavelength,fixedLoss:coaxial.fixedLoss+c.converterLoss});
 return {...result,q:coaxial.q,outputRay:{x,y},path,incidentRadius:b.radius,converterLoss:c.converterLoss,coaxialLoss:coaxial.overlapLoss,footprint:c.foldAt===null?{width:length,height:160}:{width:c.foldAt+80,height:length-c.foldAt+80},workingDistance:c.z1,componentCount:lenses+(c.foldAt===null?0:1)};
}
