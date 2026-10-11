export function learningSummary(id,before,after) {
 const learn={
  1:{title:'First Light Achieved!',happened:`Error를 줄여 Total Loss가 ${before.toFixed(2)} → ${after.toFixed(2)} dB로 변했습니다.`,why:'두 Gaussian Mode의 중심이 가까워지면서 Field Overlap이 증가했습니다.',principle:'동일한 Mode와 Zero Offset에서는 이 이상적인 모델의 Efficiency가 100%입니다.',real:'실제 Fiber-to-Waveguide Assembly에서는 정렬 외에도 반사, Mode 형상, Gap, 각도, 접착·열 변화가 추가됩니다.'},
  2:{title:'Alignment Challenge Mastered',happened:'서로 다른 초기 위치의 세 Challenge를 정렬했습니다. 각 Loss는 기록된 실제 계산값입니다.',why:'동일한 Radius에서 Alignment Loss는 dx² + dy²에 비례합니다. Offset을 두 배로 늘리면 Alignment Loss는 네 배가 됩니다.',principle:'Narrow Mode에서는 같은 횡방향 Error가 더 큰 Loss를 만듭니다. 정확도와 조작 효율은 별도의 Game Score로 평가합니다.',real:'정렬 공정에서는 최적점을 찾는 능력과 측정·조정 시간 모두 중요합니다. v0.1은 실제 공정 시간을 예측하지 않습니다.'},
  3:{title:'Mode Trade-off Understood',happened:'동일한 Offset에서 Matched pair와 Fixed Waveguide의 세 Mode를 비교했습니다.',why:'Matched Mode를 함께 키우면 횡방향 Error에 둔감해지지만, Fixed Waveguide에서는 Mode 크기 차이에 따른 Mismatch가 남습니다.',principle:'Alignment Tolerance와 Mode Matching은 서로 다른 설계 축입니다. 큰 Mode가 항상 최선은 아닙니다.',real:'실제 Spot-size Converter 설계는 Mode Matching, Footprint, Bend, 파장·편광 및 제조 가능성을 함께 검토합니다. 이 게임은 그중 횡방향 Gaussian Overlap만 계산합니다.'}
 };return learn[id];
}
export function showLearning(dialog,learn,score,loss,extra='') {
 document.getElementById('dialog-content').innerHTML=`<h2>${learn.title}</h2><div class="summary-score"><div><strong>${score}</strong><span>GAME SCORE / 1000</span></div><div><strong>${loss.toFixed(2)} dB</strong><span>PHYSICS RESULT${extra}</span></div></div><h3>What Happened?</h3><p>${learn.happened}</p><h3>Why Did It Happen?</h3><p>${learn.why}</p><h3>Engineering Principle</h3><p>${learn.principle}</p><h3>Real-world Packaging Connection</h3><p>${learn.real}</p>`;
 dialog.showModal();
}
