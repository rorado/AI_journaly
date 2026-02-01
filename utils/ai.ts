import { z } from "zod";
import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";

/* ----------------------------------
   1. Mood Definitions (Expandable)
---------------------------------- */

export const Moods = [
  "joyful",
  "content",
  "excited",
  "calm",
  "neutral",
  "confused",
  "anxious",
  "frustrated",
  "sad",
  "angry",
  "hopeless",
] as const;

export type Mood = (typeof Moods)[number];

export const MoodMeta = {
  joyful: { color: "#2ecc71", sticker: "😄" },
  content: { color: "#6ab04c", sticker: "🙂" },
  excited: { color: "#f9ca24", sticker: "🤩" },
  calm: { color: "#22a6b3", sticker: "😌" },
  neutral: { color: "#808080", sticker: "😐" },
  confused: { color: "#95afc0", sticker: "😕" },
  anxious: { color: "#f0932b", sticker: "😰" },
  frustrated: { color: "#eb4d4b", sticker: "😤" },
  sad: { color: "#686de0", sticker: "😢" },
  angry: { color: "#ff4757", sticker: "😡" },
  hopeless: { color: "#2f3640", sticker: "😞" },
} as const;

export const TextAnalysisSchema = z.object({
  title: z.string().min(1).max(100),
  mood: z.enum(Moods),
  subject: z.string().min(1),
  negative: z.boolean(),
  summary: z.string().min(1),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  sticker: z.string().min(1).max(2),
  advice: z.string().min(1),
  sentimentScore: z.number().min(-10).max(10),
});

const llm = new ChatGroq({
  model: "llama-3.1-8b-instant",
  temperature: 0.1,
  apiKey: process.env.GROQ_API_KEY!,
});

const parser = new JsonOutputParser();

const prompt = ChatPromptTemplate.fromTemplate(`
You are an emotion and sentiment analyzer for personal journal entries.

Return ONLY valid JSON.
No markdown. No explanations.

Output format:
{{
  "title": string (add a short, catchy title),
  "mood": one of [${Moods.join(", ")}],
  "subject": string,
  "negative": boolean,
  "summary": string,
  "color": string,
  "sticker": string,
  "advice": string (supportive advice message),
  "sentimentScore": int (number between -10 and 10)
}}

Rules:
- Choose ONE dominant mood.
- Mood describes emotion, not topic.
- sentimentScore meaning:
  very negative: -7 to -10
  negative: -3 to -6
  neutral: -2 to 2
  positive: 3 to 6
  very positive: 7 to 10
- negative = true if sentimentScore < 0
- color and sticker MUST match mood exactly:

${Object.entries(MoodMeta)
  .map(([m, v]) => `- ${m}: color ${v.color}, sticker ${v.sticker}`)
  .join("\n")}

Journal Entry:
{text}
`);

export const chain = prompt.pipe(llm).pipe(parser);

export type TextAnalysis = z.infer<typeof TextAnalysisSchema>;

const AdviceSchema = z.object({
  advice: z.string().min(1),
});

export type AdviceOutput = z.infer<typeof AdviceSchema>;

const advicePrompt = ChatPromptTemplate.fromTemplate(`

Guidance should focus on self-improvement, emotional well-being, and practical steps to enhance personal growth.

Contextual Journal Entries:
Return ONLY valid JSON.
No markdown. No explanations.

Output format:
{{
  "advice": string (a detailed, supportive article-style guidance)
}}

Journal Entries:
{JournaliesEntry}
`);

export const adviceChain = advicePrompt.pipe(llm).pipe(parser);
