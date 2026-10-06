export function runGadget(stationId, onSuccess) {
  let overlay = document.getElementById('gadget-fullscreen-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'gadget-fullscreen-overlay';
    overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background: #000; z-index: 10000; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff;";
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
    <h2 style="font-family:var(--font-serif); margin-bottom:10px;">Phantombild</h2>
    <p style="color:var(--color-text-muted); font-size:0.9rem; margin-bottom:20px;">Baue das Gesicht nach.</p>
    
    <div style="width:250px; height:300px; background:#fff; border-radius:5px; padding:10px; display:flex; flex-direction:column; align-items:center; justify-content:space-around;">
      <div style="display:flex; align-items:center; gap:10px; width:100%; justify-content:space-between;">
        <button class="btn-secondary" style="padding:5px;">&lt;</button>
        <div style="width:150px; height:50px; background:#ccc; text-align:center; color:#000; line-height:50px;">Hut 1</div>
        <button class="btn-secondary" style="padding:5px;">&gt;</button>
      </div>
      <div style="display:flex; align-items:center; gap:10px; width:100%; justify-content:space-between;">
        <button class="btn-secondary" style="padding:5px;">&lt;</button>
        <div style="width:150px; height:50px; background:#ddd; text-align:center; color:#000; line-height:50px;">Augen 2</div>
        <button class="btn-secondary" style="padding:5px;">&gt;</button>
      </div>
      <div style="display:flex; align-items:center; gap:10px; width:100%; justify-content:space-between;">
        <button class="btn-secondary" style="padding:5px;">&lt;</button>
        <div style="width:150px; height:50px; background:#eee; text-align:center; color:#000; line-height:50px;">Bart 3</div>
        <button class="btn-secondary" style="padding:5px;">&gt;</button>
      </div>
    </div>
    
    <button id="btn-mugshot-submit" class="btn-primary" style="margin-top:30px;">Identität bestätigen</button>
  `;
  overlay.style.display = 'flex';

  document.getElementById('btn-mugshot-submit').onclick = () => {
    overlay.innerHTML = \`<h2 style="color:var(--color-amber-glow); font-family:var(--font-serif); font-size:2rem; margin-top:50px;">Beweis gesichert!</h2>\`;
    setTimeout(() => { overlay.remove(); onSuccess(); }, 1000);
  };
}
