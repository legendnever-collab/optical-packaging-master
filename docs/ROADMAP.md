# Roadmap — after v0.6

| Status | Theme | Scope |
| --- | --- | --- |
| v0.1–v0.3 implemented / artifacts retained | First Light, Angular, Passive Tolerance | Gaussian overlap/phase tilt, diagnosis, design decisions, Monte Carlo/CI |
| v0.4 merged PR #4 | Optical Interface Builder | Coaxial q/ABCD, Lens, waist/curvature, ideal unfolded fold; Missions 08–10 |
| v0.5 merged PR #5 | The Packaging Experience | Hardware-first scenes, Inventory placement, actual Factory sorting/Inspection |
| v0.6 implemented RC | Assemble, Lock & Test | Independent challenge: finite rectangular Fixture/Package fit, Datum/part error stack, Lock/Test/Rework, per-unit Active residuals, assumed time/cost and three-order comparison |
| Next proposed | Misaligned Optical Train | Derive Beam Center/Direction propagation with q, decentered/tilted finite optics, gap and paraxial overlap references; independent tests before combining models |
| Next proposed | Mechanical Manufacturing extensions | Fine carriage envelope, arbitrary 3D parts/clearance, assembly sequence/contact models, calibrated process/cost, correlations and fresh held-out production validation |
| Later planned | Industrial Reference Lab | Public precision mechanical interfaces, photonic plugs and CPO assembly with Published/Modeled/Assumed labels; no private-design inference |
| Later planned | Multi-channel / Reliability | FAU pitch/uniformity, bonding/thermal, correlated tolerance and Known-Good subassembly |

The next step is first-play observation of the assembly challenge and its objectives. Model complexity should follow understood player problems. Current top-view fit is defined rectangular geometry, not arbitrary physical CAD; Lock is not a bonding model. Current active correction is assumed residual metrology, not an alignment search. The 100-unit qualification is a sampled game order. Existing optical mode and q engines remain separate. Evanescent coupling needs an independently derived model.
