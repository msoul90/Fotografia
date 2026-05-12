"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePhotoStore } from "@/store/photoStore";
import { LESSONS } from "@/data/lessons";
import type { Lesson } from "@/types/curriculum";
import { CheckCircle2, Circle, Clock, ChevronRight, Camera, Smartphone } from "lucide-react";
import { useState } from "react";
import { LessonModal } from "./LessonModal";

const levelConfig = {
  Básico: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  Intermedio: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
  Avanzado: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
};

const cameraIcon = {
  sony: <Camera className="h-3 w-3 text-blue-400" />,
  s24: <Smartphone className="h-3 w-3 text-purple-400" />,
  both: (
    <span className="flex gap-0.5">
      <Camera className="h-3 w-3 text-blue-400" />
      <Smartphone className="h-3 w-3 text-purple-400" />
    </span>
  ),
};

function LessonCard({ lesson, index }: { lesson: Lesson; index: number }) {
  const { completedLessonIds, toggleLesson } = usePhotoStore();
  const [showModal, setShowModal] = useState(false);
  const isCompleted = completedLessonIds.has(lesson.id);
  const cfg = levelConfig[lesson.level];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.4 }}
        className={`group relative overflow-hidden rounded-2xl border bg-zinc-900/60 p-4 transition-all duration-300 hover:border-blue-500/30 hover:bg-zinc-900 ${
          isCompleted ? "border-emerald-500/20 opacity-80" : "border-zinc-800/60"
        }`}
      >
        {/* Completed overlay shimmer */}
        {isCompleted && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent" />
        )}

        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${cfg.bg} ${cfg.text} border ${cfg.border}`}
              >
                {lesson.level}
              </span>
              <span className="flex items-center gap-0.5 text-[9px] text-zinc-600">
                <Clock className="h-2.5 w-2.5" />
                {lesson.estimatedMinutes}min
              </span>
              {cameraIcon[lesson.camera]}
            </div>

            <h3
              className={`text-sm font-bold leading-tight transition-colors ${
                isCompleted ? "text-zinc-400 line-through" : "text-white"
              }`}
            >
              {lesson.title}
            </h3>
            <p className="mt-0.5 text-[10px] text-zinc-500">{lesson.subtitle}</p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
            <button
              onClick={() => toggleLesson(lesson.id)}
              className="text-zinc-600 transition-colors hover:text-emerald-400"
              aria-label={isCompleted ? "Marcar como pendiente" : "Marcar como completada"}
            >
              {isCompleted ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1 rounded-lg bg-zinc-800 px-2.5 py-1.5 text-[10px] font-black uppercase text-white transition-all hover:bg-blue-600 group-hover:bg-blue-600/80"
            >
              VER <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showModal && <LessonModal lesson={lesson} onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </>
  );
}

export function AcademyTab() {
  return (
    <div className="space-y-3">
      <div className="mb-4">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
          Currícula · {LESSONS.length} Lecciones
        </h2>
      </div>
      {LESSONS.map((lesson, i) => (
        <LessonCard key={lesson.id} lesson={lesson} index={i} />
      ))}
    </div>
  );
}
