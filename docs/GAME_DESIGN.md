# First Light + Aim the Light — Game Design v0.2

Observe → Manipulate → Diagnose → Improve → Master. Physics Result, Game Score and Engineering Assumptions remain distinct. Start gates manipulation; Retry resets the current experiment while preserving achievements. Navigation unlocks sequentially; Free Practice is always accessible.

| Mission | Conditions / physical PASS | Player action and learning |
| --- | --- | --- |
| 01 Find the Light | Matched radius 2.5 µm; initial (4,−3); Total Loss ≤1 dB | Drag Fiber toward Waveguide; observe centers, power and Loss. Center assistance and a short tutorial. |
| 02 Alignment Challenge | Matched radius 1.5 µm; three offsets; each ≤0.4 dB | Find three alignment optima without Center shortcut. Offset doubling gives four times Alignment Loss in dB. |
| 03 Mode Size Trade-off | Radii 1.5 / 2.5 / 4 µm; three fixed-condition experiments; final Total Loss ≤0.10 dB | Click three cards at a common offset, click three centered cards with fixed Waveguide, then select the matching connection design. |
| 04 Aim the Light | Matched radius 4 µm; initial (2,−1), θx=+3°, θy=−2°; λ₀=1.55 µm, n=1; final ≤0.50 dB | Center first, observe residual Angular Loss, then drag both direction handles until the incoming axes match the blue target axes. |

## Mission 03: no principle-answer quiz

The current instruction, three-step progress and fixed conditions appear **above** the transverse scene. The player sees one task at a time:

1. **Same Offset:** X=1.50 µm, Y=0. Select each card to measure matched pairs: Narrow 4.34 dB, Medium 1.56 dB, Expanded 0.61 dB. Both radii change together; Offset is locked. All three real samples are required to continue.
2. **Center inspection:** X=Y=0, Waveguide radius fixed at 2.50 µm. Measure all three Fiber cards: Narrow 1.09 dB, Medium 0 dB, Expanded 0.93 dB. Centering cannot remove size mismatch.
3. **Connection design:** With the same fixed Waveguide and zero offset, explicitly select a Fiber card and press **이 Mode로 연결**. Only the physically matched Medium achieves ≤0.10 dB. An unsuitable card returns a mismatch diagnosis; completion never invents a lower Loss.

Campaign Offset/Pair/Radius sliders cannot change these controlled conditions. Cards update the actual scene and live measurements. Retry clears sample history and returns to step 1. The general comparison table is retained in Free Practice, labeled Spatial Loss (Tilt and Fixed Loss excluded).

## Mission 04: Position, then Direction

Start enables X/Y adjustment. θ controls initially remain locked. A Center button next to the angular instructions makes the next action accessible on mobile. Center leaves θ unchanged: overlapping intensity patterns still show nonzero Angular Loss. **중심 확인 → 방향 조정 시작** requires Error ≤0.1 µm with Angular Loss above the mission budget. This records the observation, fixes X/Y at zero, and activates θx/θy sliders and two draggable projected side views.

Direction handles use pointer capture for mouse/touch and arrow keys (0.1°, Shift 0.01°). Relative phase tilt is shown through X–Z / Y–Z direction diagrams; angles are exaggerated 4× and explicitly labeled. The central intensity heatmap does not morph under phase-only tilt. Numeric Loss/Power changes are authoritative. A matched-mode comparison shows larger radii are more angular-sensitive at the same Tilt. Zero Tilt assistance is available in Practice only.

## Controls, score and feedback

X/Y range ±6 µm; direction components ±4° in the UI. Sliders, drag and keyboard update the same state. A settled gesture or slider adjustment counts as one Attempt. Free Practice exposes matched/fixed Radius, Tilt, wavelength (1.31 / 1.55 µm), optional Fixed Interface Loss and Center/Zero Tilt. It cannot record campaign scores or unlocks.

All missions score physical PASS using accuracy=600+300 max(0,1−L/target), efficiency=max(0,100−4 max(0,attempts−1)), score=max(0,round(accuracy+efficiency−20 hints)). Mission 02 averages three challenge scores and stores the worst achieved Loss. Mission 03 stores the final design's actual Loss. Scores never alter physics. Best Score and Best Loss can come from different replays.

Progressive Hints and completion summaries cover What Happened, Why, Engineering Principle and Real-world Packaging Connection. Mission 03 contrasts lateral tolerance and mismatch; Mission 04 contrasts position and direction. Text PASS/target status supplements color. Dark instrument styling, responsive panels, keyboard focus and reduced-motion handling are retained.

## Save compatibility

Schema 2 migrates schema 1 completion, best values, tutorial state and last mission. Previously completed Mission 03 remains completed and unlocks Mission 04; the new guided experiment can still be replayed. Unknown future schemas are preserved read-only. Unfinished experiments restart after refresh. File-origin storage availability depends on browser/profile/path; unavailable storage falls back to in-memory play.
