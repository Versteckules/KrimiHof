import * as FX from '../../fx.js';

export function runGadget(stationId, onSuccess) {
  let overlay = document.getElementById('gadget-fullscreen-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'gadget-fullscreen-overlay';
    overlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background: #050510; z-index: 10000; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff;";
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `<div class="cl-gadget-wrapper" style="width:100%; max-width:400px; padding:20px;">
    <div class="cl-gadget-screws"></div>
    <h2 style="font-family:var(--font-mono); margin-bottom:10px; color:#0f0; text-shadow: 0 0 10px #0f0;">REC - SIGNAL SUCHE</h2>
    <p style="color:var(--color-text-muted); font-size:0.9rem; margin-bottom:40px;">Bewege das Gerät im Raum, um die Wanzen-Frequenz zu finden.</p>
    
    <div style="width:100%; height:120px; display:flex; align-items:flex-end; justify-content:center; gap:5px; margin-bottom:30px; background: rgba(0,255,0,0.05); border: 1px solid #222; border-radius: 5px; padding: 10px;">
      <!-- EQ Bars -->
      <div class="eq-bar" style="width:15%; background:#0f0; height:10px; transition:height 0.1s; box-shadow: 0 0 10px #0f0;"></div>
      <div class="eq-bar" style="width:15%; background:#0f0; height:15px; transition:height 0.1s; box-shadow: 0 0 10px #0f0;"></div>
      <div class="eq-bar" style="width:15%; background:#0f0; height:5px; transition:height 0.1s; box-shadow: 0 0 10px #0f0;"></div>
      <div class="eq-bar" style="width:15%; background:#0f0; height:20px; transition:height 0.1s; box-shadow: 0 0 10px #0f0;"></div>
      <div class="eq-bar" style="width:15%; background:#0f0; height:10px; transition:height 0.1s; box-shadow: 0 0 10px #0f0;"></div>
    </div>
    
    <div style="width:100%; height:15px; background:#111; border: 2px solid #333; border-radius:8px; overflow:hidden;">
      <div id="wiretap-progress" style="width:0%; height:100%; background: linear-gradient(90deg, #0f0, #fff); transition:width 0.2s; box-shadow: 0 0 10px #0f0;"></div>
    </div>
    
    <button id="btn-wiretap-fallback" class="btn-secondary" style="margin-top:40px;">Signal Manuell Suchen (PC)</button>
  </div>`;
  overlay.style.display = 'flex';

  const targetAlpha = Math.floor(Math.random() * 360);
  let signalStrength = 0;
  let solved = false;
  let progress = 0;
  
  // Audio Engine for Radio Static
  let audioCtx = null;
  let noiseNode = null;
  let gainNode = null;

  function initAudio() {
    if (audioCtx || !window.AudioContext) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const bufferSize = audioCtx.sampleRate * 2; 
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = buffer;
    noiseNode.loop = true;
    
    gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.5; // Start loud static
    
    noiseNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    noiseNode.start();
  }
  
  function updateAudio(strength) {
     if (gainNode && audioCtx) {
         // Decrease static volume as strength gets closer to 1
         gainNode.gain.setTargetAtTime(Math.max(0, 0.5 - strength * 0.5), audioCtx.currentTime, 0.1);
     }
  }

  function stopAudio() {
      if (gainNode && audioCtx) {
          gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
          setTimeout(() => { if(noiseNode) noiseNode.stop(); }, 500);
      }
  }

  function handleOrientation(e) {
    if (solved) return;
    initAudio(); // Initialize on first movement
    
    const alpha = e.alpha; // Compass heading 0-360
    if (alpha === null) return;
    
    // Calculate shortest distance to target angle
    let diff = Math.abs(alpha - targetAlpha);
    if (diff > 180) diff = 360 - diff;
    
    // Signal strength 0 to 1 (only active if within 45 degrees)
    signalStrength = Math.max(0, 1 - (diff / 45)); 
    updateAudio(signalStrength);
    
    const bars = document.querySelectorAll('.eq-bar');
    bars.forEach(bar => {
      // Base height + random jitter proportional to static, plus strong bars for signal
      const noiseComponent = Math.random() * 80 * (1 - signalStrength);
      const signalComponent = signalStrength * 100;
      const h = 10 + noiseComponent + signalComponent;
      
      bar.style.height = \`\${h}px\`;
      const color = signalStrength > 0.8 ? '#0f0' : (signalStrength > 0.4 ? '#ff0' : '#f00');
      bar.style.background = color;
      bar.style.boxShadow = \`0 0 10px \${color}\`;
    });
    
    if (signalStrength > 0.95) {
      progress += 1.5;
      document.getElementById('wiretap-progress').style.width = \`\${Math.min(100, progress)}%\`;
      
      // Haptic tick
      if (progress % 10 < 2) FX.playMechanicalClick();
      
      if (progress >= 100) {
        solved = true;
        stopAudio();
        window.removeEventListener('deviceorientation', handleOrientation);
        FX.playSuccessWumms().then(() => {
          overlay.innerHTML = \`<div class="cl-gadget-wrapper"><h2 style="color:#0f0; font-family:var(--font-serif); font-size:2rem; margin-top:50px;">Abhörmaßnahme erfolgreich!</h2></div>\`;
          setTimeout(() => { overlay.remove(); onSuccess(); }, 1500);
        });
      }
    } else {
        // Lose progress slowly if looking away
        if (progress > 0) progress -= 0.5;
        document.getElementById('wiretap-progress').style.width = \`\${Math.max(0, progress)}%\`;
    }
  }

  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission().then(state => {
      if (state === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation);
          initAudio();
      }
    }).catch(console.error);
  } else {
    window.addEventListener('deviceorientation', handleOrientation);
    // Audio will start on first event
  }

  document.getElementById('btn-wiretap-fallback').onclick = () => {
    initAudio();
    let simProg = 0;
    const int = setInterval(() => {
      simProg += 5;
      updateAudio(simProg / 100);
      document.getElementById('wiretap-progress').style.width = \`\${simProg}%\`;
      if (simProg >= 100) {
        clearInterval(int);
        stopAudio();
        FX.playSuccessWumms().then(() => {
          overlay.innerHTML = \`<div class="cl-gadget-wrapper"><h2 style="color:#0f0; font-family:var(--font-serif); font-size:2rem; margin-top:50px;">Signal gefunden!</h2></div>\`;
          setTimeout(() => { overlay.remove(); onSuccess(); }, 1500);
        });
      }
    }, 100);
  };
}
