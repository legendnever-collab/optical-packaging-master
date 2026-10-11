# v0.4.0 Release Candidate — Optical Interface Builder

v0.3 PR #3 was merged with user approval at `e66573f81fbda98352f30f121c0ddef549ec2544`. v0.4 is developed on `feature/v0.4-optical-interface-builder`; it is a separate RC for review, not an approved main merge or formal tag.

- Preserved the seven v0.3 missions, spatial/angular/statistical engines and offline artifacts.
- Added Chapter 3: Catch the Focus, Bridge the Gap, Fit the Package. Move Receiver Z, refocus a thin lens, then combine mode expansion and folded space constraints.
- Added UI-independent geometric Gaussian q / ABCD propagation and coaxial complex-field overlap including size and curvature. Lens/mirror fixed losses are separately assumed/displayed.
- Added direct Mouse/Touch/keyboard Receiver/Lens/Mirror handles, actual unfolded beam envelope, local beam probe and centerline route view.
- Independent Interface Builder supports source/target waist, incoming waist location, wavelength, gap, 0–2 lenses and ideal fold; saves the last configuration.
- Schema 4 preserves v0.3 badges, old scores/unlocks and factory designs/evaluation conditions. New missions have separate v4 content records.
- Offline v0.4 HTML and deterministic RC ZIP with SHA-256 manifest. No external runtime assets or attachment/company-file redistribution.

## Boundaries

Coaxial paraxial scalar optics in one homogeneous medium, ideal lenses and ideal unfolded fold only. The original lateral/angular engine is not multiplied into propagation. No aperture, aberration, refraction, lens tilt/decenter/walk-off, component bodies/clearance, true vector reflection or whole-system Yield. Mission 10 checks three Receiver positions, not a probability or every position in a continuous range. Fixed losses, package centerline limits and scenario inputs are learning assumptions. Browser engine QA is not human learning-effect testing or physical-device certification.

See TEST_SUMMARY.md for actual counts and unexecuted work, PHYSICS_MODEL.md for equations/conventions and GAMEPLAY_AUDIT.md for mission differentiation.
