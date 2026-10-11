# v0.3.0 — Gameplay Redesign & Passive Alignment (Release Candidate)

같은 Alignment 조작을 반복하던 Chapter 1을 재설계했습니다. Mission 01은 Input/Output Light와 선택적 성공음을 강조합니다. Mission 02는 제한된 검사로 실제 위치/크기/각도 Fault를 진단하고 복구합니다. Mission 03은 강제 측정 순서를 없애고 두 Assembly 환경에서 예측·실험·설계 확정을 수행합니다. Mission 04는 Center가 이미 일치한 장치의 숨은 Direction Error를 발견하고 교정합니다.

Chapter 2에 세 미션을 추가했습니다: 10개 부품 관찰과 100–10000 Sample의 Assembly Lottery, 고정 공정/고정 Waveguide에서 Fiber Radius 연속 최적화, 최대 세 저장 설계의 공통 Sample 비교와 공정 변화 대응입니다. Yield, 95% Wilson CI, Histogram, P95, 실제 Failed/Worst Sample과 명시적 Robustness Margin을 표시합니다.

v0.2 Gaussian Spatial/Paraxial Angular Physics와 기존 Physics Tests는 보존했습니다. 독립 Normal Errors/Bias, 재현 가능한 uint32 Seed, 공통 Samples와 통계 모듈을 추가했습니다. Scores는 Physics를 변경하지 않습니다. Schema 3는 이전 성과를 보존하며 새 콘텐츠 Achievement를 분리하고 설계 평가 조건을 저장합니다. Unknown Schema와 저장 제한 환경도 보호합니다.

배포는 외부 Asset 없는 Single HTML, Modular Source, Gameplay Audit/Model/QA 문서, 정확한 bytes/SHA-256 검증 ZIP입니다. 실제 테스트 수와 Browser 범위는 TEST_SUMMARY.md를 확인하세요. 사람 대상 학습효과, 실물 휴대기기, 실제 제조 Yield는 검증하지 않았습니다. Gap/Propagation/Walk-off/Lens/Refraction/Full 6-DOF나 제조 비용은 구현하지 않았습니다.

main v0.2 Merge Commit `0cb4c3a4feb69bde4c7cc59b526376116ff40e35` 기반의 증분 개발입니다. v0.1/v0.2 배포물은 유지합니다. 사용자 승인 전 main Merge/Auto-merge/Tag를 하지 않습니다.
