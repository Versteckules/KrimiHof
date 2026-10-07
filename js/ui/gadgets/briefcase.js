import * as FX from '../../fx.js';
export function runGadget(stationId, onSuccess) {
  let overlay = document.getElementById('gadget-fullscreen-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'gadget-fullscreen-overlay';
    overlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background: #1a1a1a; z-index: 10000; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff;";
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `<div class="cl-gadget-wrapper"><div class="cl-gadget-screws"></div>
    <h2 style="font-family:var(--font-serif); margin-bottom:30px;">Zahlenschloss knacken</h2>
    
    <div style="background: linear-gradient(135deg, #444, #222); padding: 40px 20px; border-radius: 10px; border: 2px solid #555; box-shadow: 0 10px 30px rgba(0,0,0,0.8); display:flex; gap:10px; position:relative;">
      <!-- Schrauben -->
      <div style="position:absolute; top:10px; left:10px; width:10px; height:10px; background:#111; border-radius:50%;"></div>
      <div style="position:absolute; top:10px; right:10px; width:10px; height:10px; background:#111; border-radius:50%;"></div>
      <div style="position:absolute; bottom:10px; left:10px; width:10px; height:10px; background:#111; border-radius:50%;"></div>
      <div style="position:absolute; bottom:10px; right:10px; width:10px; height:10px; background:#111; border-radius:50%;"></div>
      
      <!-- Rädchen -->
      <div class="dial-container" data-index="0" style="width:60px; height:100px; background:#000; border:2px solid #666; border-radius:5px; overflow:hidden; position:relative; display:flex; align-items:center; justify-content:center; cursor:ns-resize; user-select:none;">
        <div class="dial-val" style="font-family:var(--font-mono); font-size:3rem; color:#fff; font-weight:bold; text-shadow: 0 2px 5px rgba(0,0,0,0.8);">0</div>
        <div style="position:absolute; top:0; width:100%; height:20px; background:linear-gradient(to bottom, rgba(0,0,0,0.8), transparent); pointer-events:none;"></div>
        <div style="position:absolute; bottom:0; width:100%; height:20px; background:linear-gradient(to top, rgba(0,0,0,0.8), transparent); pointer-events:none;"></div>
      </div>
      
      <div class="dial-container" data-index="1" style="width:60px; height:100px; background:#000; border:2px solid #666; border-radius:5px; overflow:hidden; position:relative; display:flex; align-items:center; justify-content:center; cursor:ns-resize; user-select:none;">
        <div class="dial-val" style="font-family:var(--font-mono); font-size:3rem; color:#fff; font-weight:bold; text-shadow: 0 2px 5px rgba(0,0,0,0.8);">0</div>
        <div style="position:absolute; top:0; width:100%; height:20px; background:linear-gradient(to bottom, rgba(0,0,0,0.8), transparent); pointer-events:none;"></div>
        <div style="position:absolute; bottom:0; width:100%; height:20px; background:linear-gradient(to top, rgba(0,0,0,0.8), transparent); pointer-events:none;"></div>
      </div>
      
      <div class="dial-container" data-index="2" style="width:60px; height:100px; background:#000; border:2px solid #666; border-radius:5px; overflow:hidden; position:relative; display:flex; align-items:center; justify-content:center; cursor:ns-resize; user-select:none;">
        <div class="dial-val" style="font-family:var(--font-mono); font-size:3rem; color:#fff; font-weight:bold; text-shadow: 0 2px 5px rgba(0,0,0,0.8);">0</div>
        <div style="position:absolute; top:0; width:100%; height:20px; background:linear-gradient(to bottom, rgba(0,0,0,0.8), transparent); pointer-events:none;"></div>
        <div style="position:absolute; bottom:0; width:100%; height:20px; background:linear-gradient(to top, rgba(0,0,0,0.8), transparent); pointer-events:none;"></div>
      </div>
      
      <!-- Schloss Button -->
      <div id="btn-lock-open" style="width:30px; background:linear-gradient(to right, #888, #555); border:1px solid #333; border-radius:3px; margin-left:10px; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow: 2px 0 5px rgba(0,0,0,0.5);">
        <div style="width:4px; height:20px; background:#333; border-radius:2px;"></div>
      </div>
    </div>
    <p id="briefcase-hint" style="color:var(--color-text-muted); margin-top:20px; font-size:0.9rem;">Wische nach oben/unten.</p>
  </div>`;
  overlay.style.display = 'flex';

  const TARGET_CODE = [8, 7, 0]; // 1870 -> 870
  let currentCode = [0, 0, 0];
  let solved = false;
  
  // Audio context for clicks
  let audioCtx = null;
  function playClickSound(isCorrect) {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      if (isCorrect) {
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      } else {
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
      }
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch(e) {}
  }

  document.querySelectorAll('.dial-container').forEach(dial => {
    let startY = 0;
    let isDragging = false;
    let index = parseInt(dial.getAttribute('data-index'));
    
    function startDrag(e) {
      if (solved) return;
      isDragging = true;
      startY = e.touches ? e.touches[0].clientY : e.clientY;
    }
    
    function moveDrag(e) {
      if (!isDragging || solved) return;
      let y = e.touches ? e.touches[0].clientY : e.clientY;
      let diff = startY - y;
      
      if (Math.abs(diff) > 20) { // Schwelle für einen "Klick"
        if (diff > 0) {
          currentCode[index] = (currentCode[index] + 1) % 10;
        } else {
          currentCode[index] = (currentCode[index] - 1 + 10) % 10;
        }
        
        dial.querySelector('.dial-val').textContent = currentCode[index];
        startY = y;
        
        const isCorrect = currentCode[index] === TARGET_CODE[index];
        playClickSound(isCorrect);
        
        if (isCorrect) {
          dial.style.transform = "translateY(2px)";
          setTimeout(() => dial.style.transform = "translateY(0)", 100);
        }
      }
    }
    
    function endDrag() { isDragging = false; }
    
    dial.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', moveDrag);
    window.addEventListener('mouseup', endDrag);
    
    dial.addEventListener('touchstart', startDrag, {passive: true});
    window.addEventListener('touchmove', moveDrag, {passive: true});
    window.addEventListener('touchend', endDrag);
  });

  document.getElementById('btn-lock-open').addEventListener('click', () => {
    if (solved) return;
    if (currentCode[0] === TARGET_CODE[0] && currentCode[1] === TARGET_CODE[1] && currentCode[2] === TARGET_CODE[2]) {
      solved = true;
      document.getElementById('btn-lock-open').style.transform = "translateX(10px)";
      setTimeout(() => {
        overlay.innerHTML = \`<h2 style="color:var(--color-amber-glow); font-family:var(--font-serif); font-size:2rem; margin-top:50px;">Koffer geöffnet!</h2>\`;
        setTimeout(() => {
          overlay.remove();
          FX.playSuccessWumms().then(() => onSuccess());
        }, 1500);
      }, 500);
    } else {
      document.getElementById('briefcase-hint').textContent = "Das Schloss klemmt. (Tipp: Achte auf das laute Klicken!)";
      document.getElementById('briefcase-hint').style.color = "var(--color-blood-red)";
      setTimeout(() => { document.getElementById('briefcase-hint').style.color = "var(--color-text-muted)"; }, 1000);
    }
  });
}
