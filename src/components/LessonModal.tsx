"use client";

import { motion } from "framer-motion";
import type { Lesson } from "@/types/curriculum";
import { X, BookOpen } from "lucide-react";

interface LessonModalProps {
  lesson: Lesson;
  onClose: () => void;
}

export function LessonModal({ lesson, onClose }: LessonModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-md sm:items-center sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
        className="relative w-full max-w-lg overflow-hidden rounded-t-3xl border border-zinc-800 bg-zinc-950 sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-zinc-700" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-800 p-6">
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-blue-500">
              Lección Técnica
            </p>
            <h2 className="mt-1 text-2xl font-black italic leading-tight text-white">
              {lesson.theory.headline}
            </h2>
            <p className="mt-1 text-xs text-zinc-500">{lesson.theory.body}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 shrink-0 rounded-xl p-2 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto p-6">
          <div className="space-y-4">
            {lesson.theory.sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="rounded-2xl border border-zinc-800/60 bg-zinc-900/60 p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{section.icon}</span>
                  <h4 className="text-sm font-bold text-white">{section.title}</h4>
                </div>
                <p className="text-xs leading-relaxed text-zinc-400">{section.content}</p>
                <div className="mt-3 rounded-xl border border-blue-500/20 bg-blue-500/10 px-3 py-2">
                  <p className="text-[10px] font-bold text-blue-400">{section.highlight}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Practice */}
          <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-amber-400" />
              <h4 className="text-xs font-black uppercase tracking-widest text-amber-400">
                Ejercicio Práctico
              </h4>
            </div>
            <p className="text-xs leading-relaxed text-zinc-300">{lesson.practiceExercise}</p>
          </div>
        </div>

        <div className="border-t border-zinc-800 p-4">
          <button
            onClick={onClose}
            className="w-full rounded-2xl bg-blue-600 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-blue-500"
          >
            Entendido, Maestro
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
