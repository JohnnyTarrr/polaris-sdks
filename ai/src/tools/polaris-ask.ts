import { tool } from "ai";
import { z } from "zod";
import { polarisPost, type ToolOptions } from "./_fetch.js";

export const polarisAsk = (options: ToolOptions = {}) =>
  tool({
    description:
      "Ask any question about markets, companies, economics, or geopolitics and get an AI-generated answer grounded in verified intelligence briefs. The most versatile tool in the Polaris toolkit.",
    parameters: z.object({
      question: z
        .string()
        .describe("The question to ask (e.g. 'What is driving NVIDIA stock price this week?')"),
    }),
    execute: async ({ question }) => {
      return polarisPost(options, "/api/v1/ask", { question });
    },
  });
