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
12. Keep Mission 03 controlled experiments and Mission 04 Position-before-Direction gates explicit; Keep the experience a game; avoid introducing CAD/workbench complexity into Chapter 1.
