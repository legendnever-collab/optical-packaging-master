# Optical Packaging Master

**v0.3.0 Release Candidate — Engineering Problem-Solving + Design for Tolerance**

Fiber를 직접 움직여 빛을 연결한 다음, 출력 저하를 진단하고 조립 환경에 맞는 설계를 선택하는 오프라인 Engineering Game입니다. 안내는 한국어, 기술 용어는 영어입니다.

## 실행

[실행 HTML](dist/optical-packaging-master-v0.3.html)을 **Download raw file**로 다운로드해 더블클릭하세요. [Release ZIP](dist/optical-packaging-master-v0.3-release.zip)을 풀고 HTML을 열어도 됩니다. 인터넷, 설치, 서버, CDN, API Key, 파일 업로드가 필요하지 않습니다. 이전 v0.1/v0.2 실행 파일도 보존합니다.

| Mission | 지금 할 일 | 새로운 문제 |
| --- | --- | --- |
| 01 First Light | 청록색 Fiber를 드래그해 출력광을 밝히기 | Input 100%와 실제 Output Power의 차이 |
| 02 Find the Fault | 최대 2개 검사 → 원인 진단 → 복구, 장치 3개 | 위치 / Mode 크기 / 방향 Fault 구분 |
| 03 Choose the Optical Interface | 설계 예측 → 실험 → 연결안 확정, 환경 2개 | 위치가 정밀한 환경과 방향이 안정적인 환경은 다른 설계 필요 |
| 04 Aim the Light | 일치한 중심 확인 → 숨은 Direction 검사 → 방향 핸들 조정 | Center가 같아도 Angular Loss 발생 |
| 05 The Assembly Lottery | 10개 조립 관찰 → 100/1,000/10,000 평가 → 실패 부품 확인 | Nominal 0 dB와 Assembly Yield는 다름 |
| 06 Make It Tolerant | 고정 Waveguide/공정에서 Fiber Radius 하나를 연속 조정 | 동일 Sample에서 Yield ≥95% 달성 |
| 07 Beat the Factory | 설계 2–3개 저장·비교 → 공정 변화에 대응 | 두 공정에서 Yield ≥95%, P95 ≤1 dB |

Free Practice는 처음부터 열립니다. X/Y, Tilt, Radius, Matched/Fixed Pair, Wavelength와 Fixed Loss를 자유롭게 실험하며 Campaign 성과를 바꾸지 않습니다. Mouse/Touch Drag, Sliders와 Arrow keys가 같은 State를 공유합니다. Shift+Arrow는 미세 조정입니다. Sound는 기본 OFF이며 켜면 오프라인 Web Audio로 성공음을 합성합니다. Retry는 현재 실험만 초기화합니다.

## 저장과 호환

Local Storage Schema 3는 v0.1/v0.2 완료, Best Score/Loss와 Unlock을 보존합니다. 새 Gameplay의 Achievement는 별도로 표시합니다. 기존 Mission 01–04 완료자는 Chapter 2가 열리며 이전 미션을 Replay할 수 있습니다. 설계 3개와 최근 평가 조건(Seed, 공정 Bias/Sigma, Sample Count, 모델, 기준, 결과)을 저장합니다. 미완료 실험은 새로고침 시 다시 시작합니다.

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

공정 분포와 목표는 학습용 가정이며 실제 제조 데이터를 보정한 결과가 아닙니다. CI는 고정 설계의 표본 불확실성입니다. 같은 Sample에 설계를 반복 최적화하면 별도 Seed의 검증이 필요합니다. Gap, Lens, Walk-off, Refraction, Fresnel, Full-vector EM, Polarization, Thermal/Adhesive Reliability, 비용이나 Full 6-DOF는 계산하지 않습니다. 큰 Mode가 모든 Package에서 우수하다고 일반화하지 않습니다.

## 개발 기준

최신 main `0cb4c3a4feb69bde4c7cc59b526376116ff40e35`를 직접 확인하고 `feature/v0.3-gameplay-redesign`에서 증분 개발했습니다. Feature Branch와 main 대상 PR을 제공하며 사용자 승인 전 Merge, Auto-merge, Tag를 하지 않습니다. RC는 플레이 검토용입니다. 사람 대상 학습 효과/만족도 테스트와 실물 휴대기기 검증은 수행하지 않았습니다. 첨부 자료와 회사 문서 bytes는 공개 저장소에 재배포하지 않습니다.
