import test from 'node:test';import assert from 'node:assert/strict';
import {gaussianCoupling as g,alignmentTolerance as tol,compareModes} from '../src/physics/gaussian-coupling.js';
const near=(a,b,e=1e-10)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);
test('identical zero-offset modes couple 100%',()=>near(g({w1:2.5,w2:2.5}).efficiency,1));
test('identical zero-offset modes have zero dB',()=>near(g({w1:2.5,w2:2.5}).totalLoss,0));
test('radius mismatch at center has known prefactor',()=>near(g({w1:1,w2:2}).efficiency,.64));
test('reference equal modes offset of one radius',()=>{const v=g({w1:2,w2:2,dx:2});near(v.efficiency,Math.exp(-1));near(v.totalLoss,10/Math.LN10);});
test('independent normalized-field numerical quadrature',()=>{
 const w1=1.6,w2=2.7,dx=.7,dy=-1.1,step=.05;let integral=0;
 for(let x=-14;x<14;x+=step)for(let y=-14;y<14;y+=step){const u1=Math.sqrt(2/Math.PI)/w1*Math.exp(-((x-dx)**2+(y-dy)**2)/w1**2);const u2=Math.sqrt(2/Math.PI)/w2*Math.exp(-(x*x+y*y)/w2**2);integral+=u1*u2*step*step;}
 near(g({w1,w2,dx,dy}).efficiency,integral**2,1e-9);
});
test('efficiency strictly decreases with increasing offset',()=>{let last=1;for(let x=.1;x<10;x+=.1){const e=g({w1:2,w2:2,dx:x}).efficiency;assert.ok(e<last);last=e;}});
test('X/Y symmetry',()=>near(g({w1:2,w2:3,dx:1,dy:2}).efficiency,g({w1:2,w2:3,dx:2,dy:1}).efficiency));
test('sign symmetry',()=>near(g({w1:2,w2:3,dx:1,dy:-2}).totalLoss,g({w1:2,w2:3,dx:-1,dy:2}).totalLoss));
test('reciprocal source and target interchange',()=>near(g({w1:2,w2:3,dx:1}).efficiency,g({w1:3,w2:2,dx:1}).efficiency));
test('doubling offset quadruples alignment dB loss',()=>near(g({w1:2,w2:3,dx:2}).alignmentLoss,4*g({w1:2,w2:3,dx:1}).alignmentLoss));
test('mismatch and alignment loss add to overlap',()=>{const v=g({w1:1,w2:2,dx:1});near(v.overlapLoss,v.mismatchLoss+v.alignmentLoss);});
test('fixed interface adds loss but preserves mode overlap',()=>{const a=g({w1:2,w2:2,dx:1}),b=g({w1:2,w2:2,dx:1,fixedLoss:3});near(a.efficiency,b.efficiency);near(b.totalLoss,a.totalLoss+3);near(b.totalEfficiency,a.efficiency*10**(-.3));});
test('range guaranteed across radius and offset grid',()=>{for(const w1 of [.001,1,2.5,1e3])for(const w2 of [.001,1,2.5,1e3])for(const dx of [0,.1,1,1e6]){const v=g({w1,w2,dx,dy:-dx});assert.ok(v.efficiency>=0&&v.efficiency<=1);assert.ok(v.totalLoss>=0&&!Number.isNaN(v.totalLoss));}});
test('underflow does not erase finite analytical loss',()=>{const v=g({w1:1,w2:1,dx:100});assert.equal(v.efficiency,0);near(v.totalLoss,43429.44819032518,1e-7);});
test('extreme finite radii avoid overflow in radius squares',()=>near(g({w1:1e300,w2:1e300}).efficiency,1,1e-9));
test('extreme finite offsets produce zero power without NaN',()=>{const v=g({w1:1e-200,w2:1e-200,dx:1e200});assert.equal(v.efficiency,0);assert.equal(v.totalLoss,Infinity);});
for(const [name,bad] of [['zero radius',{w1:0}],['negative radius',{w2:-1}],['NaN offset',{dx:NaN}],['infinite offset',{dy:Infinity}],['negative fixed loss',{fixedLoss:-1}],['string radius',{w1:'2'}]])test(`reject ${name}`,()=>assert.throws(()=>g({w1:2,w2:2,...bad}),RangeError));
test('1 dB radial tolerance lies on analytical threshold',()=>{const t=tol(2.5,2.5,1);near(g({w1:2.5,w2:2.5,dx:t}).totalLoss,1);});
test('infeasible tolerance returns null',()=>assert.equal(tol(1,4,.1),null));
test('invalid tolerance target rejected',()=>assert.throws(()=>tol(2,2,-1),RangeError));
test('expanded matched mode improves same-offset loss and tolerance',()=>{const a=compareModes(1.5,0);assert.ok(a[0].totalLoss>a[1].totalLoss&&a[1].totalLoss>a[2].totalLoss);assert.ok(a[2].tolerance>a[1].tolerance);});
test('fixed waveguide minimum centered mismatch is Medium',()=>{const a=compareModes(0,0,false);near(a[1].totalLoss,0);assert.ok(a[0].totalLoss>0&&a[2].totalLoss>0);});

test('joint extreme offsets and radii retain finite ratio-based loss',()=>{const v=g({w1:1.7e308,w2:1.7e308,dx:1.7e308,dy:1.7e308});near(v.totalLoss,20/Math.LN10,1e-10);near(v.efficiency,Math.exp(-2),1e-10);});
test('extreme matched radii retain representable tolerance',()=>{const t=tol(1.7e308,1.7e308,1);assert.ok(Number.isFinite(t)&&t>0);near(g({w1:1.7e308,w2:1.7e308,dx:t}).totalLoss,1,1e-9);});
