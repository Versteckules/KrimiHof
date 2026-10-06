export function runGadget(stationId, onSuccess) {
  let overlay = document.getElementById('gadget-fullscreen-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'gadget-fullscreen-overlay';
    overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background: #000; z-index: 10000; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff;";
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
    <h2 style="font-family:var(--font-serif); margin-bottom:10px; color:#0f0;">IR-Scanner</h2>
    <p style="color:var(--color-text-muted); font-size:0.9rem; margin-bottom:20px;">Wische über das Bild.</p>
    <div style="width:250px; height:250px; background:radial-gradient(circle, #0f0, #000); border-radius:10px; margin-bottom:30px;"></div>
    <button id="btn-scanner" class="btn-primary" style="margin-bottom:20px;">📷 Kamera (Simuliert)</button>
    <button id="btn-scanner-skip" class="btn-secondary">Sensor überspringen</button>
  `;
  overlay.style.display = 'flex';

  document.getElementById('btn-scanner').onclick = () => {
    overlay.innerHTML = \`<h2 style="color:var(--color-amber-glow); font-family:var(--font-serif); font-size:2rem; margin-top:50px;">Beweis gesichert!</h2>\`;
    setTimeout(() => { overlay.remove(); onSuccess(); }, 1000);
  };
  
  document.getElementById('btn-scanner-skip').onclick = () => {
    overlay.innerHTML = \`<h2 style="color:var(--color-amber-glow); font-family:var(--font-serif); font-size:2rem; margin-top:50px;">Beweis gesichert!</h2>\`;
    setTimeout(() => { overlay.remove(); onSuccess(); }, 1000);
  };
}
