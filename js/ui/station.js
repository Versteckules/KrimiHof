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
  wrongAttempts = 0;
  
  const station = getStationById(stationId);
  if (!station) return;

  const titleEl = document.getElementById('station-title');
  const questionEl = document.getElementById('station-question');
  const inputEl = document.getElementById('station-answer-input');
  const errorEl = document.getElementById('station-error');
  const hintEl = document.getElementById('station-hint');

  titleEl.textContent = station.name;
  questionEl.textContent = station.riddle.question;
  inputEl.value = '';
  errorEl.classList.add('hidden');
  hintEl.classList.add('hidden');

  showView('view-station');
}

export function initStationView() {
  const btnSubmit = document.getElementById('btn-station-submit');
  const btnCancel = document.getElementById('btn-station-cancel');
  const inputEl = document.getElementById('station-answer-input');
  const errorEl = document.getElementById('station-error');
  const hintEl = document.getElementById('station-hint');

  const submitAnswer = () => {
    if (!currentStationId) return;
    const station = getStationById(currentStationId);
    const config = getConfig();
    const val = inputEl.value;
    
    if (checkAnswer(val, station.riddle.answers)) {
      // Erfolgreich!
      errorEl.classList.add('hidden');
      
      // AP9: Starte das verknüpfte Gadget
      startGadget(station.gadget.id, currentStationId);
    } else {
      // Falsch!
      wrongAttempts++;
      errorEl.textContent = `Das ist leider nicht korrekt. Versuch: ${wrongAttempts}`;
      errorEl.classList.remove('hidden');

      if (wrongAttempts >= config.gameplay.maxWrongAnswersBeforeHint) {
        hintEl.textContent = `Tipp: ${station.riddle.hint || "Schau genau hin."}`;
        hintEl.classList.remove('hidden');
      }
    }
  };

  btnSubmit.addEventListener('click', submitAnswer);
  inputEl.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') submitAnswer();
  });

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
