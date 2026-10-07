import * as FX from '../../fx.js';
export function runGadget(stationId, onSuccess) {
  let overlay = document.getElementById('gadget-fullscreen-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'gadget-fullscreen-overlay';
    overlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background: #000; z-index: 10000; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px;";
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `<div class="cl-gadget-wrapper"><div class="cl-gadget-screws"></div>
    <h2 style="color:#fff; font-family:var(--font-serif); margin-bottom:20px;">Das KopfÃ¼ber-Ambigramm</h2>
    <p style="color:var(--color-text-muted); font-size:0.9rem; margin-bottom:40px;">Es gibt Dinge, die nur aus einem anderen Blickwinkel Sinn ergeben.</p>
    
    <div id="ambigram-canvas" style="width:280px; height:400px; background:#fdf5e6; border-radius:3px; box-shadow:0 0 20px rgba(255,255,255,0.1); display:flex; align-items:center; justify-content:center; transition: all 1s ease-in-out; position:relative;">
      
      <!-- Unlesbare Runen (verschwinden bei LÃ¶sung) -->
      <div id="ambigram-runes" style="font-family:var(--font-mono); font-size:3rem; font-weight:bold; color:#8b0000; transform: rotate(180deg); transition: opacity 1s;">
        W3HCA N38R3 3I0
      </div>
      
      <!-- Lesbarer Text (erscheint bei LÃ¶sung) -->
      <div id="ambigram-text" style="font-family:var(--font-serif); font-size:2rem; font-weight:bold; color:#d4af37; text-align:center; position:absolute; opacity:0; transition: opacity 1s;">
        DIE ERBEN<br>WACHEN
      </div>

    </div>
    
    <button id="btn-ambigram-fallback" class="btn-secondary" style="margin-top:40px;">(PC) Bild umdrehen</button>
  </div>`;
  overlay.style.display = 'flex';

  let solved = false;

  function solve() {
    if (solved) return;
    solved = true;
    
    const canvas = document.getElementById('ambigram-canvas');
    canvas.style.transform = 'rotate(180deg)';
    canvas.style.boxShadow = '0 0 40px #d4af37';
    
    document.getElementById('ambigram-runes').style.opacity = '0';
    document.getElementById('ambigram-text').style.opacity = '1';
    
    window.removeEventListener('deviceorientation', handleOrientation);
    
    setTimeout(() => {
      overlay.innerHTML = `<h2 style="color:var(--color-amber-glow); font-family:var(--font-serif); font-size:2rem; margin-top:50px;">Botschaft entschlÃ¼sselt!</h2>`;
      setTimeout(() => {
        overlay.remove();
        FX.playSuccessWumms().then(() => onSuccess());
      }, 1500);
    }, 2500);
  }

  function handleOrientation(e) {
    if (solved) return;
    // Beta is front-to-back tilt in degrees, where front is positive.
    // Gamma is left-to-right tilt in degrees, where right is positive.
    // If the phone is upside down, gamma is usually close to 0 and beta is > 160 or < -160.
    if (e.beta && (e.beta > 160 || e.beta < -160)) {
      solve();
    }
  }

  // Request permission for iOS 13+
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission().then(state => {
      if (state === 'granted') {
        window.addEventListener('deviceorientation', handleOrientation);
      }
    }).catch(console.error);
  } else {
    window.addEventListener('deviceorientation', handleOrientation);
  }

  document.getElementById('btn-ambigram-fallback').onclick = solve;
}
