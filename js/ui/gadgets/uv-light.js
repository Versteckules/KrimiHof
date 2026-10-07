import * as FX from '../../fx.js';

export function runGadget(stationId, onSuccess) {
  let overlay = document.getElementById('gadget-fullscreen-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'gadget-fullscreen-overlay';
    overlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background: #050510; z-index: 10000; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px; overflow:hidden;";
    document.body.appendChild(overlay);
  }

  const hiddenTextHTML = `
    <div style="font-family:var(--font-serif); font-size:1.8rem; font-weight:bold; color:#d200ff; text-shadow: 0 0 10px #d200ff, 0 0 20px #8b00ff; transform: rotate(-5deg); pointer-events:none; white-space:nowrap;">
      SCHLAPPEN-PAKT<br>1823 - EWIGE TREUE
    </div>
  `;

  overlay.innerHTML = `<div class="cl-gadget-wrapper" style="width: 100%; max-width: 400px; height: 500px; padding:0; overflow: hidden; position: relative;">
    <div class="cl-gadget-screws"></div>
    <h2 style="color:#d200ff; font-family:var(--font-mono); position:absolute; top:20px; left: 0; width: 100%; text-align: center; z-index:2; pointer-events:none; text-shadow: 0 0 10px #d200ff;">UV-Scanner aktiv</h2>
    <p style="color:rgba(255,255,255,0.5); position:absolute; top:60px; left: 0; width: 100%; text-align: center; z-index:2; pointer-events:none;">Wische, um die Wand abzusuchen.</p>
    
    <!-- Background Wall -->
    <div style="position:absolute; width:100%; height:100%; background: url('assets/texture_paper.webp') center/cover; filter: grayscale(100%) brightness(0.2); z-index:0;"></div>
    
    <!-- Glowing UV Layer (Masked) -->
    <div id="uv-glow-layer" style="position:absolute; width:100%; height:100%; display:flex; align-items:center; justify-content:center; z-index:1; 
         background: rgba(40, 0, 80, 0.3);
         mask-image: radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100px); 
         -webkit-mask-image: radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100px);
         mask-repeat: no-repeat; -webkit-mask-repeat: no-repeat;
         opacity: 0; transition: opacity 0.3s; pointer-events: none;">
      ${hiddenTextHTML}
    </div>
    
    <!-- Interaction Layer -->
    <div id="uv-touch-area" style="position:absolute; width:100%; height:100%; z-index:3; cursor:crosshair;"></div>
  </div>`;
  overlay.style.display = 'flex';

  const glowLayer = document.getElementById('uv-glow-layer');
  const touchArea = document.getElementById('uv-touch-area');
  let solved = false;
  let charge = 0;
  
  // Audio Context for UV Hum
  let audioCtx = null;
  let humOsc = null;
  let humGain = null;

  function startHum() {
    if (solved || humOsc) return;
    if (!window.AudioContext && !window.webkitAudioContext) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    humOsc = audioCtx.createOscillator();
    humGain = audioCtx.createGain();
    
    humOsc.type = 'sawtooth';
    humOsc.frequency.value = 60; // Low hum
    
    humGain.gain.value = 0;
    humGain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.5);
    
    humOsc.connect(humGain);
    humGain.connect(audioCtx.destination);
    humOsc.start();
  }
  
  function stopHum() {
    if (humGain && audioCtx) {
      humGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
      setTimeout(() => {
        if (humOsc) {
          humOsc.stop();
          humOsc.disconnect();
          humOsc = null;
        }
      }, 500);
    }
  }

  function moveSpotlight(e) {
    if (solved) return;
    e.preventDefault();
    
    startHum();

    const rect = touchArea.getBoundingClientRect();
    let clientX = e.clientX;
    let clientY = e.clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    glowLayer.style.maskPosition = `${x - 100}px ${y - 100}px`;
    glowLayer.style.webkitMaskPosition = `${x - 100}px ${y - 100}px`;
    glowLayer.style.opacity = '1';
    
    // Check if hovering over the text (center of the box approx)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    
    if (dist < 80) {
      charge += 2;
    } else {
      charge -= 1;
    }
    if (charge < 0) charge = 0;
    
    if (charge > 100 && !solved) {
      solved = true;
      stopHum();
      glowLayer.style.maskImage = 'none';
      glowLayer.style.webkitMaskImage = 'none';
      glowLayer.style.opacity = '1';
      glowLayer.style.background = 'rgba(60, 0, 100, 0.8)';
      
      // Pulse animation
      const anim = glowLayer.animate([
        { filter: 'brightness(1)' },
        { filter: 'brightness(2) drop-shadow(0 0 20px #d200ff)' }
      ], { duration: 500, direction: 'alternate', iterations: Infinity });
      
      setTimeout(() => {
        anim.cancel();
        overlay.innerHTML = `<div class="cl-gadget-wrapper"><h2 style="color:#d200ff; font-family:var(--font-serif); font-size:2rem; margin-top:50px;">Geheimnis gelÃ¼ftet!</h2></div>`;
        setTimeout(() => {
          overlay.remove();
          FX.playSuccessWumms().then(() => onSuccess());
        }, 1500);
      }, 2000);
    }
  }

  function hideSpotlight() {
    if (!solved) {
      glowLayer.style.opacity = '0';
      stopHum();
    }
  }

  touchArea.addEventListener('mousemove', moveSpotlight);
  touchArea.addEventListener('touchmove', moveSpotlight, {passive: false});
  touchArea.addEventListener('mouseleave', hideSpotlight);
  touchArea.addEventListener('touchend', hideSpotlight);
}
