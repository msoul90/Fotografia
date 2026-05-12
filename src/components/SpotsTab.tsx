"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Car, Tag, ChevronRight } from "lucide-react";
import { GDL_SPOTS } from "@/data/spots";
import type { PhotoSpot } from "@/types/curriculum";

const moodColors = {
  warm: { bg: "bg-amber-500/10", border: "border-amber-500/20", dot: "bg-amber-400", text: "text-amber-400" },
  natural: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", dot: "bg-emerald-400", text: "text-emerald-400" },
  urban: { bg: "bg-blue-500/10", border: "border-blue-500/20", dot: "bg-blue-400", text: "text-blue-400" },
  neon: { bg: "bg-purple-500/10", border: "border-purple-500/20", dot: "bg-purple-400", text: "text-purple-400" },
};

const categoryEmoji: Record<string, string> = {
  Arquitectura: "🏛️",
  Naturaleza: "🌿",
  Urbano: "🏙️",
  Cultura: "🎨",
};

function SpotCard({ spot, index }: { spot: PhotoSpot; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const mood = moodColors[spot.colorMood];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`overflow-hidden rounded-2xl border ${mood.bg} ${mood.border}`}
    >
      {/* Main row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-start justify-between p-4 text-left"
      >
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${mood.dot}`} />
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span>{categoryEmoji[spot.category] ?? "📍"}</span>
              <span className={`text-[9px] font-black uppercase tracking-widest ${mood.text}`}>
                {spot.category}
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">{spot.name}</h3>
            <p className="mt-0.5 text-[10px] text-zinc-500">{spot.description}</p>
          </div>
        </div>
        <ChevronRight
          className={`mt-1 h-4 w-4 shrink-0 text-zinc-600 transition-transform ${expanded ? "rotate-90" : ""}`}
        />
      </button>

      {/* Expanded */}
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-zinc-800/60 px-4 pb-4 pt-3 space-y-3"
        >
          {/* Meta */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
              <Clock className="h-3 w-3" />
              <span>{spot.bestTime}</span>
            </div>
            {spot.parkingNote && (
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                <Car className="h-3 w-3" />
                <span>{spot.parkingNote}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {spot.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-[9px] text-zinc-400"
              >
                <Tag className="h-2 w-2" /> {tag}
              </span>
            ))}
          </div>

          {/* Tips */}
          <div className="space-y-1.5">
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Tips Fotográficos</p>
            {spot.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <MapPin className={`mt-0.5 h-3 w-3 shrink-0 ${mood.text}`} />
                <p className="text-[10px] leading-relaxed text-zinc-400">{tip}</p>
              </div>
            ))}
          </div>

          {/* GPS coords */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-0.5">
              Coordenadas GPS
            </p>
            <p className="font-mono text-[10px] text-zinc-400">
              {spot.coordinates.lat.toFixed(4)}, {spot.coordinates.lng.toFixed(4)}
            </p>
            <a
              href={`https://maps.google.com/?q=${spot.coordinates.lat},${spot.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-1.5 inline-block text-[10px] font-bold ${mood.text} hover:underline`}
            >
              Abrir en Google Maps →
            </a>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export function SpotsTab() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const categories = ["Todos", ...Array.from(new Set(GDL_SPOTS.map((s) => s.category)))];
  const filtered =
    activeCategory === "Todos" ? GDL_SPOTS : GDL_SPOTS.filter((s) => s.category === activeCategory);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
          Spots · Zapopan & GDL
        </h2>
        <p className="mt-1 text-xs text-zinc-600">
          {GDL_SPOTS.length} locaciones con coordenadas reales y tips fotográficos
        </p>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all ${
              activeCategory === cat
                ? "bg-blue-600 text-white"
                : "border border-zinc-700 text-zinc-500 hover:border-zinc-500"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.map((spot, i) => (
        <SpotCard key={spot.id} spot={spot} index={i} />
      ))}
    </div>
  );
}
