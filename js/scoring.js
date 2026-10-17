/**
 * scoring.js - Finale Täter-Ermittlung (AP10)
 *
 * Wertet die Verdächtigen-Punkte und die abgelaufenen Zonen aus,
 * um den finalen Täter zu bestimmen.
 */

import { getPlayerRank } from './state.js';

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
      // Kanonischer Fallback: Herold ist der Mastermind im Geocache
      murderer = (top1.id === 'herold' || top2.id === 'herold') ? 'herold' : top1.id;
    }
  }

  // Kommissarrang einbeziehen:
  // Mit steigendem Rang schärft sich der Ermittlerfokus (Grundrauschen base sinkt)
  // und der Hauptverdächtige wird dank meisterhafter Deduktion glasklar überführt.
  const rank = getPlayerRank();
  const rankLevel = (rank && rank.level) ? rank.level : 1;

  // Grundunschärfe nimmt mit Rang ab (von 28 bei Rang 1 bis 4 bei Rang 5)
  const base = Math.max(4, 28 - (rankLevel - 1) * 6);

  const topSuspectId = murderer;
  const totalRaw = (scores.herold || 0) + (scores.gipser || 0) + (scores.heiden || 0);
  const secondScore = suspects.find(s => s.id !== topSuspectId)?.score || 0;
  const topScore = scores[topSuspectId] || 0;
  const lead = Math.max(0, topScore - secondScore);
  const rankRatio = (rankLevel - 1) / 4.0; // 0.0 bei Rang 1 bis 1.0 bei Rang 5

  // Ermittlungs-Fokusbonus für den führenden Verdächtigen:
  // Skaliert dynamisch mit der Gesamtpunktzahl, sodass auch bei 300-500 Punkten im Endgame
  // ein Meister-Ermittler (Sherlock) eine glasklare Beweislast von 60% - 75% erzielt.
  const rankFocusBonus = Math.round(
    ((totalRaw * 0.45) + 30) * rankRatio + (lead * 1.0 * rankRatio)
  );

  // Falsche Fährten bei den unschuldigen Verdächtigen verblassen durch Meister-Deduktion
  const discountFactor = 0.25 * rankRatio;

  let heroldPoints = Math.max(0, base + (topSuspectId === 'herold' ? scores.herold + rankFocusBonus : scores.herold * (1 - discountFactor)));
  let gipserPoints = Math.max(0, base + (topSuspectId === 'gipser' ? scores.gipser + rankFocusBonus : scores.gipser * (1 - discountFactor)));
  let heidenPoints = Math.max(0, base + (topSuspectId === 'heiden' ? scores.heiden + rankFocusBonus : scores.heiden * (1 - discountFactor)));
  
  const totalPoints = heroldPoints + gipserPoints + heidenPoints;
  let percentages = { herold: 33, gipser: 33, heiden: 34 };
  
  if (totalPoints > 0) {
    percentages.herold = Math.round((heroldPoints / totalPoints) * 100);
    percentages.gipser = Math.round((gipserPoints / totalPoints) * 100);
    percentages.heiden = Math.max(0, 100 - percentages.herold - percentages.gipser);
  }

  // Sicherheitsgarantie für Sherlock Holmes (Rang 5):
  // Wenn der Spieler Rang 5 erreicht hat, muss der Top-Verdächtige mindestens 60% erreichen
  if (rankLevel >= 5 && percentages[topSuspectId] < 60) {
    const diff = 60 - percentages[topSuspectId];
    percentages[topSuspectId] = 60;
    const others = ['herold', 'gipser', 'heiden'].filter(id => id !== topSuspectId);
    let p0 = Math.max(0, percentages[others[0]] - Math.ceil(diff / 2));
    let p1 = Math.max(0, 100 - 60 - p0);
    percentages[others[0]] = p0;
    percentages[others[1]] = p1;
  }

  return {
    murderer,
    suspects,
    percentages,
    totalScore: state.score || 0,
    rank
  };
}
