/**
 * answers.js - Fehlertolerante Vor-Ort-Rätsel Auswertung (AP8)
 */

export function normalize(text) {
  if (typeof text !== 'string') return '';
  return text.toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function levenshtein(a, b) {
  const m = [];
  for (let i = 0; i <= b.length; i++) { m[i] = [i]; }
  for (let j = 0; j <= a.length; j++) { m[0][j] = j; }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        m[i][j] = m[i - 1][j - 1];
      } else {
        m[i][j] = Math.min(m[i - 1][j - 1] + 1, Math.min(m[i][j - 1] + 1, m[i - 1][j] + 1));
      }
    }
  }
  return m[b.length][a.length];
}

export function checkAnswer(input, validAnswers) {
  const normInput = normalize(input);
  
  for (const valid of validAnswers) {
    const normValid = normalize(valid);
    
    if (normInput === normValid) return true;
    
    if (normValid.length >= 5) {
      if (levenshtein(normInput, normValid) <= 1) {
        return true;
      }
    }
    
    if (normInput.includes(normValid) && normValid.length >= 3) {
        return true;
    }
  }
  return false;
}
