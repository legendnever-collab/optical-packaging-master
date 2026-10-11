# v0.8 FAU Packaging — game, model and persistence

## Player journey

Chapter 6의 실제 단일 채널 제품 완료 후 Chapter 7을 열 수 있습니다. 기존 제조 경로와 Frozen 제품은 보존하고, 새 병렬 Edge Interface 실험을 시작합니다. 이 실험은 Chapter 6의 Relay를 임의로 다채널 Relay로 바꾸지 않습니다.

4 CH: 공통 X/Y를 맞춰 전 채널 ≤1 dB. 성공 후 Optical Test / Array 확장 버튼으로 실제 통과 상태를 4-channel Snapshot에 저장합니다. 8 CH에는 Rotation 0.6° / FAU Pitch 127.6 µm라는 새로운 오차를 적용합니다. 중앙은 상대적으로 좋지만 Edge가 실패하며, 회전과 Pitch를 함께 교정해야 합니다. 성공 후 8-channel Snapshot을 저장하고 16 CH로 확장합니다.

16 CH: Nominal Array와 100-package 제조 편차를 구분합니다. 중앙 2채널 검사와 전 채널 검사를 비교할 수 있으며, 전체 제품 Yield는 검사 범위와 무관하게 모든 실제 채널로 계산합니다. 최종 납품 조건은 Prototype 전 채널 ≤1 dB, 실제 Good ≥95/100, 전 채널 검사, Cost ≤6500 Credits, Time ≤4500 s입니다.

현재 기준 예: Economy / 중앙 검사 Cohort(20261015)는 실제 Good 70/100, 검사 Accept 100/100, 놓친 불량 30개입니다. Precision / 전 채널 검사의 비교와 독립 Cohort는 100/100 Good, 5400 Credits, 4200 s입니다. Active도 100/100이지만 7200 Credits / 5800 s로 경제 조건을 실패합니다. 결과를 정답으로 강제하거나 덮어쓰지 않으며, 실제 Solver로 재계산합니다.

## Geometry and optics

Channel slot s = i − (N−1)/2. Target center = (s ×127, 0) µm. Fiber center = (Shared X, Shared Y) + R(Array Rotation) · (s ×FAU Pitch, 0) + Local XY. 두 중심의 차이를 기존 `ellipticalCoupling`에 그대로 입력합니다. Rotation은 도 단위 입력을 라디안으로 변환하는 평면 Rigid Rotation이고, Common-plane phase tilt θx/θy와 다른 변수입니다.

각 채널은 SMF Field 1/e Radius 5.2 µm → Circular Effective SSC Radius 4.8 µm, λ₀ 1.55 µm, n=1, Flat phase, Fixed Conversion Loss 0.25 dB로 계산합니다. 기존의 정규화 복소 2D Gaussian Solver를 수정하지 않습니다. Equal Input Power에서 평균은 채널별 Total Transmitted Power의 산술 평균, 최저는 그 최솟값입니다. Worst Loss는 최댓값이고, Package Pass는 모든 채널 Loss ≤1 dB입니다. 평균이 불량 채널을 상쇄하지 않습니다.

Array 개념도는 좌표 오차를 확대하고 채널 간 간격을 보기 좋게 배치하며 Not to Scale입니다. 선택 채널의 Field 확대는 실제 µm 좌표를 8 px/µm로 표시합니다.

## Process assumptions

| Fixture | Shared σXY µm | σRotation ° | σPitch µm | Local σXY µm | Base Credits | Base seconds |
|---|---:|---:|---:|---:|---:|---:|
| Economy | 0.55 | 0.08 | 0.10 | 0.10 | 28 | 24 |
| Precision | 0.12 | 0.015 | 0.018 | 0.06 | 50 | 34 |
| Active | 0.08 | 0.008 | 0.012 | 0.06 | 68 | 50 |

중앙 검사는 제품당 0.5 Credits / 1 s, 전 채널 검사는 4 Credits / 8 s를 더합니다. 독립 Normal Draw로 Shared XY / Rotation / Pitch를 생성하고, 16채널 Local XY를 각각 생성합니다. Shared 오차로 채널 결과는 상관되어 있으므로 단일 채널 Yield를 16제곱하여 제품 Yield를 추정하지 않습니다. Count는 100이며 Fixture 비교는 같은 표준 Normal Draw / Seed 20261015를, 최종 Qualification은 별도 Seed 20261016을 사용합니다. 샘플 오차를 Clip하지 않고 Solver Domain을 벗어나면 평가 전체를 거절합니다. Wilson 95% Interval은 제품 Pass Count에 적용합니다.

Pitch 127 µm와 모든 Mode / 공정 / 비용 수치는 교육용 Preset입니다. 실제 Foundry / Vendor / 생산 통계가 아닙니다. Active는 작은 잔여 오차를 가정한 공정 Preset이며 실제 최적화 Controller나 제조 Rework Simulation이 아닙니다. 독립 Seed 최종 검사도 시뮬레이션이고 실제 공장 검증은 아닙니다.

지원하지 않는 현상: 채널 간 Crosstalk / Coherent Interference / Evanescent Coupling / Full-vector Polarization / 실제 SSC EM / Fresnel / Thermal / Adhesive / Stress / Aberration.

## Persistence and controls

Campaign Schema 1을 유지하고 Content 7 →8의 추가 Migration을 지원합니다. 기존 Interface Project Model `interface-project-v7.1`은 그대로이며 FAU Draft / Frozen에는 별도 `independent-common-plane-fau-v1`, Schema 1을 기록합니다. FAU Stage, 실제 Settings, 통과한 4/8 Geometry, 제한된 6개 평가 Descriptor를 저장합니다. 평가에는 Settings / Seed / Count를 보존하고 재시작 / Restore 시 실제 Physics로 재계산합니다. Derived Good / Power / Award를 입력 JSON에서 신뢰하지 않습니다.

Current Settings가 바뀌면 평가를 무효화하고 이전 비교와 Frozen 제품은 유지합니다. 배열의 Shared X/Y는 ±버튼·Slider·SVG Drag·Arrow Keys가 같은 상태를 수정합니다. Clamp는 사용자 조작의 ±8 µm, ±1° 범위에만 적용합니다. 제조 Sample 표시 중 Scene의 정렬 조작은 막고 Prototype로 돌아갈 수 있습니다. Control 편집은 Prototype로 돌아가 새 Draft로 평가합니다.

미래 Schema / Content >8, Corrupt / Unsupported Model, 불가능한 단계 Snapshot, 잘못된 평가 Seed는 원본 저장 Byte를 보존하고 Session-only로 실행합니다. Preview는 저장을 읽거나 쓰지 않습니다. `file://`의 다른 배포 파일로 자동 이관을 주장하지 않으며 Text Backup / Paste Restore를 제공합니다.

## UI / QA boundaries

상단 고정 HUD는 Average Power, Worst Channel Power, Channels Pass, Prototype / Sample 출처와 실제 다음 행동을 표시합니다. 좌측 Array / Field와 우측 조작을 유지하며 모바일은 상하 배치와 고정 HUD를 사용합니다. Highlight는 활성 단계의 유효한 Control 하나에만 적용하고 Step / Chapter 전환 시 갱신합니다. Reduced Motion은 기존 기능을 그대로 사용합니다.

Node 검증은 Rigid Rotation / Pitch의 해석 좌표, Gaussian 전달률, 극단 채널 합격, 실제 AND 기반 제품 판정, 공정 Cohort / Detection / 경제 조건 / 독립 Seed / Migration / Bounds / 이전 Release Hash를 포함합니다. Browser 검증은 기존 Campaign 전체 다음에 실제 FAU 4→8→16 흐름, ± / native Mouse / Keyboard / Touch, 저장·Sample·고정 지표와 320–1440 px Layout을 실행합니다. 실행 결과는 `TEST_SUMMARY.md`와 JSON Report에 분리합니다.

채널 선택은 SVG 클릭 / Tab과 함께 장면 아래 Native Select로 제공하며 터치 조작 높이 44px를 확보합니다. 작은 모바일 Array에서도 개별 Channel의 실제 Loss / Field를 선택할 수 있습니다.
