/**
 * timelock.js - Berechnung Freigabe-/Endzeiten (SunCalc)
 */
import APP_CONFIG from '../config.js';
import { getCurrentTime } from './clock.js';


/**
 * Berechnet Freigabe und Ende für den "Spieltag" (Abend) eines gegebenen Datums.
 * @param {Date} date 
 * @returns {object} { startTime, endTime }
 */
export function getTimelockInfoForDate(date) {
    const { lat, lng } = APP_CONFIG.timelock.sunCalcCoords;
    const { sunsetOffsetMinutes, earliestStartHour, endAtSunrise } = APP_CONFIG.timelock;

    // Sonnenzeiten für diesen Tag
    const times = SunCalc.getTimes(date, lat, lng);
    const sunset = times.sunset;

    // Minimum Startzeit (z.B. 18:00 Uhr am selben Tag)
    const minStartTime = new Date(date);
    minStartTime.setHours(earliestStartHour, 0, 0, 0);

    // Sonnenuntergang + Offset
    const sunsetOffsetTime = new Date(sunset.getTime() + sunsetOffsetMinutes * 60000);

    // Freigabe ist das spätere von beiden
    const startTime = new Date(Math.max(minStartTime.getTime(), sunsetOffsetTime.getTime()));
    
    // Ende am Sonnenaufgang des nächsten Tages
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDayTimes = SunCalc.getTimes(nextDay, lat, lng);
    const endTime = endAtSunrise ? nextDayTimes.sunrise : null;

    return { startTime, endTime };
}

/**
 * Prüft den aktuellen Status und gibt Zeiten zurück.
 */
export function getCurrentTimelockStatus() {
    const now = getCurrentTime();
    
    // Wir ordnen die aktuelle Zeit einem "Spieltag" zu.
    // Ein Spieltag beginnt mittags und geht bis zum nächsten Morgen.
    let playDay = new Date(now);
    if (now.getHours() < 12) {
        playDay.setDate(playDay.getDate() - 1);
    }
    // Setzen auf 12:00, um sicher zu sein, dass SunCalc für den richtigen Tag rechnet
    playDay.setHours(12, 0, 0, 0);

    const { startTime, endTime } = getTimelockInfoForDate(playDay);

    const isPlayable = now.getTime() >= startTime.getTime() && (!endTime || now.getTime() <= endTime.getTime());

    let nextStartTime = startTime;
    // Wenn nicht spielbar und bereits abgelaufen, nimm den nächsten Abend
    if (!isPlayable && endTime && now.getTime() > endTime.getTime()) {
        const nextDay = new Date(playDay);
        nextDay.setDate(nextDay.getDate() + 1);
        nextStartTime = getTimelockInfoForDate(nextDay).startTime;
    }

    return {
        isPlayable,
        startTime,
        endTime,
        nextStartTime,
        now
    };
}

/**
 * Gibt eine Vorschau für die nächsten 7 Tage (Abende) zurück.
 */
export function getNext7DaysPreview() {
    const preview = [];
    const now = getCurrentTime();
    
    let startDay = new Date(now);
    if (now.getHours() >= 12) {
        // startDay bleibt heute
    } else {
        // Es ist früh morgens, die Vorschau sollte den HEUTIGEN Abend als erstes zeigen,
        // also startDay bleibt heute.
    }
    startDay.setHours(12, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
        const d = new Date(startDay);
        d.setDate(d.getDate() + i);
        
        const { startTime } = getTimelockInfoForDate(d);
        preview.push({
            date: d, // Das Datum des Abends
            startTime
        });
    }
    return preview;
}
