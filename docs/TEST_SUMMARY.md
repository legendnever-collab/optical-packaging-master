# v0.7.0 Final UX — executed evidence

## Local execution — 2026-10-11

| Suite | PASS | FAIL | Evidence |
| --- | ---: | ---: | --- |
| Node physics/gameplay/persistence/build | 263 | 0 | Node 24.19.0; no skipped/cancelled tests |
| Retained Engineering Lab / v0.6 Challenge UI | 123 | 0 | Chromium 141.0.7390.0, Playwright 1.62.1, Linux file:// |
| Connected six-chapter campaign + Final UX | 81 | 0 | Same engine; all six chapters, first-four preview and 27 UX checks |
| **Total local assertions** | **467** | **0** | Actual automated execution; no human study |

The final HTML SHA256 is recorded in both QA JSON files. Those hashes match the committed final HTML; reports are not results from an earlier intermediate build. Seventeen v0.7 screenshots include all six new chapters, mobile and the retained Lab. Actual screenshot inspection reviewed physical objects, mode labels, folded envelope, mobile layout and completion presentation.

## Physics and model coverage

The original circular-overlap, angular, assembly and q/ABCD solver files remain byte-identical to the verified v0.6 baseline. The existing regression foundation is retained. New 2D tests verify normalized fields, circular reduction, zero offset, mismatch, arbitrary rotation, independent numerical complex-field integration, curvature/offset/tilt cross effects, positive-definite profiles and domain rejection. Relay tests cover q propagation, affine ray transforms, decentered lenses, receiver-frame perturbations and unfolded ideal-fold equivalence.

New campaign tests cover the intentional bare-Si mismatch diagnosis, SSC improvement with inadequate passive yield, identical seeded comparison samples, package and working-distance constraints, precision datum and folded relay qualification, optical handoff, finite manufacturing geometry, lock/test/unlock/rework, independent factory seed, cost/time and qualification. Precision/economy fixture errors remain distinct. Active factory rows retain raw-before, corrected-first and final states. Prototype alignment is charged once per alignment session.

Persistence checks include legacy-byte preservation, migration, invalid and future data, blocked storage, typed mode/factory validation, frozen-value recalculation, completed-chapter replay, compatible lens retention after SSC changes, and archived manufacturing results after a new optical design is transferred.

## Browser and offline coverage

Automated play completes all six connected chapters, including wrong diagnosis rejection, asymmetry investigation, SSC nominal-versus-yield failure, lens installation, compact-package fold and angular trade-off, freeze/handoff, prototype lock/test and qualified production. Mouse inventory drop and lens drag, keyboard source/carrier motion, mobile CDP Touch, backup/paste/refresh and Legacy Lab navigation are executed. The preserved first-four playable preview is completed separately and preserves existing save bytes.

Retained UI checks execute the ten legacy missions and independent Assemble/Lock/Test challenge, previous save migration, actual optical/mechanical pointer actions, active/passive correction, rework, budget rejection and previews. All checked game contexts have zero runtime HTTP assets and zero critical page errors under Chromium offline execution. Mobile viewport is emulation, not a real-device result.

## CI and release verification

The PR workflow runs Node 22, deterministic final/vertical HTML comparisons, ZIP CRC/source/SHA256 verification and separate Chromium/Firefox/WebKit campaigns. Local Firefox/WebKit downloads failed in this environment; these engines are **not locally passed**. PR check results provide the actual remote outcomes after archive creation. Chromium/Firefox use native offline emulation; WebKit blocks HTTP(S) because native offline interferes with file navigation. CDP Touch assertions apply only to Chromium.

`python3 scripts/release.py --verify` compares every archived HTML, document, screenshot and modular-source byte with its source and checks SHA256SUMS. A fixed baseline hash fixture checks earlier v0.1–v0.6 release bytes. The first-four checkpoint remains preserved; the vertical preview uses final source without persistence. No attached company reference document or credential is distributed.

## Explicit limitations and remaining validation

- SSC effective radii and insertion losses are declared educational table assumptions. No validated electromagnetic converter surrogate, tip-width-to-loss model or foundry-specific prediction is claimed. Public reference papers support mechanisms, not those numeric presets. This remains a physics acceptance gap for a production-calibrated converter model.
- Bare silicon is an illustrative scalar elliptical Gaussian, not a validated vector mode dataset. Guided-mode non-Gaussian structure, polarization, facet reflection and real cladding are outside this model.
- Relay uses paraxial scalar Gaussian propagation, affine rays and ideal unfolded mirrors. It does not model aberrations, clipping, off-axis mirror performance or full reflective geometry. Permanent optical modules are assumed prealigned; perturbations are explicitly included as declared manufacturing inputs.
- Process distributions, residual active alignment, component costs and serial cycle time are teaching assumptions. Observed 100-unit qualification does not certify real industrial yield. Candidate selection uses shared samples and production uses an independent seed.
- Manufacturing Z is mechanical within the scoped fixed optical path. Carrier/fixture collision uses finite axis-aligned clearance geometry, not arbitrary 3D solids, adhesive cure or thermal mechanics.
- Real phones/tablets, branded Safari/Edge, Windows/macOS/iOS/Android, human learning, enjoyment and first-play usability have not been tested. No completed human study is reported.
- Authoritative remote recovery: v0.7 b1fb5df, main v0.5 80fe758. The identical local first-four phase 3638a86 plus completed integration cd1dae9 were recovered; v0.6 PR #6 was then merged at 2ceb71e94f867f76905eaa57a4a762d684f9983a after its final-head CI SUCCESS. The final v0.7 PR is based on that updated main. The user explicitly approved merge after regression/CI.

## Final UX — scope and executed coverage

**Unchanged source:** `git diff cd1dae9 -- src/game src/physics` is empty. This verifies preservation relative to the recovered complete v0.7 baseline; it does not replace regression execution. Prior v0.1–v0.6 release hashes are independently checked by the Node build test. The pre-UX v0.7 RC artifacts are archived in dist/archive.

**Executed regression:** 263 Node tests cover Gaussian / elliptical overlap, curved-field interface, converter references, q/ABCD propagation, Monte Carlo / manufacturing, Lens / Mirror, assembly lock/test and persistence/migration. 123 Chromium Engineering Lab / Assembly checks and 81 connected Campaign / UX checks run the final built file. Both report files carry that file's actual SHA256.

**Guidance:** Throughout the full Chapter 1–6 journey, the click/select/slider test helpers assert a nonempty action, one existing enabled target and exactly one highlight, or zero highlights during manufacturing. The 27 added UX checks cover first action, inspection→XY→angle→completion, replacement after chapter transition, replay state, all six completed chapters, diagnosis after replay edits, sequential Lens inventory and Factory Install/Align/Lock/Test states. The Optional Lab and independent Assembly are exercised as well. Non-forcing choice groups remain selectable.

**Precision:** Actual X/Y and θ buttons, button arithmetic/round-trip, saved factory calibration, immediate computed Loss/Power, positive/negative bounds, disabled/locked synthetic-input rejection, keyboard and mouse drag on the same state, actual CDP touch drag plus Playwright touchscreen taps. Lens/Receiver ±1 µm alter q propagation. 44 px mobile buttons, no horizontal overflow, visibility of current action, Reduced Motion and no scroll jump during edits are asserted.

**Offline:** zero runtime HTTP(S) requests / critical page errors in exercised contexts. Local Chromium 141.0.7390.0 / Playwright 1.62.1 / Node 24.19.0 on Linux. Mobile is emulation. Linux has no Korean font installed, so local PNG glyph rendering cannot establish Korean typography; Korean DOM strings and responsive layout are checked, and the downloadable HTML uses the unchanged OS font stack. Remote Firefox/WebKit results must come from final-head CI, not from local unexecuted runs.

## Cross-browser correction

Final-head PR CI run 38131852924 passed Core and Chromium but found two Drag assertions failing in Firefox/WebKit. The SVG handle's initial Focus used default scrolling. Drag-start Focus now explicitly uses `preventScroll: true`, matching redraw/keyboard behavior; the UX test asserts that pointerdown preserves scrollY before checking actual X/Y movement. Optional Lab guidance also advances from Experiment to Commit and from ten-sample observation to Statistics/Inspection using the existing session flags. Models and acceptance thresholds are unchanged. Final local reports are regenerated after this correction; successful remote final-head CI is still required before merge.
