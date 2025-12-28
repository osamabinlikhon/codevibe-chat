import { createOpenAI } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { z } from "zod";
import { AI_MODEL } from "@/lib/constants";

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

export const codeBlockSchema = z.object({
  code: z.string().describe("The generated code"),
  language: z.string().describe("The programming language of the generated code"),
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const result = await streamObject({
      model: groq(AI_MODEL),
      schema: codeBlockSchema,
      prompt: prompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "An error occurred during processing",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
