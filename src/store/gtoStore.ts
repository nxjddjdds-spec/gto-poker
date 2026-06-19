import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Position, StackDepth, ActionType, HandData, RecentQuery, Favorite,
  Rank, Suit, RangeStyle,
} from "@/lib/types";
import { getHandName, getHandKey, getMatrixPosition } from "@/lib/poker";

interface GTOState {
  // Selection state
  position: Position;
  stackDepth: StackDepth;
  actionType: ActionType;
  rangeStyle: RangeStyle;
  
  // Card selection
  card1Rank: Rank | null;
  card1Suit: Suit | null;
  card2Rank: Rank | null;
  card2Suit: Suit | null;
  speedInput: string;
  
  // Data
  gtoData: Record<StackDepth, any>;
  currentHand: HandData | null;
  
  // History & Favorites
  recentQueries: RecentQuery[];
  favorites: Favorite[];
  
  // UI state
  mode: "select" | "speed";
  detailOpen: boolean;
  
  // Actions
  setPosition: (pos: Position) => void;
  setStackDepth: (depth: StackDepth) => void;
  setActionType: (action: ActionType) => void;
  setRangeStyle: (style: RangeStyle) => void;
  setCard1: (rank: Rank, suit: Suit) => void;
  setCard2: (rank: Rank, suit: Suit) => void;
  resetCards: () => void;
  setSpeedInput: (input: string) => void;
  setMode: (mode: "select" | "speed") => void;
  setDetailOpen: (open: boolean) => void;
  
  // Computed
  lookupHand: () => void;
  addRecentQuery: (query: RecentQuery) => void;
  toggleFavorite: (hand: string, position: Position) => void;
  clearRecents: () => void;
  
  loadData: (depth: StackDepth) => Promise<void>;
}

export const useGTOStore = create<GTOState>()(
  persist(
    (set, get) => ({
      position: "BTN",
      stackDepth: 100,
      actionType: "open",
      rangeStyle: "TAG",
      card1Rank: null,
      card1Suit: null,
      card2Rank: null,
      card2Suit: null,
      speedInput: "",
      gtoData: {} as Record<StackDepth, any>,
      currentHand: null,
      recentQueries: [],
      favorites: [],
      mode: "select",
      detailOpen: false,

      setPosition: (pos) => { set({ position: pos }); get().lookupHand(); },
      setStackDepth: (depth) => { set({ stackDepth: depth }); get().loadData(depth); },
      setActionType: (action) => { set({ actionType: action }); get().lookupHand(); },
      setRangeStyle: (style) => set({ rangeStyle: style }),
      
      setCard1: (rank, suit) => { set({ card1Rank: rank, card1Suit: suit }); get().lookupHand(); },
      setCard2: (rank, suit) => { set({ card2Rank: rank, card2Suit: suit }); get().lookupHand(); },
      resetCards: () => set({ card1Rank: null, card1Suit: null, card2Rank: null, card2Suit: null, currentHand: null }),
      
      setSpeedInput: (input) => set({ speedInput: input }),
      setMode: (mode) => set({ mode }),
      setDetailOpen: (open) => set({ detailOpen: open }),

      lookupHand: () => {
        const { card1Rank, card2Rank, card1Suit, card2Suit, position, stackDepth, actionType, gtoData } = get();
        if (!card1Rank || !card2Rank) { set({ currentHand: null }); return; }
        
        const suited = card1Suit === card2Suit && card1Suit !== null && card2Suit !== null;
        const handKey = getHandKey(card1Rank, card2Rank, suited);
        const pos = getMatrixPosition(card1Rank, card2Rank, suited);
        
        const data = gtoData[stackDepth];
        if (!data?.positions?.[position]?.matrix) { set({ currentHand: null }); return; }
        
        const handData = data.positions[position].matrix[pos.row]?.[pos.col];
        set({ currentHand: handData || null });
        
        if (handData) {
          const query: RecentQuery = {
            hand: handKey,
            position,
            stackDepth,
            actionType,
            timestamp: Date.now(),
          };
          get().addRecentQuery(query);
        }
      },

      addRecentQuery: (query) => {
        const recents = get().recentQueries.filter(
          r => !(r.hand === query.hand && r.position === query.position && r.stackDepth === query.stackDepth)
        );
        set({ recentQueries: [query, ...recents].slice(0, 20) });
      },

      toggleFavorite: (hand, position) => {
        const favs = get().favorites;
        const exists = favs.find(f => f.hand === hand && f.position === position);
        if (exists) {
          set({ favorites: favs.filter(f => !(f.hand === hand && f.position === position)) });
        } else {
          set({ favorites: [...favs, { hand, position }] });
        }
      },

      clearRecents: () => set({ recentQueries: [] }),
      
      loadData: async (depth) => {
        if (get().gtoData[depth]) return;
        try {
          const data = await import(`@/data/${depth}bb.json`);
          set(s => ({ gtoData: { ...s.gtoData, [depth]: data } }));
          get().lookupHand();
        } catch (e) {
          console.error("Failed to load GTO data:", e);
        }
      },
    }),
    {
      name: "gto-poker-storage",
      partialize: (state) => ({
        position: state.position,
        stackDepth: state.stackDepth,
        actionType: state.actionType,
        recentQueries: state.recentQueries,
        favorites: state.favorites,
        mode: state.mode,
      }),
    }
  )
);
