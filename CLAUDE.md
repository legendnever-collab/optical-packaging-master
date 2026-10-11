# Project guardrails

1. Incremental changes only. Keep UI-independent physics in `src/physics` and game policy in `src/game`.
2. All physics lengths are µm; Tilt input degrees converts to radians; wavelength is vacuum and index the common medium; radius is field-amplitude 1/e, not MFD. Derived values are never overwritten for scoring.
3. Distinguish mismatch, alignment, angular, overlap, fixed and total dB loss, and distinguish overlap η from total transmitted power.
4. Never reuse this lateral Gaussian formula for evanescent, angular, thermal, adhesive or yield models without a separately justified model.
5. Default campaign progression is sequential; Free Practice always accessible and cannot mutate completion/best scores.
6. Version persistence; provide a migration and regression evidence before a schema change. No import/upload requirement.
7. No runtime dependencies, CDN, remote font, tracking, API key or network fetch. Source modules may be used during development; distribute one inline HTML.
8. Korean explanatory prose; English technical terms. Accessible labels, keyboard controls, text status and reduced motion are mandatory. Do not rely on color alone.
9. `npm test` and `npm run build` are minimum checks. Run `npm run test:ui` on the built file offline. Record actual engines, versions, counts and skipped work truthfully. Never count unexecuted browser tests as PASS.
10. Rebuild dist after changing source; do not hand-edit it. Run `npm run release` after updating evidence. Hashes live in `dist/release-manifest.json` and ZIP integrity is tested.
11. No user attachments, internal/company material or credentials in public Git. Use git phase commits. Feature branch + PR only; no merge, auto-merge or tag without explicit approval.
12. Keep Mission-specific gameplay: 02 hidden evidence and bounded inspection, 03 predict/experiment/decide without forced card sampling, 04 hidden direction at already aligned centers, 05 sample observation, 06 continuous fixed-process optimization, 07 common-cohort design decisions. Avoid CAD complexity in Chapter 1.

13. Independent Normal process errors and fixed uint32 seeds are explicit assumptions. Compare designs on identical samples. Reject angular samples outside the phase-tilt domain; never clip, omit or resample silently. Report Yield with counts, P95 and Wilson uncertainty.
14. Schema 4 preserves legacy achievements separately from redesigned content badges. Keep complete evaluation snapshots with Seed, Count, Process Bias/Sigma, Model Version and Loss Limit. Never claim adaptive same-cohort optimization is independent yield validation.

15. Keep geometric q/ABCD propagation independent from the common-plane lateral/angular model. Same homogeneous n only; geometric free-space B=d. Derive decenter/tilt propagation before combining models. Require complex-field and analytical regression tests.
16. Fold is unfolded-axis identity plus centerline geometry and separately assumed fixed mirror attenuation. Do not claim reflection physics, apertures or mechanical envelope. Mission 10 uses three deterministic gap checks, not Yield or whole-range acceptance. Store/score their worst loss explicitly.
17. Preserve v3 content badges (M01–07), factory designs and process evaluations in schema 4. Independent Builder autosave must not alter campaign achievements. Rebuild v0.4 artifacts without overwriting older standalone releases.

18. v0.4/v0.5 were merged with user approval. v0.6 baseline main is 80fe758062745772da7f7f3c5f16a84eaa7b2f56. v0.6 needs its own approval before merge/tag.
19. PhysicalScene is presentation, not new physics. Field overlays are pointer-transparent; camera/exploded edits cannot mutate engineering state. Concealed fault geometry stays concealed across every view.
20. Factory playback consumes actual evaluateDesign rows, previews only ten, and must cancel on navigation/retry. Inspect actual row.state/results; full dashboard counts use full report. Do not fabricate PASS/FAIL for animation.
21. Keep schema 4/content versions 3/4 to preserve v0.4 achievements. Vertical-slice mode is fresh memory-only progress, opens 01/05/09 directly, and must never read/write campaign progress. Preserve prior releases.

22. Assembly Challenge is independent of the ten-mission campaign. Preserve Schema 4 exactly; new challenge uses a separate schema-1 key and protects unknown schemas. Preview must read/write neither key.
23. Lock is an interaction state, not adhesive shrinkage physics. Mechanical fit covers declared axis-aligned Carrier/PIC rectangles, boundary margin and slot only; no 3D collision/aperture/stiffness/thermal claims. Z geometry must never fabricate Gaussian gap propagation.
24. Prototype calibration seed and independent production seed differ. Compare candidates on identical fixture/component/residual standard-normal samples. Active correction and rework must recalculate actual residual optical inputs. Preserve raw/first/final results and first-pass/final Yield.
25. Manufacturing cost/time are declared teaching assumptions: include Prototype, parts, Fixture, Alignment, Lock, Test and charged Unlock/rework. Qualification needs Prototype PASS, ≥95/100 Good and actual order budgets. Zero-good cost is unavailable, not zero/infinity in saved JSON.

26. v0.7 default Campaign contains six physics-driven chapters; ten prior missions are optional and retain unchanged solvers. Bare Si succeeds through diagnosis, not an impossible 1 dB goal.
27. Rotated/curved fields require normalized complex 2D Gaussian overlap. Relay uses the same q/ABCD and affine ray transforms; no silent multiplication of lateral/angular/curvature penalties.
28. Converter presets are explicitly assumed effective fields, not a validated PDK surrogate. Do not invent tip-width/length performance dependence or claim SiN-assisted product reproduction.
29. New Campaign storage is Schema 1 / Content 7; preserve legacy keys and unknown/corrupt future bytes. Preview reads/writes no saved keys. Validate typed evidence, project/factory/comparison archives before paste restoration.
30. Ch5 refreeze transfers exact changed optics to Ch6, archiving prior manufacturing result and requiring a new qualification. Preserve compatible lens placements on Ch4 converter handoff.
31. v0.7 release manifest uses its own filename. Legacy QA screenshots use v0.7-legacy-*; never overwrite earlier version screenshots/HTML/ZIP. Preserve the delivered first-four checkpoint; final build is generated separately.
32. v0.7 baseline is unmerged v0.6 PR #6 head 2d52ce7; main remains v0.5 unless verified otherwise. Publish phase commits and RC PR; no main merge, auto-merge, tag or release without explicit approval.

33. v0.7 Final UX was explicitly approved for immediate merge after final regression/CI. v0.6 PR #6 is merged at 2ceb71e94f867f76905eaa57a4a762d684f9983a. Earlier candidate-only instructions are historical.
34. Guidance is UI-only and derives from the existing campaign/evidence/factory state. Fine controls dispatch existing input/change handlers, respect disabled state/bounds and never own a parallel physics state. Do not add physics or chapters in this final patch.
