"use client";

import { useGTOStore } from "@/store/gtoStore";
import { HandAction } from "@/lib/types";

const actionColors: Record<string, string> = {
  raise: "bg-green-500", call: "bg-yellow-500", fold: "bg-red-500",
  "3bet": "bg-blue-500", "4bet": "bg-purple-500", allin: "bg-orange-500",
};
const actionLabels: Record<string, string> = {
  raise: "加注", call: "跟注", fold: "弃牌", "3bet": "3-Bet", "4bet": "4-Bet", allin: "All-in",
};

function ActionBar({ label, value, color }: { label: string; value: number; color: string }) {
  if (value <= 0) return null;
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${color}`} />
      <span className="text-gray-300 text-sm w-14">{label}</span>
      <div className="flex-1 h-2 bg-[#1a1d27] rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-300`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-white text-sm font-mono w-10 text-right">{value}%</span>
    </div>);
}

export function HandDetail() {
  const currentHand = useGTOStore(s => s.currentHand);
  const actionType = useGTOStore(s => s.actionType);
  const position = useGTOStore(s => s.position);
  if (!currentHand) return null;
  const action: HandAction = currentHand.actions[actionType];
  const primaryAction = action.primaryAction;
  const posLabels: Record<string, string> = { UTG: "枪口", HJ: "中间", CO: "关刹", BTN: "庄位", SB: "小盲", BB: "大盲" };
  const typeLabels: Record<string, string> = { open: "开池", vs_open: "对抗开池", vs_3bet: "对抗3Bet", vs_4bet: "对抗4Bet", push_fold: "推舍" };

  const primaryClass = primaryAction === "raise" ? "bg-green-500/20 text-green-400 border-green-500/30" :
    primaryAction === "call" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
    primaryAction === "fold" ? "bg-red-500/20 text-red-400 border-red-500/30" :
    primaryAction === "3bet" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" :
    primaryAction === "4bet" ? "bg-purple-500/20 text-purple-400 border-purple-500/30" :
    "bg-orange-500/20 text-orange-400 border-orange-500/30";

  return (
    <div className="bg-[#1a1d27] rounded-2xl p-5 border border-gray-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white tracking-wider">{currentHand.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{posLabels[position]} · {typeLabels[actionType]}</p>
        </div>
        <div className={`px-4 py-2 rounded-xl text-sm font-bold uppercase border ${primaryClass}`}>
          {actionLabels[primaryAction]}</div>
      </div>
      <div className="space-y-2">
        {action.raise > 0 && <ActionBar label={actionLabels.raise} value={action.raise} color={actionColors.raise} />}
        {action.call > 0 && <ActionBar label={actionLabels.call} value={action.call} color={actionColors.call} />}
        {action.fold > 0 && <ActionBar label={actionLabels.fold} value={action.fold} color={actionColors.fold} />}
        {action.threeBet > 0 && <ActionBar label={actionLabels["3bet"]} value={action.threeBet} color={actionColors["3bet"]} />}
        {action.fourBet > 0 && <ActionBar label={actionLabels["4bet"]} value={action.fourBet} color={actionColors["4bet"]} />}
        {action.allIn > 0 && <ActionBar label={actionLabels.allin} value={action.allIn} color={actionColors.allin} />}
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-gray-800">
        <span className="text-gray-400 text-sm">EV</span>
        <span className={`text-lg font-bold font-mono ${action.ev >= 0 ? "text-green-400" : "text-red-400"}`}>
          {action.ev >= 0 ? "+" : ""}{action.ev.toFixed(2)}bb</span>
      </div>
    </div>);
}