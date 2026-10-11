# Roadmap

| Version / status | Theme | Required work |
| --- | --- | --- |
| v0.1 implemented RC | First Light | Scalar spatial Gaussian overlap; initial three missions |
| v0.2 implemented RC | Guided Mode Trade-off + Angular Alignment | Redesigned Mission 03; Mission 04; common-plane paraxial phase tilt; two direction components |
| Next alignment increment — planned | Gap / Diffraction and 6-DOF vocabulary | Longitudinal propagation, curvature/walk-off, explicit mechanical axis conventions; circular-mode roll has no independent effect |
| v0.3 — planned | Multi-channel FAU | Channel positions, pitch/rotation, uniformity and worst-channel loss |
| v0.4 — planned | Bonding / Thermal Reliability | Evidence-backed adhesive/thermal displacement assumptions |
| v0.5 — planned | Monte Carlo Yield / Economics | Seeded distributions, measurable acceptance and sampling uncertainty |
| v0.6 — planned | Photonic Substrate / Evanescent Coupling | Separate coupled-mode or calibrated field model; do not reuse Gaussian butt-overlap formula |
| v0.7+ — planned | Advanced Architectures | Explainable design comparison and engineering sandbox |

The original v0.2 proposal included Full 6-DOF. This increment deliberately implements X/Y plus θx/θy and a defined wavelength, with Gap and Roll left for a separately validated extension. Next: user playtest the revised Mission 03/04, then add longitudinal Gap with beam propagation rather than an arbitrary dB penalty.
