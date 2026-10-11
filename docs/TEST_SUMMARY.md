# v0.2.0 Release Candidate — Test Summary

## Executed locally

| Suite | PASS | FAIL | Evidence |
| --- | ---: | ---: | --- |
| Spatial Physics | 29 | 0 | Existing v0.1 reference and numerical quadrature regression |
| Angular Physics | 19 | 0 | Formula reference, zero-tilt compatibility, symmetry/scaling, budget, invalid/extreme inputs and independent complex-field quadrature |
| Gameplay / scoring | 23 | 0 | Guided sample gating, physical design acceptance, Angular observation gate, progression/retry/score |
| Persistence | 16 | 0 | Schema 1→2 migration, four missions, blocked/quota/malformed and future-schema protection |
| Build | 7 | 0 | Deterministic inline classic script, no runtime assets, accessible controls |
| Chromium offline UI | 41 | 0 | Chromium 141.0.7390.0 / Playwright 1.62.1; Linux headless; actual file:// HTML |
| **Local total** | **135** | **0** | Node 24.19.0 and Chromium QA |

UI QA exercises all four missions, wrong physical design rejection, three Mode card samples in each fixed-condition stage, Center preserving Angular Loss, actual angle Mouse/Touch Drag, Slider reference agreement, fine Keyboard adjustment, blocked storage, real v0.1-file→v0.2-file migration, unknown-schema preservation, offline refresh and mobile/desktop overflow. Network disabled during local Chromium QA; zero HTTP(S) runtime requests and zero page errors. Detailed local results: `browser-qa-results.json`. Screenshots are internal QA evidence; Korean font installed on QA host only, never a runtime dependency.

Release integrity is checked separately using `python3 scripts/release.py --verify`: exact archived HTML/docs bytes, ZIP names/CRC and SHA-256 manifest. It is not added to assertion counts.

## CI scope

CI executes these core checks plus three real local-file Browser jobs. Actual CI outcomes are reported after publication; they are not pre-counted in local results. Chromium/Firefox use native offline emulation. WebKit uses HTTP(S) interception/abort because native-offline mode prevents file navigation in the runner. Thus WebKit network independence is tested, but native WebKit offline emulation is not claimed PASS. Mouse drag allows two CSS pixels of input quantization and angle drag allows a small raster-coordinate tolerance, with exact shared Slider/display state. Chromium CDP Touch tests exercise genuine Touch events, not a real phone.

## Limitations

- No Windows/Edge-branded/Safari-branded/iOS/Android or physical device execution locally; browser-engine results do not certify these platforms.
- X/Y + two Tilt components only; common-plane circular scalar paraxial assumptions. No Full 6-DOF, Gap, beam propagation/walk-off, refraction, Fresnel, polarization or reliability/yield.
- Local Storage origin behavior varies by browser/profile/path. Tested engines permit same-profile file upgrade; copying HTML elsewhere does not guarantee identical storage. In-progress sessions restart on reload.
- Educational Radius/Threshold settings; no measured manufacturing calibration or user-learning study. User evaluation of the redesigned guided missions remains necessary.
- RC for review; no main Merge or production Tag.
