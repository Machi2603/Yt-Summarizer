import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const summaries = await prisma.summary.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      videoTitle: true,
      videoUrl: true,
      minutes: true,
      content: true,
      createdAt: true,
    },
  });

  return NextResponse.json(summaries);
}
