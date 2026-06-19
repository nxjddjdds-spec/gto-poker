"use client";

import { useEffect, useState } from "react";
import { useGTOStore } from "@/store/gtoStore";
import { PositionSelector } from "@/components/PositionSelector";
import { StackSelector } from "@/components/StackSelector";
import { ActionButtons } from "@/components/ActionButtons";
import { CardSelector } from "@/components/CardSelector";
import { SpeedInput } from "@/components/SpeedInput";
import { HandMatrix } from "@/components/HandMatrix";
import { HandDetail } from "@/components/HandDetail";
import { EquityCalculator } from "@/components/EquityCalculator";
import { Favorites } from "@/components/Favorites";
import { RecentQueries } from "@/components/RecentQueries";
import { RangeEditor } from "@/components/RangeEditor";

export default function Home() {
  const mode = useGTOStore(s => s.mode);
  const setMode = useGTOStore(s => s.setMode);
  const stackDepth = useGTOStore(s => s.stackDepth);
  const loadData = useGTOStore(s => s.loadData);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => { loadData(stackDepth); }, []);

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      <header className="sticky top-0 z-50 bg-[#0f1117]/95 backdrop-blur border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-3 py-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xl">♠</span>
              <h1 className="text-sm font-bold text-white hidden sm:block">GTO <span className="text-amber-500">速查表</span></h1>
            </div>
            <div className="flex bg-[#1a1d27] rounded-xl p-0.5">
              <button onClick={() => setMode("select")} className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${mode === "select" ? "bg-amber-500 text-black" : "text-gray-400 hover:text-white"}`}>选牌</button>
              <button onClick={() => setMode("speed")} className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${mode === "speed" ? "bg-amber-500 text-black" : "text-gray-400 hover:text-white"}`}>极速</button>
            </div>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden px-2 py-1 text-gray-400 hover:text-white">{sidebarOpen ? "x" : "≡"}</button>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row">
          <main className="flex-1 min-w-0 p-3 lg:p-4 space-y-4">
            <section className="bg-[#141720] rounded-2xl p-4 card-shadow border border-gray-800/50">
              <div className="flex flex-wrap gap-3 mb-4"><PositionSelector /><StackSelector /></div>
              <ActionButtons />
              <div className="mt-4">{mode === "select" ? <CardSelector /> : <SpeedInput />}</div>
            </section>
            <section><HandDetail /></section>
            <section className="bg-[#141720] rounded-2xl p-3 lg:p-4 card-shadow border border-gray-800/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">GTO 范围矩阵</h3>
                <div className="flex gap-2 text-[10px] flex-wrap">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-green-500/70" /> 加注</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-yellow-500/70" /> 跟注</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500/70" /> 3Bet</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-purple-500/70" /> 4Bet</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-red-500/35" /> 弃牌</span>
                </div>
              </div>
              <HandMatrix />
            </section>
            <section className="space-y-3"><Favorites /><RecentQueries /></section>
          </main>
          <aside className={`lg:block lg:w-80 lg:shrink-0 ${sidebarOpen ? "block" : "hidden"} p-3 lg:p-4 space-y-4 lg:border-l border-gray-800 bg-[#0f1117]`}>
            <div className="bg-[#141720] rounded-2xl p-4 card-shadow border border-gray-800/50">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">极速查询</h3><SpeedInput />
            </div>
            <div className="bg-[#141720] rounded-2xl p-4 card-shadow border border-gray-800/50"><EquityCalculator /></div>
            <div className="bg-[#141720] rounded-2xl p-4 card-shadow border border-gray-800/50"><RangeEditor /></div>
            <div className="bg-[#141720] rounded-2xl p-4 card-shadow border border-gray-800/50">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">图例</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-green-500" /> 加注 (Open)</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-yellow-500" /> 跟注 (Call)</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-blue-500" /> 3-Bet</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-purple-500" /> 4-Bet</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-orange-500" /> All-in</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-red-500/35" /> 弃牌 (Fold)</div>
              </div>
            </div>
            <div className="text-center text-[10px] text-gray-700 py-2">GTO 速查表 v1.0 · 仅供参考</div>
          </aside>
        </div>
      </div>
    </div>);
}