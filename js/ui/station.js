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
  const choicesContainer = document.getElementById('station-choices-container');
  const manualWrap = document.getElementById('station-manual-wrap');

  titleEl.textContent = station.name;
  numStampEl.textContent = station.number.toString().padStart(2, '0');
  descEl.textContent = station.description;
  questionEl.textContent = station.riddle.question;
  
  // Reset fields
  if (answerInput) answerInput.value = '';
  if (errorMsg) errorMsg.classList.add('hidden');
  if (hintBox) hintBox.classList.add('hidden');

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

    if (choicesContainer) choicesContainer.classList.add('hidden');
    if (manualWrap) manualWrap.classList.add('hidden');
  } 
  // 2. Klickbare Multiple-Choice Optionen vorhanden? (z.B. Hauptpost, Obelisk, Lorenzkirche etc.)
  else if (station.riddle && station.riddle.choices && station.riddle.choices.length > 0) {
    if (charsContainer) charsContainer.classList.add('hidden');
    
    if (choicesContainer) {
      choicesContainer.innerHTML = '';
      choicesContainer.classList.remove('hidden');

      station.riddle.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'station-choice-btn';
        btn.innerHTML = `<span>📌</span> <span>${choice.text}</span>`;
        btn.setAttribute('data-val', choice.value);

        btn.addEventListener('click', () => {
          handleChoiceClick(station, choice, btn);
        });

        choicesContainer.appendChild(btn);
      });
    }

    if (manualWrap) manualWrap.classList.add('hidden');
  } 
  // 3. Fallback: Manuelle Eingabe
  else {
    if (charsContainer) charsContainer.classList.add('hidden');
    if (choicesContainer) choicesContainer.classList.add('hidden');
    if (manualWrap) manualWrap.classList.remove('hidden');
  }

  showView('view-station');
}

function handleCharacterClick(station, char) {
  const story = getStory();
  const treeKey = char.dialogueKey || (station.storyEventId + "_" + char.id);

  if (story && story.dialogueTrees && story.dialogueTrees[treeKey]) {
    openDialogue(story.dialogueTrees[treeKey], () => {
      onStationComplete(currentStationId);
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
  const btnSubmit = document.getElementById('btn-station-submit');
  const btnCancel = document.getElementById('btn-station-cancel');
  const btnHint = document.getElementById('btn-station-hint');
  const btnToggleManual = document.getElementById('btn-toggle-manual');
  const answerInput = document.getElementById('station-answer-input');
  const errorMsg = document.getElementById('station-error-msg');
  const hintBox = document.getElementById('station-hint-box');
  const manualWrap = document.getElementById('station-manual-wrap');

  const submitAnswer = () => {
    if (!currentStationId) return;
    const station = getStationById(currentStationId);
    if (!station) return;
    
    const inputVal = answerInput ? answerInput.value.trim() : '';
    if (!inputVal) {
      if (errorMsg) {
        errorMsg.textContent = "Bitte wähle eine Option oder gib eine Antwort ein.";
        errorMsg.classList.remove('hidden');
      }
      return;
    }

    if (checkAnswer(inputVal, station.riddle.answers)) {
      if (errorMsg) errorMsg.classList.add('hidden');
      
      if (station.isStoryEvent) {
        const story = getStory();
        let treeKey = null;
        if (inputVal.toLowerCase().includes('polizist') || inputVal.toLowerCase().includes('stahl')) {
          treeKey = station.storyEventId + "_polizist";
        } else if (inputVal.toLowerCase().includes('reporter') || inputVal.toLowerCase().includes('stift')) {
          treeKey = station.storyEventId + "_reporter";
        }

        if (treeKey && story.dialogueTrees && story.dialogueTrees[treeKey]) {
          openDialogue(story.dialogueTrees[treeKey], () => {
            onStationComplete(currentStationId);
          });
          return;
        }
      }

      startGadget(station.gadget.id, currentStationId);
    } else {
      wrongAttempts++;
      if (errorMsg) {
        errorMsg.textContent = "Das scheint nicht zu stimmen. Versuch es noch einmal.";
        errorMsg.classList.remove('hidden');
      }
      if (answerInput) {
        answerInput.classList.add('shake');
        setTimeout(() => answerInput.classList.remove('shake'), 500);
      }
    }
  };

  if (btnSubmit) btnSubmit.addEventListener('click', submitAnswer);
  
  if (answerInput) {
    answerInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submitAnswer();
    });
  }

  if (btnHint) {
    btnHint.addEventListener('click', () => {
      if (!currentStationId) return;
      const station = getStationById(currentStationId);
      if (hintBox && station) {
        hintBox.textContent = "Tipp: " + station.riddle.hint;
        hintBox.classList.remove('hidden');
      }
    });
  }

  if (btnToggleManual) {
    btnToggleManual.addEventListener('click', () => {
      if (manualWrap) {
        manualWrap.classList.toggle('hidden');
        if (!manualWrap.classList.contains('hidden') && answerInput) {
          answerInput.focus();
        }
      }
    });
  }

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
