import * as FX from '../../fx.js';

export function runGadget(stationId, onSuccess) {
  let overlay = document.getElementById('gadget-fullscreen-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'gadget-fullscreen-overlay';
    overlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background: #000; z-index: 10000; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff;";
    document.body.appendChild(overlay);
  }

  function getDiceSVG(val) {
    const pips = {
      1: '<circle cx="40" cy="40" r="9.5" fill="#c41e3a" />',
      2: '<circle cx="24" cy="24" r="6" fill="#1e1e1e" /><circle cx="56" cy="56" r="6" fill="#1e1e1e" />',
      3: '<circle cx="22" cy="22" r="6" fill="#1e1e1e" /><circle cx="40" cy="40" r="6" fill="#1e1e1e" /><circle cx="58" cy="58" r="6" fill="#1e1e1e" />',
      4: '<circle cx="24" cy="24" r="6" fill="#1e1e1e" /><circle cx="56" cy="24" r="6" fill="#1e1e1e" /><circle cx="24" cy="56" r="6" fill="#1e1e1e" /><circle cx="56" cy="56" r="6" fill="#1e1e1e" />',
      5: '<circle cx="24" cy="24" r="6" fill="#1e1e1e" /><circle cx="56" cy="24" r="6" fill="#1e1e1e" /><circle cx="40" cy="40" r="6" fill="#1e1e1e" /><circle cx="24" cy="56" r="6" fill="#1e1e1e" /><circle cx="56" cy="56" r="6" fill="#1e1e1e" />',
      6: '<circle cx="24" cy="20" r="5.5" fill="#1e1e1e" /><circle cx="24" cy="40" r="5.5" fill="#1e1e1e" /><circle cx="24" cy="60" r="5.5" fill="#1e1e1e" /><circle cx="56" cy="20" r="5.5" fill="#1e1e1e" /><circle cx="56" cy="40" r="5.5" fill="#1e1e1e" /><circle cx="56" cy="60" r="5.5" fill="#1e1e1e" />'
    };

    const content = pips[val] || '<text x="40" y="52" font-size="36" text-anchor="middle" fill="#8b6508" font-family="serif" font-weight="bold">?</text>';

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80" style="filter: drop-shadow(0 6px 14px rgba(0,0,0,0.65));">
        <defs>
          <radialGradient id="die-grad-${val}" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#fffef7"/>
            <stop offset="70%" stop-color="#f5ecc8"/>
            <stop offset="100%" stop-color="#d9caa0"/>
          </radialGradient>
        </defs>
        <rect x="2" y="2" width="76" height="76" rx="14" ry="14" fill="url(#die-grad-${val})" stroke="#8b6508" stroke-width="2.5"/>
        <rect x="5" y="5" width="70" height="70" rx="11" ry="11" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5"/>
        ${content}
      </svg>
    `;
  }

  overlay.innerHTML = `
    <div class="cl-gadget-wrapper" style="padding: 25px 20px; width: 95vw; max-width: 420px; display: flex; flex-direction: column; align-items: center; text-align: center; background: rgba(15, 23, 42, 0.95); border: 2px solid var(--color-amber-muted); border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.9);">
      <div class="cl-gadget-screws"></div>
      
      <h2 style="font-family:var(--font-serif); margin-bottom:8px; color:var(--color-amber-glow); font-size:1.8rem;">Wirtshaus-Würfeln</h2>
      <p style="color:var(--color-text-muted); font-size:0.95rem; margin-bottom:20px; line-height:1.4;">
        Die Zeugen am Stammtisch reden erst, wenn du sie im Würfelbecher besiegst:<br>
        <strong style="color:#f5d79e;">Gewinne mit mehr als 8 Augen!</strong>
      </p>
      
      <!-- Würfel Arena -->
      <div style="background: radial-gradient(circle, #2a4729 0%, #152914 100%); border: 3px solid #8b6508; border-radius: 16px; padding: 25px 30px; margin-bottom: 20px; box-shadow: inset 0 0 25px rgba(0,0,0,0.8); width: 100%; max-width: 320px;">
        <div style="display:flex; justify-content:center; gap:25px; align-items:center; min-height: 90px;">
          <div id="dice-1" style="transition: transform 0.15s ease; cursor:pointer;">
            ${getDiceSVG('?')}
          </div>
          <div id="dice-2" style="transition: transform 0.15s ease; cursor:pointer;">
            ${getDiceSVG('?')}
          </div>
        </div>
        <div id="dice-status" style="margin-top: 15px; font-family: var(--font-mono); font-size: 1.05rem; color: #fff; min-height: 24px;">
          Tippe auf „Würfeln“ zum Starten
        </div>
      </div>
      
      <!-- Wärschtlamo Kessel Easter Egg -->
      <div id="wurstkessel-easter-egg" style="display: flex; align-items: center; gap: 10px; background: rgba(184, 115, 51, 0.15); border: 1px dashed #b87333; padding: 8px 14px; border-radius: 8px; margin-bottom: 20px; cursor: pointer; transition: transform 0.2s;" title="Geheimer Kessel des Wärschtlamo">
        <span style="font-size: 1.5rem;">🍲</span>
        <span style="font-size: 0.8rem; color: #f5d79e; font-family: var(--font-mono);">Dampfender Wurstkessel</span>
      </div>

      <!-- Action Button -->
      <div style="display: flex; gap: 10px; flex-direction: column; width: 100%; max-width: 280px;">
        <button id="btn-dice-roll" class="btn-primary" style="font-size: 1.15rem; padding: 12px 24px; width: 100%;">
          🎲 Würfel werfen
        </button>
        <button id="btn-dice-skip" class="btn-secondary hidden" style="font-size: 0.85rem; padding: 8px; opacity: 0.85;">
          Wirt bestechen (-10 Pkt)
        </button>
      </div>
    </div>
  `;
  overlay.style.display = 'flex';

  const d1 = document.getElementById('dice-1');
  const d2 = document.getElementById('dice-2');
  const statusEl = document.getElementById('dice-status');
  const rollBtn = document.getElementById('btn-dice-roll');
  const skipBtn = document.getElementById('btn-dice-skip');

  let isRolling = false;
  let solved = false;
  let attempts = 0;

  // Easter Egg Wurstkessel
  let kesselTaps = 0;
  document.getElementById('wurstkessel-easter-egg').onclick = () => {
    kesselTaps++;
    FX.playMechanicalClick();
    const kessel = document.getElementById('wurstkessel-easter-egg');
    kessel.style.transform = 'scale(0.95)';
    setTimeout(() => { kessel.style.transform = 'scale(1)'; }, 150);

    if (kesselTaps === 3) {
      FX.playSuccessWumms();
      import('../../state.js').then(mod => {
        const state = mod.getState();
        if (!state.easterEggWaerchtlamo) {
          mod.saveState({ easterEggWaerchtlamo: true, score: (state.score || 0) + 50 });
          import('../main.js').then(m => m.showNoirAlert('🌭 EASTER EGG GEFUNDEN!\nDer legendäre Hofer Wärschtlamo spendiert ein Paar Wiener! (+50 Punkte)', 'Wärschtlamo!'));
        }
      });
    }
  };

  function rollDice() {
    if (isRolling || solved) return;
    isRolling = true;
    rollBtn.disabled = true;
    rollBtn.style.opacity = '0.6';
    attempts++;

    statusEl.textContent = 'Die Würfel rollen im Becher...';
    statusEl.style.color = '#f5d79e';

    FX.playMechanicalClick();

    // Schnelles Drehen und Wechseln
    let rollCycles = 0;
    const interval = setInterval(() => {
      rollCycles++;
      const temp1 = Math.floor(Math.random() * 6) + 1;
      const temp2 = Math.floor(Math.random() * 6) + 1;
      d1.innerHTML = getDiceSVG(temp1);
      d2.innerHTML = getDiceSVG(temp2);

      const rot1 = (Math.random() - 0.5) * 35;
      const rot2 = (Math.random() - 0.5) * 35;
      d1.style.transform = `rotate(${rot1}deg) scale(1.08)`;
      d2.style.transform = `rotate(${rot2}deg) scale(1.08)`;

      if (rollCycles % 2 === 0) {
        FX.playMechanicalClick();
      }

      if (rollCycles >= 10) {
        clearInterval(interval);
        finishRoll();
      }
    }, 75);
  }

  function finishRoll() {
    FX.playHeavySnap();

    // Finale Augen
    const v1 = Math.floor(Math.random() * 6) + 1;
    const v2 = Math.floor(Math.random() * 6) + 1;
    const sum = v1 + v2;

    d1.innerHTML = getDiceSVG(v1);
    d2.innerHTML = getDiceSVG(v2);
    d1.style.transform = 'rotate(0deg) scale(1)';
    d2.style.transform = 'rotate(0deg) scale(1)';

    isRolling = false;
    rollBtn.disabled = false;
    rollBtn.style.opacity = '1';

    // Gewinn: Mehr als 8 Augen (9, 10, 11, 12)
    if (sum > 8) {
      solved = true;
      statusEl.innerHTML = `<strong style="color: #4ade80;">🎲 ${v1} + ${v2} = ${sum} Augen! Gewonnen!</strong>`;
      rollBtn.style.display = 'none';

      setTimeout(() => {
        overlay.innerHTML = `
          <div class="cl-gadget-wrapper" style="padding: 30px; text-align: center; background: rgba(15,23,42,0.95); border: 2px solid #4ade80; border-radius: 12px;">
            <h2 style="color:#4ade80; font-family:var(--font-serif); font-size:2rem; margin-bottom:15px;">Wirtshaus-Sieg!</h2>
            <p style="color:#cbd5e1; font-size:1.05rem; line-height:1.5;">Mit ${sum} Augen beeindruckst du die Zeugen am Tisch. Sie rücken endlich mit den gesuchten Hinweisen heraus!</p>
          </div>
        `;
        setTimeout(() => {
          overlay.remove();
          FX.playSuccessWumms().then(() => onSuccess());
        }, 1800);
      }, 900);
    } else {
      statusEl.innerHTML = `<span style="color: #f87171;">🎲 ${v1} + ${v2} = ${sum} Augen. (Benötigt: > 8)</span>`;
      rollBtn.textContent = '🎲 Noch einmal würfeln';

      // Nach 3 Fehlversuchen Überspringen anbieten
      if (attempts >= 3) {
        skipBtn.classList.remove('hidden');
      }

      FX.shakeElement(document.querySelector('.cl-gadget-wrapper'));
    }
  }

  rollBtn.onclick = rollDice;

  // Schütteln auf Smartphones erkennen
  function handleMotion(e) {
    if (isRolling || solved) return;
    const acc = e.accelerationIncludingGravity;
    if (!acc) return;
    const force = Math.abs(acc.x || 0) + Math.abs(acc.y || 0) + Math.abs(acc.z || 0);
    if (force > 20) {
      rollDice();
    }
  }
  window.addEventListener('devicemotion', handleMotion);

  skipBtn.onclick = () => {
    if (window.showNoirConfirm) {
      window.showNoirConfirm('Wirt bestechen?', 'Möchtest du den Stammtisch mit einer Lokalrunde bestechen und das Rätsel überspringen? (-10 Punkte)', () => {
        solved = true;
        window.removeEventListener('devicemotion', handleMotion);
        import('../../state.js').then(m => m.addScore(-10));
        import('../../main.js').then(m => m.showNoirAlert('Wirt bestochen (-10 Punkte)', 'Punkteabzug'));
        overlay.remove();
        FX.playSuccessWumms().then(() => onSuccess());
      });
    } else {
      solved = true;
      window.removeEventListener('devicemotion', handleMotion);
      overlay.remove();
      onSuccess();
    }
  };
}
