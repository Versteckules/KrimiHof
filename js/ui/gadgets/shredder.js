import { addSuspectImpact, saveState, getState, addScore } from '../../state.js';
import { showNoirAlert } from '../../main.js';

export function runGadget(stationId, onComplete, onCancel) {
  const overlay = document.createElement('div');
  overlay.id = 'gadget-fullscreen-overlay';
  overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:#111; z-index:9999; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px; box-sizing:border-box; color:white; font-family:sans-serif; text-align:center;';

  overlay.innerHTML = `
    <button id="btn-shredder-cancel" style="position:absolute; top:calc(12px + env(safe-area-inset-top, 0px)); left:calc(14px + env(safe-area-inset-left, 0px)); background:rgba(0,0,0,0.5); border:1px solid #555; color:#ddd; font-size:1.6rem; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; z-index:10;" title="Schließen">&times;</button>
    <h2 style="color:var(--color-blood-red); margin-bottom:10px;">Brand-Rekonstruktion</h2>
    <p style="margin-bottom:20px; font-size:0.9rem;">Tippe auf zwei Fetzen, um sie zu tauschen. Setze das Dokument zusammen!</p>
    <div id="shredder-grid" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:2px; background:#444; padding:2px; border:2px solid #555;"></div>
    <button class="btn-secondary" id="btn-shredder-abort" style="margin-top:25px; padding:10px 18px; font-size:0.85rem; border:1px solid #777; background:rgba(0,0,0,0.5); color:#ddd; border-radius:4px; cursor:pointer;">
      Rekonstruktion überspringen (-10 Punkte)
    </button>
  `;

  document.body.appendChild(overlay);

  document.getElementById('btn-shredder-cancel').onclick = () => {
    document.body.removeChild(overlay);
    if (onCancel) onCancel();
  };

  document.getElementById('btn-shredder-abort').onclick = () => {
    const doSkip = () => {
      import('../../state.js').then(m => m.addScore(-10));
      import('../../main.js').then(m => {
        if (m.showNoirAlert) m.showNoirAlert('Rekonstruktion abgebrochen (-10 Kommissarpunkte)', 'Punkteabzug');
      });
      showDocumentDecision();
    };

    if (window.showNoirConfirm) {
      window.showNoirConfirm("Rekonstruktion überspringen?", "Möchtest du das Puzzle überspringen und die Schnipsel grob zusammenlegen? (-10 Punkte)", doSkip);
    } else if (confirm("Möchtest du das Puzzle überspringen? (-10 Punkte)")) {
      doSkip();
    }
  };

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
      showDocumentDecision();
    }
  }

  function showDocumentDecision() {
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
        
        showNoirAlert("Schuldzuweisung notiert! Beweis gesichert.", "Beweisaufnahme");
        document.body.removeChild(overlay);
        onComplete();
      };
    });
  }

  renderGrid();
}
