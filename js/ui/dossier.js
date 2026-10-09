/**
 * dossier.js - Die Ermittlungsakte mit Tatverdächtigen-Porträts, Verhören & Beweisen (AP12)
 */

import { getState, subscribe, getPlayerRank, recordInterrogation, saveState } from '../state.js';
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

  // Aktualisiere sofort die UI, um den Button bei fehlender Freischaltung zu verstecken
  updateDossier();
}

export function updateDossier() {
  const state = getState();
  const stations = getStations() || [];
  const story = getStory();
  const result = calculateFinalResult(state);
  
  const openBtn = document.getElementById('btn-open-dossier');
  if (openBtn) {
    let hasUnassigned = false;
    if (state.inventory && state.inventory.length > 0) {
      const genericIds = ['evidence_fire_dossier', 'evidence_tape_renger', 'evidence_charter_1432'];
      state.inventory.forEach(id => {
        const assignedTo = state.assignedEvidence ? state.assignedEvidence[id] : null;
        if (!assignedTo && !genericIds.includes(id)) {
          hasUnassigned = true;
        }
      });
    }

    const isUnlocked = Boolean(
      state.suspectsUnlocked || 
      (state.solvedStations && (state.solvedStations.includes('rathaus') || state.solvedStations.length > 0))
    );

    if (isUnlocked) {
      openBtn.classList.remove('hidden');
      openBtn.style.display = 'inline-flex';
      openBtn.innerHTML = '📁 Dossier';
      if (hasUnassigned) {
        openBtn.classList.add('blink-animation');
      } else {
        openBtn.classList.remove('blink-animation');
      }
    } else {
      openBtn.classList.add('hidden');
      openBtn.style.display = 'none';
      openBtn.classList.remove('blink-animation');
    }
  }
  
  // 1. Verdächtige aktualisieren (mit Bildern und Verhör-Buttons!)
  const suspContainer = document.getElementById('dossier-suspects');
  if (suspContainer) {
    const suspectsAreUnlocked = Boolean(
      state.suspectsUnlocked || 
      (state.solvedStations && (state.solvedStations.includes('rathaus') || state.solvedStations.length > 0))
    );
    if (!suspectsAreUnlocked) {
      suspContainer.innerHTML = '<p style="color:var(--color-text-muted); font-style:italic; font-size:0.9rem;">Noch keine Verdächtigen identifiziert. Sprechen Sie mit Zeugen.</p>';
    } else {
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
              <img src="${img}" alt="${getSuspectName(s.id)}" style="width: 100%; height: 100%; object-fit: contain; background: #000;">
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
            <button class="btn-primary btn-interrogate" data-suspect-id="${s.id}" style="flex: 1; padding: 10px 8px; font-size: 0.85rem; text-align: center; border-radius: 4px; background: linear-gradient(135deg, #d4af37, #8c6d23); color: #05080f; font-weight: bold; border: 1px solid #d4af37; cursor: pointer;">
              🗣️ Verhör starten
            </button>
            <button class="btn-primary btn-arrest" data-suspect-id="${s.id}" ${canArrest ? '' : 'disabled'} style="flex: 1; padding: 10px 8px; font-size: 0.85rem; text-align: center; border-radius: 4px; ${canArrest ? 'background: var(--color-blood-red); color: white; border: none; font-weight: bold; box-shadow: 0 0 10px rgba(180, 0, 0, 0.8);' : 'opacity: 0.5; filter: grayscale(1);'}">
              🚨 Verhaften
            </button>
          </div>
        </div>
      `;
    });
    suspContainer.innerHTML = html;

    // Klick-Handler für Verhör
    suspContainer.querySelectorAll('.btn-interrogate').forEach(btn => {
      btn.addEventListener('click', () => {
        const suspectId = btn.getAttribute('data-suspect-id');
        startSuspectInterrogation(suspectId);
      });
    });

    // Klick-Handler für Verhaftung
    suspContainer.querySelectorAll('.btn-arrest').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.hasAttribute('disabled')) return;
        const suspectId = btn.getAttribute('data-suspect-id');
        const msg = 'Bist du sicher, dass du diesen Verdächtigen verhaften willst? Dies beendet die Ermittlung!';
        const doArrest = () => import('./final.js').then(mod => mod.startFinaleForSuspect(suspectId));
        
        if (window.showNoirConfirm) {
          window.showNoirConfirm(msg, doArrest, 'Verhaften');
        } else if (confirm(msg)) {
          doArrest();
        }
      });
    });
    }
  }

  // 2. Inventar & TBs
  const invContainer = document.getElementById('dossier-inventory');
  if (invContainer) {
    const tbs = state.unlockedTrackables || [];
    const inv = state.inventory || [];
    let h = `<strong>Trackables (${tbs.length}/4):</strong><br>`;
    
    const fallbackItemNames = {
      'beweis_antike_uhr': 'Gravierte Taschenuhr',
      'beweis_frachtpapiere': 'Brisante Frachtpapiere',
      'beweis_chorknaben_notiz': 'Lateinische Chor-Notiz',
      'beweis_pakt_ring': 'Orden-Siegelring',
      'foto_gipser_auto': 'Foto der flüchtenden Limousine',
      'notenblatt_heiden': 'Rußiges Partiturblatt',
      'evidence_fire_dossier': 'Brandbericht der Löschkommission',
      'evidence_polaroid_station': 'Überwachungs-Polaroid',
      'evidence_cipher_paper': 'Chiffrierter Schuldschein',
      'evidence_rosina_note': 'Historische Stiftungsurkunde',
      'evidence_briefcase_lock': 'Wappenring der Tuchmacher',
      'evidence_tape_renger': 'Dr. Rengers Tonbandaufnahme',
      'evidence_phone_warning': 'Münzfernsprecher-Aufnahme',
      'evidence_ambigram_mirror': 'Spiegelschrift-Dokument',
      'evidence_dice_gamble': 'Wirtshaus-Abrechnung',
      'evidence_wiretap_log': 'Abhörprotokoll St. Marien',
      'evidence_brass_wheel': 'Kryptorad-Botschaft',
      'evidence_uv_formula': 'Fluoreszierende Ordenslosung',
      'evidence_torn_letter': 'Zerrissener Drohbrief',
      'evidence_charter_1432': 'Bundessatzung von 1432'
    };

    const storyCatalog = (story && story.evidenceCatalog) || [];
    const genericIds = ['evidence_fire_dossier', 'evidence_tape_renger', 'evidence_charter_1432'];
    
    h += tbs.length > 0 ? tbs.join(', ') : '<em>Noch keine</em>';
    h += `<br><br><strong>Gegenstände (${inv.length}):</strong><br><div style="display:flex; flex-direction:column; gap:8px; margin-top:5px;">`;
    
    if (inv.length > 0) {
      inv.forEach(id => {
        const evData = storyCatalog.find(e => e.id === id);
        const name = (evData && evData.name) ? evData.name : (fallbackItemNames[id] || 'Beweismittel');
        const assignedTo = state.assignedEvidence ? state.assignedEvidence[id] : null;
        let suffix = '';
        if (assignedTo) {
          const suspectName = getSuspectName(assignedTo);
          suffix = ` <span style="color:#888; font-size:0.8rem;">(&rarr; ${suspectName})</span>`;
        }
        let blinkClass = (!assignedTo && !genericIds.includes(id)) ? 'blink-animation' : '';
        h += `<button class="btn-evidence ${blinkClass}" data-id="${id}" style="background: rgba(255,255,255,0.1); border: 1px solid var(--color-glass-border); padding: 8px; border-radius: 4px; color: var(--color-amber-glow); cursor: pointer; text-align: left; font-family: var(--font-serif); font-size: 1rem;">🔍 ${name}${suffix}</button>`;
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
        const evData = storyCatalog.find(e => e.id === id);
        const evidenceData = evData || {
          id: id,
          name: fallbackItemNames[id] || 'Beweismittel',
          description: 'Ein gesichertes Indiz aus den laufenden Ermittlungen.',
          targetSuspect: null
        };
        const modal = document.getElementById('modal-evidence');
        if (modal) {
          document.getElementById('evidence-title').innerText = evidenceData.name;
          
          let descHtml = evidenceData.description || '';
          if (genericIds.includes(id) || evidenceData.targetSuspect === null && !['herold','gipser','heiden'].includes(evidenceData.targetSuspect)) {
            if (genericIds.includes(id)) {
              descHtml += '<br><br><em style="color:var(--color-amber-muted);">Hinweis der Spurensicherung: Dieser Beweis belegt das allgemeine Tatgeschehen und kann keinem Verdächtigen spezifisch zugewiesen werden.</em>';
              document.getElementById('evidence-assignment-ui').style.display = 'none';
            } else {
              document.getElementById('evidence-assignment-ui').style.display = 'block';
            }
          } else {
            document.getElementById('evidence-assignment-ui').style.display = 'block';
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
                import('../main.js').then(m => m.showNoirAlert('Dieser Beweis wurde bereits zugewiesen!'));
                return;
              }
              const suspectId = newAssignBtn.getAttribute('data-suspect');
              const sName = getSuspectName(suspectId);
              
              // Custom Confirm
              const isReassignedAttempt = !!(state.reassignedEvidence && state.reassignedEvidence[id]);
              const confirmText = isReassignedAttempt
                ? `Sind Sie sicher, dass Sie diesen Beweis <b>${sName}</b> zuweisen wollen?<br><br><span style="color:var(--color-blood-red); font-weight:bold;">⚠️ Letzte Chance: Dies ist Ihre finale Neuzuordnung für diesen Beweis! Diese Entscheidung ist unumstößlich und endgültig.</span>`
                : `Sind Sie sicher, dass Sie diesen Beweis <b>${sName}</b> zuweisen wollen?<br><br><span style="color:var(--color-amber-muted); font-size:0.9rem;">Hinweis: Sollten Sie sich irren, steht Ihnen für diesen Beweis später genau EINE einmalige Neuzuordnung zur Verfügung.</span>`;

              const confirmBox = document.createElement('div');
              confirmBox.style.position = 'fixed';
              confirmBox.style.top = '0'; confirmBox.style.left = '0'; confirmBox.style.width = '100vw'; confirmBox.style.height = '100vh';
              confirmBox.style.backgroundColor = 'rgba(0,0,0,0.85)';
              confirmBox.style.display = 'flex'; confirmBox.style.justifyContent = 'center'; confirmBox.style.alignItems = 'center';
              confirmBox.style.zIndex = '99999';
              confirmBox.innerHTML = `
                <div style="background: var(--color-night-dark); border: 2px solid ${isReassignedAttempt ? 'var(--color-blood-red)' : 'var(--color-amber-muted)'}; border-radius: 8px; padding: 25px; max-width: 420px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.9); margin: 20px;">
                  <h3 style="color: var(--color-blood-red); font-family: var(--font-serif); margin-bottom: 15px; font-size: 1.4rem; text-transform: uppercase; letter-spacing: 1px;">Beweis Zuweisen</h3>
                  <p style="color: #e2e8f0; font-family: var(--font-mono); font-size: 1rem; line-height: 1.5; margin-bottom: 25px;">
                    ${confirmText}
                  </p>
                  <div style="display: flex; justify-content: space-around;">
                    <button id="btn-assign-no" class="btn-secondary" style="padding: 10px 20px;">Abbrechen</button>
                    <button id="btn-assign-yes" class="btn-primary" style="padding: 10px 20px; background: var(--color-blood-red); border:none;">Zuweisen</button>
                  </div>
                </div>
              `;
              document.body.appendChild(confirmBox);
              
              confirmBox.querySelector('#btn-assign-no').addEventListener('click', () => {
                document.body.removeChild(confirmBox);
              });
              
              confirmBox.querySelector('#btn-assign-yes').addEventListener('click', () => {
                document.body.removeChild(confirmBox);
                processAssignment(suspectId);
              });
              
              function processAssignment(suspectId) {
                // Autoritatives Mapping für alle 20 Beweise
                const evidenceMapping = {
                  'herold': [
                    'beweis_antike_uhr',
                    'evidence_polaroid_station',
                    'evidence_cipher_paper',
                    'evidence_briefcase_lock',
                    'evidence_dice_gamble'
                  ],
                  'gipser': [
                    'foto_gipser_auto',
                    'beweis_frachtpapiere',
                    'evidence_rosina_note',
                    'evidence_phone_warning',
                    'evidence_wiretap_log'
                  ],
                  'heiden': [
                    'notenblatt_heiden',
                    'beweis_chorknaben_notiz',
                    'beweis_pakt_ring',
                    'evidence_brass_wheel',
                    'evidence_uv_formula',
                    'evidence_ambigram_mirror',
                    'evidence_torn_letter'
                  ]
                };
                
                const targetSuspect = evidenceData ? evidenceData.targetSuspect : null;
                const isCorrect = (targetSuspect && targetSuspect === suspectId) || 
                                  (evidenceMapping[suspectId] && evidenceMapping[suspectId].includes(id));
                
                const feedbackEl = document.getElementById('evidence-assignment-feedback');
                
                if (isCorrect) {
                  feedbackEl.style.color = '#00aa00';
                  const rank = getPlayerRank();
                  const rankBonus = (rank.level - 1) * 3; // +0, +3, +6, +9, +12%
                  const effectiveImpact = 15 + rankBonus;
                  let reason = `Passt perfekt! (Verdacht +${effectiveImpact}% mit Rang-Bonus: ${rank.name})`;
                  if (isReassignedAttempt) reason += ' [Endgültige Zuordnung]';
                  feedbackEl.innerText = '📈 ' + reason;
                  import('../state.js').then(mod => {
                    mod.addSuspectImpact(suspectId, effectiveImpact);
                    mod.assignEvidence(id, suspectId, effectiveImpact, 0);
                    updateDossier();
                  });
                } else {
                  feedbackEl.style.color = '#ff4444';
                  let failReason = '📉 Ergibt wenig Sinn... Dieser Beweis passt nicht zu dieser Person. (Verdacht -7%, -5 Kommissarpunkte)';
                  if (isReassignedAttempt) failReason += ' [Endgültige Zuordnung]';
                  feedbackEl.innerText = failReason;
                  import('../state.js').then(mod => {
                    mod.addSuspectImpact(suspectId, -7);
                    mod.addScore(-5);
                    mod.assignEvidence(id, suspectId, -7, -5);
                    updateDossier();
                  });
                }
                
                // Hide assignment buttons after assignment
                modal.querySelectorAll('.btn-assign-evidence').forEach(b => b.style.display = 'none');
              } // end processAssignment
            });
          });

          // Check if already assigned & Einmalige Reset-Möglichkeit
          const assignUi = document.getElementById('evidence-assignment-ui');
          let resetBtn = document.getElementById('btn-reset-evidence-assign');
          if (!resetBtn && assignUi) {
            resetBtn = document.createElement('button');
            resetBtn.id = 'btn-reset-evidence-assign';
            resetBtn.className = 'btn-secondary';
            resetBtn.style.cssText = 'margin-top: 12px; width: 100%; font-size: 0.85rem; padding: 8px; border: 1px dashed var(--color-amber-muted);';
            assignUi.appendChild(resetBtn);
          }

          const currentlyAssigned = state.assignedEvidence ? state.assignedEvidence[id] : null;
          const hasAlreadyReassigned = !!(state.reassignedEvidence && state.reassignedEvidence[id]);

          if (currentlyAssigned) {
            document.getElementById('evidence-assignment-feedback').style.color = '#e2e8f0';
            const suffix = hasAlreadyReassigned ? ' (Endgültig festgelegt)' : '';
            document.getElementById('evidence-assignment-feedback').innerText = 'Aktuell zugewiesen an: ' + getSuspectName(currentlyAssigned) + suffix;
            modal.querySelectorAll('.btn-assign-evidence').forEach(b => b.style.display = 'none');
            
            if (resetBtn) {
              resetBtn.style.display = 'block';
              if (hasAlreadyReassigned) {
                resetBtn.innerText = '🔒 Endgültig zugeordnet (Neuzuordnung bereits verbraucht)';
                resetBtn.style.opacity = '0.5';
                resetBtn.style.cursor = 'not-allowed';
                resetBtn.style.borderColor = '#555';
                resetBtn.onclick = () => {
                  import('../main.js').then(m => m.showNoirAlert('Für diesen Beweis wurde die einmalige Neuzuordnung bereits genutzt! Diese Festlegung ist dauerhaft endgültig.', 'Keine Neuzuordnung möglich'));
                };
              } else {
                resetBtn.innerText = '🔄 Einmalige Neuzuordnung nutzen (Nur 1x möglich!)';
                resetBtn.style.opacity = '1';
                resetBtn.style.cursor = 'pointer';
                resetBtn.style.borderColor = 'var(--color-blood-red)';
                resetBtn.onclick = () => {
                  // Bestätigungsdialog mit expliziter Warnung
                  const confirmBox = document.createElement('div');
                  confirmBox.style.position = 'fixed';
                  confirmBox.style.top = '0'; confirmBox.style.left = '0'; confirmBox.style.width = '100vw'; confirmBox.style.height = '100vh';
                  confirmBox.style.backgroundColor = 'rgba(0,0,0,0.85)';
                  confirmBox.style.display = 'flex'; confirmBox.style.justifyContent = 'center'; confirmBox.style.alignItems = 'center';
                  confirmBox.style.zIndex = '99999';
                  confirmBox.innerHTML = `
                    <div style="background: var(--color-night-dark); border: 2px solid var(--color-blood-red); border-radius: 8px; padding: 25px; max-width: 420px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.9); margin: 20px;">
                      <h3 style="color: var(--color-blood-red); font-family: var(--font-serif); margin-bottom: 15px; font-size: 1.4rem; text-transform: uppercase; letter-spacing: 1px;">⚠️ Einmalige Neuzuordnung</h3>
                      <p style="color: #e2e8f0; font-family: var(--font-mono); font-size: 0.95rem; line-height: 1.5; margin-bottom: 25px; text-align: left;">
                        Achtung, Kommissar!<br><br>
                        Eine Neuzuordnung ist für jedes Beweisstück <b>nur ein einziges Mal im gesamten Fall</b> gestattet.
                        Ihre nächste Zuordnung für diesen Beweis ist <b>dauerhaft endgültig</b> und kann danach unter keinen Umständen mehr geändert werden.<br><br>
                        Möchten Sie die bisherige Zuordnung jetzt aufheben?
                      </p>
                      <div style="display: flex; justify-content: space-around;">
                        <button id="btn-reassign-no" class="btn-secondary" style="padding: 10px 20px;">Abbrechen</button>
                        <button id="btn-reassign-yes" class="btn-primary" style="padding: 10px 20px; background: var(--color-blood-red); border:none;">Ja, einmalig neu zuordnen</button>
                      </div>
                    </div>
                  `;
                  document.body.appendChild(confirmBox);

                  confirmBox.querySelector('#btn-reassign-no').addEventListener('click', () => {
                    document.body.removeChild(confirmBox);
                  });

                  confirmBox.querySelector('#btn-reassign-yes').addEventListener('click', () => {
                    document.body.removeChild(confirmBox);
                    import('../state.js').then(mod => {
                      const success = mod.resetEvidenceAssignment(id);
                      if (success) {
                        import('../main.js').then(m => m.showNoirAlert('Zuordnung aufgehoben! Sie können diesen Beweis nun genau EINMAL neu zuweisen. Diese Entscheidung ist danach unumstößlich.', 'Einmalige Chance'));
                        updateDossier();
                        document.getElementById('evidence-assignment-feedback').style.color = 'var(--color-amber-glow)';
                        document.getElementById('evidence-assignment-feedback').innerText = '⚠️ Sie haben noch genau 1 Neuzuordnung für dieses Beweisstück!';
                        resetBtn.style.display = 'none';
                        modal.querySelectorAll('.btn-assign-evidence').forEach(b => b.style.display = 'block');
                      } else {
                        import('../main.js').then(m => m.showNoirAlert('Für diesen Beweis wurde die einmalige Neuzuordnung bereits verbraucht!', 'Gesperrt'));
                      }
                    });
                  });
                };
              }
            }
          } else if (genericIds.includes(id)) {
            document.getElementById('evidence-assignment-feedback').style.color = '#8b0000';
            document.getElementById('evidence-assignment-feedback').innerText = 'Dieser allgemeine Beweis kann nicht zugewiesen werden.';
            modal.querySelectorAll('.btn-assign-evidence').forEach(b => b.style.display = 'none');
            if (resetBtn) resetBtn.style.display = 'none';
          } else {
            modal.querySelectorAll('.btn-assign-evidence').forEach(b => b.style.display = 'block');
            if (resetBtn) resetBtn.style.display = 'none';
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

/**
 * Startet ein Verhör mit einem Hauptverdächtigen
 * @param {string} suspectId ('herold' | 'gipser' | 'heiden')
 */
export function startSuspectInterrogation(suspectId) {
  const story = getStory();
  const treeKey = 'interrogate_' + suspectId;
  const state = getState();
  const currentSolved = state.solvedStations ? state.solvedStations.length : 0;

  recordInterrogation(suspectId, currentSolved);

  // Falls der Dialog zuvor gesperrt wurde, für diesen erneuten Anlauf entsperren
  if (state.lockedDialogues && state.lockedDialogues.includes(treeKey)) {
    const updated = state.lockedDialogues.filter(k => k !== treeKey);
    saveState({ lockedDialogues: updated });
  }

  import('./dialogue.js').then(dMod => {
    if (story && story.dialogueTrees && story.dialogueTrees[treeKey]) {
      dMod.openDialogue(story.dialogueTrees[treeKey], () => {
        const suspectGames = {
          'herold': 'safe',
          'gipser': 'shredder',
          'heiden': 'music-cryptogram'
        };
        if (suspectGames[suspectId]) {
          import(`./gadgets/${suspectGames[suspectId]}.js`).then(gameMod => {
            gameMod.runGadget(suspectId, () => {
              import('../main.js').then(m => m.showView('view-dossier'));
              updateDossier();
            });
          }).catch(err => {
            console.error("Fehler beim Laden des Suspect-Minispiels:", err);
            import('../main.js').then(m => m.showView('view-dossier'));
            updateDossier();
          });
        } else {
          import('../main.js').then(m => m.showView('view-dossier'));
          updateDossier();
        }
      }, treeKey);
    } else {
      console.warn("Dialogbaum für Verdächtigen nicht gefunden:", treeKey);
    }
  });
}
