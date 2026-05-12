import type { HardwareProfile, OpticalCamera, SmartDevice } from "@/types/hardware";
import { isOpticalCamera, isSmartDevice, getActiveLens, getActiveSmartLens } from "@/types/hardware";
import type { Challenge } from "@/types/curriculum";
import { CHALLENGES } from "@/data/challenges";

// ═══════════════════════════════════════════════════════════════════════════════
// CONTENT ENGINE — Hardware-Aware Lesson & Challenge Routing
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Hardware-Specific Challenge Overrides ────────────────────────────────────

export interface HardwareChallenge {
  id: string;
  title: string;
  emoji: string;
  color: Challenge["color"];
  description: string;
  difficulty: Challenge["difficulty"];
  points: number;
  timeEstimate: string;
  // Why this challenge was activated for this hardware
  activationReason: string;
  hardwareTag: "OpticalCamera" | "SmartDevice" | "both";
}

/** Dynamic challenges that are unlocked based on the active hardware profile */
const HARDWARE_CHALLENGES: HardwareChallenge[] = [
  // ─── OpticalCamera challenges ──────────────────────────────────────────
  {
    id: "HC-TELE-STABILITY",
    title: "ESTABILIDAD DE TELEOBJETIVO",
    emoji: "🔭",
    color: "blue",
    description:
      "Con un lente ≥ 200mm equivalente activo, demuestra que dominas la regla de reciprocidad. Toma 10 fotos en mano y logra que mínimo 8 salgan nítidas.",
    difficulty: "Advanced",
    points: 300,
    timeEstimate: "2h",
    activationReason: "Focal larga detectada — la reciprocidad es crítica",
    hardwareTag: "OpticalCamera",
  },
  {
    id: "HC-DOF-CONTROL",
    title: "MAESTRO DEL BOKEH",
    emoji: "🌸",
    color: "purple",
    description:
      "Demuestra control de profundidad de campo. Toma la misma escena a f/1.8, f/5.6 y f/11. La diferencia de bokeh debe ser claramente visible.",
    difficulty: "Intermediate",
    points: 200,
    timeEstimate: "1h",
    activationReason: "Apertura variable disponible en tu lente",
    hardwareTag: "OpticalCamera",
  },
  {
    id: "HC-RAW-RECOVERY",
    title: "RECUPERACIÓN ARW",
    emoji: "💾",
    color: "amber",
    description:
      "Dispara en escena de alto contraste en RAW. Demuestra recuperación de 2+ stops en Lightroom comparando ARW vs JPG in-camera.",
    difficulty: "Advanced",
    points: 350,
    timeEstimate: "3h",
    activationReason: "Tu cámara óptica soporta formato RAW completo",
    hardwareTag: "OpticalCamera",
  },

  // ─── SmartDevice challenges ────────────────────────────────────────────
  {
    id: "HC-ULTRA-WIDE",
    title: "ULTRA WIDE PERSPECTIVE",
    emoji: "🌐",
    color: "emerald",
    description:
      "Usa el lente 0.6× para explorar perspectivas extremas. Busca 3 composiciones donde la distorsión del ultra-angular añada impacto visual en lugar de arruinarlo.",
    difficulty: "Intermediate",
    points: 200,
    timeEstimate: "1.5h",
    activationReason: "Lente ultra-gran-angular 0.6× disponible en tu dispositivo",
    hardwareTag: "SmartDevice",
  },
  {
    id: "HC-NIGHTOGRAPHY",
    title: "NIGHTOGRAPHY STACK",
    emoji: "🌙",
    color: "blue",
    description:
      "Activa el modo Noche en el lente principal 1× y el telefoto 3×. Compara cómo el stacking computacional maneja el ruido vs iluminación artificial.",
    difficulty: "Advanced",
    points: 300,
    timeEstimate: "2h",
    activationReason: "Tu dispositivo soporta Nightography multi-frame",
    hardwareTag: "SmartDevice",
  },
  {
    id: "HC-ZOOM-COMPARE",
    title: "THE ZOOM TEST",
    emoji: "🔍",
    color: "zinc",
    description:
      "Fotografía el mismo sujeto desde la misma posición usando los 4 lentes (0.6×, 1×, 3×, 10×). Analiza la perspectiva, compresión y calidad en cada focal.",
    difficulty: "Beginner",
    points: 150,
    timeEstimate: "45min",
    activationReason: "Array de lentes múltiples disponible",
    hardwareTag: "SmartDevice",
  },
  {
    id: "HC-PORTRAIT-AI",
    title: "RETRATO COMPUTACIONAL",
    emoji: "🎭",
    color: "purple",
    description:
      "Usa el modo Retrato con diferentes distancias focales (1× y 3×). Compara cómo cambia la perspectiva del rostro y la calidad del bokeh simulado.",
    difficulty: "Beginner",
    points: 100,
    timeEstimate: "1h",
    activationReason: "Modo Retrato / Portrait Mode disponible",
    hardwareTag: "SmartDevice",
  },
];

// ─── EXIF Feedback — Hardware-Aware ──────────────────────────────────────────

export interface HardwareExifFeedback {
  primaryFocus: "ExposureTriangle" | "LensSelection" | "Computational";
  contextLabel: string;
  tips: string[];
  warnings: string[];
}

// ─── Content Engine ───────────────────────────────────────────────────────────

export class ContentEngine {
  /**
   * Returns hardware-specific challenges unlocked for the current profile.
   * Includes base challenges filtered to match the hardware type, plus
   * dynamic hardware-specific challenges.
   */
  static getActiveChallenges(profile: HardwareProfile): {
    baseChallenges: Challenge[];
    hardwareChallenges: HardwareChallenge[];
  } {
    if (isOpticalCamera(profile)) {
      const lens = getActiveLens(profile);
      const equivalentFocal = lens
        ? (lens.kind === "Prime" ? lens.focalLengthMm : lens.focalLengthMaxMm) *
          profile.cropFactor
        : 0;

      const hardwareChallenges = HARDWARE_CHALLENGES.filter(
        (c) => c.hardwareTag === "OpticalCamera"
      ).filter((c) => {
        // Only unlock tele-stability challenge if focal ≥ 200mm equivalent
        if (c.id === "HC-TELE-STABILITY") return equivalentFocal >= 200;
        return true;
      });

      return { baseChallenges: CHALLENGES, hardwareChallenges };
    }

    // SmartDevice
    const device = profile as SmartDevice;
    const hardwareChallenges = HARDWARE_CHALLENGES.filter(
      (c) => c.hardwareTag === "SmartDevice"
    ).filter((c) => {
      if (c.id === "HC-NIGHTOGRAPHY") return device.supportsNightography;
      if (c.id === "HC-PORTRAIT-AI") return device.supportsPortraitMode;
      return true;
    });

    return { baseChallenges: CHALLENGES, hardwareChallenges };
  }

  /**
   * Generate hardware-aware EXIF feedback guidance.
   * Called by ExifFeedbackAnalyzer to provide contextual tips.
   */
  static getExifFeedbackContext(profile: HardwareProfile): HardwareExifFeedback {
    if (isOpticalCamera(profile)) {
      const lens = getActiveLens(profile);
      const lensName = lens ? lens.name : "lente desconocido";
      return {
        primaryFocus: "ExposureTriangle",
        contextLabel: `${profile.brand} ${profile.model} + ${lensName}`,
        tips: [
          "Revisa el triángulo de exposición: ISO, Apertura y Velocidad",
          `Con sensor ${profile.sensorSize} (crop ${profile.cropFactor}×), recuerda calcular la focal equivalente`,
          "Para mayor control, dispara en modo M (Manual) y usa RAW",
          "El histograma es tu mejor aliado — expón para las altas luces",
        ],
        warnings: [
          "Si el ISO supera 1600 en tu APS-C, el ruido será visible en las sombras",
          "Velocidad menor a la regla de reciprocidad causará trepidación",
        ],
      };
    }

    // SmartDevice
    const device = profile as SmartDevice;
    const activeLens = getActiveSmartLens(device);
    return {
      primaryFocus: "LensSelection",
      contextLabel: `${device.brand} ${device.model}`,
      tips: [
        `Lente activo: ${activeLens?.name ?? "desconocido"} (${activeLens?.zoomMultiplier}× — ${activeLens?.focalLengthEquivalent}mm equiv.)`,
        "Para retratos: usa 3× (75mm equiv.) para perspectiva más favorecedora",
        "Para paisajes: 0.6× ultra-wide o 1× principal dan mayor detalle",
        "Para zoom: el 10× óptico es mejor que el digital — evita el interpolado",
        "La apertura es fija — controla la exposición con el ISO y velocidad (Pro Mode)",
      ],
      warnings: [
        activeLens?.zoomMultiplier === 10
          ? "El zoom 10× requiere muy buena luz o uso de trípode"
          : "",
        "El bokeh del modo Retrato es simulado — la nitidez del sujeto es crítica",
      ].filter(Boolean),
    };
  }

  /**
   * Returns the UI mode descriptor for the dynamic dashboard.
   */
  static getModeDescriptor(profile: HardwareProfile) {
    if (isOpticalCamera(profile)) {
      return {
        mode: "Modo Óptico" as const,
        subtitle: `${profile.brand} ${profile.model} · ${profile.sensorSize}`,
        accent: "blue" as const,
        icon: "camera" as const,
        capabilities: [
          "Control Manual Completo",
          "RAW / ARW Nativo",
          "DoF Real Simulable",
          "Intercambio de Lentes",
        ],
      };
    }
    return {
      mode: "Modo Computacional" as const,
      subtitle: `${profile.brand} ${profile.model} · ${profile.sensorArray.length} lentes`,
      accent: "purple" as const,
      icon: "smartphone" as const,
      capabilities: [
        "Multi-Lens Array",
        "Bokeh IA (Portrait)",
        "Night Stacking",
        "Zoom Óptico/Hísbrido",
      ],
    };
  }
}
