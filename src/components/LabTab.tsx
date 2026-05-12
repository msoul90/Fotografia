"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePhotoStore } from "@/store/photoStore";
import { PenLine, Trash2, Save, X, BookOpen, StickyNote, Plus } from "lucide-react";

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Luz",
    content: "Iluminaciones -60, Sombras +40. Recupera el rango dinámico del .ARW.",
  },
  {
    step: "02",
    title: "Color",
    content: "Mezclador › Púrpura › Tono -20 para morados más naturales sin saturar.",
  },
  {
    step: "03",
    title: "Detalle",
    content: "Máscara de enfoque en 70. Ruido luminancia +30 para cielos limpios.",
  },
  {
    step: "04",
    title: "Efecto",
    content: "Clarity +15 para texturas. Dehaze +10 en paisajes. Evitar en retratos.",
  },
];

const TIPS = [
  { device: "Sony a6000", tip: "Back Button Focus", detail: "Separa el enfoque del disparo. Botón AEL como AF-ON en menú de configuración 6." },
  { device: "Sony a6000", tip: "Picture Profile Off", detail: "Usa PP=OFF para video RAW en S-Log3 y recupera el color en post." },
  { device: "S24 Ultra", tip: "Expert RAW", detail: "Usa 16-bit para recuperar cielos quemados. Activa histograma en tiempo real." },
  { device: "S24 Ultra", tip: "Zoom 10x", detail: "El zoom periscópico de 10x es ideal para comprimir perspectivas y aislar sujetos." },
];

function FieldNotesSection() {
  const { fieldNotes, addFieldNote, updateFieldNote, deleteFieldNote } = usePhotoStore();
  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleAdd = async () => {
    if (!newNote.trim()) return;
    await addFieldNote({ content: newNote.trim() });
    setNewNote("");
  };

  const handleEdit = (id: string, content: string) => {
    setEditingId(id);
    setEditContent(content);
  };

  const handleSave = async () => {
    if (!editingId || !editContent.trim()) return;
    await updateFieldNote(editingId, editContent.trim());
    setEditingId(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <StickyNote className="h-4 w-4 text-blue-400" />
        <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
          Notas de Campo
        </h3>
      </div>

      {/* Add note */}
      <div className="flex gap-2">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Escribe una nota de campo, observación, idea..."
          rows={2}
          className="flex-1 resize-none rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
        />
        <button
          onClick={handleAdd}
          disabled={!newNote.trim()}
          className="self-end rounded-xl bg-blue-600 p-2.5 text-white transition-colors hover:bg-blue-500 disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Notes list */}
      {fieldNotes.length === 0 ? (
        <p className="text-center text-[10px] text-zinc-700 py-4">No hay notas aún. ¡Añade tu primera observación!</p>
      ) : (
        <div className="space-y-2">
          {fieldNotes.map((note) => (
            <div
              key={note.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3"
            >
              {editingId === note.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                    className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1.5 text-[10px] font-bold text-white hover:bg-blue-500"
                    >
                      <Save className="h-3 w-3" /> Guardar
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex items-center gap-1 rounded-lg border border-zinc-700 px-2.5 py-1.5 text-[10px] font-bold text-zinc-400 hover:text-white"
                    >
                      <X className="h-3 w-3" /> Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs leading-relaxed text-zinc-400">{note.content}</p>
                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={() => handleEdit(note.id, note.content)}
                      className="rounded-lg p-1.5 text-zinc-600 hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
                    >
                      <PenLine className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => deleteFieldNote(note.id)}
                      className="rounded-lg p-1.5 text-zinc-600 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
              <p className="mt-1.5 text-[9px] text-zinc-700">
                {new Date(note.createdAt).toLocaleDateString("es-MX", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function LabTab() {
  return (
    <div className="space-y-6">
      {/* Lightroom Workflow */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-blue-400" />
          <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            Workflow Lightroom Mobile
          </h2>
        </div>
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
          {WORKFLOW_STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`flex gap-4 p-4 ${i !== WORKFLOW_STEPS.length - 1 ? "border-b border-zinc-800" : ""}`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-[10px] font-black text-white">
                {step.step}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{step.title}</h4>
                <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-400">{step.content}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Device Tips */}
      <div>
        <h2 className="mb-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">
          Tips por Dispositivo
        </h2>
        <div className="grid grid-cols-1 gap-2">
          {TIPS.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-[9px] font-black uppercase tracking-widest ${
                    tip.device.includes("Sony") ? "text-blue-400" : "text-amber-400"
                  }`}
                >
                  {tip.device}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">{tip.tip}</h4>
              <p className="mt-0.5 text-[10px] leading-relaxed text-zinc-500">{tip.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Field Notes */}
      <FieldNotesSection />
    </div>
  );
}
