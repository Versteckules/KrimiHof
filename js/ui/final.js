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

function formatFinalCoords(isFullWin = false) {
  const fc = getFinalCoords();
  if (!fc) return '<div style="color:red;">Koordinaten nicht verfügbar</div>';

  const standard = fc.standardFinal || {
    title: 'Haupt-Final (GCBYXW0)',
    coordsDMM: fc.coordsDMM || 'N 50° 19.345 E 011° 55.412',
    hint: fc.hint || 'Im Schutz der alten Kopfweide...'
  };

  const bonus = fc.bonusFinal || {
    title: 'Bonus-Cache: Das Vermächtnis des Meisters',
    coordsDMM: 'N 50° 19.510 E 011° 55.680',
    bonusCode: 'SCHLAPPEN-1823-REX',
    hint: 'Im alten Mauerwerk des Torbogens, hinter dem losen Sandsteinquader auf der Nordseite.'
  };

  let html = `
    <!-- 1. Haupt-Final (Immer sichtbar für alle ehrlichen Finder) -->
    <div style="background: rgba(16, 185, 129, 0.12); border: 2px solid #10b981; border-radius: 8px; padding: 15px; margin-bottom: 15px; text-align: left; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <span style="color: #6ee7b7; font-weight: bold; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px;">📍 ${standard.title || 'Haupt-Final (GCBYXW0)'}</span>
        <span style="background: rgba(16, 185, 129, 0.25); color: #a7f3d0; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">Freigeschaltet</span>
      </div>
      <div style="font-family: var(--font-mono); font-size: 1.35rem; color: #ffffff; font-weight: bold; margin-bottom: 8px; letter-spacing: 0.5px;">
        ${standard.coordsDMM}
      </div>
      ${standard.hint ? `<div style="font-size: 0.85rem; color: #cbd5e1; font-style: italic; border-top: 1px dashed rgba(255,255,255,0.15); padding-top: 6px;">💡 Hinweis: ${standard.hint}</div>` : ''}
    </div>
  `;

  if (isFullWin) {
    // Fall 1: Täter ins Gefängnis (>= 75%) -> Finalkords UND Bonus
    html += `
      <!-- 2. Meister-Bonus (Exklusiv bei erfolgreicher Überführung >= 75%) -->
      <div style="background: linear-gradient(135deg, rgba(212, 163, 89, 0.2) 0%, rgba(139, 101, 8, 0.3) 100%); border: 2px solid #d4af37; border-radius: 8px; padding: 15px; text-align: left; box-shadow: 0 0 20px rgba(212, 163, 89, 0.35);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span style="color: #f5d79e; font-weight: bold; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px;">⭐ ${bonus.title || 'Bonus-Cache: Das Vermächtnis'}</span>
          <span style="background: #d4af37; color: #000; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">Täter Inhaftiert!</span>
        </div>
        <div style="font-family: var(--font-mono); font-size: 1.35rem; color: #ffd700; font-weight: bold; margin-bottom: 8px; letter-spacing: 0.5px;">
          ${bonus.coordsDMM}
        </div>
        ${bonus.bonusCode ? `<div style="font-family: var(--font-mono); font-size: 0.9rem; color: #ffffff; margin-bottom: 6px;">🔑 Bonus-Code: <strong style="color: #fcd34d;">${bonus.bonusCode}</strong></div>` : ''}
        ${bonus.hint ? `<div style="font-size: 0.85rem; color: #f5ecc8; font-style: italic; border-top: 1px dashed rgba(212, 163, 89, 0.3); padding-top: 6px;">💡 Bonus-Hinweis: ${bonus.hint}</div>` : ''}
      </div>
    `;
  } else {
    // Fall 2: Täter nicht ins Gefängnis (< 75% oder falscher Täter) -> Nur Finalkords
    html += `
      <!-- Bonus Gesperrt -->
      <div style="background: rgba(30, 41, 59, 0.4); border: 1px dashed #64748b; border-radius: 8px; padding: 12px; text-align: left; opacity: 0.85;">
        <div style="display: flex; align-items: center; gap: 8px; color: #94a3b8; font-size: 0.85rem; font-style: italic;">
          <span style="font-size: 1.2rem;">🔒</span>
          <span><strong>Bonus-Cache verpasst:</strong> Der Drahtzieher konnte entkommen und hat alle Spuren zum Bonus-Versteck verwischt. (Voraussetzung für den Bonus: Mindestens 75% Beweislast &amp; Täter hinter Gittern)</span>
        </div>
      </div>
    `;
  }

  return html;
}

let lastOutroSlides = [];

export function handleAccusation(suspectId) {
  const state = getState();
  const result = calculateFinalResult(state);
  const accusedName = getSuspectName(suspectId);
  const realName = getSuspectName(result.murderer);
  const story = getStory();
  
  const avatar = story.suspects && story.suspects[suspectId] ? story.suspects[suspectId].image : 'assets/avatar.jpg';
  const realAvatar = story.suspects && story.suspects[result.murderer] ? story.suspects[result.murderer].image : 'assets/avatar.jpg';
  const ending = story.endings && story.endings[suspectId] ? story.endings[suspectId] : { confession: 'Ich war es!' };
  
  const perc = result.percentages[result.murderer];
  const isFullWin = (suspectId === result.murderer && perc >= 75);
  let outroSlides = [];

  if (suspectId === result.murderer) {
    if (perc >= 75) {
      // 1. VOLLER ERFOLG (>= 75%): HINTER GITTERN! -> Finalkords UND Bonus
      outroSlides = [
        {
          image: avatar,
          badge: 'KAPITEL 1 • DIE ÜBERFÜHRUNG',
          title: 'Die Falle schnappt zu!',
          text: `Mit wasserdichten Beweisen (Beweislast: ${perc}%) konfrontierst du ${accusedName}. Unter der erdrückenden Last der Indizien bricht ${accusedName} schließlich zusammen.`,
          audio: 'assets/audio/story/outro_win_ueberfuehrung.mp3'
        },
        {
          image: avatar,
          badge: 'KAPITEL 2 • DAS GESTÄNDNIS',
          title: 'Die Wahrheit kommt ans Licht',
          text: `"${ending.confession}"`,
          audio: `assets/audio/story/outro_confession_${suspectId}.mp3`
        },
        {
          image: 'assets/geheimbund.jpg',
          badge: 'KAPITEL 3 • HINTER GITTERN',
          title: 'Der Pakt ist zerschlagen!',
          text: 'Fall gelöst! Hinter Gittern! Der Pakt der Schlappen-Erben ist endgültig zerschlagen! Der Drahtzieher wird dem Haftrichter vorgeführt und zu einer langen Freiheitsstrafe verurteilt. Die historischen Urkunden sind sichergestellt.',
          audio: 'assets/audio/story/outro_win_abschluss.mp3'
        },
        {
          image: 'assets/seal_schlappen.jpg',
          badge: 'KAPITEL 4 • DIE FINAL-DOSE &amp; BONUS',
          title: 'Das Vermächtnis von GCBYXW0',
          text: 'Die Handschellen haben geklickt, Hof ist gerettet! Aus den beschlagnahmten Geheimakten des Inhaftierten entzifferst du nun die finalen Koordinaten des Haupt-Finals UND des geheimen Meister-Bonus!',
          audio: null,
          buttonText: '🏆 Fall abschließen &amp; Koordinaten enthüllen ›'
        }
      ];
    } else {
      // 2. TÄTER IDENTIFIZIERT, ABER < 75%: FREISPRUCH & SPUREN VERWISCHT -> Nur Finalkords
      outroSlides = [
        {
          image: avatar,
          badge: 'KAPITEL 1 • DIE KONFRONTATION',
          title: 'Zu wenig Beweise!',
          text: `Du konfrontierst ${accusedName}. Zwar bricht ${accusedName} unter dem Druck zusammen und gesteht die Tat... doch deine Indizienkette weist noch Lücken auf!`,
          audio: 'assets/audio/story/outro_insufficient_ueberfuehrung.mp3'
        },
        {
          image: avatar,
          badge: 'KAPITEL 2 • DAS BITTERE GESTÄNDNIS',
          title: 'Die bittere Wahrheit',
          text: `"${ending.confession}"`,
          audio: `assets/audio/story/outro_confession_${suspectId}.mp3`
        },
        {
          image: 'assets/kommissar_stahl.jpg',
          badge: 'KAPITEL 3 • FREISPRUCH AUF KAUTION',
          title: 'Mangel an Beweisen!',
          text: `Doch der Triumph ist von kurzer Dauer. Die Beweislast liegt nur bei ${perc}% (Benötigt: 75%). Ein teurer Staranwalt erwirkt einen Freispruch auf Kaution. ${accusedName} entkommt der Justiz!`,
          audio: 'assets/audio/story/outro_insufficient_abschluss.mp3'
        },
        {
          image: 'assets/hero_hof_night.jpg',
          badge: 'KAPITEL 4 • SPUREN VERWISCHT',
          title: 'Im Morgengrauen entkommen',
          text: `Eine verpasste Chance! Im Schutz der Nacht nutzt der Drahtzieher die Gunst der Stunde, vernichtet die letzten belastenden Brandurkunden von 1823 und verwischt alle Spuren zum Bonus-Versteck. Doch die Koordinaten der Haupt-Final-Dose gehören dir!`,
          audio: 'assets/audio/story/outro_fail_chance.mp3',
          buttonText: '🏁 Zur Urteilsbegründung &amp; Final-Dose ›'
        }
      ];
    }
  } else {
    // 3. FALSCHER VERDÄCHTIGER (NIEDERLAGE) -> Nur Finalkords
    outroSlides = [
      {
        image: avatar,
        badge: 'KAPITEL 1 • EIN FATALER IRRTUM',
        title: 'Du hast den Falschen!',
        text: `Du konfrontierst ${accusedName} mit deinen Beweisen. Doch ${accusedName} lacht dich nur aus und weist jede Schuld souverän von sich. Deine Theorie bricht in sich zusammen.`,
        audio: 'assets/audio/story/outro_fail_irrtum.mp3'
      },
      {
        image: realAvatar,
        badge: 'KAPITEL 2 • DER WAHRE TÄTER',
        title: 'Spuren im Schatten verwischt',
        text: `Während du Zeit mit dem Falschen vergeudet hast, hat ${realName} die Gelegenheit genutzt, alle Spuren zu verwischen! Die Beweise hätten eindeutig gegen ${realName} gesprochen (${perc}%).`,
        audio: 'assets/audio/story/outro_fail_chance.mp3'
      },
      {
        image: 'assets/kommissar_stahl.jpg',
        badge: 'KAPITEL 3 • FALL GESCHLOSSEN',
        title: 'Der Pakt triumphiert',
        text: 'Die Akte wird geschlossen. Die Urkunden sind verschwunden und der Pakt der Schlappen-Erben agiert weiter aus den Schatten. Du hast versagt!',
        audio: 'assets/audio/story/outro_fail_abschluss.mp3'
      },
      {
        image: 'assets/seal_schlappen.jpg',
        badge: 'KAPITEL 4 • DER CACHE BLEIBT',
        title: 'Die Koordinaten der Final-Dose',
        text: 'Auch wenn der wahre Drahtzieher unerkannt entkommen ist: Die unterwegs gesammelten Hinweise führen dich dennoch zum physischen Versteck der Hauptdose.',
        audio: null,
        buttonText: '🏁 Final-Koordinaten anzeigen ›'
      }
    ];
  }

  accusedSuspect = suspectId;
  lastOutroSlides = outroSlides;

  // Start Outro slides
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
        title.textContent = 'Glückwunsch! Fall meisterhaft gelöst (Täter hinter Gittern).';
        title.style.color = 'var(--color-green, #2e8b57)';
        text.innerHTML = 'Hervorragende Ermittlung! Hier sind deine Belohnungen:';
      } else {
        title.textContent = 'Fall gelöst (aber Täter auf freiem Fuß / Kaution)';
        title.style.color = 'var(--color-amber-glow)';
        text.innerHTML = 'Der Fall ist geklärt, doch der Drahtzieher konnte entkommen. Hier sind die Koordinaten der Hauptdose:';
      }
    } else {
      title.textContent = 'Fall ungelöst (Falscher Verdächtiger)!';
      title.style.color = 'var(--color-blood-red)';
      text.innerHTML = 'Der wahre Drahtzieher bleibt im Schatten. Dennoch hast du die Hauptdose lokalisiert:';
    }

    coords.innerHTML = formatFinalCoords(isFullWin);

    // Replay Outro Button
    let replayBtn = document.getElementById('btn-replay-outro');
    if (!replayBtn) {
      replayBtn = document.createElement('button');
      replayBtn.id = 'btn-replay-outro';
      replayBtn.className = 'btn-secondary';
      replayBtn.style.cssText = 'margin-top: 15px; width: 100%; font-size: 0.95rem; padding: 10px;';
      replayBtn.innerHTML = '🎬 Outro / Epilog noch einmal ansehen';
      resContainer.appendChild(replayBtn);
    }
    replayBtn.onclick = () => {
      openIntro(() => showView('view-final'), lastOutroSlides);
    };

    // Button um anderen Verdächtigen zu testen (hilfreich für Betatest!)
    let retryBtn = document.getElementById('btn-retry-accusation');
    if (!retryBtn) {
      retryBtn = document.createElement('button');
      retryBtn.id = 'btn-retry-accusation';
      retryBtn.className = 'btn-text';
      retryBtn.style.cssText = 'margin-top: 10px; width: 100%; color: var(--color-text-muted); cursor: pointer; text-decoration: underline; background: none; border: none; font-size: 0.85rem;';
      retryBtn.innerHTML = '↺ Anderen Verdächtigen testen / Vorwurf ändern';
      resContainer.appendChild(retryBtn);
    }
    retryBtn.onclick = () => {
      accusedSuspect = null;
      if (container) container.style.display = 'flex';
      resContainer.classList.add('hidden');
    };

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
