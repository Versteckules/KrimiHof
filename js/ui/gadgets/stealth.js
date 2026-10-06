export function runGadget(stationId, onSuccess) {
  let overlay = document.getElementById('gadget-fullscreen-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'gadget-fullscreen-overlay';
    overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background: #000; z-index: 10000; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff;";
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
    <h2 style="font-family:var(--font-serif); margin-bottom:10px;">Schleich-Modus</h2>
    <p style="color:var(--color-text-muted); font-size:0.9rem; margin-bottom:20px;">Leise tippen im Rhythmus.</p>
    
    <div style="width:200px; height:200px; border-radius:50%; background:#222; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden;">
      <div id="stealth-pulse" style="position:absolute; width:100%; height:100%; background:rgba(0,255,0,0.2); transform:scale(0); border-radius:50%; transition:transform 0.5s;"></div>
      <div style="font-size:3rem;" id="stealth-count">0/10</div>
    </div>
    
    <button id="btn-stealth-tap" class="btn-primary" style="margin-top:30px; width:150px; height:150px; border-radius:50%;">TIPP</button>
  `;
  overlay.style.display = 'flex';

  let count = 0;
  let solved = false;
  
  document.getElementById('btn-stealth-tap').onclick = () => {
    if (solved) return;
    count++;
    document.getElementById('stealth-count').textContent = \`\${count}/10\`;
    const pulse = document.getElementById('stealth-pulse');
    pulse.style.transform = 'scale(1)';
    setTimeout(() => pulse.style.transform = 'scale(0)', 300);
    
    if (count >= 10) {
      solved = true;
      setTimeout(() => {
        overlay.innerHTML = \`<h2 style="color:var(--color-amber-glow); font-family:var(--font-serif); font-size:2rem; margin-top:50px;">Erfolgreich angeschlichen!</h2>\`;
        setTimeout(() => { overlay.remove(); onSuccess(); }, 1500);
      }, 500);
    }
  };
}
