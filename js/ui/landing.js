/**
 * landing.js - Eingangsseite mit Hero-Cover, Dienstausweis, Bilderstory & Akte-Schreddern (AP1 + AP3)
 */

import { getState, saveState, setPlayerName, startGame, resetState, subscribe } from '../state.js';
import { openIntro } from './intro.js';

export function initLanding() {
  const startBtn = document.getElementById('btn-start-game');
  const nameInput = document.getElementById('player-name-input');
  const errorMsg = document.getElementById('name-error');
  const progressIndicator = document.getElementById('game-progress-indicator');
  const openResetBtn = document.getElementById('btn-open-reset');
  const openIntroBtn = document.getElementById('btn-open-intro-landing');

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
    } else {
      startBtn.innerHTML = "Akte Öffnen";
      progressIndicator.classList.add('hidden');
    }

    // "Akte Schreddern" ist IMMER zugänglich
    if (openResetBtn) {
      openResetBtn.classList.remove('hidden');
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
    
    // Easter Egg 1: Versteckules-Name
    if (val.toLowerCase() === 'versteckules') {
      const state = getState();
      if (!state.easterEggVersteckules) {
        saveState({ 
          easterEggVersteckules: true, 
          score: (state.score || 0) + 50 
        });
        import('../state.js').then(mod => mod.unlockTrackable('CA6D92'));
        updateUIFromState(getState());

        const easterEggOverlay = document.createElement('div');
        easterEggOverlay.style = "position:fixed; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.9); z-index: 10000; display:flex; align-items:center; justify-content:center; padding: 20px;";
        easterEggOverlay.innerHTML = `
          <div style="background: #1a1a1a; border: 2px solid #d4af37; padding: 30px; border-radius: 10px; text-align: center; max-width: 400px; box-shadow: 0 0 30px rgba(212, 175, 55, 0.4);">
            <h2 style="color: #d4af37; font-family: var(--font-serif); margin-bottom: 15px; font-size: 1.8rem;">EASTER EGG GEFUNDEN!</h2>
            <div class="avatar-frame" style="margin: 0 auto 15px auto; width: 100px; height: 100px;">
              <img src="assets/avatar.jpg" class="avatar-noir" alt="Versteckules">
            </div>
            <p style="color: white; margin-bottom: 15px; line-height: 1.5;">Meister-Ermittler Versteckules persönlich! Du hast den geheimen Code entdeckt.</p>
            <div style="background: rgba(0,0,0,0.5); padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <p style="color: #d4af37; font-size: 1.8rem; font-family: var(--font-mono); letter-spacing: 3px; font-weight: bold; margin: 0;">TB CA6D92</p>
            </div>
            <p style="color: var(--color-amber-muted); font-size: 0.9rem; margin-bottom: 25px;">+50 Detektiv-Punkte</p>
            <button class="btn-primary" onclick="this.parentElement.parentElement.remove()" style="width: 100%;">Akte anlegen!</button>
          </div>
        `;
        document.body.appendChild(easterEggOverlay);
      }
    }
  });

  // Start / Fortsetzen Button
  startBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const currentState = getState();
    const solvedCount = (currentState.solvedStations || []).length;

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
      // Beim ersten Start bzw. wenn noch nichts gelöst ist: Bilderstory zeigen!
      if (solvedCount === 0) {
        openIntro(() => {
          window.dispatchEvent(new Event('requestRouting'));
          updateUIFromState(getState());
        });
      } else {
        window.dispatchEvent(new Event('requestRouting'));
        updateUIFromState(getState());
      }
    }, 300);
  });

  // Vorgeschichte direkt ansehen
  if (openIntroBtn) {
    openIntroBtn.addEventListener('click', () => {
      openIntro();
    });
  }

  // 4. Reset Modal Logik (Sicherheitsbestätigung)
  if (openResetBtn) {
    openResetBtn.addEventListener('click', () => {
      if (modalReset) {
        modalReset.classList.remove('hidden');
      } else {
        // Fallback falls Modal nicht im DOM ist
        if (confirm("Möchtest du die Fallakte wirklich schreddern und alle Daten zurücksetzen?")) {
          resetState();
          nameInput.value = '';
          nameInput.disabled = false;
          nameInput.style.opacity = '1';
          updateUIFromState(getState());
          alert("Die Fallakte wurde erfolgreich geschreddert.");
        }
      }
    });
  }

  const closeResetModal = () => {
    if (modalReset) modalReset.classList.add('hidden');
  };

  if (modalResetClose) modalResetClose.addEventListener('click', closeResetModal);
  if (btnCancelReset) btnCancelReset.addEventListener('click', closeResetModal);

  if (btnConfirmReset) {
    btnConfirmReset.addEventListener('click', () => {
      resetState();
      nameInput.value = '';
      nameInput.disabled = false;
      nameInput.style.opacity = '1';
      closeResetModal();
      updateUIFromState(getState());
      alert("Die Ermittlungsakte wurde vollständig geschreddert und zurückgesetzt.");
    });
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
