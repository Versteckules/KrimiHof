let bgm = null;
let isMuted = false;

export function initAudio() {
  console.log("Audio Module initialized. (Web Audio API ready)");
  bgm = new Audio('assets/soundtrack.mp3');
  bgm.loop = true;
  bgm.volume = 0.4;

  const startAudioOnFirstClick = () => {
    if (!isMuted) {
      bgm.play().catch(e => {});
    }
    document.body.removeEventListener('click', startAudioOnFirstClick);
  };
  document.body.addEventListener('click', startAudioOnFirstClick);
}

export function playSound(name) {
  if (isMuted) return;
  const effect = new Audio(`assets/${name}.mp3`);
  effect.volume = 0.8;
  effect.play().catch(e => {});
}

export function toggleMute() {
  isMuted = !isMuted;
  if (isMuted) {
    if (bgm) bgm.pause();
    console.log("[Audio] Muted");
  } else {
    if (bgm) bgm.play().catch(e => {});
    console.log("[Audio] Unmuted");
  }
  return isMuted;
}
