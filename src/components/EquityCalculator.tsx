"use client";
import { useState } from "react";
import { parseHandInput, calculateEquity } from "@/lib/poker";
import { EquityResult } from "@/lib/types";

export function EquityCalculator() {
  const [hand1, setHand1] = useState("");
  const [hand2, setHand2] = useState("");
  const [result, setResult] = useState<EquityResult | null>(null);
  const [error, setError] = useState("");
  function handleCalculate() {
    setError("");
    const h1 = parseHandInput(hand1);
    const h2 = parseHandInput(hand2);
    if (!h1 || !h2) { setError("请输入有效手牌（如 AhKh、QQ、AKs）"); return; }
    const eq = calculateEquity([h1.rank1, h1.rank2], h1.suited, [h2.rank1, h2.rank2], h2.suited);
    setResult({ hand1: hand1.trim().toUpperCase(), hand2: hand2.trim().toUpperCase(), equity1: eq.equity1, equity2: eq.equity2, tie: eq.tie });
  }
  function handleKeyDown(e: React.KeyboardEvent) { if (e.key === "Enter") handleCalculate(); }
  const quick = ["AA","KK","QQ","AKs","AKo","JJ","TT","AQs"];
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">胜率计算器</h4>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">手牌1</label>
          <input type="text" value={hand1} onChange={e => setHand1(e.target.value)} onKeyDown={handleKeyDown} placeholder="AhKh" className="w-full bg-[#15171f] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-amber-500" />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">手牌2</label>
          <input type="text" value={hand2} onChange={e => setHand2(e.target.value)} onKeyDown={handleKeyDown} placeholder="QQ" className="w-full bg-[#15171f] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-amber-500" />
        </div>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {quick.map(h => (<button key={h} onClick={() => { if (!hand1) setHand1(h); else if (!hand2) setHand2(h); }} className="px-2 py-0.5 rounded text-[10px] bg-[#1a1d27] text-gray-500 hover:text-white hover:bg-[#252833] transition-all">{h}</button>))}
      </div>
      <button onClick={handleCalculate} className="w-full py-2 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 rounded-lg text-sm font-bold transition-all border border-amber-500/30">计算胜率</button>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      {result && (
        <div className="bg-[#15171f] rounded-xl p-4 border border-gray-800">
          <div className="flex items-center gap-4">
            <div className="flex-1 text-center"><div className="text-lg font-bold text-white">{result.hand1}</div><div className="text-2xl font-bold text-green-400">{(result.equity1 * 100).toFixed(1)}%</div></div>
            <div className="text-gray-600 text-sm">vs</div>
            <div className="flex-1 text-center"><div className="text-lg font-bold text-white">{result.hand2}</div><div className="text-2xl font-bold text-red-400">{(result.equity2 * 100).toFixed(1)}%</div></div>
          </div>
          {result.tie > 0 && (<div className="text-center text-xs text-gray-500 mt-2">平分: {(result.tie * 100).toFixed(1)}%</div>)}
          <div className="mt-3 h-2 bg-gray-800 rounded-full overflow-hidden flex">
            <div className="h-full bg-green-500 transition-all" style={{ width: result.equity1 * 100 + "%" }} />
            {result.tie > 0 && <div className="h-full bg-gray-500 transition-all" style={{ width: result.tie * 100 + "%" }} />}
            <div className="h-full bg-red-500 transition-all" style={{ width: result.equity2 * 100 + "%" }} />
          </div>
        </div>)}
    </div>);
}