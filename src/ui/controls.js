export function bindControls({move,attempt,selectMode,selectPair,selectFixed}) {
 for(const axis of ['x','y']){const input=document.getElementById(`${axis}-offset`);input.addEventListener('input',()=>move(axis,Number(input.value)));input.addEventListener('change',attempt);}
 document.getElementById('mode-size').addEventListener('change',e=>selectMode(Number(e.target.value)));
 document.getElementById('pair-type').addEventListener('change',e=>selectPair(e.target.value));
 document.getElementById('fixed-interface').addEventListener('input',e=>selectFixed(Number(e.target.value)));
 document.getElementById('fixed-interface').addEventListener('change',attempt);
}
