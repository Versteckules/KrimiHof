/**
 * gadget-manager.js - Zentraler Hub für die 17 Gadgets (AP9)
 */

import { onStationComplete } from '../station.js';
import { getStationById, getStory } from '../../config-loader.js';
import { recordDecision, addInventoryItem } from '../../state.js';
import { stationDialogueTrees } from '../../station-dialogues.js';

export function startGadget(gadgetId, stationId) {
  const station = getStationById(stationId);
  if (!station) return;

  import(`./${gadgetId}.js`)
    .then(mod => {
      if (mod && mod.runGadget) {
        mod.runGadget(stationId, () => showPostGadgetDialogue(stationId, station));
      } else {
        showPostGadgetDialogue(stationId, station);
      }
    })
    .catch(err => {
      console.warn(`Gadget ${gadgetId} module not found, skipping to dialogue.`, err);
      alert("Hinweis: Ein Mini-Spiel konnte nicht geladen werden! (" + err.message + ")\n\nFalls du das Spiel direkt von der Festplatte geöffnet hast (Doppelklick), blockiert der Browser die Spiele. Bitte starte das Spiel über die 'START.bat' Datei!");
      showPostGadgetDialogue(stationId, station);
    });
}

function showPostGadgetDialogue(stationId, station) {
  const story = getStory();

  // Wenn ein komplexer Dialogbaum existiert, nutze diesen!
  if (stationDialogueTrees && stationDialogueTrees[stationId]) {
    import('../dialogue.js').then(mod => {
      mod.openDialogue(stationDialogueTrees[stationId], () => {
        // Beim Beenden des Dialogs Beweis eintragen und Station abschließen
        const evidence = (story.evidenceCatalog || []).find(e => e.stationId === stationId);
        if (evidence) {
          addInventoryItem(evidence.id);
        }
        onStationComplete(stationId);
      });
    });
    return;
  }

  // Fallback: Das alte statische UI
  let overlay = document.getElementById('gadget-mock-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'gadget-mock-overlay';
    overlay.style.cssText = "position:fixed; top:0; left:0; right:0; bottom:0; background: rgba(5, 8, 15, 0.98); z-index: 10000; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff; text-align:center; padding:var(--space-md); overflow-y:auto;";
    document.body.appendChild(overlay);
  }
  
  const isBonus = station.type === 'bonus';
  const icon = isBonus ? '🏆' : '🔓';
  const color = isBonus ? 'var(--color-amber-glow)' : 'var(--color-night-light)';

  // Build narrative HTML
  let html = `
    <h2 style="color:${color}; margin-bottom: var(--space-sm); font-family: var(--font-serif); font-size:2rem;">${icon} Beweis gesichert!</h2>
  `;

  if (station.witness) {
    html += `
      <div id="witness-box" style="width:100%; max-width:500px; background:rgba(0,0,0,0.6); border-left:4px solid var(--color-blood-red); padding:var(--space-md); margin-bottom:var(--space-lg); text-align:left; opacity:0; transition:opacity 1s ease; transform:translateY(10px); display:flex; gap:15px; align-items:flex-start;">
        <div style="flex-shrink:0; width:60px; height:60px; border-radius:50%; overflow:hidden; border:2px solid var(--color-night-light);">
          <img src="${station.witness.image || 'assets/avatar.jpg'}" alt="Zeuge" style="width:100%; height:100%; object-fit:cover;">
        </div>
        <div>
          <h3 style="color:var(--color-blood-red); margin-bottom:5px; font-size:1.1rem; font-family:var(--font-serif);">🗣️ ${station.witness.name}</h3>
          <p style="color:var(--color-text-muted); font-size:0.8rem; text-transform:uppercase; letter-spacing:1px; margin-bottom:10px;">${station.witness.role}</p>
          <p style="color:var(--color-text-main); font-size:1rem; font-style:italic; line-height:1.5;">${station.witness.dialogue}</p>
        </div>
      </div>
    `;
  }

  if (isBonus && station.bonusReward) {
    html += `
      <div id="bonus-box" style="width:100%; max-width:500px; padding:var(--space-md); margin-bottom:var(--space-lg); border: 1px dashed var(--color-amber-glow); border-radius: 5px; opacity:0; transition:opacity 1s ease;">
        <p style="color:var(--color-amber-glow); font-weight:bold;">🎁 Belohnung: ${station.bonusReward}</p>
      </div>
    `;
  }

  // Get decisions for this station if they exist
  const decisions = (story && story.dialogueDecisions && story.dialogueDecisions[stationId]) || null;

  if (decisions && decisions.length > 0) {
    html += `
      <div id="decision-box" style="width:100%; max-width:500px; margin-top:var(--space-md); opacity:0; transition:opacity 0.5s ease; display:flex; flex-direction:column; gap:10px;">
        <h4 style="color:var(--color-night-light); font-size:0.9rem; margin-bottom:5px;">Wie reagierst du auf diese Aussage?</h4>
    `;
    decisions.forEach((dec, idx) => {
      html += `<button class="btn-decision btn-secondary" data-choice-id="${dec.id}" data-suspect="${dec.suspect}" data-points="${dec.points}" style="text-align:left; padding:10px; font-size:0.9rem;">${dec.text}</button>`;
    });
    html += `</div>`;
  } else {
    html += `
      <button id="btn-mock-gadget-success" class="btn-primary" style="width:100%; max-width:300px; margin-top:var(--space-md); opacity:0; transition:opacity 0.5s ease;">Akte aktualisieren & Weiter</button>
    `;
  }

  overlay.innerHTML = html;
  overlay.style.display = 'flex';

  // Animation Sequence
  setTimeout(() => {
    const wBox = document.getElementById('witness-box');
    if(wBox) { wBox.style.opacity = '1'; wBox.style.transform = 'translateY(0)'; }
  }, 100);

  if (isBonus) {
    setTimeout(() => {
      const bBox = document.getElementById('bonus-box');
      if(bBox) bBox.style.opacity = '1';
    }, 1000);
  }

  const showButtonsDelay = isBonus ? 1500 : 800;
  
  setTimeout(() => {
    if (decisions && decisions.length > 0) {
      const dBox = document.getElementById('decision-box');
      if (dBox) dBox.style.opacity = '1';
      
      const buttons = overlay.querySelectorAll('.btn-decision');
      buttons.forEach(btn => {
        btn.onclick = () => {
          const choiceId = btn.getAttribute('data-choice-id');
          const suspect = btn.getAttribute('data-suspect');
          const points = parseInt(btn.getAttribute('data-points'), 10);
          
          recordDecision(stationId, choiceId, suspect, points);
          
          const evidence = (story.evidenceCatalog || []).find(e => e.stationId === stationId);
          if (evidence) {
            addInventoryItem(evidence.id);
          }

          overlay.style.display = 'none';
          onStationComplete(stationId);
        };
      });
    } else {
      const btn = document.getElementById('btn-mock-gadget-success');
      if(btn) {
        btn.style.opacity = '1';
        btn.onclick = () => {
          const evidence = (story.evidenceCatalog || []).find(e => e.stationId === stationId);
          if (evidence) {
            addInventoryItem(evidence.id);
          }
          overlay.style.display = 'none';
          onStationComplete(stationId);
        };
      }
    }
  }, showButtonsDelay);
}
