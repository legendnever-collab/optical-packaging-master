# Optical Packaging Master

Interactive Optical Packaging Engineering Game — **v0.1.0 Release Candidate**

Chapter 1 — First Light: Fiber를 직접 움직이며 Optical Coupling, Alignment Loss, Mode Size Trade-off를 익히는 오프라인 게임입니다. 기술 용어는 영어, 안내는 한국어입니다.

## Run the game

Download `dist/optical-packaging-master-v0.1.html` (Raw / Download raw file) or unzip `dist/optical-packaging-master-v0.1-release.zip`, then open the HTML directly in a modern browser. No installation, server, CDN, API key, upload or internet connection is needed. Windows에서 다운로드한 HTML을 더블클릭하면 실행됩니다.

Campaign: Start → Fiber 중심 Drag → Loss 확인 → Complete Mission → Learning Summary → Next. Mouse, Touch, X/Y Sliders, Arrow keys (0.1 µm) and Shift+Arrow (0.01 µm) share one alignment state. A drag gesture or completed slider adjustment counts as one Attempt. Hints explain concepts progressively.

- Mission 01: Find the Light — matched 2.5 µm modes, <=1 dB Total Loss.
- Mission 02: The Alignment Challenge — three starting offsets, 1.5 µm modes, <=0.4 dB each. No Center shortcut. All three must pass.
- Mission 03: Mode Size Trade-off — common-offset comparison of Narrow/Medium/Expanded in matched and fixed-waveguide cases, then two principle questions. Its completion criterion is understanding, not a low-loss threshold.
- Free Practice: always available; Radius/Pair Type/Fixed Interface Loss control. Does not unlock or score campaign missions.

Local Storage saves versioned completion, Personal Best Score/Loss and last selected mission. Reload restores progression, not an unfinished alignment session. Replays preserve Personal Best. Keep the same HTML path, browser and profile; file-origin storage behavior varies. Progress Reset requires confirmation. When storage is blocked or full, current-session gameplay still works.

## Develop and validate

Node >=22 and Python >=3.10:

```bash
npm test
npm run build
npm ci
npx playwright install --with-deps chromium firefox webkit
npm run test:ui
npm run release
```

Physics, game state and persistence tests/build use Node built-ins, no runtime dependency. Playwright is a pinned development-only dependency. Source `index.html` uses ES modules and can be served by `python3 -m http.server`; only the exported `dist` HTML is intended for `file://` use. Build deterministically inlines CSS/modules as a classic script; never hand-edit the deployment HTML.

See [Test Summary](docs/TEST_SUMMARY.md), [Physics Model](docs/PHYSICS_MODEL.md), [Game Design](docs/GAME_DESIGN.md), [Roadmap](docs/ROADMAP.md) and [Release Notes](docs/RELEASE_NOTES.md). CI runs unit/game/build tests, offline browser checks and release-package verification. Passing CI does not certify every installed browser/version or physical touch device.

## Engineering boundaries

Ideal scalar circular Gaussian transverse overlap only. Radius = field-amplitude 1/e radius. Mode Mismatch, Alignment, Fixed and Total Loss are separate. Fixed Loss is an educational scalar assumption. Color overlap is illustrative; computed field overlap controls the power indicator. Game Score cannot change a Physics Result. Thresholds are educational assumptions, not product specifications.

Full-vector EM, reflection, polarization, gap, angle, evanescent coupling, propagation, bonding, thermal and yield are unmodeled in v0.1. Large matched modes are more tolerant to lateral translation; no claim that they are universally best.

## Baseline and release policy

Initial `main` verified at `1a4608d3e9700a6d19f51bdeb7ec1dfa1a2c1716` with README only. Work is on `feature/v0.1-first-light`. No merge without user approval. Attached source documents and company information are not redistributed. This is a Release Candidate for review, not a tagged production release.
