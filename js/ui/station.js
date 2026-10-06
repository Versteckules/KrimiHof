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
  const numStampEl = document.getElementById('station-number-stamp');
  const descEl = document.getElementById('station-description');
  const questionEl = document.getElementById('station-question');
  const answerInput = document.getElementById('station-answer-input');
  const errorMsg = document.getElementById('station-error-msg');
  const hintBox = document.getElementById('station-hint-box');

  titleEl.textContent = station.name;
  numStampEl.textContent = station.number.toString().padStart(2, '0');
  descEl.textContent = station.description;
  questionEl.textContent = station.riddle.question;
  
  // Reset fields
  answerInput.value = '';
  errorMsg.classList.add('hidden');
  hintBox.classList.add('hidden');

  showView('view-station');
}

export function initStationView() {
  const btnSubmit = document.getElementById('btn-station-submit');
  const btnCancel = document.getElementById('btn-station-cancel');
  const btnHint = document.getElementById('btn-station-hint');
  const answerInput = document.getElementById('station-answer-input');
  const errorMsg = document.getElementById('station-error-msg');
  const hintBox = document.getElementById('station-hint-box');

  const submitAnswer = () => {
    if (!currentStationId) return;
    const station = getStationById(currentStationId);
    
    const inputVal = answerInput.value.trim();
    if (!inputVal) {
      errorMsg.textContent = "Bitte gib eine Antwort ein.";
      errorMsg.classList.remove('hidden');
      return;
    }

    if (checkAnswer(inputVal, station.riddle.answers)) {
      errorMsg.classList.add('hidden');
      // Direkt zum narrativen Gadget/Zeugen-Gespräch (Story-Walk)
      startGadget(station.gadget.id, currentStationId);
    } else {
      wrongAttempts++;
      errorMsg.textContent = "Das scheint nicht zu stimmen. Versuch es noch einmal.";
      errorMsg.classList.remove('hidden');
      answerInput.classList.add('shake');
      setTimeout(() => answerInput.classList.remove('shake'), 500);
    }
  };

  btnSubmit.addEventListener('click', submitAnswer);
  
  answerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitAnswer();
  });

  btnHint.addEventListener('click', () => {
    if (!currentStationId) return;
    const station = getStationById(currentStationId);
    hintBox.textContent = "Tipp: " + station.riddle.hint;
    hintBox.classList.remove('hidden');
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
