# Roadmap — after v0.5

| Version / status | Theme | Scope |
| --- | --- | --- |
| v0.1 implemented | First Light | Spatial Gaussian overlap; artifact preserved |
| v0.2 implemented | Angular Alignment | Common-plane paraxial phase tilt; engine/tests/artifact preserved |
| v0.3 merged | Problem-solving / Passive Tolerance | Seven differentiated missions, Normal variation, Yield/CI/P95, saved factory designs |
| v0.4 open PR #4 RC | Optical Interface Builder | Coaxial Gaussian q/ABCD, 0–2 ideal lenses, waist/size/curvature matching, gap/defocus, ideal folded centerline; Missions 08–10 |
| v0.5 implemented RC | The Packaging Experience | Physical components, inventory placement, actual production/sorting/inspection, shared views, retained ten missions |
| Next proposed | Mechanical & Manufacturing Engineering | Real component body/clearance, datums, assembly sequence/tolerances and cost with explicit models |
| v0.6 planned | Industrial Reference Lab | Public precision mechanical interface, photonic plugs and CPO assembly; Published / Modeled / Assumed labeling, no private-design inference |
| Later planned | Optical propagation extensions | Derive combined decenter/tilt propagation, aperture/clipping, aberration and correlated/held-out assembly verification |
| Later planned | Multi-channel / Reliability | FAU pitch/uniformity, thermal/bonding, calibrated correlated process distributions |

v0.4's ideal fold is not a reflected vector-field model; three deterministic gap probes are not whole-range tolerance or Yield. An arbitrary optical chain/editor and real finite optics remain unimplemented. Evanescent coupling requires its own model. Before expanding controls, observe first-time players and test whether Chapter 3 objectives are understood. A subsequent release should connect the current optical centerline to mechanical dimensions and honest cost/assembly assumptions.
