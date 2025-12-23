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
