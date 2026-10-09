/**
 * station.js - Rätselmaske, Tatort-Szene, Klickbare Personen-Karten & Entscheidungs-Dialog (AP8)
 */

import { getStationById, getConfig, getStory } from '../config-loader.js';
import { checkAnswer } from '../answers.js';
import { showView, showNoirAlert } from '../main.js';
import { markStationSolved, getState, unlockSuspectsInState } from '../state.js';
import { startGadget } from './gadgets/gadget-manager.js';
import { openDialogue } from './dialogue.js';

let currentStationId = null;
let wrongAttempts = 0;

export function openStation(stationId) {
  const state = getState();
  if (state.solvedStations && state.solvedStations.includes(stationId)) {
    showNoirAlert('Du hast diesen Tatort bereits vollständig untersucht. Die Beteiligten lehnen weitere Gespräche ohne ihren Anwalt ab!', 'Bereits untersucht');
    showView('view-dashboard');
    return;
  }

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
  // 2. Fallback auf Rätsel (Riddle)
  else if (station.riddle && station.riddle.choices && station.riddle.choices.length > 0) {
    if (charsContainer) charsContainer.classList.add('hidden');
    if (manualWrap) {
      manualWrap.classList.remove('hidden');
      
      let html = `<h4 style="font-family: var(--font-mono); font-size: 1rem; color: #8b0000; margin-bottom: 15px;">${station.riddle.question}</h4>`;
      html += `<div style="display: flex; flex-direction: column; gap: 10px;">`;
      
      station.riddle.choices.forEach(choice => {
        html += `<button class="btn-secondary btn-riddle-choice" data-val="${choice.value}" style="text-align: left;">${choice.text}</button>`;
      });
      html += `</div>`;
      
      manualWrap.innerHTML = html;
      
      manualWrap.querySelectorAll('.btn-riddle-choice').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const val = e.target.getAttribute('data-val');
          handleChoiceClick(station, { value: val }, e.target);
        });
      });
    }
  }
  // 3. Spezielles Easter Egg ohne Gadget (z.B. Jean Pauls Geist)
  else if (station.type === 'easteregg' || station.id === 'jean_paul') {
    if (charsContainer) charsContainer.classList.add('hidden');
    if (manualWrap) {
      manualWrap.classList.remove('hidden');
      manualWrap.innerHTML = `
        <div style="background: rgba(139,0,139,0.15); border: 1px solid #8b008b; border-radius: 8px; padding: 20px; text-align: center; margin-top: 15px;">
          <h3 style="color: #da70d6; font-family: var(--font-serif); font-size: 1.4rem; margin-bottom: 10px;">🌟 Geheimes Easter Egg</h3>
          <p style="font-size: 0.95rem; line-height: 1.5; margin-bottom: 20px;">Die Luft flimmert violett... Eine geisterhafte Präsenz offenbart sich!</p>
          <button class="btn-primary" id="btn-jean-paul-trigger" style="background: #8b008b; border-color: #ba55d3; width: 100%; padding: 12px; font-size: 1.1rem;">
            👻 Jean Pauls Geist befragen
          </button>
        </div>
      `;
      document.getElementById('btn-jean-paul-trigger').addEventListener('click', () => {
        const story = getStory();
        if (story && story.dialogueTrees && story.dialogueTrees['jean_paul_dialogue']) {
          openDialogue(story.dialogueTrees['jean_paul_dialogue'], () => onStationComplete('jean_paul'), 'jean_paul_dialogue');
        } else {
          onStationComplete('jean_paul');
        }
      });
    }
  }
  // 4. Letzter Fallback: Direktes Starten des Gadgets
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
        if (station.gadget && station.gadget.id) {
          startGadget(station.gadget.id, currentStationId);
        } else {
          onStationComplete(station.id);
        }
      });
    }
  }

  showView('view-station');
}

function handleCharacterClick(station, char) {
  const story = getStory();
  const treeKey = char.dialogueKey || (station.storyEventId + "_" + char.id);

  const postDialogueAction = () => {
    if (station.id === 'rathaus' && char.id === 'reporter') {
      import('./gadgets/reporter-camera.js').then(mod => {
        mod.runGadget(station.id, () => {
          onStationComplete(station.id);
        });
      }).catch(err => {
        console.error(err);
        onStationComplete(station.id);
      });
    } else if (station.id === 'rathaus' && char.id === 'polizist') {
      import('./gadgets/policeman-paper.js').then(mod => {
        mod.runGadget(station.id, () => {
          onStationComplete(station.id);
        });
      }).catch(err => {
        console.error(err);
        onStationComplete(station.id);
      });
    } else if (station.type === 'easteregg' || station.id === 'jean_paul') {
      onStationComplete(station.id);
    } else if (station.gadget && station.gadget.id) {
      startGadget(station.gadget.id, currentStationId, () => {
        onStationComplete(station.id);
      });
    } else {
      onStationComplete(station.id);
    }
  };

  if (story && story.dialogueTrees && story.dialogueTrees[treeKey]) {
    openDialogue(story.dialogueTrees[treeKey], postDialogueAction, treeKey);
  } else {
    // Fallback falls kein Dialog hinterlegt ist
    postDialogueAction();
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
  if (stationId === 'jean_paul') {
    markStationSolved(stationId, { points: 50, isBonus: true });
    import('../state.js').then(mod => {
      const state = mod.getState();
      mod.saveState({ easterEgg_jean_paul: true, score: (state.score || 0) + 50 });
      import('../main.js').then(m => {
        m.showNoirAlert('🌟 GEHEIMES EASTER EGG GELÖST!\nDu hast Jean Pauls Geist gefunden und seinen poetischen Geistersegen empfangen! (+50 Detektiv-Punkte)', 'Meisterleistung');
        showView('view-dashboard');
      });
      import('../fx.js').then(FX => {
        if (FX.playSuccessWumms) FX.playSuccessWumms();
      });
    });
    return;
  }

  const isBonus = stationId.startsWith('saale_') || stationId.startsWith('altstadt_') || stationId.startsWith('versteck_');
  markStationSolved(stationId, { points: isBonus ? 15 : 10, isBonus });
  
  if (stationId === 'rathaus') {
    unlockSuspectsInState();
    const suspectSlides = [
      {
        image: 'assets/suspect_herold.webp',
        badge: 'HAUPTVERDÄCHTIGER 1',
        title: 'Valentin Herold',
        text: 'Antiquitätenhändler & Kunstsammler. Er wollte die unschätzbaren Original-Urkunden des Bundes von 1823 an einen internationalen Schattenmarkt veräußern.',
        audio: 'assets/audio/story/suspect_intro_herold.mp3'
      },
      {
        image: 'assets/suspect_gipser.webp',
        badge: 'HAUPTVERDÄCHTIGE 2',
        title: 'Katharina von Gipser',
        text: 'Kommunalpolitikerin & Immobilieninvestorin. Die uralten Erbrechte im Bundespakt hätten ihre millionenschweren Bauprojekte am Saaleufer auf der Stelle blockiert.',
        audio: 'assets/audio/story/suspect_intro_gipser.mp3'
      },
      {
        image: 'assets/suspect_heiden.webp',
        badge: 'HAUPTVERDÄCHTIGER 3',
        title: 'Severin Heiden',
        text: 'Domorganist & Chorleiter an St. Michaelis. Ein fanatischer Traditionstreuer, der das Vermächtnis der Schlappen-Erben vor profaner Entweihung schützen wollte.',
        audio: 'assets/audio/story/suspect_intro_heiden.mp3'
      }
    ];
    import('./intro.js').then(module => {
      module.openIntro(() => {
        checkFinalAndProceed();
      }, suspectSlides);
    });
    return;
  }
  
  checkFinalAndProceed();
}

function checkFinalAndProceed() {
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
