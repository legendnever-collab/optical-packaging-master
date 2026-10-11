# v0.4.0 Release Candidate — Regression Test Summary

## Executed locally — 2026-10-11

| Suite | PASS | FAIL | Evidence |
| --- | ---: | ---: | --- |
| Spatial Physics | 29 | 0 | Existing reference, stability and field quadrature; engine/tests preserved |
| Angular Physics | 19 | 0 | Existing phase-tilt, zero-tilt regression and complex-field quadrature; preserved |
| Assembly statistics | 28 | 0 | Existing seed/moments/bias/zero sigma, histogram/P95/Wilson and ranking reversal; preserved |
| Gaussian propagation / interfaces | 26 | 0 | Analytical q/ABCD, inverses, curvature kick, 4f relay, size regression, complex radial integral, gap/fold/domain validation and three mission feasibility |
| Gameplay / scoring | 21 | 0 | Existing seven policies plus three interface policies, access, retry and score separation |
| Persistence | 29 | 0 | Schema 1/2/3→4, seven preserved badges/designs, all ten records, Builder snapshot, corrupt/future/blocked storage |
| Build | 7 | 0 | Deterministic inline HTML, no runtime asset calls, classic JS parse and accessible controls |
| **Node total** | **159** | **0** | Node 24.19.0; cancelled/skipped=0 |
| Chromium offline UI | 72 | 0 | Chromium 141.0.7390.0, Playwright 1.62.1, Linux headless, file:// |
| **Local total** | **231** | **0** | Executed checks; release verifier separately reported |

Latest main v0.3 merge `e66573f81fbda98352f30f121c0ddef549ec2544` baseline: 126 PASS / 0 FAIL. All 48 spatial/angular physics and 28 statistics checks remain unchanged. Mission-count/access expectations were updated from seven to ten and persistence schema expectations from three to four. The old engines are not replaced or combined with the new propagation engine.

## Browser / offline evidence

The built local file is played through all ten missions with actual Physics-derived successes and incorrect-choice rejection. New checks: Receiver Z Mouse drag, two fine keyboard steps with focus retained across redraw, lens insertion initially failing, actual fixed-gap lens refocus, straight optical success failing package size, oversized fold rejection, three actual gap checks and explicit component losses, independent Builder editing/autosave/refresh, short 300 µm two-lens train and return to lens-free propagation. The seven existing gameplay runs, sound fallback/preference, factory process snapshots, replay, Free Practice, blocked storage and future-schema protection are preserved.

Actual v0.2 and v0.3 standalone files are opened in the same browser context before the new artifact. v0.3 schema-three test records contain all seven content badges and a saved Factory Design; v0.4 preserves them and unlocks Mission 08. Unit tests additionally verify full evaluation snapshots.

Chromium uses native offline emulation; observed HTTP(S) runtime requests=0 and critical page errors=0. Desktop 1440×1080 and mobile 390×844 have no horizontal overflow. Diagnosis, optimization, factory, focus and package controls/objects are checked on mobile. CDP Touch actually moves XY, Angular and Receiver Z state. This is emulated Touch, not a physical device.

Screenshots of focus, refocused gap, folded relay and mobile were inspected. Beam envelope is explicitly unfolded with different Z/radius scales; lens positions are shown in the route; target checks and losses have text status. QA-host Korean font is installed for screenshot inspection only and is not a runtime dependency or release asset. Screenshots live in ignored tmp/qa; machine-readable local results are browser-qa-results.json.

An added edge check found a one-micrometre slider maximum mismatch; max was corrected and the whole 72-check run passed. The v0.3 migration fixture initially omitted the required complete flag; it was corrected to represent actual v0.3 records, then the whole run passed. Earlier failures are not counted as successful without rerunning.

## CI and artifact verification

CI executes Node tests, rebuild-versus-committed HTML, independent ZIP/manifest verification and actual Chromium/Firefox/WebKit local-file gameplay jobs. CI results are posted to the PR after execution; they are not pre-counted as local tests.

Chromium/Firefox use native offline emulation. WebKit aborts HTTP(S) requests because native offline prevents file navigation on the runner; this verifies network independence but does not claim native WebKit offline-emulation navigation. CDP Touch checks are Chromium-only.

`python3 scripts/release.py --verify` checks ZIP names/CRC, exact HTML/document bytes, SHA256SUMS and manifest SHA-256 hashes. The RC archive excludes source attachments, internal/company bytes and credentials. Previous standalone HTML/ZIP files are retained; v0.4 is independently built.

## Known limits / not executed

- No human usability/learning-effect study, real handset or branded Edge/Safari/Windows/iOS/Android certification.
- File-origin storage varies by browser/profile/path. Restricted storage permits session play; independent Builder configuration is restored where storage is available. Campaign partial experiments restart.
- Chapter 3: scalar coaxial paraxial q in one homogeneous medium, 0–2 ideal lenses, ideal fold only. No aperture/clipping, body/clearance, lens decenter/tilt/walk-off, aberration, refraction or vector reflection.
- Mission 10 checks only ΔZ −100/0/+100. It does not establish continuous acceptance or statistical yield. Lens/mirror attenuation and package limits are assumed educational inputs.
- Chapter 2 Normal process/Yield model remains independent; adaptive same-cohort search needs held-out verification for real inference. No industrial calibration, thermal/adhesive/cost/full 6-DOF.
- Audible quality was not assessed by a listener. Sound path and preference are automated.
- v0.4 remains an unmerged RC PR; v0.3 main merge was user-approved. No new tag/auto-merge.
