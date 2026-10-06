/**
 * lockscreen.js - Sperrbildschirm mit Countdown & Vorschau (AP4)
 */

import { getCurrentTimelockStatus, getNext7DaysPreview } from '../timelock.js';
import { showView } from '../main.js';
import { getCurrentTime } from '../clock.js';

let countdownInterval = null;

export function initLockscreen() {
  const btnBack = document.getElementById('btn-lockscreen-back');
  if (btnBack) {
    btnBack.addEventListener('click', () => {
      showView('view-landing');
    });
  }
}

/**
 * Prüft den Status. Wenn spielbar, gibt true zurück.
 * Wenn nicht, rendert es die Lockscreen-Infos und gibt false zurück.
 */
export function checkLockscreenStatus() {
  const status = getCurrentTimelockStatus();
  if (status.isPlayable) {
    stopCountdown();
    return true;
  }
  
  // Nicht spielbar -> rendern und Countdown starten
  renderLockscreen(status);
  startCountdown(status.nextStartTime);
  return false;
}

function renderLockscreen(status) {
  const startInfo = document.getElementById('lockscreen-start-info');
  const previewTable = document.getElementById('lockscreen-preview-table');

  const formatTime = (date) => {
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (targetDate) => {
    const now = getCurrentTime();
    const targetDay = new Date(targetDate);
    targetDay.setHours(0,0,0,0);
    const nowDay = new Date(now);
    nowDay.setHours(0,0,0,0);
    
    const diffDays = Math.round((targetDay.getTime() - nowDay.getTime()) / 86400000);
    
    if (diffDays === 0) return "Heute";
    if (diffDays === 1) return "Morgen";
    
    return targetDay.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
  };

  if (startInfo) {
    startInfo.textContent = `${formatDate(status.nextStartTime)} ab ${formatTime(status.nextStartTime)} Uhr`;
  }

  // 7-Tage Vorschau rendern
  if (previewTable) {
    const preview = getNext7DaysPreview();
    previewTable.innerHTML = '';
    preview.forEach((day, index) => {
      const tr = document.createElement('tr');
      tr.style.borderBottom = index < preview.length - 1 ? '1px solid var(--color-glass-border)' : 'none';
      
      const tdDate = document.createElement('td');
      tdDate.style.padding = 'var(--space-sm) 0';
      tdDate.textContent = formatDate(day.date);
      
      const tdTime = document.createElement('td');
      tdTime.style.padding = 'var(--space-sm) 0';
      tdTime.style.textAlign = 'right';
      tdTime.textContent = formatTime(day.startTime) + ' Uhr';
      
      tr.appendChild(tdDate);
      tr.appendChild(tdTime);
      previewTable.appendChild(tr);
    });
  }
}

function startCountdown(targetDate) {
  stopCountdown();
  
  const el = document.getElementById('lockscreen-countdown');
  if (!el) return;

  const update = () => {
    const now = getCurrentTime();
    const diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) {
      el.textContent = "00:00:00";
      stopCountdown();
      // Automatisch weiterleiten, sobald die Zeit erreicht ist
      import('../main.js').then(module => module.checkRouting());
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    el.textContent = 
      String(hours).padStart(2, '0') + ':' + 
      String(mins).padStart(2, '0') + ':' + 
      String(secs).padStart(2, '0');
  };

  update();
  countdownInterval = setInterval(update, 1000);
}

function stopCountdown() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
}
