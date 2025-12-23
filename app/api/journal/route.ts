import { getUserByClerckID } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

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

  const { title, content } = body as { title: string; content: string };

  if (!title || !content) {
    return NextResponse.json(
      { error: "Missing title or content" },
      { status: 400 }
    );
  }

  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const entry = await prisma.journal.create({
    data: {
      title,
      content,
      userId: userId.id,
    },
  });

  return NextResponse.json(
    { message: "Journal entry created", data: { entry } },
    { status: 201 }
  );
}

export async function GET() {
  const user = await getUserByClerckID();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const entries = await prisma.journal.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return NextResponse.json({ data: entries }, { status: 200 });
}
