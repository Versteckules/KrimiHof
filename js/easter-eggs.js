import { playSound } from './audio.js';
import { onPositionUpdate } from './geo.js';
import { showNoirAlert } from './main.js';

export function initEasterEggs() {
  console.log("Easter Eggs listener initialized.");
  
  // 1. Compass Spin / Verwirrung
  document.addEventListener('easterEggCompass', () => {
    document.body.classList.add('glass-crack');
    playSound('confused');
    setTimeout(() => {
      document.body.classList.remove('glass-crack');
    }, 2000);
    showNoirAlert("Der Kompass ist verwirrt! Die Sensoren spielen verrückt.", "Kompass-Schwindel");
  });

  // 2. Midnight Glockenschlag
  document.addEventListener('easterEggBell', () => {
    playSound('bell');
    showNoirAlert("Es ist exakt Mitternacht! Die Geisterstunde der St. Michaeliskirche beginnt.", "Mitternachtsglocke");
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
      showNoirAlert("Bist du im Auto unterwegs, Detektiv? Vergiss nicht, die Augen auf der Straße zu behalten!", "Tempo-Warnung");
    }
  });

  // 4. Offline Mode
  window.addEventListener('offline', () => {
    showNoirAlert("Verbindung zum Archiv abgerissen! Wir sind komplett offline... vertraue deinem Instinkt.", "Offline-Modus");
  });

  // 5. Battery API (Wenn verfügbar)
  if ('getBattery' in navigator) {
    navigator.getBattery().then(function(battery) {
      battery.addEventListener('levelchange', function() {
        if (battery.level <= 0.15) {
          showNoirAlert("Achtung! Deine Batterie ist kritisch (< 15%). Die Dunkelheit frisst den Akku... beeil dich!", "Akku-Warnung");
        }
      });
    });
  }
}
