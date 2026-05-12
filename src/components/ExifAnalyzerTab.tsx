"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Loader2, CheckCircle2, XCircle, AlertCircle, Info } from "lucide-react";
import { ExifParserService, ExifFeedbackAnalyzer } from "@/lib/exifService";
import { LESSONS } from "@/data/lessons";
import type { ParsedExifData, ExifFeedbackResult } from "@/types/curriculum";

export function ExifAnalyzerTab() {
  const [selectedLesson, setSelectedLesson] = useState(LESSONS[0].id);
  const [exifData, setExifData] = useState<ParsedExifData | null>(null);
  const [feedback, setFeedback] = useState<ExifFeedbackResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const lesson = LESSONS.find((l) => l.id === selectedLesson)!;

  const processFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Selecciona un archivo de imagen (JPG, ARW, HEIC, etc.)");
        return;
      }
      setIsLoading(true);
      setError(null);
      setExifData(null);
      setFeedback(null);

      // Preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);

      try {
        const parsed = await ExifParserService.parse(file);
        const result = ExifFeedbackAnalyzer.analyze(parsed, lesson.exifTargets);
        setExifData(parsed);
        setFeedback(result);
      } catch (err) {
        setError("No se encontraron datos EXIF. Asegúrate de subir una foto original sin convertir.");
      } finally {
        setIsLoading(false);
      }
    },
    [lesson]
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

  const gradeColor = {
    A: "text-emerald-400",
    B: "text-blue-400",
    C: "text-amber-400",
    D: "text-orange-400",
    F: "text-red-400",
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
          Analizador EXIF
        </h2>
        <p className="mt-1 text-xs text-zinc-600">
          Sube tu foto y la app compara los metadatos con los objetivos de la lección. 100% local.
        </p>
      </div>

      {/* Lesson selector */}
      <div>
        <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-500">
          Lección objetivo
        </label>
        <select
          value={selectedLesson}
          onChange={(e) => setSelectedLesson(e.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
        >
          {LESSONS.filter((l) => Object.keys(l.exifTargets).length > 0).map((l) => (
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
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
          isDragging
            ? "border-blue-500 bg-blue-500/10"
            : "border-zinc-700 bg-zinc-900/40 hover:border-zinc-500"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.arw,.raw,.cr2,.nef"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
        />
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Preview"
            className="mx-auto mb-3 max-h-32 rounded-xl object-cover"
          />
        ) : (
          <Upload className={`mx-auto mb-3 h-8 w-8 ${isDragging ? "text-blue-400" : "text-zinc-600"}`} />
        )}
        <p className="text-xs font-bold text-zinc-400">
          {imagePreview ? "Cambiar foto" : "Arrastra o toca para subir una foto"}
        </p>
        <p className="mt-1 text-[10px] text-zinc-600">JPG, ARW, RAW, HEIC — Todo procesado localmente</p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-4 text-blue-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm font-bold">Analizando metadatos EXIF...</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {exifData && feedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {/* Score */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-center">
              <div className={`text-5xl font-black ${gradeColor[feedback.grade]}`}>
                {feedback.grade}
              </div>
              <div className="mt-1 text-lg font-black text-white">{feedback.score}/100</div>
              <p className="mt-2 text-xs text-zinc-400">{feedback.summary}</p>
            </div>

            {/* Checks */}
            <div className="space-y-2">
              {feedback.checks.map((check, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between rounded-xl border p-3 ${
                    check.passed
                      ? "border-emerald-500/20 bg-emerald-500/10"
                      : "border-red-500/20 bg-red-500/10"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {check.passed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-400" />
                    )}
                    <div>
                      <p className="text-[10px] font-black uppercase text-zinc-400">{check.label}</p>
                      <p className="text-sm font-bold text-white">{check.value}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-zinc-600">Objetivo</p>
                    <p className="text-[10px] font-bold text-zinc-400">{check.target}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Raw EXIF data */}
            <details className="rounded-xl border border-zinc-800 bg-zinc-900">
              <summary className="flex cursor-pointer items-center gap-2 p-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                <Info className="h-3 w-3" /> Datos EXIF Completos
              </summary>
              <div className="border-t border-zinc-800 p-3 space-y-1">
                {Object.entries(exifData)
                  .filter(([, v]) => v !== undefined)
                  .map(([k, v]) => (
                    <div key={k} className="flex justify-between text-[10px]">
                      <span className="text-zinc-600 capitalize">{k}</span>
                      <span className="font-bold text-zinc-400">{String(v)}</span>
                    </div>
                  ))}
              </div>
            </details>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
