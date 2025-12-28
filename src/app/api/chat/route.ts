import { createOpenAI } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { getSandbox } from "@/lib/e2b";
import { AI_MODEL } from "@/lib/constants";
import { z } from "zod";

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  try {
    const result = await streamText({
      model: groq(AI_MODEL),
      messages,
      tools: {
        execute_python: tool({
          description:
            "Execute Python code in a secure sandbox environment. Use this for calculations, data analysis, visualizations, or any code that needs to be run.",
          parameters: z.object({
            code: z.string().describe("The Python code to execute"),
          }),
          execute: async ({ code }) => {
            try {
              const sandbox = await getSandbox();

              const execution = await sandbox.runCode(code);

              let output = "";
              let error = "";

              if (execution.logs.stdout && execution.logs.stdout.length > 0) {
                output = execution.logs.stdout.join("\n");
              }

              if (execution.logs.stderr && execution.logs.stderr.length > 0) {
                error = execution.logs.stderr.join("\n");
              }

              if (execution.error) {
                error = String(execution.error);
              }

              return {
                code,
                stdout: output,
                stderr: error,
                success: !execution.error,
              };
            } catch (error) {
              console.error("E2B Execution Error:", error);
              return {
                code,
                stdout: "",
                stderr:
                  error instanceof Error
                    ? error.message
                    : "Unknown execution error",
                success: false,
              };
            }
          },
        }),
      },
    });

    return result.toDataStreamResponse();
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
