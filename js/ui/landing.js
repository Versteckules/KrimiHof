export function initLanding() {
  const startBtn = document.getElementById('btn-start-game');
  const nameInput = document.getElementById('player-name-input');
  const errorMsg = document.getElementById('name-error');
  
  const heroContainer = document.querySelector('.hero-container');
  const flashlightOverlay = document.getElementById('flashlight-overlay');
  
  // Accordion Logic
  const instructionHeaders = document.querySelectorAll('.instruction-header');
  instructionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const card = header.parentElement;
      // Toggle current
      card.classList.toggle('active');
    });
  });

  // Name Validation & Start
  startBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (name.length < 2) {
      errorMsg.classList.remove('hidden');
      nameInput.focus();
    } else {
      errorMsg.classList.add('hidden');
      // Save temporarily (State Management is AP3)
      localStorage.setItem('playerName', name);
      console.log(`Ermittler ${name} hat sich angemeldet.`);
      
      // Feedback for AP1 completion
      startBtn.innerHTML = "Lade Akte...";
      startBtn.style.pointerEvents = "none";
      setTimeout(() => {
        alert(`Willkommen, Ermittler ${name}!\n\nAP1 ist hiermit erfolgreich abgeschlossen.\nIm nächsten Schritt (AP4) folgt der Sperrbildschirm/Countdown.`);
        startBtn.innerHTML = "Akte Öffnen";
        startBtn.style.pointerEvents = "auto";
      }, 500);
    }
  });

  // Restore name if already entered
  const savedName = localStorage.getItem('playerName');
  if (savedName) {
    nameInput.value = savedName;
  }

  // Interactive Flashlight (Mouse/Touch)
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
