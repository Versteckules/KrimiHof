/**
 * landing.js - Eingangsseite mit Hero-Cover, Dienstausweis, Team-Sync & Reset (AP1 + AP3)
 */

import { getState, saveState, setPlayerName, startGame, resetState, subscribe } from '../state.js';

export function initLanding() {
  const startBtn = document.getElementById('btn-start-game');
  const nameInput = document.getElementById('player-name-input');
  const errorMsg = document.getElementById('name-error');
  const progressIndicator = document.getElementById('game-progress-indicator');
  const openResetBtn = document.getElementById('btn-open-reset');
  // Removed Sync Modals

  const modalReset = document.getElementById('modal-reset');
  const modalResetClose = document.getElementById('modal-reset-close');
  const btnCancelReset = document.getElementById('btn-cancel-reset');
  const btnConfirmReset = document.getElementById('btn-confirm-reset');



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

    if (state.gameStarted) {
      nameInput.disabled = true;
      nameInput.style.opacity = '0.7';
    } else {
      nameInput.disabled = false;
      nameInput.style.opacity = '1';
    }

    const solvedCount = (state.solvedStations || []).length;
    const hasProgress = state.gameStarted || solvedCount > 0;

    if (hasProgress) {
      startBtn.innerHTML = solvedCount > 0 ? `Ermittlung fortsetzen (${solvedCount}/12)` : "Ermittlung fortsetzen";
      progressIndicator.textContent = `Akte aktiv: ${solvedCount}/12 Pflichtstationen gelöst • ${state.score || 0} Punkte`;
      if (state.isTestingMode) progressIndicator.textContent += " [TEST-MODUS]";
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
    if (name === "OFFLINETEST") {
      errorMsg.classList.add('hidden');
      saveState({ isTestingMode: true, playerName: "TEST-AGENT" });
      startGame();
    } else if (name.length < 2) {
      errorMsg.classList.remove('hidden');
      nameInput.focus();
      return;
    } else {
      errorMsg.classList.add('hidden');
      setPlayerName(name);
      startGame();
    }

    startBtn.innerHTML = "Öffne Fallakte...";
    startBtn.style.pointerEvents = "none";
    setTimeout(() => {
      startBtn.style.pointerEvents = "auto";
      window.dispatchEvent(new Event('requestRouting'));
      updateUIFromState(getState());
    }, 400);
  });

  // Removed Team-Sync Modal Logik

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

  // Removed Automatische Erkennung von ?sync= beim Seitenaufruf

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
