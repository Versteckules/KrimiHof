/**
 * clock.js - Zeitquelle (Echtzeit vs. Debug-Override)
 */

import APP_CONFIG from '../config.js';

/**
 * Gibt die aktuelle Zeit zurück. 
 * Wenn ?debug=1 und ?time=YYYY-MM-DDTHH:mm:ss gesetzt ist, wird diese Zeit verwendet.
 * @returns {Date}
 */
export function getCurrentTime() {
  const urlParams = new URLSearchParams(window.location.search);
  
  if (urlParams.get(APP_CONFIG.debug.paramKey) === APP_CONFIG.debug.enabledValue) {
    const overrideTime = urlParams.get('time');
    if (overrideTime) {
      const parsedTime = new Date(overrideTime);
      if (!isNaN(parsedTime)) {
        return parsedTime;
      } else {
        console.warn(`[clock] Ungültige Debug-Zeit übergeben: "${overrideTime}". Verwende aktuelle Zeit.`);
      }
    }
  }

  return new Date();
}
