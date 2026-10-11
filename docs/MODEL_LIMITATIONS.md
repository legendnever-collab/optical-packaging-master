# v0.7 Model limitations

- Scalar Gaussian는 실제 Glass / Silicon / SSC Mode의 정확한 Full-vector 표현이 아닙니다. Polarization, High-index interface Fresnel, Non-Gaussian tails, Higher-order Mode, Scattering을 계산하지 않습니다. Bare Silicon의 작은 Elliptical Mode는 강한 Confinement를 설명하는 수치 가정이며 검증된 PDK Field가 아닙니다.
- Converter Geometry는 Metadata입니다. Tip Width / Length → Insertion Loss 함수는 없습니다. 선택 가능한 Output Field와 Conversion Loss는 명시적인 Reference 가정입니다. SiN-assisted 구조의 공정 호환성은 자동 보장하지 않습니다.
- 새로운 2D Overlap은 정규화된 Complex Gaussian 적분입니다. 수학적 Quadrature 일치는 실제 Converter EM Validation을 뜻하지 않습니다.
- Direct Coupling은 공통 Facet Plane의 Flat-phase Overlap입니다. Physical drawing의 작은 Gap을 실제 Diffraction / Fresnel로 계산하지 않습니다. Relay에서만 명시한 Free-space q 경로를 계산합니다.
- Relay는 Same-medium, Paraxial, Infinite Thin Lens입니다. 유한 Aperture / Vignetting / Lens Aberration / Thick Lens / Independent Lens Tilt 효과는 포함하지 않습니다. Decenter와 Module Tilt는 명시한 Ray/Frame Transform만 지원합니다.
- 이상적인 Fold는 Unfolded Path와 표시용 90° Route입니다. 실제 3D Reflection geometry, Polarization, Off-axis Curvature, Reflective aberration 모델이 아닙니다. Envelope는 광선 접촉 검사가 아닌 교육용 2D Package 치수입니다.
- Ch5 Geometry는 경로 길이 / Fold envelope / Component Count / 최소 Source Working Distance 제약입니다. Lens mount, 실제 Beam clearance, 정밀 기구설계는 포함하지 않습니다.
- Ch6 기계 검사는 v0.6의 Carrier/PIC Axis-aligned Bounding Boxes와 Datum Slot입니다. Contact / Stress / Thermal / Warpage / Adhesive Shrinkage를 계산하지 않습니다. Lock은 편집을 잠그는 State입니다.
- Normal Error / Bias / Residual / Credits / Serial Seconds는 교육 가정입니다. 독립 축, 동일 Sample 비교와 독립 생산 Seed를 명시합니다. 실제 공장의 분포·상관·Tail·Drift를 주장하지 않습니다.
- Yield에는 실제 Sample Good Count와 P95 / Wilson 95% Interval을 사용합니다. “Passive-ready” / “Product Qualified”는 선언한 모델/요구/Seed 조건에만 해당합니다. Ch5 Comparison을 반복해 최적화한 결과는 독립 실측 Qualification이 아닙니다.
- UI의 Structure / SSC mode evolution은 개념도입니다. Facet의 Radius/Orientation contour와 q Beam envelope는 선택한 모델 값을 사용하지만 Relative Intensity 색 Gradient 자체가 Field Measurement는 아닙니다. SMF Cladding은 확대 Facet 그림의 밖에 있고 Core와 Mode는 구분됩니다.
- Legacy Lab의 q/ABCD와 Common-plane Angular 모델은 원래 경계 그대로 독립적인 실험입니다. 새로운 Relay/Factory Adapter의 통합 결과와 혼동하지 않습니다.
- Human First-play / Learning Effect / Enjoyment / Native Android Device / Safari/Firefox 수동 인증은 수행하지 않았습니다. 실제 실행한 자동 테스트와 CI 상태만 보고합니다.
