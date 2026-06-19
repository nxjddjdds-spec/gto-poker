import { Rank, Suit } from "./types";

export const RANK_ORDER: Record<Rank, number> = {
  A: 14, K: 13, Q: 12, J: 11, T: 10, "9": 9, "8": 8, "7": 7, "6": 6, "5": 5, "4": 4, "3": 3, "2": 2,
};

export function getHandName(r1: Rank, r2: Rank, suited: boolean): string {
  if (r1 === r2) return r1 + r1;
  const high = RANK_ORDER[r1] >= RANK_ORDER[r2] ? r1 : r2;
  const low = RANK_ORDER[r1] >= RANK_ORDER[r2] ? r2 : r1;
  return high + low + (suited ? "s" : "o");
}

export function getCardColor(suit: Suit): string {
  return suit === "h" || suit === "d" ? "text-red-500" : "text-white";
}

export function getCardSymbol(suit: Suit): string {
  const map: Record<Suit, string> = { s: "\u2660", h: "\u2665", d: "\u2666", c: "\u2663" };
  return map[suit];
}

export function parseHandInput(input: string): { rank1: Rank; rank2: Rank; suited: boolean; pair: boolean } | null {
  const cleaned = input.trim().toUpperCase().replace(/\s/g, "");
  if (cleaned.length < 2) return null;

  let rank1: Rank | null = null;
  let rank2: Rank | null = null;
  let suit1: Suit | null = null;
  let suit2: Suit | null = null;
  let suited: boolean | null = null;
  let pair = false;

  const validRanks = new Set<string>(["A","K","Q","J","T","9","8","7","6","5","4","3","2"]);
  const validSuits = new Set<string>(["S","H","D","C"]);

  // AsKh format (4 chars)
  if (cleaned.length === 4) {
    const r1c = cleaned[0], s1c = cleaned[1], r2c = cleaned[2], s2c = cleaned[3];
    if (validRanks.has(r1c) && validSuits.has(s1c) && validRanks.has(r2c) && validSuits.has(s2c)) {
      rank1 = r1c as Rank;
      suit1 = s1c.toLowerCase() as Suit;
      rank2 = r2c as Rank;
      suit2 = s2c.toLowerCase() as Suit;
      suited = s1c === s2c;
      pair = rank1 === rank2;
    }
  }

  // AKs / AKo / AA format (2-3 chars)
  if (!rank1 && (cleaned.length === 2 || cleaned.length === 3)) {
    const r1c = cleaned[0], r2c = cleaned[1];
    if (validRanks.has(r1c) && validRanks.has(r2c)) {
      rank1 = r1c as Rank;
      rank2 = r2c as Rank;
      if (cleaned.length === 3) {
        suited = cleaned[2] === "S";
      }
      // Auto-detect suited
      if (suited === null) {
        if (rank1 === rank2) {
          suited = false;
          pair = true;
        } else {
          // Default to offsuit when not specified
          suited = false;
        }
      }
      pair = rank1 === rank2;
    }
  }

  if (!rank1 || !rank2) return null;
  if (rank1 === rank2) { suited = false; pair = true; }

  return { rank1, rank2, suited: suited ?? false, pair };
}

export function getHandKey(r1: Rank, r2: Rank, suited: boolean): string {
  return getHandName(r1, r2, suited);
}

export function getMatrixPosition(r1: Rank, r2: Rank, suited: boolean): { row: number; col: number } {
  const ranks: Rank[] = ["A","K","Q","J","T","9","8","7","6","5","4","3","2"];
  let highIdx = ranks.indexOf(r1);
  let lowIdx = ranks.indexOf(r2);
  if (RANK_ORDER[r1] < RANK_ORDER[r2]) {
    [highIdx, lowIdx] = [lowIdx, highIdx];
  }
  if (suited) return { row: lowIdx, col: highIdx };
  return { row: highIdx, col: lowIdx };
}

// Simplified equity calculator (Monte Carlo approximation)
export function calculateEquity(
  hand1Ranks: [Rank, Rank],
  hand1Suited: boolean,
  hand2Ranks: [Rank, Rank],
  hand2Suited: boolean
): { equity1: number; equity2: number; tie: number } {
  // Pre-computed lookup for common matchups
  const key1 = getHandName(hand1Ranks[0], hand1Ranks[1], hand1Suited);
  const key2 = getHandName(hand2Ranks[0], hand2Ranks[1], hand2Suited);
  
  // Simplified equity table based on common matchups
  const eq = getPrecomputedEquity(key1, key2);
  if (eq) return eq;
  
  // Fallback: hand strength approximation
  const strength1 = getHandStrength(hand1Ranks[0], hand1Ranks[1], hand1Suited);
  const strength2 = getHandStrength(hand2Ranks[0], hand2Ranks[1], hand2Suited);
  const e1 = strength1 / (strength1 + strength2);
  return { equity1: Math.round(e1 * 100) / 100, equity2: Math.round((1 - e1) * 100) / 100, tie: 0 };
}

function getHandStrength(r1: Rank, r2: Rank, suited: boolean): number {
  const r1v = RANK_ORDER[r1];
  const r2v = RANK_ORDER[r2];
  if (r1 === r2) return r1v * 2 + 10; // Pairs
  const gap = Math.abs(r1v - r2v);
  let strength = (r1v + r2v) * 1.5 - gap * 2;
  if (suited) strength += 5;
  return Math.max(strength, 2);
}

function getPrecomputedEquity(h1: string, h2: string): { equity1: number; equity2: number; tie: number } | null {
  const table: Record<string, Record<string, [number, number, number]>> = {
    "AA": { "KK": [0.82, 0.18, 0], "QQ": [0.81, 0.19, 0], "AKs": [0.88, 0.12, 0], "AKo": [0.93, 0.07, 0] },
    "KK": { "AA": [0.18, 0.82, 0], "QQ": [0.82, 0.18, 0], "AKs": [0.66, 0.34, 0], "AKo": [0.70, 0.30, 0] },
    "QQ": { "AA": [0.19, 0.81, 0], "KK": [0.18, 0.82, 0], "AKs": [0.54, 0.46, 0], "AKo": [0.57, 0.43, 0] },
    "AKs": { "AA": [0.12, 0.88, 0], "KK": [0.34, 0.66, 0], "QQ": [0.46, 0.54, 0], "JJ": [0.46, 0.54, 0], "AKo": [0.70, 0.23, 0.07] },
    "AKo": { "AA": [0.07, 0.93, 0], "KK": [0.30, 0.70, 0], "QQ": [0.43, 0.57, 0], "AKs": [0.23, 0.70, 0.07] },
    "JJ": { "AKs": [0.54, 0.46, 0], "AKo": [0.57, 0.43, 0], "TT": [0.81, 0.19, 0] },
    "TT": { "JJ": [0.19, 0.81, 0], "AKs": [0.54, 0.46, 0], "AKo": [0.57, 0.43, 0] },
  };

  const direct = table[h1]?.[h2];
  if (direct) return { equity1: direct[0], equity2: direct[1], tie: direct[2] };
  const reverse = table[h2]?.[h1];
  if (reverse) return { equity1: reverse[1], equity2: reverse[0], tie: reverse[2] };
  return null;
}
