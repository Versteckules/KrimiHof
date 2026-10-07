import * as FX from '../../fx.js';

export function runGadget(stationId, onSuccess) {
  let overlay = document.getElementById('gadget-fullscreen-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'gadget-fullscreen-overlay';
    overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background: #000; z-index: 10000; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff;";
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `<div class="cl-gadget-wrapper" style="padding: 20px; width: 95vw; max-width: 400px; display: flex; flex-direction: column; align-items: center; text-align: center;">
    <div class="cl-gadget-screws"></div>
    <h2 style="font-family:var(--font-serif); margin-bottom:10px; color:#d4af37; text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);">Sprach-Schloss</h2>
    <p style="color:var(--color-text-muted); font-size:0.9rem; margin-bottom:30px;">Das uralte Schloss reagiert auf Stimmvibrationen.<br><br>Flüstere das Passwort: <b>"Schlappenpakt"</b></p>
    
    <div style="position:relative; width:150px; height:150px; border-radius:50%; background: radial-gradient(circle, #2a2a2a, #0a0e17); border: 4px solid var(--color-brass-dark); display:flex; align-items:center; justify-content:center; margin-bottom:30px; box-shadow: inset 0 0 20px rgba(0,0,0,0.8), 0 0 15px rgba(0,0,0,0.5);">
      <div id="whisper-mic-icon" style="font-size: 4rem; opacity: 0.5; transition: all 0.2s;">🎤</div>
      <!-- Animated rings for listening feedback -->
      <div id="whisper-ring1" style="position:absolute; width:100%; height:100%; border-radius:50%; border: 2px solid rgba(212, 175, 55, 0); transform: scale(1); transition: all 0.5s ease-out;"></div>
      <div id="whisper-ring2" style="position:absolute; width:100%; height:100%; border-radius:50%; border: 2px solid rgba(212, 175, 55, 0); transform: scale(1); transition: all 0.5s ease-out;"></div>
    </div>
    
    <div id="whisper-status" style="font-family:var(--font-mono); font-size:0.9rem; color:var(--color-amber-glow); margin-bottom: 20px; height: 20px;">Initialisiere Mikrofon...</div>
    
    <button id="btn-whisper-skip" class="btn-secondary hidden">Sensor überspringen</button>
  </div>`;
  overlay.style.display = 'flex';

  const statusEl = document.getElementById('whisper-status');
  const skipBtn = document.getElementById('btn-whisper-skip');
  const micIcon = document.getElementById('whisper-mic-icon');
  const ring1 = document.getElementById('whisper-ring1');
  
  let recognition = null;
  let solved = false;

  function finishSuccess() {
    if (solved) return;
    solved = true;
    if (recognition) recognition.stop();
    
    statusEl.textContent = "PASSWORT AKZEPTIERT!";
    statusEl.style.color = "#0f0";
    micIcon.style.color = "#0f0";
    micIcon.style.opacity = "1";
    micIcon.style.textShadow = "0 0 20px #0f0";
    
    setTimeout(() => {
      overlay.innerHTML = \`<div class="cl-gadget-wrapper"><h2 style="color:var(--color-amber-glow); font-family:var(--font-serif); font-size:2rem; text-align:center;">Panzertür geöffnet!</h2></div>\`;
      setTimeout(() => {
        overlay.remove();
        FX.playSuccessWumms().then(() => onSuccess());
      }, 1500);
    }, 1500);
  }

  function finishSkip() {
    if (solved) return;
    solved = true;
    if (recognition) recognition.stop();
    overlay.innerHTML = \`<div class="cl-gadget-wrapper"><h2 style="color:var(--color-amber-glow); font-family:var(--font-serif); font-size:2rem; text-align:center;">Manuell entriegelt!</h2></div>\`;
    setTimeout(() => { overlay.remove(); FX.playSuccessWumms().then(() => onSuccess()); }, 1000);
  }

  skipBtn.onclick = finishSkip;

  // Show skip button after 5 seconds
  const skipTimeout = setTimeout(() => {
    skipBtn.classList.remove('hidden');
  }, 5000);

  // Setup Web Speech API
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'de-DE';
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      statusEl.textContent = "Höre zu... (bitte sprechen)";
      micIcon.style.opacity = "1";
      ring1.style.borderColor = "rgba(212, 175, 55, 0.8)";
      ring1.style.transform = "scale(1.3)";
    };

    recognition.onresult = (event) => {
      if (solved) return;
      
      // Visual feedback for voice
      ring1.style.transform = "scale(" + (1.3 + Math.random() * 0.3) + ")";
      
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }
      
      const lowerTranscript = transcript.toLowerCase();
      statusEl.textContent = '"' + lowerTranscript + '"';

      // Check for keywords
      if (lowerTranscript.includes("schlappen") || lowerTranscript.includes("pakt") || lowerTranscript.includes("schlabben")) {
        finishSuccess();
      }
    };

    recognition.onerror = (event) => {
      console.warn("Speech recognition error", event.error);
      if (!solved) {
        statusEl.textContent = "Fehler: " + event.error;
        statusEl.style.color = "var(--color-blood-red)";
        skipBtn.classList.remove('hidden');
      }
    };

    recognition.onend = () => {
      // Restart if not solved yet (user stopped speaking but didn't say the word)
      if (!solved) {
        try {
          recognition.start();
        } catch(e) {}
      }
    };

    try {
      recognition.start();
    } catch (e) {
      statusEl.textContent = "Mikrofon-Zugriff fehlgeschlagen.";
      skipBtn.classList.remove('hidden');
    }

  } else {
    // API not supported
    statusEl.textContent = "Spracherkennung im Browser nicht unterstützt.";
    statusEl.style.color = "var(--color-blood-red)";
    skipBtn.classList.remove('hidden');
  }
}
