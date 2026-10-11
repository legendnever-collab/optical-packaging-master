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
