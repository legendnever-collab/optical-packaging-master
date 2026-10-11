# v0.6 — Assemble, Lock & Test

## Gameplay and boundaries

One independent production challenge connects the First Light, Factory and Package Fit concepts. No Mission 11 is added; Campaign 01–10 retains its old policies, physics and achievements. Entry is directly accessible. Player actions: select Fixture and process, install Carrier, align its actual Facet, Lock, Optical Test, pay to Unlock/rework, evaluate 100 independent units, inspect actual failures, save/compare up to three candidates, deliver order. Top objective adapts to the current actionable stage.

Order policy: Prototype Total Loss ≤1 dB; Good ≥95/100; Total Cost ≤4800 Credits; summed Production Time ≤3200 s. Good=final total-loss pass count, not a score bonus. All three production goals and prototype validation are required. Badge is separately stored; no legacy mission achievement is rewritten. Passing a fixed 100-sample order is not a guarantee of true Yield ≥95% or a 95%-confidence lower bound ≥95%.

## Independent state and physics

`src/game/assembly-challenge.js` defines state machine, mechanical rectangles, assumed Fixture/part processes and economics. `src/ui/assembly-challenge.js` only renders/evaluates this state and sends actions to the model. `src/game/challenge-progress.js` owns the separate versioned save key. Four existing solver files remain unchanged; common-plane spatial/phase tilt is used here. Coaxial q/ABCD remains a separate Chapter 3 model.

States: Inventory → Align → Locked → Tested. Carrier can move only in Align. Lock requires mechanical fit but can intentionally lock a bad optical alignment; Test exposes that failure. Unlock returns to Align and charges rework. Alignment pays one lumped Prototype alignment cycle when first operated, rather than inventing cost per mouse pixel. Lock introduces no material displacement or loss. No adhesive model or cure drift is implied.

### Coordinate mapping / finite bodies

- Package rectangle z=[0,2000], x=[−650,+650] µm. Top SVG point=(60+0.28z, 260−0.28x), so Z/X share one scale. Carrier length=600 µm, width=600/760/1450 µm according to Fixture. PIC length=500, width=900, center=(1550,0).
- Carrier datum slot=(760,0), tolerance ±40 µm in each coordinate. Require Carrier bounds inside a 40 µm housing margin. Require separation from PIC in at least one rectangle axis by ≥40 µm. This is conservative axis-aligned inflated-rectangle clearance, not Euclidean distance, arbitrary polygons or 3D clearance.
- Z drag changes mechanical fit only; no gap loss is computed in this common-plane model. Carrier X adds directly to Optical dx. Fine adjustment and assembly variation are resolved in the Facet microscope: point=(190+22dx,135−22dy), circular field-amplitude 1/e radii scaled by the same 22 px/µm. Positive dy is up. Physical carrier and PIC extents are top-view rectangles; the internal optical core carriage/vertical assembly dimensions are not full 3D bodies.
- Small direction glyph shows θx exaggerated 4× and θy numerically. It does not trace a tilted ray through a gap. Body relief, grooves, screws and waveguide illustration are cosmetic within the declared top-view footprints. Beam timing is theatrical; brightness/thickness use actual total efficiency. Inspection switches the same visual output to raw or final Sample state, never a second fake optical result.

### Tolerance stack / independently validated production

For axis a and unit i:

e[a,i] = CarrierX (dx only) + Calibration[a] + DatumBias[a] + FixtureSigma[a] Zf[a,i] + PartSigma[a] Zp[a,i].

All four axes use independent Normal samples; UI angles are degrees and existing engine converts to radians. Covariance, mechanical rotation lever arms and correlated thermoelastic effects are not included. Datum biases are assumed fixed for an order: X +0.45 / Y −0.25 µm, θx +0.10 / θy −0.08°. Part sigma X/Y=0.18 µm; θx/θy=0.04°. Fixture sigma X/Y=0.70/0.12/0.08 µm and Tilt=0.35/0.06/0.04° (Economy/Precision/Oversized). Stack variance is sigmaFixture²+sigmaPart²; Bias includes calibration and Carrier X.

Prototype seed=20261011. Fine adjustment sets Calibration=value−current noncalibration contributions, compensating the actual Prototype sample. That compensation also includes its random placement error, so centering one Prototype does not perfectly correct the full production population.

Independent production seed=20261012. Candidate designs share the same standard normals, not the same already-scaled errors. Fixture source seed=seed; component source=seed XOR 0x71f9; residual source=seed XOR 0x5a3d; original seeded Box–Muller generator is preserved. Sample count=100. Before/first/final states are recorded. The production seed is held apart from the calibration sample; repeated design search on this cohort is still adaptive and would require another held-out dataset for industrial validation.

Active per-unit correction sets actual residual sigma X/Y=0.08 µm and Tilt=0.035°, recomputes Gaussian coupling and records the raw state. Passive uses the calibrated raw stack. Optional rework applies that same Active residual model only to initial rejects. This is an assumed residual model, not a simulated search algorithm, metrology instrument or automatic shrinkage correction. Mode mismatch remains; a mismatched mode does not receive a performance bonus. Out-of-domain ±5° samples are rejected by the unchanged solver; no silent clipping/discarding.

## Assumed economics / reporting

| Action | Credits | Time s |
| --- | ---: | ---: |
| Parts / Carrier + PIC | 12 | 8 |
| Economy Fixture | 12 | 8 |
| Precision Fixture | 24 | 12 |
| Oversized Fixture | 35 | 16 |
| Active Alignment | 9 | 8 |
| Lock | 1 | 1 |
| Optical Test | 2 | 2 |
| Unlock | 9 | 6 |
| Failure rework: Unlock + Align + Lock + Test | 21 | 17 |

Parts/Fixture are charged once to the Prototype when installed. First Prototype alignment action charges once; all Prototype Locks, Tests and Unlocks are charged. Each production unit adds parts/Fixture/Lock/Test, plus per-unit Active Alignment if selected and rework if it initially fails. Components are reused during rework; a second parts charge is not added. Time is serial summed assumed cycle time, not animation duration or a parallel factory scheduling model. Current order includes its Prototype expenses; each candidate/New Design is an independent order evaluation, not a lifetime cash account. Re-evaluation uses the same scenario and does not charge a second fictitious production order.

Cost per Good Unit = total order cost / final Good, unavailable if Good=0. Report includes First Pass / Final Yield, raw first failures, final Good/Reject, reworked count, P95 nearest-rank and 95% Wilson CI. Mechanical failure is not turned into optical loss. Factory playback uses the first ten final evaluated rows; full dashboard uses all 100. Rework stations are represented by actual counts and inspection Before/Final results; playback is not a discrete-event factory solver.

### Reproducible strategy examples (center Prototype, same independent order seed)

| Design | First Good | Final Good | Cost | Time | Order |
| --- | ---: | ---: | ---: | ---: | --- |
| Economy Passive | 72 | 72 | 2736 | 1927 | Yield fails |
| Economy Passive + rework | 72 | 100 | 3324 | 2403 | Qualifies |
| Economy Active | 100 | 100 | 3636 | 2727 | Qualifies |
| Precision Passive | 100 | 100 | 3948 | 2331 | Qualifies |
| Precision Active | 100 | 100 | 4848 | 3131 | Budget fails |

Prototype manual rework increases the table costs/times. These are model-specific outcomes, not published manufacturing performance or supplier prices. Oversized precision is blocked by geometry. Narrow Fiber w=1.5 versus PIC w=3 has mismatch >1 dB even after perfect Active centering; actual optical failure cannot pass by economics.

## Persistence / access / limitations

Campaign key `optical-packaging-master.progress`, schema 4, content versions 3/4 is unchanged; gameVersion is 0.6.0. New independent key `optical-packaging-master.assembly`, schema 1/model `datum-assembly-v1`, stores draft stage, Carrier position, calibration, accrued Prototype cost/time, Lock/Test, run seed/award and three design snapshots. Derived results are recalculated on restore. Validate all enum/geometry/domain/cost/seed inputs before rendering. Unsupported/future/corrupt data is protected and falls back to session play. Explicit Challenge Reset clears only Challenge state; Campaign reset leaves Challenge alone. Preview has null storage and does not read/write either key.

Pointer capture supports mouse/touch; actual inverse SVG CTM is used, so no hardcoded CSS-box arithmetic. Carrier arrow keys: Z ±10 µm, X ±1 µm. Facet arrow keys ±0.1 µm, Shift ±0.01 µm. Sliders and labeled install/snap buttons remain available. Reduced Motion removes beam travel and playback delay; real computed states/outcomes remain identical. Navigation cancels stale playback. Mobile bench precedes design panel, inventory sits next to the scene, labels and budgets use text plus color.

No human first-play/fun/learning-effect assessment. No real handset certification. No 3D solids, arbitrary collision mesh, lens decenter/tilt integration, finite aperture, thermal/adhesive drift, fixture stiffness, contact forces, realistic ray-traced reflections or calibrated manufacturing cost/time. Prior missions retain their own explicitly simplified schematic footprint models.
