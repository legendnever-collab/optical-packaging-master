import test from 'node:test';import assert from 'node:assert/strict';
import {angularCoupling as a,angularTolerance} from '../src/physics/angular-coupling.js';import {gaussianCoupling as g} from '../src/physics/gaussian-coupling.js';
const near=(actual,expected,tol=1e-11)=>assert.ok(Math.abs(actual-expected)<=tol,`${actual} != ${expected}`);
test('zero Tilt exactly preserves v0.1 outputs including fixed loss',()=>{for(const data of [{w1:2.5,w2:2.5},{w1:1.5,w2:4,dx:2,dy:-1,fixedLoss:2},{w1:1e200,w2:1e-100,dx:1e200}]){const old=g(data),newer=a(data);for(const key of Object.keys(old))assert.equal(newer[key],old[key]);assert.equal(newer.angularLoss,0);}});
test('matched angular Gaussian reference calculation',()=>{const r=a({w1:4,w2:4,thetaX:3,thetaY:-2});const exponent=(Math.PI*4/1.55)**2*((3*Math.PI/180)**2+(2*Math.PI/180)**2);near(r.efficiency,Math.exp(-exponent));near(r.angularLoss,10/Math.LN10*exponent);});
test('combined offset mismatch angle and fixed losses sum independently',()=>{const r=a({w1:1.5,w2:2.5,dx:1,dy:2,thetaX:1,thetaY:2,fixedLoss:.5});near(r.totalLoss,r.mismatchLoss+r.alignmentLoss+r.angularLoss+.5);near(r.efficiency,r.spatialEfficiency*r.angularEfficiency);near(r.totalEfficiency,r.efficiency*10**(-.5/10));});
test('angular sign and X/Y symmetry',()=>{const r=a({w1:2,w2:3,thetaX:1,thetaY:-2});near(r.efficiency,a({w1:2,w2:3,thetaX:-1,thetaY:2}).efficiency);near(r.efficiency,a({w1:3,w2:2,thetaX:2,thetaY:1}).efficiency);});
test('doubling angle quadruples angular dB loss',()=>near(a({w1:3,w2:3,thetaX:2}).angularLoss,4*a({w1:3,w2:3,thetaX:1}).angularLoss));
test('larger matched modes have narrower angular tolerance',()=>{const values=[1.5,2.5,4].map(w=>a({w1:w,w2:w,thetaX:1}).angularLoss);assert.ok(values[0]<values[1]&&values[1]<values[2]);near(values[2]/values[0],(4/1.5)**2);});
test('wavelength and medium index scale angular loss',()=>{const base=a({w1:2,w2:2,thetaX:1}).angularLoss;near(a({w1:2,w2:2,thetaX:1,index:2}).angularLoss,4*base);near(a({w1:2,w2:2,thetaX:1,wavelength:3.1}).angularLoss,base/4);});
test('angular tolerance solves its loss budget',()=>{const theta=angularTolerance(2,3,1.55,1,.4);near(a({w1:2,w2:3,thetaX:theta}).angularLoss,.4);assert.equal(angularTolerance(2,3,1.55,1,0),0);});
test('finite extreme radii and offsets avoid NaN',()=>{for(const data of [{w1:1e200,w2:1e200,thetaX:4},{w1:1e-200,w2:1e-200,thetaX:4},{w1:1e200,w2:1e-200,thetaY:4},{w1:1,w2:1,dx:1e300,thetaX:5}]){const r=a(data);assert.ok(!Number.isNaN(r.totalLoss));assert.ok(r.efficiency>=0&&r.efficiency<=1);}});
for(const [name,data] of Object.entries({nan:{thetaX:NaN},infinity:{thetaY:Infinity},angle:{thetaX:5.01},wavelength:{wavelength:0},index:{index:-1},radius:{w1:0},fixed:{fixedLoss:-1}}))test('invalid angular input: '+name,()=>assert.throws(()=>a({w1:2,w2:2,...data}),RangeError));
test('invalid tolerance budgets rejected',()=>{for(const budget of [-1,NaN,Infinity])assert.throws(()=>angularTolerance(2,3,1.55,1,budget),RangeError);});
// Independent midpoint integration of normalized complex Gaussian fields.
// This checks the Fourier overlap, rather than restating the analytic formula.
test('complex numerical overlap agrees for unequal radii offset and two-axis tilt',()=>{
 const data={w1:1.8,w2:2.7,dx:.7,dy:-.4,thetaX:1.2,thetaY:-1.7,wavelength:1.55},step=.04,bound=16;
 const qx=2*Math.PI/data.wavelength*data.thetaX*Math.PI/180,qy=2*Math.PI/data.wavelength*data.thetaY*Math.PI/180;
 const norm=2/(Math.PI*data.w1*data.w2);let re=0,im=0;
 for(let x=-bound+step/2;x<bound;x+=step)for(let y=-bound+step/2;y<bound;y+=step){const amplitude=norm*Math.exp(-((x-data.dx)**2+(y-data.dy)**2)/data.w1**2-(x*x+y*y)/data.w2**2),phase=qx*x+qy*y;re+=amplitude*Math.cos(phase)*step*step;im+=amplitude*Math.sin(phase)*step*step;}
 near(a(data).efficiency,re*re+im*im,1e-9);
});

test('large finite wavelength and index ratios avoid intermediate overflow',()=>{const r=a({w1:2,w2:2,thetaX:1,index:1e308,wavelength:1e308});const reference=a({w1:2,w2:2,thetaX:1,index:1,wavelength:1});near(r.angularLoss,reference.angularLoss,1e-10);near(angularTolerance(2,2,1e308,1e308),angularTolerance(2,2,1,1),1e-10);assert.equal(angularTolerance(1e-200,1e-200,1e308,1,0),0);});
