# v0.5.0 RC — Physics Regression & Browser Test Report

## Local execution — 2026-10-11

| Suite | PASS | FAIL | Actual scope |
| --- | ---: | ---: | --- |
| Spatial Physics | 29 | 0 | Existing reference/stability/field integral, unchanged |
| Angular Physics | 19 | 0 | Phase tilt and independent complex integral, unchanged |
| Assembly statistics | 28 | 0 | Seed/moments/bias/zero sigma/Yield/P95/CI/ranking, unchanged |
| Gaussian propagation/interfaces | 26 | 0 | q/ABCD/4f/size/curvature/complex integral/gap/fold feasibility, unchanged |
| Mission/scoring | 21 | 0 | Ten existing success policies and wrong choices, unchanged thresholds |
| Persistence | 29 | 0 | Legacy/content/factory/draft/future/restricted storage; schema 4 retained |
| Build | 7 | 0 | Single HTML, classic parse, determinism and no external assets |
| Scene mappings / factory playback | 13 | 0 | XY/straight/fold/camera inverses, power, real row stages, immutability, ten cap, cancellation and replay |
| **Node total** | **172** | **0** | Node 24.19.0; skipped/cancelled=0 |
| Chromium offline UI | 90 | 0 | Chromium 141.0.7390.0 / Playwright 1.62.1, Linux headless file:// |
| **Local total** | **262** | **0** | Actual checks; archive verifier separately reported |

Baseline v0.4 Head 3f94233f17a0af010b3ebfb33c1ebef4f666fb81: 159 Node PASS / 0 FAIL. PR #4 is open/unmerged; main v0.3 e66573f81fbda98352f30f121c0ddef549ec2544. Every optical solver and all 102 physics/statistical reference tests remain byte-identical. Persistence's gameVersion expectation and build artifact version changed; no schema or content version was bumped and no previous achievement was deleted.

## Actual UI / offline coverage

Every Mission 01–10 is played end-to-end with the retained policies and actual wrong-physics rejection. Hardware default, physical Fiber drag with exact shared XY/result, four views, Gaussian Overlay, camera/exploded invariance, opaque fault evidence, direct physical Receiver Z, Inventory Lens Drop, lens fine Keyboard/focus retention and focal adjustment with actual q envelope/output changes are exercised. Existing XY/Angular/Receiver instrument drag, slider state and fine keyboard are retained under Advanced.

Factory plays ten actual samples through PLACE/TEST/SORT; counts and rows reconcile. Full dashboard reconciles produced/GOOD/REJECT/Yield/P95 with selected 100/1000/10000 evaluation. Rejected-package Inspection restores actual state, Loss/limit/dominant contribution. Same seed reproduces results. In-flight production navigation is tested with animation enabled and prevents stale state writes. Sound preferences/fallback, replay, full practice, stored factory process snapshots and independent Builder draft refresh are preserved.

Actual old v0.2, v0.3 and v0.4 standalone files are opened before the new file to exercise persistence continuity. All ten v0.4 content badges and Builder configuration survive; unit tests include full evaluation snapshots. Vertical Slice directly opens 01/05/09 and plays factory/lens without reading or overwriting existing progress. Future schema is protected and blocked storage still permits session play.

Chromium native offline emulation: runtime HTTP(S) requests=0; critical page errors=0. 1440×1080 desktop and 390×844 mobile check layout. Actual emulated CDP Touch changes physical Fiber, legacy XY, angular, Receiver and installs an Inventory Lens. No physical handset claim. Reduced Motion removes optical travel; no-preference retains actual-power animation. Production outcomes are independent of delay settings.

## Visual evidence

Six committed PNG captures under docs/screenshots show First Light, factory, actual rejection inspection, restored lens link, ideal folded package and mobile lens placement. Korean font is installed on the QA host only, not in the artifact. Main component/routing/typography and mobile controls were visually reviewed. Hardware is the largest workbench surface, detailed instruments are collapsed by default, and text distinguishes model assumptions and error/achievement. Internal full-page engine captures are in ignored tmp/qa.

Development checks caught closed-Advanced read assertions and an overlay intercepting Receiver input; tests were adapted to actual disclosure controls and optical overlays made pointer-transparent. A fixed display extent ensures Receiver movement visibly changes its position. The complete final suite was rerun; earlier failures are not counted as final success. No human first-play observation or fun/learning-effect study was performed.

## CI / artifact verification

Stacked PR CI runs Node, deterministic rebuild/committed-source check, archive/SHA256/source-byte verification, and real Chromium/Firefox/WebKit local-file campaigns. Actual completed counts/versions are reported in the PR after execution, not pre-counted here. Chromium/Firefox use native offline; WebKit aborts HTTP(S) requests because native-offline prevents file navigation on the runner. WebKit network independence is tested; native WebKit offline-emulation navigation is not claimed. Five CDP Touch assertions are Chromium-only.

`python3 scripts/release.py --verify` checks manifest hashes, all archive names/CRC/SHA256SUMS and exact HTML/document/screenshot bytes. v0.4 HTML/ZIP and older artifacts are unchanged. The vertical-slice HTML is a frozen intermediate snapshot, distinct from the polished final campaign. It is validated in browser as supplied, not claimed rebuilt from the current final source. No attachment/company bytes or credentials are redistributed.

## Known issues / unverified work

- 2.5D bodies, mounts and datum are illustrative; no body collision, aperture, clearance, real reflection/refraction, aberration or component tolerance solver. Drawn body overlap is not a calculated packaging defect.
- Phase-tilt/spatial statistics and coaxial q propagation remain separate models. Optical overlays do not combine them.
- Fold is ideal centerline geometry plus declared 0.15 dB. Lens is ideal plus assumed 0.10 dB. Mission 10 tests three Z probes, not full-range tolerance/Yield.
- Narrow screens require zoom/Advanced/keyboard for precise parameter work; SVG body labels scale with scene. CDP Touch is emulation; real phones/tablets/branded Edge/Safari/Windows/iOS/Android are not certified.
- file:// storage depends on profile/path. Independent Builder saves, partial campaign experiments restart; restricted storage is session-only. Vertical Slice never persists.
- Statistical assumptions are uncalibrated; adaptive same-cohort design search needs independent verification for industrial claims.
- Sound output quality has no listener assessment. No human playtime, enjoyment, comprehension or learning-effect evidence.
- v0.5 depends on open PR #4 and remains an unmerged RC. After #4 merge, realign to latest main and rerun CI; no auto-merge/tag.
