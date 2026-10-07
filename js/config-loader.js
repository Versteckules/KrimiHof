/**
 * config-loader.js - Lädt Konfiguration & Spieldaten mit Validierung
 * 
 * Lädt data/stations.json, data/story.json, data/events.json und data/final.json,
 * validiert deren Konsistenz und Koordinaten via coords.js und stellt
 * typsichere Getter zur Verfügung.
 */

import { APP_CONFIG } from '../config.js';
import { parseCoords, isValidCoords } from './coords.js';

// Cache für geladene Datensätze
let _stationsCache = null;
let _storyCache = null;
let _eventsCache = null;
let _finalCache = null;

/**
 * Benutzerdefinierte Fehlerklasse für Validierungsfehler.
 */
export class DataValidationError extends Error {
  constructor(message, details = null) {
    super(message);
    this.name = 'DataValidationError';
    this.details = details;
  }
}

/**
 * Validiert die Stationsdaten aus data/stations.json.
 * @param {Array} stations
 * @returns {Array} Angereicherte und geprüfte Stationen
 */
export function validateStations(stations) {
  if (!Array.isArray(stations)) {
    throw new DataValidationError('Stationsdaten müssen ein Array sein.');
  }

  if (stations.length !== 14) {
    console.warn(`Warnung: Erwartet werden genau 14 Stationen (12 Pflicht + 2 Bonus), gefunden: ${stations.length}`);
  }

  const seenIds = new Set();
  const validatedStations = stations.map((station, index) => {
    if (!station.id || typeof station.id !== 'string') {
      throw new DataValidationError(`Station #${index} besitzt keine gültige ID.`);
    }

    if (seenIds.has(station.id)) {
      throw new DataValidationError(`Doppelte Stations-ID gefunden: "${station.id}"`);
    }
    seenIds.add(station.id);

    if (!station.name) {
      throw new DataValidationError(`Station "${station.id}" besitzt keinen Namen.`);
    }

    if (!station.coords || typeof station.coords !== 'string') {
      throw new DataValidationError(`Station "${station.id}" besitzt keine Koordinatenangabe.`);
    }

    const parsedCoords = parseCoords(station.coords);
    if (!parsedCoords) {
      throw new DataValidationError(
        `Station "${station.id}" besitzt ungültige Koordinaten: "${station.coords}"`
      );
    }

    if (!station.gadget || !station.gadget.id) {
      throw new DataValidationError(`Station "${station.id}" besitzt kein zugewiesenes Gadget.`);
    }

    // Angereichertes Objekt mit gecachten Dezimalkoordinaten
    return {
      ...station,
      coordsDecimal: parsedCoords
    };
  });

  return validatedStations;
}

/**
 * Validiert die Storydaten aus data/story.json.
 * @param {object} story
 * @returns {object} Geprüfte Storydaten
 */
export function validateStory(story) {
  if (!story || typeof story !== 'object') {
    throw new DataValidationError('Storydaten müssen ein Objekt sein.');
  }

  if (!story.suspects || typeof story.suspects !== 'object') {
    throw new DataValidationError('Storydaten müssen ein suspects-Objekt enthalten.');
  }

  const expectedSuspects = ['herold', 'gipser', 'heiden'];
  for (const sId of expectedSuspects) {
    if (!story.suspects[sId]) {
      throw new DataValidationError(`Verdächtiger "${sId}" fehlt in story.json.`);
    }
    if (!story.suspects[sId].name || !story.suspects[sId].motive) {
      throw new DataValidationError(`Verdächtiger "${sId}" unvollständig (Name oder Motiv fehlt).`);
    }
  }

  if (!story.endings || typeof story.endings !== 'object') {
    throw new DataValidationError('Storydaten müssen ein endings-Objekt enthalten.');
  }

  for (const sId of expectedSuspects) {
    if (!story.endings[sId] || !story.endings[sId].confession) {
      throw new DataValidationError(`Finale/Geständnis für "${sId}" fehlt in story.json.`);
    }
  }

  if (!Array.isArray(story.trackables) || story.trackables.length !== 4) {
    console.warn(`Warnung: Erwartet werden 4 Trackables, gefunden: ${story.trackables?.length}`);
  }

  return story;
}

/**
 * Validiert die Weg-Events aus data/events.json.
 * @param {Array} events
 * @returns {Array} Geprüfte Weg-Events
 */
export function validateEvents(events) {
  if (!Array.isArray(events)) {
    throw new DataValidationError('Events-Daten müssen ein Array sein.');
  }

  if (events.length !== 11) {
    console.warn(`Warnung: Erwartet werden genau 11 Weg-Events, gefunden: ${events.length}`);
  }

  const seenIds = new Set();
  events.forEach((ev, idx) => {
    if (!ev.id || seenIds.has(ev.id)) {
      throw new DataValidationError(`Ungültige oder doppelte Event-ID bei Event #${idx}: "${ev.id}"`);
    }
    seenIds.add(ev.id);

    if (!ev.title || !ev.type || !ev.description) {
      throw new DataValidationError(`Event "${ev.id}" unvollständig (Titel, Typ oder Beschreibung fehlt).`);
    }
  });

  return events;
}

/**
 * Validiert die Final-Koordinaten aus data/final.json.
 * @param {object} finalData
 * @returns {object} Geprüfte Finaldaten
 */
export function validateFinal(finalData) {
  if (!finalData || typeof finalData !== 'object') {
    throw new DataValidationError('Finaldaten müssen ein Objekt sein.');
  }

  if (!finalData.coordsDMM || typeof finalData.coordsDMM !== 'string') {
    throw new DataValidationError('Finaldaten müssen einen coordsDMM-String besitzen.');
  }

  const parsed = parseCoords(finalData.coordsDMM);
  if (!parsed) {
    throw new DataValidationError(`Ungültige Final-Koordinaten: "${finalData.coordsDMM}"`);
  }

  return {
    ...finalData,
    coordsDecimal: parsed
  };
}

/**
 * Ermittelt die absolute bzw. korrekte URL relativ zum Projekt-Root
 * @param {string} relPath 
 * @returns {string}
 */
function resolveDataPath(relPath) {
  return new URL('../' + relPath, import.meta.url).href;
}

/**
 * Lädt data/stations.json.
 * @param {boolean} [force=false]
 * @returns {Promise<Array>}
 */
export async function loadStations(force = false) {
  if (_stationsCache && !force) return _stationsCache;
  const url = resolveDataPath(APP_CONFIG.paths.stations);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Fehler beim Laden von ${url}: Status ${res.status}`);
  }
  const raw = await res.json();
  _stationsCache = validateStations(raw);
  return _stationsCache;
}

/**
 * Lädt data/story.json.
 * @param {boolean} [force=false]
 * @returns {Promise<object>}
 */
export async function loadStory(force = false) {
  if (_storyCache && !force) return _storyCache;
  const url = resolveDataPath(APP_CONFIG.paths.story);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Fehler beim Laden von ${url}: Status ${res.status}`);
  }
  const raw = await res.json();
  _storyCache = validateStory(raw);
  return _storyCache;
}

/**
 * Lädt data/events.json.
 * @param {boolean} [force=false]
 * @returns {Promise<Array>}
 */
export async function loadEvents(force = false) {
  if (_eventsCache && !force) return _eventsCache;
  const url = resolveDataPath(APP_CONFIG.paths.events);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Fehler beim Laden von ${url}: Status ${res.status}`);
  }
  const raw = await res.json();
  _eventsCache = validateEvents(raw);
  return _eventsCache;
}

/**
 * Lädt data/final.json.
 * @param {boolean} [force=false]
 * @returns {Promise<object>}
 */
export async function loadFinal(force = false) {
  if (_finalCache && !force) return _finalCache;
  const url = resolveDataPath(APP_CONFIG.paths.finalCoords);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Fehler beim Laden von ${url}: Status ${res.status}`);
  }
  const raw = await res.json();
  _finalCache = validateFinal(raw);
  return _finalCache;
}

/**
 * Lädt alle Spieldaten parallel und validiert sie vollständig.
 * @param {boolean} [force=false]
 * @returns {Promise<{ config: object, stations: Array, story: object, events: Array, finalCoords: object }>}
 */
export async function loadAllData(force = false) {
  const [stations, story, events, finalCoords] = await Promise.all([
    loadStations(force),
    loadStory(force),
    loadEvents(force),
    loadFinal(force)
  ]);

  return {
    config: APP_CONFIG,
    stations,
    story,
    events,
    finalCoords
  };
}

// Synchrone Getter für bereits geladene Daten
export function getConfig() {
  return APP_CONFIG;
}

export function getStations() {
  return _stationsCache;
}

export function getStationById(id) {
  if (!_stationsCache) return null;
  return _stationsCache.find(s => s.id === id) || null;
}

export function getStory() {
  return _storyCache;
}

export function getEvents() {
  return _eventsCache;
}

export function getFinalCoords() {
  return _finalCache;
}
