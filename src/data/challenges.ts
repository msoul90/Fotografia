import type { Challenge } from "@/types/curriculum";

export const CHALLENGES: Challenge[] = [
  {
    id: "C1",
    title: "CAZADOR PÚRPURA",
    emoji: "🔮",
    color: "purple",
    description:
      "Busca 3 objetos morados en Zapopan. Compara el archivo RAW (.ARW) de la Sony contra el procesamiento computacional del S24 Ultra.",
    linkedLessonId: "L1",
    difficulty: "Beginner",
    points: 100,
    timeEstimate: "2h",
    gear: ["Sony a6000", "S24 Ultra"],
    tips: [
      "Los mercados y tianguis tienen colores saturados ideales",
      "Dispara en RAW+JPG simultáneamente en la Sony",
      "En el S24: usa Expert RAW con histograma visible",
    ],
    criteria: [
      "ISO ≤ 800 en la Sony",
      "Balance de blancos consistente entre tomas",
      "Mínimo 1 foto con bokeh y 1 con todo nítido",
    ],
  },
  {
    id: "C2",
    title: "ESPACIO NEGATIVO",
    emoji: "🌓",
    color: "zinc",
    description:
      "Captura un sujeto que ocupe menos del 10% del encuadre. Usa sombras o cielo para crear el vacío que da poder a la imagen.",
    linkedLessonId: "L4",
    difficulty: "Intermediate",
    points: 150,
    timeEstimate: "1.5h",
    gear: ["Sony a6000 o S24 Ultra"],
    tips: [
      "El cielo despejado de GDL es tu mejor aliado",
      "Busca siluetas al contraluz durante hora dorada",
      "Los edificios modernos en Providencia tienen fachadas limpias",
    ],
    criteria: [
      "Sujeto < 10% del frame",
      "Sin ruido distractor en el espacio negativo",
      "Composición intencional (regla de tercios)",
    ],
  },
  {
    id: "C3",
    title: "HORA AZUL URBANA",
    emoji: "🌆",
    color: "blue",
    description:
      "Captura la Ciudad de Guadalajara durante la hora azul (15 min post-atardecer). La mezcla de luz artificial y cielo azul debe ser perfectamente balanceada.",
    linkedLessonId: "L5",
    difficulty: "Advanced",
    points: 250,
    timeEstimate: "3h",
    gear: ["Sony a6000", "Trípode"],
    tips: [
      "El Mirador de Zapopan tiene vista perfecta al poniente",
      "Usa trípode para velocidades lentas (1/4s - 2s)",
      "WB en 3200-4000K para balance cálido/frío ideal",
    ],
    criteria: [
      "Trípode obligatorio (velocidades < 1/30s)",
      "WB consistente entre 3000-4500K",
      "Cielo con color azul visible (no negro)",
      "Luces artificiales no quemadas",
    ],
  },
  {
    id: "C4",
    title: "RAW RECOVERY",
    emoji: "💾",
    color: "amber",
    description:
      "Encuentra una escena de alto contraste (interior con ventana iluminada). Dispara en RAW y demuestra la recuperación de luces y sombras en Lightroom.",
    linkedLessonId: "L3",
    difficulty: "Advanced",
    points: 300,
    timeEstimate: "4h",
    gear: ["Sony a6000", "Lightroom Mobile"],
    tips: [
      "Las cafeterías con luz de ventana son perfectas",
      "Expón para las altas luces (ETTR)",
      "En Lightroom: Luces -100, Sombras +80, ver diferencia",
    ],
    criteria: [
      "Shoot en .ARW (RAW Sony)",
      "Entregar SOOC (sin editar) y editado",
      "Recuperación visible de mínimo 2 stops de luces",
      "Sin ruido excesivo en las sombras recuperadas",
    ],
  },
  {
    id: "C5",
    title: "PUNTO DULCE TEST",
    emoji: "🎯",
    color: "emerald",
    description:
      "Documenta el sweet spot de tu lente 16-50mm con una prueba sistemática de nitidez. Crea tu propia guía de referencia personal.",
    linkedLessonId: "L2",
    difficulty: "Beginner",
    points: 200,
    timeEstimate: "1h",
    gear: ["Sony a6000", "Lente 16-50mm", "Trípode"],
    tips: [
      "Fotografía un periódico pegado en la pared",
      "Usa temporizador de 2s para evitar vibración",
      "Revisa al 100% en pantalla, no en miniatura",
    ],
    criteria: [
      "Serie completa: 16/24/35/50mm × f/4/f/8/f/11",
      "Trípode + temporizador en todas las tomas",
      "Análisis escrito de los resultados",
      "Identificar el sweet spot personal",
    ],
  },
];
