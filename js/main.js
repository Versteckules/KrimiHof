import { initLanding } from './ui/landing.js';
import { initAudio } from './audio.js';
import { initEasterEggs } from './easter-eggs.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log("App Bootstrapping... AP1");
  
  // Initialize Core Modules
  initAudio();
  initEasterEggs();
  
  // Initialize View
  initLanding();
});
