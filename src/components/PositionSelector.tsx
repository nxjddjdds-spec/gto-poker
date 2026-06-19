"use client";

import { useGTOStore } from "@/store/gtoStore";
import { POSITIONS } from "@/lib/types";

const posLabels: Record<string, string> = {
  UTG: "枪口",
  HJ: "中间",
  CO: "关刹",
  BTN: "庄位",
  SB: "小盲",
  BB: "大盲",
};

export function PositionSelector() {
  const position = useGTOStore(s => s.position);
  const setPosition = useGTOStore(s => s.setPosition);

  return (
    <div className="flex gap-1">
      {POSITIONS.map(pos => (
        <button
          key={pos}
          onClick={() => setPosition(pos)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            position === pos
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
              : "bg-[#1a1d27] text-gray-400 hover:bg-[#252833] hover:text-gray-200"
          }`}
        >
          {posLabels[pos]}
        </button>
      ))}
    </div>
  );
}