// ═══════════════════════════════════════════════════════════════════════════════
// HARDWARE TYPE SYSTEM — PHOTO_OS PRO
// Discriminated Union for Optical Cameras vs Computational Smart Devices.
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Shared Primitives ────────────────────────────────────────────────────────

export type SensorSize =
  | "FullFrame"    // 36 × 24mm — cropFactor 1.0
  | "APS-C"        // 23.5 × 15.6mm — cropFactor ~1.5–1.6
  | "APS-C-Canon"  // 22.3 × 14.9mm — cropFactor ~1.6
  | "MicroFourThirds" // 17.3 × 13mm — cropFactor 2.0
  | "1-inch"       // 13.2 × 8.8mm — cropFactor 2.7
  | "Smartphone";  // varies — not meaningful for DoF calcs

export type MountType =
  | "Sony-E"
  | "Canon-RF"
  | "Canon-EF"
  | "Nikon-Z"
  | "Nikon-F"
  | "MFT"
  | "Fuji-X"
  | "Leica-M"
  | "Fixed"; // smartphones & fixed-lens cameras

export type StabilizationType = "None" | "OIS" | "IBIS" | "OIS+IBIS";

// ─── Lens Definitions ─────────────────────────────────────────────────────────

export interface PrimeLens {
  readonly kind: "Prime";
  id: string;
  brand: string;
  name: string;
  /** Real focal length in mm */
  focalLengthMm: number;
  /** Max aperture (lowest f-number) */
  maxAperture: number;
  /** Min aperture */
  minAperture: number;
  stabilization: StabilizationType;
  mountType: MountType;
}

export interface ZoomLens {
  readonly kind: "Zoom";
  id: string;
  brand: string;
  name: string;
  /** Real focal range in mm */
  focalLengthMinMm: number;
  focalLengthMaxMm: number;
  /** Max aperture at wide end */
  maxApertureWide: number;
  /** Max aperture at tele end (may differ on variable-aperture zooms) */
  maxApertureTele: number;
  stabilization: StabilizationType;
  mountType: MountType;
}

export type Lens = PrimeLens | ZoomLens;

// ─── Smartphone Sub-Lens (fixed, integrated) ──────────────────────────────────

export interface SmartLens {
  id: string;
  name: string;
  /** Real focal length of the physical element in mm */
  focalLengthReal: number;
  /** 35mm equivalent focal length reported by manufacturer */
  focalLengthEquivalent: number;
  /** Fixed aperture (f-number) */
  aperture: number;
  /** Optical zoom multiplier as marketed (0.6×, 1×, 3×, 5×, 10×) */
  zoomMultiplier: number;
  stabilization: StabilizationType;
  /** Pixel count of the sensor behind this lens */
  megapixels: number;
  /** Whether this lens supports night/stack mode */
  supportsNightMode: boolean;
}

// ─── OpticalCamera (DSLR / Mirrorless) ───────────────────────────────────────

export interface OpticalCamera {
  readonly kind: "OpticalCamera";
  id: string;
  brand: string;
  model: string;
  sensorSize: SensorSize;
  cropFactor: number;
  mountType: MountType;
  /** Fastest mechanical shutter speed in seconds (e.g. 1/4000 = 0.00025) */
  mechanicalShutterMaxSec: number;
  /** Fastest electronic shutter speed if available */
  electronicShutterMaxSec?: number;
  bodyStabilization: StabilizationType;
  /** ISO range */
  isoMin: number;
  isoMax: number;
  /** Attached lenses in this configuration */
  lenses: Lens[];
  /** Currently selected lens id */
  activeLensId: string | null;
  isComputational: false;
}

// ─── SmartDevice (Smartphone / Tablet) ───────────────────────────────────────

export interface SmartDevice {
  readonly kind: "SmartDevice";
  id: string;
  brand: string;
  model: string;
  sensorSize: "Smartphone";
  /** Multi-lens array built into the device */
  sensorArray: SmartLens[];
  /** Currently selected lens id */
  activeLensId: string | null;
  isComputational: true;
  /** Supports AI-based portrait / bokeh simulation */
  supportsPortraitMode: boolean;
  /** Supports multi-frame night stacking */
  supportsNightography: boolean;
  /** Supports multi-frame astro mode */
  supportsAstroMode: boolean;
}

// ─── Discriminated Union ──────────────────────────────────────────────────────

export type HardwareProfile = OpticalCamera | SmartDevice;

// ─── Kit (User's Named Equipment Setup) ──────────────────────────────────────

export interface EquipmentKit {
  id: string;
  name: string;
  emoji: string;
  description: string;
  profileId: string;
  /** Optional note about the use-case */
  useCase?: string;
  createdAt: string;
}

// ─── Type Guards ──────────────────────────────────────────────────────────────

export const isOpticalCamera = (p: HardwareProfile): p is OpticalCamera =>
  p.kind === "OpticalCamera";

export const isSmartDevice = (p: HardwareProfile): p is SmartDevice =>
  p.kind === "SmartDevice";

// ─── Derived: active lens helpers ─────────────────────────────────────────────

export function getActiveLens(profile: OpticalCamera): Lens | null {
  if (!profile.activeLensId) return null;
  return profile.lenses.find((l) => l.id === profile.activeLensId) ?? null;
}

export function getActiveSmartLens(profile: SmartDevice): SmartLens | null {
  if (!profile.activeLensId) return null;
  return profile.sensorArray.find((l) => l.id === profile.activeLensId) ?? null;
}

export function getLensFocalMin(lens: Lens): number {
  return lens.kind === "Prime" ? lens.focalLengthMm : lens.focalLengthMinMm;
}

export function getLensFocalMax(lens: Lens): number {
  return lens.kind === "Prime" ? lens.focalLengthMm : lens.focalLengthMaxMm;
}

export function getLensMaxAperture(lens: Lens, atFocal?: number): number {
  if (lens.kind === "Prime") return lens.maxAperture;
  if (atFocal === undefined) return lens.maxApertureWide;
  // Linear interpolation for variable aperture zooms
  const t =
    (atFocal - lens.focalLengthMinMm) /
    (lens.focalLengthMaxMm - lens.focalLengthMinMm);
  return lens.maxApertureWide + t * (lens.maxApertureTele - lens.maxApertureWide);
}
