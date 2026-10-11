# First Light — Game Design v0.1

The player is an Optical Packaging Engineer in an instrument-style lab. Core loop: Observe → Manipulate → Simulate → Fail → Diagnose → Improve → Master. Physics is continuously recalculated; Start gates manipulation, Complete validates the result. Retry resets the session, not campaign accomplishments.

| Mission | Model and goal | Learning | Reward |
| --- | --- | --- | --- |
| 01 Find the Light | w1=w2=2.5 µm; initial (4,-3); <=1 dB | Mode centers and lateral overlap | Accuracy + efficient adjustments |
| 02 Alignment Challenge | w1=w2=1.5; (3,-2),(-2.6,2.2),(2.8,2.7); <=0.4 dB each | Quadratic dB sensitivity; precise search | Mean score of 3 challenges; stored Loss = worst of 3 |
| 03 Mode Size Trade-off | Radii 1.5,2.5,4; matched pairs versus fixed w2=2.5 | Wider tolerance versus mismatch | 1000 minus 20 per Hint; stored Loss = selected design at completion |

## Interaction and progression

Mouse/touch grabs the movable Fiber near its center. Drag preserves the grab offset to avoid snapping; pointer capture permits a continuous drag beyond the scene boundary, with ±6 µm physical clamps. Up, cancel and lost capture settle one gesture. Two sliders and keyboard share this physical state. Arrow=0.1 µm, Shift+Arrow=0.01 µm. Resize rescales the coordinate plane without changing physics. Only supported transverse translation is manipulable.

Mission 01 has a skippable, action-driven 20-second tutorial and Center assistance. Mission 02 removes Center and presents three distinct starts; invalid submissions give diagnosis, not completion. There is a target rather than a hard attempt limit so novices can keep learning. Attempts improve the score but never alter a computed Loss. All campaign missions are replayable after unlock. Practice is accessible from a clean save and never unlocks missions.

Mission 03 displays two simultaneous columns calculated at exactly the same live offset: all three matched pairs and all three fixed-waveguide pairs. The comparison table excludes Fixed Interface Loss, explicitly labeled. Capture at >=0.5 µm Error records six values in session and identifies that common offset. Two questions separately test largest matched lateral tolerance and lowest centered fixed-WG mismatch. Mode/Pair selectors update the active scene. The dashed amber disk shows the **active** design's total 1 dB region, including Fixed Loss in practice. If the target is infeasible the disk disappears.

## Scoring

M01/M02: accuracy=600+300 max(0,1-L/target); efficiency=max(0,100-4 max(0,attempts-1)); score=max(0,round(accuracy+efficiency-20 hints)). Scores range 0–1000 and are only awarded after an actual PASS. M02 averages the three challenge scores. M03 scores conceptual completion (1000 minus 20 per hint) independently of Loss; this is labeled a comparison mission. Best Score and Best Loss may come from different replays.

## UI and learning

Dark navy/charcoal, cyan Fiber and blue target, restrained amber Alignment indicator. Central scene is a transverse intensity plane with radius rings, center markers, axes and connecting offset line. Relative per-mode intensity is Gaussian; numeric output is authoritative. Transmission pulses/track use total transmitted fraction. A live PASS/TARGET NOT MET text accompanies color. No decorative full-screen effects.

Desktop: Mission/Brief left, central scene/actions, parameters/measurement right. Tablet condenses navigation; mobile stacks panels. Progressive Hint and the four completion sections explain what happened, why, the principle and its real packaging connection. Engineering Assumptions are available in a dialog; its close control, keyboard and Escape remain available.

## Persistence boundary

Schema 1 stores completions, best values, tutorial seen, and last campaign mission. An unfinished experiment restarts at its initial conditions on reload. Saves are opportunistic with an honest status; restricted environments play in memory. Future versions require explicit schema migration. No setup, account, upload or network is required.
