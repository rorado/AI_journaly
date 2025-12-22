import { prisma } from "@/utils/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userId } = await auth();

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

  let user = await prisma.user.findUnique({ where: { clerkId: userId } });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const entry = await prisma.journal.create({
    data: {
      title,
      content,
      userId: user.id,
    },
  });

  return NextResponse.json(
    { message: "Journal entry created", data: { entry } },
    { status: 201 }
  );
}

export async function GET() {
  return NextResponse.json({
    message: "Journal API",
    hint: 'POST JSON with a "fo" field to create an entry.',
  });
}
