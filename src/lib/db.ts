import Dexie, { type Table } from "dexie";
import type { FieldNote } from "@/types/curriculum";
import type { HardwareProfile, EquipmentKit } from "@/types/hardware";
import { SONY_A6000_PROFILE, SAMSUNG_S24_ULTRA_PROFILE, DEFAULT_KITS } from "@/data/hardware";

// ─── Schema ───────────────────────────────────────────────────────────────────

export interface UserProgressRecord {
  id?: number;
  completedLessonIds: string[];
  completedChallengeIds: string[];
  completedHardwareChallengeIds: string[];
  totalPoints: number;
  currentStreak: number;
  lastActivityAt: string;
  updatedAt: string;
  activeProfileId: string;
  activeKitId: string | null;
}

export interface FieldNoteRecord extends FieldNote {
  dbId?: number;
}

export interface HardwareProfileRecord {
  dbId?: number;
  id: string;
  profile: HardwareProfile;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentKitRecord extends EquipmentKit {
  dbId?: number;
}

// ─── Database ─────────────────────────────────────────────────────────────────

class PhotoOsDatabase extends Dexie {
  progress!: Table<UserProgressRecord>;
  fieldNotes!: Table<FieldNoteRecord>;
  hardwareProfiles!: Table<HardwareProfileRecord>;
  equipmentKits!: Table<EquipmentKitRecord>;

  constructor() {
    super("PhotoOsDB");
    this.version(1).stores({
      progress: "++id,updatedAt",
      fieldNotes: "++dbId,id,lessonId,challengeId,createdAt",
    });
    this.version(2)
      .stores({
        progress: "++id,updatedAt,activeProfileId",
        fieldNotes: "++dbId,id,lessonId,challengeId,createdAt",
        hardwareProfiles: "++dbId,id,createdAt",
        equipmentKits: "++dbId,id,profileId,createdAt",
      })
      .upgrade(async (tx) => {
        await tx
          .table("progress")
          .toCollection()
          .modify((record: Partial<UserProgressRecord>) => {
            record.completedHardwareChallengeIds = [];
            record.activeProfileId = SONY_A6000_PROFILE.id;
            record.activeKitId = null;
          });
      });
  }
}

export const db = new PhotoOsDatabase();

// ─── Progress Service ─────────────────────────────────────────────────────────

const makeDefaultProgress = (): UserProgressRecord => {
  const now = new Date().toISOString();
  return {
    completedLessonIds: [],
    completedChallengeIds: [],
    completedHardwareChallengeIds: [],
    totalPoints: 0,
    currentStreak: 0,
    lastActivityAt: now,
    updatedAt: now,
    activeProfileId: SONY_A6000_PROFILE.id,
    activeKitId: null,
  };
};

export const ProgressService = {
  async get(): Promise<UserProgressRecord> {
    const records = await db.progress.toArray();
    if (records.length > 0) return records[0];
    const defaultRecord = makeDefaultProgress();
    await db.progress.add(defaultRecord);
    return defaultRecord;
  },

  async save(data: Partial<UserProgressRecord>): Promise<void> {
    const records = await db.progress.toArray();
    const now = new Date().toISOString();
    if (records.length > 0 && records[0].id !== undefined) {
      await db.progress.update(records[0].id, { ...data, updatedAt: now });
    } else {
      await db.progress.add({ ...makeDefaultProgress(), ...data, updatedAt: now });
    }
  },
};

// ─── Field Notes Service ──────────────────────────────────────────────────────

export const FieldNotesService = {
  async getAll(): Promise<FieldNoteRecord[]> {
    return db.fieldNotes.orderBy("createdAt").reverse().toArray();
  },

  async add(note: Omit<FieldNote, "id" | "createdAt" | "updatedAt">): Promise<FieldNote> {
    const now = new Date().toISOString();
    const newNote: FieldNote = { id: crypto.randomUUID(), createdAt: now, updatedAt: now, ...note };
    await db.fieldNotes.add(newNote);
    return newNote;
  },

  async update(id: string, content: string): Promise<void> {
    const record = await db.fieldNotes.where("id").equals(id).first();
    if (record?.dbId) {
      await db.fieldNotes.update(record.dbId, { content, updatedAt: new Date().toISOString() });
    }
  },

  async delete(id: string): Promise<void> {
    await db.fieldNotes.where("id").equals(id).delete();
  },
};

// ─── Hardware Service ─────────────────────────────────────────────────────────

export const HardwareService = {
  async seed(): Promise<void> {
    const BUILTINS = [SONY_A6000_PROFILE, SAMSUNG_S24_ULTRA_PROFILE];
    for (const profile of BUILTINS) {
      const exists = await db.hardwareProfiles.where("id").equals(profile.id).count();
      if (exists === 0) {
        const now = new Date().toISOString();
        await db.hardwareProfiles.add({ id: profile.id, profile, createdAt: now, updatedAt: now });
      }
    }
    for (const kit of DEFAULT_KITS) {
      const exists = await db.equipmentKits.where("id").equals(kit.id).count();
      if (exists === 0) await db.equipmentKits.add(kit);
    }
  },

  async getAll(): Promise<HardwareProfile[]> {
    const records = await db.hardwareProfiles.toArray();
    return records.map((r) => r.profile);
  },

  async getById(id: string): Promise<HardwareProfile | null> {
    const record = await db.hardwareProfiles.where("id").equals(id).first();
    return record?.profile ?? null;
  },

  async save(profile: HardwareProfile): Promise<void> {
    const now = new Date().toISOString();
    const existing = await db.hardwareProfiles.where("id").equals(profile.id).first();
    if (existing?.dbId) {
      await db.hardwareProfiles.update(existing.dbId, { profile, updatedAt: now });
    } else {
      await db.hardwareProfiles.add({ id: profile.id, profile, createdAt: now, updatedAt: now });
    }
  },

  async delete(id: string): Promise<void> {
    await db.hardwareProfiles.where("id").equals(id).delete();
  },
};

// ─── Equipment Kits Service ───────────────────────────────────────────────────

export const KitsService = {
  async getAll(): Promise<EquipmentKit[]> {
    return db.equipmentKits.orderBy("createdAt").toArray();
  },

  async save(kit: EquipmentKit): Promise<void> {
    const existing = await db.equipmentKits.where("id").equals(kit.id).first();
    if (existing?.dbId) {
      await db.equipmentKits.update(existing.dbId, kit);
    } else {
      await db.equipmentKits.add(kit);
    }
  },

  async delete(id: string): Promise<void> {
    await db.equipmentKits.where("id").equals(id).delete();
  },
};
