let bgm = null;
let isMuted = localStorage.getItem('krimi_muted') === 'true';
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playSynthesizedTone(type) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  
  if (type === 'success') {
    [329.63, 415.30, 493.88].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.09);
      gain.gain.setValueAtTime(0.12, now + i * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.09);
      osc.stop(now + i * 0.09 + 0.3);
    });
  } else if (type === 'notification') {
    [587.33, 880.00].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.07);
      gain.gain.setValueAtTime(0.1, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.22);
    });
  } else if (type === 'bell') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 1.2);
  } else if (type === 'confused') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(160, now + 0.18);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  }
}

export function initAudio() {
  console.log("Audio Module initialized. (Web Audio API ready)");
  try {
    bgm = new Audio('assets/soundtrack.mp3');
    bgm.loop = true;
    bgm.volume = 0.4;
    bgm.onerror = () => {
      // Soundtrack-Datei optional: sauber ignorieren falls nicht vorhanden
      bgm = null;
    };
  } catch (e) {
    bgm = null;
  }

  const startAudioOnFirstClick = () => {
    getAudioContext();
    if (!isMuted && bgm) {
      bgm.play().catch(e => console.log('Audio autoplay prevented'));
    }
    document.body.removeEventListener('click', startAudioOnFirstClick);
  };
  document.body.addEventListener('click', startAudioOnFirstClick);

  const btnMusic = document.getElementById('btn-toggle-music');
  if (btnMusic) {
    btnMusic.textContent = isMuted ? '🔇' : '🔊';
    btnMusic.addEventListener('click', (e) => {
      e.stopPropagation();
      const mutedNow = toggleMute();
      btnMusic.textContent = mutedNow ? '🔇' : '🔊';
    });
  }
}

export function playSound(name) {
  if (isMuted) return;
  // Synthesized Web Audio chime as reliable instant feedback
  try {
    playSynthesizedTone(name);
  } catch (e) {}
}

export function toggleMute() {
  isMuted = !isMuted;
  localStorage.setItem('krimi_muted', isMuted);
  if (isMuted) {
    if (bgm) bgm.pause();
    console.log("[Audio] Muted");
  } else {
    if (bgm) bgm.play().catch(e => {});
    console.log("[Audio] Unmuted");
  }
  return isMuted;
}

export function getMuteState() {
  return isMuted;
}

export function duckBGM(isDucking) {
  if (isMuted || !bgm) return;
  
  // Smoothly fade volume
  const target = isDucking ? 0.05 : 0.4;
  let current = bgm.volume;
  const step = (target - current) / 20;
  
  const fade = setInterval(() => {
    current += step;
    if ((step > 0 && current >= target) || (step < 0 && current <= target)) {
      bgm.volume = target;
      clearInterval(fade);
    } else {
      bgm.volume = current;
    }
  }, 50);
}
