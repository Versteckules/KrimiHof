import { addSuspectImpact } from '../../state.js';

export function runGadget(stationId, onComplete) {
  const overlay = document.createElement('div');
  overlay.id = 'gadget-fullscreen-overlay';
  overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:radial-gradient(circle, #333 0%, #111 100%); z-index:9999; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px; box-sizing:border-box; color:white; font-family:sans-serif; text-align:center;';

  overlay.innerHTML = `
    <h2 style="color:var(--color-night-light); margin-bottom:10px;">Der Historische Tresor</h2>
    <p style="margin-bottom:10px; font-size:0.9rem;">Hinweis: "Das Jahr der Gründung (1823)"</p>
    
    <div style="position:relative; width:200px; height:200px; margin:20px 0; border-radius:50%; border:10px solid #555; background:#222; display:flex; align-items:center; justify-content:center; box-shadow: inset 0 0 20px #000, 0 0 20px #000;">
      <div id="safe-dial" style="width:100%; height:100%; border-radius:50%; border:4px dashed #888; transition: transform 0.1s ease-out; display:flex; align-items:flex-start; justify-content:center; padding-top:10px; box-sizing:border-box;">
        <div style="width:10px; height:20px; background:red;"></div>
      </div>
      <div style="position:absolute; font-size:2rem; font-family:monospace; font-weight:bold; color:#d4af37;" id="safe-value">00</div>
    </div>
    
    <p style="font-size:0.8rem; color:#aaa; margin-bottom:15px;">Neige dein Handy (Gyroskop) oder benutze die Buttons, um das Rad zu drehen.</p>
    
    <div style="display:flex; gap:20px; margin-bottom:20px;">
      <button class="btn-secondary" id="btn-dial-left" style="font-size:1.5rem;">&lt;</button>
      <button class="btn-primary" id="btn-dial-confirm">Zahl bestätigen</button>
      <button class="btn-secondary" id="btn-dial-right" style="font-size:1.5rem;">&gt;</button>
    </div>
    
    <div id="safe-progress" style="font-family:monospace; font-size:1.2rem; letter-spacing:5px;">_ _ _</div>
    
    <button class="btn-secondary" id="btn-safe-abort" style="margin-top: 30px;">Schloss umgehen</button>
  `;

  document.body.appendChild(overlay);

  const dial = document.getElementById('safe-dial');
  const valDisplay = document.getElementById('safe-value');
  const progressDisplay = document.getElementById('safe-progress');
  
  let currentVal = 0;
  let targetCombo = [18, 23, 0]; // 3 numbers
  let entered = [];

  function updateDial(val) {
    if (val < 0) val = 99;
    if (val > 99) val = 0;
    currentVal = val;
    valDisplay.innerText = currentVal.toString().padStart(2, '0');
    // Rotate dial (0-99 maps to 0-360 degrees)
    const deg = (currentVal / 100) * 360;
    dial.style.transform = `rotate(${deg}deg)`;
  }

  // Buttons
  document.getElementById('btn-dial-left').onclick = () => updateDial(currentVal - 1);
  document.getElementById('btn-dial-right').onclick = () => updateDial(currentVal + 1);

  // Abort
  document.getElementById('btn-safe-abort').onclick = () => {
    if (window.showNoirConfirm) {
      window.showNoirConfirm("Schloss aufbrechen?", "Möchtest du das Rätsel überspringen und den Tresor knacken? (-10 Punkte)", () => {
        import('../../state.js').then(m => m.addScore(-10));
        import('../../main.js').then(m => m.showNoirAlert('Rätsel gewaltsam gelöst (-10 Punkte)', 'Punkteabzug'));
        window.removeEventListener('deviceorientation', handleOrientation);
        showInsideSafe();
      });
    } else {
      import('../../state.js').then(m => m.addScore(-10));
      window.removeEventListener('deviceorientation', handleOrientation);
      showInsideSafe();
    }
  };

  // Gyroscope
  function handleOrientation(event) {
    if (!event.gamma) return;
    // gamma is left/right tilt in degrees (-90 to 90)
    // Map tilt to a slow rotation
    if (event.gamma > 15) updateDial(currentVal + 1);
    if (event.gamma < -15) updateDial(currentVal - 1);
  }
  window.addEventListener('deviceorientation', handleOrientation);

  // Confirm
  document.getElementById('btn-dial-confirm').onclick = () => {
    if (currentVal === targetCombo[entered.length]) {
      entered.push(currentVal);
      progressDisplay.innerText = entered.map(v => v.toString().padStart(2, '0')).join(' ') + ' _'.repeat(3 - entered.length);
      
      if (entered.length === 3) {
        window.removeEventListener('deviceorientation', handleOrientation);
        showInsideSafe();
      } else {
        alert("Klick! Die Zahl rastet ein.");
      }
    } else {
      alert("Falsche Zahl! Das Schloss blockiert. (Reset)");
      entered = [];
      progressDisplay.innerText = "_ _ _";
    }
  };

  function showInsideSafe() {
    overlay.innerHTML = `
      <h2 style="color:var(--color-amber-glow); margin-bottom:20px;">Tresor geöffnet!</h2>
      <div style="background:#222; border:1px solid #d4af37; padding:20px; text-align:left; max-width:300px; margin-bottom:20px;">
        <p style="color:#ddd; font-size:0.9rem;">Du findest brisante Überweisungsbelege aus dem Ausland, die direkt im Zusammenhang mit dem Notarvertrag stehen.</p>
      </div>
      <p style="margin-bottom:15px;">Wem ordnest du diese dubiosen Zahlungen zu?</p>
      <div style="display:flex; flex-direction:column; gap:10px; width:100%; max-width:300px;">
        <button class="btn-primary suspect-choice" data-suspect="herold" data-val="15">Herold (+15% Schuld)</button>
        <button class="btn-primary suspect-choice" data-suspect="gipser" data-val="15">Von Gipser (+15% Schuld)</button>
        <button class="btn-primary suspect-choice" data-suspect="heiden" data-val="15">Heiden (+15% Schuld)</button>
      </div>
    `;

    overlay.querySelectorAll('.suspect-choice').forEach(btn => {
      btn.onclick = () => {
        const suspect = btn.getAttribute('data-suspect');
        const val = parseInt(btn.getAttribute('data-val'), 10);
        addSuspectImpact(suspect, val);
        alert("Beleg gesichert und zugeordnet!");
        document.body.removeChild(overlay);
        onComplete();
      };
    });
  }
}
