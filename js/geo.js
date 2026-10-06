/**
 * geo.js - Geolocation-Watcher, Haversine, Peilung, Fake-GPS (AP7)
 */

import APP_CONFIG from '../config.js';

let watchId = null;
let currentPos = null;
let fakePos = null;
const listeners = new Set();

function toRad(degrees) {
  return degrees * Math.PI / 180;
}

function toDeg(radians) {
  return radians * 180 / Math.PI;
}

export function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const p1 = toRad(lat1);
  const p2 = toRad(lat2);
  const dp = toRad(lat2 - lat1);
  const dl = toRad(lon2 - lon1);

  const a = Math.sin(dp / 2) * Math.sin(dp / 2) +
            Math.cos(p1) * Math.cos(p2) *
            Math.sin(dl / 2) * Math.sin(dl / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in Metern
}

export function getBearing(lat1, lon1, lat2, lon2) {
  const p1 = toRad(lat1);
  const p2 = toRad(lat2);
  const dl = toRad(lon2 - lon1);

  const y = Math.sin(dl) * Math.cos(p2);
  const x = Math.cos(p1) * Math.sin(p2) -
            Math.sin(p1) * Math.cos(p2) * Math.cos(dl);
  let theta = Math.atan2(y, x);
  let brng = (toDeg(theta) + 360) % 360;
  return brng;
}

function updateListeners(pos) {
  currentPos = pos;
  listeners.forEach(cb => {
    try { cb(currentPos); } catch (e) { console.error(e); }
  });
}

export function startWatch() {
  if (watchId !== null) return;
  if (!navigator.geolocation) {
    console.warn("Geolocation API nicht verfügbar.");
    return;
  }

  const { gpsTimeoutMs, maximumAgeMs, highAccuracy } = APP_CONFIG.geo;

  watchId = navigator.geolocation.watchPosition(
    (position) => {
      if (fakePos) return; // Fake überschreibt real
      updateListeners({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        heading: position.coords.heading,
        timestamp: position.timestamp,
        isFake: false
      });
    },
    (err) => {
      console.warn(`[Geo] Error (${err.code}): ${err.message}`);
    },
    {
      enableHighAccuracy: highAccuracy,
      timeout: gpsTimeoutMs,
      maximumAge: maximumAgeMs
    }
  );
}

export function stopWatch() {
  if (watchId !== null && navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
}

export function setFakePosition(lat, lng, accuracy = 5) {
  if (lat === null && lng === null) {
    fakePos = null;
    return;
  }
  fakePos = { lat, lng, accuracy, heading: null, timestamp: Date.now(), isFake: true };
  updateListeners(fakePos);
}

export function onPositionUpdate(callback) {
  listeners.add(callback);
  
  if (fakePos) {
    callback(fakePos);
  } else if (currentPos) {
    callback(currentPos);
  }
  
  if (listeners.size === 1) {
    startWatch();
  }
  
  return () => {
    listeners.delete(callback);
    if (listeners.size === 0) {
      stopWatch();
    }
  };
}

export function getCurrentPosition() {
  return fakePos || currentPos;
}
