import { unlockTrackable, isTrackableUnlocked } from '../state.js';
import { getConfig } from '../config-loader.js';
import { playSound } from '../audio.js';
import { showNoirAlert } from '../main.js';
import { updateDossier } from './dossier.js';

export function openTrackableModal() {
  const modal = document.getElementById('tb-modal');
  const input = document.getElementById('tb-code-input');
  const errorMsg = document.getElementById('tb-error-msg');
  if (!modal) return;
  if (input) input.value = '';
  if (errorMsg) errorMsg.textContent = '';
  modal.classList.remove('hidden');
  setTimeout(() => { if (input) input.focus(); }, 100);
}

export function closeTrackableModal() {
  const modal = document.getElementById('tb-modal');
  const input = document.getElementById('tb-code-input');
  const errorMsg = document.getElementById('tb-error-msg');
  if (!modal) return;
  modal.classList.add('hidden');
  if (input) input.value = '';
  if (errorMsg) errorMsg.textContent = '';
}

export function initTrackables() {
  const btnOpen = document.getElementById('btn-open-tb');
  const modal = document.getElementById('tb-modal');
  const btnCloseX = document.getElementById('modal-tb-close');
  const btnCancel = document.getElementById('btn-tb-cancel');
  const btnSubmit = document.getElementById('btn-tb-submit');
  const input = document.getElementById('tb-code-input');
  const errorMsg = document.getElementById('tb-error-msg');

  if (!modal) return;

  if (btnOpen) {
    btnOpen.addEventListener('click', openTrackableModal);
  }
  if (btnCancel) {
    btnCancel.addEventListener('click', closeTrackableModal);
  }
  if (btnCloseX) {
    btnCloseX.addEventListener('click', closeTrackableModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeTrackableModal();
  });

  const submitCode = () => {
    if (!input) return;
    const val = input.value.trim().toUpperCase();
    if (!val) return;

    // Check valid TB codes from config
    const config = getConfig();
    const validTbs = config?.gameplay?.trackables || ['HQZJCG', 'EA99DB', 'CABGEW', 'CARGC7'];
    
    if (validTbs.includes(val)) {
      if (isTrackableUnlocked(val)) {
        if (errorMsg) {
          errorMsg.textContent = 'Diesen Trackable hast du bereits gescannt!';
          errorMsg.style.color = 'var(--color-amber-muted)';
        }
      } else {
        unlockTrackable(val);
        playSound('success');
        closeTrackableModal();
        if (typeof updateDossier === 'function') updateDossier();
        showNoirAlert(`Du hast Trackable ${val} erfolgreich registriert. Der Fund wurde in deiner Ermittlungsakte gespeichert!`, '🔓 TB ENTDECKT');
      }
    } else {
      if (errorMsg) {
        errorMsg.textContent = 'Ungültiger Code. Das System erkennt diese Signatur nicht.';
        errorMsg.style.color = 'var(--color-blood-red)';
      }
    }
  };

  if (btnSubmit) btnSubmit.addEventListener('click', submitCode);
  if (input) {
    input.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') submitCode();
      if (e.key === 'Escape') closeTrackableModal();
    });
  }
}
