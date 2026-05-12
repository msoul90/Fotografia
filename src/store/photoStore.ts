"use client";

import { create } from "zustand";
import { ProgressService, FieldNotesService, HardwareService, KitsService } from "@/lib/db";
import type { FieldNote } from "@/types/curriculum";
import type { HardwareProfile, EquipmentKit, OpticalCamera, SmartDevice, Lens } from "@/types/hardware";
import { isOpticalCamera } from "@/types/hardware";
import { CHALLENGES } from "@/data/challenges";
import { SONY_A6000_PROFILE } from "@/data/hardware";
import { UniversalPhysicsEngine } from "@/lib/physicsEngine";
import type { PhysicsSnapshot } from "@/lib/physicsEngine";

// ═══════════════════════════════════════════════════════════════════════════════
// PHOTO_OS STORE — Extended with Hardware Profile System
// ═══════════════════════════════════════════════════════════════════════════════

interface PhotoOsState {
  // ── Progress ──────────────────────────────────────────────────────────────
  completedLessonIds: Set<string>;
  completedChallengeIds: Set<string>;
  completedHardwareChallengeIds: Set<string>;
  totalPoints: number;
  currentStreak: number;
  isLoaded: boolean;

  // ── Hardware ──────────────────────────────────────────────────────────────
  activeProfile: HardwareProfile;
  availableProfiles: HardwareProfile[];
  activeKit: EquipmentKit | null;
  availableKits: EquipmentKit[];
  /** Live physics snapshot — recomputed on profile/lens change */
  physicsSnapshot: PhysicsSnapshot;

  // ── Field Notes ───────────────────────────────────────────────────────────
  fieldNotes: FieldNote[];

  // ── UI State ──────────────────────────────────────────────────────────────
  activeTab: string;
  celebrationId: string | null;
  garageOpen: boolean;

  // ── Actions: Lifecycle ────────────────────────────────────────────────────
  loadFromDB: () => Promise<void>;

  // ── Actions: Progress ─────────────────────────────────────────────────────
  toggleLesson: (id: string) => Promise<void>;
  completeChallenge: (id: string, points?: number) => Promise<void>;
  uncompleteChallenge: (id: string, points?: number) => Promise<void>;
  completeHardwareChallenge: (id: string, points: number) => Promise<void>;

  // ── Actions: Hardware ─────────────────────────────────────────────────────
  setActiveProfile: (profile: HardwareProfile) => Promise<void>;
  setActiveLens: (lensId: string) => Promise<void>;
  activateKit: (kit: EquipmentKit) => Promise<void>;
  saveProfile: (profile: HardwareProfile) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;
  saveKit: (kit: EquipmentKit) => Promise<void>;
  deleteKit: (id: string) => Promise<void>;

  // ── Actions: Field Notes ──────────────────────────────────────────────────
  addFieldNote: (note: Omit<FieldNote, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateFieldNote: (id: string, content: string) => Promise<void>;
  deleteFieldNote: (id: string) => Promise<void>;

  // ── Actions: UI ───────────────────────────────────────────────────────────
  setActiveTab: (tab: string) => void;
  dismissCelebration: () => void;
  setGarageOpen: (open: boolean) => void;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function computeSnapshot(profile: HardwareProfile): PhysicsSnapshot {
  return UniversalPhysicsEngine.snapshot(profile, { subjectDistanceM: 3 });
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const usePhotoStore = create<PhotoOsState>((set, get) => ({
  completedLessonIds: new Set(),
  completedChallengeIds: new Set(),
  completedHardwareChallengeIds: new Set(),
  totalPoints: 0,
  currentStreak: 0,
  isLoaded: false,
  activeProfile: SONY_A6000_PROFILE,
  availableProfiles: [],
  activeKit: null,
  availableKits: [],
  physicsSnapshot: computeSnapshot(SONY_A6000_PROFILE),
  fieldNotes: [],
  activeTab: "academy",
  celebrationId: null,
  garageOpen: false,

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  loadFromDB: async () => {
    await HardwareService.seed();
    const [progress, notes, profiles, kits] = await Promise.all([
      ProgressService.get(),
      FieldNotesService.getAll(),
      HardwareService.getAll(),
      KitsService.getAll(),
    ]);

    const activeProfile =
      profiles.find((p) => p.id === progress.activeProfileId) ?? SONY_A6000_PROFILE;
    const activeKit = kits.find((k) => k.id === progress.activeKitId) ?? null;

    set({
      completedLessonIds: new Set(progress.completedLessonIds),
      completedChallengeIds: new Set(progress.completedChallengeIds),
      completedHardwareChallengeIds: new Set(progress.completedHardwareChallengeIds ?? []),
      totalPoints: progress.totalPoints,
      currentStreak: progress.currentStreak,
      activeProfile,
      availableProfiles: profiles,
      activeKit,
      availableKits: kits,
      physicsSnapshot: computeSnapshot(activeProfile),
      fieldNotes: notes,
      isLoaded: true,
    });
  },

  // ── Progress ──────────────────────────────────────────────────────────────

  toggleLesson: async (id) => {
    const { completedLessonIds, completedChallengeIds, completedHardwareChallengeIds, totalPoints } = get();
    const newSet = new Set(completedLessonIds);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    set({ completedLessonIds: newSet });
    await ProgressService.save({
      completedLessonIds: Array.from(newSet),
      completedChallengeIds: Array.from(completedChallengeIds),
      completedHardwareChallengeIds: Array.from(completedHardwareChallengeIds),
      totalPoints,
    });
  },

  completeChallenge: async (id, pts) => {
    const { completedChallengeIds, completedLessonIds, completedHardwareChallengeIds, totalPoints } = get();
    if (completedChallengeIds.has(id)) return;
    const challenge = CHALLENGES.find((c) => c.id === id);
    const points = pts ?? challenge?.points ?? 100;
    const newSet = new Set(completedChallengeIds);
    newSet.add(id);
    const newPoints = totalPoints + points;
    set({ completedChallengeIds: newSet, totalPoints: newPoints, celebrationId: id });
    await ProgressService.save({
      completedChallengeIds: Array.from(newSet),
      completedLessonIds: Array.from(completedLessonIds),
      completedHardwareChallengeIds: Array.from(completedHardwareChallengeIds),
      totalPoints: newPoints,
      lastActivityAt: new Date().toISOString(),
    });
  },

  uncompleteChallenge: async (id, pts) => {
    const { completedChallengeIds, completedLessonIds, completedHardwareChallengeIds, totalPoints } = get();
    const challenge = CHALLENGES.find((c) => c.id === id);
    const points = pts ?? challenge?.points ?? 100;
    const newSet = new Set(completedChallengeIds);
    newSet.delete(id);
    const newPoints = Math.max(0, totalPoints - points);
    set({ completedChallengeIds: newSet, totalPoints: newPoints });
    await ProgressService.save({
      completedChallengeIds: Array.from(newSet),
      completedLessonIds: Array.from(completedLessonIds),
      completedHardwareChallengeIds: Array.from(completedHardwareChallengeIds),
      totalPoints: newPoints,
    });
  },

  completeHardwareChallenge: async (id, points) => {
    const { completedHardwareChallengeIds, completedChallengeIds, completedLessonIds, totalPoints } = get();
    if (completedHardwareChallengeIds.has(id)) return;
    const newSet = new Set(completedHardwareChallengeIds);
    newSet.add(id);
    const newPoints = totalPoints + points;
    set({ completedHardwareChallengeIds: newSet, totalPoints: newPoints, celebrationId: id });
    await ProgressService.save({
      completedHardwareChallengeIds: Array.from(newSet),
      completedChallengeIds: Array.from(completedChallengeIds),
      completedLessonIds: Array.from(completedLessonIds),
      totalPoints: newPoints,
      lastActivityAt: new Date().toISOString(),
    });
  },

  // ── Hardware ──────────────────────────────────────────────────────────────

  setActiveProfile: async (profile) => {
    const snapshot = computeSnapshot(profile);
    set({ activeProfile: profile, physicsSnapshot: snapshot, activeKit: null });
    await ProgressService.save({ activeProfileId: profile.id, activeKitId: null });
  },

  setActiveLens: async (lensId) => {
    const { activeProfile } = get();
    let updated: HardwareProfile;

    if (isOpticalCamera(activeProfile)) {
      updated = { ...activeProfile, activeLensId: lensId } as OpticalCamera;
    } else {
      updated = { ...activeProfile, activeLensId: lensId } as SmartDevice;
    }

    await HardwareService.save(updated);
    const snapshot = computeSnapshot(updated);
    set({ activeProfile: updated, physicsSnapshot: snapshot });
  },

  activateKit: async (kit) => {
    const { availableProfiles } = get();
    const profile = availableProfiles.find((p) => p.id === kit.profileId);
    if (!profile) return;
    const snapshot = computeSnapshot(profile);
    set({ activeKit: kit, activeProfile: profile, physicsSnapshot: snapshot });
    await ProgressService.save({ activeProfileId: profile.id, activeKitId: kit.id });
  },

  saveProfile: async (profile) => {
    await HardwareService.save(profile);
    const profiles = await HardwareService.getAll();
    set({ availableProfiles: profiles });
  },

  deleteProfile: async (id) => {
    await HardwareService.delete(id);
    const profiles = await HardwareService.getAll();
    set({ availableProfiles: profiles });
  },

  saveKit: async (kit) => {
    await KitsService.save(kit);
    const kits = await KitsService.getAll();
    set({ availableKits: kits });
  },

  deleteKit: async (id) => {
    await KitsService.delete(id);
    const kits = await KitsService.getAll();
    set({ availableKits: kits });
  },

  // ── Field Notes ───────────────────────────────────────────────────────────

  addFieldNote: async (note) => {
    const newNote = await FieldNotesService.add(note);
    set((state) => ({ fieldNotes: [newNote, ...state.fieldNotes] }));
  },

  updateFieldNote: async (id, content) => {
    await FieldNotesService.update(id, content);
    set((state) => ({
      fieldNotes: state.fieldNotes.map((n) =>
        n.id === id ? { ...n, content, updatedAt: new Date().toISOString() } : n
      ),
    }));
  },

  deleteFieldNote: async (id) => {
    await FieldNotesService.delete(id);
    set((state) => ({ fieldNotes: state.fieldNotes.filter((n) => n.id !== id) }));
  },

  // ── UI ────────────────────────────────────────────────────────────────────

  setActiveTab: (tab) => set({ activeTab: tab }),
  dismissCelebration: () => set({ celebrationId: null }),
  setGarageOpen: (open) => set({ garageOpen: open }),
}));

// ─── Selectors ────────────────────────────────────────────────────────────────

export const useProgress = () => {
  const store = usePhotoStore();
  const totalBase = 5 + CHALLENGES.length;
  const completed =
    store.completedLessonIds.size +
    store.completedChallengeIds.size +
    store.completedHardwareChallengeIds.size;
  return {
    percentage: Math.min(100, Math.round((completed / totalBase) * 100)),
    completedLessons: store.completedLessonIds.size,
    completedChallenges: store.completedChallengeIds.size,
    completedHardwareChallenges: store.completedHardwareChallengeIds.size,
    totalPoints: store.totalPoints,
  };
};

export const useHardware = () => {
  const store = usePhotoStore();
  return {
    activeProfile: store.activeProfile,
    availableProfiles: store.availableProfiles,
    activeKit: store.activeKit,
    availableKits: store.availableKits,
    physicsSnapshot: store.physicsSnapshot,
    isOptical: isOpticalCamera(store.activeProfile),
    themeAccent: store.physicsSnapshot.themeAccent,
    mode: store.physicsSnapshot.mode,
  };
};
