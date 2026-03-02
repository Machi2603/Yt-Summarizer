import { YoutubeTranscript } from "youtube-transcript";

export interface TranscriptResult {
  text: string;
  videoId: string;
}

export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export async function getTranscript(url: string): Promise<TranscriptResult> {
  const videoId = extractVideoId(url);
  if (!videoId) {
    throw new Error("URL de YouTube inválida");
  }

  const transcript = await YoutubeTranscript.fetchTranscript(videoId);

  if (!transcript || transcript.length === 0) {
    throw new Error("No se pudo obtener el transcript del video. Verifica que el video tenga subtítulos disponibles.");
  }

  const text = transcript.map((item) => item.text).join(" ");

  return { text, videoId };
}

export async function getVideoTitle(videoId: string): Promise<string> {
  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );
    if (response.ok) {
      const data = await response.json();
      return data.title || "Video sin título";
    }
  } catch {
    // fallback
  }
  return "Video sin título";
}
