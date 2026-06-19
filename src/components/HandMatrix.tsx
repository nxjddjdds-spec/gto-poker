"use client";

import { useMemo, useState } from "react";
import { useGTOStore } from "@/store/gtoStore";
import { HandData, HandAction, Rank } from "@/lib/types";

const RANKS: Rank[] = ["A","K","Q","J","T","9","8","7","6","5","4","3","2"];

function getActionColor(action: HandAction): string {
  const p = action.primaryAction;
  if (p === "raise") return "rgba(34,197,94,0.7)";
  if (p === "call") return "rgba(234,179,8,0.7)";
  if (p === "fold") return "rgba(239,68,68,0.35)";
  if (p === "3bet") return "rgba(59,130,246,0.7)";
  if (p === "4bet") return "rgba(168,85,247,0.7)";
  if (p === "allin") return "rgba(249,115,22,0.7)";
  return "rgba(255,255,255,0.1)";
}
function getActionBorder(action: HandAction): string {
  const p = action.primaryAction;
  if (p === "raise") return "rgba(34,197,94,0.9)";
  if (p === "call") return "rgba(234,179,8,0.9)";
  if (p === "fold") return "rgba(239,68,68,0.3)";
  if (p === "3bet") return "rgba(59,130,246,0.9)";
  if (p === "4bet") return "rgba(168,85,247,0.9)";
  if (p === "allin") return "rgba(249,115,22,0.9)";
  return "rgba(255,255,255,0.1)";
}

export function HandMatrix() {
  const position = useGTOStore(s => s.position);
  const stackDepth = useGTOStore(s => s.stackDepth);
  const actionType = useGTOStore(s => s.actionType);
  const gtoData = useGTOStore(s => s.gtoData);
  const setCard1 = useGTOStore(s => s.setCard1);
  const setCard2 = useGTOStore(s => s.setCard2);
  const [hoveredCell, setHoveredCell] = useState<{row: number; col: number} | null>(null);
  const [selectedCell, setSelectedCell] = useState<{row: number; col: number} | null>(null);

  const matrix = useMemo(() => {
    const data = gtoData[stackDepth];
    if (!data?.positions?.[position]?.matrix) return null;
    return data.positions[position].matrix as HandData[][];
  }, [gtoData, stackDepth, position]);

  if (!matrix) return (<div className="flex items-center justify-center h-64 text-gray-500">加载数据中...</div>);

  function handleCellClick(row: number, col: number) {
    const hand = matrix![row][col];
    setSelectedCell({ row, col });
    let rank1 = hand.rank1;
    let rank2 = hand.rank2;
    const suited = hand.suited;
    const pair = hand.pair;
    if (suited) { setCard1(rank1, "s"); setCard2(rank2, "s"); }
    else if (pair) { setCard1(rank1, "s"); setCard2(rank2, "h"); }
    else { setCard1(rank1, "s"); setCard2(rank2, "h"); }
  }

  const actionNames: Record<string, string> = { raise: "加注", call: "跟注", fold: "弃牌", "3bet": "3Bet", "4bet": "4Bet", allin: "All-in" };

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-[520px]">
        <div className="flex"><div className="w-6 h-6" />{RANKS.map(rank => (<div key={rank} className="w-[38px] h-6 flex items-center justify-center text-[10px] text-gray-500 font-bold">{rank}</div>))}</div>
        {RANKS.map((rowRank, rowIdx) => (
          <div key={rowRank} className="flex">
            <div className="w-6 h-[38px] flex items-center justify-center text-[10px] text-gray-500 font-bold">{rowRank}</div>
            {RANKS.map((colRank, colIdx) => {
              const hand = matrix[rowIdx][colIdx];
              const action = hand.actions[actionType];
              const isHovered = hoveredCell?.row === rowIdx && hoveredCell?.col === colIdx;
              const isSelected = selectedCell?.row === rowIdx && selectedCell?.col === colIdx;
              return (
                <div key={colRank}
                  className={`w-[38px] h-[38px] flex items-center justify-center text-[10px] font-bold cursor-pointer transition-all relative border border-[#0f1117] hover:z-10 ${isHovered || isSelected ? "scale-110 z-20" : ""}`}
                  style={{ backgroundColor: getActionColor(action), borderColor: isSelected ? getActionBorder(action) : "transparent", borderWidth: isSelected ? "2px" : "1px", boxShadow: isHovered ? `0 0 12px ${getActionBorder(action)}` : "none" }}
                  onMouseEnter={() => setHoveredCell({ row: rowIdx, col: colIdx })}
                  onMouseLeave={() => setHoveredCell(null)}
                  onClick={() => handleCellClick(rowIdx, colIdx)}
                  title={`${hand.name}
${actionNames[action.primaryAction] || action.primaryAction.toUpperCase()} ${action.ev >= 0 ? "+" : ""}${action.ev.toFixed(2)}bb`}>
                  <span className={`${action.primaryAction === "fold" ? "text-gray-500" : "text-white"}`}>{hand.name}</span>
                  {isHovered && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-[#252833] text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-30 pointer-events-none border border-gray-700">
                      <div className="font-bold">{hand.name}</div>
                      <div className="text-gray-400">{actionNames[action.primaryAction] || action.primaryAction.toUpperCase()} {action.ev >= 0 ? "+" : ""}{action.ev.toFixed(2)}bb</div>
                    </div>)}
                </div>);
            })}
          </div>))}
      </div>
    </div>);
}