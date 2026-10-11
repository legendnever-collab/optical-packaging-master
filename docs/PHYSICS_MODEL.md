# v0.7 Optical Interface Physics

기존 `gaussian-coupling.js`, `angular-coupling.js`, `assembly.js`, `gaussian-propagation.js`는 v0.6 기준에서 변경하지 않았습니다. 새 모델은 별도 Module로 추가합니다. 모든 길이는 µm, 입력 Tilt는 °이며 계산 시 rad로 변환합니다. Mode Radius는 Field Amplitude 1/e Radius이고 MFD=2w입니다. 기본 λ₀=1.55 µm, 공통 매질 n=1입니다.

## 정규화된 2D Gaussian

회전 행렬 R과 양의 Radius wx, wy에 대해:

`A = R diag(1/wx², 1/wy²) Rᵀ`

`E(r) = N exp[-(r-d)ᵀ (A+iB) (r-d) - i k θᵀ r]`

`N² = 2 sqrt(det A)/π`, `B = (k/2) C`, `k = 2πn/λ₀`

C는 대칭 Inverse Wavefront Curvature Matrix입니다. A는 Positive Definite이며 ∫|E|²d²r=1입니다. Separable Elliptical Mode도 회전하면 XY 교차 항을 포함하므로 한 개 Radius로 취급하지 않습니다. Core Ellipticity와 Optical Mode Ellipticity를 동일시하지 않습니다.

`H₁=A₁+iB₁`, `S=H₁+conj(H₂)`, `l=2H₁d - ikθ`

정확한 Gaussian 적분으로:

`η = [4 sqrt(det A₁ det A₂) / |det S|] exp{Re[-2 dᵀH₁d + (1/2) lᵀ S⁻¹ l]}`

Loss는 log-domain에서 계산합니다. `Loverlap = -10 log10 η`, `Ltotal = Loverlap + Lfixed`, `Pout/Pin=η·10^(-Lfixed/10)`입니다. Zero Curvature에서는 Mismatch / Lateral / Angular 항을 독립적으로 분리할 수 있습니다. Curvature가 있을 때는 Offset / Tilt 교차 효과가 있으므로 독립된 η들을 곱하지 않습니다.

Circular 특수화는 기존 Spatial / Angular 모델과 일치합니다. 회전된 프로필과 Curvature+Offset+Tilt를 독립 2D Complex Quadrature로 검증합니다. 입력 Radius 0.1–200 µm, Tilt ±5°의 명시적 Domain 밖에서는 결과를 거절합니다. 이 Domain은 EM 정확성 보장이 아닙니다.

## SMF / Glass / Silicon / Converter provenance

| 값 / 개념 | 출처 분류 | 사용 방법 |
|---|---|---|
| SMF MFD 10.4 µm @1550 nm; Cladding 125 µm; Core 약8.2 µm | Corning 공개 Datasheet / Catalog | Circular Gaussian Reference; 실제 Fiber Full-vector 해석 아님 |
| Glass wx/wy 4.8/2.6, 5/5, 4.8/4.0 µm | 교육용 가정 | 다양한 가능한 형상을 보여줌; 모든 Glass가 Elliptical이라는 뜻 아님 |
| 500×220 nm SOI 구조 개념 | 공개 Silicon Photonics 문헌 | Stack/Confinement 설명용; 특정 PDK 재현 아님 |
| Bare Si wx/wy 0.45/0.30 µm | 문헌의 강한 Confinement에 근거한 illustrative Effective Field | TE-like Scalar Gaussian 근사; 문헌에서 추출한 검증된 Full-vector Mode Dataset이 아님 |
| Si Inverse Taper w=1.5 / 2.5 µm, Conversion 0.15 dB | 공개 원리 + 명시적 수치 가정 | Tip/Length에서 계산한 값 아님 |
| SiN-assisted SSC w=3.8 / 4.8 µm, Conversion 0.25 dB | 공개 Hybridization 원리 + 명시적 수치 가정 | SiN standalone Coupler 측정값을 SiN-assisted Si 구조로 전용하지 않음 |
| Length=250/500 µm, Tip=100 nm | illustrative Geometry metadata | Performance surrogate의 입력으로 사용하지 않음 |
| Lens당 0.10 dB / Mirror 0.15 dB | 교육용 Fixed Loss 가정 | 실제 제품 실측 아님 |

**Converter 정량 성능은 검증된 PDK / EM Dataset으로 Calibration하지 않았습니다.** 현재 Reference는 물리적으로 가능한 원리를 설명하는 제한된 Effective-field 모델입니다. 수학적 Overlap 검증과 실제 Taper의 정량 EM 검증을 구분합니다. 지원된 몇 개의 Field만 선택하게 하며 Tip Width/Length와 Loss 사이에 허구의 연속 함수를 만들지 않습니다.

## Lens Relay: 같은 q와 Ray 좌표 전달

기존 q 정의 `q=z+i zR`, `zR=π n w₀²/λ₀`, Free Space `P(d)=[[1,d],[0,1]]`, Lens `L(f)=[[1,0],[-1/f,1]]`를 사용합니다. 같은 Transform으로 Ray `[x,θ]`도 전달합니다. Lens Decenter δ는 `θout=θin−x/f+δ/f`입니다. 이상적인 무한 Thin Lens의 독립 Tilt 성능 함수는 추가하지 않았습니다.

Source → P(z₁) → Lens A → P(f₁) → Detachable Plane → Receiver Module frame shift → P(z₂−z₁−f₁) → Lens B → P(length−z₂) → Receiver입니다.

Detachable Plane에서 `x ← x−δx`, `θ ← θ−δθ`를 적용합니다. q는 이 좌표 이동으로 바뀌지 않으며 Lens/Free Space를 통해 전달됩니다. 최종 Receiver Plane에서 q의 Radius와 Curvature, Ray의 Offset/Tilt를 위 Complex Gaussian 적분으로 한 번에 평가합니다. Source/Lens의 영구 정렬 잔차도 실제 Ray 입력으로 적용합니다.

기준 f₁=260, f₂=240, z₁=260, z₂=760, length=1000 µm의 4f Relay는 wsource=5.2 → wtarget=4.8 µm의 Waist/Curvature를 맞춥니다. Nominal Loss는 두 Lens 0.20 + Converter 0.25 =0.45 dB입니다. Lens 0/1/2개 설치, Source Working Distance, Receiver Axial 좌표가 실제 q와 출력에 영향을 줍니다.

Expanded Detachable Plane의 Matched Radius는 λf₁/(πwsource)≈24.67 µm입니다. 같은 Plane의 Circular Phase-tilt 기준과 최종 Receiver 적분이 일치합니다. 이 Plane의 위치 편차가 최종 Receiver의 Angle로 변환될 수 있어 Offset와 Angle을 각각 독립된 Score penalty로 붙이지 않습니다.

Fold는 **Ideal Unfolded Equivalent**로 처리합니다. q/Ray의 경로 길이는 유지하고 장면/패키지 Envelope만 접습니다. Mirror 고정 감쇠를 추가하지만 3D Reflection / Polarization / Aberration 모델을 주장하지 않습니다.

## 공정과 제조

Seed 20261013 / N=1000는 Ch4/5 공통 비교 Cohort입니다. 동일한 표준 Normal Sample을 설계별 Scale에 적용합니다. Economy Mating σXY=1.8 µm, Precision Fixture σXY=0.12 µm. Mating σTilt=0.08° 또는 Loose Angular 환경0.8°. Relay의 Permanent Source/Lens σXY=0.08 µm, Axial σ=2 µm는 별도, 고정 Seed에서 생성합니다. Relay는 사전에 정렬된 영구 Subassembly가 있다는 명시적 구조 가정입니다.

Ch6는 Seed 20261014 / N=100의 독립 생산 Cohort입니다. v0.6 Fixture의 유한 형상 / AABB / Datum Slot / 기본 Cost/Time를 재사용하지만 광학 오차 Scale과 예산은 Campaign-specific 명시적 교육 가정입니다. v0.6의 독립 Challenge σ=0.70을 새 1.8 µm 공정으로 몰래 동일시하지 않습니다.

Prototype Calibration은 생산 평균에 전달됩니다. Active는 Mating Residual σXY=0.08 µm / σTilt=0.015°를 명시적으로 적용하며 Permanent Module 오차를 유지합니다. Rework는 실제 First-pass Reject Row만 다시 계산하고 비용을 추가합니다. Geometry가 맞지 않으면 Lock할 수 없고, Locked 상태에서 Alignment를 바꿀 수 없습니다. Unlock은 9 Credits / 6 s를 더합니다. Lock은 Adhesive/Shrinkage 계산이 아닙니다.

Serial Cost/Time는 Prototype + 각 Row의 Carrier / Fixture / Optics / Alignment / Lock / Test / Rework를 실제 합산합니다. 렌즈 비용은 영구 Subassembly 비용을 포함하는 교육 가정이며 측정 공장 견적이 아닙니다. 공정 Raw / First / Final Result를 유지합니다. Nearest-rank P95, Good/Reject counts와 Wilson 95% Interval을 보고합니다. 동일 Seed의 설계 최적화는 독립적인 실측 Yield 검증을 뜻하지 않습니다.

## 공개 근거

- Corning SMF-28 Ultra 공개 Datasheet: https://www.corning.com/content/dam/corning/media/worldwide/coc/documents/Fiber/product-information-sheets/PI-1424-AEN.pdf ; Catalog 예: https://ecatalog.corning.com/optical-communications/EMEA/en_GB/Fibre-Optic-Cable-Assemblies/Indoor-Cable-Assemblies/Simplex-Indoor-Cable-Assemblies/Basic-0-9-mm-1-Fibre-Pigtail/p/F002201G1Z09002M-RD
- Du et al., *Detachable interface toward a low-loss reflow-compatible fiber coupling for co-packaged optics*, Optics Express 31, 1318–1329 (2023), DOI https://doi.org/10.1364/OE.480418. Expanded Beam / Angular / Lateral Trade-off / Permanent active-prealigned module 개념의 근거. 논문의 Lens/성능 숫자를 이 게임의 제조 보증값으로 사용하지 않음.
- Boucaud et al., APL Photonics (2024), DOI https://doi.org/10.1063/5.0221309. Glass/Polymer/PIC integration과 Hybridization의 실제 복잡성. 보고된 높은 실험 Loss를 저손실 게임 Preset으로 전용하지 않음.
- Chrostowski & Hochberg, *Silicon Photonics Design: From Devices to Systems*, §5.3 / §12.1.1. Inverse Taper의 Confinement 완화, Mode Overlap과 Packaging 설명. 저작물 그림/본문은 배포하지 않음.
- *Ultra-low loss SiN edge coupler interfacing with a single-mode fiber*, Optics Letters 47, 4786 (2022): https://opg.optica.org/ol/abstract.cfm?uri=ol-47-18-4786. Cladding이 Mode 크기/형상에 중요하다는 공개 근거; SiN standalone 측정 성능을 SiN-assisted Si Reference로 간주하지 않음.

아래는 변경하지 않은 Legacy Solver 설명입니다.

---

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


## v0.8 additive FAU Packaging

Chapter 1–6의 모델과 완료 기록을 유지하며 Chapter 7의 4→8→16-channel Array를 추가합니다. Campaign Schema 1 / Content 8은 Content 7을 검증 후 이관하며 Interface Model v7.1을 변경하지 않습니다. Array Geometry / Process / All-channel Acceptance / UX / Migration / 모델 경계의 상세 사항은 [FAU_PACKAGING.md](FAU_PACKAGING.md)를 참조하세요. v0.7 HTML·ZIP·Manifest·Preview는 그대로 보존합니다.
