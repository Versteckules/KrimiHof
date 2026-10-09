/**
 * debug.js - Home-Office Debug-Panel (AP5)
 * 
 * Wird nur aktiviert, wenn ?debug=1 in der URL steht.
 */

import { getConfig, getStations, getEvents } from './config-loader.js';
import { markStationSolved, unlockTrackable, getState, recordEventTriggered } from './state.js';
import { getCurrentTime } from './clock.js';
import { setFakePosition } from './geo.js';

export function initDebug() {
  const urlParams = new URLSearchParams(window.location.search);
  const config = getConfig();
  
  if (urlParams.get(config.debug.paramKey) !== config.debug.enabledValue) {
    return; // Debug-Modus nicht aktiv
  }

  console.warn("🔧 DEBUG-MODUS AKTIV");

  // CSS injecten
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'css/debug.css';
  document.head.appendChild(link);

  // Panel injecten
  const panel = document.createElement('div');
  panel.id = 'debug-panel';
  
  const stations = getStations() || [];
  const events = getEvents() || [];
  const trackables = config.gameplay.trackables;
  const gadgets = [
    'polaroid', 'uv-light', 'scratch', 'fake-call', 'cryptowheel',
    'ambigram', 'coaster', 'briefcase', 'wiretap', 'letter',
    'laser', 'mugshot', 'stealth', 'dice', 'time-slider',
    'whisper', 'scanner'
  ]; // Laut Konzept 17 Gadgets

  const formatDateTimeLocal = (date) => {
    const pad = n => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const currentTimeStr = formatDateTimeLocal(getCurrentTime());

  panel.innerHTML = `
    <div class="debug-header" id="debug-header">
      <span>🛠️ Home-Office Debug-Panel</span>
      <span id="debug-toggle">▼</span>
    </div>
    <div class="debug-grid" id="debug-content">
      
      <!-- Zeit & System -->
      <div class="debug-section">
        <h4>Zeit-Override (AP4/AP5)</h4>
        <div class="debug-control">
          <input type="datetime-local" id="debug-time-input" class="debug-input" value="${currentTimeStr}">
          <button id="btn-debug-time" class="debug-btn">Set</button>
        </div>
        <div class="debug-control">
          <button id="btn-debug-clear-time" class="debug-btn" style="width:100%">Clear Override & Reload</button>
        </div>
      </div>

      <!-- Teleport (Fake-GPS) -->
      <div class="debug-section">
        <h4>Teleport (AP7)</h4>
        <div class="debug-control">
          <select id="debug-teleport-select" class="debug-select">
            <option value="">-- Station wählen --</option>
            ${stations.map(s => `<option value="${s.id}">${s.name} (${s.id})</option>`).join('')}
          </select>
          <button id="btn-debug-teleport" class="debug-btn">Go</button>
        </div>
      </div>

      <!-- Instant-Solve -->
      <div class="debug-section">
        <h4>Instant-Solve (AP8)</h4>
        <div class="debug-control">
          <select id="debug-solve-select" class="debug-select">
            <option value="">-- Station wählen --</option>
            ${stations.map(s => `<option value="${s.id}">${s.id}</option>`).join('')}
          </select>
          <button id="btn-debug-solve" class="debug-btn">Solve</button>
        </div>
      </div>

      <!-- Sonar Test -->
      <div class="debug-section">
        <h4>Sonar Test (AP7)</h4>
        <div class="debug-control" style="display: flex; gap: 4px;">
          <button class="debug-btn btn-sonar" data-dist="100">100m</button>
          <button class="debug-btn btn-sonar" data-dist="50">50m</button>
          <button class="debug-btn btn-sonar" data-dist="20">20m</button>
          <button class="debug-btn btn-sonar" data-dist="off">Off</button>
        </div>
      </div>

      <!-- Gadget Starter -->
      <div class="debug-section">
        <h4>Gadgets (AP9)</h4>
        <div class="debug-control">
          <select id="debug-gadget-select" class="debug-select">
            <option value="">-- Gadget wählen --</option>
            ${gadgets.map(g => `<option value="${g}">${g}</option>`).join('')}
          </select>
          <button id="btn-debug-gadget" class="debug-btn">Start</button>
        </div>
      </div>

      <!-- Event Trigger -->
      <div class="debug-section">
        <h4>Weg-Events (AP9)</h4>
        <div class="debug-control">
          <select id="debug-event-select" class="debug-select">
            <option value="">-- Event wählen --</option>
            ${events.map(e => `<option value="${e.id}">${e.title}</option>`).join('')}
          </select>
          <button id="btn-debug-event" class="debug-btn">Trigger</button>
        </div>
      </div>

      <!-- Anruf Simulator -->
      <div class="debug-section">
        <h4>Telefon-Simulation</h4>
        <div class="debug-control" style="display:flex; gap:4px; flex-wrap:wrap;">
          <button class="debug-btn btn-sim-call" data-event="event_call_herold">Herold</button>
          <button class="debug-btn btn-sim-call" data-event="event_call_gipser">Gipser</button>
          <button class="debug-btn btn-sim-call" data-event="event_call_heiden">Heiden</button>
        </div>
      </div>

      <!-- Trackables -->
      <div class="debug-section">
        <h4>TB-Fund Simulation</h4>
        <div class="debug-control">
          <select id="debug-tb-select" class="debug-select">
            <option value="">-- TB wählen --</option>
            ${trackables.map(tb => `<option value="${tb}">${tb}</option>`).join('')}
          </select>
          <button id="btn-debug-tb" class="debug-btn">Finden</button>
        </div>
      </div>

      <!-- Easter Eggs -->
      <div class="debug-section">
        <h4>Easter Eggs (AP14)</h4>
        <div class="debug-control">
          <button id="btn-debug-egg-compass" class="debug-btn" style="flex:1">Kompass-Rundlauf</button>
          <button id="btn-debug-egg-bell" class="debug-btn" style="flex:1">Mitternachts-Glocke</button>
        </div>
      </div>

      <!-- Outro / Epilog Vorschau -->
      <div class="debug-section">
        <h4>Outro / Epilog Vorschau</h4>
        <div class="debug-control" style="display:flex; flex-direction:column; gap:5px;">
          <button id="btn-debug-outro-win" class="debug-btn" style="text-align:left;">🏆 Sieg (&gt;= 75% Hinter Gittern)</button>
          <button id="btn-debug-outro-insufficient" class="debug-btn" style="text-align:left;">⚖️ Freispruch (&lt; 75% Spuren verwischt)</button>
          <button id="btn-debug-outro-fail" class="debug-btn" style="text-align:left;">❌ Fataler Irrtum (Falscher Täter)</button>
        </div>
      </div>

    </div>
  `;

  document.body.appendChild(panel);

  // --- Event Listeners ---

  // Toggle Minimize
  const header = document.getElementById('debug-header');
  const toggleIcon = document.getElementById('debug-toggle');
  header.addEventListener('click', () => {
    panel.classList.toggle('minimized');
    toggleIcon.textContent = panel.classList.contains('minimized') ? '▲' : '▼';
  });

  // Zeit-Override
  document.getElementById('btn-debug-time').addEventListener('click', () => {
    const val = document.getElementById('debug-time-input').value;
    if (val) {
      const u = new URL(window.location.href);
      u.searchParams.set('debug', '1');
      u.searchParams.set('time', val);
      window.location.href = u.toString();
    }
  });

  document.getElementById('btn-debug-clear-time').addEventListener('click', () => {
    const u = new URL(window.location.href);
    u.searchParams.delete('time');
    window.location.href = u.toString();
  });

  // Teleport (AP7)
  document.getElementById('btn-debug-teleport').addEventListener('click', () => {
    const sid = document.getElementById('debug-teleport-select').value;
    if (sid) {
      const st = stations.find(s => s.id === sid);
      if (st && st.coordsDecimal) {
        setFakePosition(st.coordsDecimal.lat, st.coordsDecimal.lng);
        console.log(`[Debug] Teleport zu ${st.name} (${st.coordsDecimal.lat}, ${st.coordsDecimal.lng})`);
        alert(`Teleport zu ${st.name} erfolgreich!`);
      }
    } else {
      setFakePosition(null, null);
      console.log(`[Debug] Teleport gelöscht (GPS wieder aktiv)`);
      alert(`Teleport gelöscht. Reales GPS aktiv.`);
    }
  });

  // Instant-Solve
  document.getElementById('btn-debug-solve').addEventListener('click', () => {
    const sid = document.getElementById('debug-solve-select').value;
    if (sid) {
      markStationSolved(sid, { points: 10, isBonus: sid.startsWith('saale_') || sid.startsWith('altstadt_') });
      console.log(`[Debug] Station ${sid} als gelöst markiert.`);
      alert(`Station ${sid} gelöst! Neuer Punktestand: ${getState().score}`);
    }
  });

  // Sonar (AP7)
  document.querySelectorAll('.btn-sonar').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const distRaw = e.target.dataset.dist;
      if (distRaw === 'off') {
        setFakePosition(null, null);
        return;
      }
      
      const dist = parseInt(distRaw, 10);
      const { getActiveTargetId } = await import('./ui/map.js');
      const targetId = getActiveTargetId();
      if (!targetId) {
        alert("Bitte zuerst eine Station auf der Karte anvisieren (Klick auf Pin).");
        return;
      }
      const st = stations.find(s => s.id === targetId);
      if (st && st.coordsDecimal) {
        const latOffset = dist / 111111;
        setFakePosition(st.coordsDecimal.lat + latOffset, st.coordsDecimal.lng);
        console.log('[Debug] Sonar-Test: Fake-GPS gesetzt auf ' + dist + 'm Entfernung zu ' + st.name);
      }
    });
  });

  // Gadget (AP9)
  document.getElementById('btn-debug-gadget').addEventListener('click', async () => {
    const g = document.getElementById('debug-gadget-select').value;
    if (g) {
      const { startGadget } = await import('./ui/gadgets/gadget-manager.js');
      startGadget(g, 'test-station');
    }
  });

  // Event (AP9)
  document.getElementById('btn-debug-event').addEventListener('click', async () => {
    const eid = document.getElementById('debug-event-select').value;
    if (eid) {
      const { triggerStoryEventById } = await import('./ui/street-events.js');
      triggerStoryEventById(eid);
    }
  });

  // Phone Call Simulation
  document.querySelectorAll('.btn-sim-call').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const eid = e.target.dataset.event;
      if (eid) {
        const { triggerStoryEventById } = await import('./ui/street-events.js');
        triggerStoryEventById(eid);
      }
    });
  });

  // TB
  document.getElementById('btn-debug-tb').addEventListener('click', () => {
    const tb = document.getElementById('debug-tb-select').value;
    if (tb) {
      unlockTrackable(tb);
      console.log(`[Debug] TB ${tb} freigeschaltet!`);
      alert(`Trackable ${tb} freigeschaltet!`);
    }
  });

  // Easter Eggs
  document.getElementById('btn-debug-egg-compass').addEventListener('click', () => {
    console.log('[Debug] Triggere Easter Egg: Kompass-Rundlauf');
    document.dispatchEvent(new CustomEvent('easterEggCompass'));
  });
  
  document.getElementById('btn-debug-egg-bell').addEventListener('click', () => {
    console.log('[Debug] Triggere Easter Egg: Mitternachts-Glockenschlag');
    document.dispatchEvent(new CustomEvent('easterEggBell'));
  });

  // Outro Previews
  document.getElementById('btn-debug-outro-win').addEventListener('click', async () => {
    const { handleAccusation } = await import('./ui/final.js');
    const { saveState } = await import('./state.js');
    saveState({ suspectScores: { herold: 140, gipser: 10, heiden: 10 }, score: 220 });
    handleAccusation('herold');
  });

  document.getElementById('btn-debug-outro-insufficient').addEventListener('click', async () => {
    const { handleAccusation } = await import('./ui/final.js');
    const { saveState } = await import('./state.js');
    saveState({ suspectScores: { herold: 35, gipser: 25, heiden: 20 }, score: 80 });
    handleAccusation('herold');
  });

  document.getElementById('btn-debug-outro-fail').addEventListener('click', async () => {
    const { handleAccusation } = await import('./ui/final.js');
    const { saveState } = await import('./state.js');
    saveState({ suspectScores: { herold: 80, gipser: 20, heiden: 10 }, score: 150 });
    handleAccusation('heiden');
  });
}
