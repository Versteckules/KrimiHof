export function runGadget(stationId, onSuccess) {
  let overlay = document.getElementById('gadget-fullscreen-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'gadget-fullscreen-overlay';
    overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background: #050510; z-index: 10000; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff;";
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
    <h2 style="font-family:var(--font-mono); margin-bottom:10px; color:#0f0;">REC - SIGNAL SUCHE</h2>
    <p style="color:var(--color-text-muted); font-size:0.9rem; margin-bottom:40px;">Bewege das Gerät, um die Frequenz zu finden.</p>
    
    <div style="width:80%; height:100px; display:flex; align-items:flex-end; justify-content:center; gap:5px; margin-bottom:30px;">
      <div class="eq-bar" style="width:20px; background:#0f0; height:10px; transition:height 0.1s;"></div>
      <div class="eq-bar" style="width:20px; background:#0f0; height:15px; transition:height 0.1s;"></div>
      <div class="eq-bar" style="width:20px; background:#0f0; height:5px; transition:height 0.1s;"></div>
      <div class="eq-bar" style="width:20px; background:#0f0; height:20px; transition:height 0.1s;"></div>
      <div class="eq-bar" style="width:20px; background:#0f0; height:10px; transition:height 0.1s;"></div>
    </div>
    
    <div style="width:80%; height:10px; background:#333; border-radius:5px; overflow:hidden;">
      <div id="wiretap-progress" style="width:0%; height:100%; background:#0f0; transition:width 0.2s;"></div>
    </div>
    
    <button id="btn-wiretap-fallback" class="btn-secondary" style="margin-top:40px;">(PC) Signal erzwingen</button>
  `;
  overlay.style.display = 'flex';

  const targetAlpha = Math.floor(Math.random() * 360);
  let signalStrength = 0;
  let solved = false;
  let progress = 0;

  function handleOrientation(e) {
    if (solved) return;
    const alpha = e.alpha; // Compass heading 0-360
    if (alpha === null) return;
    
    // Calculate shortest distance to target angle
    let diff = Math.abs(alpha - targetAlpha);
    if (diff > 180) diff = 360 - diff;
    
    // Signal strength 0 to 1
    signalStrength = Math.max(0, 1 - (diff / 45)); 
    
    const bars = document.querySelectorAll('.eq-bar');
    bars.forEach(bar => {
      const h = 10 + (Math.random() * 80 * signalStrength);
      bar.style.height = \`\${h}px\`;
      bar.style.background = signalStrength > 0.8 ? '#0f0' : (signalStrength > 0.4 ? '#ff0' : '#f00');
    });
    
    if (signalStrength > 0.9) {
      progress += 1;
      document.getElementById('wiretap-progress').style.width = \`\${Math.min(100, progress)}%\`;
      if (progress >= 100) {
        solved = true;
        window.removeEventListener('deviceorientation', handleOrientation);
        setTimeout(() => {
          overlay.innerHTML = \`<h2 style="color:#0f0; font-family:var(--font-mono); font-size:2rem; margin-top:50px;">Signal gesichert!</h2>\`;
          setTimeout(() => { overlay.remove(); onSuccess(); }, 1500);
        }, 500);
      }
    }
  }

  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission().then(state => {
      if (state === 'granted') window.addEventListener('deviceorientation', handleOrientation);
    }).catch(console.error);
  } else {
    window.addEventListener('deviceorientation', handleOrientation);
  }

  document.getElementById('btn-wiretap-fallback').onclick = () => {
    let simProg = 0;
    const int = setInterval(() => {
      simProg += 5;
      document.getElementById('wiretap-progress').style.width = \`\${simProg}%\`;
      if (simProg >= 100) {
        clearInterval(int);
        setTimeout(() => { overlay.remove(); onSuccess(); }, 1000);
      }
    }, 100);
  };
}
