import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Position, StackDepth, ActionType, HandData, RecentQuery, Favorite, Rank, Suit, RangeStyle } from "@/lib/types";
import { getHandKey, getMatrixPosition } from "@/lib/poker";
import data20bb from "@/data/20bb.json";
import data40bb from "@/data/40bb.json";
import data60bb from "@/data/60bb.json";
import data100bb from "@/data/100bb.json";
import data200bb from "@/data/200bb.json";

const allData: Record<StackDepth, any> = { 20: data20bb, 40: data40bb, 60: data60bb, 100: data100bb, 200: data200bb };

interface GTOState {
  position: Position; stackDepth: StackDepth; actionType: ActionType; rangeStyle: RangeStyle;
  card1Rank: Rank | null; card1Suit: Suit | null; card2Rank: Rank | null; card2Suit: Suit | null;
  speedInput: string; currentHand: HandData | null; recentQueries: RecentQuery[]; favorites: Favorite[];
  mode: "select" | "speed"; detailOpen: boolean;
  setPosition: (pos: Position) => void; setStackDepth: (depth: StackDepth) => void;
  setActionType: (action: ActionType) => void; setRangeStyle: (style: RangeStyle) => void;
  setCard1: (rank: Rank, suit: Suit) => void; setCard2: (rank: Rank, suit: Suit) => void;
  resetCards: () => void; setSpeedInput: (input: string) => void;
  setMode: (mode: "select" | "speed") => void; setDetailOpen: (open: boolean) => void;
  lookupHand: () => void; addRecentQuery: (query: RecentQuery) => void;
  toggleFavorite: (hand: string, position: Position) => void; clearRecents: () => void;
}

export const useGTOStore = create<GTOState>()(persist((set, get) => ({
  position: "BTN", stackDepth: 100, actionType: "open", rangeStyle: "TAG",
  card1Rank: null, card1Suit: null, card2Rank: null, card2Suit: null, speedInput: "",
  currentHand: null, recentQueries: [], favorites: [], mode: "select", detailOpen: false,
  setPosition: (pos) => { set({ position: pos }); get().lookupHand(); },
  setStackDepth: (depth) => { set({ stackDepth: depth }); get().lookupHand(); },
  setActionType: (action) => { set({ actionType: action }); get().lookupHand(); },
  setRangeStyle: (style) => set({ rangeStyle: style }),
  setCard1: (rank, suit) => { set({ card1Rank: rank, card1Suit: suit }); get().lookupHand(); },
  setCard2: (rank, suit) => { set({ card2Rank: rank, card2Suit: suit }); get().lookupHand(); },
  resetCards: () => set({ card1Rank: null, card1Suit: null, card2Rank: null, card2Suit: null, currentHand: null }),
  setSpeedInput: (input) => set({ speedInput: input }),
  setMode: (mode) => set({ mode }),
  setDetailOpen: (open) => set({ detailOpen: open }),
  lookupHand: () => {
    const { card1Rank, card2Rank, card1Suit, card2Suit, position, stackDepth, actionType } = get();
    if (!card1Rank || !card2Rank) { set({ currentHand: null }); return; }
    const suited = card1Suit === card2Suit && card1Suit !== null && card2Suit !== null;
    const handKey = getHandKey(card1Rank, card2Rank, suited);
    const pos = getMatrixPosition(card1Rank, card2Rank, suited);
    const data = allData[stackDepth];
    if (!data?.positions?.[position]?.matrix) { set({ currentHand: null }); return; }
    const handData = data.positions[position].matrix[pos.row]?.[pos.col];
    set({ currentHand: handData || null });
    if (handData) get().addRecentQuery({ hand: handKey, position, stackDepth, actionType, timestamp: Date.now() });
  },
  addRecentQuery: (query) => {
    const recents = get().recentQueries.filter(r => !(r.hand === query.hand && r.position === query.position && r.stackDepth === query.stackDepth));
    set({ recentQueries: [query, ...recents].slice(0, 20) });
  },
  toggleFavorite: (hand, position) => {
    const favs = get().favorites;
    const exists = favs.find(f => f.hand === hand && f.position === position);
    set({ favorites: exists ? favs.filter(f => !(f.hand === hand && f.position === position)) : [...favs, { hand, position }] });
  },
  clearRecents: () => set({ recentQueries: [] }),
}), {
  name: "gto-poker-storage",
  partialize: (s) => ({ position: s.position, stackDepth: s.stackDepth, actionType: s.actionType, recentQueries: s.recentQueries, favorites: s.favorites, mode: s.mode }),
}));