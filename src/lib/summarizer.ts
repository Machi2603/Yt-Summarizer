import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MODEL = "gpt-4.1-nano";
const MAX_TOKENS = 380_000; // leave buffer from 400K context

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function buildPrompt(transcript: string, videoTitle: string, minutes: number): string {
  const targetWords = minutes * 250;
  return `Eres un experto resumiendo contenido. Resume el siguiente transcript de un video de YouTube en aproximadamente ${targetWords} palabras (${minutes} minutos de lectura).

Estructura el resumen con:
- Título y tema principal
- Puntos clave organizados por secciones
- Conclusiones principales

Usa formato Markdown para mejor legibilidad.

Video: ${videoTitle}

Transcript:
${transcript}`;
}

function chunkText(text: string, maxChunkTokens: number): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let current: string[] = [];
  let currentTokens = 0;

  for (const word of words) {
    const wordTokens = estimateTokens(word + " ");
    if (currentTokens + wordTokens > maxChunkTokens && current.length > 0) {
      chunks.push(current.join(" "));
      current = [];
      currentTokens = 0;
    }
    current.push(word);
    currentTokens += wordTokens;
  }

  if (current.length > 0) {
    chunks.push(current.join(" "));
  }

  return chunks;
}

async function summarizeChunk(chunk: string, index: number, total: number): Promise<string> {
  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: "Eres un experto resumiendo contenido. Extrae los puntos clave del siguiente fragmento de transcript.",
      },
      {
        role: "user",
        content: `Fragmento ${index + 1} de ${total}:\n\n${chunk}`,
      },
    ],
    temperature: 0.3,
  });

  return response.choices[0]?.message?.content || "";
}

export async function summarize(
  transcript: string,
  videoTitle: string,
  minutes: number
): Promise<string> {
  const promptTokens = estimateTokens(buildPrompt(transcript, videoTitle, minutes));

  if (promptTokens < MAX_TOKENS) {
    // Single call - fits in context
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "user",
          content: buildPrompt(transcript, videoTitle, minutes),
        },
      ],
      temperature: 0.3,
    });

    return response.choices[0]?.message?.content || "No se pudo generar el resumen.";
  }

  // Map-reduce for very long transcripts
  const chunkSize = Math.floor(MAX_TOKENS * 0.7);
  const chunks = chunkText(transcript, chunkSize);

  const chunkSummaries = await Promise.all(
    chunks.map((chunk, i) => summarizeChunk(chunk, i, chunks.length))
  );

  const combined = chunkSummaries.join("\n\n---\n\n");
  const targetWords = minutes * 250;

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "user",
        content: `Eres un experto resumiendo contenido. Combina los siguientes resúmenes parciales en un resumen cohesivo de aproximadamente ${targetWords} palabras (${minutes} minutos de lectura).

Estructura el resumen con:
- Título y tema principal
- Puntos clave organizados por secciones
- Conclusiones principales

Usa formato Markdown.

Video: ${videoTitle}

Resúmenes parciales:
${combined}`,
      },
    ],
    temperature: 0.3,
  });

  return response.choices[0]?.message?.content || "No se pudo generar el resumen.";
}
