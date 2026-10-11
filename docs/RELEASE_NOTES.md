# v0.2.0 — Guided Mode Trade-off + Angular Alignment (Release Candidate)

Mission 03의 다음 행동이 불명확했던 문제를 수정했습니다. 한 화면에 비교표와 원리 질문을 모두 제시하던 흐름을 ‘같은 Offset 카드 측정 → Center 카드 측정 → 실제 연결 설계’로 교체했습니다. 현재 단계·고정 조건·측정 완료 표시를 보여주며, 최종 선택의 물리 Loss ≤0.10 dB를 확인합니다.

새 Mission 04 **Aim the Light**는 Center 이후에도 남는 Angular Loss를 관찰하고 θx/θy를 직접 Drag해 줄이는 실험입니다. 독립적인 Paraxial Phase Tilt physics, 별도 Angular Loss, 방향 Slider/Keyboard/Touch, Mode별 Angular Sensitivity 비교를 추가했습니다. Free Practice에 Tilt와 Wavelength 조정을 제공합니다.

Schema 1 →2 migration은 기존 성과를 보존하며, 알 수 없는 미래 저장 데이터는 read-only로 보호합니다. v0.1 파일도 유지합니다. 배포물은 Runtime Network 의존성 없는 Single HTML, Modular Source, 문서와 SHA-256 검증 ZIP입니다.

이는 X/Y + 두 Tilt 성분의 교육용 모델이며 Full 6-DOF나 Gap/Beam Walk-off/Refraction 계산은 아닙니다. 실행한 검사 수와 Browser Scope는 TEST_SUMMARY에 기록합니다. 사용자 승인 전 Merge/Tag하지 않습니다.
