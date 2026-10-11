# v0.7 save migration and continuity

## 저장 Identity

- Legacy Mission 01–10: `optical-packaging-master.progress`, Schema 4 유지.
- v0.6 Assembly Challenge: `optical-packaging-master.assembly`, Schema 1 유지.
- 새 Campaign: `optical-packaging-master.physics-campaign`, Schema 1 / Content 7 / Model `interface-project-v7.1`.

기존 Key/Release HTML을 덮어쓰지 않습니다. 새 Campaign 첫 실행에서 지원된 Legacy Schema 1–4의 Mission/Content History와 지원된 Assembly Schema 1의 납품 Achievement를 History로 가져옵니다. 새 Chapter의 물리 실험을 수행했다고 자동 표시하지 않습니다. Legacy Lab에서 원래 기록을 계속 사용할 수 있습니다. Legacy gameVersion 표기는 이전 콘텐츠 Container를 유지합니다.

## 복원과 변경

Source/Target Mode, Converter, Optical Components/Relay, Architecture, Engineering Environment, Alignment, Fixture, Nominal Loss, Assembly Distribution/Seed, Yield, Qualification Status와 Frozen Snapshot을 저장합니다. 새로고침 시 같은 Chapter/Draft에서 재개하며 통계 결과는 저장한 조건으로 재계산합니다. Frozen 값도 검증/재계산하므로 Restore의 임의 Derived Score를 그대로 신뢰하지 않습니다.

진행은 Draft와 Frozen 결과를 분리합니다. Completed Chapter를 재실험해도 기존 Frozen 결과를 삭제하지 않습니다. Ch4 Converter를 재확정하면 Ch5의 호환 가능한 Lens 배치는 보존하고 Acceptance를 다시 검사합니다. Ch5 Optical Architecture가 바뀌어 재전달되면 Ch6의 이전 조립/제품은 Archive로 보존하고 새 Optical Project의 Qualification을 시작합니다. 설명 없이 이전 설계로 제조하거나 변경된 결과를 이전 설계의 통계로 표시하지 않습니다.

Unknown Future Campaign Schema/Content, Invalid JSON/Model/Profile/Evidence/Archive는 기존 Byte를 보존하고 Session-only로 실행합니다. 저장 차단/Quota 실패는 UI에 표시하며 세션 플레이와 Text Backup이 가능합니다. Snapshot을 지원되지 않는 구조로 복원하면 명시적으로 거절합니다. Raw legacy corrupt/future 자료도 자동 삭제하지 않습니다.

## Text Backup / Paste Restore

Sidebar의 저장 · Backup을 펼쳐 JSON 전체를 복사합니다. 다른 경로/프로필에서 Paste Restore로 검증 후 현재 Campaign을 복원합니다. 파일 선택/업로드는 필요하지 않습니다. Preview / 미래 Schema / 저장 제한으로 쓰기 권한이 없을 때 기존 데이터를 교체하지 않습니다. Legacy Key를 Restore로 덮어쓰지 않습니다.

Offline `file://`의 LocalStorage는 브라우저/프로필/파일 경로별로 다를 수 있습니다. 배포 파일을 다른 경로로 옮길 때 Backup을 권합니다. IndexedDB / Cloud Sync / Cross-file 자동 Migration을 주장하지 않습니다.

Chapter 1–4 Preview와 Vertical Slice는 저장된 Key를 읽거나 쓰지 않는 별도 Memory-only 플레이입니다. Preview는 기존 완료 기록을 영향을 주지 않습니다.

검증: Node의 Schema 1–4 이관, Future/Blocked/Corrupt 데이터 보존, Archive/Refreeze 전달 검증; Legacy Browser QA의 실제 v0.2–v0.5 파일 이관; 새 Campaign의 Refresh / Text Backup / Valid+Invalid Paste / Future Schema / Restricted Storage 실행.
