/**
 * final.js - Das Finale (AP11)
 */

import { getState, getPlayerRank } from '../state.js';
import { showView } from '../main.js';
import { calculateFinalResult } from '../scoring.js';
import { getConfig, getFinalCoords, getStory } from '../config-loader.js';
import { openIntro } from './intro.js';
import { decryptObject, getStandardPassphrase, getBonusPassphrase } from '../crypto.js';

let accusedSuspect = null;
export const FULL_WIN_THRESHOLD = 55; // Mindest-Beweislast in % (> 55% erforderlich) fuer Täter-Inhaftierung & Meister-Bonus Cache

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
    btn.className = 'btn-secondary final-accuse-btn';
    btn.id = `btn-accuse-${s.id}`;
    btn.style.flex = '1 1 200px';
    btn.textContent = getSuspectName(s.id);
    btn.onclick = () => handleAccusation(s.id);
    container.appendChild(btn);
  });

  const finalResetBtn = document.getElementById('btn-final-reset');
  if (finalResetBtn) {
    finalResetBtn.addEventListener('click', () => {
      const modal = document.getElementById('modal-reset');
      if (modal) {
        modal.classList.remove('hidden');
      } else if (confirm("Möchtest du die Fallakte wirklich schreddern und das Spiel von vorne beginnen?")) {
        import('../state.js').then(m => {
          m.resetState();
          window.location.reload();
        });
      }
    });
  }
}

export function openFinal() {
  showView('view-final');
}

/**
 * Löst die Final- und Bonusdaten auf (unterstützt sowohl AES-GCM als auch Klartext)
 */
async function resolveFinalCoords(isFullWin = false, murdererId = 'herold') {
  const fc = getFinalCoords();
  if (!fc) return null;

  // Fall A: Unverschlüsselte Klartextdaten
  if (!fc.encrypted) {
    return {
      standard: fc.standardFinal || {
        title: 'Haupt-Final (GCBYXW0)',
        coordsDMM: fc.coordsDMM || 'N 50° 19.345 E 011° 55.412',
        hint: fc.hint || 'Im Schutz der alten Kopfweide...'
      },
      bonus: fc.bonusFinal || {
        title: 'Bonus-Cache: Das Vermächtnis des Meisters',
        coordsDMM: 'N 50° 19.510 E 011° 55.680',
        hint: 'Im alten Mauerwerk des Torbogens, hinter dem losen Sandsteinquader auf der Nordseite.'
      }
    };
  }

  // Fall B: Verschlüsselt mit AES-GCM
  let standard = null;
  let bonus = null;

  try {
    standard = await decryptObject(fc.standardFinal, getStandardPassphrase());
  } catch (err) {
    console.error('[Crypto] Entschlüsselung Standard-Final fehlgeschlagen:', err);
    standard = {
      title: 'Haupt-Final (GCBYXW0)',
      coordsDMM: 'Entschlüsselung fehlgeschlagen',
      hint: ''
    };
  }

  if (isFullWin) {
    try {
      bonus = await decryptObject(fc.bonusFinal, getBonusPassphrase(murdererId));
    } catch (err) {
      console.error('[Crypto] Entschlüsselung Bonus-Final fehlgeschlagen:', err);
      bonus = {
        title: 'Bonus-Cache',
        coordsDMM: 'Zugriff verweigert (Falscher Täter)',
        hint: ''
      };
    }
  }

  return { standard, bonus };
}

async function formatFinalCoords(isFullWin = false, murdererId = 'herold', suspectId = null, result = null) {
  const resolved = await resolveFinalCoords(isFullWin, murdererId);
  if (!resolved || !resolved.standard) return '<div style="color:red;">Koordinaten nicht verfügbar</div>';

  const standard = resolved.standard;
  const bonus = resolved.bonus;

  let html = `
    <!-- 1. Haupt-Final (Immer sichtbar für alle ehrlichen Finder) -->
    <div style="background: rgba(16, 185, 129, 0.12); border: 2px solid #10b981; border-radius: 8px; padding: 14px 12px; margin-bottom: 15px; text-align: left; box-shadow: 0 4px 15px rgba(0,0,0,0.5); box-sizing: border-box;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px; margin-bottom: 6px;">
        <span style="color: #6ee7b7; font-weight: bold; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px;">📍 ${standard.title || 'Haupt-Final (GCBYXW0)'}</span>
        <span style="background: rgba(16, 185, 129, 0.25); color: #a7f3d0; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">Freigeschaltet</span>
      </div>
      <div style="font-family: var(--font-mono); font-size: clamp(1.05rem, 4.2vw, 1.35rem); color: #ffffff; font-weight: bold; margin-bottom: 8px; letter-spacing: 0.5px; word-break: break-word;">
        ${standard.coordsDMM}
      </div>
      ${standard.hint ? `<div style="font-size: 0.85rem; color: #cbd5e1; font-style: italic; border-top: 1px dashed rgba(255,255,255,0.15); padding-top: 6px; word-break: break-word;">💡 Hinweis: ${standard.hint}</div>` : ''}
    </div>
  `;

  if (isFullWin && bonus) {
    // Fall 1: Täter ins Gefängnis (> 55% UND Rang Sherlock) -> Finalkords UND Bonus
    html += `
      <!-- 2. Meister-Bonus (Exklusiv bei erfolgreicher Überführung > 55% UND Rang Sherlock) -->
      <div style="background: linear-gradient(135deg, rgba(212, 163, 89, 0.2) 0%, rgba(139, 101, 8, 0.3) 100%); border: 2px solid #d4af37; border-radius: 8px; padding: 14px 12px; text-align: left; box-shadow: 0 0 20px rgba(212, 163, 89, 0.35); box-sizing: border-box;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px; margin-bottom: 6px;">
          <span style="color: #f5d79e; font-weight: bold; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px;">⭐ ${bonus.title || 'Bonus-Cache: Das Vermächtnis'}</span>
          <span style="background: #d4af37; color: #000; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">Täter Inhaftiert &amp; Sherlock-Rang!</span>
        </div>
        <div style="font-family: var(--font-mono); font-size: clamp(1.05rem, 4.2vw, 1.35rem); color: #ffd700; font-weight: bold; margin-bottom: 8px; letter-spacing: 0.5px; word-break: break-word;">
          ${bonus.coordsDMM}
        </div>
        ${bonus.hint ? `<div style="font-size: 0.85rem; color: #f5ecc8; font-style: italic; border-top: 1px dashed rgba(212, 163, 89, 0.3); padding-top: 6px; word-break: break-word;">💡 Bonus-Hinweis: ${bonus.hint}</div>` : ''}
      </div>
    `;
  } else {
    // Fall 2: Bonus nicht freigeschaltet -> Spezifische Begründung
    const rank = getPlayerRank();
    const perc = result && result.percentages && result.murderer ? result.percentages[result.murderer] : 0;
    const isCorrect = (suspectId && result && suspectId === result.murderer);
    
    let reasonText = '';
    if (!isCorrect) {
      reasonText = 'Du hast den falschen Tatverdächtigen beschuldigt. Der wahre Drahtzieher konnte entkommen und hat alle Spuren zum Bonus verwischt.';
    } else if (perc <= FULL_WIN_THRESHOLD) {
      reasonText = `Die Beweislast war mit ${perc}% zu gering (benötigt: über ${FULL_WIN_THRESHOLD}%). Ein Staranwalt erwirkte Freispruch auf Kaution.`;
    } else {
      reasonText = `Die Beweislast lag zwar bei ${perc}%, doch dein Ermittler-Rang ist „${rank.name}“. Um die Geheimakten des Meisters zu öffnen, ist der Meister-Rang „Sherlock Holmes“ erforderlich (mind. 700 Punkte &amp; 8 gelöste Stationen, erreichbar durch sorgfältiges Bearbeiten aller Beweise).`;
    }

    html += `
      <!-- Bonus Gesperrt -->
      <div style="background: rgba(30, 41, 59, 0.4); border: 1px dashed #64748b; border-radius: 8px; padding: 14px; text-align: left; opacity: 0.9;">
        <div style="display: flex; align-items: flex-start; gap: 10px; color: #94a3b8; font-size: 0.85rem; line-height: 1.5;">
          <span style="font-size: 1.3rem; line-height: 1;">🔒</span>
          <div>
            <strong style="color: #cbd5e1;">Bonus-Cache verpasst:</strong> ${reasonText}
            <div style="margin-top: 6px; font-size: 0.78rem; color: #64748b; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 4px;">Voraussetzung für den Bonus: Richtiger Täter + über 55% Beweislast + Rang „Sherlock Holmes“.</div>
          </div>
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
  const rank = getPlayerRank();
  const isSherlock = rank.level >= 5;
  
  const avatar = story.suspects && story.suspects[suspectId] ? story.suspects[suspectId].image : 'assets/avatar.jpg';
  const realAvatar = story.suspects && story.suspects[result.murderer] ? story.suspects[result.murderer].image : 'assets/avatar.jpg';
  const ending = story.endings && story.endings[suspectId] ? story.endings[suspectId] : { confession: 'Ich war es!' };
  
  const perc = result.percentages[result.murderer];
  const isCorrectSuspect = (suspectId === result.murderer);
  const isHighSuspicion = (perc > FULL_WIN_THRESHOLD);
  const isFullWin = (isCorrectSuspect && isHighSuspicion && isSherlock);
  let outroSlides = [];

  if (isCorrectSuspect) {
    if (isFullWin) {
      // 1. VOLLER ERFOLG (> 55% UND Sherlock Holmes): HINTER GITTERN! -> Finalkords UND Bonus
      outroSlides = [
        {
          image: avatar,
          badge: 'KAPITEL 1 • DIE ÜBERFÜHRUNG',
          title: 'Die Falle schnappt zu!',
          text: `Mit wasserdichten Beweisen (Beweislast: ${perc}%) und meisterhafter Kombinationsgabe als ${rank.name} konfrontierst du ${accusedName}. Unter der erdrückenden Last der Indizien bricht ${accusedName} schließlich zusammen.`,
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
          text: 'Die Handschellen haben geklickt, Hof ist gerettet! Als Meister-Detektiv entzifferst du aus den beschlagnahmten Geheimakten des Inhaftierten die finalen Koordinaten des Haupt-Finals UND des Meister-Bonus!',
          audio: null,
          buttonText: '🏆 Fall abschließen &amp; Koordinaten enthüllen ›'
        }
      ];
    } else {
      // 2. TÄTER IDENTIFIZIERT, ABER BEWEISKETTE VOR GERICHT NICHT WASSERDICHT (<= 55% ODER Rang < Sherlock) -> Nur Finalkords
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
          text: `Doch der Triumph ist von kurzer Dauer. Die Beweislast reicht für den Haftrichter nicht aus. Ein teurer Staranwalt erwirkt einen Freispruch auf Kaution. ${accusedName} entkommt der Justiz!`,
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
  openIntro(async () => {
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

    if (isFullWin) {
      title.textContent = 'Glückwunsch! Fall meisterhaft gelöst (Täter inhaftiert & Sherlock Holmes).';
      title.style.color = 'var(--color-green, #2e8b57)';
      text.innerHTML = 'Hervorragende Ermittlung! Beide Cache-Koordinaten und der Meister-Bonus sind freigeschaltet:';
    } else if (isCorrectSuspect) {
      if (isHighSuspicion && !isSherlock) {
        title.textContent = `Täter überführt (Beweise erdrückend, aber Rang „${rank.name}“)`;
        title.style.color = 'var(--color-amber-glow)';
        text.innerHTML = `Du hast den Drahtzieher entlarvt (${perc}%). Da dein Rang noch nicht „Sherlock Holmes“ ist (mind. 700 Punkte &amp; 8 Stationen), bleibt der Meister-Bonus verschlossen. Hier sind die Koordinaten der Hauptdose:`;
      } else {
        title.textContent = 'Fall gelöst (aber Täter auf freiem Fuß / Kaution)';
        title.style.color = 'var(--color-amber-glow)';
        text.innerHTML = `Der Fall ist geklärt, doch die Beweise reichten nicht für eine Inhaftierung (Beweislast: ${perc}%, benötigt: über ${FULL_WIN_THRESHOLD}%). Hier sind die Koordinaten der Hauptdose:`;
      }
    } else {
      title.textContent = 'Fall ungelöst (Falscher Verdächtiger)!';
      title.style.color = 'var(--color-blood-red)';
      text.innerHTML = 'Der wahre Drahtzieher bleibt im Schatten. Dennoch hast du die Hauptdose lokalisiert:';
    }

    coords.innerHTML = await formatFinalCoords(isFullWin, result.murderer, suspectId, result);

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
      openIntro(async () => {
        showView('view-final');
        coords.innerHTML = await formatFinalCoords(isFullWin, result.murderer, suspectId, result);
      }, lastOutroSlides);
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
