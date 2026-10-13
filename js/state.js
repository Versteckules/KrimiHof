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
    isOnsiteTestMode: false,

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
    reassignedEvidence: {},   // { evidenceId: true } - Einmalige Neuzuordnung pro Beweis
    evidenceImpactHistory: {},// { evidenceId: { suspectId, suspectImpact, scoreImpact } }
    interrogations: {},       // { suspectId: [solvedStationsCount] }
    solvedBossGames: [],      // ['safe', 'shredder', 'music-cryptogram']
    
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
 * Berechnet den aktuellen Rang basierend auf den Punkten (Score) und Stationsfortschritt
 * 0-149: Streifenpolizist (Level 1)
 * 150-299: Schnüffler (Level 2)
 * 300-499: Privatdetektiv (Level 3 - schaltet Sherlock-Tipp frei)
 * 500-699: Inspektor (Level 4)
 * 700+: Sherlock Holmes (Level 5 - erfordert min. 8 gelöste Pflichtstationen!)
 */
export function getPlayerRank() {
  const score = _currentState ? _currentState.score || 0 : 0;
  const solvedCount = _currentState && _currentState.solvedStations ? _currentState.solvedStations.length : 0;

  if (score >= 700 && solvedCount >= 8) return { name: "Sherlock Holmes", level: 5 };
  if (score >= 500) return { name: "Inspektor", level: 4 };
  if (score >= 300) return { name: "Privatdetektiv", level: 3 };
  if (score >= 150) return { name: "Schnüffler", level: 2 };
  return { name: "Streifenpolizist", level: 1 };
}

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

      // Auto-Repair: Falls 'foto_gipser_auto' zuvor durch alten Mapping-Bug fälschlicherweise als falsch gewertet wurde
      if (_currentState.assignedEvidence && _currentState.assignedEvidence['foto_gipser_auto'] === 'gipser' && !_currentState._evidenceV2Repaired) {
        _currentState._evidenceV2Repaired = true;
        if (_currentState.suspectScores) {
          _currentState.suspectScores.gipser = (_currentState.suspectScores.gipser || 0) + 22;
        }
        _currentState.score = (_currentState.score || 0) + 5;
        saveState({
          _evidenceV2Repaired: true,
          suspectScores: _currentState.suspectScores,
          score: _currentState.score
        });
      }

      // Die Hauptverdächtigen dürfen AUSSCHLIESSLICH nach Abschluss des Rathauses freigeschaltet sein!
      const rathausSolved = Boolean(_currentState.solvedStations && _currentState.solvedStations.includes('rathaus'));
      if (!rathausSolved) {
        _currentState.suspectsUnlocked = false;
      } else if (!_currentState.suspectsUnlocked) {
        _currentState.suspectsUnlocked = true;
        saveState({ suspectsUnlocked: true });
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
    
    // Verhindere, dass Erfahrungspunkte unter 0 fallen
    if (typeof _currentState.score === 'number' && _currentState.score < 0) {
      _currentState.score = 0;
    }
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

    const isBonus = options.isBonus || 
                    stationId.startsWith('saale_') || 
                    stationId.startsWith('altstadt_') || 
                    stationId.startsWith('versteck_') || 
                    stationId === 'jean_paul';

    if (isBonus) {
      bonus.add(stationId);
      scoreDelta = options.points || 15; // Bonusstationen geben 15 Punkte
    }

    if (options.zone && zoneScores[options.zone] !== undefined) {
      zoneScores[options.zone] += 1;
    }

    if (options.evidenceId) {
      inventory.add(options.evidenceId);
    }

    const shouldUnlockSuspects = (stationId === 'rathaus') || solved.has('rathaus');

    saveState({
      solvedStations: Array.from(solved),
      stationOrder: order,
      bonusSolved: Array.from(bonus),
      inventory: Array.from(inventory),
      zoneScores,
      score: (state.score || 0) + scoreDelta,
      activeStationId: null,
      suspectsUnlocked: shouldUnlockSuspects
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
 * Fügt einem Verdächtigen Punkte (Prozente) hinzu.
 * Berücksichtigt den Kommissarrang: Höhere Ränge erzielen stärkere Verdachtswirkung!
 */
export function addSuspectImpact(suspectId, value) {
  const state = getState();
  const suspectScores = { ...state.suspectScores };
  if (suspectId && suspectScores[suspectId] !== undefined) {
    let effectiveValue = value;
    if (value > 0) {
      const rank = getPlayerRank();
      // Rang 1: 1.0x, Rang 2: 1.25x, Rang 3: 1.5x, Rang 4: 1.75x, Rang 5: 2.0x
      const rankMultiplier = 1 + (Math.max(1, rank.level) - 1) * 0.25;
      effectiveValue = Math.round(value * rankMultiplier);
    }
    suspectScores[suspectId] = Math.max(0, suspectScores[suspectId] + effectiveValue);
    saveState({ suspectScores });
  }
  return getState();
}

/**
 * Ordnet ein Beweisstück einem Verdächtigen zu
 */
export function assignEvidence(evidenceId, suspectId, suspectImpact = 0, scoreImpact = 0) {
  const state = getState();
  const assigned = { ...(state.assignedEvidence || {}) };
  assigned[evidenceId] = suspectId;
  const history = { ...(state.evidenceImpactHistory || {}) };
  history[evidenceId] = { suspectId, suspectImpact, scoreImpact };
  saveState({ assignedEvidence: assigned, evidenceImpactHistory: history });
  return getState();
}

/**
 * Prüft, ob ein Beweisstück noch einmal neu zugeordnet werden darf.
 * Eine Neuzuordnung ist pro Beweisstück maximal 1 Mal erlaubt!
 */
export function canReassignEvidence(evidenceId) {
  const state = getState();
  return !(state.reassignedEvidence && state.reassignedEvidence[evidenceId]);
}

/**
 * Hebt die Zuordnung eines Beweisstücks auf und markiert die einmalige Neuzuordnung als verbraucht.
 * Revertiert den vorherigen Punkte-Einfluss.
 * @returns {boolean} true wenn erfolgreich, false wenn Neuzuordnung bereits verbraucht war.
 */
export function resetEvidenceAssignment(evidenceId) {
  const state = getState();
  if (state.reassignedEvidence && state.reassignedEvidence[evidenceId]) {
    return false; // Bereits einmal verbraucht!
  }

  const reassigned = { ...(state.reassignedEvidence || {}) };
  reassigned[evidenceId] = true;

  const assigned = { ...(state.assignedEvidence || {}) };
  delete assigned[evidenceId];

  const history = { ...(state.evidenceImpactHistory || {}) };
  const prevImpact = history[evidenceId];
  delete history[evidenceId];

  const suspectScores = { ...(state.suspectScores || {}) };
  let newScore = state.score || 0;

  if (prevImpact) {
    if (prevImpact.suspectId && prevImpact.suspectImpact && suspectScores[prevImpact.suspectId] !== undefined) {
      suspectScores[prevImpact.suspectId] = Math.max(0, suspectScores[prevImpact.suspectId] - prevImpact.suspectImpact);
    }
    if (prevImpact.scoreImpact) {
      newScore = Math.max(0, newScore - prevImpact.scoreImpact);
    }
  }

  saveState({
    reassignedEvidence: reassigned,
    assignedEvidence: assigned,
    evidenceImpactHistory: history,
    suspectScores,
    score: newScore
  });

  return true;
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
 * Prüft, ob ein Hauptverdächtiger verhört werden darf
 * - Maximal 2 Verhöre pro Verdächtigem
 * - Nach dem 1. Verhör müssen mindestens 3 weitere Stationen gelöst werden
 * @param {string} suspectId ('herold' | 'gipser' | 'heiden')
 * @returns {{ canInterrogate: boolean, reason: string, count: number, remainingStations: number }}
 */
export function getInterrogationStatus(suspectId) {
  const state = getState();
  const history = (state.interrogations && state.interrogations[suspectId]) || [];
  const currentSolved = state.solvedStations ? state.solvedStations.length : 0;
  const count = history.length;

  if (count >= 2) {
    return {
      canInterrogate: false,
      reason: 'Aussage verweigert (Max. 2 Verhöre)',
      count,
      remainingStations: 0
    };
  }

  if (count === 1) {
    const lastSolved = history[0];
    const needed = lastSolved + 3;
    // Im Endgame (alle 12 Pflichtstationen gelöst) entfällt die Sperre für das 2. Verhör,
    // da keine weiteren Pflichtstationen mehr gelöst werden können.
    const isEndgame = state.solvedStations && state.solvedStations.filter(
      sid => !(sid.startsWith('saale_') || sid.startsWith('altstadt_') || sid.startsWith('versteck_') || sid === 'jean_paul')
    ).length >= 12;

    if (currentSolved < needed && !isEndgame) {
      const remaining = needed - currentSolved;
      return {
        canInterrogate: false,
        reason: `Noch ${remaining} Station(en) lösen`,
        count,
        remainingStations: remaining
      };
    }
  }

  return {
    canInterrogate: true,
    reason: count === 0 ? 'Erstverhör bereit' : 'Zweitverhör bereit',
    count,
    remainingStations: 0
  };
}

/**
 * Protokolliert ein gelöstes Boss-Minispiel (verhindert mehrfaches Belohnungs-Farming)
 * @param {string} gameKey ('safe' | 'shredder' | 'music-cryptogram')
 */
export function recordBossGameSolved(gameKey) {
  const state = getState();
  const solved = new Set(state.solvedBossGames || []);
  if (!solved.has(gameKey)) {
    solved.add(gameKey);
    saveState({ solvedBossGames: Array.from(solved) });
  }
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
/**
 * Fügt dem Gesamtscore direkt Punkte hinzu oder zieht sie ab.
 */
export function addScore(points) {
  const state = getState();
  const newScore = Math.max(0, (state.score || 0) + points);
  saveState({ score: newScore });
}

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
