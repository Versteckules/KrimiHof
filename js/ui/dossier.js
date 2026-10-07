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

          <div style="font-size: 0.78rem; color: #ccc; line-height: 1.35; max-height: none; overflow: visible;">
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
        const assignedTo = state.assignedEvidence ? state.assignedEvidence[id] : null;
        let suffix = '';
        if (assignedTo) {
          const suspectName = getSuspectName(assignedTo);
          suffix = ` <span style="color:#888; font-size:0.8rem;">(&rarr; ${suspectName})</span>`;
        }
        h += `<button class="btn-evidence" data-id="${id}" style="background: rgba(255,255,255,0.1); border: 1px solid var(--color-glass-border); padding: 8px; border-radius: 4px; color: var(--color-amber-glow); cursor: pointer; text-align: left; font-family: var(--font-serif); font-size: 1rem;">🔍 ${name}${suffix}</button>`;
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
          document.getElementById('evidence-title').innerText = evidenceData.name || 'Beweis';
          
          let descHtml = evidenceData.description || '';
          const genericIds = ['evidence_fire_dossier', 'evidence_tape_renger', 'evidence_charter_1432'];
          if (genericIds.includes(id)) {
            descHtml += '<br><br><em style="color:var(--color-amber-muted);">Hinweis der Spurensicherung: Dieser Beweis belegt lediglich das allgemeine Motiv, kann aber jedem Verdächtigen zugewiesen werden.</em>';
          }
          document.getElementById('evidence-desc').innerHTML = descHtml;
          
          // Reset feedback
          document.getElementById('evidence-assignment-feedback').innerText = '';
          
          // Wire up assignment buttons
          modal.querySelectorAll('.btn-assign-evidence').forEach(assignBtn => {
            // Remove old listeners by cloning
            const newAssignBtn = assignBtn.cloneNode(true);
            assignBtn.parentNode.replaceChild(newAssignBtn, assignBtn);
            
            newAssignBtn.addEventListener('click', () => {
              if (state.assignedEvidence && state.assignedEvidence[id]) {
                alert('Dieser Beweis wurde bereits zugewiesen!');
                return;
              }
              const suspectId = newAssignBtn.getAttribute('data-suspect');
              const sName = getSuspectName(suspectId);
              if (!confirm('Sind Sie sicher, dass Sie diesen Beweis ' + sName + ' zuweisen wollen? Diese Entscheidung kann nicht rückgängig gemacht werden!')) {
                return;
              }
              
              // Hardcoded mapping for which evidence belongs to whom
              const evidenceMapping = {
                'herold': ['evidence_polaroid_station', 'evidence_cipher_paper', 'evidence_briefcase_lock', 'evidence_dice_gamble'],
                'gipser': ['evidence_rosina_note', 'evidence_wiretap_log', 'evidence_phone_warning'],
                'heiden': ['evidence_torn_letter', 'evidence_uv_formula', 'evidence_ambigram_mirror', 'evidence_brass_wheel']
              };
              
              const feedbackEl = document.getElementById('evidence-assignment-feedback');
              
              // Generic evidence fits everyone slightly
              const generic = ['evidence_fire_dossier', 'evidence_tape_renger', 'evidence_charter_1432'];
              
              if ((evidenceMapping[suspectId] && evidenceMapping[suspectId].includes(id)) || generic.includes(id)) {
                feedbackEl.style.color = '#006400';
                feedbackEl.innerText = '📈 Passt perfekt! (Verdacht +15%)';
                import('../state.js').then(mod => {
                  mod.addSuspectImpact(suspectId, 15);
                  mod.assignEvidence(id, suspectId);
                  updateDossier(); // Refresh UI behind modal
                });
              } else {
                feedbackEl.style.color = '#8b0000';
                feedbackEl.innerText = '📉 Ergibt wenig Sinn... (Verdacht -7%)';
                import('../state.js').then(mod => {
                  mod.addSuspectImpact(suspectId, -7);
                  mod.assignEvidence(id, suspectId);
                  updateDossier(); // Refresh UI behind modal
                });
              }
              
              // Hide buttons after assignment
              modal.querySelectorAll('.btn-assign-evidence').forEach(b => b.style.display = 'none');
            });
          });

          // Check if already assigned
          const currentlyAssigned = state.assignedEvidence ? state.assignedEvidence[id] : null;
          if (currentlyAssigned) {
            document.getElementById('evidence-assignment-feedback').style.color = '#555';
            document.getElementById('evidence-assignment-feedback').innerText = 'Bereits zugewiesen an: ' + getSuspectName(currentlyAssigned);
            modal.querySelectorAll('.btn-assign-evidence').forEach(b => b.style.display = 'none');
          } else {
            modal.querySelectorAll('.btn-assign-evidence').forEach(b => b.style.display = 'block');
          }

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
        const color = isBonus ? 'var(--color-text-muted)' : 'var(--color-green)';
        sHtml += `<span style="border: 1px solid ${color}; color: ${color}; padding: 2px 6px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; background: rgba(0,0,0,0.3);">${st.name}</span>`;
      }
    });
    statContainer.innerHTML = sHtml;
  }
}
