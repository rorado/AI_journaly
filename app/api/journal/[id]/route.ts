import { getUserByClerckID } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
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

  console.log("Fetching journal entry with ID:", params);

  if (user.isAdmin) {
    entry = await prisma.journal.findUnique({
      where: { id: id },
    });
  } else {
    entry = await prisma.journal.findFirst({
      where: {
        id: id,
        userId: user.id,
      },
    });
  }

  if (!entry) {
    return NextResponse.json(
      { error: "Journal entry not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: entry }, { status: 200 });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
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
  const { content } = await req.json();

  let entry;
  if (user.isAdmin) {
    entry = await prisma.journal.updateMany({
      where: { id: id },
      data: { content: content },
    });
  } else {
    entry = await prisma.journal.updateMany({
      where: {
        id: id,
        userId: user.id,
      },
      data: { content: content },
    });
  }
  if (entry.count === 0) {
    return NextResponse.json(
      { error: "Journal entry not found or no permission to edit" },
      { status: 404 }
    );
  }
  return NextResponse.json(
    { data: "Journal entry updated successfully" },
    { status: 200 }
  );
}
