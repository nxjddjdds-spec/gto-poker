export type Rank = "A" | "K" | "Q" | "J" | "T" | "9" | "8" | "7" | "6" | "5" | "4" | "3" | "2";
export type Suit = "s" | "h" | "d" | "c";
export type Position = "UTG" | "HJ" | "CO" | "BTN" | "SB" | "BB";
export type StackDepth = 20 | 40 | 60 | 100 | 200;
export type ActionType = "open" | "vs_open" | "vs_3bet" | "vs_4bet" | "push_fold";

export interface HandAction {
  raise: number;
  call: number;
  fold: number;
  threeBet: number;
  fourBet: number;
  allIn: number;
  ev: number;
  primaryAction: "raise" | "call" | "fold" | "3bet" | "4bet" | "allin";
}

export interface HandData {
  name: string;
  rank1: Rank;
  rank2: Rank;
  suited: boolean;
  pair: boolean;
  actions: Record<ActionType, HandAction>;
}

export interface GTOData {
  stackDepth: StackDepth;
  positions: Record<Position, {
    matrix: HandData[][];
  }>;
}

export interface RecentQuery {
  hand: string;
  position: Position;
  stackDepth: StackDepth;
  actionType: ActionType;
  timestamp: number;
}

export interface Favorite {
  hand: string;
  position: Position;
  label?: string;
}

export interface EquityResult {
  hand1: string;
  hand2: string;
  equity1: number;
  equity2: number;
  tie: number;
}

export type RangeStyle = "TAG" | "LAG" | "NIT" | "EXPLOIT";

export const RANKS: Rank[] = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
export const SUITS: Suit[] = ["s", "h", "d", "c"];
export const POSITIONS: Position[] = ["UTG", "HJ", "CO", "BTN", "SB", "BB"];
export const STACK_DEPTHS: StackDepth[] = [20, 40, 60, 100, 200];
export const ACTION_TYPES: ActionType[] = ["open", "vs_open", "vs_3bet", "vs_4bet", "push_fold"];
export const SUIT_SYMBOLS: Record<Suit, string> = { s: "♠", h: "♥", d: "♦", c: "♣" };
export const SUIT_COLORS: Record<Suit, string> = { s: "#000000", h: "#ef4444", d: "#3b82f6", c: "#22c55e" };
