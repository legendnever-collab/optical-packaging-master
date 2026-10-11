/** View-only coordinate adapters. Optical solvers never consume display coordinates. */
export const transverseOrigin={x:455,y:220},transverseScale=16;
export function transversePoint(dx,dy){return {x:transverseOrigin.x+dx*transverseScale,y:transverseOrigin.y-dy*transverseScale};}
export function transverseOffset(point){return {dx:(point.x-transverseOrigin.x)/transverseScale,dy:(transverseOrigin.y-point.y)/transverseScale};}
export function pathGeometry(config,displayLength=config.length){
 const folded=config.foldAt!==null,width=folded?config.foldAt:config.length,height=folded?config.length-config.foldAt:0;
 const scale=folded?370/displayLength:380/displayLength;
 return {x:folded?220:200,y:folded?110:210,scale,foldAt:config.foldAt,length:config.length,width,height};
}
export function pathPoint(geometry,z){const {x,y,scale,foldAt}=geometry;return foldAt!==null&&z>foldAt?{x:x+foldAt*scale,y:y+(z-foldAt)*scale}:{x:x+z*scale,y};}
export function pathCoordinate(geometry,point){const {x,y,scale,foldAt,length}=geometry;if(foldAt===null)return Math.max(0,Math.min(length,(point.x-x)/scale));const corner=x+foldAt*scale;const horizontal={z:(point.x-x)/scale,d:Math.abs(point.y-y)},vertical={z:foldAt+(point.y-y)/scale,d:Math.abs(point.x-corner)};return Math.max(0,Math.min(length,(point.x>=corner-18&&vertical.d<horizontal.d?vertical:horizontal).z));}
export function viewPoint(point,camera){return {x:camera.x+(point.x-360)*camera.zoom+360,y:camera.y+(point.y-210)*camera.zoom+210};}
export function inverseViewPoint(point,camera){return {x:(point.x-camera.x-360)/camera.zoom+360,y:(point.y-camera.y-210)/camera.zoom+210};}
export function animationPower(result,active=true){return active?Math.max(0,Math.min(1,result.totalEfficiency)):0;}
export function pathPower(config,z){const losses=config.lenses.filter(l=>l.z<=z).length*config.lensLoss+(config.foldAt!==null&&config.foldAt<=z?config.mirrorLoss:0);return 10**(-losses/10);}
