/**
 * dialogue.js - Visual Novel Dialogsystem mit Avataren und dynamischen Verzweigungen
 */

import { getState, unlockSuspectsInState, addSuspectImpact, getPlayerRank, addScore } from '../state.js';
import { showView } from '../main.js';
import * as FX from '../fx.js';
import { duckBGM } from '../audio.js';

export let currentTree = null;
export let currentNodeIndex = 0;
export let onDialogComplete = null;
let typewriterTimer = null;
let isTyping = false;
let currentFullText = '';
let currentSuspectId = null;

export function openDialogue(treeData, completeCallback) {
  if (!treeData || !treeData.length) return;
  currentTree = treeData;
  currentNodeIndex = 0;
  onDialogComplete = completeCallback;
  currentSuspectId = null;

  // Determine if this is a main suspect to play theme
  const firstNode = treeData[0];
  if (firstNode.speaker.includes('Herold')) currentSuspectId = 'herold';
  if (firstNode.speaker.includes('Gipser')) currentSuspectId = 'gipser';
  if (firstNode.speaker.includes('Heiden')) currentSuspectId = 'heiden';
  
  if (currentSuspectId) {
    FX.playCharacterTheme(currentSuspectId);
    duckBGM(true);
  }

  // Start particles if it's the rathaus (e.g. fire/ash)
  if (firstNode.speaker.includes('Stahl') || firstNode.speaker.includes('Stift')) {
    FX.startAshParticles();
  }

  // Zeige die View
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  document.getElementById('view-dialogue').classList.remove('hidden');

  renderNode();
}

function renderNode() {
  if (!currentTree || !currentTree[currentNodeIndex]) return;
  const node = currentTree[currentNodeIndex];
  const state = getState();
  const playerName = state.playerName || 'Ermittler';
  
  const avatarEl = document.getElementById('dialogue-avatar');
  const nameEl = document.getElementById('dialogue-name');
  const textEl = document.getElementById('dialogue-text');
  const choicesEl = document.getElementById('dialogue-choices');
  
  avatarEl.src = node.avatar || 'assets/avatar.jpg';
  avatarEl.style.display = 'block';

  nameEl.textContent = (node.speaker || 'Unbekannt').replace(/{PLAYER_NAME}/g, playerName);
  
  // Text formatieren
  currentFullText = (node.text || '').replace(/{PLAYER_NAME}/g, playerName);
  textEl.innerHTML = '';
  choicesEl.innerHTML = '';
  
  if (typewriterTimer) clearTimeout(typewriterTimer);
  isTyping = true;
  let charIndex = 0;

  function typeWriter() {
    if (charIndex < currentFullText.length) {
      textEl.innerHTML += currentFullText.charAt(charIndex);
      charIndex++;
      typewriterTimer = setTimeout(typeWriter, 18);
    } else {
      isTyping = false;
      renderChoices(node.choices, node.isEnd, node.unlockSuspects);
    }
  }

  // Ermögliche Klick auf Dialogbox zum Überspringen des Tipp-Effekts
  const dialogueBox = textEl.closest('.dialogue-box') || textEl;
  dialogueBox.onclick = () => {
    if (isTyping) {
      if (typewriterTimer) clearTimeout(typewriterTimer);
      textEl.innerHTML = currentFullText;
      isTyping = false;
      renderChoices(node.choices, node.isEnd, node.unlockSuspects);
    }
  };

  typeWriter();
}

function renderChoices(choices, isEnd, unlockSuspects) {
  const choicesEl = document.getElementById('dialogue-choices');
  choicesEl.innerHTML = '';
  const state = getState();
  const playerName = state.playerName || 'Ermittler';
  
  const playerAvatarWrap = document.createElement('div');
  playerAvatarWrap.style = "display:flex; align-items:flex-end; gap: 10px; margin-top: 15px;";
  
  const playerAvatar = document.createElement('img');
  playerAvatar.src = 'assets/kommissar_stahl.jpg';
  playerAvatar.style = "width: 50px; height: 50px; border-radius: 50%; border: 2px solid var(--color-amber-muted); object-fit: cover; flex-shrink: 0;";
  
  const choicesContainer = document.createElement('div');
  choicesContainer.style = "display: flex; flex-direction: column; gap: 10px; flex-grow: 1;";

  playerAvatarWrap.appendChild(playerAvatar);
  playerAvatarWrap.appendChild(choicesContainer);
  choicesEl.appendChild(playerAvatarWrap);
  
  const finishDialogue = () => {
    if (currentSuspectId) {
      FX.stopCharacterTheme();
      duckBGM(false);
    }
    FX.stopAshParticles();
    
    if (unlockSuspects) {
      unlockSuspectsInState();
    }
    const node = currentTree[currentNodeIndex];
    if (node.reward) {
      import('../state.js').then(mod => {
        mod.addInventoryItem(node.reward);
        mod.addScore(15); // +15 Bonus Punkte für das Finden eines Beweises
        import('../main.js').then(m => m.showNoirAlert('Neuer Beweis gefunden! (+15 Kommissarpunkte)', 'Erfolg'));
      });
    } else {
      addScore(10); // Standard +10 Punkte für ein abgeschlossenes Verhör
    }
    if (onDialogComplete) {
      onDialogComplete();
    } else {
      showView('view-dashboard');
    }
  };
  
  if (isEnd) {
    const btn = document.createElement('button');
    btn.className = 'btn-primary dialogue-btn';
    btn.textContent = '✓ Gespräch beenden';
    btn.onclick = () => finishDialogue();
    choicesContainer.appendChild(btn);
    return;
  }

  if (!choices || choices.length === 0) {
    playerAvatarWrap.style.display = 'none';
    return;
  }

  choices.forEach(choice => {
    // Check evidence requirement for dynamic branching
    if (choice.requires_evidence) {
      const rank = getPlayerRank();
      if (rank.level >= 3) {
        const inv = state.inventory || [];
        if (!inv.includes(choice.requires_evidence)) {
          return; // Hide choice if evidence is missing (Disadvantage of high rank!)
        }
      }
    }

    const btn = document.createElement('button');
    btn.className = 'btn-secondary dialogue-btn';
    btn.textContent = choice.text.replace(/{PLAYER_NAME}/g, playerName);
    btn.onclick = () => {
      // Animation & Haptik
      btn.classList.add('shake-animation');
      setTimeout(() => btn.classList.remove('shake-animation'), 300);
      
      // Impact verbuchen
      if (choice.impact && choice.impact.suspect && choice.impact.suspect !== 'none') {
        addSuspectImpact(choice.impact.suspect, choice.impact.value);
        addScore(choice.impact.value); // Gleiche Menge an Kommissarpunkten wie Verdachts-Impact!
        import('../main.js').then(m => m.showNoirAlert(`Clevere Deduktion! (+${choice.impact.value} Punkte)`, 'Treffer'));
        if (FX.playHeavySnap) FX.playHeavySnap(); // Audio feedback for important choices
      }

      // Nächste Node finden
      const nextIndex = currentTree.findIndex(n => n.id === choice.next);
      if (nextIndex !== -1) {
        setTimeout(() => {
          currentNodeIndex = nextIndex;
          renderNode();
        }, 150); // slight delay to feel the button click
      } else {
        finishDialogue();
      }
    };
    choicesContainer.appendChild(btn);
  });
}
