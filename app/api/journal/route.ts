import { chain, TextAnalysisSchema } from "@/utils/ai";
import { getUserByClerckID } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";
import z from "zod";

export async function POST(request: Request) {
  const userId = await getUserByClerckID();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { content } = body as { content: string };

  if (!content) {
    return NextResponse.json({ error: "Missing content" }, { status: 400 });
  }

  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const rawResult = await chain.invoke({ text: content });

  const analysis: z.infer<typeof TextAnalysisSchema> =
    TextAnalysisSchema.parse(rawResult);

  const entry = await prisma.journal.create({
    data: {
      title: analysis.title,
      content,
      userId: userId.id,
      analysis: {
        create: {
          mood: analysis.mood,
          summary: analysis.summary,
          negative: analysis.negative,
          color: analysis.color,
          sticker: analysis.sticker,
        },
      },
    },
  });

  return NextResponse.json(
    { message: "Journal entry created", data: { entry } },
    { status: 201 },
  );
}

export async function GET() {
  const user = await getUserByClerckID();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const entries = await prisma.journal.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json({ data: entries }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch journal entries" },
      { status: 500 },
    );
  }
}
