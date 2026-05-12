import type { ExifTargets, ParsedExifData, ExifFeedbackResult, ExifCheck } from "@/types/curriculum";
import type { HardwareProfile } from "@/types/hardware";
import { ContentEngine } from "@/lib/contentEngine";

// ─── EXIF Parsing Service ─────────────────────────────────────────────────────

export class ExifParserService {
  /**
   * Parse EXIF data from a File object using the exifr library.
   * Runs entirely client-side — no upload, no server.
   */
  static async parse(file: File): Promise<ParsedExifData> {
    // Dynamic import — exifr is client-only
    const exifr = (await import("exifr")).default;

    const raw = await exifr.parse(file, {
      pick: [
        "Make",
        "Model",
        "ISO",
        "FNumber",
        "ExposureTime",
        "FocalLength",
        "FocalLengthIn35mmFormat",
        "DateTimeOriginal",
        "ExposureMode",
        "WhiteBalance",
        "Flash",
        "GPSLatitude",
        "GPSLongitude",
      ],
    });

    if (!raw) throw new Error("No se encontraron datos EXIF en esta imagen.");

    const shutterSpeed = raw.ExposureTime
      ? ExifParserService.formatShutterSpeed(raw.ExposureTime)
      : undefined;

    return {
      make: raw.Make,
      model: raw.Model,
      iso: raw.ISO,
      aperture: raw.FNumber,
      shutterSpeed,
      focalLength: raw.FocalLength,
      focalLengthIn35mm: raw.FocalLengthIn35mmFormat,
      dateTimeOriginal: raw.DateTimeOriginal?.toISOString(),
      exposureMode: ExifParserService.formatExposureMode(raw.ExposureMode),
      whiteBalance: ExifParserService.formatWhiteBalance(raw.WhiteBalance),
      flash: raw.Flash?.toString(),
      gps:
        raw.GPSLatitude && raw.GPSLongitude
          ? { lat: raw.GPSLatitude, lng: raw.GPSLongitude }
          : undefined,
    };
  }

  private static formatShutterSpeed(seconds: number): string {
    if (seconds >= 1) return `${seconds}s`;
    const denom = Math.round(1 / seconds);
    return `1/${denom}`;
  }

  private static formatExposureMode(mode?: number): string | undefined {
    const modes: Record<number, string> = {
      0: "Auto",
      1: "Manual",
      2: "Auto Bracket",
    };
    return mode !== undefined ? modes[mode] : undefined;
  }

  private static formatWhiteBalance(wb?: number): string | undefined {
    return wb === 0 ? "Auto" : wb === 1 ? "Manual" : undefined;
  }
}

// ─── EXIF Feedback Analyzer ───────────────────────────────────────────────────

export class ExifFeedbackAnalyzer {
  /**
   * Compare parsed EXIF data against lesson targets and return structured feedback.
   */
  /**
   * Analyze EXIF data against lesson targets.
   * Pass an optional HardwareProfile to get hardware-specific feedback context.
   */
  static analyze(
    exif: ParsedExifData,
    targets: ExifTargets,
    profile?: HardwareProfile
  ): ExifFeedbackResult {
    const checks: ExifCheck[] = [];

    // ISO check
    if (targets.isoMin !== undefined || targets.isoMax !== undefined) {
      const isoValue = exif.iso ?? 0;
      const min = targets.isoMin ?? 0;
      const max = targets.isoMax ?? Infinity;
      const passed = isoValue >= min && isoValue <= max;
      checks.push({
        label: "ISO",
        value: isoValue ? `ISO ${isoValue}` : "No detectado",
        target: `ISO ${min}–${max === Infinity ? "∞" : max}`,
        passed,
      });
    }

    // Aperture check
    if (targets.apertureMin !== undefined || targets.apertureMax !== undefined) {
      const apValue = exif.aperture ?? 0;
      const min = targets.apertureMin ?? 0;
      const max = targets.apertureMax ?? Infinity;
      const passed = apValue >= min && apValue <= max;
      checks.push({
        label: "Apertura",
        value: apValue ? `f/${apValue}` : "No detectado",
        target: `f/${min}–f/${max === Infinity ? "∞" : max}`,
        passed,
      });
    }

    // Focal length check
    if (targets.focalLengthMin !== undefined || targets.focalLengthMax !== undefined) {
      const flValue = exif.focalLength ?? 0;
      const min = targets.focalLengthMin ?? 0;
      const max = targets.focalLengthMax ?? Infinity;
      const passed = flValue >= min && flValue <= max;
      checks.push({
        label: "Focal",
        value: flValue ? `${flValue}mm` : "No detectado",
        target: `${min}–${max === Infinity ? "∞" : max}mm`,
        passed,
      });
    }

    const passCount = checks.filter((c) => c.passed).length;
    const score = checks.length > 0 ? Math.round((passCount / checks.length) * 100) : 0;
    const grade =
      score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F";

    // Hardware-aware context enriches the summary
    const hwCtx = profile ? ContentEngine.getExifFeedbackContext(profile) : null;
    const summary = ExifFeedbackAnalyzer.buildSummary(grade, exif, hwCtx?.primaryFocus);

    return {
      score,
      grade,
      passed: score >= 70,
      checks,
      summary,
      hardwareTips: hwCtx?.tips ?? [],
      hardwareWarnings: hwCtx?.warnings ?? [],
    };
  }

  private static buildSummary(
    grade: string,
    exif: ParsedExifData,
    focus?: "ExposureTriangle" | "LensSelection" | "Computational"
  ): string {
    const camera = exif.model ?? "tu cámara";
    const baseMsg =
      grade === "A"
        ? `¡Perfecto! Los ajustes de ${camera} están alineados con los objetivos.`
        : grade === "B"
        ? `Muy bien. Pequeñas áreas de mejora pero la técnica está lograda.`
        : grade === "C"
        ? `Progreso visible. Revisa los parámetros marcados en rojo.`
        : `Hay trabajo por hacer. Regresa a la teoría y ajusta los parámetros.`;

    if (focus === "LensSelection") {
      return `${baseMsg} Para smartphones, prioriza la elección del lente correcto sobre los parámetros manuales.`;
    }
    if (focus === "ExposureTriangle") {
      return `${baseMsg} Enfócate en el triángulo de exposición: ISO, Apertura y Velocidad.`;
    }
    return baseMsg;
  }
}
