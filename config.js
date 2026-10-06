/**
 * config.js - Zentrale Konfiguration für "Der Pakt der Schlappen-Erben"
 * 
 * Enthält alle verbindlichen Spiel-, Geo- und System-Parameter gemäß KONZEPT.md.
 */

export const APP_CONFIG = {
  // Metadaten
  title: 'Der Pakt der Schlappen-Erben',
  subtitle: 'Ein Nacht-Krimi in Hof (Saale)',
  author: 'made by Versteckules',
  authorAvatar: 'assets/avatar.jpg',
  version: '1.0.0',

  // Start- und Referenz-Koordinaten: Hof (Saale) Rathaus Ludwigstraße
  referenceLocation: {
    name: 'Rathaus Hof (Saale)',
    dmm: 'N 50° 19.182 E 011° 55.074',
    lat: 50.319700,
    lng: 11.917900
  },

  // GPS- & Geofencing-Parameter
  geo: {
    standardRadiusMeters: 20,       // Radius für erfolgreichen Geofence-Treffer
    maxAccuracyToleranceMeters: 15, // Max. abziehbare GPS-Ungenauigkeit
    sonarTriggerDistanceMeters: 100, // Ab hier startet akustischer/haptischer Sonar-Puls
    gpsTimeoutMs: 15000,
    maximumAgeMs: 5000,
    highAccuracy: true
  },

  // Zeitsperre- & Nacht-Bedingungen (SunCalc)
  timelock: {
    earliestStartHour: 18,          // max(18:00, Sonnenuntergang + 30 min)
    sunsetOffsetMinutes: 30,        // Freigabe = Sonnenuntergang + 30 Minuten
    endAtSunrise: true,             // Spiel endet bei Sonnenaufgang
    // Referenz-Koordinaten für die Sonnenstands-Berechnung (Hof)
    sunCalcCoords: {
      lat: 50.3197,
      lng: 11.9178
    }
  },

  // Spielmechanik & Balancing
  gameplay: {
    mandatoryStationCount: 12,      // 12 Pflichtstationen (Rathaus als Start + 11 freie)
    bonusStationCount: 2,           // 2 optionale Side-Quests (+15 Pkt je Bonus)
    maxWrongAnswersBeforeHint: 3,   // Hilfshinweis nach 3 Fehlversuchen
    batteryDangerThreshold: 0.20,   // Low-Battery Jump-Event bei < 20%
    suspects: [
      { id: 'herold', name: 'Valentin Herold', role: 'Antiquitätenhändler' },
      { id: 'gipser', name: 'Katharina von Gipser', role: 'Kommunalpolitikerin' },
      { id: 'heiden', name: 'Severin Heiden', role: 'Domorganist' }
    ],
    // 4 Reale Trackables (TBs) zum Freischalten
    trackables: ['HQZJCG', 'EA99DB', 'CABGEW', 'CARGC7']
  },

  // Pfade zu den statischen Daten-Dateien
  paths: {
    stations: 'data/stations.json',
    story: 'data/story.json',
    events: 'data/events.json',
    finalCoords: 'data/final.json'
  },

  // Lokaler Speicher (LocalStorage Keys)
  storageKeys: {
    savegame: 'krimi_state_v1',
    playerName: 'playerName',
    audioMuted: 'krimi_audio_muted',
    redLightMode: 'krimi_redlight_mode'
  },

  // Debug-Modus (?debug=1)
  debug: {
    paramKey: 'debug',
    enabledValue: '1'
  }
};

export default APP_CONFIG;
