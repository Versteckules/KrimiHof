import * as FX from '../../fx.js';

export function runGadget(stationId, onSuccess) {
  let overlay = document.getElementById('gadget-fullscreen-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'gadget-fullscreen-overlay';
    overlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background: #000; z-index: 10000; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff;";
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `<div class="cl-gadget-wrapper" style="padding: 20px; width: 95vw; max-width: 500px; display: flex; flex-direction: column; align-items: center; text-align: center;">
    <div class="cl-gadget-screws"></div>
    <h2 style="font-family:var(--font-serif); margin-bottom:10px; color:var(--color-amber-glow);">Zeitreise-Archiv</h2>
    <p style="color:var(--color-text-muted); font-size:0.9rem; margin-bottom:20px;">Wische über das Bild, um die Brandherde von 1823 mit dem heutigen Infrarot-Scan der Wand abzugleichen.</p>
    
    <div id="time-slider-container" style="position:relative; width:100%; height:300px; max-width: 400px; border: 4px solid var(--color-brass-dark); border-radius: 4px; box-shadow: 0 10px 30px rgba(0,0,0,0.8); overflow:hidden; user-select: none; touch-action: none;">
      
      <!-- Base Image (1823 Historic) -->
      <div style="position:absolute; top:0; left:0; width:100%; height:100%; background: url('assets/intro_fire_1823.jpg') center/cover; filter: sepia(0.3) contrast(1.1);">
        <div style="position:absolute; top:10px; left:10px; color:#fff; font-family:var(--font-serif); font-size: 1.2rem; opacity: 0.7; text-shadow: 1px 1px 2px #000;">1823</div>
      </div>

      <!-- Overlay Image (Today IR Scan) -->
      <div id="time-slider-overlay" style="position:absolute; top:0; left:0; width:50%; height:100%; overflow:hidden; border-right: 4px solid var(--color-amber-glow); box-shadow: 5px 0 15px rgba(0,0,0,0.5);">
         <div style="position:absolute; top:0; left:0; width:100%; height:100%; background: url('assets/intro_fire_1823.jpg') center/cover; filter: grayscale(1) invert(0.8) brightness(0.6) contrast(2); min-width: 400px;">
           <div style="position:absolute; top:10px; right:10px; color:#0f0; font-family:var(--font-mono); font-size: 1.2rem; opacity: 0.8; text-shadow: 1px 1px 2px #000;">IR-SCAN</div>
         </div>
         
         <!-- The Slider Handle -->
         <div id="time-slider-handle" style="position:absolute; top:50%; right:-20px; transform:translateY(-50%); width:40px; height:40px; background:radial-gradient(circle, #d4af37, #8b6508); border:2px solid #3e3215; border-radius:50%; box-shadow: 0 0 10px rgba(0,0,0,0.8); display:flex; align-items:center; justify-content:center; cursor:ew-resize;">
            <div style="width:2px; height:15px; background:#3e3215; margin: 0 2px;"></div>
            <div style="width:2px; height:15px; background:#3e3215; margin: 0 2px;"></div>
         </div>
      </div>

    </div>

    <div id="time-slider-hint" style="margin-top: 20px; font-family:var(--font-mono); color:var(--color-amber-glow); opacity:0; transition: opacity 0.5s;">Die Brandmuster stimmen überein!</div>
    
    <button id="btn-time-slider-done" class="btn-primary" style="margin-top:20px; opacity: 0; pointer-events: none; transition: opacity 0.5s;">Akte aktualisieren</button>
  </div>`;
  overlay.style.display = 'flex';

  const container = document.getElementById('time-slider-container');
  const overlayImg = document.getElementById('time-slider-overlay');
  const handle = document.getElementById('time-slider-handle');
  const hint = document.getElementById('time-slider-hint');
  const btnDone = document.getElementById('btn-time-slider-done');
  
  let isDragging = false;
  let solved = false;

  function setSliderPosition(clientX) {
    if (solved) return;
    const rect = container.getBoundingClientRect();
    let x = clientX - rect.left;
    
    // Constraints
    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;
    
    const percentage = (x / rect.width) * 100;
    overlayImg.style.width = percentage + '%';

    // Click sound every 10%
    if (Math.floor(percentage) % 10 === 0) {
       // Debounce click to avoid too many sounds
       if (!container.dataset.lastTick || Math.abs(container.dataset.lastTick - percentage) >= 10) {
           FX.playMechanicalClick();
           container.dataset.lastTick = percentage;
       }
    }

    // Win condition: if slider is pushed to the far right (checking the whole image)
    if (percentage > 95) {
      solved = true;
      overlayImg.style.width = '100%';
      handle.style.display = 'none';
      hint.style.opacity = '1';
      btnDone.style.opacity = '1';
      btnDone.style.pointerEvents = 'auto';
      FX.playHeavySnap();
    }
  }

  function startDrag(e) {
    if (solved) return;
    isDragging = true;
    setSliderPosition(e.touches ? e.touches[0].clientX : e.clientX);
  }

  function moveDrag(e) {
    if (!isDragging) return;
    e.preventDefault();
    setSliderPosition(e.touches ? e.touches[0].clientX : e.clientX);
  }

  function endDrag() {
    isDragging = false;
  }

  container.addEventListener('mousedown', startDrag);
  window.addEventListener('mousemove', moveDrag);
  window.addEventListener('mouseup', endDrag);

  container.addEventListener('touchstart', startDrag, {passive: false});
  window.addEventListener('touchmove', moveDrag, {passive: false});
  window.addEventListener('touchend', endDrag);

  btnDone.onclick = () => {
    overlay.innerHTML = `<div class="cl-gadget-wrapper"><h2 style="color:var(--color-amber-glow); font-family:var(--font-serif); font-size:2rem; text-align:center;">Beweis gesichert!</h2></div>`;
    setTimeout(() => { overlay.remove(); FX.playSuccessWumms().then(() => onSuccess()); }, 1000);
  };
}
