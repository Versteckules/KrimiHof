/**
 * landing.js - Eingangsseite mit Hero-Cover, Dienstausweis, Team-Sync & Reset (AP1 + AP3)
 */

import { getState, setPlayerName, startGame, resetState, subscribe } from '../state.js';
import { renderSyncQRCode, generateSyncUrl, applySyncHash, importStateHash, checkUrlSyncParameter } from '../sync.js';

export function initLanding() {
  const startBtn = document.getElementById('btn-start-game');
  const nameInput = document.getElementById('player-name-input');
  const errorMsg = document.getElementById('name-error');
  const progressIndicator = document.getElementById('game-progress-indicator');
  const openResetBtn = document.getElementById('btn-open-reset');
  const openSyncBtn = document.getElementById('btn-open-sync');

  // Modals & Controls
  const modalSync = document.getElementById('modal-sync');
  const modalSyncClose = document.getElementById('modal-sync-close');
  const syncQrCanvas = document.getElementById('sync-qr-canvas');
  const copySyncLinkBtn = document.getElementById('btn-copy-sync-link');
  const syncImportInput = document.getElementById('sync-import-input');
  const btnImportSync = document.getElementById('btn-import-sync');
  const syncImportError = document.getElementById('sync-import-error');

  const modalReset = document.getElementById('modal-reset');
  const modalResetClose = document.getElementById('modal-reset-close');
  const btnCancelReset = document.getElementById('btn-cancel-reset');
  const btnConfirmReset = document.getElementById('btn-confirm-reset');

  const modalSyncPrompt = document.getElementById('modal-sync-prompt');
  const syncPromptText = document.getElementById('sync-prompt-text');
  const btnAcceptSync = document.getElementById('btn-accept-sync');
  const btnRejectSync = document.getElementById('btn-reject-sync');

  const heroContainer = document.querySelector('.hero-container');
  const flashlightOverlay = document.getElementById('flashlight-overlay');

  // 1. Accordion Logik für Anleitung
  const instructionHeaders = document.querySelectorAll('.instruction-header');
  instructionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const card = header.parentElement;
      card.classList.toggle('active');
    });
  });

  // 2. UI Aktualisierungs-Funktion basierend auf aktuellem State
  const updateUIFromState = (state) => {
    // Name übernehmen
    if (state.playerName && nameInput.value !== state.playerName) {
      nameInput.value = state.playerName;
    }

    const solvedCount = (state.solvedStations || []).length;
    const hasProgress = state.gameStarted || solvedCount > 0;

    if (hasProgress) {
      startBtn.innerHTML = solvedCount > 0 ? `Ermittlung fortsetzen (${solvedCount}/12)` : "Ermittlung fortsetzen";
      progressIndicator.textContent = `Akte aktiv: ${solvedCount}/12 Pflichtstationen gelöst • ${state.score || 0} Punkte`;
      progressIndicator.classList.remove('hidden');
      openResetBtn.classList.remove('hidden');
    } else {
      startBtn.innerHTML = "Akte Öffnen";
      progressIndicator.classList.add('hidden');
      openResetBtn.classList.add('hidden');
    }
  };

  // Initialer State
  const initialState = getState();
  updateUIFromState(initialState);

  // Reaktive Updates abonnieren
  subscribe(updateUIFromState);

  // Namenseingabe synchronisieren
  nameInput.addEventListener('input', () => {
    const val = nameInput.value.trim();
    if (val.length >= 2) {
      errorMsg.classList.add('hidden');
    }
    setPlayerName(val);
  });

  // Start / Fortsetzen Button
  startBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (name.length < 2) {
      errorMsg.classList.remove('hidden');
      nameInput.focus();
      return;
    }

    errorMsg.classList.add('hidden');
    setPlayerName(name);
    startGame();

    startBtn.innerHTML = "Öffne Fallakte...";
    startBtn.style.pointerEvents = "none";
    setTimeout(() => {
      alert(`Ermittlungsakte für ${name} geöffnet!\n\n(AP4 bringt als nächsten Schritt die Nacht-Zeitsperre und den Countdown-Screen).`);
      startBtn.style.pointerEvents = "auto";
      updateUIFromState(getState());
    }, 400);
  });

  // 3. Team-Sync Modal Logik
  if (openSyncBtn) {
    openSyncBtn.addEventListener('click', () => {
      // Rendere aktuellen QR-Code
      renderSyncQRCode(syncQrCanvas, { size: 220 });
      modalSync.classList.remove('hidden');
      syncImportError.classList.add('hidden');
      syncImportInput.value = '';
    });
  }

  if (modalSyncClose) {
    modalSyncClose.addEventListener('click', () => {
      modalSync.classList.add('hidden');
    });
  }

  // Sync-Link kopieren
  if (copySyncLinkBtn) {
    copySyncLinkBtn.addEventListener('click', async () => {
      const url = generateSyncUrl();
      try {
        await navigator.clipboard.writeText(url);
        const originalText = copySyncLinkBtn.innerHTML;
        copySyncLinkBtn.innerHTML = "✅ Link kopiert!";
        setTimeout(() => {
          copySyncLinkBtn.innerHTML = originalText;
        }, 2000);
      } catch (e) {
        prompt("Kopiere diesen Team-Link:", url);
      }
    });
  }

  // Manueller Import
  if (btnImportSync) {
    btnImportSync.addEventListener('click', () => {
      const val = syncImportInput.value.trim();
      if (!val) return;

      try {
        let hashToImport = val;
        // Falls eine volle URL eingegeben wurde, extrahiere ?sync=
        if (val.includes('sync=')) {
          const match = val.match(/sync=([^&#]+)/);
          if (match) hashToImport = match[1];
        }

        const newState = applySyncHash(hashToImport);
        modalSync.classList.add('hidden');
        alert(`Team-Spielstand erfolgreich importiert!\nErmittler: ${newState.playerName || 'Unbekannt'}\nGelöste Stationen: ${newState.solvedStations.length}`);
      } catch (err) {
        syncImportError.textContent = `[FEHLER] ${err.message}`;
        syncImportError.classList.remove('hidden');
      }
    });
  }

  // 4. Reset Modal Logik (Sicherheitsbestätigung)
  if (openResetBtn) {
    openResetBtn.addEventListener('click', () => {
      modalReset.classList.remove('hidden');
    });
  }

  const closeResetModal = () => {
    modalReset.classList.add('hidden');
  };

  if (modalResetClose) modalResetClose.addEventListener('click', closeResetModal);
  if (btnCancelReset) btnCancelReset.addEventListener('click', closeResetModal);

  if (btnConfirmReset) {
    btnConfirmReset.addEventListener('click', () => {
      resetState();
      nameInput.value = '';
      closeResetModal();
      alert("Die Ermittlungsakte wurde vollständig und sicher geschreddert.");
    });
  }

  // 5. Automatische Erkennung von ?sync= beim Seitenaufruf
  const urlSyncHash = checkUrlSyncParameter();
  if (urlSyncHash) {
    try {
      const previewState = importStateHash(urlSyncHash);
      syncPromptText.innerHTML = `Ermittler <strong>${previewState.playerName || 'Team-Kollege'}</strong> teilt eine Akte mit <strong>${previewState.solvedStations.length} gelösten Stationen</strong> und <strong>${previewState.score || 0} Punkten</strong> mit dir.`;
      modalSyncPrompt.classList.remove('hidden');

      btnAcceptSync.onclick = () => {
        applySyncHash(urlSyncHash);
        modalSyncPrompt.classList.add('hidden');
        // Entferne Query-Param aus URL ohne Reload
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
        alert(`Willkommen im Team! Du ermittelst nun synchron mit ${previewState.playerName || 'deinem Partner'}.`);
      };

      btnRejectSync.onclick = () => {
        modalSyncPrompt.classList.add('hidden');
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      };
    } catch (e) {
      console.warn("Ungültiger Sync-Parameter in URL:", e);
    }
  }

  // 6. Taschenlampen-Effekt
  const updateFlashlight = (x, y) => {
    flashlightOverlay.style.background = `radial-gradient(
      circle 180px at ${x}px ${y}px,
      transparent 0%,
      rgba(10, 14, 23, 0.7) 60%,
      rgba(10, 14, 23, 0.98) 100%
    )`;
  };

  heroContainer.addEventListener('mouseenter', () => {
    document.body.classList.add('flashlight-active');
  });
  
  heroContainer.addEventListener('mouseleave', () => {
    document.body.classList.remove('flashlight-active');
  });

  heroContainer.addEventListener('mousemove', (e) => {
    updateFlashlight(e.clientX, e.clientY);
  });
  
  heroContainer.addEventListener('touchmove', (e) => {
    document.body.classList.add('flashlight-active');
    const touch = e.touches[0];
    updateFlashlight(touch.clientX, touch.clientY);
  }, { passive: true });
}
