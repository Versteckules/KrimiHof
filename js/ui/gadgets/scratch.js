import * as FX from '../../fx.js';
export function runGadget(stationId, onSuccess) {
  let overlay = document.getElementById('gadget-fullscreen-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'gadget-fullscreen-overlay';
    overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background: #000; z-index: 10000; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px;";
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `<div class="cl-gadget-wrapper"><div class="cl-gadget-screws"></div>
    <h2 style="color:#fff; font-family:var(--font-serif); margin-bottom:10px;">Brandspuren freilegen</h2>
    <p style="color:var(--color-text-muted); margin-bottom:20px;">Rubbel den dicken RuÃŸ weg, um den Text zu lesen.</p>
    
    <div style="position:relative; width:300px; height:400px; background:#fff; border-radius:5px; overflow:hidden;">
      <div style="position:absolute; width:100%; height:100%; background:#fdf5e6; color:#000; font-family:var(--font-mono); font-size:1.2rem; font-weight:bold; padding:20px; box-sizing:border-box;">
        <br><br>Das Feuer von 1823...<br>es war kein Unfall.<br>Der Pakt der Erben...<br><br>Sie haben mich gefunden.<br>- Dr. Renger
      </div>
      <canvas id="scratch-canvas" width="300" height="400" style="position:absolute; top:0; left:0; cursor:pointer; touch-action:none;"></canvas>
    </div>
  </div>`;
  overlay.style.display = 'flex';

  const canvas = document.getElementById('scratch-canvas');
  const ctx = canvas.getContext('2d');
  
  // FÃ¼lle den Canvas mit "RuÃŸ" (Dunkelgrau/Schwarz Textur-Simulation)
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Bisschen Rauschen hinzufÃ¼gen
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
    // Stichproben-ÃœberprÃ¼fung der Pixel fÃ¼r Performance
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;
    
    // PrÃ¼fe jeden 40. Pixel
    for (let i = 3; i < pixels.length; i += 40) {
      if (pixels[i] === 0) transparent++;
    }
    
    const percentage = transparent / (pixels.length / 40);
    if (percentage > 0.55 && !solved) { // 55% freigerubbelt
      solved = true;
      // Entferne Rest komplett
      canvas.style.transition = 'opacity 1s';
      canvas.style.opacity = '0';
      
      setTimeout(() => {
        overlay.innerHTML = \`<h2 style="color:var(--color-amber-glow); font-family:var(--font-serif); font-size:2rem; margin-top:50px;">Beweis gesichert!</h2>\`;
        setTimeout(() => {
          overlay.remove();
          FX.playSuccessWumms().then(() => onSuccess());
        }, 1500);
      }, 1500);
    }
  }
}
