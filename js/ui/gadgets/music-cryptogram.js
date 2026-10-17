import { addSuspectImpact, addScore } from '../../state.js';

export function runGadget(stationId, onComplete, onCancel) {
  const overlay = document.createElement('div');
  overlay.id = 'gadget-fullscreen-overlay';
  overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:#0a0e17; z-index:9999; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px; box-sizing:border-box; color:white; font-family:serif; text-align:center;';

  // Web Audio Context for notes
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  let audioCtx = null;

  function playNoteFreq(frequency) {
    try {
      if (!audioCtx) {
        audioCtx = new AudioContext();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'triangle';
      oscillator.frequency.value = frequency;

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      const now = audioCtx.currentTime;
      // W3C Web Audio standard: Setze erst expliziten Startwert, bevor exponentiell gerampt wird
      gainNode.gain.setValueAtTime(0.25, now);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, now + 0.8);

      oscillator.start(now);
      oscillator.stop(now + 0.8);
    } catch (err) {
      console.warn('[MusicCryptogram] Audio playback error (tolerated):', err);
    }
  }

  const noteFrequencies = {
    'C': 261.63,
    'D': 293.66,
    'E': 329.63,
    'F': 349.23,
    'G': 392.00,
    'A': 440.00,
    'B': 466.16, // B flat
    'H': 493.88  // B natural (H)
  };

  function cancelGadget() {
    window.isGadgetRunning = false;
    if (audioCtx) {
      try { audioCtx.close(); } catch(e) {}
      audioCtx = null;
    }
    if (overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
    if (onCancel) onCancel();
  }

  let isFinished = false;
  function finishGadget() {
    if (isFinished) return;
    isFinished = true;
    window.isGadgetRunning = false;
    if (audioCtx) {
      try { audioCtx.close(); } catch(e) {}
      audioCtx = null;
    }
    if (overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
    if (onComplete) onComplete();
  }

  const observer = new MutationObserver(() => {
    if (!document.body.contains(overlay)) {
      if (audioCtx) {
        try { audioCtx.close(); } catch(e) {}
      }
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true });

  function skipWithPenalty() {
    const doSkip = () => {
      addScore(-10);
      import('../../main.js').then(m => {
        if (m.showNoirAlert) m.showNoirAlert('Rätsel gewaltsam gelöst (-10 Punkte)', 'Punkteabzug');
      });
      showPhase3();
    };

    if (window.showNoirConfirm) {
      window.showNoirConfirm("Orgel knacken?", "Möchtest du das gesamte Rätsel gewaltsam überspringen? (-10 Kommissarpunkte)", doSkip);
    } else if (confirm("Möchtest du das Rätsel überspringen? (-10 Punkte)")) {
      doSkip();
    }
  }

  function renderPhase1() {
    overlay.innerHTML = `
      <button id="btn-music-cancel" style="position:absolute; top:calc(12px + env(safe-area-inset-top, 0px)); left:calc(14px + env(safe-area-inset-left, 0px)); background:rgba(0,0,0,0.5); border:1px solid #555; color:#ddd; font-size:1.6rem; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; z-index:10;" title="Schließen">&times;</button>
      
      <h2 style="color:var(--color-amber-glow); margin-bottom:8px; font-family:var(--font-serif); font-size:1.5rem;">Die Orgel von St. Michaelis</h2>
      <p style="margin-bottom:12px; font-size:0.95rem; font-family:sans-serif; color:#cbd5e1; max-width:420px; line-height:1.4;">
        Ein gerettetes Notenblatt offenbart das musikalische Kennwort der Bruderschaft. Spiele die 4 Töne auf den Tasten:
      </p>

      <div style="background:rgba(212,175,55,0.12); border-left:3px solid #d4af37; border-radius:4px; padding:10px 14px; margin-bottom:20px; font-size:0.85rem; color:#f5d79e; text-align:left; max-width:380px; font-family:sans-serif; line-height:1.4;">
        💡 <strong>Ermittler-Hinweis:</strong> Die Notenfolge ehrt den berühmtesten Meister barocker Orgelmusik: <strong style="color:#fff; letter-spacing:1px;">B – A – C – H</strong>.
      </div>
      
      <div id="piano" style="display:flex; justify-content:center; gap:3px; margin-bottom:15px; width:100%; max-width:340px;">
        <div class="piano-key" data-note="C" style="flex:1; max-width:40px; min-width:30px; height:125px; background:white; color:black; display:flex; align-items:flex-end; justify-content:center; padding-bottom:10px; cursor:pointer; font-weight:bold; border-radius:0 0 5px 5px; box-shadow:0 3px 6px rgba(0,0,0,0.5); user-select:none;">C</div>
        <div class="piano-key" data-note="D" style="flex:1; max-width:40px; min-width:30px; height:125px; background:white; color:black; display:flex; align-items:flex-end; justify-content:center; padding-bottom:10px; cursor:pointer; font-weight:bold; border-radius:0 0 5px 5px; box-shadow:0 3px 6px rgba(0,0,0,0.5); user-select:none;">D</div>
        <div class="piano-key" data-note="E" style="flex:1; max-width:40px; min-width:30px; height:125px; background:white; color:black; display:flex; align-items:flex-end; justify-content:center; padding-bottom:10px; cursor:pointer; font-weight:bold; border-radius:0 0 5px 5px; box-shadow:0 3px 6px rgba(0,0,0,0.5); user-select:none;">E</div>
        <div class="piano-key" data-note="F" style="flex:1; max-width:40px; min-width:30px; height:125px; background:white; color:black; display:flex; align-items:flex-end; justify-content:center; padding-bottom:10px; cursor:pointer; font-weight:bold; border-radius:0 0 5px 5px; box-shadow:0 3px 6px rgba(0,0,0,0.5); user-select:none;">F</div>
        <div class="piano-key" data-note="G" style="flex:1; max-width:40px; min-width:30px; height:125px; background:white; color:black; display:flex; align-items:flex-end; justify-content:center; padding-bottom:10px; cursor:pointer; font-weight:bold; border-radius:0 0 5px 5px; box-shadow:0 3px 6px rgba(0,0,0,0.5); user-select:none;">G</div>
        <div class="piano-key" data-note="A" style="flex:1; max-width:40px; min-width:30px; height:125px; background:white; color:black; display:flex; align-items:flex-end; justify-content:center; padding-bottom:10px; cursor:pointer; font-weight:bold; border-radius:0 0 5px 5px; box-shadow:0 3px 6px rgba(0,0,0,0.5); user-select:none;">A</div>
        <div class="piano-key" data-note="B" style="flex:1; max-width:40px; min-width:30px; height:125px; background:white; color:black; display:flex; align-items:flex-end; justify-content:center; padding-bottom:10px; cursor:pointer; font-weight:bold; border-radius:0 0 5px 5px; box-shadow:0 3px 6px rgba(0,0,0,0.5); user-select:none;">B</div>
        <div class="piano-key" data-note="H" style="flex:1; max-width:40px; min-width:30px; height:125px; background:white; color:black; display:flex; align-items:flex-end; justify-content:center; padding-bottom:10px; cursor:pointer; font-weight:bold; border-radius:0 0 5px 5px; box-shadow:0 3px 6px rgba(0,0,0,0.5); user-select:none;">H</div>
      </div>
      
      <div id="notes-display" style="font-family:monospace; font-size:1.6rem; letter-spacing:8px; height:36px; color:#d4af37; font-weight:bold;">_ _ _ _</div>
      
      <button class="btn-secondary" id="btn-music-abort" style="margin-top:20px; padding:10px 18px; font-size:0.85rem; border:1px solid #777; background:rgba(0,0,0,0.5); color:#ddd; border-radius:4px; cursor:pointer;">
        Rätsel überspringen (-10 Punkte)
      </button>
    `;

    document.getElementById('btn-music-cancel').onclick = cancelGadget;
    document.getElementById('btn-music-abort').onclick = () => skipWithPenalty();

    const targetSequence = ['B', 'A', 'C', 'H'];
    let entered = [];
    const display = document.getElementById('notes-display');

    overlay.querySelectorAll('.piano-key').forEach(key => {
      key.onclick = () => {
        const note = key.getAttribute('data-note');

        key.style.background = '#ffd700';
        setTimeout(() => key.style.background = 'white', 160);

        playNoteFreq(noteFrequencies[note]);

        entered.push(note);
        if (entered.length > 4) entered.shift();

        display.innerText = entered.join(' ');

        if (entered.length === 4 && entered.join('') === targetSequence.join('')) {
          setTimeout(startPhase2, 450);
        }
      };
    });
  }

  function startPhase2() {
    overlay.innerHTML = `
      <button id="btn-music-cancel" style="position:absolute; top:calc(12px + env(safe-area-inset-top, 0px)); left:calc(14px + env(safe-area-inset-left, 0px)); background:rgba(0,0,0,0.5); border:1px solid #555; color:#ddd; font-size:1.6rem; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; z-index:10;" title="Schließen">&times;</button>
      
      <h2 style="color:var(--color-amber-glow); margin-bottom:8px; font-family:var(--font-serif); font-size:1.5rem;">Das Orgel-Kryptex</h2>
      <p style="margin-bottom:12px; font-size:0.95rem; font-family:sans-serif; color:#cbd5e1; max-width:400px; line-height:1.4;">
        Ein zylinderförmiges Kryptex fährt aus der Wand! Wie lautet das 4-stellige Kennwort des geheimen Hofer Bundes?
      </p>

      <div style="background:rgba(212,175,55,0.12); border-left:3px solid #d4af37; border-radius:4px; padding:10px 14px; margin-bottom:20px; font-size:0.85rem; color:#f5d79e; text-align:left; max-width:380px; font-family:sans-serif; line-height:1.4;">
        💡 <strong>Ermittler-Hinweis:</strong> Das Leitwort unserer Ermittlung: Der <strong>P – A – K – T</strong> der Schlappen-Erben.
      </div>
      
      <input type="text" id="kryptex-input" maxlength="4" placeholder="WORT" style="font-size:2rem; width:160px; text-align:center; text-transform:uppercase; letter-spacing:8px; background:#1e293b; color:#ffd700; border:2px solid #d4af37; border-radius:6px; margin-bottom:20px; padding:6px; font-family:monospace; font-weight:bold;">
      
      <div style="display:flex; gap:12px; justify-content:center;">
        <button class="btn-primary" id="btn-kryptex-check" style="padding:10px 24px; font-size:0.95rem; font-weight:bold; background:var(--color-blood-red); border:none; border-radius:4px; cursor:pointer; color:white;">
          Kryptex öffnen
        </button>
      </div>

      <button class="btn-secondary" id="btn-music-abort2" style="margin-top:20px; padding:10px 18px; font-size:0.85rem; border:1px solid #777; background:rgba(0,0,0,0.5); color:#ddd; border-radius:4px; cursor:pointer;">
        Kryptex aufbrechen (-10 Punkte)
      </button>
    `;

    document.getElementById('btn-music-cancel').onclick = cancelGadget;
    document.getElementById('btn-music-abort2').onclick = () => skipWithPenalty();

    const input = document.getElementById('kryptex-input');
    input.focus();

    const checkCode = () => {
      const val = input.value.trim().toUpperCase();
      if (val === "PAKT") {
        showPhase3();
      } else {
        input.style.borderColor = '#ef4444';
        setTimeout(() => input.style.borderColor = '#d4af37', 800);
        import('../../main.js').then(m => {
          if (m.showNoirAlert) m.showNoirAlert('Falsches Kennwort! Das Kryptex blockiert. (Tipp: PAKT)', 'Kryptex klemmt');
        });
      }
    };

    document.getElementById('btn-kryptex-check').onclick = checkCode;
    input.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') checkCode();
    });
  }

  function showPhase3() {
    overlay.innerHTML = `
      <button id="btn-music-cancel" style="position:absolute; top:calc(12px + env(safe-area-inset-top, 0px)); left:calc(14px + env(safe-area-inset-left, 0px)); background:rgba(0,0,0,0.5); border:1px solid #555; color:#ddd; font-size:1.6rem; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; z-index:10;" title="Schließen">&times;</button>
      
      <h2 style="color:var(--color-amber-glow); margin-bottom:12px; font-family:var(--font-serif); font-size:1.5rem;">Kryptex entriegelt!</h2>
      <div style="background:rgba(30, 41, 59, 0.7); border:1px solid #d4af37; border-radius:6px; padding:16px; text-align:left; max-width:340px; margin-bottom:20px; font-family:sans-serif;">
        <p style="color:#e2e8f0; font-size:0.9rem; line-height:1.45; margin:0;">
          Im Geheimfach des Spieltischs liegen liturgische Schriften und Drohbriefe, die eine radikale Fanatisierung belegen.
        </p>
      </div>

      <p style="margin-bottom:15px; font-family:sans-serif; font-size:0.95rem; color:#f5d79e;">Wem ordnest du diese Dokumente zu?</p>
      
      <div style="display:flex; flex-direction:column; gap:10px; width:100%; max-width:320px; font-family:sans-serif;">
        <button class="btn-primary suspect-choice" data-suspect="herold" data-val="15" style="padding:10px; border-radius:4px; font-weight:bold; cursor:pointer;">Valentin Herold (+15% Verdacht)</button>
        <button class="btn-primary suspect-choice" data-suspect="gipser" data-val="15" style="padding:10px; border-radius:4px; font-weight:bold; cursor:pointer;">Katharina von Gipser (+15% Verdacht)</button>
        <button class="btn-primary suspect-choice" data-suspect="heiden" data-val="15" style="padding:10px; border-radius:4px; font-weight:bold; cursor:pointer;">Severin Heiden (+15% Verdacht)</button>
      </div>
    `;

    document.getElementById('btn-music-cancel').onclick = cancelGadget;

    overlay.querySelectorAll('.suspect-choice').forEach(btn => {
      btn.onclick = () => {
        if (isFinished) return;
        overlay.querySelectorAll('.suspect-choice').forEach(b => {
          b.disabled = true;
          b.style.pointerEvents = 'none';
        });
        const suspect = btn.getAttribute('data-suspect');
        const val = parseInt(btn.getAttribute('data-val'), 10);
        addSuspectImpact(suspect, val);
        import('../../main.js').then(m => {
          if (m.showNoirAlert) m.showNoirAlert('Dokumente gesichert und Verdacht zugewiesen!', 'Erfolg');
        });
        finishGadget();
      };
    });
  }

  // Start with Phase 1
  renderPhase1();
}
