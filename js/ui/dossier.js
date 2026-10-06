/**
 * dossier.js - Die Ermittlungsakte mit Tatverdächtigen-Porträts, Verhören & Beweisen (AP12)
 */

import { getState, subscribe } from '../state.js';
import { getStations, getStory } from '../config-loader.js';
import { calculateFinalResult } from '../scoring.js';
import { showView } from '../main.js';
import { getSuspectName } from './final.js';
import { openDialogue } from './dialogue.js';
import { openIntro } from './intro.js';

export function initDossier() {
  const closeBtn = document.getElementById('btn-close-dossier');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      showView('view-dashboard');
    });
  }

  const openBtn = document.getElementById('btn-open-dossier');
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      updateDossier();
      showView('view-dossier');
    });
  }

  // Replay Prologue Button
  const replayIntroBtn = document.getElementById('btn-dossier-replay-intro');
  if (replayIntroBtn) {
    replayIntroBtn.addEventListener('click', () => {
      openIntro();
    });
  }

  // Initiale Aktualisierung
  subscribe(updateDossier);

  const closeEvBtn = document.getElementById('btn-close-evidence');
  if (closeEvBtn) {
    closeEvBtn.addEventListener('click', () => {
      document.getElementById('modal-evidence').classList.add('hidden');
    });
  }
}

function updateDossier() {
  const state = getState();
  const stations = getStations() || [];
  const story = getStory();
  const result = calculateFinalResult(state);
  
  // 1. Verdächtige aktualisieren (mit Bildern und Verhör-Buttons!)
  const suspContainer = document.getElementById('dossier-suspects');
  if (suspContainer) {
    let html = '';
    const storySuspects = (story && story.suspects) ? story.suspects : {};

    const pflichtCount = (state.solvedStations || []).filter(sid => !sid.startsWith('saale_') && !sid.startsWith('altstadt_')).length;
    const isAllStationsSolved = pflichtCount >= 12;

    result.suspects.forEach((s, index) => {
      const perc = result.percentages[s.id] || 0;
      const suspectData = storySuspects[s.id] || {};
      const img = suspectData.image || 'assets/avatar.jpg';
      const role = suspectData.role || 'Tatverdächtige(r)';
      const motive = suspectData.motive || '';
      
      const isHighest = index === 0;
      const canArrest = isAllStationsSolved && (perc > 50 || isHighest);

      html += `
        <div class="dossier-suspect-card" style="background: rgba(10, 14, 23, 0.85); border: 1px solid var(--color-glass-border); border-radius: 8px; padding: 12px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; gap: 12px; align-items: center;">
            <div style="width: 60px; height: 60px; border-radius: 50%; overflow: hidden; border: 2px solid var(--color-amber-muted); flex-shrink: 0; box-shadow: 0 0 10px rgba(0,0,0,0.5);">
              <img src="${img}" alt="${getSuspectName(s.id)}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="flex-grow: 1;">
              <div style="font-family: var(--font-serif); font-weight: bold; color: var(--color-amber-glow); font-size: 1.05rem;">
                ${getSuspectName(s.id)}
              </div>
              <div style="font-size: 0.8rem; color: var(--color-text-muted);">
                ${role}
              </div>
            </div>
          </div>

          <div style="font-size: 0.78rem; color: #ccc; line-height: 1.35; max-height: 48px; overflow: hidden; text-overflow: ellipsis;">
            ${motive}
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 3px;">
              <span>Verdachtslast:</span>
              <span style="color: ${perc > 50 ? 'var(--color-blood-red)' : 'var(--color-amber-glow)'}; font-weight: bold;">${perc}%</span>
            </div>
            <div style="width: 100%; background: #222; height: 7px; border-radius: 4px; overflow: hidden;">
              <div style="width: ${perc}%; background: ${perc > 50 ? 'var(--color-blood-red)' : 'var(--color-amber-muted)'}; height: 100%; transition: width 0.4s ease;"></div>
            </div>
          </div>

          <div style="display: flex; gap: 8px; margin-top: 8px;">
            <button class="btn-primary btn-arrest" data-suspect-id="${s.id}" ${canArrest ? '' : 'disabled'} style="width: 100%; padding: 10px 12px; font-size: 0.9rem; text-align: center; border-radius: 4px; ${canArrest ? 'background: var(--color-blood-red); color: white; border: none; font-weight: bold; box-shadow: 0 0 10px rgba(180, 0, 0, 0.8);' : 'opacity: 0.5; filter: grayscale(1);'}">
              🚨 Verhaften
            </button>
          </div>
        </div>
      `;
    });
    suspContainer.innerHTML = html;


    // Klick-Handler für Verhaftung
    suspContainer.querySelectorAll('.btn-arrest').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.hasAttribute('disabled')) return;
        const suspectId = btn.getAttribute('data-suspect-id');
        if (confirm('Bist du sicher, dass du diesen Verdächtigen verhaften willst? Dies beendet die Ermittlung!')) {
          // Trigger finale logic directly for this suspect
          import('./final.js').then(mod => mod.startFinaleForSuspect(suspectId));
        }
      });
    });
  }

  // 2. Inventar & TBs
  const invContainer = document.getElementById('dossier-inventory');
  if (invContainer) {
    const tbs = state.unlockedTrackables || [];
    const inv = state.inventory || [];
    let h = `<strong>Trackables (${tbs.length}/4):</strong><br>`;
    const itemNames = {
      'evidence_fire_dossier': 'Brandnotiz von Dr. Renger',
      'evidence_polaroid_station': 'Überwachungs-Polaroid',
      'evidence_cipher_paper': 'Chiffrierter Schuldschein',
      'evidence_rosina_note': 'Rosina-Stiftungsurkunde',
      'evidence_briefcase_lock': 'Geknackter Aktenkoffer',
      'evidence_tape_renger': 'Tonbandaufnahme Renger',
      'evidence_phone_warning': 'Anonyme Warn-Nachricht',
      'evidence_ambigram_mirror': 'Geheimes Ambigramm',
      'evidence_dice_gamble': 'Gezinkte Würfel vom Wärschtlamo',
      'evidence_wiretap_log': 'Abhörprotokoll Geheimbund',
      'evidence_brass_wheel': 'Entschlüsselte Botschaft',
      'evidence_uv_formula': 'Fluoreszierende Losung',
      'evidence_torn_letter': 'Zerrissener Drohbrief',
      'evidence_charter_1432': 'Historische Gründungsurkunde'
    };
    
    h += tbs.length > 0 ? tbs.join(', ') : '<em>Noch keine</em>';
    h += `<br><br><strong>Gegenstände (${inv.length}):</strong><br><div style="display:flex; flex-direction:column; gap:8px; margin-top:5px;">`;
    
    if (inv.length > 0) {
      inv.forEach(id => {
        const name = itemNames[id] || id;
        h += `<button class="btn-evidence" data-id="${id}" style="background: rgba(255,255,255,0.1); border: 1px solid var(--color-glass-border); padding: 8px; border-radius: 4px; color: var(--color-amber-glow); cursor: pointer; text-align: left; font-family: var(--font-serif); font-size: 1rem;">🔍 ${name}</button>`;
      });
    } else {
      h += '<em>Leer</em>';
    }
    h += '</div>';
    invContainer.innerHTML = h;

    // Klick-Handler für Beweisstücke
    invContainer.querySelectorAll('.btn-evidence').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const evidenceData = (story.evidenceCatalog || []).find(e => e.id === id);
        const modal = document.getElementById('modal-evidence');
        if (modal && evidenceData) {
          document.getElementById('evidence-title').innerText = evidenceData.name;
          document.getElementById('evidence-desc').innerText = evidenceData.description;
          modal.classList.remove('hidden');
        }
      });
    });

    // Close Handler
    const closeEvBtn = document.getElementById('btn-close-evidence');
    if (closeEvBtn) {
      // prevent multiple bindings by cloning or ensuring it's bound once. 
      // easiest is to just bind it here and it will overwrite or we bind it in initDossier.
    }
  }

  const statContainer = document.getElementById('dossier-stations');
  if (statContainer) {
    const solved = state.solvedStations || [];
    let sHtml = '';
    
    let pflichtCount = 0;
    solved.forEach(sid => {
      if (!sid.startsWith('saale_') && !sid.startsWith('altstadt_')) {
        pflichtCount++;
      }
    });

    sHtml += `<div style="width: 100%; margin-bottom: 5px; font-size:0.9rem;">Pflicht-Fortschritt: ${Math.min(12, pflichtCount)}/12</div>`;
    
    stations.forEach(st => {
      const isSolved = solved.includes(st.id);
      if (isSolved) {
        const isBonus = st.id.startsWith('saale_') || st.id.startsWith('altstadt_');
        const color = isBonus ? '#c0c0c0' : 'var(--color-green)';
        sHtml += `<span style="background: ${color}; color: #000; padding: 2px 6px; border-radius: 4px; font-size: 0.8rem; font-weight: bold;">${st.name}</span>`;
      }
    });
    statContainer.innerHTML = sHtml;
  }
}
