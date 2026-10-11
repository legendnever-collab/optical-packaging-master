# v0.6 RC — Regression / Browser / Offline Evidence

## Local execution — 2026-10-11

| Suite | PASS | FAIL | Scope |
| --- | ---: | ---: | --- |
| Spatial Physics | 29 | 0 | Unchanged reference/stability/field integral |
| Angular Physics | 19 | 0 | Unchanged phase tilt / independent complex integral |
| Assembly statistics | 28 | 0 | Unchanged seed/moments/bias/zero sigma/Yield/P95/CI/ranking |
| Gaussian propagation/interfaces | 26 | 0 | Unchanged q/ABCD/4f/size/curvature/gap/fold |
| Mission/scoring | 21 | 0 | Ten retained success policies and wrong choices |
| Campaign persistence | 29 | 0 | Schema 4, v1–v5 records, badges/designs/Builder/future/restricted storage |
| Build | 7 | 0 | Versioned single HTML, classic parse, determinism and no assets |
| Legacy scene/playback | 13 | 0 | Reversible mappings, actual power/row stages/cancel |
| New Challenge model/save | 34 | 0 | Geometry/sequence/Lock/rework/calibration/moments/shared samples/independent seed/cost/qualify/raw/residual/restore/invalid/future |
| **Node total** | **206** | **0** | Node 24.19.0, skipped/cancelled=0 |
| Chromium offline UI | 123 | 0 | Chromium 141.0.7390.0 / Playwright 1.62.1 Linux file:// |
| **Local total** | **329** | **0** | Actual checks; ZIP verifier separately reported |

v0.5 baseline had 172 Node and 90 Chromium tests. Optical/statistical core files and all 102 associated reference tests remain byte-identical. No legacy mission threshold, content version or schema changed; only current gameVersion and build artifact version changed.

## Actual coverage

Full ten-mission Campaign is played including wrong-choice rejection, diagnosis concealment, old hardware/instrument pointer/keyboard/touch, q/Lens refocus, seeded manufacturing, factory inspection and independent Builder autosave. Actual previous v0.2/v0.3/v0.4/v0.5 standalone files are opened before the new file; v0.5 ten badges, scores, designs and q draft survive. Unknown campaign formats are preserved.

New Challenge starts without campaign unlocks. Browser verifies oversized Fixture rejection, real inventory mouse Drop, Carrier/PIC collision and keyboard X-to-optical synchronization. Locked inputs reject motion without introducing optical loss; failed Test, charged Unlock, actual Facet mouse drag, shared sliders and two successive fine keyboard steps are exercised. Economy Prototype success/72% production failure, Precision Passive qualification, actual Active Before/Final states, 28 counted reworks, three same-seed snapshots and high-yield budget rejection are checked against fixed reference results. Visible delivery, learning debrief and independent Lock/Test/run/award save restore are verified. Explicit Challenge reset preserves campaign bytes.

Seven emulated CDP Touch assertions are Chromium-only: legacy physical Fiber/XY/Angular/Receiver/Lens, new Carrier inventory and Facet alignment. Mobile 390×844 checks scene-first placement/no horizontal overflow. Desktop 1440×1080, reduced/normal motion and in-flight cancellation are exercised. Blocked storage permits manufacturing; future challenge schema preserves original bytes. Isolated preview reads/writes neither existing save key. All contexts have **0 runtime HTTP(S) requests / 0 critical page errors** under Chromium native offline.

Ten v0.6 screenshots cover preserved campaign and new failed-package/qualified-order/comparison/mobile content; Korean QA-host fonts are not bundled into runtime. Actual screenshot inspection reviewed scene/control/model labels. Development checks fixed the screenshot selector and version expectation, and strengthened drop/keyboard checks using actual installed coordinates. Complete final local suite was rerun.

## CI / archive verification

CI uses Node 22, exact deterministic rebuild comparison for both HTML exports, source/SHA256/CRC ZIP verification and actual Chromium/Firefox/WebKit file campaigns. Completed CI counts and versions are reported in the PR after execution; do not infer them from local checks. Chromium/Firefox use native offline emulation; WebKit aborts HTTP(S), since native offline prevents its file navigation on the runner. Its network independence is tested but native-offline navigation is not claimed. Seven Touch assertions are Chromium-only.

`python3 scripts/release.py --verify` validates exact HTML/docs/QA/screenshots and SHA256SUMS against committed files. v0.1–v0.5 HTML/ZIP bytes are unchanged. The isolated final-source preview supports legacy 01/05/09 and the new Challenge with null storage; first implementation is preserved in a phase commit. No company attachment or credential bytes are distributed.

## Known limitations / unverified

- Declared rectangular Carrier/PIC fit only: axis-aligned inflated clearance, margin and Slot. No arbitrary solids/3D collision, full assembly kinematics, finite optics, stiffness/contact/thermal/bonding.
- Challenge Z is mechanical only, no common-plane Gap optics. q/ABCD and X/Y/phase tilt remain separate. Active correction is assumed residual performance, not a search/metrology solver.
- Time/Credits/process inputs are teaching assumptions, not real supplier pricing/cycle measurement. Time is serial sum, not a discrete-event parallel production scheduler. Playback previews ten final samples and reports full rework counts separately.
- Qualification is observed Prototype +100-unit order within budgets; true industrial Yield is not certified. Candidate comparison uses shared samples and adaptive optimization needs further held-out/calibrated validation.
- file:// storage depends on profile/path and separate keys; blocked/future storage uses session play. Campaign partial missions restart while Challenge valid draft restores. Preview never persists.
- Real phones/tablets, branded Safari/Edge, Windows/macOS/iOS/Android are unverified. CDP Touch is emulation. Fine labels in mobile SVG may require sliders/keyboard.
- No human first-play timing, enjoyment, educational-effect or audio-listener assessment. This remains an unmerged Release Candidate.
