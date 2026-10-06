import { unlockTrackable, isTrackableUnlocked, getState } from '../state.js';
import { getConfig } from '../config-loader.js';
import { playSound } from '../audio.js';

export function initTrackables() {
  const btnOpen = document.getElementById('btn-open-tb');
  const modal = document.getElementById('tb-modal');
  const btnCancel = document.getElementById('btn-tb-cancel');
  const btnSubmit = document.getElementById('btn-tb-submit');
  const input = document.getElementById('tb-code-input');
  const errorMsg = document.getElementById('tb-error-msg');

  if (!btnOpen || !modal) return;

  btnOpen.addEventListener('click', () => {
    input.value = '';
    errorMsg.textContent = '';
    modal.classList.remove('hidden');
  });

  btnCancel.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  const submitCode = () => {
    const val = input.value.trim().toUpperCase();
    if (!val) return;

    // Check valid TB codes from config
    const validTbs = getConfig().gameplay.trackables;
    
    if (validTbs.includes(val)) {
      if (isTrackableUnlocked(val)) {
        errorMsg.textContent = 'Diesen Trackable hast du bereits gescannt!';
        errorMsg.style.color = 'var(--color-amber-muted)';
      } else {
        unlockTrackable(val);
        playSound('success');
        modal.innerHTML = `
          <div style="background: rgba(0,0,0,0.8); border: 1px solid var(--color-night-light); border-radius: 8px; padding: var(--space-xl); width: 100%; max-width: 400px; text-align: center;">
            <h3 style="color: var(--color-night-light); font-size: 2rem; margin-bottom: var(--space-sm);">🔓 TB ENTDECKT!</h3>
            <p style="color: #fff; margin-bottom: var(--space-lg);">Du hast Trackable <strong>${val}</strong> erfolgreich gescannt. Der Fund wurde in deiner Ermittlungsakte gespeichert.</p>
            <button class="btn-primary" onclick="document.getElementById('tb-modal').classList.add('hidden'); location.reload();">Schließen</button>
          </div>
        `;
      }
    } else {
      errorMsg.textContent = 'Ungültiger Code. Das System erkennt diese Signatur nicht.';
      errorMsg.style.color = 'var(--color-blood-red)';
    }
  };

  btnSubmit.addEventListener('click', submitCode);
  input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') submitCode();
  });
}
