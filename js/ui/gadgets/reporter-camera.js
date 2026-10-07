export function runGadget(stationId, onComplete) {
  const overlay = document.createElement('div');
  overlay.id = 'gadget-fullscreen-overlay';
  overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:#111; z-index:9999; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px; box-sizing:border-box; color:white; font-family:sans-serif; text-align:center;';

  overlay.innerHTML = \`
    <h2 style="color:var(--color-night-light); margin-bottom:10px;">Die Kamera des Reporters</h2>
    <p style="margin-bottom:20px; font-size:0.9rem;">Paul Stift leiht dir seine Kamera mit Teleobjektiv. Fokussiere das Objektiv auf den verbrannten Schreibtisch hinter der Polizeiabsperrung!</p>
    
    <div style="position:relative; width:100%; max-width:400px; height:250px; background:#000; border:4px solid #333; border-radius:10px; overflow:hidden; margin-bottom:30px;">
      <div id="camera-viewfinder" style="position:absolute; top:0; left:0; width:100%; height:100%; background:url('assets/hero_hof_night.jpg') center/cover; filter:blur(15px) grayscale(50%); transition:filter 0.1s; transform:scale(1.2);"></div>
      
      <!-- Crosshair -->
      <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:40px; height:40px; border:2px solid rgba(255,0,0,0.5); border-radius:50%;"></div>
      <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:2px; height:10px; background:rgba(255,0,0,0.5);"></div>
      <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:10px; height:2px; background:rgba(255,0,0,0.5);"></div>
    </div>
    
    <p style="font-size:0.8rem; color:#aaa; margin-bottom:10px;">Fokusring drehen:</p>
    <input type="range" id="focus-slider" min="0" max="100" value="0" style="width:80%; max-width:300px; margin-bottom:20px;">
    
    <button class="btn-primary" id="btn-snap-photo" style="opacity:0.5; pointer-events:none;">📸 Foto schießen</button>
  \`;

  document.body.appendChild(overlay);

  const slider = document.getElementById('focus-slider');
  const viewfinder = document.getElementById('camera-viewfinder');
  const btnSnap = document.getElementById('btn-snap-photo');

  const targetFocus = 73; // The exact slider value where it's sharp
  let isFocused = false;

  slider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    const diff = Math.abs(targetFocus - val);
    
    // Blur ranges from 0px (perfect) to 20px (totally blurred)
    let blurAmt = (diff / 100) * 20;
    viewfinder.style.filter = \`blur(\${blurAmt}px) grayscale(50%)\`;

    if (diff < 5) {
      isFocused = true;
      btnSnap.style.opacity = '1';
      btnSnap.style.pointerEvents = 'auto';
      btnSnap.style.boxShadow = '0 0 15px var(--color-green)';
    } else {
      isFocused = false;
      btnSnap.style.opacity = '0.5';
      btnSnap.style.pointerEvents = 'none';
      btnSnap.style.boxShadow = 'none';
    }
  });

  btnSnap.onclick = () => {
    if (!isFocused) return;
    
    // Flash effect
    const flash = document.createElement('div');
    flash.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100%; background:white; z-index:10; pointer-events:none; opacity:1; transition:opacity 0.5s ease-out;';
    viewfinder.appendChild(flash);
    
    // Play shutter sound (optional visual feedback)
    setTimeout(() => { flash.style.opacity = '0'; }, 50);

    setTimeout(() => {
      overlay.innerHTML = \`
        <h2 style="color:var(--color-amber-glow); margin-bottom:20px;">Beweis gesichert!</h2>
        <div style="background:#222; border:1px solid #d4af37; padding:20px; text-align:left; max-width:300px; margin-bottom:20px;">
          <p style="color:#ddd; font-size:0.9rem;">Gestochen scharf! Auf dem Foto erkennst du nicht nur Dokumente, sondern auch eine verdächtige schwarze Limousine, die hastig vom Tatort flüchtet. Das Kennzeichen: <b>HO-KG 1823</b>.</p>
          <p style="color:var(--color-blood-red); font-weight:bold; margin-top:10px; font-size:0.8rem;">Neuer Beweis: Foto der flüchtenden Limousine</p>
        </div>
        <button class="btn-primary" id="btn-camera-done">Zurück zur Tatort-Analyse</button>
      \`;

      document.getElementById('btn-camera-done').onclick = () => {
        import('../../state.js').then(mod => {
          mod.addInventoryItem('foto_gipser_auto');
          document.body.removeChild(overlay);
          onComplete();
        });
      };
    }, 800);
  };
}
