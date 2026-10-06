export function runGadget(stationId, onSuccess) {
  let overlay = document.getElementById('gadget-fullscreen-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'gadget-fullscreen-overlay';
    overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background: #050510; z-index: 10000; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff;";
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
    <h2 style="font-family:var(--font-mono); margin-bottom:10px; color:#f00;">LASER PARCOURS</h2>
    <p style="color:var(--color-text-muted); font-size:0.9rem; margin-bottom:20px;">Berühre den Laser nicht.</p>
    
    <div id="laser-area" style="position:relative; width:300px; height:400px; background:#111; border:2px solid #333; overflow:hidden;">
      <div class="laser-beam" style="position:absolute; top:100px; left:0; width:100%; height:4px; background:#f00; box-shadow:0 0 10px #f00;"></div>
      <div class="laser-beam" style="position:absolute; top:250px; left:0; width:100%; height:4px; background:#f00; box-shadow:0 0 10px #f00;"></div>
      
      <div id="laser-player" style="position:absolute; bottom:10px; left:135px; width:30px; height:30px; background:#0f0; border-radius:50%; box-shadow:0 0 10px #0f0; cursor:pointer;"></div>
      
      <div id="laser-target" style="position:absolute; top:10px; left:100px; width:100px; height:40px; background:rgba(0,255,0,0.2); border:1px dashed #0f0; display:flex; align-items:center; justify-content:center;">ZIEL</div>
    </div>
  `;
  overlay.style.display = 'flex';

  const player = document.getElementById('laser-player');
  const area = document.getElementById('laser-area');
  let isDragging = false;
  let solved = false;
  
  function startDrag(e) {
    if (solved) return;
    isDragging = true;
  }
  
  function moveDrag(e) {
    if (!isDragging || solved) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const rect = area.getBoundingClientRect();
    
    let x = clientX - rect.left - 15;
    let y = clientY - rect.top - 15;
    
    // Bounds
    x = Math.max(0, Math.min(x, 270));
    y = Math.max(0, Math.min(y, 370));
    
    player.style.left = \`\${x}px\`;
    player.style.top = \`\${y}px\`;
    
    // Check collisions
    if ((y > 90 && y < 104) || (y > 240 && y < 254)) {
      isDragging = false;
      player.style.background = '#f00';
      setTimeout(() => {
        player.style.background = '#0f0';
        player.style.left = '135px';
        player.style.top = '360px';
      }, 500);
      return;
    }
    
    // Check target
    if (y < 50 && x > 90 && x < 190) {
      solved = true;
      isDragging = false;
      player.style.background = '#fff';
      setTimeout(() => { overlay.remove(); onSuccess(); }, 1000);
    }
  }
  
  function endDrag() { isDragging = false; }
  
  player.addEventListener('mousedown', startDrag);
  window.addEventListener('mousemove', moveDrag);
  window.addEventListener('mouseup', endDrag);
  
  player.addEventListener('touchstart', startDrag, {passive: true});
  window.addEventListener('touchmove', moveDrag, {passive: true});
  window.addEventListener('touchend', endDrag);
}
