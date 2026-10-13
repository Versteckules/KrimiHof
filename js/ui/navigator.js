/**
 * navigator.js - Peilungs-Kompass, Entfernung & Sonar-Puls (AP7)
 */

import { onPositionUpdate, getDistance, getBearing } from '../geo.js';
import { getActiveTargetId, updatePlayerMarker } from './map.js';
import { getStationById, getConfig, getStory } from '../config-loader.js';
import { parseCoords } from '../coords.js';
import { showNoirAlert } from '../main.js';

let sonarInterval = null;
let isGeofenceTriggered = false;
let currentDist = null;

export function initNavigator() {
  const distanceEl = document.getElementById('nav-distance');
  const compassEl = document.getElementById('nav-compass');
  const config = getConfig();
  // Hinweis: Der Dossier-Button wird in ui/dossier.js verdrahtet (AP12).

  onPositionUpdate((pos) => {
    // 1. Update Player position on Map
    updatePlayerMarker(pos.lat, pos.lng);

    // 2. Navigator Logic
    const targetId = getActiveTargetId();
    if (!targetId) {
      distanceEl.textContent = '-- m';
      compassEl.style.transform = `rotate(0deg)`;
      stopSonar();
      return;
    }

    let targetLat = null;
    let targetLng = null;

    const station = getStationById(targetId);
    if (station && station.coordsDecimal) {
      targetLat = station.coordsDecimal.lat;
      targetLng = station.coordsDecimal.lng;
    } else {
      const suspectId = targetId.startsWith('suspect_') ? targetId.replace('suspect_', '') : targetId;
      const story = getStory();
      if (story && story.suspects && story.suspects[suspectId]) {
        const susp = story.suspects[suspectId];
        if (susp.coords) {
          const parsed = parseCoords(susp.coords);
          if (parsed) {
            targetLat = parsed.lat;
            targetLng = parsed.lng;
          }
        }
      }
    }

    if (targetLat === null || targetLng === null) {
      distanceEl.textContent = '-- m';
      compassEl.style.transform = `rotate(0deg)`;
      stopSonar();
      return;
    }

    // Distanz
    const dist = getDistance(pos.lat, pos.lng, targetLat, targetLng);
    currentDist = dist;
    distanceEl.textContent = `${Math.round(dist)} m`;

    // Kompass (Einfache Peilung relativ zu Norden)
    // Wenn das Gerät einen echten Magnetkompass (heading) liefert, müssten wir das subtrahieren.
    // Aber für AP7 reicht die Peilungs-Richtung.
    const bearing = getBearing(pos.lat, pos.lng, targetLat, targetLng);
    let rotation = bearing;
    if (pos.heading !== null && !isNaN(pos.heading)) {
      rotation = bearing - pos.heading;
    }
    compassEl.style.transform = `rotate(${rotation}deg)`;

    // Sonar & Geofence
    checkGeofence(dist, config.geo, targetId);
    updateSonar(dist, config.geo);
  });

  // Easter Egg 3: Kompass-Schwindel
  let totalRotation = 0;
  let lastAlpha = null;
  window.addEventListener('deviceorientation', (e) => {
    if (e.alpha === null) return;
    if (lastAlpha !== null) {
      let diff = e.alpha - lastAlpha;
      // Handle wrap around 360/0
      if (diff > 180) diff -= 360;
      else if (diff < -180) diff += 360;
      
      totalRotation += diff;
      
      if (Math.abs(totalRotation) > 1080) { // 3 full rotations
        totalRotation = 0; // reset
        import('../state.js').then(mod => {
          const state = mod.getState();
          if (!state.easterEggCompass) {
            document.body.style.transition = 'filter 2s';
            document.body.style.filter = 'blur(5px) hue-rotate(90deg)';
            setTimeout(() => {
              showNoirAlert("EASTER EGG GEFUNDEN!\n\nJean Paul flüstert: 'Schwindel ist die Poesie des Raumes.' (+25 Punkte)", "Geheimes Ereignis");
              document.body.style.filter = 'none';
              mod.saveState({ easterEggCompass: true, score: (state.score || 0) + 25 });
            }, 2000);
          }
        });
      }
    }
    lastAlpha = e.alpha;
  });
}

let lastCheckedTargetId = null;

document.addEventListener('targetChanged', () => {
  isGeofenceTriggered = false;
  lastCheckedTargetId = null;
});

function checkGeofence(dist, geoConfig, targetId) {
  if (targetId !== lastCheckedTargetId) {
    lastCheckedTargetId = targetId;
    isGeofenceTriggered = false;
  }

  const hitRadius = geoConfig.standardRadiusMeters;
  if (dist <= hitRadius && !isGeofenceTriggered) {
    isGeofenceTriggered = true;
    
    if (targetId.startsWith('suspect_') || ['herold', 'gipser', 'heiden'].includes(targetId)) {
      const suspectId = targetId.startsWith('suspect_') ? targetId.replace('suspect_', '') : targetId;
      console.log(`[Navigator] GEOFENCE BETRETEN für Verdächtigen: ${suspectId}`);
      import('./dossier.js').then(module => {
        module.startSuspectInterrogation(suspectId);
      });
    } else {
      console.log('[Navigator] GEOFENCE BETRETEN! Rätselmaske sollte öffnen (AP8)');
      import('./station.js').then(module => {
        module.openStation(targetId);
      });
    }
  } else if (dist > hitRadius) {
    isGeofenceTriggered = false;
  }
}

function updateSonar(dist, geoConfig) {
  const triggerDist = geoConfig.sonarTriggerDistanceMeters;
  
  if (dist > triggerDist) {
    stopSonar();
    return;
  }

  // Wir sind innerhalb der 100m. Puls-Rate berechnen.
  // 100m = 2000ms
  // 20m = 500ms
  const minRate = 2000;
  const maxRate = 500;
  const factor = (dist - geoConfig.standardRadiusMeters) / (triggerDist - geoConfig.standardRadiusMeters);
  const rate = Math.max(maxRate, Math.min(minRate, maxRate + factor * (minRate - maxRate)));

  if (!sonarInterval || sonarInterval.rate !== rate) {
    stopSonar();
    sonarInterval = {
      rate: rate,
      id: setInterval(triggerSonarPulse, rate)
    };
  }
}

function triggerSonarPulse() {
  const compassEl = document.getElementById('nav-compass');
  if (compassEl) {
    compassEl.style.boxShadow = '0 0 15px 5px var(--color-blood-red)';
    setTimeout(() => {
      compassEl.style.boxShadow = 'none';
    }, 200);
  }

  // Haptisches Feedback, falls unterstützt
  if (navigator.vibrate) {
    // Kurze Vibration, abhängig von Distanz
    let vibLen = 50;
    if (currentDist && currentDist < 40) vibLen = 100;
    navigator.vibrate(vibLen);
  }
}

export function stopSonar() {
  if (sonarInterval) {
    clearInterval(sonarInterval.id);
    sonarInterval = null;
  }
}
