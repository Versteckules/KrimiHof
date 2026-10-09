import * as FX from '../../fx.js';
import { addInventoryItem } from '../../state.js';

export function runGadget(stationId, onSuccess) {
  let overlay = document.getElementById('gadget-fullscreen-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'gadget-fullscreen-overlay';
    overlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background: #111; z-index: 10000; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px;";
    document.body.appendChild(overlay);
  }

  // The hidden musical notes image or text
  const hiddenContent = `
    <div style="font-size:2rem; font-family:serif; line-height:1.5; color:#333; text-align:center;">
      <span style="font-size:4rem; display:block; margin-bottom:-20px;">𝄞</span>
      <br> B - A - C - H <br>
      <span style="font-size:1rem; color:#8b0000; display:block; margin-top:20px;">"St. Michaelis"</span>
    </div>
  `;

  overlay.innerHTML = `<div class="cl-gadget-wrapper"><div class="cl-gadget-screws"></div>
    <h2 style="color:var(--color-night-light); font-family:sans-serif; margin-bottom:10px;">Angekokeltes Blatt</h2>
    <p style="color:#aaa; font-family:sans-serif; margin-bottom:20px; font-size:0.9rem;">Streiche über das scheinbar leere, rußige Papier...</p>
    
    <div style="position:relative; width:300px; height:400px; background:#fff; border-radius:5px; overflow:hidden; border:2px solid #555;">
      <div style="position:absolute; width:100%; height:100%; background:#e0d8b0; display:flex; align-items:center; justify-content:center; box-sizing:border-box;">
        ${hiddenContent}
      </div>
      <canvas id="scratch-canvas2" width="300" height="400" style="position:absolute; top:0; left:0; cursor:pointer; touch-action:none;"></canvas>
    </div>
  </div>`;
  overlay.style.display = 'flex';

  const canvas = document.getElementById('scratch-canvas2');
  const ctx = canvas.getContext('2d');
  
  // Fill canvas with "soot"
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add noise
  for (let i = 0; i < 5000; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? "#2a2a2a" : "#0f0f0f";
    ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
  }

  let isDrawing = false;
  let solved = false;

  function getMousePos(evt) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX = evt.clientX;
    let clientY = evt.clientY;
    
    if (evt.touches && evt.touches.length > 0) {
      clientX = evt.touches[0].clientX;
      clientY = evt.touches[0].clientY;
    }
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  function scratch(e) {
    if (!isDrawing || solved) return;
    e.preventDefault();
    const pos = getMousePos(e);
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 25, 0, Math.PI * 2);
    ctx.fill();
    
    checkSolved();
  }

  canvas.addEventListener('mousedown', (e) => { isDrawing = true; scratch(e); });
  canvas.addEventListener('mousemove', scratch);
  window.addEventListener('mouseup', () => isDrawing = false);
  
  canvas.addEventListener('touchstart', (e) => { isDrawing = true; scratch(e); });
  canvas.addEventListener('touchmove', scratch);
  window.addEventListener('touchend', () => isDrawing = false);

  function checkSolved() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;
    
    for (let i = 3; i < pixels.length; i += 40) {
      if (pixels[i] === 0) transparent++;
    }
    
    const percentage = transparent / (pixels.length / 40);
    if (percentage > 0.45 && !solved) { 
      solved = true;
      canvas.style.transition = 'opacity 1s';
      canvas.style.opacity = '0';
      
      setTimeout(() => {
        overlay.innerHTML = `
          <h2 style="color:var(--color-amber-glow); margin-bottom:20px;">Beweis gesichert!</h2>
          <div style="background:#222; border:1px solid #d4af37; padding:20px; text-align:left; max-width:300px; margin-bottom:20px;">
            <p style="color:#ddd; font-size:0.9rem;">Unter dem Ruß verbergen sich alte Musiknoten (B-A-C-H) und ein Verweis auf die Michaeliskirche. Das ist eine heiße Spur!</p>
            <p style="color:var(--color-blood-red); font-weight:bold; margin-top:10px; font-size:0.8rem;">Neuer Beweis: Rußiges Partiturblatt</p>
          </div>
          <button class="btn-primary" id="btn-paper-done">Zurück zur Tatort-Analyse</button>
        `;

        document.getElementById('btn-paper-done').onclick = () => {
          addInventoryItem('notenblatt_heiden');
          overlay.remove();
          if (FX.playSuccessWumms) {
            FX.playSuccessWumms().then(() => onSuccess());
          } else {
            onSuccess();
          }
        };
      }, 1000);
    }
  }
}
