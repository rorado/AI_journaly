import { chain, TextAnalysisSchema } from "@/utils/ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    // 1. Get raw AI output
    const rawResult = await chain.invoke({ text });

    // 2. Validate with Zod (IMPORTANT)
    const analysis: z.infer<typeof TextAnalysisSchema> =
      TextAnalysisSchema.parse(rawResult);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 }
    );
  }
}
