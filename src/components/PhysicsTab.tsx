"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePhotoStore, useHardware } from "@/store/photoStore";
import { UniversalPhysicsEngine } from "@/lib/physicsEngine";
import { ContentEngine } from "@/lib/contentEngine";
import { isOpticalCamera, getActiveLens, getActiveSmartLens } from "@/types/hardware";
import { Target, Camera, Smartphone, ChevronDown, ChevronUp, Ruler, Clock, Aperture, BookOpen, CheckCircle2, Circle } from "lucide-react";
import type { HardwareChallenge } from "@/lib/contentEngine";

// ─── Physics Panel ────────────────────────────────────────────────────────────

function PhysicsPanel() {
  const { activeProfile, physicsSnapshot, themeAccent } = useHardware();
  const [distance, setDistance] = useState(3);
  const isOptical = isOpticalCamera(activeProfile);
  const { equivalence, reciprocity, aperture } = physicsSnapshot;

  // Recompute DoF on demand
  const dof = aperture.dofSimulatorEnabled
    ? UniversalPhysicsEngine.computeDoF(
        activeProfile,
        equivalence.realFocalMm,
        aperture.minFNumber,
        distance
      )
    : null;

  const accent = themeAccent === "blue" ? "text-blue-400" : "text-purple-400";
  const accentBorder = themeAccent === "blue" ? "border-blue-500/20 bg-blue-500/10" : "border-purple-500/20 bg-purple-500/10";

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className={`rounded-2xl border p-4 ${accentBorder}`}>
        <div className="flex items-center gap-2 mb-3">
          {isOptical ? <Camera className={`h-4 w-4 ${accent}`} /> : <Smartphone className={`h-4 w-4 ${accent}`} />}
          <span className={`text-[10px] font-black uppercase tracking-widest ${accent}`}>
            {physicsSnapshot.mode} — Motor de Física
          </span>
        </div>

        {/* Focal Equivalence */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          <MetricBox label="Focal Real" value={`${equivalence.realFocalMm}mm`} accent={accent} />
          <MetricBox label="35mm Equiv." value={`${equivalence.equivalentFocalMm}mm`} accent={accent} />
          <MetricBox label="Crop Factor" value={`${equivalence.cropFactor.toFixed(2)}×`} accent={accent} />
        </div>

        {/* Reciprocity */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-3.5 w-3.5 text-zinc-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Regla de Reciprocidad
            </span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className={`text-2xl font-black tabular-nums ${accent}`}>
                {reciprocity.minSafeShutterDisplay}
              </p>
              <p className="text-[9px] text-zinc-600 mt-0.5">
                Velocidad mínima segura · {reciprocity.rule}
              </p>
            </div>
            {reciprocity.stabilizationActive && (
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2 py-1">
                <p className="text-[9px] font-black text-emerald-400">
                  +{reciprocity.stabilizationStops} stops OIS
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Aperture */}
        <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Control de Apertura
            </span>
          </div>
          {aperture.isManuallyAdjustable ? (
            <div className="space-y-1">
              <p className="text-xs text-zinc-400">
                Rango: <span className="font-bold text-white">f/{aperture.minFNumber} – f/{aperture.maxFNumber}</span>
              </p>
              <p className="text-[10px] text-emerald-400">✓ Control manual completo · DoF real simulable</p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-xs text-zinc-400">
                Apertura fija: <span className="font-bold text-white">f/{aperture.fixedFNumber}</span>
              </p>
              <p className="text-[10px] text-zinc-500">Apertura no ajustable — controlado por firmware</p>
              {aperture.portraitModeEnabled && (
                <p className="text-[10px] text-purple-400">✓ Portrait Mode (bokeh computacional) disponible</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* DoF Simulator — only for optical */}
      {aperture.dofSimulatorEnabled && dof && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Ruler className="h-3.5 w-3.5 text-zinc-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                Simulador de Profundidad de Campo
              </span>
            </div>
          </div>
          <div className="mb-3">
            <label className="text-[9px] text-zinc-600 uppercase tracking-widest">
              Distancia al sujeto: {distance}m
            </label>
            <input
              type="range"
              min={0.5}
              max={20}
              step={0.5}
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="mt-1 w-full accent-blue-500"
            />
          </div>
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3">
            <p className="text-xs font-bold text-white">{dof.summary}</p>
            <div className="mt-2 grid grid-cols-3 gap-2 text-[10px]">
              <div>
                <p className="text-zinc-600">Límite cercano</p>
                <p className="font-bold text-zinc-300">{dof.nearLimitM.toFixed(2)}m</p>
              </div>
              <div>
                <p className="text-zinc-600">Límite lejano</p>
                <p className="font-bold text-zinc-300">
                  {dof.farLimitM === Infinity ? "∞" : `${dof.farLimitM.toFixed(2)}m`}
                </p>
              </div>
              <div>
                <p className="text-zinc-600">Hiperfocal</p>
                <p className="font-bold text-zinc-300">{dof.hyperfocalM.toFixed(1)}m</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricBox({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-2.5 text-center">
      <p className="text-[8px] font-black uppercase tracking-widest text-zinc-600">{label}</p>
      <p className={`mt-0.5 text-sm font-black ${accent}`}>{value}</p>
    </div>
  );
}

// ─── Hardware Challenges Panel ────────────────────────────────────────────────

function HardwareChallengesPanel() {
  const { activeProfile, completeHardwareChallenge, completedHardwareChallengeIds } = usePhotoStore();
  const { themeAccent } = useHardware();
  const { hardwareChallenges } = ContentEngine.getActiveChallenges(activeProfile);

  if (hardwareChallenges.length === 0) return null;

  const accent = themeAccent === "blue" ? "text-blue-400" : "text-purple-400";
  const accentBg = themeAccent === "blue" ? "bg-blue-600 hover:bg-blue-500" : "bg-purple-600 hover:bg-purple-500";

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
        Retos de Hardware Desbloqueados
      </p>
      {hardwareChallenges.map((challenge) => {
        const isCompleted = completedHardwareChallengeIds.has(challenge.id);
        return (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl border p-4 ${isCompleted ? "border-emerald-500/20 bg-emerald-500/10 opacity-70" : "border-zinc-800 bg-zinc-900/60"}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{challenge.emoji}</span>
                <div>
                  <p className={`text-[9px] font-black uppercase tracking-widest ${accent} mb-0.5`}>
                    {challenge.activationReason}
                  </p>
                  <h4 className="text-sm font-black italic text-white">{challenge.title}</h4>
                  <p className="mt-1 text-[10px] leading-relaxed text-zinc-500">{challenge.description}</p>
                  <p className={`mt-1.5 text-[10px] font-bold ${accent}`}>+{challenge.points} pts · {challenge.timeEstimate}</p>
                </div>
              </div>
              <button
                onClick={() => !isCompleted && completeHardwareChallenge(challenge.id, challenge.points)}
                className="shrink-0 text-zinc-600 transition-colors hover:text-emerald-400"
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Physics Tab (main export) ────────────────────────────────────────────────

export function PhysicsTab() {
  const [section, setSection] = useState<"physics" | "challenges">("physics");
  const { themeAccent } = useHardware();
  const accent = themeAccent === "blue" ? "bg-blue-600" : "bg-purple-600";

  return (
    <div className="space-y-4">
      {/* Tab switcher */}
      <div className="flex gap-2 rounded-xl border border-zinc-800 bg-zinc-900/40 p-1">
        {[
          { key: "physics", label: "Motor de Física" },
          { key: "challenges", label: "Retos de Hardware" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSection(tab.key as typeof section)}
            className={`flex-1 rounded-lg py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
              section === tab.key ? `${accent} text-white` : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={section}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
        >
          {section === "physics" ? <PhysicsPanel /> : <HardwareChallengesPanel />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
