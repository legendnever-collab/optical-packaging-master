# v0.7.0 Final Release

SMF → Glass WG → Bare Silicon → Mode Converter → Passive Packaging → Manufacturing의 6개 개발 Chapter로 기본 경험을 재구성했습니다. 기존 Mission 01–10, Free Practice, Interface Builder와 v0.6 Assembly Challenge는 Optional Engineering Lab에 보존합니다.

새 기능: 정규화된 회전 Elliptical/Complex Gaussian Overlap, Lens q/Ray/Coordinate 통합, 교육용 Converter Reference, 동일 Cohort의 Passive 설계 비교, 실제 Component 설치, Frozen Project와 제조 연결, 명확한 완료 CTA, Auto Resume와 Paste-first Backup/Restore, 설계 재전달 Archive.

기준선: main v0.5 `80fe758`; 개발 기준 v0.6 `2d52ce7`, 아직 열린 PR #6. 이 PR을 main에 바로 비교하면 v0.6 변경도 포함됩니다. 순서대로 검토하거나 #6 병합 후 rebase할 수 있으며 병합은 사용자 승인 후만 수행합니다.

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
