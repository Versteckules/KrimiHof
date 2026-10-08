import * as FX from '../../fx.js';

export function runGadget(stationId, onSuccess) {
  let overlay = document.getElementById('gadget-fullscreen-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'gadget-fullscreen-overlay';
    overlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background: #050510; z-index: 10000; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff;";
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `<div class="cl-gadget-wrapper" style="border-color: #333; box-shadow: 0 0 30px #f00; padding: 20px;">
    <div class="cl-gadget-screws"></div>
    <h2 style="font-family:var(--font-mono); margin-bottom:10px; color:#f00; text-shadow: 0 0 10px #f00;">LASER PARCOURS</h2>
    <p style="color:var(--color-text-muted); font-size:0.9rem; margin-bottom:20px;">Führe den Kern ins Ziel. Berühre nicht den Laser!</p>
    
    <div id="laser-area" style="position:relative; width:300px; height:400px; background:#050505; border:2px solid #222; border-radius: 5px; overflow:hidden; touch-action: none;">
      
      <!-- Grid Background -->
      <div style="position:absolute; width:100%; height:100%; background: linear-gradient(0deg, transparent 24%, rgba(255, 0, 0, .05) 25%, rgba(255, 0, 0, .05) 26%, transparent 27%, transparent 74%, rgba(255, 0, 0, .05) 75%, rgba(255, 0, 0, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 0, 0, .05) 25%, rgba(255, 0, 0, .05) 26%, transparent 27%, transparent 74%, rgba(255, 0, 0, .05) 75%, rgba(255, 0, 0, .05) 76%, transparent 77%, transparent); background-size:30px 30px; pointer-events:none;"></div>
      
      <!-- Lasers (Schwereres Labyrinth) -->
      <div class="laser-beam" style="position:absolute; top:80px; left:0; width:220px; height:4px; background:#f00; box-shadow:0 0 15px #f00, 0 0 5px #fff; border-radius: 2px;"></div>
      <div class="laser-beam" style="position:absolute; top:160px; right:0; width:220px; height:4px; background:#f00; box-shadow:0 0 15px #f00, 0 0 5px #fff; border-radius: 2px;"></div>
      <div class="laser-beam" style="position:absolute; top:240px; left:0; width:220px; height:4px; background:#f00; box-shadow:0 0 15px #f00, 0 0 5px #fff; border-radius: 2px;"></div>
      <div class="laser-beam" style="position:absolute; top:320px; right:0; width:150px; height:4px; background:#f00; box-shadow:0 0 15px #f00, 0 0 5px #fff; border-radius: 2px;"></div>
      
      <!-- Player -->
      <div id="laser-player" style="position:absolute; bottom:15px; left:135px; width:30px; height:30px; background:radial-gradient(circle, #fff, #0f0); border-radius:50%; box-shadow:0 0 15px #0f0, 0 0 5px #fff; cursor:grab; z-index: 10;"></div>
      
      <!-- Target -->
      <div id="laser-target" style="position:absolute; top:15px; left:100px; width:100px; height:50px; background:rgba(0,255,0,0.1); border:2px dashed #0f0; display:flex; align-items:center; justify-content:center; font-family:var(--font-mono); color:#0f0; text-shadow: 0 0 10px #0f0; border-radius: 5px;">ZIEL</div>
    </div>
  </div>`;
  overlay.style.display = 'flex';

  const player = document.getElementById('laser-player');
  const area = document.getElementById('laser-area');
  let isDragging = false;
  let solved = false;
  
  function resetPlayer() {
    isDragging = false;
    player.style.background = '#f00';
    player.style.boxShadow = '0 0 15px #f00';
    FX.shakeElement(area);
    setTimeout(() => {
      player.style.background = 'radial-gradient(circle, #fff, #0f0)';
      player.style.boxShadow = '0 0 15px #0f0';
      player.style.left = '135px';
      player.style.top = '355px';
      player.style.transition = 'none';
    }, 500);
  }
  
  function startDrag(e) {
    if (solved) return;
    isDragging = true;
    player.style.cursor = 'grabbing';
    player.style.transition = 'none';
    FX.playMechanicalClick();
  }
  
  function moveDrag(e) {
    if (!isDragging || solved) return;
    e.preventDefault(); // prevent scrolling
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const rect = area.getBoundingClientRect();
    
    let x = clientX - rect.left - 15;
    let y = clientY - rect.top - 15;
    
    // Grid bounds
    x = Math.max(0, Math.min(x, 270));
    y = Math.max(0, Math.min(y, 370));
    
    player.style.left = `${x}px`;
    player.style.top = `${y}px`;
    
    // Collision Logic (Laser bounding boxes for new layout)
    // Laser 1: top 80, left 0, width 220
    if (x < 220 && y > 55 && y < 85) { resetPlayer(); return; }
    // Laser 2: top 160, right 0 (left 80 to 300), width 220
    if (x > 50 && y > 135 && y < 165) { resetPlayer(); return; }
    // Laser 3: top 240, left 0, width 220
    if (x < 220 && y > 215 && y < 245) { resetPlayer(); return; }
    // Laser 4: top 320, right 0, width 150
    if (x > 120 && y > 295 && y < 325) { resetPlayer(); return; }
    
    // Check target (top: 15, left: 100, width: 100, height: 50)
    if (y < 60 && x > 85 && x < 185) {
      solved = true;
      isDragging = false;
      player.style.background = '#fff';
      player.style.boxShadow = '0 0 30px #fff';
      FX.playHeavySnap();
      setTimeout(() => { 
        overlay.innerHTML = `<div class="cl-gadget-wrapper"><h2 style="color:var(--color-amber-glow); font-family:var(--font-serif); font-size:2rem; text-align:center;">Kern gesichert!</h2></div>`;
        setTimeout(() => { overlay.remove(); FX.playSuccessWumms().then(() => onSuccess()); }, 1000);
      }, 1000);
    }
  }
  
  function endDrag() { 
    isDragging = false; 
    player.style.cursor = 'grab';
  }
  
  player.addEventListener('mousedown', startDrag);
  window.addEventListener('mousemove', moveDrag);
  window.addEventListener('mouseup', endDrag);
  
  player.addEventListener('touchstart', startDrag, {passive: false});
  window.addEventListener('touchmove', moveDrag, {passive: false});
  window.addEventListener('touchend', endDrag);
}
