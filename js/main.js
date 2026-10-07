import { initLanding } from './ui/landing.js';
import { initLockscreen, checkLockscreenStatus } from './ui/lockscreen.js';
import { initIntro } from './ui/intro.js';
import { initMap } from './ui/map.js';
import { initNavigator } from './ui/navigator.js';
import { initStationView } from './ui/station.js';
import { initStreetEvents } from './ui/street-events.js';
import { initAudio } from './audio.js';
import { initDossier } from './ui/dossier.js';
import { initFinalView } from './ui/final.js';
import { initEasterEggs } from './easter-eggs.js';
import { loadAllData } from './config-loader.js';
import { getState } from './state.js';
import { initDebug } from './debug.js';

let dataReady = false;

export function showView(viewId) {
  document.querySelectorAll('.view').forEach(view => {
    if (view.id === viewId) {
      view.classList.remove('hidden');
    } else {
      view.classList.add('hidden');
    }
  });
  window.scrollTo(0, 0);
}

export function showNoirAlert(message, title = 'HINWEIS') {
  const modal = document.getElementById('noir-alert-modal');
  const titleEl = document.getElementById('noir-alert-title');
  const msgEl = document.getElementById('noir-alert-message');
  const btnClose = document.getElementById('noir-alert-close');

  if (modal && titleEl && msgEl && btnClose) {
    titleEl.textContent = title;
    msgEl.textContent = message;
    modal.classList.remove('hidden');

    const closeModal = () => {
      modal.classList.add('hidden');
      btnClose.removeEventListener('click', closeModal);
    };
    btnClose.addEventListener('click', closeModal);
  } else {
    // Fallback falls modal nicht im DOM
    alert(`${title}\n\n${message}`);
  }
}


export function checkRouting() {
  const state = getState();
  if (state.gameStarted) {
    if (!checkLockscreenStatus()) {
      showView('view-lockscreen');
      return;
    }
    if (!dataReady) {
      showBootError('Die Spieldaten konnten nicht geladen werden – die Karte kann noch nicht geöffnet werden.');
      showView('view-landing');
      return;
    }
    showView('view-dashboard');
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  } else {
    showView('view-landing');
  }
}

/**
 * Zeigt einen gut sichtbaren Fehlerhinweis auf der Startseite an
 * (statt nur stumm in der Konsole zu scheitern).
 */
function showBootError(message) {
  let box = document.getElementById('boot-error');
  if (!box) {
    box = document.createElement('div');
    box.id = 'boot-error';
    box.className = 'boot-error';
    document.body.appendChild(box);
  }

  const isFileProtocol = window.location.protocol === 'file:';
  const hint = isFileProtocol
    ? `Du hast die <code>index.html</code> per Doppelklick geöffnet (<code>file://</code>). Browser blockieren dabei das Laden der Spieldaten.<br>
       <strong>Lösung:</strong> <code>tools\\serve.ps1</code> starten und <code>http://localhost:8080</code> öffnen – oder die Seite über GitHub Pages (https) aufrufen.`
    : `Bitte Seite neu laden. Bleibt der Fehler bestehen, die Browser-Konsole (F12) prüfen.`;

  box.innerHTML = `
    <strong>⚠️ Akte konnte nicht geöffnet werden</strong>
    <p>${message}</p>
    <p class="boot-error-hint">${hint}</p>
    <button type="button" class="btn-secondary" id="btn-boot-error-close">Verstanden</button>
  `;
  box.querySelector('#btn-boot-error-close').addEventListener('click', () => box.remove());
}

/**
 * Führt ein Init-Modul isoliert aus, damit ein einzelner Fehler
 * nicht die gesamte App lahmlegt.
 */
function safeInit(name, fn) {
  try {
    fn();
  } catch (err) {
    console.error(`[Boot] Fehler in ${name}:`, err);
  }
}

// Global Event Listener für Routing-Trigger (z.B. aus landing.js)
window.addEventListener('requestRouting', () => {
  checkRouting();
});

async function boot() {
  window.__krimiBooted = true;
  console.log('[Boot] Der Pakt der Schlappen-Erben startet...');

  // Kern-Module & Startseite (funktionieren auch ohne Spieldaten)
  safeInit('Audio', initAudio);
  safeInit('EasterEggs', initEasterEggs);
  safeInit('Landing', initLanding);
  safeInit('Intro', initIntro);
  safeInit('Lockscreen', initLockscreen);

  // Spieldaten laden
  try {
    const data = await loadAllData();
    dataReady = true;
    console.log(`[Boot] Spieldaten geladen: ${data.stations.length} Stationen, ${data.events.length} Events.`);
  } catch (error) {
    console.error('[Boot] Fehler beim Laden der Spieldaten:', error);
    showBootError(`Technischer Grund: ${error.message}`);
  }

  if (dataReady) {
    safeInit('Map', initMap);
    safeInit('Navigator', initNavigator);
    safeInit('StationView', initStationView);
    safeInit('StreetEvents', initStreetEvents);
    safeInit('Dossier', initDossier);
    safeInit('FinalView', initFinalView);
    safeInit('Debug', initDebug);
  }

  // Service Worker (AP15) – nur über http(s) möglich, Fehler sind nicht kritisch
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log('[PWA] Service Worker registriert.'))
      .catch(err => console.warn('[PWA] Service Worker nicht verfügbar:', err));
  }

  // Wiederkehrende Spieler direkt weiterleiten
  checkRouting();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
