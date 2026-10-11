# Optical Packaging Master v0.7 — Physics-driven Campaign

물리적으로 겪은 문제를 해결하기 위해 다음 기술을 도입합니다. 기본 Campaign은 6개 개발 Chapter이며, 기존 Mission 01–10과 v0.6 Assembly Challenge는 Optional Engineering Lab에서 보존합니다.

**Physical Problem → Failed Experiment → Understanding → Engineering Solution → New Constraint → Improved Design**

## Chapter 설계

1. **Connect Two Fibers**: 같은 SMF를 연결합니다. Core/Cladding과 Mode를 구분하고, 중심 정렬 뒤 남는 Angular Loss를 해결합니다.
2. **Glass Waveguide Challenge**: 비대칭 Mode를 정렬하고 X/Y 허용도를 비교합니다. Circular SMF 기준에서는 중심 Loss가 Mode 회전에 불변임을 직접 확인합니다. 서로 다른 제작 Profile을 비교해 개선합니다.
3. **Silicon Mode Mismatch Crisis**: Bare Si를 완벽하게 정렬해도 작은 Mode 때문에 큰 Mismatch가 남습니다. 낮은 Loss 대신 정확한 원인 진단으로 성공합니다.
4. **Engineer the Mode Converter**: Bare / Si Inverse Taper / SiN-assisted SSC를 구분된 Reference로 비교합니다. Nominal 개선 후 즉시 같은 제조 편차를 적용해 Yield 부족을 경험합니다.
5. **Design for Passive Alignment**: Precision Datum 또는 실제 설치한 Lens Relay를 선택합니다. Compact Package에서는 Fold의 공간 이점과 추가 Loss, Angular Registration이 나쁜 환경에서는 Expanded Beam의 민감도를 비교합니다.
6. **Build, Lock & Qualify**: Frozen Optical Project를 그대로 받아 Carrier / Fixture / Align / Lock / Test / Rework / 독립 100개 생산을 수행합니다. Optical Loss와 Good Count, 실제 합산 Cost/Time을 동시에 만족해야 합니다.

## UI와 성공 상태

Physical Scene, Current Problem, Next Action, 실제 Output Power, Engineering Goal을 우선 표시합니다. 첫 Light ON / Endface / Precision 행동은 장면 위에서도 접근할 수 있습니다. 고급 Model/Field/Scope 설명은 기본적으로 접습니다.

Ch1–4는 Experiment 결과를 전달합니다. Ch3의 정확한 한계 진단을 제품 성능 성공으로 오해시키지 않습니다. Ch5의 버튼은 설계를 명시적으로 Frozen하며, 이후 한 번의 Handoff Dialog에서 다음 문제를 보여줍니다. Ch6는 제품 Qualification을 확정합니다. “현재 설계 계속 실험”은 언제나 현재 Draft를 유지합니다.

Observation Count, 임의 점수, 경험 횟수는 물리 성능을 바꾸거나 진행을 막지 않습니다. Ch6 첫 10개 실제 Sample의 재생은 계산 결과를 보여주는 선택적 연출이며 전체 100개 평가와 구분합니다. UI 애니메이션에 나타나는 Loss/GOOD/REJECT는 실제 모델 Row를 사용합니다.

## 선택과 Trade-off

- Datum: 부품 수가 적고 위치 편차를 줄일 수 있지만 Precision Fixture 비용이 필요합니다.
- Relay: Detachable Plane에서 위치 편차를 완화하지만 영구 Subassembly의 사전 정렬과 추가 Lens, Working Distance가 필요합니다.
- Fold: Package Envelope를 줄이지만 Mirror Loss와 부품 비용이 추가됩니다.
- Expanded Mode/Beam: 위치 민감도와 각도 민감도가 상반되므로 크기를 늘리는 것만으로 모든 문제를 해결하지 않습니다.
- SSC: 선택된 공정 Stack/Mode Reference가 지원될 때만 유효하며 SiN-assisted가 모든 PIC에서 우수하다고 주장하지 않습니다.

## 설계 연속성

완료한 결과는 분리된 Frozen Snapshot입니다. Draft를 추가 실험해도 이전 기준선은 유지됩니다. Ch4에서 Converter를 명시적으로 다시 전달하면 Ch5의 호환 가능한 부품 배치는 유지하고 Acceptance를 다시 평가합니다. Ch5에서 Optical Design을 변경해 다시 Frozen하면 Ch6는 새 설계를 받아 새 조립을 시작합니다. 이전 제조 결과는 Archive에 보존하며 제품 완료 상태를 다시 획득해야 합니다. 호환되는 설계를 전달할 때 사용자의 부품을 설명 없이 초기화하지 않습니다.

## 준비 범위

SENKO / Teramount / Broadcom을 특정 제품 재현으로 구현하지 않습니다. v0.7은 공개 문헌으로 설명 가능한 물리 문제와 모델 경계에 집중합니다. 업체별 산업 구조 비교는 후속 단계이며 비공개 Parameter를 사용하지 않습니다.

인간 대상 Learning / Enjoyment / First-play 연구는 수행하지 않았습니다. 자동 UI/Physics QA는 해당 연구를 대신하지 않습니다.


## v0.8 additive FAU Packaging

Chapter 1–6의 모델과 완료 기록을 유지하며 Chapter 7의 4→8→16-channel Array를 추가합니다. Campaign Schema 1 / Content 8은 Content 7을 검증 후 이관하며 Interface Model v7.1을 변경하지 않습니다. Array Geometry / Process / All-channel Acceptance / UX / Migration / 모델 경계의 상세 사항은 [FAU_PACKAGING.md](FAU_PACKAGING.md)를 참조하세요. v0.7 HTML·ZIP·Manifest·Preview는 그대로 보존합니다.
