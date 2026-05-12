// ─── Curriculum Types ────────────────────────────────────────────────────────

export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";
export type LessonLevel = "Básico" | "Intermedio" | "Avanzado";
export type CameraTarget = "sony" | "s24" | "both";

export interface ExifTargets {
  isoMin?: number;
  isoMax?: number;
  apertureMin?: number;
  apertureMax?: number;
  shutterSpeedMin?: string;
  shutterSpeedMax?: string;
  focalLengthMin?: number;
  focalLengthMax?: number;
}

export interface LessonSection {
  icon: string;
  title: string;
  content: string;
  highlight: string;
}

export interface LessonTheory {
  headline: string;
  body: string;
  sections: LessonSection[];
}

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  level: LessonLevel;
  camera: CameraTarget;
  estimatedMinutes: number;
  tags: string[];
  exifTargets: ExifTargets;
  theory: LessonTheory;
  practiceExercise: string;
}

export interface Challenge {
  id: string;
  title: string;
  emoji: string;
  color: "purple" | "zinc" | "blue" | "amber" | "emerald" | "red";
  description: string;
  linkedLessonId: string;
  difficulty: DifficultyLevel;
  points: number;
  timeEstimate: string;
  gear: string[];
  tips: string[];
  criteria: string[];
}

export interface PhotoSpot {
  id: string;
  name: string;
  category: string;
  tags: string[];
  description: string;
  coordinates: { lat: number; lng: number };
  geofenceRadiusMeters: number;
  bestTime: string;
  difficulty: string;
  gear: string[];
  tips: string[];
  linkedChallengeIds: string[];
  colorMood: "warm" | "natural" | "urban" | "neon";
  parkingNote?: string;
}

// ─── EXIF / Image Analysis Types ─────────────────────────────────────────────

export interface ParsedExifData {
  make?: string;
  model?: string;
  iso?: number;
  aperture?: number;
  shutterSpeed?: string;
  focalLength?: number;
  focalLengthIn35mm?: number;
  dateTimeOriginal?: string;
  exposureMode?: string;
  whiteBalance?: string;
  flash?: string;
  gps?: { lat: number; lng: number };
}

export interface ExifFeedbackResult {
  score: number; // 0-100
  grade: "A" | "B" | "C" | "D" | "F";
  passed: boolean;
  checks: ExifCheck[];
  summary: string;
  /** Hardware-specific tips injected by ContentEngine */
  hardwareTips: string[];
  /** Hardware-specific warnings injected by ContentEngine */
  hardwareWarnings: string[];
}

export interface ExifCheck {
  label: string;
  value: string;
  target: string;
  passed: boolean;
}

// ─── AI Critic Types ──────────────────────────────────────────────────────────

export interface AICriticRequest {
  imageDataUrl: string;
  lessonId?: string;
}

export interface AICriticResponse {
  compositionScore: number;
  technicalScore: number;
  overallFeedback: string;
  strengths: string[];
  improvements: string[];
  ruleSuggestions: string[];
}

// ─── User Progress Types ──────────────────────────────────────────────────────

export interface FieldNote {
  id: string;
  content: string;
  lessonId?: string;
  challengeId?: string;
  createdAt: string;
  updatedAt: string;
}
