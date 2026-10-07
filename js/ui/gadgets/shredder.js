import { addSuspectImpact, saveState, getState } from '../../state.js';

export function runGadget(stationId, onComplete) {
  const overlay = document.createElement('div');
  overlay.id = 'gadget-fullscreen-overlay';
  overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:#111; z-index:9999; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px; box-sizing:border-box; color:white; font-family:sans-serif; text-align:center;';

  overlay.innerHTML = `
    <h2 style="color:var(--color-blood-red); margin-bottom:10px;">Brand-Rekonstruktion</h2>
    <p style="margin-bottom:20px; font-size:0.9rem;">Tippe auf zwei Fetzen, um sie zu tauschen. Setze das Dokument zusammen!</p>
    <div id="shredder-grid" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:2px; background:#444; padding:2px; border:2px solid #555;"></div>
  `;

  document.body.appendChild(overlay);

  const grid = document.getElementById('shredder-grid');
  // Texts for the 9 pieces (solved order)
  const solvedTexts = [
    "Geheimer", "Bundespakt", "von 1823",
    "Wir,", "die wahren", "Erben,",
    "überschreiben", "alles an", "[LÜCKE]"
  ];

  // Shuffle array
  let pieces = [...solvedTexts].sort(() => Math.random() - 0.5);
  let selectedDiv = null;

  function renderGrid() {
    grid.innerHTML = '';
    pieces.forEach((text, index) => {
      const pieceDiv = document.createElement('div');
      pieceDiv.style.cssText = 'width:80px; height:80px; background:#e0d8b0; color:#333; display:flex; align-items:center; justify-content:center; font-family:serif; font-weight:bold; font-size:0.8rem; cursor:pointer; user-select:none; text-align:center; padding:5px; border:1px dashed rgba(0,0,0,0.2);';
      pieceDiv.innerText = text;
      
      pieceDiv.onclick = () => {
        if (!selectedDiv) {
          selectedDiv = { index, element: pieceDiv };
          pieceDiv.style.border = '2px solid red';
        } else {
          // Swap
          const temp = pieces[selectedDiv.index];
          pieces[selectedDiv.index] = pieces[index];
          pieces[index] = temp;
          selectedDiv = null;
          renderGrid();
          checkWin();
        }
      };
      
      grid.appendChild(pieceDiv);
    });
  }

  function checkWin() {
    const isWin = pieces.every((p, i) => p === solvedTexts[i]);
    if (isWin) {
      overlay.innerHTML = `
        <h2 style="color:var(--color-blood-red); margin-bottom:20px;">Dokument wiederhergestellt!</h2>
        <div style="background:#e0d8b0; color:#333; padding:20px; font-family:serif; font-size:1.2rem; border-radius:5px; max-width:300px; margin-bottom:20px;">
          "Geheimer Bundespakt von 1823.<br><br>Wir, die wahren Erben, überschreiben alles an <b>[LÜCKE]</b>."
        </div>
        <p style="margin-bottom:15px;">Ein Teil ist völlig verbrannt. Auf wen deutet der restliche Kontext hin? (Deine Wahl beeinflusst die Ermittlung!)</p>
        <div style="display:flex; flex-direction:column; gap:10px; width:100%; max-width:300px;">
          <button class="btn-primary suspect-choice" data-suspect="herold" data-val="15">Valentin Herold (+15% Schuld)</button>
          <button class="btn-primary suspect-choice" data-suspect="gipser" data-val="15">Katharina von Gipser (+15% Schuld)</button>
          <button class="btn-primary suspect-choice" data-suspect="heiden" data-val="15">Severin Heiden (+15% Schuld)</button>
        </div>
      `;

      overlay.querySelectorAll('.suspect-choice').forEach(btn => {
        btn.onclick = () => {
          const suspect = btn.getAttribute('data-suspect');
          const val = parseInt(btn.getAttribute('data-val'), 10);
          addSuspectImpact(suspect, val);
          
          alert("Schuldzuweisung notiert! Beweis gesichert.");
          document.body.removeChild(overlay);
          onComplete();
        };
      });
    }
  }

  renderGrid();
}
