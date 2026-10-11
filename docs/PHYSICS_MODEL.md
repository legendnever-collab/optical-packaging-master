# Simplified Gaussian Mode Model — v0.2

## Spatial overlap (unchanged from v0.1)

All lengths are µm. Mode Radius w is field-amplitude 1/e (intensity 1/e²); MFD=2w. Normalized scalar amplitude in a common transverse plane:

u(x,y) = sqrt(2/pi)/w · exp[−(x²+y²)/w²], with ∫∫|u|² dx dy=1.

For offsets dx,dy and circular radii w1,w2:

ηspatial = [2w1w2/(w1²+w2²)]² exp[−2(dx²+dy²)/(w1²+w2²)].

Spatial Loss = Mismatch Loss + Alignment Loss, with Alignment Loss = (20/ln 10)(dx²+dy²)/(w1²+w2²).

Matched pairs at dx=1.5,dy=0: radius 1.5 →4.342944819 dB; radius 2.5 →1.563460135 dB; radius 4 →0.610726615 dB. Centered Fiber radius 4 / Waveguide 2.5 →0.9260004 dB Mismatch. Centered identical modes give η=1 and L=0.

## Angular extension: common-plane phase tilt

This is a separately derived scalar **paraxial relative phase-tilt** model. It is not a geometric projection or a Fresnel/refraction simulation. Introduce phase exp[i(qx x+qy y)] into one field, with qj = k θj, k=2πn/λ₀ and angles in radians. θx means relative beam slope toward X; θy toward Y. These are direction components, not a mechanical rotation-axis naming convention. Inputs/display use degrees; the engine converts to radians. λ₀ is vacuum wavelength; n is the common homogeneous medium's refractive index, **not** the Waveguide effective index. Campaign uses λ₀=1.55 µm, n=1 (Air).

Coupled power is:

η = |∫∫u1(x−dx,y−dy)u2(x,y) exp[i(qx x+qy y)] dx dy|².

Completing the square with A=1/w1²+1/w2² gives a complex Gaussian integral. The shifted center contributes a constant phase; its modulus is one. The magnitude therefore factorizes in this ideal model:

η = ηspatial × ηangular,

ηangular = exp[−w1²w2²(qx²+qy²)/(2(w1²+w2²))].

For matched radius w this simplifies to exp[−(πnw/λ₀)²(θx²+θy²)]. Angular Loss = −10 log10(ηangular) = (10/ln 10) w1²w2²(qx²+qy²)/(2(w1²+w2²)).

Combined Mode Overlap Loss = Mismatch + Alignment + Angular. Total Coupling Loss = Mode Overlap + Fixed Interface Loss. Total transmitted fraction = η ×10^(−Lfixed/10). Efficiency displays Mode Overlap; Power displays total including Fixed Loss. Fixed Loss is a declared dB assumption, not a simulated interface mechanism. Campaign uses zero Fixed Loss.

For matched modes, doubling angle, radius or medium index quadruples Angular Loss in dB; doubling wavelength divides it by four. Larger matched modes tolerate lateral displacement better but angular tilt worse. This does not establish a universally optimal package.

## Tolerance and numerical behavior

The dashed scene region is the **spatial-only** radial X/Y set with ≤1 dB including Fixed Loss; Tilt is explicitly excluded. An infeasible centered target returns no region. Angular tolerance helper independently solves a specified Angular Loss budget for radial sqrt(θx²+θy²).

Spatial calculations use log/scaled forms; angular effective radius uses min(w1,w2)/sqrt(1+[min/max]²) to avoid squaring raw radii; its exponent and tolerance use logarithms to avoid intermediate wavelength/index overflow. Underflow of power does not erase analytically computed dB Loss. Extreme finite inputs may yield zero power and Infinity Loss, never a fabricated zero. Reject nonfinite values, nonpositive radii/wavelength/index, negative Fixed Loss, and angular components outside ±5°. UI restricts each component to ±4° to keep the small-angle scope explicit; combined tilt remains a paraxial educational approximation, not a calibrated accuracy guarantee.

Zero tilt retains v0.1 results exactly. Tests check angular symmetry, reference values, independent loss decomposition, scaling, tolerance and extreme inputs. Independent midpoint quadrature integrates the **complex** fields with unequal radii, two-axis offset and tilt; it verifies the derivation without reusing the closed-form calculation.

## Visualization and model boundaries

Central heatmap shows each mode's relative intensity exp(−2r²/w²), not absolute W/µm². A phase-only tilt does not change that plane's intensity distribution. Direction views illustrate relative axes with 4× angle exaggeration. Power meter/transmission pulses use the computed total fraction. Visual color overlap is illustrative; the complex overlap integral is authoritative.

Assume circular scalar modes, a common plane and homogeneous medium, equal polarization and phase curvature, and small relative direction components. Not computed: full-vector EM, polarization dependence, Fresnel reflection, refraction, longitudinal gap/diffraction, beam walk-off, projected ellipticity, roll, evanescent coupling, propagation loss, thermal deformation, adhesive shrinkage or assembly yield. v0.2 supplies X/Y and two Tilt components; it is **not Full 6-DOF Alignment**. Thresholds/radii are educational settings, not vendor process specifications.

## Primary-source context

- W. B. Joyce and B. C. DeLoach, “Alignment of Gaussian beams,” *Applied Optics* 23(23), 4187–4196 (1984), DOI [10.1364/AO.23.004187](https://opg.optica.org/ao/abstract.cfm?origin=search&uri=ao-23-23-4187). The accessible abstract discusses Gaussian coupling and the offset/angular-tolerance trade-off; the paywalled full article was not used as a numeric calibration.
- B. Chen, T. Findakly and R. Innarella, *Integrated Optics Technology Study*, TRW final report for JPL/NASA (June 18, 1982), [NASA report PDF](https://ntrs.nasa.gov/api/citations/19820022198/downloads/19820022198.pdf), Section 7.2, Equation 8, printed page 7-7 (PDF page 69): small-angle coupling context.

The spatial equation/radius convention came from the authoritative project specification. The angular formula is explicitly derived above and independently verified numerically. Attached textbook, paper and company-document bytes are not redistributed.
