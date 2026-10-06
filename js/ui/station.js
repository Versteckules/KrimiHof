/**
 * station.js - Rätselmaske, Szene, Entscheidungs-Dialog (AP8)
 */

import { getStationById, getConfig } from '../config-loader.js';
import { checkAnswer } from '../answers.js';
import { showView } from '../main.js';
import { markStationSolved, getState } from '../state.js';
import { startGadget } from './gadgets/gadget-manager.js';

let currentStationId = null;
let wrongAttempts = 0;

export function openStation(stationId) {
  currentStationId = stationId;
  
  const station = getStationById(stationId);
  if (!station) return;

  const titleEl = document.getElementById('station-title');
  const descEl = document.getElementById('station-description');

  titleEl.textContent = station.name;
  descEl.textContent = station.description;

  showView('view-station');
}

export function initStationView() {
  const btnSubmit = document.getElementById('btn-station-submit');
  const btnCancel = document.getElementById('btn-station-cancel');

  const submitAnswer = () => {
    if (!currentStationId) return;
    const station = getStationById(currentStationId);
    
    // Direkt zum narrativen Gadget/Zeugen-Gespräch (Story-Walk)
    startGadget(station.gadget.id, currentStationId);
  };

  btnSubmit.addEventListener('click', submitAnswer);

  btnCancel.addEventListener('click', () => {
    // Zurück zur Karte
    showView('view-dashboard');
  });
}

/**
 * Wird nach erfolgreichem Gadget/Dialog aufgerufen (AP9 Hook)
 */
export function onStationComplete(stationId) {
  const isBonus = stationId.startsWith('saale_') || stationId.startsWith('altstadt_');
  markStationSolved(stationId, { points: isBonus ? 15 : 10, isBonus });
  alert(`Station ${stationId} abgeschlossen! Du wurdest zurück zur Karte geleitet.`);
  
  // Prüfe Finale
  const state = getState();
  const mandatorySolved = state.solvedStations.filter(
    sid => !sid.startsWith('saale_') && !sid.startsWith('altstadt_')
  ).length;
  if (mandatorySolved >= getConfig().gameplay.mandatoryStationCount) {
    // Hole final.js und öffne das Finale
    import('./final.js').then(module => {
      module.openFinal();
    });
  } else {
    showView('view-dashboard');
  }
}
