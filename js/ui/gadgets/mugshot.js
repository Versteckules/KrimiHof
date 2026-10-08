import * as FX from '../../fx.js';

export function runGadget(stationId, onSuccess) {
  let overlay = document.getElementById('gadget-fullscreen-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'gadget-fullscreen-overlay';
    overlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background: #000; z-index: 10000; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff;";
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `<div class="cl-gadget-wrapper"><div class="cl-gadget-screws"></div>
    <h2 style="font-family:var(--font-serif); margin-bottom:10px;">Phantombild</h2>
    <p style="color:var(--color-text-muted); font-size:0.9rem; margin-bottom:20px;">Baue das Gesicht des Verdächtigen nach.</p>
    
    <div style="width:280px; background:#d2ccb9; border: 4px solid #8b6508; box-shadow: inset 0 0 20px rgba(0,0,0,0.5), 0 10px 20px rgba(0,0,0,0.8); border-radius:5px; padding:20px; display:flex; flex-direction:column; align-items:center; position:relative;">
      
      <!-- Photo Frame -->
      <div style="width: 150px; height: 180px; border: 2px solid #555; background: #eee; margin-bottom: 20px; display:flex; flex-direction:column; justify-content:center; align-items:center; font-size: 3.5rem; line-height: 1.1; overflow:hidden;">
         <div id="mug-hat" style="margin-top: 10px;">ðŸŽ©</div>
         <div id="mug-eyes">ðŸ•¶ï¸</div>
         <div id="mug-mouth" style="margin-top: -10px;">ðŸ§”</div>
      </div>

      <!-- Controls -->
      <div style="display:flex; flex-direction:column; gap: 15px; width:100%;">
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <button id="btn-hat-prev" class="btn-secondary" style="width: 40px; height: 40px; border-radius: 50%; font-weight:bold;">&lt;</button>
          <div style="font-family:var(--font-mono); color:#111;">KOPFBEDECKUNG</div>
          <button id="btn-hat-next" class="btn-secondary" style="width: 40px; height: 40px; border-radius: 50%; font-weight:bold;">&gt;</button>
        </div>
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <button id="btn-eyes-prev" class="btn-secondary" style="width: 40px; height: 40px; border-radius: 50%; font-weight:bold;">&lt;</button>
          <div style="font-family:var(--font-mono); color:#111;">AUGENPARTIE</div>
          <button id="btn-eyes-next" class="btn-secondary" style="width: 40px; height: 40px; border-radius: 50%; font-weight:bold;">&gt;</button>
        </div>
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <button id="btn-mouth-prev" class="btn-secondary" style="width: 40px; height: 40px; border-radius: 50%; font-weight:bold;">&lt;</button>
          <div style="font-family:var(--font-mono); color:#111;">BART / MUND</div>
          <button id="btn-mouth-next" class="btn-secondary" style="width: 40px; height: 40px; border-radius: 50%; font-weight:bold;">&gt;</button>
        </div>
      </div>
    </div>
    
    <button id="btn-mugshot-submit" class="btn-primary" style="margin-top:30px;">Identität bestätigen</button>
  </div>`;
  overlay.style.display = 'flex';

  const parts = {
    hat: ['ðŸŽ©', 'ðŸ§¢', 'ðŸ•µï¸', 'ðŸ‘·'],
    eyes: ['ðŸ•¶ï¸', 'ðŸ˜ ', 'ðŸ˜³', 'ðŸ§'],
    mouth: ['ðŸ§”', 'ðŸ‘„', 'ðŸ¥¸', 'ðŸ˜']
  };

  let state = { hat: 0, eyes: 0, mouth: 0 };
  const target = { hat: 2, eyes: 0, mouth: 2 }; // Target: ðŸ•µï¸ ðŸ•¶ï¸ ðŸ¥¸

  function updateVisuals() {
    document.getElementById('mug-hat').textContent = parts.hat[state.hat];
    document.getElementById('mug-eyes').textContent = parts.eyes[state.eyes];
    document.getElementById('mug-mouth').textContent = parts.mouth[state.mouth];
    FX.playMechanicalClick();
  }

  function shift(part, dir) {
    state[part] = (state[part] + dir + parts[part].length) % parts[part].length;
    updateVisuals();
  }

  document.getElementById('btn-hat-prev').onclick = () => shift('hat', -1);
  document.getElementById('btn-hat-next').onclick = () => shift('hat', 1);
  document.getElementById('btn-eyes-prev').onclick = () => shift('eyes', -1);
  document.getElementById('btn-eyes-next').onclick = () => shift('eyes', 1);
  document.getElementById('btn-mouth-prev').onclick = () => shift('mouth', -1);
  document.getElementById('btn-mouth-next').onclick = () => shift('mouth', 1);

  updateVisuals();

  document.getElementById('btn-mugshot-submit').onclick = () => {
    if (state.hat === target.hat && state.eyes === target.eyes && state.mouth === target.mouth) {
      overlay.innerHTML = `<div class="cl-gadget-wrapper"><h2 style="color:var(--color-amber-glow); font-family:var(--font-serif); font-size:2rem; margin-top:50px;">Übereinstimmung gefunden!</h2></div>`;
      setTimeout(() => { overlay.remove(); FX.playSuccessWumms().then(() => onSuccess()); }, 1000);
    } else {
      FX.shakeElement(document.querySelector('.cl-gadget-wrapper'));
    }
  };
}
