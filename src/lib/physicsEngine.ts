import type {
  HardwareProfile,
  OpticalCamera,
  SmartDevice,
  Lens,
  SmartLens,
} from "@/types/hardware";
import {
  isOpticalCamera,
  isSmartDevice,
  getActiveLens,
  getActiveSmartLens,
  getLensFocalMin,
  getLensFocalMax,
  getLensMaxAperture,
} from "@/types/hardware";

// ═══════════════════════════════════════════════════════════════════════════════
// UNIVERSAL PHYSICS ENGINE — PHOTO_OS PRO
//
// Computes optical "ground truth" values that adapt to the active hardware
// profile. Each calculation is documented with the underlying formula.
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Result Types ─────────────────────────────────────────────────────────────

export interface EquivalenceResult {
  /** The actual focal length of the lens/element */
  realFocalMm: number;
  /** 35mm-equivalent focal length for comparison across systems */
  equivalentFocalMm: number;
  /** How it was derived */
  method: "cropFactor" | "manufacturerReported";
  cropFactor: number;
}

export interface ReciprocityResult {
  /**
   * Minimum safe shutter speed (in seconds) to avoid camera shake.
   * 1 / (equivalentFocal × stabilizationStops ^ 2) — rounded to nearest
   * standard value.
   */
  minSafeShutterSec: number;
  /** Human-readable fraction e.g. "1/250" */
  minSafeShutterDisplay: string;
  /** How many extra stops of safety margin OIS/IBIS provides */
  stabilizationStops: number;
  /** Whether stabilization was taken into account */
  stabilizationActive: boolean;
  rule: "ReciprocityRule" | "OIS-compensated";
}

export interface ApertureCapabilities {
  /** Actual min f-number available on the current configuration */
  minFNumber: number;
  /** Actual max f-number available */
  maxFNumber: number;
  /** Whether the user can manually change aperture */
  isManuallyAdjustable: boolean;
  /** Depth-of-field simulator is meaningful only for real optics */
  dofSimulatorEnabled: boolean;
  /** Computational portrait mode available (smartphone bokeh) */
  portraitModeEnabled: boolean;
  /** Fixed aperture value — set for smartphones only */
  fixedFNumber: number | null;
}

export interface DepthOfFieldResult {
  /** Near focus limit in meters */
  nearLimitM: number;
  /** Far focus limit in meters */
  farLimitM: number;
  /** Total depth of field in meters */
  depthM: number;
  /** Hyperfocal distance in meters */
  hyperfocalM: number;
  /** Human-readable summary */
  summary: string;
}

export interface PhysicsSnapshot {
  equivalence: EquivalenceResult;
  reciprocity: ReciprocityResult;
  aperture: ApertureCapabilities;
  dof?: DepthOfFieldResult;
  /** Mode label for the UI */
  mode: "Óptico" | "Computacional";
  /** Theme accent colour for the dynamic dashboard */
  themeAccent: "blue" | "purple";
}

// ─── Constants ────────────────────────────────────────────────────────────────

/** Circle of confusion in mm — standard values by sensor */
const COC_BY_SENSOR: Record<string, number> = {
  FullFrame: 0.029,
  "APS-C": 0.019,
  "APS-C-Canon": 0.018,
  MicroFourThirds: 0.015,
  "1-inch": 0.011,
  Smartphone: 0.007,
};

/** OIS / IBIS stabilization stops by type */
const STABILIZATION_STOPS: Record<string, number> = {
  None: 0,
  OIS: 3,
  IBIS: 4,
  "OIS+IBIS": 5,
};

/** Standard shutter speed denominator sequence (1/x seconds) */
const STANDARD_DENOMS = [
  8000, 6400, 5000, 4000, 3200, 2500, 2000, 1600, 1250, 1000,
  800, 640, 500, 400, 320, 250, 200, 160, 125, 100, 80, 60, 50,
  40, 30, 25, 20, 15, 13, 10, 8, 6, 5, 4, 3, 2,
];

// ─── Engine ───────────────────────────────────────────────────────────────────

export class UniversalPhysicsEngine {
  // ── 1. Focal Equivalence ──────────────────────────────────────────────────

  static computeEquivalence(
    profile: HardwareProfile,
    focalOverride?: number
  ): EquivalenceResult {
    if (isOpticalCamera(profile)) {
      const lens = getActiveLens(profile);
      const real = focalOverride ?? (lens ? getLensFocalMin(lens) : 50);
      return {
        realFocalMm: real,
        equivalentFocalMm: Math.round(real * profile.cropFactor),
        method: "cropFactor",
        cropFactor: profile.cropFactor,
      };
    }

    // SmartDevice — use manufacturer-reported 35mm equivalent
    const lens = getActiveSmartLens(profile);
    const real = focalOverride ?? lens?.focalLengthReal ?? 5.4;
    const equivalent = lens?.focalLengthEquivalent ?? Math.round(real * 6);
    return {
      realFocalMm: real,
      equivalentFocalMm: equivalent,
      method: "manufacturerReported",
      cropFactor: equivalent / real,
    };
  }

  // ── 2. Reciprocity / Safe Shutter Speed ──────────────────────────────────

  static computeReciprocity(
    profile: HardwareProfile,
    equivalentFocalMm: number
  ): ReciprocityResult {
    const stabType = isOpticalCamera(profile)
      ? (() => {
          const lens = getActiveLens(profile);
          const lensStab = lens?.stabilization ?? "None";
          const bodyStab = profile.bodyStabilization;
          // Combine: if both OIS and IBIS are active
          if (lensStab === "OIS" && bodyStab === "IBIS") return "OIS+IBIS";
          if (lensStab === "OIS" || lensStab === "OIS+IBIS") return lensStab;
          return bodyStab;
        })()
      : (() => {
          const lens = getActiveSmartLens(profile);
          return lens?.stabilization ?? "None";
        })();

    const stops = STABILIZATION_STOPS[stabType] ?? 0;
    // Base rule: 1 / equivalentFocal seconds
    const baseSec = 1 / equivalentFocalMm;
    // Each stop of stabilization halves the required shutter speed
    const safeSec = baseSec / Math.pow(2, stops);

    // Snap to nearest slower standard speed
    const denom = STANDARD_DENOMS.find((d) => 1 / d <= safeSec * 1.05) ?? 2;
    const displaySec = 1 / denom;

    return {
      minSafeShutterSec: displaySec,
      minSafeShutterDisplay: displaySec >= 1 ? `${displaySec}s` : `1/${denom}`,
      stabilizationStops: stops,
      stabilizationActive: stops > 0,
      rule: stops > 0 ? "OIS-compensated" : "ReciprocityRule",
    };
  }

  // ── 3. Aperture Capabilities ──────────────────────────────────────────────

  static computeApertureCapabilities(profile: HardwareProfile): ApertureCapabilities {
    if (isOpticalCamera(profile)) {
      const lens = getActiveLens(profile);
      return {
        minFNumber: lens ? getLensMaxAperture(lens) : 1.4,
        maxFNumber: 22,
        isManuallyAdjustable: true,
        dofSimulatorEnabled: true,
        portraitModeEnabled: false,
        fixedFNumber: null,
      };
    }

    // Smartphone — aperture is fixed per-lens
    const lens = getActiveSmartLens(profile);
    const fixed = lens?.aperture ?? 1.8;
    return {
      minFNumber: fixed,
      maxFNumber: fixed,
      isManuallyAdjustable: false,
      dofSimulatorEnabled: false,
      portraitModeEnabled: profile.supportsPortraitMode,
      fixedFNumber: fixed,
    };
  }

  // ── 4. Depth of Field ─────────────────────────────────────────────────────

  static computeDoF(
    profile: HardwareProfile,
    focalMm: number,
    aperture: number,
    subjectDistanceM: number
  ): DepthOfFieldResult {
    const coc = COC_BY_SENSOR[profile.sensorSize] ?? 0.02;
    const f = focalMm / 1000; // metres
    const A = aperture;
    const D = subjectDistanceM;

    // Hyperfocal distance: H = f² / (A × CoC)
    const H = (f * f) / (A * (coc / 1000));

    // Near limit: Dn = (H × D) / (H + D - f)
    const Dn = (H * D) / (H + D - f);

    // Far limit: Df = (H × D) / (H - D + f) — if D > H, it's ∞
    const Df = D < H ? (H * D) / (H - D + f) : Infinity;

    const depth = Df === Infinity ? Infinity : Df - Dn;

    return {
      nearLimitM: Math.max(0, Dn),
      farLimitM: Df,
      depthM: depth,
      hyperfocalM: H,
      summary:
        depth === Infinity
          ? `Todo desde ${Dn.toFixed(1)}m hasta ∞ en foco`
          : `${Dn.toFixed(1)}m – ${Df.toFixed(1)}m (${depth.toFixed(1)}m de profundidad)`,
    };
  }

  // ── 5. Full Snapshot ──────────────────────────────────────────────────────

  static snapshot(
    profile: HardwareProfile,
    options?: { focalOverride?: number; subjectDistanceM?: number }
  ): PhysicsSnapshot {
    const equivalence = this.computeEquivalence(profile, options?.focalOverride);
    const reciprocity = this.computeReciprocity(profile, equivalence.equivalentFocalMm);
    const aperture = this.computeApertureCapabilities(profile);

    let dof: DepthOfFieldResult | undefined;
    if (aperture.dofSimulatorEnabled && options?.subjectDistanceM) {
      dof = this.computeDoF(
        profile,
        equivalence.realFocalMm,
        aperture.minFNumber,
        options.subjectDistanceM
      );
    }

    const isOptical = isOpticalCamera(profile);
    return {
      equivalence,
      reciprocity,
      aperture,
      dof,
      mode: isOptical ? "Óptico" : "Computacional",
      themeAccent: isOptical ? "blue" : "purple",
    };
  }
}
