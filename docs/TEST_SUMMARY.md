# v0.3.0 Release Candidate — Regression Test Summary

## Executed locally — 2026-10-11

| Suite | PASS | FAIL | Evidence |
| --- | ---: | ---: | --- |
| Spatial Physics | 29 | 0 | Existing formula references, stability and independent quadrature; unchanged tests/engine |
| Angular Physics | 19 | 0 | Existing phase-tilt reference, zero-tilt regression and complex-field quadrature; unchanged tests/engine |
| Assembly statistics | 28 | 0 | Seed/prefix/zero seed, Normal moments, Bias/zero Sigma, counts/Histogram/P95, Wilson CI, unchanged-engine row regression, extreme/domain validation and design ranking reversal |
| Gameplay / scoring | 18 | 0 | Seven unique policies, diagnosis/repairs, environment decisions, discovery, Yield/P95 goals, progression/retry/hints and score separation |
| Persistence | 24 | 0 | Schema 1/2→3, separate new achievements, saved evaluation snapshots, corrupt values, quotas/blocked storage and future schema protection |
| Build | 7 | 0 | Deterministic Single HTML, no external runtime assets, classic script parse and accessible controls |
| **Node total** | **125** | **0** | Node 24.19.0 |
| Chromium offline UI | 52 | 0 | Chromium 141.0.7390.0 / Playwright 1.62.1, Linux headless, actual file:// artifact |
| **Local total** | **177** | **0** | All checks executed; no skipped tests counted |

Baseline main v0.2 had 94 PASS / 0 FAIL before editing. The 48 existing Physics checks and engines are preserved. Old gameplay-policy tests were replaced to match the authorized redesign; the baseline's forced card sampling / repeated positioning requirements are intentionally superseded, not claimed unchanged.

## Browser and visual evidence

Browser QA plays every mission end-to-end and rejects wrong physical choices: limited inspections with initially hidden evidence, failed diagnosis/repair, different winners in two Interface environments, Center recheck preserving Angular Loss, mouse direction drag and fine keyboard, ten actual assemblies, 100 and 10000 statistics, actual failure inspection, constant-seed replay, continuous fixed-Waveguide optimization and two factory rounds on common cohorts. It verifies sound preference storage, saved design process snapshots, replay, full Free Practice, real v0.2-file→v0.3-file migration, unknown schema protection and blocked storage.

Chromium uses native network-offline emulation. Observed runtime HTTP(S) requests=0 and critical page errors=0. Desktop 1440×1080 and mobile 390×844 are checked for overflow; diagnosis, optimization and factory controls are checked on mobile. Actual CDP Touch drag changes X/Y and angular state. This is emulated Touch, not a physical handset.

Final screenshots for First Light, diagnosis, Interface decision, lottery, optimization, factory and mobile were visually inspected. Objective/next-action text precedes controls, diagnosis remains concealed, sensitivity and histogram labels correspond to actual physics, and narrow panels fit vertically. Screenshots are internal QA evidence under ignored `tmp/qa`; Korean font was installed on the QA host only. Structured local evidence is `browser-qa-results.json`.

During development, a copy/test mismatch and a mobile selector typo failed checks; these were corrected and the final whole Chromium run passed 52/52. No earlier failure is counted as a final PASS without rerunning.

## CI scope and independent release verification

CI runs Node tests, deterministic build/source-byte comparison and release ZIP verification, plus real Chromium, Firefox and WebKit jobs. Each browser plays the complete campaign offline with the same script; CDP Touch runs only in Chromium. Actual CI status is recorded in the PR after publication and is not pre-counted as local evidence.

Chromium/Firefox use native offline emulation. WebKit aborts all HTTP(S) requests because native-offline prevents file navigation on the runner. Thus WebKit network independence is tested, but native WebKit offline-emulation navigation is not claimed PASS. Input coordinate comparisons allow small raster quantization while shared Slider/display values must agree exactly.

`python3 scripts/release.py --verify` checks ZIP names/CRC, exact source HTML/document bytes, SHA256SUMS and manifest hashes. It is reported separately rather than inflating assertion counts. Source attachments, internal/company files and credentials are excluded from the public artifacts.

## Known limitations / not executed

- No human first-time play observation, learning-effect or satisfaction study. Immediate comprehension and 1–2 minute tutorial timing remain design goals.
- No physical phone/tablet or branded Edge/Safari/Windows/iOS/Android execution; engine QA does not certify every platform.
- File-origin Local Storage varies with Browser/Profile/path. In-progress experiments restart on refresh; stored achievements/designs survive where storage is permitted.
- Independent Normal process settings are assumptions. CI does not prove industrial Yield or compensate for model error or adaptive optimization on the same cohort. Independent seeds/holdout measurement are required for real design validation.
- Common-plane scalar paraxial X/Y + θx/θy only. No Gap/Propagation/Lens/Walk-off/Refraction/Full 6-DOF/thermal/adhesive/cost model. Angular samples outside ±5° reject evaluation; none are clipped.
- Sound preference and AudioContext path are automated; audible quality was not assessed by a listener.
- RC for review; no main Merge, Auto-merge or Tag.
