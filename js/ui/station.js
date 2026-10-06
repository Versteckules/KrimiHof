/**
 * station.js - Rätselmaske, Tatort-Szene, Klickbare Personen-Karten & Entscheidungs-Dialog (AP8)
 */

import { getStationById, getConfig, getStory } from '../config-loader.js';
import { checkAnswer } from '../answers.js';
import { showView } from '../main.js';
import { markStationSolved, getState } from '../state.js';
import { startGadget } from './gadgets/gadget-manager.js';
import { openDialogue } from './dialogue.js';

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

  const charsContainer = document.getElementById('station-characters-container');
  const manualWrap = document.getElementById('station-manual-wrap');

  titleEl.textContent = station.name;
  numStampEl.textContent = station.number.toString().padStart(2, '0');
  descEl.textContent = station.description;
  
  if (errorMsg) errorMsg.classList.add('hidden');
  if (hintBox) hintBox.classList.add('hidden');

  // Easter Egg 4: Glockenschlag um Mitternacht an der Michaeliskirche
  if (stationId === 'michaeliskirche') {
    const d = new Date();
    if (d.getHours() === 0 && d.getMinutes() <= 15) {
      const state = getState();
      if (!state.easterEggBell) {
        alert("EASTER EGG GEFUNDEN! Der unheimliche Mitternachtsschlag der Michaeliskirche ertönt! (+25 Punkte)");
        import('../state.js').then(mod => mod.saveState({ easterEggBell: true, score: (state.score || 0) + 25 }));
      }
    }
  }

  // 1. Klickbare Personen vorhanden? (z.B. Station 1 Rathaus)
  if (station.characters && station.characters.length > 0) {
    if (charsContainer) {
      charsContainer.innerHTML = '';
      charsContainer.classList.remove('hidden');

      station.characters.forEach(char => {
        const card = document.createElement('div');
        card.className = 'character-card';
        card.innerHTML = `
          <div class="character-card-img-wrap">
            <img src="${char.image}" alt="${char.name}" class="character-card-img">
            ${char.badge ? `<span class="character-card-badge">${char.badge}</span>` : ''}
          </div>
          <div class="character-card-body">
            <div>
              <div class="character-card-name">${char.name}</div>
              <div class="character-card-role">${char.role}</div>
              <p class="character-card-desc">${char.description || ''}</p>
            </div>
            <button class="character-card-btn" type="button">🗣️ Mit ${char.name.split(' ')[0]} sprechen</button>
          </div>
        `;

        card.addEventListener('click', () => {
          handleCharacterClick(station, char);
        });

        charsContainer.appendChild(card);
      });
    }

    if (manualWrap) manualWrap.classList.add('hidden');
  } 
  // 2. Fallback: Direktes Starten des Gadgets (Keine Abfragen mehr, nur GPS-Trigger)
  else {
    if (charsContainer) charsContainer.classList.add('hidden');
    if (manualWrap) {
      manualWrap.classList.remove('hidden');
      manualWrap.innerHTML = `
        <button class="btn-primary" id="btn-station-direct-gadget" style="width: 100%; padding: 15px; font-size: 1.2rem; margin-top: 20px;">
          🔎 Tatort untersuchen
        </button>
      `;
      document.getElementById('btn-station-direct-gadget').addEventListener('click', () => {
        import('./gadgets/gadget-manager.js').then(mod => mod.startGadget(station.gadget.id, currentStationId));
      });
    }
  }

  showView('view-station');
}

function handleCharacterClick(station, char) {
  const story = getStory();
  const treeKey = char.dialogueKey || (station.storyEventId + "_" + char.id);

  if (story && story.dialogueTrees && story.dialogueTrees[treeKey]) {
    openDialogue(story.dialogueTrees[treeKey], () => {
      startGadget(station.gadget.id, currentStationId);
    });
  } else {
    // Fallback falls kein Dialog hinterlegt ist
    startGadget(station.gadget.id, currentStationId);
  }
}

function handleChoiceClick(station, choice, btnEl) {
  const isCorrect = checkAnswer(choice.value, station.riddle.answers);
  const errorMsg = document.getElementById('station-error-msg');
  const hintBox = document.getElementById('station-hint-box');

  if (isCorrect) {
    btnEl.classList.add('correct');
    if (errorMsg) errorMsg.classList.add('hidden');

    setTimeout(() => {
      startGadget(station.gadget.id, currentStationId);
    }, 400);
  } else {
    btnEl.classList.add('wrong');
    setTimeout(() => btnEl.classList.remove('wrong'), 800);

    if (errorMsg) {
      errorMsg.textContent = "Das scheint nicht zu stimmen. Sieh dir den Hinweis an oder wähle eine andere Option.";
      errorMsg.classList.remove('hidden');
    }
    if (hintBox) {
      hintBox.textContent = "Tipp: " + station.riddle.hint;
      hintBox.classList.remove('hidden');
    }
  }
}

export function initStationView() {
  const btnCancel = document.getElementById('btn-station-cancel');
  
  if (btnCancel) {
    btnCancel.addEventListener('click', () => {
      showView('view-dashboard');
    });
  }
}

/**
 * Wird nach erfolgreichem Gadget/Dialog aufgerufen (AP9 Hook)
 */
export function onStationComplete(stationId) {
  const isBonus = stationId.startsWith('saale_') || stationId.startsWith('altstadt_');
  markStationSolved(stationId, { points: isBonus ? 15 : 10, isBonus });
  
  // Prüfe Finale
  const state = getState();
  const mandatorySolved = state.solvedStations.filter(
    sid => !sid.startsWith('saale_') && !sid.startsWith('altstadt_')
  ).length;
  
  if (mandatorySolved >= getConfig().gameplay.mandatoryStationCount) {
    import('./final.js').then(module => {
      module.openFinal();
    });
  } else {
    showView('view-dashboard');
  }
}
