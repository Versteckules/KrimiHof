export let currentTree = null;
export let currentNodeIndex = 0;
export let onDialogComplete = null;

export function openDialogue(treeData, completeCallback) {
  currentTree = treeData;
  currentNodeIndex = 0;
  onDialogComplete = completeCallback;

  // Zeige die View
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  document.getElementById('view-dialogue').classList.remove('hidden');

  renderNode();
}

function renderNode() {
  const node = currentTree[currentNodeIndex];
  
  const avatarEl = document.getElementById('dialogue-avatar');
  const nameEl = document.getElementById('dialogue-name');
  const textEl = document.getElementById('dialogue-text');
  const choicesEl = document.getElementById('dialogue-choices');
  
  if (node.avatar) {
    avatarEl.src = node.avatar;
    avatarEl.style.display = 'block';
  } else {
    avatarEl.style.display = 'none';
  }

  nameEl.textContent = node.speaker || 'Unbekannt';
  
  // Effekt: Text schrittweise einblenden
  textEl.innerHTML = '';
  let i = 0;
  choicesEl.innerHTML = ''; // Leeren

  function typeWriter() {
    if (i < node.text.length) {
      textEl.innerHTML += node.text.charAt(i);
      i++;
      setTimeout(typeWriter, 20);
    } else {
      renderChoices(node.choices, node.isEnd, node.unlockSuspects);
    }
  }
  typeWriter();
}

function renderChoices(choices, isEnd, unlockSuspects) {
  const choicesEl = document.getElementById('dialogue-choices');
  
  if (isEnd) {
    const btn = document.createElement('button');
    btn.className = 'btn-primary dialogue-btn';
    btn.textContent = 'Gespräch beenden';
    btn.onclick = () => {
      if (unlockSuspects) {
         // Suspects freischalten Logic (State aktualisieren)
         import('../state.js').then(module => {
            module.unlockSuspectsInState();
         });
      }
      if (onDialogComplete) onDialogComplete();
    };
    choicesEl.appendChild(btn);
    return;
  }

  if (!choices) return;

  choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.className = 'btn-secondary dialogue-btn';
    btn.textContent = choice.text;
    btn.onclick = () => {
      // Impact verbuchen
      if (choice.impact && choice.impact.suspect !== 'none') {
        import('../state.js').then(module => {
           module.addSuspectImpact(choice.impact.suspect, choice.impact.value);
        });
      }

      // Nächste Node finden
      const nextIndex = currentTree.findIndex(n => n.id === choice.next);
      if (nextIndex !== -1) {
        currentNodeIndex = nextIndex;
        renderNode();
      } else {
        if (onDialogComplete) onDialogComplete();
      }
    };
    choicesEl.appendChild(btn);
  });
}
