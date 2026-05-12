"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePhotoStore, useHardware } from "@/store/photoStore";
import { Camera, Smartphone, X, ChevronRight, Wrench, Star, Zap, CheckCircle2 } from "lucide-react";
import { isOpticalCamera, isSmartDevice } from "@/types/hardware";
import type { HardwareProfile, OpticalCamera, SmartDevice, EquipmentKit } from "@/types/hardware";
import { BUILTIN_PROFILES } from "@/data/hardware";

// ─── Profile Card ─────────────────────────────────────────────────────────────

function ProfileCard({
  profile,
  isActive,
  onSelect,
}: {
  profile: HardwareProfile;
  isActive: boolean;
  onSelect: () => void;
}) {
  const isOptical = isOpticalCamera(profile);
  const accent = isOptical ? "blue" : "purple";

  const lensCount = isOptical
    ? (profile as OpticalCamera).lenses.length
    : (profile as SmartDevice).sensorArray.length;

  const lensLabel = isOptical
    ? `${lensCount} lente${lensCount !== 1 ? "s" : ""} disponible${lensCount !== 1 ? "s" : ""}`
    : `${lensCount} lentes integrados`;

  return (
    <motion.button
      layout
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      className={`w-full rounded-2xl border p-4 text-left transition-all ${
        isActive
          ? accent === "blue"
            ? "border-blue-500/50 bg-blue-500/10"
            : "border-purple-500/50 bg-purple-500/10"
          : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-600"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              isActive
                ? accent === "blue"
                  ? "bg-blue-600"
                  : "bg-purple-600"
                : "bg-zinc-800"
            }`}
          >
            {isOptical ? (
              <Camera className="h-5 w-5 text-white" />
            ) : (
              <Smartphone className="h-5 w-5 text-white" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p
                className={`text-[9px] font-black uppercase tracking-widest ${
                  accent === "blue" ? "text-blue-400" : "text-purple-400"
                }`}
              >
                {isOptical ? "Cámara Óptica" : "Dispositivo Computacional"}
              </p>
              {isActive && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
            </div>
            <h3 className="text-sm font-bold text-white">
              {profile.brand} {profile.model}
            </h3>
            <p className="mt-0.5 text-[10px] text-zinc-500">
              {isOptical
                ? `${(profile as OpticalCamera).sensorSize} · ${lensLabel}`
                : lensLabel}
            </p>
          </div>
        </div>
        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-zinc-600" />
      </div>
    </motion.button>
  );
}

// ─── Lens Selector (for OpticalCamera) ───────────────────────────────────────

function LensSelector({ profile }: { profile: OpticalCamera }) {
  const { setActiveLens } = usePhotoStore();

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
        Lente Activo
      </p>
      {profile.lenses.map((lens) => {
        const isActive = lens.id === profile.activeLensId;
        const label =
          lens.kind === "Prime"
            ? `${lens.focalLengthMm}mm f/${lens.maxAperture}`
            : `${lens.focalLengthMinMm}-${lens.focalLengthMaxMm}mm f/${lens.maxApertureWide}-${lens.maxApertureTele}`;

        return (
          <button
            key={lens.id}
            onClick={() => setActiveLens(lens.id)}
            className={`w-full rounded-xl border px-3 py-2.5 text-left transition-all ${
              isActive
                ? "border-blue-500/40 bg-blue-500/10"
                : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-600"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">{lens.name}</p>
                <p className="text-[10px] text-zinc-500">
                  {label} · {lens.stabilization !== "None" ? `${lens.stabilization} ✓` : "Sin OIS"}
                </p>
              </div>
              {isActive && <CheckCircle2 className="h-4 w-4 text-blue-400" />}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Smart Lens Selector ──────────────────────────────────────────────────────

function SmartLensSelector({ profile }: { profile: SmartDevice }) {
  const { setActiveLens } = usePhotoStore();

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
        Lente Activo
      </p>
      <div className="grid grid-cols-2 gap-2">
        {profile.sensorArray.map((lens) => {
          const isActive = lens.id === profile.activeLensId;
          return (
            <button
              key={lens.id}
              onClick={() => setActiveLens(lens.id)}
              className={`rounded-xl border p-3 text-left transition-all ${
                isActive
                  ? "border-purple-500/40 bg-purple-500/10"
                  : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-600"
              }`}
            >
              <p className="text-lg font-black text-white">{lens.zoomMultiplier}×</p>
              <p className="mt-0.5 text-[9px] font-bold text-zinc-400">
                {lens.focalLengthEquivalent}mm equiv.
              </p>
              <p className="text-[9px] text-zinc-600">f/{lens.aperture}</p>
              {isActive && (
                <span className="mt-1.5 inline-block rounded-full bg-purple-500/20 px-1.5 py-0.5 text-[8px] font-black text-purple-400">
                  ACTIVO
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Kit Card ─────────────────────────────────────────────────────────────────

function KitCard({ kit, isActive, onActivate }: { kit: EquipmentKit; isActive: boolean; onActivate: () => void }) {
  const { deleteKit } = usePhotoStore();

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
        isActive ? "border-emerald-500/30 bg-emerald-500/10" : "border-zinc-800 bg-zinc-900/40"
      }`}
    >
      <span className="text-2xl">{kit.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white truncate">{kit.name}</p>
        <p className="text-[10px] text-zinc-500 truncate">{kit.description}</p>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onActivate}
          className={`rounded-lg px-2.5 py-1.5 text-[9px] font-black uppercase transition-all ${
            isActive
              ? "bg-emerald-600 text-white"
              : "bg-zinc-700 text-zinc-300 hover:bg-blue-600 hover:text-white"
          }`}
        >
          {isActive ? "Activo" : "Usar"}
        </button>
      </div>
    </div>
  );
}

// ─── Garage Panel ─────────────────────────────────────────────────────────────

export function EquipmentGarage() {
  const {
    garageOpen,
    setGarageOpen,
    activeProfile,
    availableProfiles,
    activeKit,
    availableKits,
    setActiveProfile,
    activateKit,
  } = usePhotoStore();

  const { themeAccent } = useHardware();

  return (
    <AnimatePresence>
      {garageOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
            onClick={() => setGarageOpen(false)}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 40 }}
            className="fixed right-0 top-0 bottom-0 z-50 flex w-full max-w-sm flex-col border-l border-zinc-800 bg-zinc-950"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
              <div className="flex items-center gap-2">
                <Wrench
                  className={`h-4 w-4 ${themeAccent === "blue" ? "text-blue-400" : "text-purple-400"}`}
                />
                <h2 className="text-sm font-black text-white">Garage de Equipo</h2>
              </div>
              <button
                onClick={() => setGarageOpen(false)}
                className="rounded-xl p-2 text-zinc-500 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto space-y-6 p-5">
              {/* Profiles */}
              <div>
                <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Perfiles de Hardware
                </p>
                <div className="space-y-2">
                  {availableProfiles.map((profile) => (
                    <ProfileCard
                      key={profile.id}
                      profile={profile}
                      isActive={activeProfile.id === profile.id}
                      onSelect={() => setActiveProfile(profile)}
                    />
                  ))}
                </div>
              </div>

              {/* Lens selector */}
              <div>
                {isOpticalCamera(activeProfile) ? (
                  <LensSelector profile={activeProfile} />
                ) : isSmartDevice(activeProfile) ? (
                  <SmartLensSelector profile={activeProfile} />
                ) : null}
              </div>

              {/* Kits */}
              <div>
                <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Kits de Equipo
                </p>
                <div className="space-y-2">
                  {availableKits.map((kit) => (
                    <KitCard
                      key={kit.id}
                      kit={kit}
                      isActive={activeKit?.id === kit.id}
                      onActivate={() => activateKit(kit)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
