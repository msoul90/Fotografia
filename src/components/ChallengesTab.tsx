"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePhotoStore } from "@/store/photoStore";
import { CHALLENGES } from "@/data/challenges";
import type { Challenge } from "@/types/curriculum";
import { CheckCircle2, Circle, Clock, Star, Trophy } from "lucide-react";

const colorMap = {
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    text: "text-purple-400",
    accent: "bg-purple-500/20",
    btn: "bg-purple-600 hover:bg-purple-500",
  },
  zinc: {
    bg: "bg-zinc-800/40",
    border: "border-zinc-700/40",
    text: "text-zinc-300",
    accent: "bg-zinc-700/40",
    btn: "bg-zinc-600 hover:bg-zinc-500",
  },
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
    accent: "bg-blue-500/20",
    btn: "bg-blue-600 hover:bg-blue-500",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    accent: "bg-amber-500/20",
    btn: "bg-amber-600 hover:bg-amber-500",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    accent: "bg-emerald-500/20",
    btn: "bg-emerald-600 hover:bg-emerald-500",
  },
  red: {
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    text: "text-red-400",
    accent: "bg-red-500/20",
    btn: "bg-red-600 hover:bg-red-500",
  },
};

function ChallengeCard({ challenge, index }: { challenge: Challenge; index: number }) {
  const { completedChallengeIds, completeChallenge, uncompleteChallenge } = usePhotoStore();
  const isCompleted = completedChallengeIds.has(challenge.id);
  const c = colorMap[challenge.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className={`relative overflow-hidden rounded-2xl border p-5 ${c.bg} ${c.border} ${
        isCompleted ? "opacity-70" : ""
      }`}
    >
      {isCompleted && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent" />
      )}

      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <span className="text-3xl">{challenge.emoji}</span>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 ${c.accent}`}>
            <Star className={`h-3 w-3 ${c.text}`} fill="currentColor" />
            <span className={`text-[10px] font-black ${c.text}`}>{challenge.points}pts</span>
          </div>
          <button
            onClick={() =>
              isCompleted ? uncompleteChallenge(challenge.id) : completeChallenge(challenge.id)
            }
            className="text-zinc-600 transition-colors hover:text-emerald-400"
          >
            {isCompleted ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Title */}
      <h4 className={`text-base font-black italic leading-tight ${c.text}`}>{challenge.title}</h4>
      <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-400">{challenge.description}</p>

      {/* Meta */}
      <div className="mt-3 flex items-center gap-3 text-[9px] text-zinc-600">
        <span className="flex items-center gap-1">
          <Clock className="h-2.5 w-2.5" /> {challenge.timeEstimate}
        </span>
        <span>·</span>
        <span>{challenge.difficulty}</span>
        <span>·</span>
        <span>{challenge.gear.join(", ")}</span>
      </div>

      {/* Criteria */}
      <div className="mt-3 space-y-1">
        {challenge.criteria.map((criterion, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${c.text.replace("text-", "bg-")}`} />
            <p className="text-[10px] text-zinc-500">{criterion}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function ChallengesTab() {
  const { completedChallengeIds, totalPoints } = usePhotoStore();
  const completedCount = completedChallengeIds.size;

  return (
    <div className="space-y-3">
      {/* Header stats */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
          {completedCount}/{CHALLENGES.length} Completados
        </h2>
        <div className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1">
          <Trophy className="h-3 w-3 text-amber-400" />
          <span className="text-[10px] font-black text-amber-400">{totalPoints} pts</span>
        </div>
      </div>

      {CHALLENGES.map((challenge, i) => (
        <ChallengeCard key={challenge.id} challenge={challenge} index={i} />
      ))}
    </div>
  );
}
