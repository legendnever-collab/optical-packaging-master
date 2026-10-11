# Optical Packaging Master v0.7.0

SMF에서 시작해 Glass Waveguide, Bare Silicon의 Mode Mismatch, Spot Size Conversion, Passive Optical Architecture와 제조 Qualification까지 배우는 Offline Engineering Game입니다.

- Final UX: 현재 행동 안내 / 하나의 NEXT 대상 / 화면 밖 Control로 이동 / X·Y ±0.1 µm / θx·θy ±0.05° / Lens·Receiver ±1 µm. Drag·Keyboard·Touch와 같은 상태를 사용합니다.
- 기존 v0.7 RC HTML/ZIP/Manifest는 `dist/archive/*v0.7-before-ux*`로 보존했습니다.
- 기본 Campaign: 6개 Chapter, Physically motivated technology sequence.
- Optional Engineering Lab: 기존 Mission 01–10 / Interface Builder / v0.6 Assembly Challenge 보존.
- 실행: `dist/optical-packaging-master-v0.7.html`을 브라우저에서 여세요. 설치/네트워크/파일 업로드가 필요 없습니다.
- 중간 Preview: `dist/optical-packaging-master-v0.7-chapters-1-4-preview.html`, 저장 없는 Chapter 1–4 체크포인트.
- Source/모델/QA/스크린샷: `dist/optical-packaging-master-v0.7-release.zip`.

정규화된 2D Gaussian, 기존 q/ABCD와 같은 좌표의 Ray 전달, 동일 Normal Cohort / 독립 생산 Seed를 사용합니다. Converter와 공정 숫자는 교육용 가정이며 실제 PDK 또는 공장 인증을 뜻하지 않습니다. `docs/PHYSICS_MODEL.md`, `docs/MODEL_LIMITATIONS.md`, `docs/USER_JOURNEY.md`, `docs/MIGRATION.md`를 참조하세요.

```bash
npm ci
npm test
npm run build
node scripts/build.mjs --vertical-slice
npm run test:ui       # Legacy regression; OPM_BROWSERS로 엔진 선택
npm run test:campaign # 새 6개 Chapter 실제 버튼/Pointer/저장 흐름
npm run release
python3 scripts/release.py --verify
```

main v0.5 / v0.6 PR #6의 `2d52ce7` 기반. v0.7 Branch `feature/v0.7-physics-driven-campaign`. 사용자 승인 없이 Merge/Tag/Release하지 않습니다.

아래는 이전 개발 기록입니다.

---

# Optical Packaging Master

**v0.6.0 Release Candidate — Assemble, Lock & Test**

Fiber-to-PIC Package를 직접 정렬하고, Lens를 설치하고, 조립품을 생산·검사하는 오프라인 Engineering Game입니다. 안내는 한국어, 기술 용어는 영어입니다.

## Assembly Challenge — 새 개발 내용

상단 **Assembly Challenge**로 바로 진입합니다. Campaign을 완료할 필요가 없습니다. Fixture/공정 선택 → Carrier 설치 → Facet Alignment → Lock → Optical Test → 100개 생산 → Inspection/재작업 → 납품 순서입니다. **Good ≥95, Cost ≤4800 Credits, Time ≤3200 s**를 함께 만족해야 합니다.

- 실제 지정 치수의 Carrier/PIC 직사각형과 Package 경계, 40 µm Clearance, Datum Mount Slot을 검사합니다. Carrier Drag/Keyboard는 기구 좌표와 실제 Optical X에 연결됩니다. Facet 현미경은 실제 X/Y와 Mode Radius를 같은 스케일로 보여줍니다.
- Lock 후 조작할 수 없으며 Unlock 비용을 지불해 재작업합니다. 부품 오차+Fixture 오차+공통 Datum Bias를 기존 Gaussian Phase-Tilt Engine에 입력합니다.
- Passive, per-unit Active Alignment, 불량 Active 재작업을 비교합니다. First Pass/Final Yield, 실제 양품·재작업 수량, P95, Wilson CI, 시간·비용/양품을 구분합니다. 시간·비용·공정 수치는 모두 **Assumed**입니다.
- Prototype Seed와 독립 생산 Seed가 다릅니다. 설계 3개는 동일 생산 Seed에서 비교하며 Configuration과 평가 조건을 저장합니다. 단일 100개 주문을 통과한 결과이며 산업 양산 인증이 아닙니다.
- Assembly draft·Lock·Test·납품·설계 비교는 별도 버전 저장 키로 자동 복원됩니다. 기존 Campaign Schema 4와 Mission 01–10 기록은 그대로 보존합니다. 각 Reset은 자신이 담당하는 기록만 삭제합니다.

[Assembly Model / Geometry / Costs](docs/ASSEMBLY_CHALLENGE.md)에 좌표, 공차, 비용과 검증 경계를 명시했습니다. 이 Challenge는 Fiber-to-PIC common-plane 모델이며 Lens/q와 Decenter/Tilt를 통합하지 않습니다.

## Hardware-first 플레이

기본 Workbench에는 Fiber Body/Core/Facet, PIC/Waveguide/Port, Lens/Mount, Ideal Mirror, Receiver, Mechanical Base와 Datum 개념도가 나타납니다. **Light ON → 부품 조작 → 실제 출력 관찰 → 실패 검사 → 설계 수정 → Achievement** 순서로 플레이합니다. Hardware / Optical / Engineering / Inspection은 같은 Engineering State를 사용합니다. Gaussian Mode와 수식·기존 수치 제어는 Advanced를 열어 볼 수 있습니다.

- Mission 01: Fiber Body/Facet을 PIC Port로 Drag하여 First Light를 점등합니다.
- Mission 05: 실제 Seeded Samples 10개가 PLACE → OPTICAL TEST → SORT를 통과합니다. GOOD/REJECT와 전체 생산 Dashboard를 먼저 보고, 실패 Package를 눌러 X/Y·Tilt·Loss를 확대 검사합니다. 전체 100/1000/10000 통계는 기존 엔진으로 계산합니다.
- Mission 09: Inventory의 Lens를 광로로 Drag & Drop합니다. 설치한 Body를 이동하거나 선택한 Lens의 Focal Length를 바꾸면 실제 Beam Envelope와 Receiver Power가 변합니다. 버튼/Keyboard 설치 대안도 있습니다.

Zoom/Pan/Exploded는 표시 기능입니다. 물리 상태를 바꾸지 않습니다. Campaign 01–10의 Body 크기와 2.5D 배치는 교육용 개념도입니다. 새 Assembly Challenge의 Carrier/PIC 직사각형 Layout만 지정 치수로 기구 Fit을 계산합니다. [Coordinate Mapping](docs/PHYSICAL_SCENE_ARCHITECTURE.md)에 변환과 각 모델의 경계를 기록했습니다.

## 실행

[실행 HTML](dist/optical-packaging-master-v0.6.html)을 **Download raw file**로 다운로드해 더블클릭하세요. [Release ZIP](dist/optical-packaging-master-v0.6-release.zip)을 풀고 HTML을 열어도 됩니다. 인터넷, 설치, 서버, CDN, API Key, 파일 업로드가 필요하지 않습니다. 이전 v0.1/v0.2/v0.3/v0.4/v0.5 실행 파일도 보존합니다.

| Mission | 지금 할 일 | 새로운 문제 |
| --- | --- | --- |
| 01 First Light | 청록색 Fiber를 드래그해 출력광을 밝히기 | Input 100%와 실제 Output Power의 차이 |
| 02 Find the Fault | 최대 2개 검사 → 원인 진단 → 복구, 장치 3개 | 위치 / Mode 크기 / 방향 Fault 구분 |
| 03 Choose the Optical Interface | 설계 예측 → 실험 → 연결안 확정, 환경 2개 | 위치가 정밀한 환경과 방향이 안정적인 환경은 다른 설계 필요 |
| 04 Aim the Light | 일치한 중심 확인 → 숨은 Direction 검사 → 방향 핸들 조정 | Center가 같아도 Angular Loss 발생 |
| 05 Assembly Factory | 10개 조립 관찰 → 100/1,000/10,000 평가 → 실패 부품 확인 | Nominal 0 dB와 Assembly Yield는 다름 |
| 06 Make It Tolerant | 고정 Waveguide/공정에서 Fiber Radius 하나를 연속 조정 | 동일 Sample에서 Yield ≥95% 달성 |
| 07 Beat the Factory | 설계 2–3개 저장·비교 → 공정 변화에 대응 | 두 공정에서 Yield ≥95%, P95 ≤1 dB |
| 08 Catch the Focus | Receiver를 Z 방향으로 드래그해 Waist에 놓기 | Center가 같아도 Defocus와 Curvature로 Loss 발생 |
| 09 Bridge the Gap | Thin Lens 설치 → 위치와 Focal Length 조정 | 1,000 µm 광로의 실제 Beam Size/Curvature 연결 |
| 10 Fit the Package | Relay 선택 → Lens B / Fold 위치 조정 | Mode Expansion, 3점 Gap 확인, Package 공간 동시 만족 |

Interface Builder도 처음부터 열립니다. Source/Target Waist, 입력 Waist 위치, Wavelength, Receiver Z, 0–2개 Lens와 Ideal Fold를 실험하세요. Mouse/Touch와 방향키로 Receiver/Lens/Mirror를 움직이고, 빈 광로를 클릭해 Beam Radius/Curvature를 확인합니다. Builder의 마지막 구성은 자동 저장됩니다. Chapter 3는 Coaxial q/ABCD 모델이며 X/Y 또는 Tilt를 조합하지 않습니다.

Free Practice는 처음부터 열립니다. X/Y, Tilt, Radius, Matched/Fixed Pair, Wavelength와 Fixed Loss를 자유롭게 실험하며 Campaign 성과를 바꾸지 않습니다. Mouse/Touch Drag, Sliders와 Arrow keys가 같은 State를 공유합니다. Shift+Arrow는 미세 조정입니다. Sound는 기본 OFF이며 켜면 오프라인 Web Audio로 성공음을 합성합니다. Retry는 현재 실험만 초기화합니다.

[Vertical Slice HTML](dist/optical-packaging-master-v0.6-vertical-slice.html)은 01/05/09를 순서 제한 없이 바로 열어볼 수 있는 독립 검토 빌드입니다. 초기 중간 Snapshot은 Phase Commit에 보존했습니다. Assembly Challenge도 열어볼 수 있고 두 저장 키를 모두 읽거나 덮어쓰지 않는 메모리 플레이이며, 최종 Campaign은 기존 Unlock 규칙을 유지합니다.

## 저장과 호환

저장 구조 변경 없이 Local Storage Schema 4는 v0.1/v0.2/v0.3 완료, Best Score/Loss와 Unlock을 보존합니다. 새 Gameplay의 Achievement는 별도로 표시합니다. v0.3/v0.4의 Mission 01–10 Achievement, Factory Design/evaluation과 Builder Configuration은 유지됩니다. 기존 content version 3/4를 유지해 완료 기록을 다시 요구하지 않습니다. Mission 07 완료자는 Chapter 3가 열리며 이전 미션을 Replay할 수 있습니다. 설계 3개와 최근 평가 조건(Seed, 공정 Bias/Sigma, Sample Count, 모델, 기준, 결과)을 저장합니다. Campaign 미완료 실험은 새로고침 시 다시 시작하며 독립 Builder는 마지막 Configuration을 복원합니다.

Browser/Profile/파일 경로에 따라 file:// 저장 영역이 달라질 수 있습니다. 같은 Browser/Profile에서 실행하세요. 저장 제한 환경에서도 현재 세션 플레이가 가능합니다. 알 수 없는 미래 저장 형식은 덮어쓰지 않으며 Progress Reset은 확인 후 동작합니다.

## 개발과 검증

Node ≥22, Python ≥3.10:

```bash
npm test
npm run build
npm ci
npx playwright install --with-deps chromium firefox webkit
npm run test:ui
npm run release
python3 scripts/release.py --verify
```

Source `index.html`은 ESM 개발용이며 `python3 -m http.server`로 열 수 있습니다. 배포 HTML은 CSS/JS 전체를 inline한 classic script로 로컬에서 실행합니다. Physics, statistical engine와 game policy는 UI와 독립적입니다. Playwright는 개발용 의존성입니다. CI는 core tests, deterministic build, ZIP 및 실제 세 Browser Engine의 로컬 파일 검사를 실행합니다. 실제 결과와 미검증 범위는 [Test Summary](docs/TEST_SUMMARY.md)에 기록합니다.

[Game Design](docs/GAME_DESIGN.md) · [Gameplay Audit](docs/GAMEPLAY_AUDIT.md) · [Physics Model](docs/PHYSICS_MODEL.md) · [Release Notes](docs/RELEASE_NOTES.md) · [Roadmap](docs/ROADMAP.md)

## 모델과 한계

기존 Gaussian Spatial Overlap + Common-plane Paraxial Phase Tilt를 보존했습니다. Radius는 Field Amplitude의 1/e 반경, 길이는 µm, UI 각도는 degree이며 계산 시 radian으로 변환합니다. Game Score는 물리 결과를 바꾸지 않습니다. Independent Normal Assembly Errors와 명시적 Bias/Sigma에 대해 Seed를 고정한 Monte Carlo를 추가했습니다. 설계 비교에는 동일 Error Sample을 사용합니다. Yield, 95% Wilson CI, P95, 실패 Sample과 Worst Case를 표시합니다.

공정 분포와 목표는 학습용 가정이며 실제 제조 데이터를 보정한 결과가 아닙니다. CI는 고정 설계의 표본 불확실성입니다. 같은 Sample에 설계를 반복 최적화하면 별도 Seed의 검증이 필요합니다. Chapter 3는 별도 Scalar Paraxial q/ABCD 모듈로 Free Space, Thin Lens, Waist 변환과 Wavefront Curvature의 Coaxial Overlap을 계산합니다. Lens 0.10 dB/개, Fold Mirror 0.15 dB는 별도 Fixed Loss 가정입니다. Fold는 Unfolded 광로 길이를 유지하는 Ideal 좌표 변환과 Centerline Footprint만 계산합니다. Mission 10은 ΔZ −100/0/+100 µm 세 점만 검사하며 연속 Tolerance나 Yield를 검증하지 않습니다. Aperture, 부품 폭, Lens/Mirror Angle, Walk-off, Refraction, Fresnel, Aberration, Full-vector EM, Polarization, Thermal/Adhesive, Full 6-DOF는 계산하지 않습니다. Campaign의 기구/비용 모델과 새 Challenge의 지정 직사각형/가정 비용을 구분합니다. 큰 Mode가 모든 Package에서 우수하다고 일반화하지 않습니다.

## 개발 기준

최신 main의 v0.5 병합 SHA `80fe758062745772da7f7f3c5f16a84eaa7b2f56`를 확인하고 `feature/v0.6-assemble-lock-test`를 생성했습니다. v0.4/v0.5 의존성은 main에 병합되어 해소됐습니다. 이번 v0.6 PR은 main 대상으로 만들며 사용자 승인 없이 병합/Tag하지 않습니다.

RC는 플레이 검토용입니다. 사람 대상 학습 효과/재미·만족도와 실물 휴대기기는 미검증입니다. 첨부 자료와 회사 문서 bytes는 공개 저장소에 재배포하지 않습니다.
