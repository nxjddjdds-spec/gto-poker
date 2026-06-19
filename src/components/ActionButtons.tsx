"use client";

import { useGTOStore } from "@/store/gtoStore";
import { ACTION_TYPES, ActionType } from "@/lib/types";

const actionLabels: Record<ActionType, string> = {
  open: "开池",
  vs_open: "对抗开池",
  vs_3bet: "对抗3Bet",
  vs_4bet: "对抗4Bet",
  push_fold: "推舍",
};

export function ActionButtons() {
  const actionType = useGTOStore(s => s.actionType);
  const setActionType = useGTOStore(s => s.setActionType);

  return (
    <div className="flex flex-wrap gap-1">
      {ACTION_TYPES.map(a => (
        <button
          key={a}
          onClick={() => setActionType(a)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
            actionType === a
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
              : "bg-[#1a1d27] text-gray-400 hover:bg-[#252833] hover:text-gray-200"
          }`}
        >
          {actionLabels[a]}
        </button>
      ))}
    </div>
  );
}