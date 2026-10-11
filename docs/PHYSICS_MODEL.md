# Simplified Gaussian Mode Model — v0.3

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

Assume circular scalar modes, a common plane and homogeneous medium, equal polarization and phase curvature, and small relative direction components. Not computed: full-vector EM, polarization dependence, Fresnel reflection, refraction, longitudinal gap/diffraction, beam walk-off, projected ellipticity, roll, evanescent coupling, propagation loss, thermal deformation, adhesive shrinkage or calibrated real-world assembly yield. v0.3 estimates sample yield under the declared process model below and supplies X/Y and two Tilt components; it is **not Full 6-DOF Alignment**. Thresholds/radii are educational settings, not vendor process specifications.

## Primary-source context

- W. B. Joyce and B. C. DeLoach, “Alignment of Gaussian beams,” *Applied Optics* 23(23), 4187–4196 (1984), DOI [10.1364/AO.23.004187](https://opg.optica.org/ao/abstract.cfm?origin=search&uri=ao-23-23-4187). The accessible abstract discusses Gaussian coupling and the offset/angular-tolerance trade-off; the paywalled full article was not used as a numeric calibration.
- B. Chen, T. Findakly and R. Innarella, *Integrated Optics Technology Study*, TRW final report for JPL/NASA (June 18, 1982), [NASA report PDF](https://ntrs.nasa.gov/api/citations/19820022198/downloads/19820022198.pdf), Section 7.2, Equation 8, printed page 7-7 (PDF page 69): small-angle coupling context.

The spatial equation/radius convention came from the authoritative project specification. The angular formula is explicitly derived above and independently verified numerically. Attached textbook, paper and company-document bytes are not redistributed.


## Assembly variation and Monte Carlo — v0.3

The existing spatial/angular engine is unchanged. For axis j in {dx,dy,θx,θy}, sample error e_j=b_j+σ_j Z_j, with independent Z_j~N(0,1). Bias and sigma use µm for position and degrees for tilt at the API boundary. Each evaluated sample adds error to the nominal design state; the angular engine converts degrees to radians. Campaign nominal controls are zero and the declared process bias appears only in the assembly cohort. σ=0 produces exact bias without bypassing deterministic RNG consumption.

`generateSamples` uses uint32-seeded Mulberry32 followed by Box–Muller standard normals (u=1−uniform avoids log(0)). Seed 0 is valid. Four normals are consumed per part in a fixed axis order; count 10/100/1000/10000 shares an identical prefix for the same seed and process. Different designs evaluate the exact same cohort object, avoiding unrelated sample noise. Samples/process inputs are not mutated. This is a deterministic learning sampler, not a cryptographic RNG or a calibrated manufacturing process.

Normal errors have unbounded support. A sample whose actual angular component exceeds ±5° rejects the entire evaluation with an explicit model-domain message. No sample is clipped, silently omitted or resampled. No Yield is reported for that cohort. Process overflow/nonfinite or invalid design inputs are rejected. Extreme valid lateral errors retain zero efficiency and analytically infinite Loss rather than claiming improvement.

For each part i, compute actual angularCoupling(design+error_i), pass_i=1{Total Loss_i≤Llimit}, and Yhat=Σpass_i/N. A 1e−9 dB comparison tolerance handles floating-point boundary rounding, not an engineering bonus. N=1–10000 is supported by the core. Campaign Llimit=1 dB. Histogram has 0.2 dB bins for this limit, with the last bin collecting all Loss≥1.8 dB. Every sample contributes once. P95 is the nearest-rank sorted Loss at ceil(0.95N), index ceil(0.95N)−1. Worst is a real sample of maximum Loss. Failed-sample dominant component is the largest actual dB contribution among Mismatch/Lateral/Angular/Fixed; it is an explanatory decomposition, not proof of an exclusive root cause.

Nominal Loss is the design with zero assembly error. Robustness is explicitly a P95 Loss margin: Llimit−P95, in dB. It is a comparison metric, not an extra physical effect. Physical results remain independent from Game Score.

### Binomial uncertainty

For z=1.959963984540054 and p=Yhat, the 95% Wilson score interval has:

D=1+z²/N,
center=(p+z²/(2N))/D,
half=z sqrt[p(1−p)/N+z²/(4N²)]/D,
CI=[max(0,center−half),min(1,center+half)].

Even all-pass/all-fail small runs retain uncertainty. This interval is conditional on an independently sampled, fixed design and the assumed process; it does not cover model error, biased industrial measurements or inference after searching many designs on the same samples. Common samples improve fair comparison but correlate design estimates. The per-design intervals are not a paired significance test. After optimization, use independent seeds/holdout manufacturing measurements before making a yield claim. The game threshold applies to estimated Yield, not the CI lower bound; this is clearly an educational completion criterion.

[NIST/SEMATECH e-Handbook, binomial confidence interval / Wilson method](https://www.itl.nist.gov/div898/handbook/prc/section2/prc241.htm) provides the statistical reference; tests independently verify endpoints, symmetry, bounds and count dependence. Seeded moment tests verify Normal mean/sigma and sample independence. Existing spatial/angular reference and complex-field quadrature tests remain unchanged.

### Trade-off validation and scope

For matched modes, Lateral Loss ∝(dx²+dy²)/w² while Angular Loss ∝w²(θx²+θy²). Mission 03 uses two representative states of opposite dominance and produces different winning designs directly from these equations. Mission 06 fixes w2=2.5 µm, so changing w1 also changes the mismatch prefactor. Its optimum is interior for the declared distribution, not an arbitrary gameplay buff. Test cases validate both effects and the factory ranking reversal using common seeded samples.

Campaign process values are specified in GAME_DESIGN.md and displayed in-game. They are **Assumed**, never published industrial process capabilities. The provided Du et al., “Detachable interface toward a low-loss reflow-compatible fiber coupling for co-packaged optics (CPO),” Optics Express 31(2), 1318 (2023), pages 1322–1323, was read only for qualitative lateral/angular tolerance context. Its expanded-beam lenses, gap, measured coupling and large beam sizes are not implemented or used to calibrate these distributions. No attachment bytes or private-company content are included.

This common-plane model factorizes spatial and phase-tilt losses. Monte Carlo propagates that model through assumed errors; it adds no Gap, walk-off, diffraction, refraction, aberration, adhesive, thermal, mechanical datum, cost or reliability physics. Full Optical System Builder and industrial reference architectures remain future work.
