import type { HardwareProfile, OpticalCamera, SmartDevice, Lens, EquipmentKit } from "@/types/hardware";

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT HARDWARE PROFILES — Built-in gear definitions
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Lenses ───────────────────────────────────────────────────────────────────

export const SONY_KIT_LENS: Lens = {
  kind: "Zoom",
  id: "lens-sony-16-50",
  brand: "Sony",
  name: "E PZ 16-50mm f/3.5-5.6 OSS",
  focalLengthMinMm: 16,
  focalLengthMaxMm: 50,
  maxApertureWide: 3.5,
  maxApertureTele: 5.6,
  stabilization: "OIS",
  mountType: "Sony-E",
};

export const SONY_50MM_F18: Lens = {
  kind: "Prime",
  id: "lens-sony-50-f18",
  brand: "Sony",
  name: "E 50mm f/1.8 OSS",
  focalLengthMm: 50,
  maxAperture: 1.8,
  minAperture: 22,
  stabilization: "OIS",
  mountType: "Sony-E",
};

export const SONY_55_210: Lens = {
  kind: "Zoom",
  id: "lens-sony-55-210",
  brand: "Sony",
  name: "E 55-210mm f/4.5-6.3 OSS",
  focalLengthMinMm: 55,
  focalLengthMaxMm: 210,
  maxApertureWide: 4.5,
  maxApertureTele: 6.3,
  stabilization: "OIS",
  mountType: "Sony-E",
};

// ─── OpticalCamera Profiles ───────────────────────────────────────────────────

export const SONY_A6000_PROFILE: OpticalCamera = {
  kind: "OpticalCamera",
  id: "hw-sony-a6000",
  brand: "Sony",
  model: "α6000",
  sensorSize: "APS-C",
  cropFactor: 1.5,
  mountType: "Sony-E",
  mechanicalShutterMaxSec: 1 / 4000,
  electronicShutterMaxSec: undefined, // no e-shutter on a6000
  bodyStabilization: "None", // no IBIS — relies on OIS in lens
  isoMin: 100,
  isoMax: 25600,
  lenses: [SONY_KIT_LENS, SONY_50MM_F18, SONY_55_210],
  activeLensId: SONY_KIT_LENS.id,
  isComputational: false,
};

// ─── SmartDevice Profiles ─────────────────────────────────────────────────────

export const SAMSUNG_S24_ULTRA_PROFILE: SmartDevice = {
  kind: "SmartDevice",
  id: "hw-samsung-s24-ultra",
  brand: "Samsung",
  model: "Galaxy S24 Ultra",
  sensorSize: "Smartphone",
  sensorArray: [
    {
      id: "s24u-ultra-wide",
      name: "Ultra-Wide 0.6×",
      focalLengthReal: 2.4,
      focalLengthEquivalent: 13,
      aperture: 2.2,
      zoomMultiplier: 0.6,
      stabilization: "OIS",
      megapixels: 12,
      supportsNightMode: true,
    },
    {
      id: "s24u-main",
      name: "Principal 1×",
      focalLengthReal: 6.4,
      focalLengthEquivalent: 24,
      aperture: 1.7,
      zoomMultiplier: 1,
      stabilization: "OIS",
      megapixels: 200,
      supportsNightMode: true,
    },
    {
      id: "s24u-tele-3x",
      name: "Telefoto 3×",
      focalLengthReal: 10.0,
      focalLengthEquivalent: 70,
      aperture: 2.4,
      zoomMultiplier: 3,
      stabilization: "OIS",
      megapixels: 10,
      supportsNightMode: true,
    },
    {
      id: "s24u-tele-10x",
      name: "Telefoto 10×",
      focalLengthReal: 16.2,
      focalLengthEquivalent: 230,
      aperture: 3.4,
      zoomMultiplier: 10,
      stabilization: "OIS",
      megapixels: 50,
      supportsNightMode: false,
    },
  ],
  activeLensId: "s24u-main",
  isComputational: true,
  supportsPortraitMode: true,
  supportsNightography: true,
  supportsAstroMode: true,
};

// Generic profiles for user-added devices
export const IPHONE_15_PRO_PROFILE: SmartDevice = {
  kind: "SmartDevice",
  id: "hw-iphone-15-pro",
  brand: "Apple",
  model: "iPhone 15 Pro",
  sensorSize: "Smartphone",
  sensorArray: [
    {
      id: "ip15p-ultra",
      name: "Ultra-Wide 0.5×",
      focalLengthReal: 2.22,
      focalLengthEquivalent: 13,
      aperture: 2.2,
      zoomMultiplier: 0.5,
      stabilization: "OIS",
      megapixels: 12,
      supportsNightMode: true,
    },
    {
      id: "ip15p-main",
      name: "Principal 1×",
      focalLengthReal: 6.86,
      focalLengthEquivalent: 24,
      aperture: 1.78,
      zoomMultiplier: 1,
      stabilization: "OIS",
      megapixels: 48,
      supportsNightMode: true,
    },
    {
      id: "ip15p-tele-3x",
      name: "Telefoto 3×",
      focalLengthReal: 9.0,
      focalLengthEquivalent: 77,
      aperture: 2.8,
      zoomMultiplier: 3,
      stabilization: "OIS",
      megapixels: 12,
      supportsNightMode: true,
    },
  ],
  activeLensId: "ip15p-main",
  isComputational: true,
  supportsPortraitMode: true,
  supportsNightography: true,
  supportsAstroMode: false,
};

// ─── All built-in profiles ────────────────────────────────────────────────────

export const BUILTIN_PROFILES: HardwareProfile[] = [
  SONY_A6000_PROFILE,
  SAMSUNG_S24_ULTRA_PROFILE,
  IPHONE_15_PRO_PROFILE,
];

// ─── Default Equipment Kits ───────────────────────────────────────────────────

export const DEFAULT_KITS: EquipmentKit[] = [
  {
    id: "kit-travel",
    name: "Kit de Viaje",
    emoji: "✈️",
    description: "Sony α6000 + 16-50mm",
    profileId: SONY_A6000_PROFILE.id,
    useCase: "Viajes, turismo, todo-en-uno",
    createdAt: new Date().toISOString(),
  },
  {
    id: "kit-portrait",
    name: "Kit Retrato",
    emoji: "🎭",
    description: "Sony α6000 + 50mm f/1.8",
    profileId: SONY_A6000_PROFILE.id,
    useCase: "Retratos, bokeh, eventos",
    createdAt: new Date().toISOString(),
  },
  {
    id: "kit-mobile",
    name: "Kit Ligero",
    emoji: "📱",
    description: "Samsung S24 Ultra",
    profileId: SAMSUNG_S24_ULTRA_PROFILE.id,
    useCase: "Siempre encima, rapidez, versatilidad",
    createdAt: new Date().toISOString(),
  },
];
