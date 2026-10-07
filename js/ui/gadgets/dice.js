import * as FX from '../../fx.js';

export function runGadget(stationId, onSuccess) {
  let overlay = document.getElementById('gadget-fullscreen-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'gadget-fullscreen-overlay';
    overlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background: #000; z-index: 10000; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff;";
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `<div class="cl-gadget-wrapper" style="padding: 20px; width: 95vw; max-width: 400px; display: flex; flex-direction: column; align-items: center; text-align: center;">
    <div class="cl-gadget-screws"></div>
    <h2 style="font-family:var(--font-serif); margin-bottom:10px; color:var(--color-amber-glow);">Wirtshaus-WÃ¼rfeln</h2>
    <p style="color:var(--color-text-muted); font-size:0.9rem; margin-bottom:20px;">Tippe, um die alten KnochenwÃ¼rfel zu werfen.<br>Du brauchst mehr als 10 Augen!</p>
    
    <div style="display:flex; gap:30px; margin-bottom:40px; perspective: 1000px; padding: 20px;">
      
      <!-- CSS 3D Dice 1 -->
      <div id="dice-1" style="width:80px; height:80px; position:relative; transform-style: preserve-3d; transition: transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
         <!-- We'll just rotate the whole container and show the result side -->
         <div class="dice-face" style="position:absolute; width:100%; height:100%; background: radial-gradient(circle, #fdf5e6, #d4c4a8); border: 2px solid #8b6508; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size: 3rem; color:#222; box-shadow: inset 0 0 15px rgba(0,0,0,0.5);">?</div>
      </div>
      
      <!-- CSS 3D Dice 2 -->
      <div id="dice-2" style="width:80px; height:80px; position:relative; transform-style: preserve-3d; transition: transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275); animation-delay: 0.1s;">
         <div class="dice-face" style="position:absolute; width:100%; height:100%; background: radial-gradient(circle, #fdf5e6, #d4c4a8); border: 2px solid #8b6508; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size: 3rem; color:#222; box-shadow: inset 0 0 15px rgba(0,0,0,0.5);">?</div>
      </div>

    </div>
    
    <!-- Easter Egg Target -->
    <div id="wurstkessel-easter-egg" style="width:80px; height:60px; background:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%25%22 height=%22100%25%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23b87333%22 rx=%2210%22/><text x=%2215%22 y=%2235%22 fill=%22white%22 font-family=%22sans-serif%22 font-size=%2214%22>Kessel</text></svg>'); background-size:cover; margin-bottom:30px; cursor:pointer; opacity:0.8;"></div>
    
    <button id="btn-dice-roll" class="btn-primary" style="font-size: 1.2rem; padding: 15px 30px;">WÃ¼rfeln</button>
  </div>`;
  overlay.style.display = 'flex';

  let easterEggTaps = 0;
  document.getElementById('wurstkessel-easter-egg').onclick = () => {
    easterEggTaps++;
    FX.playMechanicalClick();
    if (easterEggTaps === 3) {
      FX.playSuccessWumms();
      const status = document.createElement('div');
      status.style = "position:absolute; top:20px; color:#0f0; font-family:var(--font-mono);";
      status.textContent = "EASTER EGG GEFUNDEN! WÃ¤rschtlamo! (+50 Punkte)";
      overlay.appendChild(status);
    }
  };

  let solved = false;

  document.getElementById('btn-dice-roll').onclick = () => {
    if (solved) return;
    
    FX.playMechanicalClick();
    const d1 = document.getElementById('dice-1');
    const d2 = document.getElementById('dice-2');
    
    const face1 = d1.querySelector('.dice-face');
    const face2 = d2.querySelector('.dice-face');

    // Random spins
    const spinX1 = Math.floor(Math.random() * 4 + 2) * 360;
    const spinY1 = Math.floor(Math.random() * 4 + 2) * 360;
    const spinX2 = Math.floor(Math.random() * 4 + 2) * 360;
    const spinY2 = Math.floor(Math.random() * 4 + 2) * 360;

    d1.style.transform = `rotateX(${spinX1}deg) rotateY(${spinY1}deg)`;
    d2.style.transform = `rotateX(${spinX2}deg) rotateY(${spinY2}deg)`;

    face1.textContent = '';
    face2.textContent = '';

    setTimeout(() => {
      FX.playHeavySnap();
      
      const v1 = Math.floor(Math.random() * 6) + 1;
      const v2 = Math.floor(Math.random() * 6) + 1;
      
      face1.textContent = getDiceDots(v1);
      face2.textContent = getDiceDots(v2);

      if (v1 + v2 > 10) {
        solved = true;
        setTimeout(() => {
          overlay.innerHTML = `<div class="cl-gadget-wrapper"><h2 style="color:var(--color-amber-glow); font-family:var(--font-serif); font-size:2rem; margin-top:50px;">Gewonnen!</h2></div>`;
          setTimeout(() => { overlay.remove(); FX.playSuccessWumms().then(() => onSuccess()); }, 1500);
        }, 1000);
      } else {
        setTimeout(() => {
          FX.shakeElement(document.querySelector('.cl-gadget-wrapper'));
        }, 500);
      }
    }, 1000);
  };
  
  function getDiceDots(val) {
    const dots = ['âš€','âš','âš‚','âšƒ','âš„','âš…'];
    return dots[val-1] || '?';
  }
}
