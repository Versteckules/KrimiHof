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

  const resContainer = document.getElementById('final-result');
  const title = document.getElementById('final-result-title');
  const text = document.getElementById('final-result-text');
  const coords = document.getElementById('final-coords');

  resContainer.classList.remove('hidden');

  const accusedName = getSuspectName(suspectId);
  const realName = getSuspectName(result.murderer);
  const story = getStory();
  let confession = "";
  if (story && story.endings && story.endings[suspectId]) {
     confession = `<br><br><i>${story.endings[suspectId].confession}</i>`;
  }

  if (suspectId === result.murderer) {
    title.textContent = 'Korrekt!';
    title.style.color = 'var(--color-green, #2e8b57)';
    text.innerHTML = `Deine Beweisaufnahme war stichhaltig. Die Indizien verweisen mit <strong>${result.percentages[result.murderer]}%</strong> auf ${accusedName}!${confession}<br><br>Die Akte ist geschlossen.`;
  } else {
    title.textContent = 'Ein fataler Irrtum!';
    title.style.color = 'var(--color-blood-red)';
    text.innerHTML = `Du hast den Falschen beschuldigt. Die Beweise (${result.percentages[result.murderer]}%) sprachen eigentlich gegen <strong>${realName}</strong>!${confession}<br><br>Das Spiel ist dennoch vorbei. Die Koordinaten erhältst du trotzdem:`;
  }

  coords.innerHTML = formatFinalCoords();
  accusedSuspect = suspectId;
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
