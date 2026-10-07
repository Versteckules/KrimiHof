/**
 * fx.js - Champions League Audio & Visual Effects Engine
 * Liefert Haptik, Sound und Wumms für analoge Gadgets.
 */

// --- Audio Engine (Synthesized for zero load time and no external assets needed) ---
let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playMechanicalClick() {
  const ctx = getAudioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  // Mechanisches "Tick"
  osc.type = 'square';
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.02);
  
  gain.gain.setValueAtTime(0.5, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.02);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start();
  osc.stop(ctx.currentTime + 0.03);
  
  // Haptic feedback for mobile
  if (navigator.vibrate) navigator.vibrate(10);
}

export function playHeavySnap() {
  const ctx = getAudioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  // Schweres Einrasten "Klack"
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(300, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.05);
  
  gain.gain.setValueAtTime(0.8, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start();
  osc.stop(ctx.currentTime + 0.06);
  
  if (navigator.vibrate) navigator.vibrate([15, 30, 15]);
}

export function playSuccessWumms() {
  return new Promise(resolve => {
    const ctx = getAudioCtx();
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
    
    osc.start();
    osc.stop(ctx.currentTime + 1.5);
    
    if (navigator.vibrate) navigator.vibrate(200);

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
  const ctx = getAudioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(150, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.1);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.1);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.15);
  
  if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
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

// Global Haptics Interceptor
// Klinkt sich in alle Gadget-Interaktionen ein und feuert "Clicks" ab.
export function attachGlobalHaptics() {
  document.addEventListener('pointerdown', (e) => {
    // Nur aktiv, wenn das Gadget-Overlay offen ist
    const overlay = document.getElementById('gadget-fullscreen-overlay');
    if (!overlay || overlay.style.display === 'none') return;

    const el = e.target;
    const style = window.getComputedStyle(el);
    const isInteractive = 
      style.cursor === 'pointer' || 
      style.cursor === 'grab' || 
      style.cursor === 'ns-resize' ||
      el.tagName === 'BUTTON' ||
      el.classList.contains('dial-container') ||
      el.closest('.dial-container');

    if (isInteractive) {
      playMechanicalClick();
      
      // Visueller "Press" Effekt
      el.style.transform = (el.style.transform || '').replace(/scale\([^\)]+\)/, '') + ' scale(0.96)';
      setTimeout(() => {
        el.style.transform = el.style.transform.replace(' scale(0.96)', '');
      }, 150);
    }
  });
  
  // Snap effect for drag ends or dial stops
  document.addEventListener('pointerup', (e) => {
    const overlay = document.getElementById('gadget-fullscreen-overlay');
    if (!overlay || overlay.style.display === 'none') return;
    // We assume if pointerup happens after a drag, it might have snapped.
    // This is subtle, maybe play HeavySnap occasionally or leave to specific logic.
  });
}

// --- Dynamic Character Themes (Procedural BGM) ---
let currentThemeOsc = null;
let currentThemeGain = null;

export function playCharacterTheme(suspectId) {
  stopCharacterTheme();
  const ctx = getAudioCtx();
  currentThemeGain = ctx.createGain();
  currentThemeGain.connect(ctx.destination);
  
  if (suspectId === 'herold') {
    // Tiefe, dröhnende Frequenz (Gier, Macht, Dunkelheit)
    currentThemeOsc = ctx.createOscillator();
    currentThemeOsc.type = 'sine';
    currentThemeOsc.frequency.setValueAtTime(45, ctx.currentTime);
    currentThemeGain.gain.setValueAtTime(0, ctx.currentTime);
    currentThemeGain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 2); // Fade in
    currentThemeOsc.connect(currentThemeGain);
    currentThemeOsc.start();
  } else if (suspectId === 'gipser') {
    // Kühler, elektronischer Herzschlag / Puls
    currentThemeOsc = ctx.createOscillator();
    currentThemeOsc.type = 'triangle';
    currentThemeOsc.frequency.setValueAtTime(60, ctx.currentTime);
    
    // LFO für den Puls-Effekt
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 1.5; // 1.5 Hz
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.3;
    lfo.connect(lfoGain);
    lfoGain.connect(currentThemeGain.gain);
    
    currentThemeGain.gain.setValueAtTime(0, ctx.currentTime);
    currentThemeGain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 2);
    
    currentThemeOsc.connect(currentThemeGain);
    currentThemeOsc.start();
    lfo.start();
    currentThemeOsc.lfo = lfo;
  } else if (suspectId === 'heiden') {
    // Unheimliche Kirchenorgel-Atmosphäre
    currentThemeOsc = ctx.createOscillator();
    currentThemeOsc.type = 'square';
    currentThemeOsc.frequency.setValueAtTime(123.47, ctx.currentTime); // Low B
    currentThemeGain.gain.setValueAtTime(0, ctx.currentTime);
    currentThemeGain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 3);
    
    // Harmonische Frequenz dazu mischen
    const harmonic = ctx.createOscillator();
    harmonic.type = 'sine';
    harmonic.frequency.setValueAtTime(246.94, ctx.currentTime);
    harmonic.connect(currentThemeGain);
    harmonic.start();
    currentThemeOsc.harmonic = harmonic;
    
    currentThemeOsc.connect(currentThemeGain);
    currentThemeOsc.start();
  }
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
