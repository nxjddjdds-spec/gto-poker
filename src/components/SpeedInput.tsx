"use client";
import { useState } from "react";
import { useGTOStore } from "@/store/gtoStore";
import { parseHandInput } from "@/lib/poker";
import { Suit } from "@/lib/types";

export function SpeedInput() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const setCard1 = useGTOStore(s => s.setCard1);
  const setCard2 = useGTOStore(s => s.setCard2);
  const setSpeedInput = useGTOStore(s => s.setSpeedInput);
  function handleSubmit() {
    if (!input.trim()) return;
    setError("");
    const result = parseHandInput(input);
    if (!result) { setError("格式错误，请输入：AKs、AKo、AA、AsKh、AhAd、7c7d"); return; }
    const { rank1, rank2, suited, pair } = result;
    const cleaned = input.trim().toUpperCase().replace(/\s/g, "");
    let s1: Suit, s2: Suit;
    if (cleaned.length === 4) { s1 = cleaned[1].toLowerCase() as Suit; s2 = cleaned[3].toLowerCase() as Suit; }
    else if (pair) { s1 = "s"; s2 = "h"; }
    else if (suited) { s1 = "s"; s2 = "s"; }
    else { s1 = "s"; s2 = "h"; }
    setCard1(rank1, s1);
    setCard2(rank2, s2);
    setSpeedInput(input);
    setInput(""); setError("");
  }
  function handleKeyDown(e: React.KeyboardEvent) { if (e.key === "Enter") handleSubmit(); }
  const quickHands = ["AA","KK","QQ","JJ","TT","AKs","AKo","AQs","AQo","AJs","A5s","QJs","JTs","T9s","98s","87s","77","66","55"];
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input type="text" value={input} onChange={e => { setInput(e.target.value); setError(""); }} onKeyDown={handleKeyDown} placeholder="AKs, AKo, AsKh..." className="flex-1 bg-[#1a1d27] border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all" />
        <button onClick={handleSubmit} className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all text-sm">查询</button>
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <div className="flex flex-wrap gap-1.5">
        {quickHands.map(h => (<button key={h} onClick={() => {
          const r = parseHandInput(h);
          if (r) { const { rank1, rank2, suited, pair } = r; setCard1(rank1, "s"); setCard2(rank2, suited ? "s" : pair ? "h" : "h"); setSpeedInput(h); }
        }} className="px-2.5 py-1 rounded-lg text-xs bg-[#1a1d27] text-gray-400 hover:bg-[#252833] hover:text-white transition-all border border-gray-800 hover:border-gray-600">{h}</button>))}
      </div>
    </div>);
}