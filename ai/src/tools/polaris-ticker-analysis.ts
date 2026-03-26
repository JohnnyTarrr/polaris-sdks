import { tool } from "ai";
import { z } from "zod";
import { polarisGet, type ToolOptions } from "./_fetch.js";

export const polarisTickerAnalysis = (options: ToolOptions = {}) =>
  tool({
    description:
      "Get a full analysis for a ticker symbol — includes sentiment breakdown, technical signals, news summary, and an overall outlook.",
    parameters: z.object({
      symbol: z
        .string()
        .describe("Ticker symbol to analyze (e.g. NVDA)"),
    }),
    execute: async ({ symbol }) => {
      const path = `/api/v1/ticker/${encodeURIComponent(symbol.toUpperCase())}/analysis`;
      return polarisGet(options, path);
    },
  });
