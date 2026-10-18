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
    { id: 'herold', score: scores.herold || 0 },
    { id: 'gipser', score: scores.gipser || 0 },
    { id: 'heiden', score: scores.heiden || 0 }
  ];
  
  // Sort descending
  suspects.sort((a, b) => b.score - a.score);
  
  const top1 = suspects[0];
  const top2 = suspects[1];
  const top3 = suspects[2];
  
  const lead = top1.score - top2.score;
  const isTie = lead === 0;
  let murderer = top1.id;
  
  // Tie-Breaker: Zuweisung von Beweisen & Zonen-Auswertung
  if (isTie) {
    const assigned = state.assignedEvidence || {};
    const evCounts = { herold: 0, gipser: 0, heiden: 0 };
    Object.values(assigned).forEach(sId => {
      if (evCounts[sId] !== undefined) evCounts[sId]++;
    });

    if (evCounts[top1.id] > evCounts[top2.id]) {
      murderer = top1.id;
    } else if (evCounts[top2.id] > evCounts[top1.id]) {
      murderer = top2.id;
    } else {
      const zs = state.zoneScores || {};
      let tieBreaker = {
        herold: zs.altstadt || 0,
        gipser: zs.neustadt || 0,
        heiden: zs.saale || 0
      };
      if (tieBreaker[top1.id] > tieBreaker[top2.id]) {
        murderer = top1.id;
      } else if (tieBreaker[top2.id] > tieBreaker[top1.id]) {
        murderer = top2.id;
      } else {
        murderer = top1.id;
      }
    }
  }

  // Kommissarrang einbeziehen
  const rank = getPlayerRank();
  const rankLevel = (rank && rank.level) ? rank.level : 1;
  const rankRatio = Math.min(1.0, Math.max(0.0, (rankLevel - 1) / 4.0));
  const solvedCount = (state.solvedStations || []).length;
  const totalRaw = top1.score + top2.score + top3.score;

  let percentages = { herold: 33, gipser: 33, heiden: 34 };

  if (totalRaw > 0) {
    if (lead === 0) {
      if (top2.score === top3.score) {
        percentages = { herold: 33, gipser: 33, heiden: 34 };
      } else {
        const p3 = Math.max(10, Math.round((top3.score / totalRaw) * 100 * 0.7));
        const rem = 100 - p3;
        const p1 = Math.floor(rem / 2);
        const p2 = rem - p1;
        percentages[top1.id] = p1;
        percentages[top2.id] = p2;
        percentages[top3.id] = p3;
      }
    } else {
      const leadRatio = Math.min(1.0, lead / Math.max(20, top2.score));
      const rawShare = top1.score / totalRaw;
      
      // Bei klarer Beweislage (ab 12 Pkt Vorsprung oder im Endgame ab 8 Pkt Vorsprung)
      // erreicht der Führende zuverlässig über 50% und über die 55%-Haftbefehlsschwelle (56% bis 75%)
      let targetTopPerc;
      if (lead >= 12 || (solvedCount >= 8 && lead >= 8)) {
        targetTopPerc = Math.min(75, Math.round(56 + (leadRatio * 10) + (rankRatio * 9)));
      } else {
        targetTopPerc = Math.min(54, Math.round(38 + (rawShare * 20) + (leadRatio * 10)));
      }

      // Sicherheitsgarantie für Sherlock Holmes (Rang 5) bei Führung:
      if (rankLevel >= 5 && lead > 0) {
        targetTopPerc = Math.max(60, targetTopPerc);
      }

      const remPoints = 100 - targetTopPerc;
      const otherTotal = top2.score + top3.score;
      let p2 = otherTotal > 0 ? Math.round((top2.score / otherTotal) * remPoints) : Math.floor(remPoints / 2);
      let p3 = remPoints - p2;

      percentages[top1.id] = targetTopPerc;
      percentages[top2.id] = p2;
      percentages[top3.id] = p3;
    }
  }

  return {
    murderer,
    suspects,
    percentages,
    totalScore: state.score || 0,
    rank
  };
}

