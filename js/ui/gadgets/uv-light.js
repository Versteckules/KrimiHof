export function runGadget(stationId, onSuccess) {
  let overlay = document.getElementById('gadget-fullscreen-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'gadget-fullscreen-overlay';
    overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background: #050510; z-index: 10000; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px; overflow:hidden;";
    document.body.appendChild(overlay);
  }

  // The hidden text layer with glowing purple text
  const hiddenTextHTML = `
    <div style="font-family:var(--font-serif); font-size:1.8rem; font-weight:bold; color:#d200ff; text-shadow: 0 0 10px #d200ff, 0 0 20px #8b00ff; transform: rotate(-5deg); pointer-events:none;">
      SCHLAPPEN-PAKT<br>1823 - EWIGE TREUE
    </div>
  `;

  overlay.innerHTML = `
    <h2 style="color:#d200ff; font-family:var(--font-mono); margin-bottom:10px; position:absolute; top:20px; z-index:2; pointer-events:none;">UV-Scanner aktiv</h2>
    <p style="color:var(--color-text-muted); position:absolute; top:60px; z-index:2; pointer-events:none;">Suche die Wand nach Geheimtinte ab.</p>
    
    <!-- Background Wall (Dark) -->
    <div style="position:absolute; width:100%; height:100%; background: #111 url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%25%22 height=%22100%25%22><filter id=%22noise%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.5%22 numOctaves=%223%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%220.1%22/></svg>'); z-index:0;"></div>
    
    <!-- Glowing UV Layer (Masked) -->
    <div id="uv-glow-layer" style="position:absolute; width:100%; height:100%; display:flex; align-items:center; justify-content:center; z-index:1; 
         mask-image: radial-gradient(circle at 50% 50%, black 0%, transparent 80px); 
         -webkit-mask-image: radial-gradient(circle at 50% 50%, black 0%, transparent 80px);
         mask-repeat: no-repeat; -webkit-mask-repeat: no-repeat;
         opacity: 0.2; transition: opacity 0.5s;">
      ${hiddenTextHTML}
    </div>
    
    <!-- Interaction Layer -->
    <div id="uv-touch-area" style="position:absolute; width:100%; height:100%; z-index:3; cursor:crosshair;"></div>
  `;
  overlay.style.display = 'flex';

  const glowLayer = document.getElementById('uv-glow-layer');
  const touchArea = document.getElementById('uv-touch-area');
  let solved = false;
  let charge = 0;

  function moveSpotlight(e) {
    if (solved) return;
    
    let clientX = e.clientX;
    let clientY = e.clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      e.preventDefault();
    }
    
    glowLayer.style.maskPosition = \`\${clientX - 80}px \${clientY - 80}px\`;
    glowLayer.style.webkitMaskPosition = \`\${clientX - 80}px \${clientY - 80}px\`;
    glowLayer.style.opacity = '1';
    
    // Einfache Lösungslogik: Lade auf, solange bewegt wird
    charge += 1;
    if (charge > 100 && !solved) {
      solved = true;
      glowLayer.style.maskImage = 'none';
      glowLayer.style.webkitMaskImage = 'none';
      glowLayer.style.opacity = '1';
      glowLayer.style.animation = 'pulse 1s infinite alternate';
      
      setTimeout(() => {
        overlay.innerHTML = \`<h2 style="color:#d200ff; font-family:var(--font-serif); font-size:2rem; margin-top:50px;">Geheimnis gelüftet!</h2>\`;
        setTimeout(() => {
          overlay.remove();
          onSuccess();
        }, 1500);
      }, 1500);
    }
  }

  touchArea.addEventListener('mousemove', moveSpotlight);
  touchArea.addEventListener('touchmove', moveSpotlight, {passive: false});
}
