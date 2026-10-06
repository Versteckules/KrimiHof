/**
 * street-events.js - Zufällige Begegnungen auf dem Weg (AP9)
 */

import { getEvents } from '../config-loader.js';
import { onPositionUpdate, getDistance } from '../geo.js';
import { recordEventTriggered, getState } from '../state.js';

// Ein simpler Zähler für gelaufene Meter (als Trigger)
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
  // Alle 300m wird ein Event getriggert (für die Simulation, in echt nach Konzept)
  if (totalDistanceWalked > 300) {
    totalDistanceWalked = 0; // Reset

    const state = getState();
    const allEvents = getEvents();
    
    // Finde ein Event, das noch nicht getriggert wurde
    const available = allEvents.filter(e => !state.triggeredEvents.includes(e.id));
    
    if (available.length > 0) {
      // Zufälliges Event
      const evt = available[Math.floor(Math.random() * available.length)];
      triggerStreetEvent(evt.id);
    }
  }
}

export function triggerStreetEvent(eventId) {
  console.log(`[AP9] Street-Event getriggert: ${eventId}`);
  
  const allEvents = getEvents();
  const evt = allEvents.find(e => e.id === eventId);
  if (!evt) return;

  // Mock UI für Street Event
  let overlay = document.getElementById('event-mock-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'event-mock-overlay';
    overlay.style = "position:fixed; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.9); z-index: 10000; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff; font-family:var(--font-mono); text-align:center; padding:20px;";
    document.body.appendChild(overlay);
  }
  
  overlay.innerHTML = `
    <h2 style="color:var(--color-blood-red); font-size:1.8rem; margin-bottom:10px;">⚠️ ZUFALLS-EREIGNIS</h2>
    <h3 style="font-size:1.5rem; margin-bottom: 20px;">${evt.title}</h3>
    <p style="margin-bottom:30px; max-width:400px;">(Dies ist eine Event-Simulation. In der fertigen Version erscheint hier ein interaktives UI, z.B. eine Verfolgungsjagd oder ein klingelndes Telefon).</p>
    
    <div style="display:flex; gap:10px; width:100%; max-width:400px;">
      <button id="btn-mock-event-ok" class="btn-primary" style="flex:1;">Akzeptieren (+5 Pkt)</button>
      <button id="btn-mock-event-fail" class="btn-danger" style="flex:1;">Verweigern (0 Pkt)</button>
    </div>
  `;
  overlay.style.display = 'flex';

  document.getElementById('btn-mock-event-ok').onclick = () => {
    overlay.style.display = 'none';
    recordEventTriggered(eventId, 5); // 5 Punkte als Belohnung
    alert("Event bewältigt!");
  };
  
  document.getElementById('btn-mock-event-fail').onclick = () => {
    overlay.style.display = 'none';
    recordEventTriggered(eventId, 0); 
    // Konzept: Display Zersplittert Effekt (bei Fehlern)
    document.body.classList.add('glass-crack');
    setTimeout(() => {
      document.body.classList.remove('glass-crack');
    }, 2000);
  };
}
