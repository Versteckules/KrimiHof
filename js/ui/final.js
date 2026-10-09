/**
 * final.js - Das Finale (AP11)
 */

import { getState } from '../state.js';
import { showView } from '../main.js';
import { calculateFinalResult } from '../scoring.js';
import { getConfig, getFinalCoords, getStory } from '../config-loader.js';
import { openIntro } from './intro.js';

let accusedSuspect = null;

/**
 * Liefert den Anzeigenamen eines Verdächtigen (aus story.json, Fallback config.js)
 */
export function getSuspectName(id) {
  const story = getStory();
  if (story && story.suspects && story.suspects[id]) {
    return story.suspects[id].name;
  }
  const fromConfig = (getConfig().gameplay.suspects || []).find(s => s.id === id);
  return fromConfig ? fromConfig.name : 'Unbekannt';
}

export function initFinalView() {
  const container = document.getElementById('final-suspects-container');
  if (!container) return;

  const story = getStory();
  const suspects = story && story.suspects ? Object.values(story.suspects) : [];

  container.innerHTML = '';
  suspects.forEach(s => {
    const btn = document.createElement('button');
    btn.className = 'btn-secondary';
    btn.id = `btn-accuse-${s.id}`;
    btn.style.flex = '1';
    btn.style.padding = '20px 10px';
    btn.style.fontSize = '1.1rem';
    btn.textContent = getSuspectName(s.id);
    btn.onclick = () => handleAccusation(s.id);
    container.appendChild(btn);
  });

  document.getElementById('btn-print-diploma').addEventListener('click', generateDiploma);
}

export function openFinal() {
  showView('view-final');
}

function formatFinalCoords() {
  const fc = getFinalCoords();
  if (!fc) return 'Koordinaten nicht verfügbar';
  return `Final-Dose:<br>${fc.coordsDMM}`;
}

function handleAccusation(suspectId) {
  if (accusedSuspect) return; // Bereits beschuldigt

  const state = getState();
  const result = calculateFinalResult(state);
  const accusedName = getSuspectName(suspectId);
  const realName = getSuspectName(result.murderer);
  const story = getStory();
  
  const avatar = story.suspects && story.suspects[suspectId] ? story.suspects[suspectId].image : 'assets/avatar.jpg';
  const realAvatar = story.suspects && story.suspects[result.murderer] ? story.suspects[result.murderer].image : 'assets/avatar.jpg';
  const ending = story.endings && story.endings[suspectId] ? story.endings[suspectId] : { confession: 'Ich war es!' };
  
  const perc = result.percentages[result.murderer];
  let outroSlides = [];

  if (suspectId === result.murderer) {
    if (perc >= 75) {
      outroSlides = [
        {
          image: avatar,
          badge: 'DIE ÜBERFÜHRUNG',
          title: 'Die Falle schnappt zu!',
          text: `Mit wasserdichten Beweisen (Beweislast: ${perc}%) konfrontierst du ${accusedName}. Unter der erdrückenden Last der Indizien bricht ${accusedName} schließlich zusammen.`,
          audio: 'assets/audio/story/outro_win_ueberfuehrung.mp3'
        },
        {
          image: avatar,
          badge: 'DAS GESTÄNDNIS',
          title: 'Die Wahrheit kommt ans Licht',
          text: `"${ending.confession}"`,
          audio: `assets/audio/story/outro_confession_${suspectId}.mp3`
        },
        {
          image: 'assets/hero_hof_night.jpg',
          badge: 'FALL GELÖST',
          title: 'Hinter Gittern!',
          text: 'Der Pakt der Schlappen-Erben ist endgültig zerschlagen! Der Drahtzieher wird dem Haftrichter vorgeführt und zu einer langen Freiheitsstrafe verurteilt. Die historischen Urkunden sind sichergestellt.',
          audio: 'assets/audio/story/outro_win_abschluss.mp3'
        }
      ];
    } else {
      outroSlides = [
        {
          image: avatar,
          badge: 'DIE ÜBERFÜHRUNG',
          title: 'Zu wenig Beweise!',
          text: `Du konfrontierst ${accusedName}. Zwar bricht ${accusedName} unter dem Druck zusammen und gesteht die Tat...`,
          audio: 'assets/audio/story/outro_insufficient_ueberfuehrung.mp3'
        },
        {
          image: avatar,
          badge: 'DAS GESTÄNDNIS',
          title: 'Die bittere Wahrheit',
          text: `"${ending.confession}"`,
          audio: `assets/audio/story/outro_confession_${suspectId}.mp3`
        },
        {
          image: 'assets/kommissar_stahl.jpg',
          badge: 'FREISPRUCH',
          title: 'Mangel an Beweisen!',
          text: `Doch der Triumph ist von kurzer Dauer. Die Beweislast liegt nur bei ${perc}% (Benötigt: 75%). Ein teurer Staranwalt erwirkt einen Freispruch auf Kaution. ${accusedName} entkommt der Justiz! Der Fall ist gelöst, aber der Täter ist auf freiem Fuß.`,
          audio: 'assets/audio/story/outro_insufficient_abschluss.mp3'
        }
      ];
    }
  } else {
    outroSlides = [
      {
        image: avatar,
        badge: 'EIN FATALER IRRTUM',
        title: 'Du hast den Falschen!',
        text: `Du konfrontierst ${accusedName} mit deinen Beweisen. Doch ${accusedName} lacht dich nur aus und weist jede Schuld souverän von sich. Deine Theorie bricht in sich zusammen.`,
        audio: 'assets/audio/story/outro_fail_irrtum.mp3'
      },
      {
        image: realAvatar,
        badge: 'DER WAHRE TÄTER',
        title: 'Eine verpasste Chance',
        text: `Während du Zeit mit dem Falschen vergeudet hast, hat ${realName} die Gelegenheit genutzt, alle Spuren zu verwischen! Die Beweise hätten eindeutig gegen ${realName} gesprochen (${perc}%).`,
        audio: 'assets/audio/story/outro_fail_chance.mp3'
      },
      {
        image: 'assets/kommissar_stahl.jpg',
        badge: 'FALL GESCHLOSSEN',
        title: 'Der Pakt triumphiert',
        text: 'Die Akte wird geschlossen. Die Urkunden sind verschwunden und der Pakt der Schlappen-Erben agiert weiter aus den Schatten. Du hast versagt!',
        audio: 'assets/audio/story/outro_fail_abschluss.mp3'
      }
    ];
  }

  // Set the accused state
  accusedSuspect = suspectId;

  // Start Intro (Outro slides)
  openIntro(() => {
    // This callback runs when the Outro slides finish
    showView('view-final');
    
    const resContainer = document.getElementById('final-result');
    const title = document.getElementById('final-result-title');
    const text = document.getElementById('final-result-text');
    const coords = document.getElementById('final-coords');
    
    // Hide the suspect container now that we're showing results
    const container = document.getElementById('final-suspects-container');
    if (container) container.style.display = 'none';

    resContainer.classList.remove('hidden');

    if (suspectId === result.murderer) {
      if (perc >= 75) {
        title.textContent = 'Glückwunsch! Fall gelöst.';
        title.style.color = 'var(--color-green, #2e8b57)';
      } else {
        title.textContent = 'Fall gelöst (aber Täter auf freiem Fuß)';
        title.style.color = 'var(--color-amber-glow)';
      }
    } else {
      title.textContent = 'Fall ungelöst!';
      title.style.color = 'var(--color-blood-red)';
    }

    text.innerHTML = 'Hier sind die Koordinaten für die Final-Dose:';
    coords.innerHTML = formatFinalCoords();

  }, outroSlides);
}

export function startFinaleForSuspect(suspectId) {
  openFinal();
  // Ensure the UI is populated first if it wasn't
  initFinalView();
  
  // Hide all suspect buttons since we already made a choice
  const container = document.getElementById('final-suspects-container');
  if (container) {
    container.style.display = 'none';
  }
  
  handleAccusation(suspectId);
}

function generateDiploma() {
  const resultContainer = document.getElementById('final-result');
  const existingBanner = document.getElementById('diploma-banner-wrapper');
  if (existingBanner) existingBanner.remove();

  const bannerWrapper = document.createElement('div');
  bannerWrapper.id = 'diploma-banner-wrapper';
  bannerWrapper.style = "margin-top: 30px; border-top: 1px solid var(--color-glass-border); padding-top: 20px;";
  
  const bannerUrl = new URL('assets/diploma_banner.jpg', window.location.href).href;
  
  bannerWrapper.innerHTML = `
    <h3 style="color: var(--color-amber-glow); font-size: 1.2rem; margin-bottom: 15px;">Dein Geocaching-Banner (GCBYXW0)</h3>
    <img src="${bannerUrl}" alt="Diplom Banner" style="width: 100%; max-width: 600px; border-radius: 8px; border: 2px solid var(--color-amber-muted); margin-bottom: 15px;">
    <p style="color: var(--color-text-muted); font-size: 0.9rem; margin-bottom: 10px;">Füge diesen Code in dein Geocaching-Profil ein:</p>
    <textarea readonly style="width: 100%; height: 60px; background: rgba(0,0,0,0.5); color: #fff; font-family: monospace; border: 1px solid var(--color-glass-border); padding: 10px; border-radius: 4px; resize: none;"><a href="${window.location.origin}${window.location.pathname}"><img src="${bannerUrl}" alt="Der Pakt der Schlappen-Erben - Meister-Ermittler" /></a></textarea>
  `;
  
  resultContainer.appendChild(bannerWrapper);
  bannerWrapper.scrollIntoView({ behavior: 'smooth' });
}
