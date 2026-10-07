let bgm = null;
let isMuted = localStorage.getItem('krimi_muted') === 'true';

export function initAudio() {
  console.log("Audio Module initialized. (Web Audio API ready)");
  bgm = new Audio('assets/soundtrack.mp3');
  bgm.loop = true;
  bgm.volume = 0.4;

  const startAudioOnFirstClick = () => {
    if (!isMuted) {
      bgm.play().catch(e => console.log('Audio autoplay prevented'));
    }
    document.body.removeEventListener('click', startAudioOnFirstClick);
  };
  document.body.addEventListener('click', startAudioOnFirstClick);

  const btnMusic = document.getElementById('btn-toggle-music');
  if (btnMusic) {
    btnMusic.textContent = isMuted ? '🔇' : '🔊';
    btnMusic.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent triggering other clicks
      const mutedNow = toggleMute();
      btnMusic.textContent = mutedNow ? '🔇' : '🔊';
    });
  }
}

export function playSound(name) {
  if (isMuted) return;
  const effect = new Audio(`assets/${name}.mp3`);
  effect.volume = 0.8;
  effect.play().catch(e => {});
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
