/**
 * gadget-manager.js - Zentraler Hub für die 17 Gadgets (AP9)
 */

import { onStationComplete } from '../station.js';

export function startGadget(gadgetId, stationId) {
  console.log(`[AP9] Gadget Manager starte: ${gadgetId}`);
  
  // Create a quick overlay to simulate gadget interaction for all 17 gadgets
  let overlay = document.getElementById('gadget-mock-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'gadget-mock-overlay';
    overlay.style = "position:fixed; top:0; left:0; right:0; bottom:0; background: rgba(10, 14, 23, 0.98); z-index: 10000; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff; font-family:var(--font-mono); text-align:center; padding:20px;";
    document.body.appendChild(overlay);
  }
  
  overlay.innerHTML = `
    <h2 style="color:var(--color-amber-glow); margin-bottom: 20px; font-size:2rem;">🔌 ${gadgetId.toUpperCase()}</h2>
    <div style="width:100%; max-width:400px; height:200px; border:2px dashed var(--color-glass-border); border-radius:10px; display:flex; align-items:center; justify-content:center; margin-bottom:30px;">
      <p style="color:var(--color-text-muted); font-size:0.9rem;">(Gadget / Minigame Simulation)</p>
    </div>
    <button id="btn-mock-gadget-success" class="btn-primary" style="margin-bottom:15px; width:100%; max-width:300px;">Gadget erfolgreich bedient</button>
    <button id="btn-mock-gadget-cancel" class="btn-secondary" style="width:100%; max-width:300px;">Abbrechen</button>
  `;
  overlay.style.display = 'flex';

  document.getElementById('btn-mock-gadget-success').onclick = () => {
    overlay.style.display = 'none';
    // Danach startet normalerweise die Scene/Dialog. Für AP8/9 rufen wir direkt den Abschluss auf.
    onStationComplete(stationId);
  };
  
  document.getElementById('btn-mock-gadget-cancel').onclick = () => {
    overlay.style.display = 'none';
  };
}
