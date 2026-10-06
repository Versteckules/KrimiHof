import { initLanding } from './ui/landing.js';
import { initAudio } from './audio.js';
import { initEasterEggs } from './easter-eggs.js';
import { loadAllData } from './config-loader.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log("App Bootstrapping... (AP1 & AP2 ready)");
  
  // Initialize Core Modules
  initAudio();
  initEasterEggs();
  
  // Initialize View
  initLanding();

  // Load and validate game configuration & data (AP2)
  try {
    const data = await loadAllData();
    console.log(`[AP2 Engine] Spieldaten erfolgreich geladen: ${data.stations.length} Stationen, ${data.events.length} Events.`);
  } catch (error) {
    console.error("[AP2 Engine] Fehler beim Laden der Spieldaten:", error);
  }
});

