"use client";

import { motion } from "framer-motion";
import { usePhotoStore, useHardware } from "@/store/photoStore";
import { BookOpen, Target, MapPin, Wrench, FlaskConical, Bot, Atom } from "lucide-react";

const TABS = [
  { id: "academy", label: "Academia", icon: BookOpen },
  { id: "retos", label: "Retos", icon: Target },
  { id: "physics", label: "Física", icon: Atom },
  { id: "spots", label: "Spots", icon: MapPin },
  { id: "exif", label: "EXIF", icon: Wrench },
  { id: "critic", label: "AI", icon: Bot },
  { id: "lab", label: "Lab", icon: FlaskConical },
];

export function BottomNav() {
  const { activeTab, setActiveTab } = usePhotoStore();
  const { themeAccent } = useHardware();

  const activeBg = themeAccent === "blue" ? "bg-blue-600/20" : "bg-purple-600/20";
  const activeText = themeAccent === "blue" ? "text-blue-400" : "text-purple-400";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-800/60 bg-zinc-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-2xl items-center justify-around px-1 py-1.5">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center gap-0.5 px-1.5 py-1.5 transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className={`absolute inset-0 rounded-xl ${activeBg}`}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                className={`relative h-4 w-4 transition-colors ${isActive ? activeText : "text-zinc-500"}`}
              />
              <span
                className={`relative text-[8px] font-bold uppercase tracking-wide transition-colors ${
                  isActive ? activeText : "text-zinc-600"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
