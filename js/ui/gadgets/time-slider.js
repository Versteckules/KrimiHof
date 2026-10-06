export function runGadget(stationId, onSuccess) {
  let overlay = document.getElementById('gadget-fullscreen-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'gadget-fullscreen-overlay';
    overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background: #000; z-index: 10000; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff;";
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
    <h2 style="font-family:var(--font-serif); margin-bottom:10px;">Zeitreise</h2>
    <p style="color:var(--color-text-muted); font-size:0.9rem; margin-bottom:20px;">1823 vs Heute. Schiebe den Regler nach rechts.</p>
    <input type="range" min="0" max="100" value="0" id="time-slider-input" style="width:250px; margin-bottom:30px;">
    <button id="btn-time-slider-done" class="btn-primary" style="display:none;">Beweis sichern</button>
  `;
  overlay.style.display = 'flex';

  document.getElementById('time-slider-input').oninput = (e) => {
    if (e.target.value > 90) {
      document.getElementById('btn-time-slider-done').style.display = 'block';
    }
  };

  document.getElementById('btn-time-slider-done').onclick = () => {
    overlay.innerHTML = \`<h2 style="color:var(--color-amber-glow); font-family:var(--font-serif); font-size:2rem; margin-top:50px;">Beweis gesichert!</h2>\`;
    setTimeout(() => { overlay.remove(); onSuccess(); }, 1000);
  };
}
