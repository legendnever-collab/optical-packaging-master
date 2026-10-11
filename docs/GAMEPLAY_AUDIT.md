# v0.3–v0.4 Gameplay Audit

Baseline directly fetched from main: `0cb4c3a4feb69bde4c7cc59b526376116ff40e35` (v0.2.0). Baseline regression: 94 PASS / 0 FAIL. Existing Gaussian spatial / angular physics and pointer/keyboard scenes are retained. No user test or learning-effect measurement was conducted.

## Findings

v0.2 M01/M02 both reduce X/Y Loss, M03 forces six measurements and a matching card, and M04 repeats Center then direction correction. One shared instrument shell puts similar controls in every mission. Numbers are meaningful, but roles, hidden information, consequence and decisions differ too little. Long scene/panel stacking obscures objectives on mobile; the same PASS affordance conflates observation, diagnosis and selection.

## Differentiation matrix / implementation contract

| Mission | Unique player action | Engineering principle | Failure mechanic | Success condition | Achievement |
| --- | --- | --- | --- | --- | --- |
| 01 First Light | Drag Fiber; compare input/output light | Spatial overlap controls transmitted fraction | Output remains dim; target unmet | ≤1 dB, with voluntary sound + visible first-light feedback | First Light Achieved |
| 02 Find the Fault | Choose up to 2 distinct diagnostic tests; identify cause; apply repair | Center, radius mismatch and phase tilt have distinct evidence | Wrong diagnosis/repair leaves actual Loss or requires retry | Correct diagnosis + actual restoration in all 3 cases | Root Cause Identified |
| 03 Choose the Optical Interface | Predict a design, experiment, commit per assembly environment | Lateral/angular sensitivity trade-off changes ranking | Same Mode is unsuitable in another environment | Pass both physical environment requirements | Robust Interface Selected |
| 04 Aim the Light | Discover hidden direction error at already aligned centers; drag direction handles | Equal intensity centers do not guarantee phase overlap | Lateral repair cannot fix angular loss | Identify angular cause and correct to ≤0.5 dB | Direction Restored |
| 05 Assembly Lottery | Design then watch 10 independent assemblies; increase sample count | Nominal performance differs from process yield | Individual random errors fail although nominal is ideal | Inspect a failed sample; evaluate ≥100 samples | Manufacturing Variation Revealed |
| 06 Make It Tolerant | Optimize continuous Fiber radius under a fixed process and fixed Waveguide radius | Lateral, angular and mismatch penalties compete | Radius extremes lower modeled yield | ≥95% estimated Yield on 1000 common samples | Tolerance Design Achieved |
| 07 Beat the Factory | Save up to 3 named designs; evaluate common samples; adapt to process shift | Best nominal Loss can have worse passive yield | A winner on one process loses after angular/bias change | Compare ≥2 designs and meet physical Yield/P95 targets in two processes | Factory Challenge Beaten |

## Learning UX checks

Objective and immediate next action appear at the top. Diagnostic evidence is initially hidden from scene, controls, measurements and accessibility text. Inspection costs provide information rather than procedural busywork. Interface comparison is optional; no six-card forced sequence. Assembly statistics share one cohort/seed across designs, explicitly labeled. Failed parts can be selected to reveal a real sample's Offset/Tilt/Loss and dominant loss contribution. A short four-part learning summary connects each achievement to its engineering principle.

## Scope / evidence boundary

7 missions are implemented, retaining Free Practice, replay, legacy progress, offline build and physical regression. Independent normal process errors, bias, sample uncertainty and model-domain rejection are explicit engineering assumptions. No gap, lens propagation, walk-off, refraction or industry yield calibration is added. Automated checks and visual inspection verify operation; first-time usability and learning efficacy remain hypotheses until observed with people.

## v0.4 incremental audit

Approved v0.3 PR #3 merged at `e66573f81fbda98352f30f121c0ddef549ec2544`; latest main fetched before branching. Baseline 126 PASS / 0 FAIL. Chapters 1–2 retain their differentiated actions and unchanged spatial/angular/statistics engines. New controls are shown only in Chapter 3 / independent Builder, keeping the original tutorial simple.

| Mission | Unique action | Principle | Failure | Success | Reward |
| --- | --- | --- | --- | --- | --- |
| 08 Catch the Focus | Place Receiver along Z on a converging beam | Size/curvature matching matters despite coaxial centers | Defocus leaves loss | No lens, actual ≤0.50 dB | Focus Captured |
| 09 Bridge the Gap | Install/refocus one lens across fixed gap | Thin lens changes curvature, propagation changes size | Bare gap or poor lens fails | One lens, actual ≤0.50 including fixed loss | Gap Bridged |
| 10 Fit the Package | Choose relay, position lens/fold, inspect package checks | Expansion plus curvature and physical routing constraints | Optical success without fit; nominal success without probe acceptance | Two lenses + fold; three loss/footprint checks pass | Optical Interface Designed |

M08 changes the observation plane, M09 changes an optical component, M10 makes a system choice under optical and space constraints. None asks for the previous X/Y centering behavior. The optional Builder exposes parameters without forced measurements or required campaign steps. Finite probes and centerline footprints are labeled; no player study or industrial packaging validation was performed.
