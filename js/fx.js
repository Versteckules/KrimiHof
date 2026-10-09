/**
 * fx.js - Champions League Audio & Visual Effects Engine
 * Liefert Haptik, Sound und Wumms für analoge Gadgets.
 */

// --- Audio Engine (Synthesized for zero load time and no external assets needed) ---
let audioCtx = null;

export function isAudioMuted() {
  try {
    return localStorage.getItem('krimi_muted') === 'true';
  } catch (_) {
    return false;
  }
}

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function withActiveAudioCtx(callback) {
  if (isAudioMuted()) return;
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume().then(() => {
        try { callback(ctx); } catch (_) {}
      }).catch(() => {});
    } else {
      callback(ctx);
    }
  } catch (_) {}
}

export function playMechanicalClick() {
  withActiveAudioCtx(ctx => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Mechanisches "Tick"
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.02);
    
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.02);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.025);
  });
  
  // Haptic feedback for mobile
  try {
    if (navigator.vibrate) navigator.vibrate(10);
  } catch (_) {}
}

export function playHeavySnap() {
  withActiveAudioCtx(ctx => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Schweres Einrasten "Klack"
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.7, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.06);
  });
  
  try {
    if (navigator.vibrate) navigator.vibrate([15, 30, 15]);
  } catch (_) {}
}

export function playSuccessWumms() {
  return new Promise(resolve => {
    withActiveAudioCtx(ctx => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      // Tiefes, cineastisches "Wumms" (Inception Horn Lite)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 1.0);
      
      gain.gain.setValueAtTime(1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1.5);
    });
    
    try {
      if (navigator.vibrate) navigator.vibrate(200);
    } catch (_) {}

    // Screen Shake
    const overlay = document.getElementById('gadget-fullscreen-overlay') || document.body;
    overlay.classList.add('fx-wumms');
    
    // Partikel werfen
    triggerParticles(overlay);

    setTimeout(() => {
      overlay.classList.remove('fx-wumms');
      resolve();
    }, 1500);
  });
}

// --- Visual Engine ---

export function shakeElement(el) {
  if (!el) return;
  el.classList.add('fx-shake');
  setTimeout(() => el.classList.remove('fx-shake'), 400);
  
  // Fehler-Sound
  withActiveAudioCtx(ctx => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  });
  
  try {
    if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
  } catch (_) {}
}

export function triggerParticles(container) {
  const rect = container.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'dust-particle';
    
    // Randomize
    const size = Math.random() * 6 + 2;
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 100 + 50;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;
    
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.left = centerX + 'px';
    p.style.top = centerY + 'px';
    p.style.setProperty('--tx', tx + 'px');
    p.style.setProperty('--ty', ty + 'px');
    
    container.appendChild(p);
    
    setTimeout(() => p.remove(), 1000);
  }
}

// Global Haptics & Audio Interceptor
// Verleiht allen interaktiven Buttons im gesamten Spiel einheitliches, befriedigendes Feedback.
export function attachGlobalHaptics() {
  let lastClickTime = 0;

  // Global user gesture unlock for audio context
  const unlockAudio = () => {
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  };
  ['pointerdown', 'touchstart', 'click', 'keydown'].forEach(evt => {
    document.addEventListener(evt, unlockAudio, { passive: true });
  });

  document.addEventListener('pointerdown', (e) => {
    // Falls stummgeschaltet, keinen Ton abspielen
    if (isAudioMuted()) return;

    // Finde das interaktive Element (Button, Link-Button, Dialog-Option, Cards etc.)
    const interactiveEl = e.target.closest(
      'button, .btn, [role="button"], a.btn, .dialogue-btn, .btn-evidence, .btn-arrest, .nav-item, input[type="button"], input[type="submit"], .cl-screw, .character-card, .character-card-btn, .instruction-header, .btn-riddle-choice, .btn-interrogate-popup, .btn-decision, .btn-assign-evidence, .leaflet-marker-icon'
    );

    if (!interactiveEl) {
      // Auch prüfen ob innerhalb eines Gadget-Overlays eine Drehscheibe / Schieberegler geklickt wird
      const overlay = document.getElementById('gadget-fullscreen-overlay');
      if (overlay && overlay.style.display !== 'none') {
        const style = window.getComputedStyle(e.target);
        if (style.cursor === 'pointer' || style.cursor === 'grab' || style.cursor === 'ns-resize' || e.target.closest('.dial-container')) {
          playMechanicalClick();
        }
      }
      return;
    }

    // Wenn deaktiviert, kein Feedback
    if (interactiveEl.disabled || interactiveEl.hasAttribute('disabled') || interactiveEl.classList.contains('disabled')) {
      return;
    }

    // Debounce gegen extrem schnelles Prellen / Doppelfeuer
    const now = Date.now();
    if (now - lastClickTime < 50) return;
    lastClickTime = now;

    // Schwerer Schnapp-Sound für Primäraktionen, Verhaftung, Bestätigungen
    const isHeavyAction = 
      interactiveEl.classList.contains('btn-arrest') ||
      interactiveEl.classList.contains('btn-primary') ||
      interactiveEl.classList.contains('btn-danger') ||
      interactiveEl.id === 'btn-assign-yes' ||
      interactiveEl.id === 'btn-reassign-yes' ||
      interactiveEl.id === 'btn-start-game';

    if (isHeavyAction) {
      playHeavySnap();
    } else {
      playMechanicalClick();
    }

    // Taktiler Klick-Impuls (nicht für Leaflet Marker auf der Karte)
    if (!interactiveEl.classList.contains('leaflet-marker-icon')) {
      interactiveEl.style.transform = (interactiveEl.style.transform || '').replace(/scale\([^\)]+\)/, '') + ' scale(0.97)';
      setTimeout(() => {
        interactiveEl.style.transform = interactiveEl.style.transform.replace(' scale(0.97)', '');
      }, 120);
    }
  }, { passive: true });
}

// --- Dynamic Character Themes (Procedural BGM) ---
let currentThemeOsc = null;
let currentThemeGain = null;

export function playCharacterTheme(suspectId) {
  stopCharacterTheme();
  // Die vom Web Audio API generierten durchgehenden Oszillatoren (Brummen) 
  // wurden entfernt, da sie störend wirkten.
}

export function stopCharacterTheme() {
  if (currentThemeOsc) {
    const ctx = getAudioCtx();
    if (currentThemeGain) {
      currentThemeGain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 1); // Fade out
    }
    const oscToStop = currentThemeOsc;
    setTimeout(() => {
      if (oscToStop) {
        oscToStop.stop();
        if (oscToStop.lfo) oscToStop.lfo.stop();
        if (oscToStop.harmonic) oscToStop.harmonic.stop();
        oscToStop.disconnect();
      }
    }, 1100);
    currentThemeOsc = null;
  }
}

// --- Visual Background Particles ---
let particleInterval = null;
export function startAshParticles() {
  stopAshParticles();
  const container = document.body;
  particleInterval = setInterval(() => {
    const ash = document.createElement('div');
    ash.className = 'ash-particle';
    ash.style.left = Math.random() * 100 + 'vw';
    ash.style.animation = `floatUp ${Math.random() * 3 + 4}s linear forwards`;
    container.appendChild(ash);
    setTimeout(() => ash.remove(), 7000);
  }, 300);
}

export function stopAshParticles() {
  if (particleInterval) clearInterval(particleInterval);
  document.querySelectorAll('.ash-particle').forEach(el => el.remove());
}
