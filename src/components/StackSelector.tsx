"use client";

import { useGTOStore } from "@/store/gtoStore";
import { STACK_DEPTHS, StackDepth } from "@/lib/types";

export function StackSelector() {
  const stackDepth = useGTOStore(s => s.stackDepth);
  const setStackDepth = useGTOStore(s => s.setStackDepth);

  return (
    <div className="flex gap-1">
      {STACK_DEPTHS.map(d => (
        <button
          key={d}
          onClick={() => setStackDepth(d)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            stackDepth === d
              ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
              : "bg-[#1a1d27] text-gray-400 hover:bg-[#252833] hover:text-gray-200"
          }`}
        >
          {d}bb
        </button>
      ))}
    </div>
  );
}
