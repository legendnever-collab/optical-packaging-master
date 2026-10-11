# Optical Packaging Master

**v0.2.0 Release Candidate — First Light + Aim the Light**

Fiber를 직접 움직여 Optical Coupling을 성공시키는 오프라인 Engineering Game입니다. 기술 용어는 영어, 안내는 한국어입니다.

## 실행

[`dist/optical-packaging-master-v0.2.html`](dist/optical-packaging-master-v0.2.html)을 Raw / Download raw file로 다운로드한 뒤 더블클릭하세요. 또는 [`dist/optical-packaging-master-v0.2-release.zip`](dist/optical-packaging-master-v0.2-release.zip)을 풀고 HTML을 여세요. 인터넷, 설치, 서버, CDN, API Key, 파일 업로드가 필요하지 않습니다.

- **Mission 01 — Find the Light:** Fiber를 Drag하여 두 Mode 중심을 맞춥니다. Total Loss ≤1 dB.
- **Mission 02 — Alignment Challenge:** 세 초기 위치에서 각각 ≤0.4 dB. Center shortcut 없이 정렬합니다.
- **Mission 03 — Mode Size Trade-off:** ① 같은 Offset에서 카드 3개 측정 → ② Center에서 카드 3개 재측정 → ③ Fixed Waveguide에 맞는 Mode를 골라 **이 Mode로 연결**. 현재 할 일과 조건을 단계별로 표시하며, 마지막 실제 Loss ≤0.10 dB가 성공 조건입니다.
- **Mission 04 — Aim the Light:** 중심부터 맞추고 남는 Angular Loss를 확인합니다. **중심 확인 → 방향 조정 시작** 후 청록색 방향 핸들 두 개를 파란 축과 나란히 조정해 ≤0.50 dB로 연결합니다.
- **Free Practice:** 처음부터 접근 가능. X/Y, Radius, Pair Type, Tilt, Wavelength와 Fixed Loss를 자유롭게 실험합니다. Campaign Score/Unlock에 영향을 주지 않습니다.

Mouse/Touch Drag, Slider, Arrow keys는 같은 State를 조정합니다. Arrow step 0.1 µm 또는 0.1°, Shift+Arrow step 0.01. Hint는 원리를 설명합니다. Retry는 현재 실험만 초기화하며 Personal Best를 유지합니다.

## 저장과 버전 호환

Local Storage Schema 2는 v0.1 Schema 1의 완료 상태, Best Score/Loss, Tutorial과 마지막 Mission을 유지합니다. 기존 Mission 03 완료자는 Mission 04가 열립니다. 미래 버전의 알 수 없는 저장 형식은 덮어쓰지 않습니다. Browser/Profile/파일 경로에 따라 로컬 파일 저장 영역이 달라질 수 있으므로 같은 Browser와 Profile에서 실행하세요. 미완료 실험은 새로고침하면 처음부터 시작합니다. 저장 제한 환경도 현재 세션에서는 정상 플레이됩니다. Progress Reset은 확인 후 동작합니다.

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

Source `index.html`은 ESM 개발용이며 `python3 -m http.server`로 열 수 있습니다. 로컬 파일 실행에는 CSS/JS를 모두 inline한 `dist` Single HTML을 사용하세요. Physics와 game policy는 UI와 독립적입니다. Runtime 외부 의존성은 없으며 Playwright는 개발용입니다. CI는 core test/build/ZIP 검증과 실제 Chromium/Firefox/WebKit local-file 검사를 실행합니다. CI 통과는 모든 운영체제·실물 Touch Device 인증을 의미하지 않습니다.

[Game Design](docs/GAME_DESIGN.md) · [Physics Model](docs/PHYSICS_MODEL.md) · [Test Summary](docs/TEST_SUMMARY.md) · [Release Notes](docs/RELEASE_NOTES.md) · [Roadmap](docs/ROADMAP.md)

## 모델과 한계

정규화된 원형 Scalar Gaussian Spatial Overlap + 같은 평면의 Paraxial Phase Tilt를 계산합니다. Radius는 Field Amplitude 1/e 반경, 길이는 µm, UI 각도는 degree입니다. Mode Mismatch / Alignment / Angular / Fixed / Total Loss를 구분합니다. Game Score는 Physics Result를 바꾸지 않습니다. λ₀는 진공 파장, n=1은 공통 Air 매질입니다. Direction View는 각도를 4× 확대하여 표시합니다.

X/Y + 두 Tilt 성분을 구현했으며 Full 6-DOF, Gap, Beam Walk-off, Refraction, Fresnel, Full-vector EM, Polarization, Evanescent, Thermal, Adhesive, Yield는 아직 계산하지 않습니다. 큰 Mode는 횡방향 오차에는 관대하지만 Angular 오차에는 민감합니다. 실제 Package의 최적 설계라고 일반화하지 않습니다.

## Branch / Release 정책

v0.2는 검증된 v0.1 Head `49b9337f08883e6ea7dfca81b64ee21b906b8621`에서 `feature/v0.2-angular-alignment`으로 개발했습니다. v0.1 PR #1이 미병합이므로 v0.2 PR은 해당 Feature Branch를 Base로 합니다. 사용자 승인 전 main Merge, Auto-merge, Tag를 하지 않습니다. v0.1 HTML/ZIP도 보존합니다. 현재는 사용자 플레이 검토를 위한 Release Candidate입니다. 첨부 자료와 회사 문서는 공개 저장소에 재배포하지 않습니다.
