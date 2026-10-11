# v0.7 user journey

Default: six physics-driven development chapters. Optional Engineering Lab preserves all ten legacy missions, Free Practice, Interface Builder and v0.6 Assembly Challenge.

| Chapter | Experienced problem | Player action | Completion | Forward context |
|---|---|---|---|---|
| 1 Connect Two Fibers | offset/tilt reduces matched-mode link | Light ON, inspect endface, drag or keyboard align, inspect direction, correct tilt | ≤0.5 dB + relevant inspections | SMF reference, successful connection baseline |
| 2 Glass Waveguide | asymmetric field differs from SMF | align/test asymmetric profile, controlled 0/90° offset experiment, inspect/improve fabrication profile | tested improved profile ≤1 dB + axis evidence | glass comparison baseline, SMF source |
| 3 Silicon Crisis | perfect alignment still ~17 dB scalar mismatch | precise center/angle, inspect fields, diagnose mismatch | correct diagnosis with zero alignment; low-loss target intentionally absent | bare-Si limitation baseline |
| 4 Mode Converter | confinement mismatch; good nominal still low yield | choose reference architecture/field, nominal test, 1000-sample variation | nominal ≤1 dB and observed insufficient passive yield | converter, effective field, failure distribution |
| 5 Passive Design | production variability, angular/space constraints | choose datum or install two lenses, move supported optical coordinates, test same cohort | nominal ≤1 dB, ≥950/1000 good, geometry / WD / components / cost | explicitly frozen optical architecture |
| 6 Manufacture | repeated product must meet cost/time as well as optics | install Carrier/Fixture, Align→Lock→Test, rework if needed, run independent 100 | prototype ≤1 dB, ≥95 good, ≤6800 Credits, ≤4000 s, fit/optical geometry | qualified model-based product |

## State language

- Experiment Completed: accepted investigation (including diagnosis in Ch3), not necessarily low-loss product.
- Design Qualified: chapter-specific numerical/evidence requirements are met.
- Engineering Specification Frozen: one explicit Ch5/6 action stores a detached snapshot for the next stage.
- Chapter Completed: snapshot/experiment recorded and next chapter unlocked.

One completion dialog reports achievement, physical cause, transferred context and next problem. Primary: **다음 개발 단계로** (final: Engineering Lab 탐색). Secondary: **현재 설계 계속 실험**. No “다시 돌아가기”, no second specification-confirmation dialog. Ch1–4 transfer experimental results rather than claim a qualified product.

Changing Glass to Silicon is explicitly announced as a new platform challenge. Old glass result remains a baseline. Replaying a completed chapter edits its draft; downstream frozen designs stay stable rather than silently reset. A new Ch4 converter handoff updates the compatible Ch5 draft while retaining lens placement and invalidating its acceptance. A changed Ch5 freeze archives the prior Ch6 manufacturing draft and starts qualification with the new exact optical project. Previous products are not silently reused for different optics.

Mouse, captured Pointer/Touch and keyboard control the supported source facet / lens / receiver / Carrier. Shift+Arrow is fine movement. Basic decisions and actual power are visible first; advanced assumptions/calculations stay collapsed. All labels include non-color status. Reduced motion keeps calculated results while shortening the optional first-ten production visualization.

Preview HTML: Chapter 1–4, memory-only, no storage reads/writes. The full RC saves/auto-resumes at a separate versioned key; Backup/Paste Restore requires no upload.


## v0.8 additive FAU Packaging

Chapter 1–6의 모델과 완료 기록을 유지하며 Chapter 7의 4→8→16-channel Array를 추가합니다. Campaign Schema 1 / Content 8은 Content 7을 검증 후 이관하며 Interface Model v7.1을 변경하지 않습니다. Array Geometry / Process / All-channel Acceptance / UX / Migration / 모델 경계의 상세 사항은 [FAU_PACKAGING.md](FAU_PACKAGING.md)를 참조하세요. v0.7 HTML·ZIP·Manifest·Preview는 그대로 보존합니다.
