/**
 * coords.js - Koordinaten-Engine für "Der Pakt der Schlappen-Erben"
 * 
 * Verarbeitet Geocaching-Koordinaten im Format:
 * "N 50° 19.784 E 011° 42.485"
 * sowie alternative Schreibweisen, Berechnungen (Haversine, Bearing) und Geofencing.
 */

/**
 * Wandelt Grad + Dezimalminuten in Dezimalgrad um.
 * @param {string} hemisphere - 'N', 'S', 'E' oder 'W'
 * @param {number|string} degrees - Ganzzahlige Grad
 * @param {number|string} minutes - Dezimalminuten (z.B. 19.784)
 * @returns {number} Dezimalgrad
 */
export function dmmToDecimal(hemisphere, degrees, minutes) {
  const deg = Math.abs(parseFloat(degrees));
  const min = Math.abs(parseFloat(String(minutes).replace(',', '.')));
  let decimal = deg + (min / 60);
  const hemi = String(hemisphere).toUpperCase();
  if (hemi === 'S' || hemi === 'W') {
    decimal = -decimal;
  }
  return decimal;
}

/**
 * Wandelt Dezimalgrad in Grad und Dezimalminuten um.
 * @param {number} decimal - Dezimalgrad
 * @param {boolean} isLongitude - True falls Längengrad (3-stellige Grad-Formatierung)
 * @returns {{ hemisphere: string, degrees: number, minutes: number, formatted: string }}
 */
export function decimalToDMM(decimal, isLongitude = false) {
  const isNegative = decimal < 0;
  const absDec = Math.abs(decimal);
  const degrees = Math.floor(absDec);
  const minutes = (absDec - degrees) * 60;
  
  // Runden auf 3 Nachkommastellen (Geocaching-Standard Milliminuten)
  const roundedMin = Math.round(minutes * 1000) / 1000;
  
  let hemisphere;
  if (isLongitude) {
    hemisphere = isNegative ? 'W' : 'E';
  } else {
    hemisphere = isNegative ? 'S' : 'N';
  }

  const degPadded = isLongitude
    ? String(degrees).padStart(3, '0')
    : String(degrees).padStart(2, '0');
  
  // Format MM.MMM (immer 2 Ziffern vor dem Komma, 3 danach)
  const minParts = roundedMin.toFixed(3).split('.');
  const minIntPadded = minParts[0].padStart(2, '0');
  const minFormatted = `${minIntPadded}.${minParts[1]}`;

  return {
    hemisphere,
    degrees,
    minutes: roundedMin,
    formatted: `${hemisphere} ${degPadded}° ${minFormatted}`
  };
}

/**
 * Parst einen Geocaching-Koordinaten-String in ein LatLng-Objekt.
 * Unterstützt Formate wie:
 * - "N 50° 19.784 E 011° 42.485"
 * - "N 50° 19.784' E 011° 42.485'"
 * - "N 50 19.784 E 011 42.485"
 * - "N 50° 19,784 E 011° 42,485" (deutsches Komma)
 * - "50.329733, 11.708083" (Dezimalgrad Fallback)
 * 
 * @param {string} coordStr - Der Koordinaten-String
 * @returns {{ lat: number, lng: number } | null}
 */
export function parseCoords(coordStr) {
  if (!coordStr || typeof coordStr !== 'string') {
    return null;
  }

  const clean = coordStr.trim();

  // 1. DMM Regex Match
  // Gruppe 1: Hemi Lat (N/S)
  // Gruppe 2: Grad Lat
  // Gruppe 3: Minuten Lat
  // Gruppe 4: Hemi Lng (E/O/W)
  // Gruppe 5: Grad Lng
  // Gruppe 6: Minuten Lng
  const dmmRegex = /([NS])\s*(\d{1,2})[^0-9.,]+(\d{1,2}(?:[.,]\d+)?)[^A-Z0-9]+([EOW])\s*(\d{1,3})[^0-9.,]+(\d{1,2}(?:[.,]\d+)?)/i;
  const match = clean.match(dmmRegex);

  if (match) {
    const latHemi = match[1].toUpperCase();
    const latDeg = parseInt(match[2], 10);
    const latMin = parseFloat(match[3].replace(',', '.'));

    let lngHemi = match[4].toUpperCase();
    if (lngHemi === 'O') lngHemi = 'E'; // Deutsch "Ost" -> "East"
    const lngDeg = parseInt(match[5], 10);
    const lngMin = parseFloat(match[6].replace(',', '.'));

    const lat = dmmToDecimal(latHemi, latDeg, latMin);
    const lng = dmmToDecimal(lngHemi, lngDeg, lngMin);

    return {
      lat: Math.round(lat * 1e6) / 1e6,
      lng: Math.round(lng * 1e6) / 1e6
    };
  }

  // 2. Dezimalgrad Fallback: "50.329733, 11.708083"
  const decRegex = /^([-+]?\d{1,2}(?:[.,]\d+)?)\s*[,;\s]\s*([-+]?\d{1,3}(?:[.,]\d+)?)$/;
  const decMatch = clean.match(decRegex);
  if (decMatch) {
    const lat = parseFloat(decMatch[1].replace(',', '.'));
    const lng = parseFloat(decMatch[2].replace(',', '.'));
    if (!isNaN(lat) && !isNaN(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
      return {
        lat: Math.round(lat * 1e6) / 1e6,
        lng: Math.round(lng * 1e6) / 1e6
      };
    }
  }

  return null;
}

/**
 * Formatiert Dezimalgrad in das kanonische DMM-Format:
 * "N 50° 19.784 E 011° 42.485"
 * 
 * @param {number|{lat: number, lng: number}} latOrObj
 * @param {number} [lngParam]
 * @returns {string}
 */
export function formatDMM(latOrObj, lngParam) {
  let lat, lng;
  if (typeof latOrObj === 'object' && latOrObj !== null) {
    lat = latOrObj.lat;
    lng = latOrObj.lng;
  } else {
    lat = latOrObj;
    lng = lngParam;
  }

  if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
    throw new Error(`Ungültige Koordinaten für formatDMM: lat=${lat}, lng=${lng}`);
  }

  const latDMM = decimalToDMM(lat, false);
  const lngDMM = decimalToDMM(lng, true);

  return `${latDMM.formatted} ${lngDMM.formatted}`;
}

/**
 * Normalisiert ein beliebiges Koordinaten-Format in ein { lat, lng } Objekt.
 * Akzeptiert:
 * - String: "N 50° 19.784 E 011° 42.485"
 * - Objekt: { lat: 50.32, lng: 11.91 } oder { latitude, longitude }
 * - Array: [lat, lng]
 * 
 * @param {any} input
 * @returns {{ lat: number, lng: number } | null}
 */
export function toLatLng(input) {
  if (!input) return null;

  if (typeof input === 'string') {
    return parseCoords(input);
  }

  if (Array.isArray(input) && input.length >= 2) {
    const lat = Number(input[0]);
    const lng = Number(input[1]);
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  }

  if (typeof input === 'object') {
    const lat = Number(input.lat ?? input.latitude);
    const lng = Number(input.lng ?? input.longitude ?? input.lon);
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  }

  return null;
}

/**
 * Prüft, ob ein Koordinaten-String syntaktisch und geographisch gültig ist.
 * @param {string} coordStr
 * @returns {boolean}
 */
export function isValidCoords(coordStr) {
  const parsed = parseCoords(coordStr);
  if (!parsed) return false;
  return (
    parsed.lat >= -90 && parsed.lat <= 90 &&
    parsed.lng >= -180 && parsed.lng <= 180
  );
}

/**
 * Berechnet die Haversine-Distanz zwischen zwei Koordinaten in Metern.
 * 
 * @param {any} coordA - Erstes Koordinatenobjekt oder DMM-String
 * @param {any} coordB - Zweites Koordinatenobjekt oder DMM-String
 * @returns {number} Distanz in Metern (gerundet auf 0.1m)
 */
export function calculateDistance(coordA, coordB) {
  const pA = toLatLng(coordA);
  const pB = toLatLng(coordB);

  if (!pA || !pB) {
    throw new Error('Ungültige Koordinaten für calculateDistance');
  }

  const R = 6371000; // Erdradius in Metern
  const toRad = Math.PI / 180;

  const phi1 = pA.lat * toRad;
  const phi2 = pB.lat * toRad;
  const deltaPhi = (pB.lat - pA.lat) * toRad;
  const deltaLambda = (pB.lng - pA.lng) * toRad;

  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
            
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10;
}

/**
 * Berechnet die anfängliche Kompass-Peilung (Initial Bearing / Azimut) in Grad (0° bis 360°).
 * 0° = Nord, 90° = Ost, 180° = Süd, 270° = West.
 * 
 * @param {any} fromCoord - Startkoordinate
 * @param {any} toCoord - Zielkoordinate
 * @returns {number} Peilung in Grad (0..359.9)
 */
export function calculateBearing(fromCoord, toCoord) {
  const pA = toLatLng(fromCoord);
  const pB = toLatLng(toCoord);

  if (!pA || !pB) {
    throw new Error('Ungültige Koordinaten für calculateBearing');
  }

  const toRad = Math.PI / 180;
  const toDeg = 180 / Math.PI;

  const phi1 = pA.lat * toRad;
  const phi2 = pB.lat * toRad;
  const deltaLambda = (pB.lng - pA.lng) * toRad;

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) -
            Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

  const theta = Math.atan2(y, x);
  const bearing = (theta * toDeg + 360) % 360;

  return Math.round(bearing * 10) / 10;
}

/**
 * Berechnet, ob sich eine Position innerhalb des GPS-Geofence einer Station befindet.
 * Formel gemäß KONZEPT.md (Abschnitt 1 #15):
 * Distanz - min(Genauigkeit, 15m) <= Radius (Standard 20m)
 * 
 * @param {any} currentPosition - Aktuelle Position
 * @param {any} stationCoords - Zielkoordinaten der Station
 * @param {number} [radius=20] - Radius in Metern (Default 20m)
 * @param {number} [accuracy=0] - GPS-Genauigkeit in Metern (Default 0)
 * @returns {{ inside: boolean, rawDistance: number, effectiveDistance: number }}
 */
export function checkGeofence(currentPosition, stationCoords, radius = 20, accuracy = 0) {
  const rawDistance = calculateDistance(currentPosition, stationCoords);
  const accTolerance = Math.min(Math.max(0, accuracy), 15);
  const effectiveDistance = Math.max(0, rawDistance - accTolerance);
  const inside = effectiveDistance <= radius;

  return {
    inside,
    rawDistance,
    effectiveDistance: Math.round(effectiveDistance * 10) / 10
  };
}
