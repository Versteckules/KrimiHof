/**
 * intro.js - Atmosphärische Bilderstory & Fall-Prolog vor Ermittlungsbeginn
 */

import { getState } from '../state.js';
import { showView } from '../main.js';
import { duckBGM } from '../audio.js';

let currentSlideIndex = 0;
let onIntroCompleteCallback = null;
let currentIntroAudio = null;

export function stopSlideAudio() {
  if (currentIntroAudio) {
    currentIntroAudio.pause();
    currentIntroAudio = null;
  }
  duckBGM(false);
}

function playSlideAudio(audioSrc) {
  stopSlideAudio();
  const isMuted = localStorage.getItem('krimi_voice_muted') === 'true';
  if (!audioSrc || isMuted) return;

  currentIntroAudio = new Audio(audioSrc);
  duckBGM(true);
  currentIntroAudio.play().catch(e => {
    console.log('[Intro Audio] Playback prevented:', e);
  });
  currentIntroAudio.onended = () => {
    duckBGM(false);
  };
}

const slides = [
  {
    image: 'assets/intro_fire_1823.jpg',
    badge: 'KAPITEL 1 • HISTORIE',
    title: '4. September 1823 — Die Flammen von Hof',
    text: 'Ein verheerendes Feuer vernichtet über zweihundert Häuser der Hofer Altstadt. Was die Chroniken als tragisches Unglück verzeichneten, war in Wahrheit der Deckmantel für einen ruchlosen Geheimvertrag: Den <strong>„Pakt der Schlappen-Erben“</strong>. Einflussreiche Patrizier nutzten die Feuersbrunst, um sich heimlich wertvollste Ländereien und Privilegien anzueignen.',
    audio: 'assets/audio/story/intro_slide_1.mp3'
  },
  {
    image: 'assets/intro_archive.jpg',
    badge: 'KAPITEL 2 • DAS GEHEIMNIS',
    title: 'Gestern Abend — Der Fund im Kellergewölbe',
    text: 'Zwei Jahrhunderte später stieß der Hofer Stadtarchivar Dr. Renger im Gewölbe unter dem Rathaus auf die originalen Urkunden des Pakts. Doch bevor er die Beweise vorlegen konnte, wurde sein Büro verwüstet, die Geheimakten geraubt – und von Dr. Renger fehlt jede Spur! Nur eine panische Sprachnachricht blieb auf deinem Anrufbeantworter.',
    audio: 'assets/audio/story/intro_slide_2.mp3'
  },
  {
    image: 'assets/intro_crime_scene.jpg',
    badge: 'KAPITEL 3 • DER ANSCHLAG',
    title: 'Heute Nacht — Tatort Rathaus',
    text: 'Feueralarm im Rathaus! Dichter Rauch quillt aus dem Portal, Blaulicht zerschneidet den Regen, Absperrband flattert im Wind. Brandbeschleuniger wurde am Eichenportal verschüttet! Jemand will um jeden Preis verhindern, dass die Wahrheit über die Schlappen-Erben ans Tageslicht gelangt.',
    audio: 'assets/audio/story/intro_slide_3.mp3'
  },
  {
    image: 'assets/hero_hof_night.jpg',
    badge: 'DEIN AUFTRAG • JETZT ERMITTELN',
    title: 'Ermittler {PLAYER_NAME}, übernehmen Sie!',
    text: 'Deine Jagd beginnt am Rathaus. Sichere Spuren an 12 Stationen quer durch das nächtliche Hof, befrage Zeugen und konfrontiere die drei Hauptverdächtigen. Entlarve den wahren Täter vor dem Morgengrauen – bevor alle Spuren für immer verglimmen!',
    audio: 'assets/audio/story/intro_slide_4.mp3'
  }
];

export function initIntro() {
  const btnNext = document.getElementById('btn-intro-next');
  const btnPrev = document.getElementById('btn-intro-prev');
  const btnSkip = document.getElementById('btn-intro-skip');

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      stopSlideAudio();
      if (currentSlideIndex < currentSlides.length - 1) {
        currentSlideIndex++;
        renderSlide();
      } else {
        finishIntro();
      }
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      stopSlideAudio();
      if (currentSlideIndex > 0) {
        currentSlideIndex--;
        renderSlide();
      }
    });
  }

  if (btnSkip) {
    btnSkip.addEventListener('click', () => {
      stopSlideAudio();
      finishIntro();
    });
  }
}

let currentSlides = [];

export function openIntro(onComplete, customSlides) {
  currentSlideIndex = 0;
  onIntroCompleteCallback = onComplete || null;
  currentSlides = customSlides || slides;
  renderSlide();
  showView('view-intro');
}

function renderSlide() {
  const slide = currentSlides[currentSlideIndex];

  const state = getState();
  const playerName = state.playerName || 'Ermittler';

  const imgEl = document.getElementById('intro-slide-img');
  const badgeEl = document.getElementById('intro-slide-badge');
  const titleEl = document.getElementById('intro-slide-title');
  const textEl = document.getElementById('intro-slide-text');
  const btnNext = document.getElementById('btn-intro-next');
  const btnPrev = document.getElementById('btn-intro-prev');
  const dotsContainer = document.getElementById('intro-indicators');

  if (imgEl) {
    imgEl.style.opacity = '0';
    setTimeout(() => {
      imgEl.src = slide.image;
      imgEl.style.opacity = '1';
    }, 150);
  }

  if (badgeEl) badgeEl.textContent = slide.badge;
  if (titleEl) titleEl.innerHTML = slide.title.replace(/{PLAYER_NAME}/g, playerName);
  if (textEl) textEl.innerHTML = slide.text.replace(/{PLAYER_NAME}/g, playerName);

  if (btnPrev) {
    btnPrev.style.visibility = currentSlideIndex === 0 ? 'hidden' : 'visible';
  }

  if (btnNext) {
    if (currentSlideIndex === currentSlides.length - 1) {
      btnNext.innerHTML = '🔍 Ermittlung am Tatort aufnehmen';
      btnNext.classList.add('pulse');
    } else {
      btnNext.innerHTML = 'Weiter ›';
      btnNext.classList.remove('pulse');
    }
  }

  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    currentSlides.forEach((_, idx) => {
      const dot = document.createElement('span');
      dot.className = 'intro-dot' + (idx === currentSlideIndex ? ' active' : '');
      dot.onclick = () => {
        stopSlideAudio();
        currentSlideIndex = idx;
        renderSlide();
      };
      dotsContainer.appendChild(dot);
    });
  }

  // Audio für aktuellen Slide abspielen
  if (slide.audio) {
    playSlideAudio(slide.audio);
  } else {
    stopSlideAudio();
  }
}

function finishIntro() {
  stopSlideAudio();
  if (onIntroCompleteCallback) {
    onIntroCompleteCallback();
  } else {
    window.dispatchEvent(new Event('requestRouting'));
  }
}
