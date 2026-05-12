"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePhotoStore } from "@/store/photoStore";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { AcademyTab } from "@/components/AcademyTab";
import { ChallengesTab } from "@/components/ChallengesTab";
import { SpotsTab } from "@/components/SpotsTab";
import { ExifAnalyzerTab } from "@/components/ExifAnalyzerTab";
import { AICriticTab } from "@/components/AICriticTab";
import { LabTab } from "@/components/LabTab";
import { PhysicsTab } from "@/components/PhysicsTab";
import { CelebrationOverlay } from "@/components/CelebrationOverlay";
import { EquipmentGarage } from "@/components/EquipmentGarage";

const TAB_COMPONENTS: Record<string, React.ReactNode> = {
  academy: <AcademyTab />,
  retos: <ChallengesTab />,
  physics: <PhysicsTab />,
  spots: <SpotsTab />,
  exif: <ExifAnalyzerTab />,
  critic: <AICriticTab />,
  lab: <LabTab />,
};

export default function Home() {
  const { activeTab, loadFromDB, isLoaded } = usePhotoStore();

  useEffect(() => {
    loadFromDB();
  }, [loadFromDB]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-blue-500" />
          <p className="text-xs font-bold text-zinc-600">Cargando PHOTO_OS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-white">
      <Header />

      <main className="mx-auto w-full max-w-2xl flex-1 overflow-y-auto px-4 pb-28 pt-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            {TAB_COMPONENTS[activeTab] ?? <AcademyTab />}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav />
      <CelebrationOverlay />
      <EquipmentGarage />
    </div>
  );
}
