"use client";

import { useState } from "react";
import { useGTOStore } from "@/store/gtoStore";
import { RANKS, SUITS, SUIT_SYMBOLS, Rank, Suit } from "@/lib/types";

const suitColors: Record<Suit, string> = {
  s: "text-gray-300",
  h: "text-red-500",
  d: "text-blue-400",
  c: "text-green-400",
};

export function CardSelector() {
  const card1Rank = useGTOStore(s => s.card1Rank);
  const card1Suit = useGTOStore(s => s.card1Suit);
  const card2Rank = useGTOStore(s => s.card2Rank);
  const card2Suit = useGTOStore(s => s.card2Suit);
  const setCard1 = useGTOStore(s => s.setCard1);
  const setCard2 = useGTOStore(s => s.setCard2);
  const resetCards = useGTOStore(s => s.resetCards);

  // activeSlot: 1 or 2 - which card we're currently selecting
  const [activeSlot, setActiveSlot] = useState<1 | 2>(1);

  const rankColor = (suit: Suit | null) =>
    suit === "h" || suit === "d" ? "text-red-400" : "text-white";

  function handleRankClick(rank: Rank) {
    if (activeSlot === 1) {
      setCard1(rank, card1Suit || "s");
    } else {
      setCard2(rank, card2Suit || "s");
    }
  }

  function handleSuitClick(suit: Suit) {
    if (activeSlot === 1) {
      setCard1(card1Rank || "A", suit);
    } else {
      setCard2(card2Rank || "A", suit);
    }
  }

  const c1Complete = card1Rank && card1Suit;
  const c2Complete = card2Rank && card2Suit;
  const allDone = c1Complete && c2Complete;

  return (
    <div className="space-y-4">
      {/* Two card displays */}
      <div className="flex gap-4 justify-center items-center">
        {/* Card 1 */}
        <button
          onClick={() => setActiveSlot(1)}
          className={`w-22 h-28 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${
            activeSlot === 1
              ? "border-amber-500 shadow-lg shadow-amber-500/20 bg-[#1e2130]"
              : "border-gray-700 bg-[#1a1d27]/50 hover:border-gray-500"
          }`}
        >
          {c1Complete ? (
            <>
              <span className={`text-2xl font-bold ${rankColor(card1Suit)}`}>{card1Rank}</span>
              <span className={`text-2xl ${card1Suit ? suitColors[card1Suit] : ""}`}>
                {card1Suit ? SUIT_SYMBOLS[card1Suit] : ""}
              </span>
            </>
          ) : (
            <>
              <span className={`text-2xl font-bold ${rankColor(card1Suit)}`}>
                {card1Rank || "?"}
              </span>
              <span className={`text-2xl ${card1Suit ? suitColors[card1Suit] : "text-gray-600"}`}>
                {card1Suit ? SUIT_SYMBOLS[card1Suit] : "?"}
              </span>
            </>
          )}
          <span className="text-[9px] text-gray-500 mt-1">牌1</span>
        </button>

        {/* Card 2 */}
        <button
          onClick={() => setActiveSlot(2)}
          className={`w-22 h-28 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${
            activeSlot === 2
              ? "border-amber-500 shadow-lg shadow-amber-500/20 bg-[#1e2130]"
              : "border-gray-700 bg-[#1a1d27]/50 hover:border-gray-500"
          }`}
        >
          {c2Complete ? (
            <>
              <span className={`text-2xl font-bold ${rankColor(card2Suit)}`}>{card2Rank}</span>
              <span className={`text-2xl ${card2Suit ? suitColors[card2Suit] : ""}`}>
                {card2Suit ? SUIT_SYMBOLS[card2Suit] : ""}
              </span>
            </>
          ) : (
            <>
              <span className={`text-2xl font-bold ${rankColor(card2Suit)}`}>
                {card2Rank || "?"}
              </span>
              <span className={`text-2xl ${card2Suit ? suitColors[card2Suit] : "text-gray-600"}`}>
                {card2Suit ? SUIT_SYMBOLS[card2Suit] : "?"}
              </span>
            </>
          )}
          <span className="text-[9px] text-gray-500 mt-1">牌2</span>
        </button>
      </div>

      {/* Active indicator */}
      <div className="text-center text-xs text-gray-500">
        正在选择{" "}
        <span className="text-amber-400 font-bold">
          {activeSlot === 1 ? "牌1" : "牌2"}
        </span>
      </div>

      {/* Rank buttons */}
      <div className="flex gap-1.5 justify-center flex-wrap">
        {RANKS.map(rank => {
          const currentRank = activeSlot === 1 ? card1Rank : card2Rank;
          const isSelected = currentRank === rank;
          return (
            <button
              key={rank}
              onClick={() => handleRankClick(rank)}
              className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                isSelected
                  ? "bg-amber-500 text-black shadow-lg shadow-amber-500/30 scale-110"
                  : "bg-[#1a1d27] text-gray-300 hover:bg-[#252833] hover:text-white active:scale-95"
              }`}
            >
              {rank}
            </button>
          );
        })}
      </div>

      {/* Suit buttons */}
      <div className="flex gap-3 justify-center">
        {SUITS.map(suit => {
          const currentSuit = activeSlot === 1 ? card1Suit : card2Suit;
          const isSelected = currentSuit === suit;
          return (
            <button
              key={suit}
              onClick={() => handleSuitClick(suit)}
              className={`w-12 h-12 rounded-xl text-xl font-bold transition-all ${suitColors[suit]} ${
                isSelected
                  ? "bg-amber-500/20 border-2 border-amber-500 shadow-lg scale-110"
                  : "bg-[#1a1d27] border-2 border-transparent hover:bg-[#252833] active:scale-95"
              }`}
            >
              {SUIT_SYMBOLS[suit]}
            </button>
          );
        })}
      </div>

      {/* Reset button */}
      {allDone && (
        <div className="flex justify-center">
          <button
            onClick={resetCards}
            className="px-4 py-1.5 rounded-lg text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
          >
            重置
          </button>
        </div>
      )}
    </div>
  );
}
