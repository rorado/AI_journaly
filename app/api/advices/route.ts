import { adviceChain } from "@/utils/ai";
import { getUserByClerckID } from "@/utils/auth";
import { prisma } from "@/utils/db";

export async function GET(req: Request) {
  try {
    const userId = await getUserByClerckID();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const lastentry = await prisma.journal.findMany({
      where: { userId: userId.id },
      orderBy: { createdAt: "desc" },
      take: 2,
      include: { analysis: true },
    });

    if (!lastentry.length) {
      return new Response("No journal entry found", { status: 404 });
    }

    const contents = lastentry.map((entry) => entry.content).join("\n---\n");

    let analysis;
    try {
      analysis = await adviceChain.invoke({ JournaliesEntry: contents });
    } catch (err: any) {
      console.error("Error generating advice:", err);
      return new Response(
        "Could not generate advice at this time. Try again later.",
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(JSON.stringify({ advice: analysis.advice }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
