/**
 * dialogue.js - Visual Novel Dialogsystem mit Avataren und dynamischen Verzweigungen
 */

import { getState, unlockSuspectsInState, addSuspectImpact } from '../state.js';
import { showView } from '../main.js';

export let currentTree = null;
export let currentNodeIndex = 0;
export let onDialogComplete = null;
let typewriterTimer = null;
let isTyping = false;
let currentFullText = '';

export function openDialogue(treeData, completeCallback) {
  if (!treeData || !treeData.length) return;
  currentTree = treeData;
  currentNodeIndex = 0;
  onDialogComplete = completeCallback;

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
  
  if (isEnd) {
    const btn = document.createElement('button');
    btn.className = 'btn-primary dialogue-btn';
    btn.textContent = '✓ Gespräch beenden';
    btn.onclick = () => {
      if (unlockSuspects) {
        unlockSuspectsInState();
      }
      if (onDialogComplete) {
        onDialogComplete();
      } else {
        showView('view-dashboard');
      }
    };
    choicesEl.appendChild(btn);
    return;
  }

  if (!choices || choices.length === 0) return;

  choices.forEach(choice => {
    // Check evidence requirement for dynamic branching
    if (choice.requires_evidence) {
      const inv = state.inventory || [];
      if (!inv.includes(choice.requires_evidence)) {
        return; // Hide choice if evidence is missing
      }
    }

    const btn = document.createElement('button');
    btn.className = 'btn-secondary dialogue-btn';
    btn.textContent = choice.text.replace(/{PLAYER_NAME}/g, playerName);
    btn.onclick = () => {
      // Impact verbuchen
      if (choice.impact && choice.impact.suspect && choice.impact.suspect !== 'none') {
        addSuspectImpact(choice.impact.suspect, choice.impact.value);
      }

      // Nächste Node finden
      const nextIndex = currentTree.findIndex(n => n.id === choice.next);
      if (nextIndex !== -1) {
        currentNodeIndex = nextIndex;
        renderNode();
      } else {
        if (onDialogComplete) {
          onDialogComplete();
        } else {
          showView('view-dashboard');
        }
      }
    };
    choicesEl.appendChild(btn);
  });
}
