/**
 * final.js - Das Finale (AP11)
 */

import { getState } from '../state.js';
import { showView } from '../main.js';
import { calculateFinalResult } from '../scoring.js';
import { getConfig, getFinalCoords, getStory } from '../config-loader.js';

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

  const suspects = getConfig().gameplay.suspects;

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

  const resContainer = document.getElementById('final-result');
  const title = document.getElementById('final-result-title');
  const text = document.getElementById('final-result-text');
  const coords = document.getElementById('final-coords');

  resContainer.classList.remove('hidden');

  const accusedName = getSuspectName(suspectId);
  const realName = getSuspectName(result.murderer);

  if (suspectId === result.murderer) {
    title.textContent = 'Korrekt!';
    title.style.color = 'var(--color-green, #2e8b57)';
    text.innerHTML = `Deine Beweisaufnahme war stichhaltig. Die Indizien verweisen mit <strong>${result.percentages[result.murderer]}%</strong> auf ${accusedName}!<br>Die Akte ist geschlossen.`;
  } else {
    title.textContent = 'Ein fataler Irrtum!';
    title.style.color = 'var(--color-blood-red)';
    text.innerHTML = `Du hast den Falschen beschuldigt. Die Beweise (${result.percentages[result.murderer]}%) sprachen eigentlich gegen <strong>${realName}</strong>!<br>Das Spiel ist dennoch vorbei. Die Koordinaten erhältst du trotzdem:`;
  }

  coords.innerHTML = formatFinalCoords();
  accusedSuspect = suspectId;
}

function generateDiploma() {
  const state = getState();
  const name = state.playerName || 'Ermittler';
  const result = calculateFinalResult(state);
  const murdererName = getSuspectName(result.murderer);
  const fc = getFinalCoords() || {};
  const diploma = fc.diploma || {};
  const date = new Date().toLocaleDateString('de-DE');
  const avatarUrl = new URL('assets/avatar.jpg', window.location.href).href;

  const win = window.open('', '_blank');
  if (!win) {
    alert('Bitte Pop-ups erlauben, um das Diplom anzuzeigen.');
    return;
  }

  win.document.write(`
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Diplom - Der Pakt der Schlappen-Erben</title>
        <style>
          body { font-family: 'Playfair Display', Georgia, serif; text-align: center; background: #fdfbf7; color: #111; padding: 40px; }
          .border { border: 10px double #111; padding: 40px; position: relative; }
          h1 { font-size: 2.6rem; margin-bottom: 10px; }
          h2 { font-size: 1.4rem; color: #555; font-weight: normal; }
          p { font-size: 1.3rem; margin: 18px 0; }
          .name { font-size: 2.3rem; font-weight: bold; border-bottom: 2px solid #111; display: inline-block; padding: 0 50px; margin: 16px 0; font-family: 'Courier New', monospace; }
          .signature { display: flex; align-items: flex-end; justify-content: space-between; margin-top: 40px; }
          .signature img { width: 110px; mix-blend-mode: multiply; filter: sepia(0.4) contrast(1.1); }
          .signature small { font-size: 0.95rem; color: #444; display: block; }
        </style>
      </head>
      <body>
        <div class="border">
          <h1>${diploma.title || 'OFFIZIELLES DIPLOM'}</h1>
          <h2>${diploma.subtitle || 'Stadt Hof - Historische Ermittlungen'}</h2>
          <p>Hiermit wird bestätigt, dass</p>
          <div class="name">${name}</div>
          <p>den historischen Fall „Der Pakt der Schlappen-Erben" erfolgreich gelöst hat.</p>
          <p>Der Täter <strong>${murdererName}</strong> wurde durch sorgfältige Sammlung von Beweisen überführt.</p>
          <div class="signature">
            <div style="text-align:left;">
              <small>Hof an der Saale, den ${date}</small>
              <small>${diploma.signature || ''}</small>
            </div>
            <div>
              <img src="${avatarUrl}" alt="Versteckules">
              <small>Geocache Owner · Versteckules</small>
            </div>
          </div>
        </div>
        <script>window.onload = () => window.print();<\/script>
      </body>
    </html>
  `);
  win.document.close();
}
