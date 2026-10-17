import { addSuspectImpact } from '../../state.js';
import { showNoirAlert } from '../../main.js';
import { playSound } from '../../audio.js';

export function runGadget(stationId, onComplete, onCancel) {
  const overlay = document.createElement('div');
  overlay.id = 'gadget-fullscreen-overlay';
  overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:radial-gradient(circle at center, #262933 0%, #0a0d14 100%); z-index:9999; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:16px; box-sizing:border-box; color:white; font-family:sans-serif; text-align:center; user-select:none;';

  overlay.innerHTML = `
    <button id="btn-safe-cancel" style="position:absolute; top:calc(12px + env(safe-area-inset-top, 0px)); left:calc(14px + env(safe-area-inset-left, 0px)); background:rgba(0,0,0,0.5); border:1px solid #555; color:#ddd; font-size:1.6rem; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; z-index:10; line-height:1;" title="Schließen">&times;</button>
    <div style="font-size:2.2rem; margin-bottom:4px;">🔐</div>
    <h2 style="color:var(--color-amber-glow, #d4af37); margin:0 0 6px 0; font-family:serif; font-size:1.6rem;">Der Historische Tresor</h2>
    <div style="background:rgba(212,175,55,0.1); border:1px solid rgba(212,175,55,0.3); border-radius:6px; padding:6px 14px; max-width:380px; margin-bottom:12px; font-size:0.85rem; color:#f5d79e; line-height:1.35;">
      📜 <strong>Hinweis:</strong> „Das Schicksalsjahr des großen Brands (<strong>1823</strong>). Der Riegel weicht den beiden historischen Zahlen: <strong>18 &ndash; 23</strong>.“
    </div>
    
    <!-- Safe Dial Wheel Container with Direct Drag / Touch Support -->
    <div id="safe-dial-container" style="position:relative; width:220px; height:220px; margin:10px 0; border-radius:50%; border:10px solid #444; background:radial-gradient(circle, #2a2a2a 0%, #111 85%); display:flex; align-items:center; justify-content:center; box-shadow: inset 0 0 25px #000, 0 8px 30px rgba(0,0,0,0.9); touch-action:none; cursor:grab;">
      
      <!-- Fixed Outer Notch / Indicator at 12 o'clock -->
      <div style="position:absolute; top:-10px; width:0; height:0; border-left:8px solid transparent; border-right:8px solid transparent; border-top:14px solid #ef4444; z-index:10; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.8));"></div>
      
      <!-- Rotating Dial -->
      <div id="safe-dial" style="position:absolute; width:100%; height:100%; border-radius:50%; border:3px solid #666; transition: transform 0.05s linear; display:flex; align-items:flex-start; justify-content:center; padding-top:6px; box-sizing:border-box;">
        <div style="width:8px; height:18px; background:#ef4444; border-radius:2px; box-shadow:0 0 6px #ef4444;"></div>
      </div>
      
      <!-- Inner Hub with Digital Readout -->
      <div style="position:absolute; width:100px; height:100px; border-radius:50%; background:radial-gradient(circle, #1e1e1e 0%, #080808 100%); border:3px solid #555; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow:0 0 15px rgba(0,0,0,0.9); pointer-events:none;">
        <div style="font-size:0.65rem; color:#888; letter-spacing:1px; text-transform:uppercase;">Position</div>
        <div style="font-size:2.2rem; font-family:monospace; font-weight:bold; color:#f5d79e; line-height:1;" id="safe-value">00</div>
      </div>
    </div>
    
    <div style="font-size:0.75rem; color:#aaa; margin-bottom:12px;">
      👆 <strong>Drehe das Rad direkt mit dem Finger</strong> oder nutze die Schnell-Buttons:
    </div>
    
    <!-- Quick Stepper Buttons -->
    <div style="display:flex; gap:8px; align-items:center; margin-bottom:14px; max-width:380px; width:100%; justify-content:center;">
      <button class="btn-secondary" id="btn-dial-m5" style="padding:8px 12px; font-size:0.85rem; font-weight:bold; border-radius:4px;" title="5 Schritte links">&laquo; -5</button>
      <button class="btn-secondary" id="btn-dial-left" style="padding:8px 14px; font-size:1.1rem; font-weight:bold; border-radius:4px;" title="1 Schritt links">&lt;</button>
      <button class="btn-primary" id="btn-dial-confirm" style="padding:10px 18px; font-size:0.95rem; font-weight:bold; border-radius:4px; background:linear-gradient(135deg, #d4af37, #967420); color:#05080f; border:1px solid #f5d79e; box-shadow:0 0 10px rgba(212,175,55,0.3); min-width:140px;">
        Zahl rasten
      </button>
      <button class="btn-secondary" id="btn-dial-right" style="padding:8px 14px; font-size:1.1rem; font-weight:bold; border-radius:4px;" title="1 Schritt rechts">&gt;</button>
      <button class="btn-secondary" id="btn-dial-p5" style="padding:8px 12px; font-size:0.85rem; font-weight:bold; border-radius:4px;" title="5 Schritte rechts">+5 &raquo;</button>
    </div>
    
    <!-- Code Slots Display (2 Numbers for 1823: 18 - 23) -->
    <div style="display:flex; gap:12px; align-items:center; margin-bottom:12px;">
      <span style="font-size:0.8rem; color:#888;">Kombination:</span>
      <div id="safe-progress" style="font-family:monospace; font-size:1.5rem; letter-spacing:8px; color:var(--color-amber-glow, #d4af37); font-weight:bold; background:rgba(0,0,0,0.5); padding:4px 16px; border-radius:4px; border:1px solid #444;">
        _ _
      </div>
    </div>
    
    <button class="btn-secondary" id="btn-safe-abort" style="margin-top:10px; padding:8px 16px; font-size:0.8rem; border:1px solid #555; background:rgba(0,0,0,0.4); color:#bbb; border-radius:4px; cursor:pointer;">
      🔨 Schloss aufbrechen (-10 Punkte)
    </button>
  `;

  document.body.appendChild(overlay);

  const dialContainer = document.getElementById('safe-dial-container');
  const dial = document.getElementById('safe-dial');
  const valDisplay = document.getElementById('safe-value');
  const progressDisplay = document.getElementById('safe-progress');
  const btnConfirm = document.getElementById('btn-dial-confirm');

  let currentVal = 0;
  const targetCombo = [18, 23]; // 2 historical numbers: 18 and 23
  let entered = [];

  function updateDial(val, triggerSound = false) {
    if (val < 0) val = ((val % 100) + 100) % 100;
    if (val >= 100) val = val % 100;
    currentVal = val;
    valDisplay.innerText = currentVal.toString().padStart(2, '0');
    // Rotate dial (0-99 maps to 0-360 degrees)
    const deg = (currentVal / 100) * 360;
    dial.style.transform = `rotate(${deg}deg)`;
    if (triggerSound) {
      playSound('click');
    }
  }

  // --- 1. DIRECT TOUCH & MOUSE DRAG ON DIAL WHEEL ---
  let isDragging = false;
  let lastVal = currentVal;

  function handlePointerMove(e) {
    if (!isDragging) return;
    const rect = dialContainer.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : cx);
    const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : cy);

    const rad = Math.atan2(clientY - cy, clientX - cx);
    let deg = (rad * 180) / Math.PI + 90; // Align 0 with top
    if (deg < 0) deg += 360;
    const val = Math.round((deg / 360) * 100) % 100;
    if (val !== lastVal) {
      updateDial(val, true);
      lastVal = val;
    }
  }

  dialContainer.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    isDragging = true;
    try {
      dialContainer.setPointerCapture(e.pointerId);
    } catch (_) {}
    dialContainer.style.cursor = 'grabbing';
    handlePointerMove(e);
  });

  dialContainer.addEventListener('pointermove', handlePointerMove);
  window.addEventListener('pointermove', handlePointerMove);

  const stopDragging = (e) => {
    isDragging = false;
    if (e && e.pointerId && dialContainer) {
      try {
        dialContainer.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
    if (dialContainer) dialContainer.style.cursor = 'grab';
  };

  dialContainer.addEventListener('pointerup', stopDragging);
  dialContainer.addEventListener('pointercancel', stopDragging);
  window.addEventListener('pointerup', stopDragging);
  window.addEventListener('pointercancel', stopDragging);

  // Robuster nativer Touch-Fallback für Android Chrome
  const handleTouch = (e) => {
    if (e.touches && e.touches.length > 0) {
      e.preventDefault();
      const rect = dialContainer.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const t = e.touches[0];
      const rad = Math.atan2(t.clientY - cy, t.clientX - cx);
      let deg = (rad * 180) / Math.PI + 90;
      if (deg < 0) deg += 360;
      const val = Math.round((deg / 360) * 100) % 100;
      if (val !== lastVal) {
        updateDial(val, true);
        lastVal = val;
      }
    }
  };
  dialContainer.addEventListener('touchstart', handleTouch, { passive: false });
  dialContainer.addEventListener('touchmove', handleTouch, { passive: false });
  dialContainer.addEventListener('touchend', () => { isDragging = false; });
  dialContainer.addEventListener('touchcancel', () => { isDragging = false; });

  // --- 2. STEPPER BUTTONS WITH AUTOREPEAT ---
  function setupStepper(btnId, delta) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    let timer = null;
    let interval = null;

    const step = () => updateDial(currentVal + delta, true);

    const startRepeat = (e) => {
      e.preventDefault();
      step();
      timer = setTimeout(() => {
        interval = setInterval(step, 90);
      }, 300);
    };

    const stopRepeat = () => {
      if (timer) clearTimeout(timer);
      if (interval) clearInterval(interval);
    };

    btn.addEventListener('pointerdown', startRepeat);
    btn.addEventListener('pointerup', stopRepeat);
    btn.addEventListener('pointerleave', stopRepeat);
    btn.addEventListener('pointercancel', stopRepeat);
    btn.addEventListener('touchend', stopRepeat);
  }

  setupStepper('btn-dial-left', -1);
  setupStepper('btn-dial-right', 1);
  setupStepper('btn-dial-m5', -5);
  setupStepper('btn-dial-p5', 5);

  // Keyboard navigation
  function handleKeyDown(e) {
    if (e.key === 'ArrowLeft') updateDial(currentVal - 1, true);
    if (e.key === 'ArrowRight') updateDial(currentVal + 1, true);
    if (e.key === 'Enter') btnConfirm.click();
  }
  window.addEventListener('keydown', handleKeyDown);

  // Close button
  document.getElementById('btn-safe-cancel').onclick = () => {
    window.isGadgetRunning = false;
    cleanup();
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    if (onCancel) onCancel();
  };

  // Abort / break safe
  document.getElementById('btn-safe-abort').onclick = () => {
    const doBreak = () => {
      import('../../state.js').then(m => m.addScore(-10));
      import('../../main.js').then(m => m.showNoirAlert('Rätsel gewaltsam gelöst (-10 Punkte)', 'Punkteabzug'));
      cleanup();
      showInsideSafe();
    };

    if (window.showNoirConfirm) {
      window.showNoirConfirm("Schloss aufbrechen?", "Möchtest du das Rätsel überspringen und den Tresor gewaltsam knacken? (-10 Punkte)", doBreak);
    } else {
      doBreak();
    }
  };

  function cleanup() {
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', stopDragging);
    window.removeEventListener('pointercancel', stopDragging);
    window.removeEventListener('keydown', handleKeyDown);
  }

  const observer = new MutationObserver(() => {
    if (!document.body.contains(overlay)) {
      window.isGadgetRunning = false;
      cleanup();
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true });

  // --- 3. CONFIRM & FORGIVING LOGIC ---
  btnConfirm.onclick = () => {
    const needed = targetCombo[entered.length];
    if (currentVal === needed) {
      entered.push(currentVal);
      playSound('success');
      progressDisplay.innerText = entered.map(v => v.toString().padStart(2, '0')).join(' ') + (entered.length < targetCombo.length ? ' _' : '');

      if (entered.length === targetCombo.length) {
        cleanup();
        setTimeout(() => {
          showInsideSafe();
        }, 400);
      } else {
        showNoirAlert(`Klick! Die erste Zahl (${needed}) rastet satt im Bolzen ein! Drehe nun zur zweiten Zahl.`, "1. Riegel geöffnet");
      }
    } else {
      playSound('error');
      if (entered.length === 1) {
        showNoirAlert(`Fehlversuch: Die Zahl ${currentVal.toString().padStart(2, '0')} passt nicht für den zweiten Riegel. Die erste Zahl (18) bleibt gesichert – versuche es noch einmal!`, "Schloss blockiert");
      } else {
        showNoirAlert(`Fehlversuch: Die Zahl ${currentVal.toString().padStart(2, '0')} rastet nicht ein. Beachte den Hinweis auf das Jahr 1823!`, "Schloss blockiert");
      }
    }
  };

  function showInsideSafe() {
    overlay.innerHTML = `
      <div style="font-size:3rem; margin-bottom:8px; animation:pulse 1s infinite alternate;">🔓</div>
      <h2 style="color:var(--color-amber-glow, #d4af37); margin-bottom:12px; font-family:serif; font-size:1.8rem;">Tresor geöffnet!</h2>
      <div style="background:rgba(20,24,35,0.9); border:1px solid #d4af37; border-radius:8px; padding:18px; text-align:left; max-width:340px; margin-bottom:18px; box-shadow:0 8px 25px rgba(0,0,0,0.6);">
        <p style="color:#ddd; font-size:0.9rem; line-height:1.45; margin:0;">
          Der massive Stahlbolzen springt auf! Im Innenfach findest du brisante <strong>Überweisungsbelege aus dem Ausland</strong>, die direkt mit den gefälschten Dokumenten der Brandnacht verknüpft sind.
        </p>
      </div>
      <p style="margin-bottom:12px; font-size:0.9rem; color:#bbb;">Wem ordnest du diese dubiosen Zahlungen zu?</p>
      <div style="display:flex; flex-direction:column; gap:10px; width:100%; max-width:320px;">
        <button class="btn-primary suspect-choice" data-suspect="herold" data-val="15" style="padding:10px; font-weight:bold; background:linear-gradient(135deg, #d4af37, #8c6d23); color:#05080f; border:1px solid #d4af37; border-radius:4px; cursor:pointer;">Herold (+15% Verdacht)</button>
        <button class="btn-primary suspect-choice" data-suspect="gipser" data-val="15" style="padding:10px; font-weight:bold; background:rgba(30,41,59,0.85); color:#f5d79e; border:1px solid #475569; border-radius:4px; cursor:pointer;">Von Gipser (+15% Verdacht)</button>
        <button class="btn-primary suspect-choice" data-suspect="heiden" data-val="15" style="padding:10px; font-weight:bold; background:rgba(30,41,59,0.85); color:#f5d79e; border:1px solid #475569; border-radius:4px; cursor:pointer;">Heiden (+15% Verdacht)</button>
      </div>
    `;

    let isSubmitted = false;
    overlay.querySelectorAll('.suspect-choice').forEach(btn => {
      btn.onclick = () => {
        if (isSubmitted) return;
        isSubmitted = true;
        overlay.querySelectorAll('.suspect-choice').forEach(b => {
          b.disabled = true;
          b.style.pointerEvents = 'none';
        });
        const suspect = btn.getAttribute('data-suspect');
        const val = parseInt(btn.getAttribute('data-val'), 10);
        addSuspectImpact(suspect, val);
        showNoirAlert("Beweisstück gesichert und Verdacht aktualisiert!", "Erfolg");
        window.isGadgetRunning = false;
        if (overlay.parentNode) document.body.removeChild(overlay);
        onComplete();
      };
    });
  }
}
