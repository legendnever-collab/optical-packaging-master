# Simplified Gaussian Mode Model — v0.1

All lengths: µm. Mode Radius w is the field-amplitude 1/e radius (also the intensity 1/e² radius). MFD = 2w. Normalized real scalar amplitude in a common transverse plane:

u(x,y) = sqrt(2/pi)/w · exp(-(x²+y²)/w²).

Integrating |u|² over the plane gives 1. Coupled power is |∫∫u1(x-dx,y-dy)u2(x,y) dx dy|². Completing the square gives:

η = [2w1w2/(w1²+w2²)]² exp[-2(dx²+dy²)/(w1²+w2²)].

Loverlap = -10 log10(η). Ltotal = Lmismatch + Lalignment + Lfixed.
Lalignment = (20/ln(10)) (dx²+dy²)/(w1²+w2²).
Lfixed is an optional scalar loss in dB, not a simulated interface mechanism. Transmitted power including it is η · 10^(-Lfixed/10). Campaign uses Lfixed = 0; Free Practice exposes it.

The 1 dB tolerance overlay is the radial set of offsets satisfying total Loss <= 1 dB; if even centered modes exceed the target, there is no feasible tolerance region. It is not a one-dimensional ± manufacturing specification.

Identical matched pairs at dx=1.5, dy=0: w=1.5 → 4.342944819 dB; w=2.5 → 1.563460135 dB; w=4 → 0.610726 dB. Centered w1=4,w2=2.5: 0.9260004 dB Mismatch (rounded).

The implementation calculates Loss in log space so intensity underflow does not turn ordinary large Loss into NaN. Extreme valid inputs may produce Infinity Loss and zero power; the display uses ∞, never a false zero. Invalid nonfinite values, nonpositive radii and negative fixed losses throw RangeError. Tests additionally integrate normalized amplitudes numerically, independently of the closed-form implementation.

## Assumptions and boundaries

Ideal circular scalar Gaussian modes, coplanar, same polarization/phase curvature; lateral translation only. The scene is the transverse coupling plane, not a longitudinal ray diagram. Brightness in the mode heatmaps represents each mode's normalized **relative** intensity exp(-2r²/w²); equal center brightness is for legibility and is not absolute W/µm². Power meter and transmission indicator use the actual total transmitted fraction. Colored visual overlap is illustrative; the overlap integral is the authoritative result.

No full-vector EM, Fresnel reflection, polarization, longitudinal gap, angular offset, evanescent coupling, propagation, thermal deformation, adhesive shrinkage or assembly yield. A large matched Mode may tolerate lateral error better, but this does not establish the best real package: mode mismatch, confinement, bend/footprint, interface structure and other unmodeled effects remain. No fictional assembly/yield estimates in v0.1.

## Source grounding

The equation and radius convention are the user's authoritative v0.1 specification, and derived above. For qualitative edge-coupler mode-matching context, the supplied Chrostowski & Hochberg, *Silicon Photonics Design: From Devices to Systems*, section 5.3 (printed pp.184–185), describes Gaussian-beam overlap with a nano-taper and size mismatch. It is not cited as a calibration for mission numbers. Thresholds, radii and offsets are explicit educational settings, not vendor specifications. Attached papers, company reports and textbook bytes are not included in this public repository.
