import * as FX from '../../fx.js';
export function runGadget(stationId, onSuccess) {
  let overlay = document.getElementById('gadget-fullscreen-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'gadget-fullscreen-overlay';
    overlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background: #000; z-index: 10000; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff; text-align:center; padding:20px;";
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `<div class="cl-gadget-wrapper"><div class="cl-gadget-screws"></div>
    <h2 style="font-family:var(--font-serif); margin-bottom:10px;">Polaroid Entwicklung</h2>
    <p style="color:var(--color-text-muted); font-size:0.9rem; margin-bottom:20px;">Schüttle dein Smartphone oder tippe auf das Bild, um es zu entwickeln.</p>
    
    <div style="width:min(280px, 85vw); height:330px; box-sizing:border-box; background:#e0e0e0; padding:15px 15px 50px 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); transform: rotate(-2deg); cursor:pointer;">
      <div style="width:100%; height:100%; background:#111; overflow:hidden; position:relative;">
        <img id="polaroid-img" src="assets/suspect_herold.jpg" style="width:100%; height:100%; object-fit:cover; filter: blur(20px) brightness(0.2); transition: filter 0.5s;">
      </div>
    </div>
    
    <button id="btn-polaroid-fallback" class="btn-secondary" style="margin-top:20px; padding: 10px 18px;">📸 Schütteln / Manuell entwickeln</button>
  </div>`;
  overlay.style.display = 'flex';

  let development = 0;
  let solved = false;
  const img = document.getElementById('polaroid-img');

  function updateImage() {
    const blur = Math.max(0, 20 - (development / 100) * 20);
    const bright = Math.min(1, 0.2 + (development / 100) * 0.8);
    img.style.filter = `blur(${blur}px) brightness(${bright})`;
    
    if (development >= 100 && !solved) {
      solved = true;
      window.removeEventListener('devicemotion', handleMotion);
      import('../../state.js').then(m => {
        m.addInventoryItem('evidence_polaroid_station');
        m.addScore(15);
      });
      setTimeout(() => {
        overlay.innerHTML = `
          <h2 style="color:var(--color-amber-glow); font-family:var(--font-serif); font-size:2rem; margin-top:50px;">Beweis gesichert!</h2>
          <p style="color:#f5d79e; font-size:1.05rem; margin-top:12px;">📸 Überwachungs-Polaroid zur Ermittlungsakte hinzugefügt (+15 XP)</p>
        `;
        setTimeout(() => {
          overlay.remove();
          FX.playSuccessWumms().then(() => onSuccess());
        }, 1500);
      }, 1000);
    }
  }

  function handleMotion(e) {
    if (solved) return;
    const acc = e.accelerationIncludingGravity;
    if (!acc) return;
    
    const force = Math.abs(acc.x || 0) + Math.abs(acc.y || 0) + Math.abs(acc.z || 0);
    if (force > 15) { // Schütteln
      development += 2;
      updateImage();
    }
  }

  // Request permission for iOS 13+
  if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission().then(state => {
      if (state === 'granted') {
        window.addEventListener('devicemotion', handleMotion);
      }
    }).catch(console.error);
  } else {
    window.addEventListener('devicemotion', handleMotion);
  }

  const observer = new MutationObserver(() => {
    if (!document.body.contains(overlay)) {
      window.removeEventListener('devicemotion', handleMotion);
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true });

  document.getElementById('btn-polaroid-fallback').onclick = () => {
    const int = setInterval(() => {
      development += 5;
      updateImage();
      if (development >= 100) clearInterval(int);
    }, 100);
  };
}
