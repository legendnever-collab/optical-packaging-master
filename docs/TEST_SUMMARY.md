# v0.1.0 Release Candidate — Test Summary

## Executed locally

| Suite | PASS | FAIL | Environment / evidence |
| --- | ---: | ---: | --- |
| Physics | 27 | 0 | Node 24.19.0; includes independent normalized-field quadrature |
| Gameplay / scoring | 17 | 0 | Node built-in test runner |
| Persistence | 13 | 0 | Real validation plus restricted/quota/error adapters |
| Build / offline asset inspection | 7 | 0 | Reproducible inline HTML, classic-script syntax and zero runtime asset references |
| Chromium offline browser QA | 28 | 0 | Chromium 141.0.7390.0 / Playwright 1.62.1, Linux headless; built HTML via file:// |
| **Total local automated assertions** | **92** | **0** | `npm test`; `OPM_BROWSERS=chromium npm run test:ui` |

Browser QA runs with network offline and checks all three campaign missions, invalid submissions, three challenge progression, Mission 03 conceptual gating, Mouse Drag, fine Keyboard alignment, Slider sync, Center, Hints, Replay, Free Practice, Fixed Loss, offline refresh/save restore, blocked Local Storage, Reset confirmation, desktop/mobile viewport overflow, real Chromium touch protocol events, zero HTTP runtime requests and zero page errors. Detailed local evidence: `browser-qa-results.json`. Screenshots are internal QA, not release deliverables.

Visual review: desktop 1440×1080 and mobile 390×844. Runtime uses OS fonts; Korean glyph support was added to the **QA host only** for visual review, with no bundled/runtime web-font dependency.

Release verification: `python3 scripts/release.py --verify` checks exact HTML/docs bytes, ZIP names/CRC and all SHA-256 hashes. This is a separate integrity check, not inflated into the assertion total.

## CI and platform scope

CI is configured for core checks plus network-blocked Chromium, Firefox and WebKit jobs. Chromium/Firefox use native offline emulation. WebKit uses HTTP(S) interception with abort because native offline emulation produced an internal error navigating a file:// URL in this CI runner. This verifies no runtime network dependency but is not a WebKit native-offline-emulation PASS. Drag tests allow up to two CSS pixels of browser pointer quantization while requiring exact Slider/display/analytical-Loss agreement; fine-keyboard checks require an exact relative 0.01 µm step. Their actual execution results must be reported from GitHub Actions after publication. They are not pre-counted as PASS in the local totals above. No Edge-branded, Safari-branded, Windows, Android, iOS or physical touch-device test was executed locally. Chromium DevTools touch testing verifies touch input handling, not performance on a real phone.

## Known limitations

- Simplified circular scalar Gaussian X/Y model only; no full-vector EM, reflection, polarization, gap, angle, evanescent, propagation, thermal, adhesive or yield predictions.
- Local file storage varies with browser/profile/path. Completion/best values persist; an unfinished experiment restarts. Blocked storage falls back to the current session and shows a status.
- Fixed Loss in Free Practice is a declared dB assumption. Comparison table explicitly uses Fixed Loss = 0, while the active scene/Total Loss and tolerance disk include the current Fixed Loss.
- Mission thresholds/radii are educational assumptions. Mission 03 is scored for concept understanding; its stored Loss is the selected design's actual result, not a fabricated low-loss requirement.
- No measured process calibration, manufacturing timing, hardware-device compatibility certification or user learning-study evidence.
- Release Candidate pending user review; no main merge or tagged production release.
