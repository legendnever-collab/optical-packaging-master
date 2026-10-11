export class LabSound {
 constructor(){this.context=null;this.enabled=false;}
 async unlock(enabled){
  this.enabled=enabled;if(!enabled)return false;
  try{
   this.context??=new (window.AudioContext||window.webkitAudioContext)();
   if(this.context.state!=='running'){
    let timer;try{await Promise.race([this.context.resume(),new Promise(resolve=>{timer=setTimeout(resolve,1000);})]);}finally{clearTimeout(timer);}
   }
   return this.enabled&&this.context.state==='running';
  }catch{return false;}
 }
 success(){if(!this.enabled||!this.context||this.context.state!=='running')return;try{const time=this.context.currentTime;[523.25,659.25,783.99].forEach((frequency,i)=>{const oscillator=this.context.createOscillator(),gain=this.context.createGain();oscillator.frequency.value=frequency;gain.gain.setValueAtTime(0,time+i*.10);gain.gain.linearRampToValueAtTime(.05,time+i*.10+.02);gain.gain.exponentialRampToValueAtTime(.001,time+i*.10+.25);oscillator.connect(gain);gain.connect(this.context.destination);oscillator.start(time+i*.10);oscillator.stop(time+i*.10+.26);});}catch{/* Sound is optional; no gameplay dependency. */}}
}
