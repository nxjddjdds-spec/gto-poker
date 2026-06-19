"use client";
import { useMemo, useState } from "react";
import { useGTOStore } from "@/store/gtoStore";
import { HandData, HandAction, Rank } from "@/lib/types";
import data20bb from "@/data/20bb.json";
import data40bb from "@/data/40bb.json";
import data60bb from "@/data/60bb.json";
import data100bb from "@/data/100bb.json";
import data200bb from "@/data/200bb.json";
const allData: Record<number, any> = { 20: data20bb, 40: data40bb, 60: data60bb, 100: data100bb, 200: data200bb };
const RANKS: Rank[] = ["A","K","Q","J","T","9","8","7","6","5","4","3","2"];
function getActionColor(a: HandAction) { const p=a.primaryAction; if(p==="raise")return"rgba(34,197,94,0.7)"; if(p==="call")return"rgba(234,179,8,0.7)"; if(p==="fold")return"rgba(239,68,68,0.35)"; if(p==="3bet")return"rgba(59,130,246,0.7)"; if(p==="4bet")return"rgba(168,85,247,0.7)"; if(p==="allin")return"rgba(249,115,22,0.7)"; return"rgba(255,255,255,0.1)"; }
function getActionBorder(a: HandAction) { const p=a.primaryAction; if(p==="raise")return"rgba(34,197,94,0.9)"; if(p==="call")return"rgba(234,179,8,0.9)"; if(p==="fold")return"rgba(239,68,68,0.3)"; if(p==="3bet")return"rgba(59,130,246,0.9)"; if(p==="4bet")return"rgba(168,85,247,0.9)"; if(p==="allin")return"rgba(249,115,22,0.9)"; return"rgba(255,255,255,0.1)"; }
const actionNames: Record<string, string> = { raise:"加注", call:"跟注", fold:"弃牌", "3bet":"3Bet", "4bet":"4Bet", allin:"All-in" };

export function HandMatrix() {
  const position = useGTOStore(s => s.position);
  const stackDepth = useGTOStore(s => s.stackDepth);
  const actionType = useGTOStore(s => s.actionType);
  const setCard1 = useGTOStore(s => s.setCard1);
  const setCard2 = useGTOStore(s => s.setCard2);
  const [hoveredCell, setHoveredCell] = useState<{row:number;col:number}|null>(null);
  const [selectedCell, setSelectedCell] = useState<{row:number;col:number}|null>(null);
  const matrix = useMemo(() => {
    const data = allData[stackDepth];
    if (!data?.positions?.[position]?.matrix) return null;
    return data.positions[position].matrix as HandData[][];
  }, [stackDepth, position]);
  if (!matrix) return (<div className="flex items-center justify-center h-64 text-gray-500">加载数据中...</div>);

  function handleCellClick(row:number, col:number) {
    const hand = matrix![row][col]; setSelectedCell({row,col});
    if(hand.suited){setCard1(hand.rank1,"s");setCard2(hand.rank2,"s");}
    else if(hand.pair){setCard1(hand.rank1,"s");setCard2(hand.rank2,"h");}
    else{setCard1(hand.rank1,"s");setCard2(hand.rank2,"h");}
  }

  return (<div className="overflow-x-auto"><div className="inline-block min-w-[520px]">
    <div className="flex"><div className="w-6 h-6"/>{RANKS.map(r=>(<div key={r} className="w-[38px] h-6 flex items-center justify-center text-[10px] text-gray-500 font-bold">{r}</div>))}</div>
    {RANKS.map((rr,ri)=>(<div key={rr} className="flex">
      <div className="w-6 h-[38px] flex items-center justify-center text-[10px] text-gray-500 font-bold">{rr}</div>
      {RANKS.map((cr,ci)=>{const hand=matrix[ri][ci]; const act=hand.actions[actionType]; const hov=hoveredCell?.row===ri&&hoveredCell?.col===ci; const sel=selectedCell?.row===ri&&selectedCell?.col===ci;
        return(<div key={cr} className={`w-[38px] h-[38px] flex items-center justify-center text-[10px] font-bold cursor-pointer transition-all relative border border-[#0f1117] hover:z-10 ${hov||sel?"scale-110 z-20":""}`}
          style={{backgroundColor:getActionColor(act),borderColor:sel?getActionBorder(act):"transparent",borderWidth:sel?"2px":"1px",boxShadow:hov?`0 0 12px ${getActionBorder(act)}`:"none"}}
          onMouseEnter={()=>setHoveredCell({row:ri,col:ci})} onMouseLeave={()=>setHoveredCell(null)} onClick={()=>handleCellClick(ri,ci)}
          title={`${hand.name}
${actionNames[act.primaryAction]||act.primaryAction.toUpperCase()} ${act.ev>=0?"+":""}${act.ev.toFixed(2)}bb`}>
          <span className={`${act.primaryAction==="fold"?"text-gray-500":"text-white"}`}>{hand.name}</span>
          {hov&&(<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-[#252833] text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-30 pointer-events-none border border-gray-700">
            <div className="font-bold">{hand.name}</div><div className="text-gray-400">{actionNames[act.primaryAction]||act.primaryAction.toUpperCase()} {act.ev>=0?"+":""}{act.ev.toFixed(2)}bb</div></div>)}
        </div>);
      })}</div>))}
  </div></div>);
}