import { playSound } from './audio.js';

export function initEasterEggs() {
  console.log("Easter Eggs listener initialized.");
  
  document.addEventListener('easterEggCompass', () => {
    // 3x im Kreis gedreht = "verwirrt"
    document.body.classList.add('glass-crack');
    playSound('confused');
    setTimeout(() => {
      document.body.classList.remove('glass-crack');
    }, 2000);
    alert("EASTER EGG: Der Kompass ist verwirrt!");
  });

  document.addEventListener('easterEggBell', () => {
    // Mitternachts-Glockenschlag
    playSound('bell');
    alert("EASTER EGG: Es ist Mitternacht! Die Glocken läuten.");
  });

  // Check clock for midnight
  setInterval(() => {
    const d = new Date();
    if (d.getHours() === 0 && d.getMinutes() === 0 && d.getSeconds() === 0) {
      document.dispatchEvent(new CustomEvent('easterEggBell'));
    }
  }, 1000);
}
