# v0.7.0 Final Release

SMF → Glass WG → Bare Silicon → Mode Converter → Passive Packaging → Manufacturing의 6개 개발 Chapter로 기본 경험을 재구성했습니다. 기존 Mission 01–10, Free Practice, Interface Builder와 v0.6 Assembly Challenge는 Optional Engineering Lab에 보존합니다.

새 기능: 정규화된 회전 Elliptical/Complex Gaussian Overlap, Lens q/Ray/Coordinate 통합, 교육용 Converter Reference, 동일 Cohort의 Passive 설계 비교, 실제 Component 설치, Frozen Project와 제조 연결, 명확한 완료 CTA, Auto Resume와 Paste-first Backup/Restore, 설계 재전달 Archive.

기준선: v0.6 PR #6과 v0.7 PR #7을 병합한 main `4802888`. 이번 Layout Patch는 기존 v0.7 게임과 모델을 보존합니다.

핵심 모델 범위: Gaussian Reduced-order 교육 모델. Converter Output Field/Loss, Normal Error, Cost/Time는 명시적 가정입니다. 검증된 PDK/실측 Factory Yield를 주장하지 않습니다. 산업용 특정 제품 재현은 후속 범위입니다.

`optical-packaging-master-v0.7.html`은 외부 Asset/Font/CDN/API가 없는 Single HTML입니다. Preview는 1–4 Chapter의 단계별 구현 시점 체크포인트이며 저장 없는 모드입니다. Release ZIP은 실행본, Modular Source, 문서, 자동 QA 결과, 실제 스크린샷을 포함합니다. 기존 Release Artifact는 변경하지 않습니다.

QA 결과와 실행/미실행 엔진은 TEST_SUMMARY.md와 JSON Evidence를 참조하세요. Human Learning/Enjoyment 연구는 수행하지 않았습니다. Final UX와 Regression을 통과한 Commit을 대상으로 CI 성공 후 main에 병합합니다. v0.6 PR #6은 2ceb71e에서 선행 병합했습니다.

## Final UX Patch

- Step-aware 안내 문장, 실제 NEXT 대상과 위치 보기 버튼을 하나의 `guidance()` 상태에서 결정합니다. 성공/실패/Replay/Chapter 변경에 따라 이전 강조를 제거합니다. Disabled Control은 추천하지 않습니다. 선택이 여러 개인 원인 진단에서는 전체 선택 그룹을 표시합니다.
- 직접 행동 버튼으로 다음 Step에 도달하면 화면 밖 대상의 Panel을 열고 Scroll합니다. Slider, Fine 버튼, Drag/Keyboard 조절 중에는 자동 Scroll하지 않습니다. 위치 보기 버튼으로 언제든 직접 이동할 수 있습니다. Reduced Motion은 Animation을 제거합니다.
- X/Y ±0.1 µm, Angular X/Y ±0.05°, 현재 지원되는 Lens/Receiver 위치 ±1 µm. 수치와 단위, 44 px Touch 버튼, 경계 Clamp와 Locked/Disabled 동기화. 기존 입력 이벤트를 사용하여 Physics/저장 상태를 갱신합니다.
- Optional Lab / Assembly에도 같은 Fine Control 패턴과 유효한 Action 강조를 적용합니다.
- 이번 Patch는 복구한 cd1dae9 대비 `src/game`와 `src/physics`를 변경하지 않았습니다. 별도로 기존 Physics, Campaign, 제조, Persistence/Migration, Offline UI Regression을 실행했습니다.
- 이전 v0.1–v0.6 산출물과 처음 전달한 Chapter 1–4 Preview를 보존합니다. v0.7 UX 이전 RC도 dist/archive에 보관합니다.

## Play Layout Patch

- 데스크톱: 현재 문제와 Optical Scene은 왼쪽, 조작·실험 결과·완료 버튼은 오른쪽 Panel에 배치합니다. Chapter Navigation은 위로 이동합니다. 이전 설계 비교와 Backup은 펼쳐서 볼 수 있습니다.
- 실제 Output / Input %·Total Loss·현재 행동을 하나의 Sticky HUD에서 표시합니다. 조작 Panel에서 Scroll해도 계속 보입니다. 기존 계산값을 사용하며 Step 완료 점수와 혼동하지 않습니다. 생산 Sample 검사 시 Sample 번호를, 돌아오면 Prototype를 표시합니다.
- 화면에 충분히 들어갈 때 왼쪽 문제와 Scene도 유지합니다. HUD/Scene 크기를 측정해 작은 높이 또는 긴 목표 내용에서는 Scene 고정을 풀어 가려진 내용이 생기지 않게 합니다. 강제 Scroll이나 별도 중첩 Scroll을 추가하지 않습니다.
- Tablet/Mobile은 상하 배치하고 HUD만 유지합니다. 화면 폭 320–1440 px, 높이 480–1024 px의 실제 Browser Emulation에서 입력·표시·경계·키보드·Reduced Motion을 확인합니다.
- 기존 Alignment 이벤트, Guidance 상태, Physics/Game/Persistence 소스는 그대로입니다. 이전 main의 HTML·ZIP·Preview·Manifest는 dist/archive/*v0.7-before-layout*로 보존합니다.
