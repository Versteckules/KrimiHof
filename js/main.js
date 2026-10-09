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
import { attachGlobalHaptics } from './fx.js';

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
  
  // Fix Leaflet map sizing issue on mobile when container becomes visible
  if (viewId === 'view-dashboard') {
    import('./ui/dossier.js').then(m => {
      if (m.updateDossier) m.updateDossier();
    }).catch(() => {});

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      
      // Fix iOS Safari Repaint Bug for navigator-bar flex children
      const navBar = document.getElementById('navigator-bar');
      if (navBar) {
        const currentDisplay = navBar.style.display;
        navBar.style.display = 'none';
        navBar.offsetHeight; // force reflow
        navBar.style.display = currentDisplay || 'flex';
      }
    }, 100);
  }
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

window.showNoirConfirm = function(arg1, arg2, arg3, arg4) {
  const modal = document.getElementById('noir-confirm-modal');
  let title = 'Bestätigung';
  let message = '';
  let onConfirm = null;
  let confirmText = 'Ja, abbrechen';

  if (typeof arg2 === 'function') {
    // Aufruf: showNoirConfirm(message, onConfirm, confirmText)
    message = arg1 || '';
    onConfirm = arg2;
    if (typeof arg3 === 'string' && arg3.trim()) {
      confirmText = arg3;
    }
  } else {
    // Aufruf: showNoirConfirm(title, message, onConfirm, confirmText)
    title = arg1 || 'Bestätigung';
    message = arg2 || '';
    onConfirm = arg3;
    if (typeof arg4 === 'string' && arg4.trim()) {
      confirmText = arg4;
    } else {
      confirmText = 'Überspringen';
    }
  }

  if (!modal) {
    if (confirm((title ? title + "\n\n" : "") + message)) {
      if (typeof onConfirm === 'function') onConfirm();
    }
    return;
  }

  const titleEl = document.getElementById('noir-confirm-title');
  const msgEl = document.getElementById('noir-confirm-message');
  const btnYes = document.getElementById('noir-confirm-yes');
  const btnNo = document.getElementById('noir-confirm-no');

  if (titleEl) titleEl.textContent = title;
  if (msgEl) msgEl.textContent = message;
  if (btnYes) btnYes.textContent = confirmText;

  modal.classList.remove('hidden');

  const cleanup = () => {
    modal.classList.add('hidden');
    if (btnYes) btnYes.onclick = null;
    if (btnNo) btnNo.onclick = null;
  };

  if (btnYes) {
    btnYes.onclick = () => {
      cleanup();
      if (typeof onConfirm === 'function') {
        onConfirm();
      }
    };
  }

  if (btnNo) {
    btnNo.onclick = () => {
      cleanup();
    };
  }
};

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
  safeInit('FX', attachGlobalHaptics);
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
