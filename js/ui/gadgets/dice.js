export function runGadget(stationId, onSuccess) {
  let overlay = document.getElementById('gadget-fullscreen-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'gadget-fullscreen-overlay';
    overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background: #000; z-index: 10000; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff;";
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
    <h2 style="font-family:var(--font-serif); margin-bottom:10px;">Wirtshaus-Würfeln</h2>
    <p style="color:var(--color-text-muted); font-size:0.9rem; margin-bottom:20px;">Tippe, um zu würfeln (>10).</p>
    
    <div style="display:flex; gap:20px; margin-bottom:30px;">
      <div id="dice-1" style="width:80px; height:80px; background:#fdf5e6; color:#000; font-size:3rem; font-weight:bold; display:flex; align-items:center; justify-content:center; border-radius:10px; transition:transform 0.5s;">?</div>
      <div id="dice-2" style="width:80px; height:80px; background:#fdf5e6; color:#000; font-size:3rem; font-weight:bold; display:flex; align-items:center; justify-content:center; border-radius:10px; transition:transform 0.5s;">?</div>
    </div>
    
    <!-- Easter Egg Target -->
    <div id="wurstkessel-easter-egg" style="width:100px; height:80px; background:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%25%22 height=%22100%25%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23b87333%22/><text x=%2220%22 y=%2250%22 fill=%22white%22>Kessel</text></svg>'); background-size:cover; margin-bottom:30px; cursor:pointer;"></div>
    
    <button id="btn-dice-roll" class="btn-primary">Würfeln</button>
  `;
  overlay.style.display = 'flex';

  let easterEggTaps = 0;
  document.getElementById('wurstkessel-easter-egg').onclick = () => {
    easterEggTaps++;
    if (easterEggTaps === 3) {
      alert("EASTER EGG GEFUNDEN! Wärschtlamo Sound! (+50 Punkte)");
    }
  };

  document.getElementById('btn-dice-roll').onclick = () => {
    const d1 = document.getElementById('dice-1');
    const d2 = document.getElementById('dice-2');

    d1.style.transform = 'rotate(360deg)';
    d2.style.transform = 'rotate(-360deg)';

    setTimeout(() => {
      d1.style.transform = 'none';
      d2.style.transform = 'none';

      const v1 = Math.floor(Math.random() * 6) + 1;
      const v2 = Math.floor(Math.random() * 6) + 1;
      d1.textContent = v1;
      d2.textContent = v2;

      if (v1 + v2 > 10) {
        setTimeout(() => {
          overlay.innerHTML = \`<h2 style="color:var(--color-amber-glow); font-family:var(--font-serif); font-size:2rem; margin-top:50px;">Gewonnen!</h2>\`;
          setTimeout(() => { overlay.remove(); onSuccess(); }, 1500);
        }, 1000);
      }
    }, 500);
  };
}
