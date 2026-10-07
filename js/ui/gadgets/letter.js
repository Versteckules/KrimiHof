import * as FX from '../../fx.js';

export function runGadget(stationId, onSuccess) {
  let overlay = document.getElementById('gadget-fullscreen-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'gadget-fullscreen-overlay';
    overlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background: #0a0a0a; z-index: 10000; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff;";
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `<div class="cl-gadget-wrapper" style="width: 100%; max-width: 400px; height: 500px; padding: 20px;">
    <div class="cl-gadget-screws"></div>
    <h2 style="font-family:var(--font-serif); margin-bottom:10px; color:var(--color-amber-glow);">Zerrissenes Dokument</h2>
    <p style="color:var(--color-text-muted); font-size:0.9rem; margin-bottom:20px;">Ziehe die Schnipsel zusammen.</p>
    
    <div id="puzzle-area" style="position:relative; width:100%; height:350px; background: url('assets/texture_paper.webp') center/cover; filter: contrast(1.1) brightness(0.5); border: 2px solid var(--color-brass-dark); border-radius: 5px; box-shadow: inset 0 0 30px rgba(0,0,0,0.8); overflow:hidden; touch-action: none;">
      
      <!-- Target Area outlines -->
      <div style="position:absolute; top: 100px; left: 60px; width: 220px; height: 160px; border: 2px dashed rgba(255,255,255,0.1); pointer-events: none;"></div>

      <div class="puzzle-piece" data-target-x="60" data-target-y="100" style="position:absolute; top:10px; left:10px; width:110px; height:80px; background:#fdf5e6; color:#111; padding:10px; cursor:grab; box-shadow: 2px 5px 10px rgba(0,0,0,0.8); border: 1px solid #d4c4a8; display:flex; align-items:center; justify-content:center; font-family:var(--font-serif); font-size:0.9rem; transform: rotate(-5deg); z-index: 1;">
         "Wenn Sie<br>dies lesen...
      </div>
      <div class="puzzle-piece" data-target-x="170" data-target-y="100" style="position:absolute; top:250px; left:20px; width:110px; height:80px; background:#fdf5e6; color:#111; padding:10px; cursor:grab; box-shadow: 2px 5px 10px rgba(0,0,0,0.8); border: 1px solid #d4c4a8; display:flex; align-items:center; justify-content:center; font-family:var(--font-serif); font-size:0.9rem; transform: rotate(10deg); z-index: 2;">
         ...brennt das<br>Rathaus bereits."
      </div>
      <div class="puzzle-piece" data-target-x="60" data-target-y="180" style="position:absolute; top:30px; left:180px; width:110px; height:80px; background:#fdf5e6; color:#111; padding:10px; cursor:grab; box-shadow: 2px 5px 10px rgba(0,0,0,0.8); border: 1px solid #d4c4a8; display:flex; align-items:center; justify-content:center; font-family:var(--font-serif); font-size:0.9rem; transform: rotate(-15deg); z-index: 3;">
         Der Pakt<br>der Erben
      </div>
      <div class="puzzle-piece" data-target-x="170" data-target-y="180" style="position:absolute; top:200px; left:170px; width:110px; height:80px; background:#fdf5e6; color:#111; padding:10px; cursor:grab; box-shadow: 2px 5px 10px rgba(0,0,0,0.8); border: 1px solid #d4c4a8; display:flex; align-items:center; justify-content:center; font-family:var(--font-serif); font-size:0.9rem; transform: rotate(8deg); z-index: 4;">
         duldet keinen<br>Verrat.
      </div>
    </div>
  </div>`;
  overlay.style.display = 'flex';

  const pieces = document.querySelectorAll('.puzzle-piece');
  const area = document.getElementById('puzzle-area');
  let activePiece = null;
  let offsetX = 0, offsetY = 0;
  let solvedPieces = 0;

  pieces.forEach(p => {
    function startDrag(e) {
      if (p.classList.contains('locked')) return;
      e.preventDefault();
      activePiece = p;
      const rect = p.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      offsetX = clientX - rect.left;
      offsetY = clientY - rect.top;
      
      // Bring to front
      pieces.forEach(piece => piece.style.zIndex = piece.style.zIndex > 0 ? piece.style.zIndex - 1 : 0);
      p.style.zIndex = 10;
      
      p.style.cursor = 'grabbing';
      p.style.transform = 'scale(1.05) rotate(0deg)';
      p.style.boxShadow = '5px 15px 25px rgba(0,0,0,0.9)';
      FX.playMechanicalClick();
    }
    p.addEventListener('mousedown', startDrag);
    p.addEventListener('touchstart', startDrag, {passive: false});
  });

  function moveDrag(e) {
    if (!activePiece) return;
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const areaRect = area.getBoundingClientRect();
    
    let x = clientX - areaRect.left - offsetX;
    let y = clientY - areaRect.top - offsetY;
    
    // Bounds
    x = Math.max(-50, Math.min(x, areaRect.width - 60));
    y = Math.max(-50, Math.min(y, areaRect.height - 30));
    
    activePiece.style.left = \`\${x}px\`;
    activePiece.style.top = \`\${y}px\`;
  }

  function endDrag() {
    if (!activePiece) return;
    const targetX = parseInt(activePiece.getAttribute('data-target-x'));
    const targetY = parseInt(activePiece.getAttribute('data-target-y'));
    
    const currentX = parseFloat(activePiece.style.left);
    const currentY = parseFloat(activePiece.style.top);
    
    const dist = Math.sqrt(Math.pow(currentX - targetX, 2) + Math.pow(currentY - targetY, 2));
    
    if (dist < 30) {
      // Snap
      activePiece.style.left = \`\${targetX}px\`;
      activePiece.style.top = \`\${targetY}px\`;
      activePiece.style.transform = 'scale(1) rotate(0deg)';
      activePiece.classList.add('locked');
      activePiece.style.cursor = 'default';
      activePiece.style.boxShadow = 'none';
      activePiece.style.border = '1px solid rgba(0,0,0,0.1)';
      solvedPieces++;
      FX.playHeavySnap();
      
      if (solvedPieces === pieces.length) {
        setTimeout(() => {
          overlay.innerHTML = \`<div class="cl-gadget-wrapper"><h2 style="color:var(--color-amber-glow); font-family:var(--font-serif); font-size:2rem; margin-top:50px; text-align:center;">Beweis gesichert!</h2></div>\`;
          setTimeout(() => { overlay.remove(); FX.playSuccessWumms().then(() => onSuccess()); }, 1500);
        }, 1000);
      }
    } else {
      // Drop back down slightly rotated
      activePiece.style.transform = \`scale(1) rotate(\${(Math.random() - 0.5) * 20}deg)\`;
      activePiece.style.boxShadow = '2px 5px 10px rgba(0,0,0,0.8)';
      activePiece.style.cursor = 'grab';
    }
    
    activePiece = null;
  }

  window.addEventListener('mousemove', moveDrag);
  window.addEventListener('mouseup', endDrag);
  window.addEventListener('touchmove', moveDrag, {passive: false});
  window.addEventListener('touchend', endDrag);
}
