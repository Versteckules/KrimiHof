/**
 * sync.js - Team-Synchronisation & QR-Code Engine für "Der Pakt der Schlappen-Erben"
 * 
 * Ermöglicht den Austausch des Spielstands zwischen Team-Mitgliedern:
 * - Kompakte Serialisierung/Kompression des Spielstands in einen Base64-Hash
 * - Generierung von QR-Codes via vendor/qrcode.min.js für Offline-Scanning
 * - Import via URL-Parameter (?sync=...) oder Scan/Eingabe
 */

import { getState, saveState } from './state.js';


/**
 * Wandelt einen UTF-8 String in URL-sicheres Base64 um
 */
function toUrlSafeBase64(str) {
  const utf8Bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < utf8Bytes.length; i++) {
    binary += String.fromCharCode(utf8Bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Wandelt URL-sicheres Base64 zurück in einen UTF-8 String
 */
function fromUrlSafeBase64(base64Str) {
  let standard = base64Str.replace(/-/g, '+').replace(/_/g, '/');
  while (standard.length % 4 !== 0) {
    standard += '=';
  }
  const binary = atob(standard);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

/**
 * Packt den aktuellen Spielstand in ein kompaktes Daten-Format
 * @param {object} [sourceState] Optionaler State, sonst aktueller
 * @returns {string} Kompakter Hash-String
 */
export function exportStateHash(sourceState = null) {
  const s = sourceState || getState();

  // Kompaktes JSON-Schema zur Reduktion der Datenmenge für den QR-Code
  const payload = {
    v: 1,                                  // Version
    p: s.playerName || '',                 // Player Name
    st: s.gameStarted ? 1 : 0,             // Started
    ss: s.solvedStations || [],            // Solved Stations
    so: s.stationOrder || [],              // Station Order
    bs: s.bonusSolved || [],               // Bonus Solved
    zs: s.zoneScores || {},                // Zone Scores
    sc: s.suspectScores || {},             // Suspect Scores
    dc: s.decisions || {},                 // Decisions
    ev: s.triggeredEvents || [],           // Events
    tb: s.unlockedTrackables || [],        // TB Codes
    iv: s.inventory || [],                 // Inventory
    pts: s.score || 0,                     // Total Score
    ts: Date.now()                         // Timestamp
  };

  const jsonStr = JSON.stringify(payload);
  return toUrlSafeBase64(jsonStr);
}

/**
 * Entpackt einen State-Hash in ein reguläres Spielstand-Objekt
 * @param {string} hashStr 
 * @returns {object} Entpackter Spielstand
 */
export function importStateHash(hashStr) {
  if (!hashStr || typeof hashStr !== 'string') {
    throw new Error('Ungültiger Sync-Hash.');
  }

  const clean = hashStr.trim();
  const jsonStr = fromUrlSafeBase64(clean);
  const payload = JSON.parse(jsonStr);

  if (!payload || typeof payload !== 'object') {
    throw new Error('Fehlerhaftes Datenpaket im Sync-Hash.');
  }

  // Rekonstruktion des vollständigen States
  return {
    version: payload.v || 1,
    playerName: payload.p || '',
    gameStarted: Boolean(payload.st),
    solvedStations: Array.isArray(payload.ss) ? payload.ss : [],
    stationOrder: Array.isArray(payload.so) ? payload.so : [],
    bonusSolved: Array.isArray(payload.bs) ? payload.bs : [],
    zoneScores: payload.zs || { zentrum: 0, altstadt: 0, neustadt: 0, bahnhof: 0, saale: 0 },
    suspectScores: payload.sc || { herold: 0, gipser: 0, heiden: 0 },
    decisions: payload.dc || {},
    triggeredEvents: Array.isArray(payload.ev) ? payload.ev : [],
    unlockedTrackables: Array.isArray(payload.tb) ? payload.tb : [],
    inventory: Array.isArray(payload.iv) ? payload.iv : [],
    score: typeof payload.pts === 'number' ? payload.pts : 0,
    lastSaved: new Date().toISOString()
  };
}

/**
 * Wendet einen importierten Hash direkt auf den aktuellen Spielstand an
 * @param {string} hashStr
 * @returns {object} Der neue Spielstand
 */
export function applySyncHash(hashStr) {
  const unpackedState = importStateHash(hashStr);
  saveState(unpackedState);
  return unpackedState;
}

/**
 * Generiert die vollständige Synchronisations-URL
 * @param {object} [sourceState] 
 * @returns {string} Vollständige URL mit ?sync=...
 */
export function generateSyncUrl(sourceState = null) {
  const hash = exportStateHash(sourceState);
  const loc = window.location;
  const baseUrl = `${loc.origin}${loc.pathname}`;
  return `${baseUrl}?sync=${hash}`;
}

/**
 * Rendert einen QR-Code der Sync-URL in ein Canvas oder SVG Element
 * @param {HTMLCanvasElement|HTMLElement} targetElement 
 * @param {object} [options] { size, useShortHash, colorDark, colorLight }
 */
export function renderSyncQRCode(targetElement, options = {}) {
  const syncUrl = generateSyncUrl();
  const textToEncode = options.useShortHash ? exportStateHash() : syncUrl;

  targetElement.innerHTML = ''; // Vorherigen Code löschen

  new QRCode(targetElement, {
    text: textToEncode,
    width: options.size || 240,
    height: options.size || 240,
    colorDark: options.colorDark || '#0a0e17',
    colorLight: options.colorLight || '#ffffff',
    correctLevel: QRCode.CorrectLevel.L
  });

  return targetElement;
}

/**
 * Prüft beim Start der App, ob ein ?sync= Parameter in der URL vorhanden ist
 * @returns {string|null} Der Hash falls vorhanden, sonst null
 */
export function checkUrlSyncParameter() {
  const params = new URLSearchParams(window.location.search);
  const syncHash = params.get('sync');
  if (syncHash) {
    return syncHash;
  }

  // Fallback: Prüfe auch URL-Hash (#sync=...)
  if (window.location.hash.startsWith('#sync=')) {
    return window.location.hash.replace('#sync=', '');
  }

  return null;
}
