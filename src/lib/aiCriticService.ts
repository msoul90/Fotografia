import type { AICriticRequest, AICriticResponse } from "@/types/curriculum";

// ─── AI Photography Critic Service ───────────────────────────────────────────
// Ready for real LLM integration. Currently returns mock analysis.
// To connect a real endpoint: set NEXT_PUBLIC_AI_ENDPOINT in .env.local

const AI_ENDPOINT = process.env.NEXT_PUBLIC_AI_ENDPOINT;

// Composition rule analysis (client-side heuristic mock)
function analyzeCompositionHeuristic(imageDataUrl: string): AICriticResponse {
  // In production: send to LLM vision endpoint
  // For now: deterministic mock based on image data length (simulate variety)
  const seed = imageDataUrl.length % 4;

  const responses: AICriticResponse[] = [
    {
      compositionScore: 82,
      technicalScore: 78,
      overallFeedback:
        "La imagen muestra una comprensión sólida de la regla de tercios. El sujeto está bien posicionado y el fondo tiene suficiente separación. Para la siguiente toma, experimenta con líneas de fuga que conduzcan hacia el sujeto.",
      strengths: [
        "Buen posicionamiento del sujeto en punto de interés",
        "Profundidad de campo apropiada para la narrativa",
        "Balance de tonos logrado",
      ],
      improvements: [
        "El horizonte tiene una ligera inclinación de ~2°",
        "El espacio de 'respiración' delante del sujeto podría ser mayor",
        "Considera reducir ISO para minimizar el grano visible",
      ],
      ruleSuggestions: ["Regla de tercios: ✓ aplicada", "Líneas de fuga: no exploradas", "Triángulos: oportunidad perdida en el fondo"],
    },
    {
      compositionScore: 65,
      technicalScore: 71,
      overallFeedback:
        "La exposición está bien controlada pero la composición necesita trabajo. El sujeto está centrado, lo que reduce el dinamismo. Prueba colocar el punto de interés en el tercio derecho o izquierdo.",
      strengths: [
        "Exposición bien controlada",
        "Nitidez técnica adecuada",
        "Buen control del ruido digital",
      ],
      improvements: [
        "Sujeto centrado: muévelo a un punto de intersección de tercios",
        "Demasiado espacio 'muerto' en la parte superior del frame",
        "Busca un elemento de primer plano para agregar profundidad",
      ],
      ruleSuggestions: ["Regla de tercios: ✗ sujeto centrado", "Profundidad: plana, un solo plano", "Encuadre natural: no utilizado"],
    },
    {
      compositionScore: 91,
      technicalScore: 88,
      overallFeedback:
        "Excelente trabajo. La composición demuestra dominio de múltiples técnicas simultáneamente. Las líneas del entorno guían naturalmente el ojo hacia el sujeto principal. La relación entre luz y sombra crea tensión visual efectiva.",
      strengths: [
        "Líneas de fuga perfectamente utilizadas",
        "Espacio negativo como elemento narrativo",
        "Balance de luz y sombra dramático",
        "Profundidad creada con planos múltiples",
      ],
      improvements: [
        "El procesado de color podría ser más intencional",
        "Un ligero crop mejoraría la proporción áurea",
      ],
      ruleSuggestions: ["Regla de tercios: ✓ dominada", "Líneas guía: ✓ efectivas", "Espacio negativo: ✓ poderoso"],
    },
    {
      compositionScore: 74,
      technicalScore: 60,
      overallFeedback:
        "La composición tiene potencial pero la técnica necesita ajustes. El ISO es demasiado alto para las condiciones de luz, generando ruido innecesario. La idea compositiva es buena: hay una historia que contar aquí.",
      strengths: [
        "Buena intuición compositiva",
        "Momento decisivo bien capturado",
        "El encuadre cuenta una historia",
      ],
      improvements: [
        "ISO muy alto: baja la velocidad o abre más la apertura",
        "El foco está ligeramente detrás del sujeto principal",
        "Limpia el encuadre de elementos distractores en los bordes",
      ],
      ruleSuggestions: ["Regla de tercios: ✓ intuitiva", "Técnica: necesita refinamiento", "Potencial: alto"],
    },
  ];

  return responses[seed];
}

// ─── Main Service ─────────────────────────────────────────────────────────────

export const AICriticService = {
  async analyze(request: AICriticRequest): Promise<AICriticResponse> {
    // Real LLM endpoint integration
    if (AI_ENDPOINT) {
      const response = await fetch(AI_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: request.imageDataUrl,
          lessonId: request.lessonId,
          prompt:
            "Analiza la composición de esta fotografía. Evalúa: regla de tercios, líneas de fuga, espacio negativo, profundidad de campo, balance de luz. Responde en español con feedback constructivo para un fotógrafo en aprendizaje.",
        }),
      });
      if (response.ok) {
        return response.json() as Promise<AICriticResponse>;
      }
    }

    // Fallback: client-side heuristic
    return analyzeCompositionHeuristic(request.imageDataUrl);
  },
};
