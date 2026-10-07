import * as FX from '../../fx.js';

export function runGadget(stationId, onSuccess) {
  let overlay = document.getElementById('gadget-fullscreen-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'gadget-fullscreen-overlay';
    overlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background: #000; z-index: 10000; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff;";
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `<div class="cl-gadget-wrapper" style="padding: 10px; width: 95vw; height: 90vh; max-width: 500px; display: flex; flex-direction: column;">
    <div class="cl-gadget-screws"></div>
    <h2 style="font-family:var(--font-serif); margin-top: 10px; margin-bottom:10px; color:#0f0; text-align: center; text-shadow: 0 0 10px #0f0;">IR-Scanner</h2>
    <p style="color:var(--color-text-muted); font-size:0.9rem; margin-bottom:10px; text-align: center;">Scanne die Umgebung nach Infrarot-Spuren.</p>
    
    <div id="scanner-view-container" style="flex-grow: 1; width: 100%; position: relative; background: #111; border: 2px solid #333; border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
      <video id="scanner-video" autoplay playsinline style="width: 100%; height: 100%; object-fit: cover; filter: grayscale(100%) sepia(100%) hue-rotate(70deg) saturate(500%) brightness(1.2) contrast(1.5);"></video>
      <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px); pointer-events: none;"></div>
      <div id="scanner-reticle" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80px; height: 80px; border: 2px solid rgba(0, 255, 0, 0.5); border-radius: 10px; pointer-events: none; transition: all 0.3s;">
        <div style="position: absolute; top: -5px; left: 30px; width: 20px; height: 10px; background: #000;"></div>
        <div style="position: absolute; bottom: -5px; left: 30px; width: 20px; height: 10px; background: #000;"></div>
        <div style="position: absolute; left: -5px; top: 30px; height: 20px; width: 10px; background: #000;"></div>
        <div style="position: absolute; right: -5px; top: 30px; height: 20px; width: 10px; background: #000;"></div>
      </div>
      <div id="scanner-status" style="position: absolute; bottom: 10px; left: 0; width: 100%; text-align: center; color: #0f0; font-family: var(--font-mono); font-size: 0.8rem; text-shadow: 0 0 5px #0f0;">INITIALISIERUNG...</div>
      
      <!-- The Hidden Clue (starts invisible, fades in) -->
      <div id="scanner-clue" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.5); opacity: 0; color: #fff; text-shadow: 0 0 20px #0f0, 0 0 10px #0f0; font-family: var(--font-serif); font-size: 3rem; pointer-events: none; transition: all 2s ease-out;">
        &#x2620;
      </div>
    </div>

    <button id="btn-scanner-skip" class="btn-secondary hidden" style="align-self: center;">Sensor überspringen</button>
  </div>`;
  overlay.style.display = 'flex';

  const video = document.getElementById('scanner-video');
  const statusEl = document.getElementById('scanner-status');
  const skipBtn = document.getElementById('btn-scanner-skip');
  const reticle = document.getElementById('scanner-reticle');
  const clue = document.getElementById('scanner-clue');
  
  let stream = null;
  let scanProgress = 0;
  let scanInterval = null;
  let solved = false;

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (scanInterval) clearInterval(scanInterval);
  }

  function finishScan() {
    if (solved) return;
    solved = true;
    stopCamera();
    
    reticle.style.borderColor = '#0f0';
    reticle.style.transform = 'translate(-50%, -50%) scale(1.2)';
    clue.style.opacity = '1';
    clue.style.transform = 'translate(-50%, -50%) scale(1)';
    statusEl.textContent = "ZIEL ERFASST!";
    statusEl.style.color = "#fff";
    
    setTimeout(() => {
      overlay.innerHTML = \`<div class="cl-gadget-wrapper"><h2 style="color:var(--color-amber-glow); font-family:var(--font-serif); font-size:2rem; text-align:center;">Spur gesichert!</h2></div>\`;
      setTimeout(() => {
        overlay.remove();
        FX.playSuccessWumms().then(() => onSuccess());
      }, 1500);
    }, 2500);
  }

  // Timer to show skip button if taking too long or error
  const skipTimeout = setTimeout(() => {
    skipBtn.classList.remove('hidden');
  }, 5000);

  skipBtn.onclick = () => {
    if (solved) return;
    solved = true;
    clearTimeout(skipTimeout);
    stopCamera();
    overlay.innerHTML = \`<div class="cl-gadget-wrapper"><h2 style="color:var(--color-amber-glow); font-family:var(--font-serif); font-size:2rem; text-align:center;">Manuell umgangen!</h2></div>\`;
    setTimeout(() => { overlay.remove(); FX.playSuccessWumms().then(() => onSuccess()); }, 1000);
  };

  // Start Camera
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(videoStream => {
        stream = videoStream;
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play();
          statusEl.textContent = "SCANNE UMGEBUNG...";
          
          // Simulate scanning process
          scanInterval = setInterval(() => {
            if (solved) return;
            scanProgress += 5;
            
            // Randomly flash reticle
            if (Math.random() > 0.7) {
              reticle.style.borderColor = 'rgba(0, 255, 0, 0.8)';
              setTimeout(() => reticle.style.borderColor = 'rgba(0, 255, 0, 0.3)', 100);
              FX.playMechanicalClick();
            }

            if (scanProgress >= 100) {
              finishScan();
            } else if (scanProgress % 20 === 0) {
              statusEl.textContent = \`ANALYSIERE... \${scanProgress}%\`;
            }
          }, 300);
        };
      })
      .catch(err => {
        console.warn("Camera access denied or unavailable", err);
        statusEl.textContent = "KAMERA OFFLINE";
        statusEl.style.color = "red";
        skipBtn.classList.remove('hidden');
      });
  } else {
    statusEl.textContent = "SENSOR NICHT UNTERSTÜTZT";
    statusEl.style.color = "red";
    skipBtn.classList.remove('hidden');
  }
}
