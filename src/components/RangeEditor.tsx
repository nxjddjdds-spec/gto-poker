"use client";

import { useGTOStore } from "@/store/gtoStore";
import { RangeStyle } from "@/lib/types";

const styles: { key: RangeStyle; label: string; desc: string }[] = [
  { key: "TAG", label: "TAG", desc: "紧凶" },
  { key: "LAG", label: "LAG", desc: "松凶" },
  { key: "NIT", label: "Nit", desc: "超紧" },
  { key: "EXPLOIT", label: "剥削", desc: "利用型" },
];

export function RangeEditor() {
  const rangeStyle = useGTOStore(s => s.rangeStyle);
  const setRangeStyle = useGTOStore(s => s.setRangeStyle);

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">风格</h4>
      <div className="grid grid-cols-2 gap-1.5">
        {styles.map(s => (
          <button
            key={s.key}
            onClick={() => setRangeStyle(s.key)}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              rangeStyle === s.key
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                : "bg-[#1a1d27] text-gray-400 hover:bg-[#252833]"
            }`}
          >
            <div>{s.label}</div>
            <div className="text-[10px] opacity-60">{s.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}