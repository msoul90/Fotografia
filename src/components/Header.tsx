"use client";

import { motion } from "framer-motion";
import { usePhotoStore, useHardware, useProgress } from "@/store/photoStore";
import { Camera, Smartphone, Star, Zap, Wrench } from "lucide-react";
import { isOpticalCamera } from "@/types/hardware";
import { getActiveLens, getActiveSmartLens } from "@/types/hardware";

export function Header() {
  const { setGarageOpen } = usePhotoStore();
  const { percentage, totalPoints } = useProgress();
  const { activeProfile, physicsSnapshot, themeAccent, mode } = useHardware();

  const isOptical = isOpticalCamera(activeProfile);

  // Resolve what we're shooting with
  const activeLensLabel = isOptical
    ? (() => {
        const lens = getActiveLens(activeProfile);
        if (!lens) return "Sin lente";
        return lens.kind === "Prime"
          ? `${lens.focalLengthMm}mm`
          : `${lens.focalLengthMinMm}-${lens.focalLengthMaxMm}mm`;
      })()
    : (() => {
        const lens = getActiveSmartLens(activeProfile);
        return lens ? `${lens.zoomMultiplier}× · ${lens.focalLengthEquivalent}mm` : "Sin lente";
      })();

  const accentBg = themeAccent === "blue" ? "from-blue-600 to-indigo-700" : "from-purple-600 to-violet-700";
  const accentText = themeAccent === "blue" ? "text-blue-400" : "text-purple-400";
  const accentShadow = themeAccent === "blue" ? "shadow-blue-600/30" : "shadow-purple-600/30";

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-2xl px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo + Mode Indicator */}
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setGarageOpen(true)}
              className={`relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${accentBg} shadow-lg ${accentShadow} transition-shadow hover:shadow-xl`}
              aria-label="Abrir Garage de Equipo"
            >
              {isOptical ? (
                <Camera className="h-5 w-5 text-white" />
              ) : (
                <Smartphone className="h-5 w-5 text-white" />
              )}
              {/* Mode pulse indicator */}
              <span className={`absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-zinc-950 ${themeAccent === "blue" ? "bg-blue-400" : "bg-purple-400"}`} />
            </motion.button>

            <div>
              <h1 className="text-lg font-black italic leading-none tracking-tighter text-white">
                PHOTO
                <span className={accentText}>_OS</span>
              </h1>
              {/* Dynamic subtitle — shows active hardware */}
              <p className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                <span className={`${accentText}`}>{mode}</span>
                {" · "}
                {activeProfile.model}
                {" · "}
                {activeLensLabel}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4">
            {/* Physics hint — shows safe shutter */}
            <div className={`hidden sm:flex flex-col items-end`}>
              <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-600">
                Vel. Segura
              </p>
              <p className={`text-sm font-black tabular-nums ${accentText}`}>
                {physicsSnapshot.reciprocity.minSafeShutterDisplay}
              </p>
            </div>

            {/* Points */}
            <div className="flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 text-amber-400" fill="currentColor" />
              <span className="text-sm font-black tabular-nums text-amber-400">{totalPoints}</span>
            </div>

            {/* Progress */}
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1">
                <Zap className={`h-3 w-3 ${accentText}`} />
                <span className={`text-lg font-black tabular-nums leading-none ${accentText}`}>
                  {percentage}%
                </span>
              </div>
              <div className="h-1 w-16 overflow-hidden rounded-full bg-zinc-800">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${accentBg}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
