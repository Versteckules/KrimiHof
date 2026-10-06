import { playSound } from './audio.js';
import { onPositionUpdate } from './geo.js';

export function initEasterEggs() {
  console.log("Easter Eggs listener initialized.");
  
  // 1. Compass Spin / Verwirrung
  document.addEventListener('easterEggCompass', () => {
    document.body.classList.add('glass-crack');
    playSound('confused');
    setTimeout(() => {
      document.body.classList.remove('glass-crack');
    }, 2000);
    alert("EASTER EGG: Der Kompass ist verwirrt! Die Sensoren spielen verrückt.");
  });

  // 2. Midnight Glockenschlag
  document.addEventListener('easterEggBell', () => {
    playSound('bell');
    alert("EASTER EGG: Es ist exakt Mitternacht! Die Geisterstunde beginnt.");
  });

  setInterval(() => {
    const d = new Date();
    if (d.getHours() === 0 && d.getMinutes() === 0 && d.getSeconds() === 0) {
      document.dispatchEvent(new CustomEvent('easterEggBell'));
    }
  }, 1000);

  // 3. Speed Demon (zu schnell für Fußgänger)
  let speedWarningShown = false;
  onPositionUpdate((pos) => {
    if (pos.speed && pos.speed > 8.33 && !speedWarningShown) { // > 30 km/h
      speedWarningShown = true;
      alert("EASTER EGG: Bist du im Auto unterwegs, Detektiv? Vergiss nicht, die Augen auf der Straße zu behalten!");
    }
  });

  // 4. Offline Mode
  window.addEventListener('offline', () => {
    alert("EASTER EGG: Verbindung zum Archiv abgerissen! Wir sind komplett offline... vertraue deinem Instinkt.");
  });

  // 5. Battery API (Wenn verfügbar)
  if ('getBattery' in navigator) {
    navigator.getBattery().then(function(battery) {
      battery.addEventListener('levelchange', function() {
        if (battery.level <= 0.15) {
          alert("EASTER EGG: Achtung! Deine Batterie ist kritisch. Die Dunkelheit frisst den Akku... beeil dich!");
        }
      });
    });
  }
}
