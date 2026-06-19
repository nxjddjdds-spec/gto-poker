"use client";

import { useGTOStore } from "@/store/gtoStore";
import { parseHandInput } from "@/lib/poker";

export function RecentQueries() {
  const recentQueries = useGTOStore(s => s.recentQueries);
  const clearRecents = useGTOStore(s => s.clearRecents);
  const setCard1 = useGTOStore(s => s.setCard1);
  const setCard2 = useGTOStore(s => s.setCard2);
  const setPosition = useGTOStore(s => s.setPosition);
  const setStackDepth = useGTOStore(s => s.setStackDepth);
  const setActionType = useGTOStore(s => s.setActionType);
  if (recentQueries.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">最近查询</h4>
        <button onClick={clearRecents} className="text-[10px] text-gray-600 hover:text-red-400 transition-colors">清空</button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {recentQueries.slice(0, 12).map((q, i) => (
          <button key={`${q.hand}-${q.position}-${q.timestamp}-${i}`} onClick={() => {
            const r = parseHandInput(q.hand);
            if (r) {
              setCard1(r.rank1, r.suited ? "s" : r.pair ? "s" : "s");
              setCard2(r.rank2, r.suited ? "s" : r.pair ? "h" : "h");
              setPosition(q.position);
              setStackDepth(q.stackDepth);
              setActionType(q.actionType);
            }}}
            className="px-2.5 py-1 rounded-lg text-xs bg-[#1a1d27] text-gray-400 hover:bg-[#252833] hover:text-white transition-all border border-gray-800 flex items-center gap-1.5">
            <span>{q.hand}</span>
            <span className="text-gray-600 text-[10px]">{q.position}</span>
          </button>))}
      </div>
    </div>
  );
}