/**
 * state.js - Zentrales Spielstand-Management für "Der Pakt der Schlappen-Erben"
 * 
 * Verwaltet den Fortschritt des Spielers in localStorage:
 * - Ermittler-Name
 * - Gelöste Stationen (Pflicht & Bonus) und Besuchsreihenfolge (Zonen-Routing)
 * - Verdächtigen-Scores & getroffene Dialog-Entscheidungen
 * - Getriggerte Weg-Events
 * - Freigeschaltete TB-Codes (HQZJCG, EA99DB, CABGEW, CARGC7)
 * - Gesammelte Beweisstücke (Evidence Board)
 * - Notfall-Reset & Event-Abonnements
 */

import { APP_CONFIG } from '../config.js';

const STORAGE_KEY = APP_CONFIG.storageKeys.savegame;
const PLAYER_KEY = APP_CONFIG.storageKeys.playerName;

/**
 * Standard-Zustand eines neuen Spiels
 */
function createDefaultState() {
  return {
    version: 1,
    playerName: '',
    gameStarted: false,
    startedAt: null,
    lastSaved: null,
    currentView: 'landing',
    activeStationId: null,
    isTestingMode: false,

    // Stationen & Routing
    solvedStations: [],       // Array von Stations-IDs (z.B. ['rathaus', ...])
    stationOrder: [],         // Genaue Reihenfolge der Lösung für Zonen-Auswertung
    bonusSolved: [],          // Gelöste Bonusstationen (z.B. ['saale_schmuggel'])
    suspectsUnlocked: false,  // Ob die 3 Hauptverdächtigen freigeschaltet sind
    
    // Zonen & Scores
    zoneScores: {
      zentrum: 0,
      altstadt: 0,
      neustadt: 0,
      bahnhof: 0,
      saale: 0
    },

    // Verdächtigen-Punkte & Entscheidungen
    suspectScores: {
      herold: 0,
      gipser: 0,
      heiden: 0
    },
    decisions: {},            // { stationId: choiceId }

    // Weg-Events & Inventar
    triggeredEvents: [],      // Array der Event-IDs (z.B. ['event_shadow_sprint'])
    inventory: [],            // Gesammelte Beweisstücke/Items
    assignedEvidence: {},     // { evidenceId: suspectId }
    interrogations: {},       // { suspectId: [solvedStationsCount] }
    
    // Die 4 Trackables (TBs)
    unlockedTrackables: [],   // ['HQZJCG', 'EA99DB', 'CABGEW', 'CARGC7']

    // Gesamtscore
    score: 0,
    solvedAt: null
  };
}

let _currentState = null;
const _subscribers = new Set();

/**
 * Benachrichtigt alle Abonnenten über Zustandsänderungen
 */
function notifySubscribers() {
  const stateCopy = getState();
  _subscribers.forEach(cb => {
    try {
      cb(stateCopy);
    } catch (err) {
      console.error('[State] Fehler in Zustand-Abonnent:', err);
    }
  });
}

/**
 * Lädt den Spielstand aus localStorage oder initialisiert einen neuen
 * @returns {object}
 */
export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Migration / Zusammenführen mit Default-State falls Felder fehlen
      _currentState = Object.assign(createDefaultState(), parsed);
      
      // Fallback: Synchronisiere mit legacy 'playerName' falls vorhanden
      if (!_currentState.playerName) {
        const legacyName = localStorage.getItem(PLAYER_KEY);
        if (legacyName) {
          _currentState.playerName = legacyName.trim();
        }
      }
    } else {
      _currentState = createDefaultState();
      const legacyName = localStorage.getItem(PLAYER_KEY);
      if (legacyName) {
        _currentState.playerName = legacyName.trim();
      }
    }
  } catch (err) {
    console.warn('[State] Fehler beim Parsen des Spielstands, setze zurück:', err);
    _currentState = createDefaultState();
  }

  return getState();
}

/**
 * Gibt eine tiefe Kopie des aktuellen Spielstands zurück (Immutability)
 * @returns {object}
 */
export function getState() {
  if (!_currentState) {
    loadState();
  }
  return JSON.parse(JSON.stringify(_currentState));
}

/**
 * Speichert den aktuellen Spielstand im localStorage
 * @param {object} [partialUpdate] Optionale Teilaktualisierung
 * @returns {object} Der aktualisierte Spielstand
 */
export function saveState(partialUpdate = null) {
  if (!_currentState) {
    loadState();
  }

  if (partialUpdate && typeof partialUpdate === 'object') {
    // Verschachtelte Objekte wie suspectScores oder zoneScores sauber mergen
    if (partialUpdate.suspectScores) {
      partialUpdate.suspectScores = Object.assign({}, _currentState.suspectScores, partialUpdate.suspectScores);
    }
    if (partialUpdate.zoneScores) {
      partialUpdate.zoneScores = Object.assign({}, _currentState.zoneScores, partialUpdate.zoneScores);
    }
    if (partialUpdate.decisions) {
      partialUpdate.decisions = Object.assign({}, _currentState.decisions, partialUpdate.decisions);
    }
    Object.assign(_currentState, partialUpdate);
  }

  _currentState.lastSaved = new Date().toISOString();

  // Auch synchron den Spielernamen separat im alten Key halten
  if (_currentState.playerName) {
    try {
      localStorage.setItem(PLAYER_KEY, _currentState.playerName);
    } catch (e) { /* ignore quota */ }
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_currentState));
  } catch (err) {
    console.error('[State] Fehler beim Speichern im localStorage:', err);
  }

  notifySubscribers();
  return getState();
}

/**
 * Registriert einen Listener für Zustandsänderungen
 * @param {Function} callback (state) => void
 * @returns {Function} Unsubscribe-Funktion
 */
export function subscribe(callback) {
  _subscribers.add(callback);
  return () => _subscribers.delete(callback);
}

/**
 * Setzt den Ermittlernamen
 * @param {string} name
 */
export function setPlayerName(name) {
  const cleanName = (name || '').trim();
  saveState({ playerName: cleanName });
  return cleanName;
}

/**
 * Startet das Spiel offiziell
 */
export function startGame() {
  if (!_currentState) loadState();
  saveState({
    gameStarted: true,
    startedAt: _currentState.startedAt || new Date().toISOString()
  });
}

/**
 * Markiert eine Station als erfolgreich gelöst
 * @param {string} stationId - ID der Station
 * @param {object} [options] - Optionale Details { zone, points, evidenceId, isBonus }
 */
export function markStationSolved(stationId, options = {}) {
  const state = getState();
  const solved = new Set(state.solvedStations);
  const order = [...state.stationOrder];
  const bonus = new Set(state.bonusSolved);
  const inventory = new Set(state.inventory);
  const zoneScores = { ...state.zoneScores };

  let scoreDelta = options.points || 10;

  if (!solved.has(stationId)) {
    solved.add(stationId);
    order.push(stationId);

    if (options.isBonus || stationId.startsWith('saale_') || stationId.startsWith('altstadt_')) {
      bonus.add(stationId);
      scoreDelta = options.points || 15; // Bonusstationen geben 15 Punkte
    }

    if (options.zone && zoneScores[options.zone] !== undefined) {
      zoneScores[options.zone] += 1;
    }

    if (options.evidenceId) {
      inventory.add(options.evidenceId);
    }

    saveState({
      solvedStations: Array.from(solved),
      stationOrder: order,
      bonusSolved: Array.from(bonus),
      inventory: Array.from(inventory),
      zoneScores,
      score: (state.score || 0) + scoreDelta,
      activeStationId: null
    });
  }

  return getState();
}

/**
 * Protokolliert eine Dialog-Entscheidung bei einem Zeugen
 * @param {string} stationId 
 * @param {string} choiceId 
 * @param {string} suspectId - 'herold', 'gipser' oder 'heiden'
 * @param {number} [points=2]
 */
export function recordDecision(stationId, choiceId, suspectId, points = 2) {
  const state = getState();
  const decisions = { ...state.decisions, [stationId]: choiceId };
  const suspectScores = { ...state.suspectScores };

  if (suspectId && suspectScores[suspectId] !== undefined) {
    suspectScores[suspectId] += points;
  }

  saveState({
    decisions,
    suspectScores
  });

  return getState();
}

/**
 * Schaltet die Verdächtigen frei nach dem ersten Event.
 */
export function unlockSuspectsInState() {
  saveState({ suspectsUnlocked: true });
  return getState();
}

/**
 * Fügt einem Verdächtigen Punkte (Prozente) hinzu
 */
export function addSuspectImpact(suspectId, value) {
  const state = getState();
  const suspectScores = { ...state.suspectScores };
  if (suspectId && suspectScores[suspectId] !== undefined) {
    suspectScores[suspectId] += value;
    saveState({ suspectScores });
  }
  return getState();
}

/**
 * Ordnet ein Beweisstück einem Verdächtigen zu
 */
export function assignEvidence(evidenceId, suspectId) {
  const state = getState();
  const assigned = { ...state.assignedEvidence };
  assigned[evidenceId] = suspectId;
  saveState({ assignedEvidence: assigned });
  return getState();
}

/**
 * Protokolliert ein Verhör und die Anzahl gelöster Stationen zu diesem Zeitpunkt
 */
export function recordInterrogation(suspectId, solvedCount) {
  const state = getState();
  const interrogations = { ...state.interrogations };
  if (!interrogations[suspectId]) interrogations[suspectId] = [];
  interrogations[suspectId].push(solvedCount);
  saveState({ interrogations });
  return getState();
}

/**
 * Protokolliert ein getriggertes Weg-Event
 * @param {string} eventId 
 * @param {number} [points=0]
 */
export function recordEventTriggered(eventId, points = 0) {
  const state = getState();
  const events = new Set(state.triggeredEvents);
  if (!events.has(eventId)) {
    events.add(eventId);
    saveState({
      triggeredEvents: Array.from(events),
      score: (state.score || 0) + points
    });
  }
  return getState();
}

/**
 * Schaltet einen der 4 Trackables (TBs) frei
 * @param {string} code - 'HQZJCG', 'EA99DB', 'CABGEW', 'CARGC7'
 */
export function unlockTrackable(code) {
  const cleanCode = (code || '').toUpperCase().trim();
  const state = getState();
  const tbs = new Set(state.unlockedTrackables);
  if (!tbs.has(cleanCode)) {
    tbs.add(cleanCode);
    saveState({
      unlockedTrackables: Array.from(tbs),
      score: (state.score || 0) + 5
    });
  }
  return getState();
}

/**
 * Fügt ein Beweisstück zum Inventar hinzu
 * @param {string} evidenceId 
 */
export function addInventoryItem(evidenceId) {
  const state = getState();
  const inv = new Set(state.inventory);
  if (!inv.has(evidenceId)) {
    inv.add(evidenceId);
    saveState({ inventory: Array.from(inv) });
  }
  return getState();
}

/**
 * Prüft, ob eine Station bereits gelöst ist
 * @param {string} stationId
 * @returns {boolean}
 */
export function isStationSolved(stationId) {
  if (!_currentState) loadState();
  return _currentState.solvedStations.includes(stationId);
}

/**
 * Prüft, ob ein TB freigeschaltet wurde
 * @param {string} code
 * @returns {boolean}
 */
export function isTrackableUnlocked(code) {
  if (!_currentState) loadState();
  return _currentState.unlockedTrackables.includes((code || '').toUpperCase().trim());
}

/**
 * Gibt die Verdächtigen sortiert nach aktuellem Punktestand zurück (für das Finale)
 * @returns {Array<{ id: string, points: number }>}
 */
export function getSuspectRanking() {
  const state = getState();
  const scores = state.suspectScores || { herold: 0, gipser: 0, heiden: 0 };
  return Object.entries(scores)
    .map(([id, points]) => ({ id, points }))
    .sort((a, b) => b.points - a.points);
}

/**
 * Löscht den gesamten Spielstand unwiderruflich (Notfall-Reset)
 */
export function resetState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PLAYER_KEY);
  } catch (err) {
    console.error('[State] Fehler beim Löschen des LocalStorage:', err);
  }
  _currentState = createDefaultState();
  notifySubscribers();
  return getState();
}
