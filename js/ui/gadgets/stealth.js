import * as FX from '../../fx.js';

export function runGadget(stationId, onSuccess) {
  let overlay = document.getElementById('gadget-fullscreen-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'gadget-fullscreen-overlay';
    overlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background: #050505; z-index: 10000; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff;";
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `<div class="cl-gadget-wrapper" style="padding: 20px; width: 95vw; max-width: 400px; display: flex; flex-direction: column; align-items: center; text-align: center; border-color: #333;">
    <div class="cl-gadget-screws"></div>
    <h2 style="font-family:var(--font-serif); margin-bottom:10px; color:#555; text-shadow: 0 0 10px #000;">Schleich-Modus</h2>
    <p style="color:var(--color-text-muted); font-size:0.9rem; margin-bottom:20px;">Tippe exakt dann, wenn der Puls-Ring den weiÃŸen Kreis berÃ¼hrt. <br>Mach keinen LÃ¤rm!</p>
    
    <!-- LÃ¤rm-Meter -->
    <div style="width: 100%; height: 10px; background: #111; border: 1px solid #333; margin-bottom: 30px; position: relative;">
       <div id="stealth-noise-bar" style="height: 100%; width: 0%; background: #f00; transition: width 0.3s;"></div>
       <div style="position: absolute; top: -20px; right: 0; font-size: 0.7rem; color: #f00;">LÃ„RM</div>
    </div>

    <!-- Radar / Rhythm Area -->
    <div id="stealth-radar" style="width:250px; height:250px; border-radius:50%; background: radial-gradient(circle, #1a1a1a, #0a0a0a); display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; border: 2px solid #222; box-shadow: inset 0 0 20px #000, 0 5px 15px rgba(0,0,0,0.8); touch-action: none;">
      
      <!-- Target Circle (Sweet Spot) -->
      <div style="position:absolute; width:100px; height:100px; border-radius:50%; border: 2px dashed rgba(255,255,255,0.5);"></div>
      
      <!-- Expanding/Shrinking Pulse -->
      <div id="stealth-pulse" style="position:absolute; width:250px; height:250px; border-radius:50%; border: 4px solid #fff; box-shadow: 0 0 10px #fff; pointer-events: none;"></div>
      
      <!-- Tap Button -->
      <button id="btn-stealth-tap" style="width: 80px; height: 80px; border-radius: 50%; background: #111; border: 2px solid #555; color: #fff; font-family: var(--font-mono); font-size: 1.2rem; cursor: pointer; box-shadow: 0 0 10px #000; outline: none; z-index: 2;">SCHRITT</button>
      
    </div>
    
    <div id="stealth-progress" style="margin-top: 30px; font-size: 1.5rem; font-family: var(--font-mono); color: #0f0; text-shadow: 0 0 10px #0f0;">0 / 5</div>
  </div>`;
  overlay.style.display = 'flex';

  const pulse = document.getElementById('stealth-pulse');
  const btnTap = document.getElementById('btn-stealth-tap');
  const progressText = document.getElementById('stealth-progress');
  const noiseBar = document.getElementById('stealth-noise-bar');
  const radar = document.getElementById('stealth-radar');
  
  let steps = 0;
  let noise = 0;
  let solved = false;
  let pulseSize = 250;
  let pulseDirection = -1; // shrinking
  let speed = 2.5; // pixels per frame

  let animFrame;

  function animatePulse() {
    if (solved) return;
    pulseSize += (speed * pulseDirection);
    
    if (pulseSize <= 50) {
      pulseDirection = 1; // start growing
    } else if (pulseSize >= 250) {
      pulseDirection = -1; // start shrinking
    }
    
    pulse.style.width = pulseSize + 'px';
    pulse.style.height = pulseSize + 'px';
    
    animFrame = requestAnimationFrame(animatePulse);
  }

  // Start Animation
  animatePulse();

  btnTap.addEventListener('pointerdown', (e) => {
    if (solved) return;
    e.preventDefault();
    
    // Press effect
    btnTap.style.transform = 'scale(0.9)';
    setTimeout(() => btnTap.style.transform = 'scale(1)', 100);

    // Evaluate timing
    // Target is width 100px. Sweet spot is between 80 and 120
    if (pulseSize >= 80 && pulseSize <= 120) {
      // Perfect step
      steps++;
      progressText.textContent = `${steps} / 5`;
      pulse.style.borderColor = "#0f0";
      pulse.style.boxShadow = "0 0 20px #0f0";
      FX.playMechanicalClick();
      
      // Speed up slightly to increase difficulty
      speed += 0.5;

      setTimeout(() => {
        if (!solved) {
          pulse.style.borderColor = "#fff";
          pulse.style.boxShadow = "0 0 10px #fff";
        }
      }, 300);

      if (steps >= 5) {
        solved = true;
        cancelAnimationFrame(animFrame);
        btnTap.style.background = "#0f0";
        btnTap.style.color = "#000";
        setTimeout(() => {
          overlay.innerHTML = `<div class="cl-gadget-wrapper"><h2 style="color:var(--color-amber-glow); font-family:var(--font-serif); font-size:2rem; text-align:center;">Erfolgreich vorbeigeschlichen!</h2></div>`;
          setTimeout(() => { overlay.remove(); FX.playSuccessWumms().then(() => onSuccess()); }, 1500);
        }, 1000);
      }

    } else {
      // Missed (Noise)
      noise += 34; // 3 strikes and you're out (100%)
      noiseBar.style.width = noise + '%';
      
      pulse.style.borderColor = "#f00";
      pulse.style.boxShadow = "0 0 20px #f00";
      FX.shakeElement(radar); // Play error sound and shake
      
      setTimeout(() => {
        if (!solved) {
          pulse.style.borderColor = "#fff";
          pulse.style.boxShadow = "0 0 10px #fff";
        }
      }, 300);

      if (noise >= 100) {
        // Reset logic (caught)
        steps = 0;
        noise = 0;
        speed = 2.5;
        progressText.textContent = "GEFASST! NEUSTART.";
        progressText.style.color = "#f00";
        noiseBar.style.width = "0%";
        
        setTimeout(() => {
          progressText.textContent = `${steps} / 5`;
          progressText.style.color = "#0f0";
        }, 2000);
      }
    }
  });
}
