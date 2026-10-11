# v0.6 Gameplay Changes — Assemble, Lock & Test

Baseline main v0.5 merge `80fe758062745772da7f7f3c5f16a84eaa7b2f56`. All ten missions and optical/statistical engines remain. New independent Assembly Challenge is accessible immediately, with a separate schema-1 save and qualified-order reward.

| Previous experience | New player action | Actual engineering consequence |
| --- | --- | --- |
| Move until power is high | Place finite Carrier in a mechanical Slot | Oversized Fixture / Clearance / Datum fit can fail |
| Always adjustable controls | Lock → Optical Test → paid Unlock | Bad alignment becomes an assembly defect needing rework |
| Nominal result / Yield graph | Choose Passive / per-unit Active / failed-unit rework | Actual first/final states and pass counts recompute |
| Yield alone | Deliver 95+ Good in budget/time | High-Yield design can fail cost budget |
| Campaign progression only | Direct Assembly Challenge and three saved candidate orders | Experiment without changing existing badges |

Setup, prototype calibration and independent manufacturing seeds are separated. Inventory Drag/Touch/Keyboard fallback, actual Facet drag and fine keys, rejection Inspection Before/Final, adaptive next-action guide and visible ORDER DELIVERED provide the playable sequence. Economics are labeled assumptions; the 100-unit order is not industrial yield certification. Full definition: ASSEMBLY_CHALLENGE.md.

## Retained v0.5 transformation history

# v0.5 Gameplay Change Report

Baseline: PR #4 head 3f94233f17a0af010b3ebfb33c1ebef4f666fb81, still open; main e66573f81fbda98352f30f121c0ddef549ec2544. Baseline 159 Node PASS / 0 FAIL. This is a stacked incremental presentation/interaction release; no Mission 11, no new solver.

| Mission | Primary action / new consequence | Existing principle and policy retained |
| --- | --- | --- |
| 01 First Light | Direct Fiber Body/Facet → PIC Port, Light ON and lit completed package | Gaussian XY ≤1 dB |
| 02 Find the Fault | Investigate sealed Package; views cannot reveal unpaid evidence; actual repair changes hardware state | Two inspections per actual fault; correct diagnosis + three repairs |
| 03 Choose Interface | Customer environment / hardware interface cards → test package → confirm | Different small/expanded winners in two environments |
| 04 Aim the Light | Recover direction of already centered Fiber; actual direction and power update after discovery | Common-plane phase tilt ≤0.5 dB; no inferred walk-off |
| 05 Assembly Factory | Real placement/test/sorting line, production dashboard, select REJECT, inspect/replay actual package | Seeded independent process; ten preview then ≥100 stats and failed inspection |
| 06 Make It Tolerant | Improve Mode Design; compare actual produced GOOD/REJECT counts and sensitivity | Fixed process/Waveguide, same 1000 samples, Yield ≥95% |
| 07 Beat the Factory | Qualify stored designs against changed factory conditions; inspect worst package | Common-cohort design comparison, two Yield/P95 approvals |
| 08 Catch the Focus | Move physical Receiver along Z under a fixed display scale | Given converging input, actual q overlap ≤0.5 dB |
| 09 Bridge the Gap | Inventory lens Drop installs real component; select/refocus it; completed link zoom/stamp | One actual lens, q/curvature+0.10 fixed ≤0.5 dB |
| 10 Fit the Package | Choose actual relay and manipulate folded route; inspect package/three probes | Actual q, ideal centerline fold, three finite probe checks |

New interaction changes include lens installation before refocus, actual production stages and physical failed-package replay. Hardware appearance does not replace these actions. Hardware / Optical / Engineering / Inspection share state. Component selection/optional Gaussian overlay, camera pan/zoom/exploded, concise objectives and Advanced details retain old precision tools. Mobile orders objective, actions and Physical Scene before numeric panels and mission navigation.

Quantitative release review records whether each mission has a visible objective, state-derived output, its retained unique policy and actual wrong-condition rejection. Automated scripted play is evidence of functional consistency, not proof of fun or teaching effect. No human novice observation occurred. Next review should observe unprompted First Light, rejection inspection and lens installation before expanding complexity.

The isolated vertical-slice file directly opens 01/05/09 without touching existing storage. It is a direct-access review build generated from the final source; earlier intermediate work is preserved in the phase commit.
