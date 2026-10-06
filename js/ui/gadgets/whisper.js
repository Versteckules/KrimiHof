export function runGadget(stationId, onSuccess) {
  let overlay = document.getElementById('gadget-fullscreen-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'gadget-fullscreen-overlay';
    overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background: #000; z-index: 10000; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff;";
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
    <h2 style="font-family:var(--font-serif); margin-bottom:10px;">Spracherkennung</h2>
    <p style="color:var(--color-text-muted); font-size:0.9rem; margin-bottom:20px;">Flüstere "Schlappenpakt".</p>
    <button id="btn-whisper" class="btn-primary" style="margin-bottom:20px;">🎤 Mikrofon (Simuliert)</button>
    <button id="btn-whisper-skip" class="btn-secondary">Sensor überspringen</button>
  `;
  overlay.style.display = 'flex';

  document.getElementById('btn-whisper').onclick = () => {
    overlay.innerHTML = \`<h2 style="color:var(--color-amber-glow); font-family:var(--font-serif); font-size:2rem; margin-top:50px;">Passwort akzeptiert!</h2>\`;
    setTimeout(() => { overlay.remove(); onSuccess(); }, 1000);
  };
  
  document.getElementById('btn-whisper-skip').onclick = () => {
    overlay.innerHTML = \`<h2 style="color:var(--color-amber-glow); font-family:var(--font-serif); font-size:2rem; margin-top:50px;">Passwort manuell eingegeben!</h2>\`;
    setTimeout(() => { overlay.remove(); onSuccess(); }, 1000);
  };
}
