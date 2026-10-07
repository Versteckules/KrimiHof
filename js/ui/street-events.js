/**
 * street-events.js - Zufällige Begegnungen auf dem Weg (AP9)
 */

import { getEvents, getConfig, getStory } from '../config-loader.js';
import { onPositionUpdate, getDistance } from '../geo.js';
import { recordEventTriggered, getState, unlockTrackable, isTrackableUnlocked } from '../state.js';
import { playSound } from '../audio.js';
import { openDialogue } from './dialogue.js';

let totalDistanceWalked = 0;
let lastPos = null;

export function initStreetEvents() {
  onPositionUpdate((pos) => {
    if (lastPos) {
      const dist = getDistance(lastPos.lat, lastPos.lng, pos.lat, pos.lng);
      if (dist > 5 && dist < 100) { // Ignoriere GPS-Sprünge
        totalDistanceWalked += dist;
        checkEventTrigger();
      }
    }
    lastPos = pos;
  });
}

function checkEventTrigger() {
  // Alle 150m wird ein Event getriggert
  if (totalDistanceWalked > 150) {
    totalDistanceWalked = 0; // Reset

    const state = getState();
    const config = getConfig();
    const allEvents = getEvents();
    
    // Check available TBs
    const allTbs = config.gameplay.trackables;
    const availableTbs = allTbs.filter(tb => !isTrackableUnlocked(tb));

    // Check available Story Events
    const availableEvents = allEvents.filter(e => !state.triggeredEvents.includes(e.id));
    
    // 50% chance for a TB, 50% for a Story Event (if available)
    const roll = Math.random();
    
    if (roll > 0.5 && availableTbs.length > 0) {
      const randomTb = availableTbs[Math.floor(Math.random() * availableTbs.length)];
      triggerTrackableDiscovery(randomTb);
    } else if (availableEvents.length > 0) {
      const evt = availableEvents[Math.floor(Math.random() * availableEvents.length)];
      triggerStoryEvent(evt);
    } else if (availableTbs.length > 0) {
       // Fallback to TB if no events left
       const randomTb = availableTbs[Math.floor(Math.random() * availableTbs.length)];
       triggerTrackableDiscovery(randomTb);
    }
  }
}

function triggerTrackableDiscovery(tbCode) {
  playSound('notification');
  let overlay = document.getElementById('event-mock-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'event-mock-overlay';
    overlay.style.cssText = "position:fixed; top:0; left:0; right:0; bottom:0; background: rgba(5,8,15,0.98); z-index: 10000; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff; text-align:center; padding:var(--space-lg);";
    document.body.appendChild(overlay);
  }
  
  overlay.innerHTML = `
    <h2 style="color:var(--color-night-light); font-size:2rem; margin-bottom:var(--space-md); font-family:var(--font-serif);">📜 Fund am Wegesrand!</h2>
    <div style="background:rgba(255,255,255,0.05); border:1px solid var(--color-glass-border); padding:var(--space-xl); border-radius:10px; margin-bottom:var(--space-lg); max-width: 450px;">
      <p style="font-size:1.1rem; line-height:1.6; margin-bottom:var(--space-md);">Während du aufmerksam die Straße hinuntergehst, fällt dir ein gefaltetes Stück Papier auf, das in einer Mauerritze steckt. Du ziehst es heraus und entdeckst einen Geheimcode der Bruderschaft!</p>
      <div style="font-family:var(--font-mono); font-size:2.5rem; color:var(--color-amber-glow); letter-spacing:4px; font-weight:bold; padding:var(--space-sm); border:2px dashed var(--color-amber-glow); border-radius:5px;">
        ${tbCode}
      </div>
    </div>
    <button id="btn-pickup-tb" class="btn-primary" style="max-width:300px; width:100%;">Code in die Akte aufnehmen</button>
  `;
  overlay.style.display = 'flex';

  document.getElementById('btn-pickup-tb').onclick = () => {
    unlockTrackable(tbCode);
    playSound('success');
    overlay.style.display = 'none';
  };
}

function triggerStoryEvent(evt) {
  playSound('notification');
  let overlay = document.getElementById('event-mock-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'event-mock-overlay';
    overlay.style.cssText = "position:fixed; top:0; left:0; right:0; bottom:0; background: rgba(5,8,15,0.98); z-index: 10000; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff; text-align:center; padding:var(--space-lg);";
    document.body.appendChild(overlay);
  }
  
  const isPhoneCall = evt.type === 'suspect_call';
  const icon = isPhoneCall ? '📱 EINGEHENDER ANRUF' : '⚠️ EREIGNIS';
  
  overlay.innerHTML = `
    <h2 style="color:var(--color-blood-red); font-size:1.8rem; margin-bottom:10px; font-family:var(--font-serif);">${icon}</h2>
    <h3 style="font-size:1.5rem; margin-bottom: 20px; color:var(--color-amber-glow);">${evt.title}</h3>
    <div style="background:rgba(255,255,255,0.05); border:1px solid var(--color-glass-border); padding:var(--space-lg); border-radius:10px; margin-bottom:var(--space-lg); max-width: 450px;">
      <p style="font-size:1rem; line-height:1.6; font-style:italic;">${evt.description}</p>
    </div>
    <div style="display:flex; gap:10px; width:100%; max-width:400px;">
      <button id="btn-mock-event-ok" class="btn-primary" style="flex:1;">${isPhoneCall ? 'Annehmen' : 'Interagieren'}</button>
      <button id="btn-mock-event-fail" class="btn-secondary" style="flex:1;">${isPhoneCall ? 'Abweisen' : 'Ignorieren'}</button>
    </div>
  `;
  overlay.style.display = 'flex';

  document.getElementById('btn-mock-event-ok').onclick = () => {
    overlay.style.display = 'none';
    recordEventTriggered(evt.id, 10);
    
    if (isPhoneCall) {
      const story = getStory();
      if (story && story.dialogueTrees && story.dialogueTrees[evt.id]) {
        openDialogue(story.dialogueTrees[evt.id]);
      }
    }
  };
  
  document.getElementById('btn-mock-event-fail').onclick = () => {
    overlay.style.display = 'none';
    recordEventTriggered(evt.id, 0); 
  };
}

export function triggerStoryEventById(eventId) {
  const allEvents = getEvents();
  const evt = allEvents.find(e => e.id === eventId);
  if (evt) {
    triggerStoryEvent(evt);
  } else {
    console.warn("Event nicht gefunden:", eventId);
  }
}
