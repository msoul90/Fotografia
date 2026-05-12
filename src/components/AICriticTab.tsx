"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Loader2, Star, TrendingUp, TrendingDown, Minus, Bot } from "lucide-react";
import { AICriticService } from "@/lib/aiCriticService";
import { LESSONS } from "@/data/lessons";
import type { AICriticResponse } from "@/types/curriculum";

export function AICriticTab() {
  const [selectedLessonId, setSelectedLessonId] = useState<string>("");
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<AICriticResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;
      setIsLoading(true);
      setError(null);
      setResult(null);

      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        setPreview(dataUrl);
        try {
          const response = await AICriticService.analyze({
            imageDataUrl: dataUrl,
            lessonId: selectedLessonId || undefined,
          });
          setResult(response);
        } catch {
          setError("Error analizando la imagen. Intenta con otra foto.");
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsDataURL(file);
    },
    [selectedLessonId]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const ScoreBar = ({ label, value }: { label: string; value: number }) => (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-zinc-400">{label}</span>
        <span className="font-black text-white">{value}/100</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className={`h-full rounded-full ${
            value >= 80
              ? "bg-gradient-to-r from-emerald-600 to-emerald-400"
              : value >= 60
              ? "bg-gradient-to-r from-amber-600 to-amber-400"
              : "bg-gradient-to-r from-red-600 to-red-400"
          }`}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
          AI Photography Critic
        </h2>
        <p className="mt-1 text-xs text-zinc-600">
          Análisis de composición basado en reglas clásicas. Conecta tu endpoint LLM para análisis real.
        </p>
      </div>

      {/* Lesson context selector */}
      <div>
        <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-500">
          Contexto de lección (opcional)
        </label>
        <select
          value={selectedLessonId}
          onChange={(e) => setSelectedLessonId(e.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="">Sin contexto específico</option>
          {LESSONS.map((l) => (
            <option key={l.id} value={l.id}>
              {l.title}
            </option>
          ))}
        </select>
      </div>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
          isDragging ? "border-indigo-500 bg-indigo-500/10" : "border-zinc-700 bg-zinc-900/40 hover:border-zinc-500"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
        />
        {preview ? (
          <img src={preview} alt="Preview" className="mx-auto mb-3 max-h-40 rounded-xl object-cover" />
        ) : (
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20">
            <Bot className="h-6 w-6 text-indigo-400" />
          </div>
        )}
        <p className="text-xs font-bold text-zinc-400">
          {preview ? "Cambiar foto" : "Sube una foto para análisis de composición"}
        </p>
        <p className="mt-1 text-[10px] text-zinc-600">JPG, PNG, HEIC</p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-4 text-indigo-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm font-bold">Analizando composición...</span>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Scores */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 space-y-3">
              <ScoreBar label="Composición" value={result.compositionScore} />
              <ScoreBar label="Técnica" value={result.technicalScore} />
            </div>

            {/* Overall feedback */}
            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-indigo-400" fill="currentColor" />
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                  Feedback General
                </span>
              </div>
              <p className="text-xs leading-relaxed text-zinc-300">{result.overallFeedback}</p>
            </div>

            {/* Strengths */}
            <div className="rounded-2xl border border-emerald-500/20 bg-zinc-900 p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                  Fortalezas
                </span>
              </div>
              <ul className="space-y-1.5">
                {result.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-500" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div className="rounded-2xl border border-amber-500/20 bg-zinc-900 p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className="h-4 w-4 text-amber-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                  Áreas de Mejora
                </span>
              </div>
              <ul className="space-y-1.5">
                {result.improvements.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Rule suggestions */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Minus className="h-4 w-4 text-zinc-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Reglas de Composición
                </span>
              </div>
              <ul className="space-y-1">
                {result.ruleSuggestions.map((s, i) => (
                  <li key={i} className="text-[10px] font-mono text-zinc-500">{s}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
