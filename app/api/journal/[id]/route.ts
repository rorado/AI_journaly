import { chain, TextAnalysisSchema } from "@/utils/ai";
import { getUserByClerckID } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { updateTag } from "next/cache";
import { NextResponse } from "next/server";
import z from "zod";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getUserByClerckID();
  const { id } = await params;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId.id },
  });

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let entry;

  if (user.isAdmin) {
    entry = await prisma.journal.findUnique({
      where: { id: id },
      include: { analysis: true },
    });
  } else {
    entry = await prisma.journal.findFirst({
      where: {
        id: id,
        userId: user.id,
      },
      include: { analysis: true },
    });
  }

  if (!entry) {
    return NextResponse.json(
      { error: "Journal entry not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ data: entry as typeof entry }, { status: 200 });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getUserByClerckID();
  const { id } = await params;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { id: userId.id },
  });
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { content } = await req.json();

  const rawResult = await chain.invoke({ text: content });

  const analysis: z.infer<typeof TextAnalysisSchema> =
    TextAnalysisSchema.parse(rawResult);
  let entry;
  if (user.isAdmin) {
    entry = await prisma.journal.update({
      where: { id },
      data: {
        title: analysis.title,
        content,
        analysis: {
          update: {
            mood: analysis.mood,
            summary: analysis.summary,
            negative: analysis.negative,
            color: analysis.color,
            sticker: analysis.sticker,
          },
        },
      },
    });
  } else if (user.clerkId == userId.clerkId) {
    entry = await prisma.journal.update({
      where: {
        id: id,
        userId: user.id,
      },
      data: {
        title: analysis.title,
        content,
        analysis: {
          update: {
            mood: analysis.mood,
            summary: analysis.summary,
            negative: analysis.negative,
            color: analysis.color,
            sticker: analysis.sticker,
          },
        },
      },
    });
  }
  if (!entry) {
    return NextResponse.json(
      { error: "Journal entry not found or no permission to edit" },
      { status: 404 },
    );
  }
  return NextResponse.json(
    { data: "Journal entry updated successfully" },
    { status: 200 },
  );
}
