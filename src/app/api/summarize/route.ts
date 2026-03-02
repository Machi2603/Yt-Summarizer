import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getTranscript, getVideoTitle, extractVideoId } from "@/lib/transcript";
import { summarize } from "@/lib/summarizer";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { url, minutes } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL es requerida" }, { status: 400 });
    }

    if (![5, 10, 15].includes(minutes)) {
      return NextResponse.json(
        { error: "Los minutos deben ser 5, 10 o 15" },
        { status: 400 }
      );
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json(
        { error: "URL de YouTube inválida" },
        { status: 400 }
      );
    }

    // Get transcript and title in parallel
    const [transcriptResult, videoTitle] = await Promise.all([
      getTranscript(url),
      getVideoTitle(videoId),
    ]);

    // Generate summary
    const content = await summarize(transcriptResult.text, videoTitle, minutes);

    // Save to database
    const summary = await prisma.summary.create({
      data: {
        userId: session.userId,
        videoUrl: url,
        videoTitle,
        minutes,
        content,
      },
    });

    return NextResponse.json({
      id: summary.id,
      videoTitle,
      minutes,
      content,
      createdAt: summary.createdAt,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error del servidor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
