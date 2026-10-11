# Physical Scene Architecture & Coordinate Mapping — v0.5

## Data flow

Existing mission / design / inspection state → existing optical solver → sceneSnapshot (explicit visibility + computed results) → PhysicalScene / ComponentRenderer / OpticalLayer. ComponentInteraction maps Pointer/Keyboard positions back through the camera and route adapters into existing moveTo / InterfaceLab.move / InterfaceLab.update. Physics and scoring never consume SVG pixels.

Modules:

| Module | Responsibility |
| --- | --- |
| src/scene/coordinates.js | Reversible transverse/route/camera mapping, declared fixed-loss power for path segments |
| src/ui/physical-scene.js | One Hardware / Optical / Engineering / Inspection scene, selection, camera, field overlay, achievement |
| src/ui/component-renderer.js | Fiber Core/Facet, PIC Port/Waveguide/Chip, Lens/Mount, Mirror, Receiver and Mechanical Base artwork |
| src/ui/component-interaction.js | Pointer capture, offset-preserving Fiber drag, longitudinal handles, keyboard, lens inventory drop, camera pan |
| src/ui/optical-layer.js | Actual-power path pulses and sampled q envelope; pointer-transparent fields |
| src/ui/factory-playback.js | Real row PLACE → TEST → SORT stages; cancellation token, first ten only, no RNG or solver |
| src/main.js | Authoritative session + solver state, view adapter, full report dashboards and actual failed row inspection |

## Coordinates

SVG viewBox is 720×430 display units. Client pointer maps through inverse getScreenCTM, then inverse camera transform before physical conversion. Camera: p_view=(360,210)+zoom*(p_world−(360,210))+(panX,panY); inverse is exact. Zoom/Pan do not change any optical input. Background Pan is opt-in; component drag remains a physical edit. Exploded lifts body artwork 18 display units; it does not change alignment, gap or lens z.

Transverse facet reference=(455,220); 16 display px/µm, +X right, +Y up. Fiber drag applies the pointer delta to the original dx/dy, so picking the body instead of its facet does not jump the state. Existing ±6 µm limits and 0.01 rounding remain in main. Keyboard uses Arrow=0.1 µm, Shift+Arrow=0.01. The PIC Port shares the reference point. Optical Overlay radii use the same 16 display units per µm as XY centres (Gaussian intensity is exp[−2r²/w²]); physical body dimensions and apparent longitudinal gap are conceptual, not a ray geometry or package clearance model.

Straight route source=(200,210), scale=380/displayLength. Mission 08 displayLength=900 µm so Receiver movement visibly changes its location. Builder displayLength=2500; fixed Mission 09 length=1000. Folded route source=(220,110), scale=370/displayLength: before zf, (x+z*k,y); after zf, (x+zf*k,y+(z−zf)*k). Mission 10 displayLength=1800. The pointer inverse selects the nearest leg and clamps to [0,L]. Existing InterfaceLab then checks component order/domain and retains last valid state on rejection. Near-corner selection has a small hit tolerance; Keyboard/slider remains precise.

Fiber is not an XY control in the coaxial builder. Receiver is movable in Mission 08, Lens A in 09, Lens B/Mirror in 10; Builder supports all valid longitudinal edits. Camera stays separate. Lens keyboard uses 10 µm or Shift 1 µm. Install by inventory Pointer Drag & Drop, or labeled button for keyboard/small Touch screens. Drop outside the Workbench rejects installation. Inventory z is projected onto the actual path and bounded to its internal supported interval; it adds one actual lens (f=420 initial learning setting) and the engine recomputes q and declared 0.10 dB loss.

Beam radii are sampled at 81 actual z positions with radiusScale=45/max(w(z),wt). Adaptive radial scale is disclosed; it is not the longitudinal or body scale. The old unfolded engineering instrument is retained under Advanced with its original controls. Fold is ideal coordinate routing only. Model labels distinguish Gaussian Phase Tilt (no gap) from Coaxial q (no XY/Tilt combination).

## Concealment, production and access

View switching never bypasses diagnosis: Mission 02 is an opaque sealed Package until inspection provides the relevant evidence; unknown X/Y/Tilt/Radii remain ?. The body is not placed at fictitious disclosed parameters. Mission 04 direction is concealed until Beam Direction inspection.

Factory stage row.state is authoritative; row.result/row.pass are actual seeded evaluations. Produced/GOOD/REJECT dashboard uses the selected full report. The line is a ten-sample preview and clearly separated from the 100–10000 production evaluation. Failed Package selection shows exact X/Y/angles, actual Loss/requirement and dominant loss component. Dominant is explanatory, not proof of a sole cause. Optical View replays the same row's modes. Replay/navigation cancels in-flight stages; no old row mutates another mission.

Main campaign still has ten missions and sequential unlocks. Independent practice cannot update scores. v0.5 retains schema 4 and content versions 3/4; only gameVersion updates. Vertical Slice uses fresh memory-only progress and directly opens 01/05/09. It reads no existing progress and never persists.

## Accessibility / performance / boundaries

Pointer capture supports Mouse/Touch, controls have labels and keyboard paths, status is text plus color. Animated power uses actual Total Efficiency; speed is theatrical. Reduced Motion removes optical travel and skips stage delays while preserving all ten sample states/outcomes. Statistical runs are synchronous bounded 10000-sample evaluations; no per-part animation for large cohorts.

Schematic 2.5D body, mounting and datum dimensions are exaggerated. No component footprint/collision, aperture, clipping, ray-traced reflection, refraction, lens tilt/decenter or new physical assembly solver. Under current model a drawn body overlap is not a calculated defect. SVG uses light and envelope layers with pointer-events:none so visual overlays do not intercept hardware selection. Model validity/physics tests are not industrial validation or human-gameplay evidence.
