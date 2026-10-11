# Gameplay Design — v0.4

Observe → Predict → Experiment → Diagnose → Decide → Improve. 첫 행동과 목표가 중앙 상단에 보이며, Mission에 필요한 조작만 나타납니다. 네 가지 Mechanic은 Precision Control, Fault Diagnosis, Design Decision, Engineering Optimization입니다. 전체 Mission별 Unique Action / Principle / Failure / Success / Reward는 [Gameplay Audit](GAMEPLAY_AUDIT.md)의 Differentiation Matrix에 명시합니다.

## Chapter 1 — First Light

**01 First Light.** Matched Radius 2.5 µm, 초기 X/Y=(4,−3) µm, Total Loss ≤1 dB. Fiber Drag/Slider/Keyboard와 Center 도움을 유지합니다. Input 100%와 실제 Total transmitted fraction을 비교하고, 광선 밝기·두께와 Optical Scene의 Transmission을 계산 결과로 갱신합니다. 첫 성공은 화면 Achievement와 선택적 합성 Sound를 제공합니다. 짧은 안내만 사용합니다. 1–2분 입문 이해는 설계 목표이며 사람 대상으로 검증한 사실은 아닙니다.

**02 Find the Fault.** 첫 화면은 Total Loss와 Output Power만 제공합니다. Scene, Offset/Radius/Tilt Controls, Loss 분해와 접근성 측정도 숨깁니다. 장치별 서로 다른 검사 2회까지 가능합니다. Center / Tilt / Radius 검사로 실제 Parameter를 공개합니다. 이미 선택한 검사는 추가 비용을 쓰지 않습니다. 두 정상 검사를 통해 배제하거나 Fault 검사를 통해 직접 식별할 수 있습니다.

| 장치 | 실제 초기 Physics State | 우세 원인 | 실제 Corrective Action |
| --- | --- | --- | --- |
| A | w1=w2=2.5; dx=2.5, dy=−1.5 µm; Tilt=0 | Lateral | dx=dy=0 |
| B | w1=1.2, w2=4 µm; Centers/Tilt=0 | Mismatch | w1=w2 |
| C | w1=w2=4; Centers=0; θx=3°, θy=−2° | Angular | θx=θy=0 |

최소 한 검사 후 Root Cause와 Corrective Action을 선택합니다. 잘못된 복구도 해당 Parameter만 실제로 바꾸며 Loss를 재계산합니다. 올바른 진단 + 복구 + 실제 Loss ≤0.5 dB를 세 장치에서 충족해야 완료됩니다. 초급 사례는 원인 하나가 우세하도록 구성했으며 실제 장치의 복합 Fault를 부정하지 않습니다.

**03 Choose the Optical Interface.** 강제 카드 측정 순서를 없앴습니다. Matched Small/Medium/Expanded Radius=1.5/2.5/4 µm 중 예측 → 실험 → 연결안 확정으로 진행합니다. 상세 Comparison은 선택사항입니다. Radius Pair가 함께 바뀌는 가상의 Interface 선택이며 렌즈/변환기의 구조를 시뮬레이션하지 않습니다.

| 환경 | 고정 X/Y µm | 고정 θx/θy ° | 요구 Loss | Small / Medium / Expanded 실제 dB | 적합한 선택 |
| --- | --- | --- | --- | --- | --- |
| A High-Precision Assembly | 0.15 / 0.10 | 2.50 / 1.80 | ≤0.25 | 0.179 / 0.345 / 0.834 | Small |
| B Relaxed Positioning | 1.40 / 0.80 | 0.15 / 0.10 | ≤0.90 | 5.019 / 1.808 / 0.709 | Expanded |

이 값들은 확률적 Yield가 아닌 대표 오차 상태의 결정론적 비교입니다. Direction을 그림으로 먼저 소개하고 위상 설명은 Mission 04에서 제공합니다. 같은 설계가 모든 환경에서 PASS하지 않습니다.

**04 Aim the Light.** 초기 Center Error는 0이며 Radius=4, θx=3°, θy=−2°입니다. Center 재확인으로 Loss가 변하지 않는 것을 관찰합니다. Direction 검사 후 두 핸들과 θ Controls가 열립니다. X/Y는 고정하며 실제 Total Loss ≤0.5 dB이면 완료합니다. Direction Views는 각도 4× 확대를 표시하고 Shift+Arrow/Pointer Capture를 유지합니다. 완성 후 매 부품의 Active Alignment가 공정 시간·비용에 어떤 문제를 줄지 질문합니다. 실제 비용은 계산하지 않습니다.

## Chapter 2 — Design for Tolerance

모든 Length는 µm, UI Tilt는 degree, λ0=1.55 µm, n=1, Fixed Loss=0입니다. 각 Process는 독립 Normal Bias/Sigma를 명시합니다. PASS 기준은 Sample Total Loss ≤1 dB입니다. Nominal은 Error=0 상태이므로 Systematic Bias도 Nominal에 포함하지 않습니다. 같은 설계·Seed·공정·Count는 같은 결과를 만듭니다.

| 공정 | σX=σY µm | Bias X/Y µm | σθx=σθy ° | Bias θx/θy ° | 사용 |
| --- | ---: | --- | ---: | --- | --- |
| A Lateral 우세 | 0.70 | 0 / 0 | 0.12 | 0 / 0 | 05, 07 round 1 |
| Optimization | 0.45 | 0 / 0 | 0.30 | 0 / 0 | 06 |
| B Angular 증가 | 0.20 | 0.12 / 0 | 0.45 | 2.50 / 1.80 | 07 round 2 기본 |
| C Systematic Bias | 0.45 | 0.75 / 0 | 0.22 | 0 / 0 | 07 선택 Challenge |

**05 Assembly Lottery.** Radius와 Matched/Fixed Waveguide를 설계한 뒤 10개 실제 Sample의 Power/Loss/PASS/FAIL을 짧게 재생합니다. 이후 100/1000/10000 통계를 계산합니다. 전체 부품을 애니메이션으로 강제하지 않습니다. Histogram, Yield/CI, Counts, Nominal/P95와 실제 실패/Worst Sample의 State 및 우세 Loss를 조사합니다. 완료 조건은 10개 관찰 + ≥100개 평가 + 현재 결과의 실패 부품 검사입니다. 높은 Yield 경쟁보다 Variation 발견이 목적입니다. 실패가 전혀 없는 설계는 다른 설계를 실험해야 합니다. Retry/Navigation은 재생을 취소합니다. N을 늘리면 같은 Seed의 기존 Sample Prefix를 보존합니다.

**06 Make It Tolerant.** Waveguide=2.5 µm와 Optimization 공정을 고정하고 Fiber Radius 1–5 µm, step 0.1 하나만 조정합니다. 1000 Sample, Seed=20261011을 매 조작마다 공통으로 사용합니다. X/Y 및 θx/θy 2D Sensitivity Map은 실제 Total Loss로 계산하며 밝기는 Output Power, Cell 설명은 Loss/PASS/FAIL입니다. 다른 Error는 0입니다. 목표는 반올림 전 Yield ≥95%입니다. 예: Fiber 2.7 µm는 97.8%이지만 4 µm는 Mismatch 때문에 낮아집니다. 범위 내 최적점을 탐색하는 미션으로, 카드 선택인 Mission 03과 구분됩니다.

**07 Beat the Factory.** Matched Pair 또는 WG=2.5 Fixed Pair를 사용해 이름 붙인 설계를 3개까지 저장합니다. 최소 2개를 같은 1000 Error Samples에서 평가합니다. 표는 Yield/95% CI, Nominal, P95, Robustness=1 dB−P95, Worst actual Sample과 우세 원인을 보여줍니다. 채택 시 Yield ≥95% 및 P95 ≤1 dB를 확인합니다. 첫 공정을 승인하면 Angular/Bias 공정으로 바뀌며 기존 설계를 다시 비교하거나 수정합니다. 두 공정 모두 승인해야 완료됩니다. 기본 Seed에서 matched 2.5/4 µm의 Nominal은 동일 0 dB지만 A Yield=77.3%/97.8%, B=100.0%/72.5%로 순위가 반전됩니다. Round 2에 C 공정을 선택해 재생할 수 있습니다.

## Score / Feedback / Replay

Physics 값을 Score로 수정하지 않습니다. Mission 01/02/04는 기존 gameScore 함수를 사용합니다: 600+300 max(0,1−Loss/Target), 효율 보상 max(0,100−4 max(0,Attempts−1)), Hint당 −20, 총 0–1000. Mission 02는 세 복구 중 Worst Loss를 사용합니다. Mission 03은 각 환경의 실제 Loss/Target Score 평균, Best Loss는 Worst Environment입니다. Mission 05는 표본 실험 보상 min(1000,800+50 log10(N)−20 Hints)입니다. Mission 06은 1000 Yield−20 Hints, Mission 07은 두 승인 공정 Score 평균입니다. Chapter 2 Best Loss는 P95이며 Mission 07은 두 공정의 Worst P95입니다. 표시한 반올림 수치로 PASS를 결정하지 않습니다.

완료 화면은 What Happened / Why / Engineering Principle / Real-world Packaging Connection 네 부분을 제공합니다. Hint는 순차적 개념 설명입니다. 완료 후 Next/Replay, 전체 Free Practice와 Personal Best를 유지합니다. Dark Navy instrument 스타일, Keyboard Focus, text PASS/FAIL과 Reduced Motion을 유지하며 Sound는 사용자 선택입니다.

## Persistence / Architecture

기존 Schema 1/2→3 migration (v0.4는 Schema 4): 기존 01–04 기록과 Unlock을 보존하고 새 콘텐츠 Best/Badge는 `content[id].version=3`로 분리합니다. 최신 세 평가 Snapshot에 Seed/Count/Process/Model/Threshold를 함께 보관합니다. 불완전한 Session은 저장하지 않습니다. 알 수 없는 미래 Schema는 read-only입니다. 모든 저장 장애에 메모리 플레이를 제공합니다.

`physics/assembly.js`는 샘플 생성·통계를 UI와 분리합니다. `game/scenarios.js`는 진단과 환경/공정 정책, `ui/assembly-view.js`는 표현을 맡습니다. Saved Design의 Pair Type과 평가 Model Version을 명시하지만 v0.4 Optical System Builder나 ABCD 모델은 구현하지 않았습니다. 자동 Gameplay Test와 Browser 실제 Campaign은 동작 검증이며 사람의 재미/학습 효과에 대한 증거는 아닙니다.

## Chapter 3 — Build the Interface

08 **Catch the Focus** introduces Z as a different control from XY. Given converging source: waist radius 10 µm at z=400, target waist 10, λ₀=1.55, input n=1, Receiver initially z=760. No lens/fold controls. Drag the Receiver or use arrows/slider until Total Loss ≤0.50 dB. Matching centers alone does not match curvature. Successful example z=400 gives 0 dB. Achievement: Focus Captured.

09 **Bridge the Gap** fixes Receiver z=1000, source/target waist radius 10. Start without a lens: actual loss about 8.50 dB. Install one ideal lens (z=500,f=420 initially insufficient), then move its position or change focal length. Acceptance requires exactly one lens and actual Total Loss ≤0.50 including its assumed 0.10 dB. Example z=500,f=291 reaches approximately 0.10 dB. The two controls expose refocusing rather than another center alignment. Achievement: Gap Bridged.

10 **Fit the Package** requests radius 10→20 over nominal unfolded length 1800. Select compact f=200/400 or expanded f=300/600 relay, move Lens B and place an ideal fold. Lens A catalog position is fixed. A long straight relay at z=300/1200 optically matches (0.20 dB fixed) but fails package width. Ideal fold at z=900 retains the same q but gives nominal centerline 900×900 and adds 0.15 dB. At Receiver ΔZ=−100/0/+100, loss worst≈0.3665 dB and all footprints ≤1000×1000. Compact catalog relay at this Receiver does not meet the combined target. Acceptance requires two lenses, a fold, all three loss values ≤0.55, all three footprints fit. No fabricated fold bonus or asserted whole-range Yield. Achievement: Optical Interface Designed.

Central scene shows actual w(z), source/target and ordered lens/Receiver/mirror handles. Empty-path click reports radius, curvature, Rayleigh range and local waist distance. Color does not substitute for text PASS/FAIL. The folded layout is a separate centerline route because an unfolded Gaussian envelope should not imply tracing reflection or component dimensions.

## Independent Interface Builder

Accessible regardless of campaign unlocks. Source/target waist 5–30 µm, incoming waist location 0–1000, λ₀=1.31/1.55, Receiver Z=300–2500, zero/one/two ordered ideal lenses with f=80–1200, and optional ideal 90° Fold. Train presets start from input waist z=0. Drag/slider/keyboard share one validated configuration. Invalid component order/path is rejected, not repaired silently. Runtime source config and calculation modules stay separate; unknown optical component types are unsupported.

Schema 4 autosaves the last valid independent Builder snapshot (`gaussian-q-v1`) with source, target, wavelength, index, waist location, lens order/parameters, receiver and fixed-loss assumptions. Campaign retries reset only the current experiment; practice cannot alter best scores or completions. Missions 01–07 retain content version 3, Mission 08–10 use version 4. v0.3 factory designs/evaluation snapshots and legacy scores survive migration. Mission 10 stored best/score uses the three-point worst loss, while the main power meter displays nominal power and the gap table displays off-nominal checks. Both are labeled explicitly.
