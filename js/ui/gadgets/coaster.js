export function runGadget(stationId, onSuccess) {
  let overlay = document.getElementById('gadget-fullscreen-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'gadget-fullscreen-overlay';
    overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background: #111; z-index: 10000; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff;";
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
    <h2 style="font-family:var(--font-serif); margin-bottom:10px;">Zerrissenes Dokument</h2>
    <p style="color:var(--color-text-muted); font-size:0.9rem; margin-bottom:20px;">Ziehe die Schnipsel zusammen.</p>
    
    <div id="puzzle-area" style="position:relative; width:300px; height:400px; background:#222; border:2px dashed #444; overflow:hidden;">
      <div class="puzzle-piece" data-target-x="50" data-target-y="50" style="position:absolute; top:200px; left:10px; width:100px; height:150px; background:#fdf5e6; color:#000; padding:10px; cursor:grab; box-shadow:2px 2px 5px rgba(0,0,0,0.5);">"Wenn Sie<br>dies lesen...</div>
      <div class="puzzle-piece" data-target-x="150" data-target-y="50" style="position:absolute; top:10px; left:180px; width:100px; height:150px; background:#fdf5e6; color:#000; padding:10px; cursor:grab; box-shadow:2px 2px 5px rgba(0,0,0,0.5);">...brennt das<br>Rathaus bereits."</div>
      <div class="puzzle-piece" data-target-x="50" data-target-y="200" style="position:absolute; top:250px; left:150px; width:100px; height:150px; background:#fdf5e6; color:#000; padding:10px; cursor:grab; box-shadow:2px 2px 5px rgba(0,0,0,0.5);">Der Pakt<br>der Erben</div>
      <div class="puzzle-piece" data-target-x="150" data-target-y="200" style="position:absolute; top:50px; left:50px; width:100px; height:150px; background:#fdf5e6; color:#000; padding:10px; cursor:grab; box-shadow:2px 2px 5px rgba(0,0,0,0.5);">duldet keinen<br>Verrat.</div>
    </div>
  `;
  overlay.style.display = 'flex';

  const pieces = document.querySelectorAll('.puzzle-piece');
  const area = document.getElementById('puzzle-area');
  let activePiece = null;
  let offsetX = 0, offsetY = 0;
  let solvedPieces = 0;

  pieces.forEach(p => {
    function startDrag(e) {
      if (p.classList.contains('locked')) return;
      activePiece = p;
      const rect = p.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      offsetX = clientX - rect.left;
      offsetY = clientY - rect.top;
      p.style.zIndex = 10;
      p.style.cursor = 'grabbing';
    }
    p.addEventListener('mousedown', startDrag);
    p.addEventListener('touchstart', startDrag, {passive: true});
  });

  function moveDrag(e) {
    if (!activePiece) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const areaRect = area.getBoundingClientRect();
    
    let x = clientX - areaRect.left - offsetX;
    let y = clientY - areaRect.top - offsetY;
    
    activePiece.style.left = \`\${x}px\`;
    activePiece.style.top = \`\${y}px\`;
  }

  function endDrag() {
    if (!activePiece) return;
    const targetX = parseInt(activePiece.getAttribute('data-target-x'));
    const targetY = parseInt(activePiece.getAttribute('data-target-y'));
    
    const currentX = parseFloat(activePiece.style.left);
    const currentY = parseFloat(activePiece.style.top);
    
    if (Math.abs(currentX - targetX) < 20 && Math.abs(currentY - targetY) < 20) {
      // Snap
      activePiece.style.left = \`\${targetX}px\`;
      activePiece.style.top = \`\${targetY}px\`;
      activePiece.classList.add('locked');
      activePiece.style.cursor = 'default';
      activePiece.style.boxShadow = 'none';
      activePiece.style.border = 'none';
      solvedPieces++;
      
      if (solvedPieces === pieces.length) {
        setTimeout(() => {
          overlay.innerHTML = \`<h2 style="color:var(--color-amber-glow); font-family:var(--font-serif); font-size:2rem; margin-top:50px;">Beweis gesichert!</h2>\`;
          setTimeout(() => { overlay.remove(); onSuccess(); }, 1500);
        }, 1000);
      }
    }
    
    activePiece.style.zIndex = 1;
    activePiece = null;
  }

  window.addEventListener('mousemove', moveDrag);
  window.addEventListener('mouseup', endDrag);
  window.addEventListener('touchmove', moveDrag, {passive: true});
  window.addEventListener('touchend', endDrag);
}
