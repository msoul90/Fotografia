"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePhotoStore } from "@/store/photoStore";
import { CHALLENGES } from "@/data/challenges";
import { Trophy, Star, X } from "lucide-react";

export function CelebrationOverlay() {
  const { celebrationId, dismissCelebration } = usePhotoStore();
  const challenge = CHALLENGES.find((c) => c.id === celebrationId);

  return (
    <AnimatePresence>
      {celebrationId && challenge && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-6 backdrop-blur-md"
          onClick={dismissCelebration}
        >
          <motion.div
            initial={{ scale: 0.5, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="relative w-full max-w-sm overflow-hidden rounded-[2.5rem] border border-amber-500/30 bg-gradient-to-b from-zinc-900 to-zinc-950 p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glow */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent" />

            {/* Stars */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.6 }}
                className="absolute"
                style={{
                  top: `${10 + Math.random() * 30}%`,
                  left: `${5 + i * 17}%`,
                }}
              >
                <Star className="h-4 w-4 text-amber-400" fill="currentColor" />
              </motion.div>
            ))}

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-2xl shadow-amber-500/40"
            >
              <Trophy className="h-10 w-10 text-white" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-[10px] font-black uppercase tracking-widest text-amber-400"
            >
              ¡Desafío Completado!
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="mt-2 text-2xl font-black italic text-white leading-tight"
            >
              {challenge.title}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55 }}
              className="mx-auto mt-4 flex w-fit items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/20 px-4 py-2"
            >
              <Star className="h-4 w-4 text-amber-400" fill="currentColor" />
              <span className="text-lg font-black text-amber-400">+{challenge.points} pts</span>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              onClick={dismissCelebration}
              className="mt-6 w-full rounded-2xl bg-white/10 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-white/20"
            >
              Siguiente Desafío
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
