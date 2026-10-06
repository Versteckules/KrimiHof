/**
 * dossier.js - Die Ermittlungsakte (AP12)
 */

import { getState, subscribe } from '../state.js';
import { getStations } from '../config-loader.js';
import { calculateFinalResult } from '../scoring.js';
import { showView } from '../main.js';
import { getSuspectName } from './final.js';

export function initDossier() {
  document.getElementById('btn-close-dossier').addEventListener('click', () => {
    showView('view-dashboard');
  });

  document.getElementById('btn-open-dossier').addEventListener('click', () => {
    updateDossier();
    showView('view-dossier');
  });

  // Initiale Aktualisierung
  subscribe(updateDossier);
}

function updateDossier() {
  const state = getState();
  const stations = getStations() || [];
  const result = calculateFinalResult(state);
  
  // 1. Verdächtige aktualisieren
  const suspContainer = document.getElementById('dossier-suspects');
  if (suspContainer) {
    let html = '';
    result.suspects.forEach(s => {
      const perc = result.percentages[s.id] || 0;
      html += `
        <div style="margin-bottom: 8px;">
          <div style="display:flex; justify-content:space-between; font-size: 0.9rem;">
            <span>${getSuspectName(s.id)}</span>
            <span>${perc}%</span>
          </div>
          <div style="width: 100%; background: #222; height: 8px; border-radius: 4px; overflow: hidden; margin-top: 2px;">
            <div style="width: ${perc}%; background: var(--color-blood-red); height: 100%;"></div>
          </div>
        </div>
      `;
    });
    suspContainer.innerHTML = html;
  }

  // 2. Inventar & TBs
  const invContainer = document.getElementById('dossier-inventory');
  if (invContainer) {
    const tbs = state.unlockedTrackables || [];
    const inv = state.inventory || [];
    let h = `<strong>Trackables (${tbs.length}/4):</strong><br>`;
    h += tbs.length > 0 ? tbs.join(', ') : '<em>Noch keine</em>';
    h += `<br><br><strong>Gegenstände (${inv.length}):</strong><br>`;
    h += inv.length > 0 ? inv.join('<br>') : '<em>Leer</em>';
    invContainer.innerHTML = h;
  }

  // 3. Gelöste Stationen (Pflicht & Bonus)
  const statContainer = document.getElementById('dossier-stations');
  if (statContainer) {
    const solved = state.solvedStations || [];
    let sHtml = '';
    
    // Zähle Pflicht
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
