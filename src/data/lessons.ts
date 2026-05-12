import type { Lesson } from "@/types/curriculum";

export const LESSONS: Lesson[] = [
  {
    id: "L1",
    slug: "triangulo-de-exposicion",
    title: "Triángulo de Exposición",
    subtitle: "Domina la tríada: ISO, Apertura, Velocidad",
    level: "Básico",
    camera: "both",
    estimatedMinutes: 20,
    tags: ["exposición", "ISO", "apertura", "velocidad"],
    exifTargets: {
      isoMin: 100,
      isoMax: 800,
      apertureMin: 1.8,
      apertureMax: 8,
      shutterSpeedMin: "1/500",
      shutterSpeedMax: "1/30",
    },
    theory: {
      headline: "EL TRIÁNGULO",
      body: "Dominar la Sony a6000 significa salir del modo AUTO para siempre.",
      sections: [
        {
          icon: "🔆",
          title: "Apertura (f/)",
          content:
            "Controla la profundidad de campo. f/1.8 = fondo borroso (bokeh). f/11 = todo nítido (paisajes).",
          highlight: "Kit lens a6000: f/3.5 (16mm) → f/5.6 (50mm)",
        },
        {
          icon: "⚡",
          title: "Velocidad de Obturación",
          content:
            "Congela el movimiento con velocidades rápidas (1/1000+) o crea barrido con lentas (1/30-).",
          highlight: "Regla: velocidad ≥ 1/focal. A 50mm → mín 1/80s",
        },
        {
          icon: "🌡️",
          title: "ISO",
          content:
            "Sensibilidad al sensor. ISO 100 = imagen limpia. ISO 6400 = ruido digital visible en la a6000.",
          highlight: "Sweet spot a6000: ISO 100-1600 para calidad óptima",
        },
      ],
    },
    practiceExercise:
      "Toma 9 fotos del mismo objeto: 3 cambiando solo ISO (100/800/3200), 3 cambiando solo apertura (f/3.5/f/8/f/16), 3 cambiando solo velocidad (1/500/1/60/1s).",
  },
  {
    id: "L2",
    slug: "punto-dulce-optica",
    title: "Punto Dulce y Óptica",
    subtitle: "Extrae la máxima nitidez del lente kit 16-50mm",
    level: "Intermedio",
    camera: "sony",
    estimatedMinutes: 30,
    tags: ["nitidez", "lente", "focal", "aberración"],
    exifTargets: {
      isoMin: 100,
      isoMax: 400,
      apertureMin: 6,
      apertureMax: 11,
      focalLengthMin: 20,
      focalLengthMax: 35,
    },
    theory: {
      headline: "PUNTO DULCE",
      body: "Tu lente de kit no rinde igual en todo su rango focal.",
      sections: [
        {
          icon: "🎯",
          title: "Sweet Spot",
          content:
            "En 24mm y f/8 obtendrás la máxima nitidez. Evita los extremos del rango para trabajo crítico.",
          highlight: "Fórmula ganadora: 24mm · f/8 · ISO 100",
        },
        {
          icon: "🔴",
          title: "Aberración Cromática",
          content:
            "A 50mm f/5.6 verás franjas de color en bordes de alto contraste. Corrige en Lightroom > Correcciones de lente.",
          highlight: "Activa 'Eliminar aberración cromática' siempre",
        },
        {
          icon: "🌑",
          title: "Viñeteo",
          content:
            "A 16mm a apertura máxima notarás oscurecimiento en esquinas. Cierra a f/8 o corrige en post.",
          highlight: "Lightroom: +40 en cantidad de viñeteo de lente",
        },
      ],
    },
    practiceExercise:
      "Fotografía una pared con texto a distintos focales (16/24/35/50mm) y aperturas (f/4/f/8/f/11). Zoom al 100% y compara la nitidez.",
  },
  {
    id: "L3",
    slug: "narrativa-visual-raw",
    title: "Narrativa Visual RAW",
    subtitle: "Del sensor al arte: workflow .ARW profesional",
    level: "Avanzado",
    camera: "sony",
    estimatedMinutes: 45,
    tags: ["RAW", "ARW", "Lightroom", "postproceso", "histograma"],
    exifTargets: {
      isoMin: 100,
      isoMax: 1600,
    },
    theory: {
      headline: "NARRATIVA RAW",
      body: "Un archivo RAW no es una foto, es DATA cruda del sensor.",
      sections: [
        {
          icon: "💾",
          title: "Formato .ARW",
          content:
            "Sony usa el formato .ARW (Alpha RAW). Contiene 12-14 bits de información por canal, vs 8 bits del JPG.",
          highlight: "Diferencia: RAW = 16,000 tonos. JPG = 256 tonos.",
        },
        {
          icon: "📊",
          title: "Exponer para las Luces",
          content:
            'Técnica "ETTR" (Expose To The Right): lleva el histograma a la derecha sin quemar. Recuperarás sombras fácilmente en post.',
          highlight: "Si quemas las altas luces, esa información se pierde para siempre",
        },
        {
          icon: "🎨",
          title: "Workflow Lightroom",
          content:
            "Paso 1: Luces -60, Sombras +40. Paso 2: Curva en S suave. Paso 3: Clarity +15 para texturas.",
          highlight: "Nunca edites el JPG in-camera. Siempre RAW → Lightroom",
        },
      ],
    },
    practiceExercise:
      "Busca una escena con alto contraste (interior oscuro con ventana brillante). Dispara en RAW+JPG. Compara lo que puedes recuperar en cada formato.",
  },
  {
    id: "L4",
    slug: "composicion-avanzada",
    title: "Composición & Encuadre",
    subtitle: "Regla de tercios, líneas guía y espacio negativo",
    level: "Intermedio",
    camera: "both",
    estimatedMinutes: 25,
    tags: ["composición", "regla de tercios", "líneas", "encuadre"],
    exifTargets: {},
    theory: {
      headline: "COMPOSICIÓN",
      body: "La composición convierte una foto en una historia.",
      sections: [
        {
          icon: "🔲",
          title: "Regla de Tercios",
          content:
            "Divide el encuadre en 9 partes iguales (cuadrícula 3x3). Coloca tu sujeto en los puntos de intersección, no en el centro.",
          highlight: "S24 Ultra: Activa cuadrícula en Ajustes → Guías de composición",
        },
        {
          icon: "📏",
          title: "Líneas Guía",
          content:
            "Las líneas llevan el ojo del espectador hacia tu sujeto. Busca: calles, vallas, ríos, sombras, cableado eléctrico.",
          highlight: "Líneas convergentes crean sensación de profundidad",
        },
        {
          icon: "⬛",
          title: "Espacio Negativo",
          content:
            "El vacío tiene poder. Un sujeto pequeño rodeado de espacio negativo genera impacto visual y dramatismo.",
          highlight: "El cielo, paredes lisas y agua son espacio negativo perfecto",
        },
      ],
    },
    practiceExercise:
      "En tu próxima salida, toma cada escena 3 veces: sujeto centrado, en intersección de tercios, y con 80% espacio negativo. Compara el impacto.",
  },
  {
    id: "L5",
    slug: "luz-y-hora-dorada",
    title: "La Luz: Tu Herramienta Principal",
    subtitle: "Hora dorada, hora azul y luz artificial en GDL",
    level: "Avanzado",
    camera: "both",
    estimatedMinutes: 35,
    tags: ["luz", "hora dorada", "hora azul", "temperatura de color"],
    exifTargets: {
      isoMin: 200,
      isoMax: 3200,
    },
    theory: {
      headline: "LA LUZ",
      body: "La fotografía es literalmente 'escribir con luz'.",
      sections: [
        {
          icon: "🌅",
          title: "Hora Dorada",
          content:
            "60 min después del amanecer y 60 min antes del atardecer. Luz cálida, lateral y suave. En GDL: busca el Cerro del Cuatro o Parque Metropolitano.",
          highlight: "Temperatura de color: 3000-4000K. WB en 'Nublado' para potenciar",
        },
        {
          icon: "🌆",
          title: "Hora Azul",
          content:
            "15-20 min antes del amanecer y después del atardecer. Cielo con balance perfecto entre luz natural y artificial.",
          highlight: "El mejor momento para fotografía urbana nocturna",
        },
        {
          icon: "💡",
          title: "Luz Artificial GDL",
          content:
            "El Centro Histórico y Av. Chapultepec tienen iluminación mixta (naranja + LED). Usa WB personalizado en 3200K.",
          highlight: "S24 Ultra: Modo Experto → WB manual para consistencia",
        },
      ],
    },
    practiceExercise:
      "Planifica una sesión al atardecer en los Arcos de Zapopan. Llega 30 min antes del atardecer. Dispara durante hora dorada y azul. Compara los resultados.",
  },
];

export const getLessonById = (id: string): Lesson | undefined =>
  LESSONS.find((l) => l.id === id);

export const getLessonBySlug = (slug: string): Lesson | undefined =>
  LESSONS.find((l) => l.slug === slug);
