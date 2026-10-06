/**
 * scoring.js - Finale Täter-Ermittlung (AP10)
 *
 * Wertet die Verdächtigen-Punkte und die abgelaufenen Zonen aus,
 * um den finalen Täter zu bestimmen.
 */

export function calculateFinalResult(state) {
  const scores = state.suspectScores || { herold: 0, gipser: 0, heiden: 0 };
  
  let suspects = [
    { id: 'herold', score: scores.herold },
    { id: 'gipser', score: scores.gipser },
    { id: 'heiden', score: scores.heiden }
  ];
  
  // Sort descending
  suspects.sort((a, b) => b.score - a.score);
  
  // Check for tie
  let isTie = suspects[0].score === suspects[1].score;
  let murderer = suspects[0].id;
  
  // Tie-Breaker: Zonen-Auswertung (Simuliert: Saale = Heiden, Altstadt = Herold, Neustadt = Gipser)
  if (isTie) {
    const zs = state.zoneScores || {};
    let tieBreaker = {
      herold: zs.altstadt || 0,
      gipser: zs.neustadt || 0,
      heiden: zs.saale || 0
    };
    
    // If tie between top 2, pick the one with highest tieBreaker score
    let top1 = suspects[0];
    let top2 = suspects[1];
    if (tieBreaker[top1.id] > tieBreaker[top2.id]) {
      murderer = top1.id;
    } else if (tieBreaker[top2.id] > tieBreaker[top1.id]) {
      murderer = top2.id;
    } else {
      // Ultimate fallback: Random between top 2
      murderer = Math.random() > 0.5 ? top1.id : top2.id;
    }
  }

  // Calculate percentages
  const total = suspects.reduce((sum, s) => sum + s.score, 0) || 1; // avoid / 0
  const percentages = {
    herold: Math.round((scores.herold / total) * 100),
    gipser: Math.round((scores.gipser / total) * 100),
    heiden: Math.round((scores.heiden / total) * 100)
  };

  return {
    murderer,
    suspects,
    percentages,
    totalScore: state.score || 0
  };
}
