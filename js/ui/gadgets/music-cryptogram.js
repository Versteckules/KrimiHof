import { addSuspectImpact } from '../../state.js';

export function runGadget(stationId, onComplete) {
  const overlay = document.createElement('div');
  overlay.id = 'gadget-fullscreen-overlay';
  overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:#0a0e17; z-index:9999; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px; box-sizing:border-box; color:white; font-family:serif; text-align:center;';

  overlay.innerHTML = `
    <h2 style="color:#a89f91; margin-bottom:10px;">Die Orgelempore</h2>
    <p style="margin-bottom:20px; font-size:0.9rem; font-family:sans-serif;">Ein uraltes Notenblatt zeigt ein Motiv, das in der Musikgeschichte berühmt ist (Vier Töne).</p>
    
    <div id="piano" style="display:flex; justify-content:center; gap:2px; margin-bottom:20px;">
      <!-- White keys -->
      <div class="piano-key" data-note="C" style="width:40px; height:120px; background:white; color:black; display:flex; align-items:flex-end; justify-content:center; padding-bottom:10px; cursor:pointer; font-weight:bold; border-radius:0 0 5px 5px;">C</div>
      <div class="piano-key" data-note="D" style="width:40px; height:120px; background:white; color:black; display:flex; align-items:flex-end; justify-content:center; padding-bottom:10px; cursor:pointer; font-weight:bold; border-radius:0 0 5px 5px;">D</div>
      <div class="piano-key" data-note="E" style="width:40px; height:120px; background:white; color:black; display:flex; align-items:flex-end; justify-content:center; padding-bottom:10px; cursor:pointer; font-weight:bold; border-radius:0 0 5px 5px;">E</div>
      <div class="piano-key" data-note="F" style="width:40px; height:120px; background:white; color:black; display:flex; align-items:flex-end; justify-content:center; padding-bottom:10px; cursor:pointer; font-weight:bold; border-radius:0 0 5px 5px;">F</div>
      <div class="piano-key" data-note="G" style="width:40px; height:120px; background:white; color:black; display:flex; align-items:flex-end; justify-content:center; padding-bottom:10px; cursor:pointer; font-weight:bold; border-radius:0 0 5px 5px;">G</div>
      <div class="piano-key" data-note="A" style="width:40px; height:120px; background:white; color:black; display:flex; align-items:flex-end; justify-content:center; padding-bottom:10px; cursor:pointer; font-weight:bold; border-radius:0 0 5px 5px;">A</div>
      <div class="piano-key" data-note="B" style="width:40px; height:120px; background:white; color:black; display:flex; align-items:flex-end; justify-content:center; padding-bottom:10px; cursor:pointer; font-weight:bold; border-radius:0 0 5px 5px;">B/H</div>
    </div>
    
    <div id="notes-display" style="font-family:monospace; font-size:1.5rem; letter-spacing:5px; height:30px; color:#d4af37;"></div>
  `;

  document.body.appendChild(overlay);

  // Web Audio Context for simple beeps
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  let audioCtx;

  function playNoteFreq(frequency) {
    if (!audioCtx) audioCtx = new AudioContext();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'triangle';
    oscillator.frequency.value = frequency;

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 1);
    oscillator.stop(audioCtx.currentTime + 1);
  }

  const noteFrequencies = {
    'C': 261.63,
    'D': 293.66,
    'E': 329.63,
    'F': 349.23,
    'G': 392.00,
    'A': 440.00,
    'B': 493.88
  };

  const targetSequence = ['B', 'A', 'C', 'B']; // "BACH" using B/H key as B
  let entered = [];
  const display = document.getElementById('notes-display');

  overlay.querySelectorAll('.piano-key').forEach(key => {
    key.onclick = () => {
      const note = key.getAttribute('data-note');

      // Visual feedback
      key.style.background = '#ccc';
      setTimeout(() => key.style.background = 'white', 150);

      playNoteFreq(noteFrequencies[note]);

      entered.push(note);
      if (entered.length > 4) entered.shift(); // keep last 4

      display.innerText = entered.join(' ');

      if (entered.length === 4 && entered.join('') === targetSequence.join('')) {
        setTimeout(startPhase2, 500);
      }
    };
  });

  function startPhase2() {
    overlay.innerHTML = `
      <h2 style="color:#d4af37; margin-bottom:10px;">Ein Kryptex fährt aus der Wand!</h2>
      <p style="margin-bottom:20px; font-size:0.9rem; font-family:sans-serif;">Die Orgelmechanik gibt ein 4-stelliges Worträtsel frei. Wie nennt sich das geheime Bündnis?</p>
      
      <input type="text" id="kryptex-input" maxlength="4" style="font-size:2rem; width:120px; text-align:center; text-transform:uppercase; letter-spacing:10px; background:#222; color:#fff; border:2px solid #555; border-radius:5px; margin-bottom:20px;">
      <br>
      <button class="btn-primary" id="btn-kryptex-check">Öffnen</button>
    `;

    document.getElementById('btn-kryptex-check').onclick = () => {
      const val = document.getElementById('kryptex-input').value.toUpperCase();
      if (val === "PAKT") {
        showPhase3();
      } else {
        alert("Falsches Wort. Das Kryptex klemmt.");
      }
    };
  }

  function showPhase3() {
    overlay.innerHTML = `
      <h2 style="color:var(--color-amber-glow); margin-bottom:20px;">Das Kryptex ist offen!</h2>
      <div style="background:#222; border:1px solid #d4af37; padding:20px; text-align:left; max-width:300px; margin-bottom:20px; font-family:sans-serif;">
        <p style="color:#ddd; font-size:0.9rem;">Du findest brisante theologische Aufzeichnungen, die eine Fanatisierung belegen.</p>
      </div>
      <p style="margin-bottom:15px; font-family:sans-serif;">Wem ordnest du diese Dokumente zu?</p>
      <div style="display:flex; flex-direction:column; gap:10px; width:100%; max-width:300px; font-family:sans-serif;">
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
        alert("Beweis gesichert!");
        document.body.removeChild(overlay);
        onComplete();
      };
    });
  }
}
