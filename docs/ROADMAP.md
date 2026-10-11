# Roadmap — planned, not implemented

| Version | Proposed theme | Required model work |
| --- | --- | --- |
| v0.2 | 6-DOF Alignment, Angular Sensitivity | Explicit axis/angle conventions, wavelength, phase and gap; avoid a misleading scalar penalty |
| v0.3 | Multi-channel FAU | Channel coordinates, pitch/rotation errors, loss distribution and worst-channel constraints |
| v0.4 | Bonding and Thermal Reliability | Adhesive/thermal displacement assumptions, before/after alignment and evidence-backed limitations |
| v0.5 | Monte Carlo Yield and Economics | Seeded process distributions, measurable acceptance and sampling uncertainty |
| v0.6 | Photonic Substrate and Evanescent Coupling | Separate physics/model validity and coupled-mode or calibrated data; do not reuse butt-overlap equation |
| v0.7+ | Advanced Assembly Architectures | Explainable scenario comparison and engineering sandbox |

Recommended next increment: add angular X/Y tilt first with a clear wavelength/phase model, then add longitudinal gap/diffraction. Introduce a 6-DOF vocabulary progressively rather than activating six independent sliders at once. Validate the first lateral-only model with user playtesting before expanding the interface.
