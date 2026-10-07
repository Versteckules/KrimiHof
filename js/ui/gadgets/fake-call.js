import * as FX from '../../fx.js';

export function runGadget(stationId, onSuccess) {
  let overlay = document.getElementById('gadget-fullscreen-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'gadget-fullscreen-overlay';
    overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background: #0a0a0a; z-index: 10000; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff;";
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `<div class="cl-gadget-wrapper" style="width:100%; height:100%; max-width:none; max-height:none; border:none; border-radius:0; box-shadow:none; padding:40px 20px;">
    <div style="display:flex; flex-direction:column; align-items:center; width:100%; height: 100%; justify-content: space-between;">
      
      <div style="display:flex; flex-direction:column; align-items:center; flex-grow: 1; justify-content: center;">
        <div style="font-family:var(--font-mono); font-size:1.2rem; color:#aaa; margin-bottom:10px; letter-spacing: 2px;">EINGEHENDER ANRUF</div>
        <h2 style="font-size:3rem; margin-bottom:20px; font-weight: 300;">Unbekannt</h2>
        <div style="font-size:1rem; color:#666; margin-bottom:50px;">Mobile</div>
        
        <div id="call-status" style="font-size:1.5rem; color:#fff; opacity:0; font-family:var(--font-mono); font-variant-numeric: tabular-nums;">00:00</div>
        <div id="call-waveform" style="display:flex; gap: 5px; height: 50px; align-items: center; opacity: 0; margin-top: 20px;">
           <div class="wf-bar" style="width: 5px; height: 10px; background:#0f0;"></div>
           <div class="wf-bar" style="width: 5px; height: 20px; background:#0f0;"></div>
           <div class="wf-bar" style="width: 5px; height: 10px; background:#0f0;"></div>
           <div class="wf-bar" style="width: 5px; height: 30px; background:#0f0;"></div>
           <div class="wf-bar" style="width: 5px; height: 15px; background:#0f0;"></div>
        </div>
      </div>

      <div id="call-actions" style="display:flex; gap:60px; margin-bottom:50px;">
        <div style="display:flex; flex-direction:column; align-items:center;">
          <button id="btn-call-decline" style="width:75px; height:75px; border-radius:50%; background:#ff3b30; border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow: 0 5px 15px rgba(255,59,48,0.5);">
            <svg viewBox="0 0 24 24" width="35" height="35" stroke="#fff" stroke-width="2" fill="none" style="transform: rotate(135deg);"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path></svg>
          </button>
          <span style="color:#aaa; font-size:0.9rem; margin-top:10px;">Ablehnen</span>
        </div>

        <div style="display:flex; flex-direction:column; align-items:center;">
          <button id="btn-call-accept" class="pulse-anim" style="width:75px; height:75px; border-radius:50%; background:#34c759; border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow: 0 5px 15px rgba(52,199,89,0.5);">
            <svg viewBox="0 0 24 24" width="35" height="35" stroke="#fff" stroke-width="2" fill="none"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path></svg>
          </button>
          <span style="color:#aaa; font-size:0.9rem; margin-top:10px;">Annehmen</span>
        </div>
      </div>
    </div>
    <style>
      @keyframes pulsePhone {
        0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(52, 199, 89, 0.7); }
        70% { transform: scale(1.1); box-shadow: 0 0 0 20px rgba(52, 199, 89, 0); }
        100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(52, 199, 89, 0); }
      }
      .pulse-anim { animation: pulsePhone 1.5s infinite; }
      @keyframes wf {
        0%, 100% { height: 10px; }
        50% { height: 40px; }
      }
      .wf-anim .wf-bar:nth-child(1) { animation: wf 0.8s infinite 0.1s; }
      .wf-anim .wf-bar:nth-child(2) { animation: wf 0.8s infinite 0.4s; }
      .wf-anim .wf-bar:nth-child(3) { animation: wf 0.8s infinite 0.2s; }
      .wf-anim .wf-bar:nth-child(4) { animation: wf 0.8s infinite 0.5s; }
      .wf-anim .wf-bar:nth-child(5) { animation: wf 0.8s infinite 0.3s; }
    </style>
  </div>`;
  overlay.style.display = 'flex';

  let ringToneCtx = null;
  let ringToneOsc = null;
  let ringInterval = null;
  let callTimer = null;
  let solved = false;

  function playRingtone() {
    if (!window.AudioContext && !window.webkitAudioContext) return;
    ringToneCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    function ring() {
      if (solved) return;
      if (ringToneCtx.state === 'suspended') ringToneCtx.resume();
      
      const osc = ringToneCtx.createOscillator();
      const gain = ringToneCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, ringToneCtx.currentTime);
      osc.frequency.setValueAtTime(480, ringToneCtx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.5, ringToneCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ringToneCtx.currentTime + 1.5);
      
      osc.connect(gain);
      gain.connect(ringToneCtx.destination);
      osc.start();
      osc.stop(ringToneCtx.currentTime + 1.5);
      if (navigator.vibrate) navigator.vibrate([400, 200, 400]);
    }
    
    ring();
    ringInterval = setInterval(ring, 2500);
  }
  
  function stopRingtone() {
    if (ringInterval) clearInterval(ringInterval);
    if (ringToneCtx) ringToneCtx.close();
  }

  playRingtone();

  document.getElementById('btn-call-accept').onclick = () => {
    if (solved) return;
    stopRingtone();
    
    document.getElementById('call-actions').style.display = 'none';
    const status = document.getElementById('call-status');
    const waveform = document.getElementById('call-waveform');
    status.style.opacity = '1';
    waveform.style.opacity = '1';
    waveform.classList.add('wf-anim');
    
    let sec = 0;
    status.textContent = "00:00";
    callTimer = setInterval(() => {
      sec++;
      status.textContent = \`00:0\${sec}\`;
    }, 1000);

    // Speak creepy message
    setTimeout(() => {
      if (window.speechSynthesis) {
        const utter = new SpeechSynthesisUtterance("Lass die Akte ruhen... sonst wirst du es bereuen.");
        utter.lang = 'de-DE';
        utter.pitch = 0.3; // Deep voice
        utter.rate = 0.8;  // Slow
        window.speechSynthesis.speak(utter);
        
        utter.onend = () => {
           endCall(true);
        };
      } else {
         // Fallback timeout
         setTimeout(() => endCall(true), 4000);
      }
    }, 1000);
  };
  
  document.getElementById('btn-call-decline').onclick = () => {
    if (solved) return;
    stopRingtone();
    endCall(false);
  };

  function endCall(accepted) {
    solved = true;
    if (callTimer) clearInterval(callTimer);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    
    document.getElementById('call-actions').style.display = 'none';
    const status = document.getElementById('call-status');
    const waveform = document.getElementById('call-waveform');
    waveform.style.opacity = '0';
    
    status.style.opacity = '1';
    status.style.color = '#ff3b30';
    status.textContent = "Anruf beendet";
    
    setTimeout(() => { 
      overlay.remove(); 
      FX.playSuccessWumms().then(() => onSuccess()); 
    }, 1500);
  }
}
