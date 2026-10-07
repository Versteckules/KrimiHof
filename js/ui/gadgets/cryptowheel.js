import * as FX from '../../fx.js';
export function runGadget(stationId, onSuccess) {
  let overlay = document.getElementById('gadget-fullscreen-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'gadget-fullscreen-overlay';
    overlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background: #111; z-index: 10000; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff;";
    document.body.appendChild(overlay);
  }

  let outerHTML = '';
  let innerHTML = '';
  const outerLetters = ['A','B','C','D','E','F','G','H','I','J','K','L'];
  const innerLetters = ['M','N','O','P','Q','R','S','T','U','V','W','X'];
  
  for(let i=0; i<12; i++) {
    const angle = i * 30;
    outerHTML += `<span style="position:absolute; top:5px; left:50%; transform: translateX(-50%) rotate(${angle}deg); transform-origin: 50% 135px; font-weight:bold; font-size:1.1rem; color:#111;">${outerLetters[i]}</span>`;
    innerHTML += `<span style="position:absolute; top:5px; left:50%; transform: translateX(-50%) rotate(${angle}deg); transform-origin: 50% 85px; font-weight:bold; font-size:1.1rem; color:#111;">${innerLetters[i]}</span>`;
  }

  overlay.innerHTML = `<div class="cl-gadget-wrapper"><div class="cl-gadget-screws"></div>
    <h2 style="font-family:var(--font-serif); margin-bottom:30px; color:var(--color-amber-muted);">Chiffrierscheibe</h2>
    
    <div style="position:relative; width:300px; height:300px; border-radius:50%; background:radial-gradient(circle, #8a733f, #3e3215); box-shadow:0 10px 30px rgba(0,0,0,0.8); display:flex; align-items:center; justify-content:center; border: 4px solid #b89947;">
      
      <!-- Outer Ring (Static) -->
      <div style="position:absolute; width:280px; height:280px; border-radius:50%; border:2px dashed rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center;">
        ${outerHTML}
      </div>

      <!-- Inner Ring (Rotatable) -->
      <div id="crypto-inner-ring" style="position:absolute; width:180px; height:180px; border-radius:50%; background:radial-gradient(circle, #e2c778, #b89947); border:3px solid #3e3215; display:flex; align-items:center; justify-content:center; cursor:grab; box-shadow:inset 0 0 10px rgba(0,0,0,0.5); transition: transform 0.1s ease-out; transform: rotate(0deg);">
        ${innerHTML}
        <div style="position:absolute; width:100%; height:100%; top:0; left:0; border-radius:50%;"></div>
      </div>
      
    </div>
    <p style="color:var(--color-text-muted); margin-top:30px; font-size:0.9rem;">Drehe den inneren Ring. Richte 'A' auf 'R' aus.</p>
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
    innerRing.style.transform = `rotate(${currentRotation}deg)`;
    
    // Snap and Check (A on M means 0 degrees rotation, since they start aligned at top)
    // Wait, M is at top of inner ring, A is at top of outer ring. 
    // M is 0. R is 5 letters away -> 5 * 30 = 150 degrees.
    let normalized = (currentRotation % 360 + 360) % 360;
    if (Math.abs(normalized - 150) < 10 && !solved) { // Snap to 150
      currentRotation = 150;
      innerRing.style.transform = `rotate(${currentRotation}deg)`;
      solved = true;
      innerRing.style.boxShadow = "0 0 30px #ffdf00, inset 0 0 20px #ffdf00";
      
      setTimeout(() => {
        overlay.innerHTML = `<h2 style="color:var(--color-amber-glow); font-family:var(--font-serif); font-size:2rem; margin-top:50px;">Code entschlüsselt!</h2>`;
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
