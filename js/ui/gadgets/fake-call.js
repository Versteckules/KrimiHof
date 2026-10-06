export function runGadget(stationId, onSuccess) {
  let overlay = document.getElementById('gadget-fullscreen-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'gadget-fullscreen-overlay';
    overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background: #000; z-index: 10000; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff;";
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; width:100%;">
      <div style="font-family:var(--font-mono); font-size:1.2rem; color:#888; margin-bottom:10px;">Eingehender Anruf</div>
      <h2 style="font-size:2.5rem; margin-bottom:50px;">Unbekannt</h2>
      
      <div id="call-status" style="font-size:1rem; color:#0f0; margin-bottom:50px; opacity:0; font-family:var(--font-mono);">00:00</div>
      
      <div id="call-actions" style="display:flex; gap:40px; margin-top:50px;">
        <button id="btn-call-decline" style="width:70px; height:70px; border-radius:50%; background:#ff3b30; border:none; display:flex; align-items:center; justify-content:center; cursor:pointer;">
          <svg viewBox="0 0 24 24" width="30" height="30" stroke="#fff" stroke-width="2" fill="none"><path d="M10.5 4.5l-3 3m0 0l-3-3m3 3V1.5m4.5 10.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5z"></path></svg>
        </button>
        <button id="btn-call-accept" class="pulse-anim" style="width:70px; height:70px; border-radius:50%; background:#34c759; border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow: 0 0 20px #34c759;">
          <svg viewBox="0 0 24 24" width="30" height="30" stroke="#fff" stroke-width="2" fill="none"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path></svg>
        </button>
      </div>
    </div>
    <style>
      @keyframes pulsePhone {
        0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(52, 199, 89, 0.7); }
        70% { transform: scale(1.1); box-shadow: 0 0 0 20px rgba(52, 199, 89, 0); }
        100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(52, 199, 89, 0); }
      }
      .pulse-anim { animation: pulsePhone 1.5s infinite; }
    </style>
  `;
  overlay.style.display = 'flex';

  document.getElementById('btn-call-accept').onclick = () => {
    document.getElementById('call-actions').style.display = 'none';
    const status = document.getElementById('call-status');
    status.style.opacity = '1';
    
    // Play sound simulation
    let sec = 0;
    status.textContent = "00:00";
    const int = setInterval(() => {
      sec++;
      status.textContent = \`00:0\${sec}\`;
      if (sec >= 4) {
        clearInterval(int);
        setTimeout(() => { overlay.remove(); onSuccess(); }, 1000);
      }
    }, 1000);
  };
  
  document.getElementById('btn-call-decline').onclick = () => {
    document.getElementById('call-actions').style.display = 'none';
    const status = document.getElementById('call-status');
    status.style.opacity = '1';
    status.style.color = '#ff3b30';
    status.textContent = "Anruf abgelehnt";
    setTimeout(() => { overlay.remove(); onSuccess(); }, 1500);
  };
}
