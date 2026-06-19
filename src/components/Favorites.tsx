"use client";

import { useGTOStore } from "@/store/gtoStore";
import { parseHandInput } from "@/lib/poker";

export function Favorites() {
  const favorites = useGTOStore(s => s.favorites);
  const toggleFavorite = useGTOStore(s => s.toggleFavorite);
  const setCard1 = useGTOStore(s => s.setCard1);
  const setCard2 = useGTOStore(s => s.setCard2);
  const position = useGTOStore(s => s.position);
  const currentHand = useGTOStore(s => s.currentHand);
  const currentHandName = currentHand?.name || "";
  const isCurrentFav = favorites.some(f => f.hand === currentHandName && f.position === position);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">收藏</h4>
        {currentHandName && (
          <button onClick={() => toggleFavorite(currentHandName, position)}
            className={`text-sm ${isCurrentFav ? "text-yellow-400" : "text-gray-600 hover:text-yellow-400"} transition-colors`}
            title={isCurrentFav ? "取消收藏" : "添加到收藏"}>
            {isCurrentFav ? "★" : "☆"}</button>)}
      </div>
      {favorites.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {favorites.map(f => (
            <button key={`${f.hand}-${f.position}`} onClick={() => {
              const r = parseHandInput(f.hand);
              if (r) {
                setCard1(r.rank1, r.suited ? "s" : r.pair ? "s" : "s");
                setCard2(r.rank2, r.suited ? "s" : r.pair ? "h" : "h");
              }}}
              className="group px-2.5 py-1 rounded-lg text-xs bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-all border border-yellow-500/20 flex items-center gap-1.5">
              <span>{f.hand}</span>
              <span className="text-gray-600 text-[10px]">{f.position}</span>
              <span onClick={(e) => { e.stopPropagation(); toggleFavorite(f.hand, f.position); }}
                className="text-gray-600 hover:text-red-400 ml-0.5 cursor-pointer">x</span>
            </button>))}
        </div>)}
    </div>
  );
}