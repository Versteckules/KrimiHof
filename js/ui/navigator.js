/**
 * navigator.js - Peilungs-Kompass, Entfernung & Sonar-Puls (AP7)
 */

import { onPositionUpdate, getDistance, getBearing } from '../geo.js';
import { getActiveTargetId, updatePlayerMarker } from './map.js';
import { getStationById, getConfig } from '../config-loader.js';

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

    const station = getStationById(targetId);
    if (!station || !station.coordsDecimal) return;

    const targetLat = station.coordsDecimal.lat;
    const targetLng = station.coordsDecimal.lng;

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
              alert("EASTER EGG GEFUNDEN! Jean Paul sagt: 'Schwindel ist die Poesie des Raumes'. (+25 Punkte)");
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

function checkGeofence(dist, geoConfig, targetId) {
  const hitRadius = geoConfig.standardRadiusMeters;
  if (dist <= hitRadius && !isGeofenceTriggered) {
    isGeofenceTriggered = true;
    
    console.log('[Navigator] GEOFENCE BETRETEN! Rätselmaske sollte öffnen (AP8)');
    // Hole openStation dynamisch oder lade es
    import('./station.js').then(module => {
      module.openStation(targetId);
    });
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
