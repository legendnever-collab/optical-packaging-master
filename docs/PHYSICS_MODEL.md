# Simplified Gaussian Mode Model — v0.6

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

Chapters 1–2 assume circular scalar modes, a common plane and homogeneous medium, equal polarization and phase curvature, and small relative direction components. Not computed: full-vector EM, polarization dependence, Fresnel reflection, refraction, longitudinal gap/diffraction, beam walk-off, projected ellipticity, roll, evanescent coupling, propagation loss, thermal deformation, adhesive shrinkage or calibrated real-world assembly yield. v0.3 estimates sample yield under the declared process model below and supplies X/Y and two Tilt components; it is **not Full 6-DOF Alignment**. Thresholds/radii are educational settings, not vendor process specifications.

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

## Coaxial Gaussian propagation — v0.4, independent from Chapters 1–2

This module uses geometric q in a **single homogeneous medium**. λ₀ is vacuum wavelength, n is the medium index; campaign/practice n=1. Field amplitude radius w is 1/e, intensity radius is 1/e². Lengths, focal lengths and q components are µm.

At a waist: zR=π n w₀²/λ₀, qwaist=i zR. A given source waist at coordinate zs sets q(0)=−zs+i zR. This explicitly allows the already converging input in Mission 08; no unstated upstream lens is simulated.

q=z+i zR relative to the local waist; 1/q=1/R−i λ₀/(π n w²). Thus w²=λ₀ |q|²/(π n Im(q)), local waist²=λ₀ Im(q)/(π n), and inverse curvature Re(q)/|q|². R=∞ at a waist. Local waist distance is −Re(q); after another lens this distance no longer describes the whole path.

For ray coordinates (x,θ), free propagation d has matrix [1,d;0,1]; ideal thin lens focal length f has [1,0;−1/f,1]. Physical sequence M1 then M2 composes M2 M1. q′=(Aq+B)/(Cq+D), with unit determinant in this same-medium convention. Core allows negative focal lengths and signed free-space distances for inverse/regression calculations; bounded game paths use positive ordered lenses inside a positive path. No index-changing surface is implemented.

Primary references: [MIT OCW 6.974 Fundamentals of Photonics, Chapter 2, Gaussian beam optics §2.6](https://ocw.mit.edu/courses/6-974-fundamentals-of-photonics-quantum-electronics-spring-2006/8e54d1625e9e71eb5b4e4998e6967e4e_chapter2.pdf) and [Edmund Optics, Gaussian Beam Propagation](https://www.edmundoptics.eu/knowledge-center/application-notes/lasers/gaussian-beam-propagation/). Both describe q transformation and thin-lens curvature. MIT's matrix table uses a reduced-index convention (free-space B=L/n); **this implementation uses geometric q and B=d**, so the conventions must not be mixed. The overlap below is derived for the chosen scalar field and tested independently rather than read from a vendor performance claim.

### Size and curvature at the Receiver

Receiver is a circular target waist of radius wt in its plane. Incident and target q must share wavelength/index and axis. Normalized field may be written u(r)=sqrt(2/π)/w exp[−r²/w²] exp[−i k r²/(2R)] with k=2πn/λ₀. Its squared complex overlap is

ηq = 4 b1 b2 / [(a1−a2)²+(b1+b2)²], qj=aj+i bj.

Equivalently ηq = 4/(w1²w2²) / [(1/w1²+1/w2²)² + (k/2)²(1/R1−1/R2)²]. Size-only efficiency is [2w1w2/(w1²+w2²)]². Curvature Loss is −10log10(ηq) minus Size Mismatch Loss. It is nonnegative; two identical q give η=1 and 0 dB. Identical intensity sizes can still have different wavefronts. Same inverse curvature reduces to the existing size mismatch formula.

ηq is Mode Overlap Efficiency. Overlap Loss=Size Mismatch+Curvature; Total Loss=Overlap Loss+Fixed Loss. Actual normalized Output Power=ηq ×10^(−FixedLoss/10). Logs/scaled ratios avoid overflow/cancellation and keep analytical loss when power underflows to zero. Invalid q, nonfinite fields, nonpositive waists/index/wavelength and unrepresentable states reject with explicit errors. UI validates a candidate before replacing the last valid configuration.

Lens Fixed Loss=0.10 dB per lens; Ideal Fold Mirror Fixed Loss=0.15 dB. These are **Assumed learning parameters**, not calculated coatings, Fresnel coefficients or measured component data. No physics bonus rewards choosing a lens or fold.

### Relay, Fold and bounded acceptance

A 4f relay with lens positions f1 and 2f1+f2 and Receiver at 2(f1+f2) maps a waist radius by |f2/f1|. Tests verify a 2× radius transformation with zero curvature mismatch. Moving lens/Receiver from that configuration recalculates q; no heuristic radius boost is applied.

An ideal 90° Fold at coordinate zf leaves unfolded propagation q unchanged and routes the centerline into dimensions W=zf, H=L−zf; straight dimensions are W=L,H=0. Mirror attenuation is separate. Component positions appear along the route; the envelope view is explicitly **unfolded** with separate longitudinal/radius scales. This is centerline geometry, not mechanical envelope: apertures, bodies, clearances and mirror/lens dimensions are absent.

Mission 10 applies the actual model at Receiver deltas [−100,0,+100] µm and checks every optical result ≤0.55 dB and every centerline footprint ≤1000×1000 µm. Worst is the maximum loss of these three evaluations. It is not a continuous tolerance bound, probability, Monte Carlo extension or manufacturing Yield. Chapter 2 continues using its unchanged spatial/angular process engine.

### Scope and verification

Coaxial scalar paraxial propagation, ideal thin lenses, diffraction, longitudinal defocus and curvature are implemented. No decentered/tilted lenses, angular ray propagation, lateral walk-off, finite aperture/clipping, aberration, index transition/refraction, astigmatism, true mirror reflection, polarization or vector field. Chapters 1–2 and Chapter 3 have separate assumptions and outputs; multiplying their efficiencies would require a derived decenter/tilt propagation model and is deliberately unsupported. No Full Optical CAD or arbitrary component chain is claimed.

Tests include analytical free propagation, matrix composition/inverses, signed focal length, radius continuity and curvature kick, 4f magnification, size-only regression, curvature penalty, defocus, n/λ conventions, extreme stability, domain validation, three-point acceptance and feasible/wrong designs. A separate 30,000-point complex radial field integral checks overlap for unequal incident/target beams. These numerical tests validate the specified simplified model, not an industrial package.

## v0.5 rendering integrity

No optical solver or process distribution changed. Spatial, angular, assembly and q/ABCD core modules and their reference tests are preserved from the v0.4 baseline. Physical renderers consume those states/results. Hardware components are schematic drawings, not new optical/mechanical models. Body dimensions, datum, substrate depth, stage placement and mounting blocks are illustrative and do not add gap, clipping, body interference, thermal or manufacturing mechanics.

For Chapters 1–2 the Fiber Facet's display point is (455+16dx,220−16dy). Its depicted body/gap is not a longitudinal propagation calculation. Angular orientation is a 4× direction glyph/visual body rotation; the common-plane phase-tilt result remains the actual model, with no traced walk-off. In Mission 02 geometry/parameters are concealed until the corresponding paid inspection; changing views does not obtain hidden evidence. In Mission 04 direction remains concealed until the discovery action.

For Chapter 3, every lens, mirror and Receiver has an unfolded z coordinate projected by a reversible route adapter. Beam Envelope radii sample existing beamAtQ(opticalPathQ(config,z)); radius display scale is declared separately from z/body scales. No transverse/tilt state is folded into q. Folded route uses the same v0.4 ideal unfolded-coordinate model, not a reflected vector field. Negative/future local-waist interpretation remains limited to the next lens segment.

Input flow is normalized to 1. Chapter 3 path segments use only fixed attenuation of preceding lenses/mirror, and Receiver output uses the full computed Total Efficiency. Chapters 1–2 output uses existing angularCoupling.totalEfficiency. Pulse velocity is a display effect without a physical time axis. Light OFF gates visibility, not the computed optical result. Reduced Motion stops travel and accelerates preview playback without changing samples/outcomes.

FactoryPlayback receives real evaluateDesign rows and never generates/mutates results. Only the first ten are staged PLACE/TEST/SORT; GOOD=actual row.pass and REJECT=!row.pass. Full produced/good/reject/Yield/P95/CI use the selected full report. Inspection restores the actual row.state and recomputes the same existing physics. Sorting graphics and achievements cannot add physical performance. Pan/Zoom/Exploded only alter camera/presentation. See PHYSICAL_SCENE_ARCHITECTURE.md for mappings and input controls.

## v0.6 mechanical assembly / assumed economics

Optical/Statistical solver files and their 102 reference tests are unchanged. The new independent Challenge composes declared Fixture/part Normal errors and fixed Datum bias before calling `angularCoupling`. Actual Prototype calibration is derived from its observed sample. Independent production uses another seed; candidate designs share standard normals. Active correction and optional rejected-unit rework feed actual assumed residual X/Y/angles into the same engine, preserving mismatch and recomputing Loss. No optical score discount is used.

The top view evaluates declared Carrier/PIC rectangles inside a Package with axis-aligned clearance and mount constraints. Z motion changes geometry only, not unimplemented optical gap loss. Facet microscopy uses a separately stated common transverse scale. Lock is a state constraint without material shrinkage. Rework costs/time, Fixture prices and correction residuals are uncalibrated teaching assumptions. Prototype, First Pass, final Yield, confidence interval and cost per actual Good are distinct. Full derivation, mapping, fixed seeds, policies and limitations are in [ASSEMBLY_CHALLENGE.md](ASSEMBLY_CHALLENGE.md). Current q/ABCD and phase-tilt models remain separate.
