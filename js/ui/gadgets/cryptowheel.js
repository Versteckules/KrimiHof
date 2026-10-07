import * as FX from '../../fx.js';
export function runGadget(stationId, onSuccess) {
  let overlay = document.getElementById('gadget-fullscreen-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'gadget-fullscreen-overlay';
    overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background: #111; z-index: 10000; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff;";
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `<div class="cl-gadget-wrapper"><div class="cl-gadget-screws"></div>
    <h2 style="font-family:var(--font-serif); margin-bottom:30px; color:var(--color-amber-muted);">Chiffrierscheibe</h2>
    
    <div style="position:relative; width:300px; height:300px; border-radius:50%; background:radial-gradient(circle, #8a733f, #3e3215); box-shadow:0 10px 30px rgba(0,0,0,0.8); display:flex; align-items:center; justify-content:center; border: 4px solid #b89947;">
      
      <!-- Outer Ring (Static) -->
      <div style="position:absolute; width:280px; height:280px; border-radius:50%; border:2px dashed rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center;">
        <span style="position:absolute; top:5px; font-weight:bold; font-size:1.2rem; color:#111;">A</span>
        <span style="position:absolute; bottom:5px; font-weight:bold; font-size:1.2rem; color:#111;">N</span>
        <span style="position:absolute; left:10px; font-weight:bold; font-size:1.2rem; color:#111;">W</span>
        <span style="position:absolute; right:10px; font-weight:bold; font-size:1.2rem; color:#111;">O</span>
      </div>

      <!-- Inner Ring (Rotatable) -->
      <div id="crypto-inner-ring" style="position:absolute; width:180px; height:180px; border-radius:50%; background:radial-gradient(circle, #e2c778, #b89947); border:3px solid #3e3215; display:flex; align-items:center; justify-content:center; cursor:grab; box-shadow:inset 0 0 10px rgba(0,0,0,0.5); transition: transform 0.1s ease-out; transform: rotate(0deg);">
        <span style="position:absolute; top:5px; font-weight:bold; font-size:1.2rem; color:#111;">M</span>
        <span style="position:absolute; bottom:5px; font-weight:bold; font-size:1.2rem; color:#111;">Z</span>
        <span style="position:absolute; left:10px; font-weight:bold; font-size:1.2rem; color:#111;">B</span>
        <span style="position:absolute; right:10px; font-weight:bold; font-size:1.2rem; color:#111;">L</span>
        
        <div style="width:20px; height:20px; border-radius:50%; background:#3e3215; border:2px solid #111;"></div>
      </div>
      
    </div>
    <p style="color:var(--color-text-muted); margin-top:30px; font-size:0.9rem;">Drehe den inneren Ring. Richte 'A' auf 'M' aus.</p>
  </div>`;
  overlay.style.display = 'flex';

  const innerRing = document.getElementById('crypto-inner-ring');
  let currentRotation = 0;
  let isDragging = false;
  let startAngle = 0;
  let solved = false;
  
  function getAngle(x, y) {
    const rect = innerRing.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
  }

  function startDrag(e) {
    if (solved) return;
    isDragging = true;
    let clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let clientY = e.touches ? e.touches[0].clientY : e.clientY;
    startAngle = getAngle(clientX, clientY) - currentRotation;
    innerRing.style.cursor = 'grabbing';
  }

  function moveDrag(e) {
    if (!isDragging || solved) return;
    let clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let clientY = e.touches ? e.touches[0].clientY : e.clientY;
    let angle = getAngle(clientX, clientY);
    
    currentRotation = angle - startAngle;
    innerRing.style.transform = \`rotate(\${currentRotation}deg)\`;
    
    // Snap and Check (A on M means 0 degrees rotation, since they start aligned at top)
    // Wait, M is at top of inner ring, A is at top of outer ring. 
    // They start aligned. Let's say the target is to align 'A' with 'Z' (180 deg).
    // Let's modify target to 180 deg for some rotation.
    let normalized = (currentRotation % 360 + 360) % 360;
    if (Math.abs(normalized - 180) < 10 && !solved) { // Snap to 180
      currentRotation = 180;
      innerRing.style.transform = \`rotate(\${currentRotation}deg)\`;
      solved = true;
      innerRing.style.boxShadow = "0 0 30px #ffdf00, inset 0 0 20px #ffdf00";
      
      setTimeout(() => {
        overlay.innerHTML = \`<h2 style="color:var(--color-amber-glow); font-family:var(--font-serif); font-size:2rem; margin-top:50px;">Code entschlÃ¼sselt!</h2>\`;
        setTimeout(() => {
          overlay.remove();
          FX.playSuccessWumms().then(() => onSuccess());
        }, 1500);
      }, 1000);
    }
  }

  function endDrag() {
    isDragging = false;
    innerRing.style.cursor = 'grab';
  }

  innerRing.addEventListener('mousedown', startDrag);
  window.addEventListener('mousemove', moveDrag);
  window.addEventListener('mouseup', endDrag);

  innerRing.addEventListener('touchstart', startDrag, {passive: true});
  window.addEventListener('touchmove', moveDrag, {passive: true});
  window.addEventListener('touchend', endDrag);
}
